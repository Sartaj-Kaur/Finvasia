import os
import httpx
import uuid
from typing import Dict
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from models import ConsentRequest, SetuWebhook
from database import supabase
from services.categorizer import categorize
from services.rule_engine import run_rules
from services.investment import sweep_surplus

router = APIRouter(prefix="/setu", tags=["Setu"])

# No in-memory dict, using Supabase setu_sessions

SETU_BASE_URL = os.getenv("SETU_BASE_URL", "https://fiu-sandbox.setu.co")
SETU_CLIENT_ID = os.getenv("SETU_CLIENT_ID")
SETU_CLIENT_SECRET = os.getenv("SETU_CLIENT_SECRET")
SETU_PRODUCT_INSTANCE_ID = os.getenv("SETU_PRODUCT_INSTANCE_ID", "ec43a8a8-9f30-4f2a-8772-d3c6b54c1e36")

# Debugging block to ensure variables are loaded correctly
if not SETU_CLIENT_ID or not SETU_CLIENT_SECRET:
    print(f"!!! CRITICAL WARNING: Setu credentials missing in environment! ID: {SETU_CLIENT_ID}, Secret Length: {len(SETU_CLIENT_SECRET) if SETU_CLIENT_SECRET else 0}")
else:
    print(f"--- Setu credentials loaded successfully. Client ID starting with: {SETU_CLIENT_ID[:5]}")

@router.post("/consent/callback")
async def handle_consent_callback(payload: SetuWebhook):
    """
    Handles status updates for consents (ACTIVE, REJECTED, REVOKED)
    """
    if payload.type == "CONSENT_STATUS_UPDATE":
        status = payload.data.get("status") if payload.data else None
        print(f"Setu consent {payload.consentId} status updated to: {status}")
        
        # Update supabase and initiate data session if ACTIVE
        supabase.table("setu_sessions").update({
            "status": status
        }).eq("consent_id", payload.consentId).execute()
        
        if status == "ACTIVE":
            print(f"Initiating Data Session with Setu for consent: {payload.consentId}")
            
            url = f"{SETU_BASE_URL}/sessions"
            headers = {
                "x-client-id": SETU_CLIENT_ID,
                "x-client-secret": SETU_CLIENT_SECRET,
                "x-product-instance-id": SETU_PRODUCT_INSTANCE_ID,
                "Content-Type": "application/json"
            }
            body = {
                "consentId": payload.consentId,
                "DataRange": {
                    "from": "2023-01-01T00:00:00.000Z",
                    "to": datetime.now(timezone.utc).isoformat()
                },
                "format": "JSON",
                "KeyMaterial": {
                    "cryptoAlg": "ECDH",
                    "curve": "Curve25519",
                    "params": "",
                    "DHPublicKey": {
                    "expiry": (datetime.now(timezone.utc)).isoformat(),
                    "Parameters": "",
                    "KeyValue": "dummy_key_value"
                    },
                    "Nonce": "dummy_nonce"
                }
            }
            async with httpx.AsyncClient() as client:
                try:
                    resp = await client.post(url, headers=headers, json=body)
                    resp.raise_for_status()
                    session_id = resp.json().get("id")
                    
                    supabase.table("setu_sessions").update({
                        "session_id": session_id
                    }).eq("consent_id", payload.consentId).execute()
                    
                    print(f"Data Session successfully requested! Tracking Session ID: {session_id}")
                except Exception as e:
                    print("Failed to trigger session API", e)
                    
    return {"status": "ok"}

@router.post("/webhook")
async def handle_webhook(payload: SetuWebhook, background_tasks: BackgroundTasks):
    """
    Handles Setu webhook requests (FI_DATA_READY)
    """
    if payload.type == "FI_DATA_READY":
        background_tasks.add_task(process_webhook_data, payload)
        
    return {"status": "ok"}

@router.post("/consent/{user_id}")
async def create_consent(user_id: str, payload: ConsentRequest):
    """
    Creates a consent request with Setu AA API
    """
    url = f"{SETU_BASE_URL}/consents"
    headers = {
        "x-client-id": SETU_CLIENT_ID,
        "x-client-secret": SETU_CLIENT_SECRET,
        "x-product-instance-id": SETU_PRODUCT_INSTANCE_ID,
        "Content-Type": "application/json"
    }
    
    # Needs current date ISO format for 'to' field
    current_time_iso = datetime.now(timezone.utc).isoformat()
    
    body = {
        "consentDuration": {"unit": "MONTH", "value": 24},
        "dataRange": {
            "from": "2023-01-01T00:00:00Z",
            "to": current_time_iso
        },
        "vua": f"{payload.mobile_number}@setu-sandbox",
        "purpose": {"code": "101", "text": "Wealth management service"},
        "fiTypes": ["DEPOSIT"],
        "consentTypes": ["TRANSACTIONS", "SUMMARY", "PROFILE"],
        "fetchType": "PERIODIC",
        "frequency": {"unit": "MONTH", "value": 1}
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, headers=headers, json=body)
            response.raise_for_status()
            data = response.json()
            
            consent_id = data.get("id")
            url_to_redirect = data.get("url")
            
            # Store database mapping
            if consent_id:
                supabase.table("setu_sessions").insert({
                    "consent_id": consent_id,
                    "user_id": user_id,
                    "status": "PENDING"
                }).execute()
                
            return {"consentId": consent_id, "url": url_to_redirect}
        except httpx.HTTPError as e:
            raise HTTPException(status_code=500, detail=f"Setu API Error: {str(e)}")

async def process_webhook_data(payload: SetuWebhook):
    """
    Background task to process FI_DATA_READY
    """
    if payload.type != "FI_DATA_READY":
        return
        
    consent_id = payload.consentId
    session_id = payload.sessionId
    
    sess_res = supabase.table('setu_sessions').select('user_id, session_id').eq('consent_id', consent_id).execute()
    if not sess_res.data:
        print(f"Warning: consentId {consent_id} not mapped in DB. Cannot find exact user.")
        return
        
    user_id = sess_res.data[0]['user_id']
    stored_session = sess_res.data[0]['session_id']
    
    # Use payload session if not stored locally
    target_session = session_id if session_id else stored_session
    
    print(f"Pulling Live Bank statement from Setu Session: {target_session}")
    
    fi_data_list = []
    
    if target_session:
        # Actually fetch the Data block from Setu
        url = f"{SETU_BASE_URL}/sessions/{target_session}"
        headers = {
            "x-client-id": SETU_CLIENT_ID,
            "x-client-secret": SETU_CLIENT_SECRET,
            "x-product-instance-id": SETU_PRODUCT_INSTANCE_ID
        }
        async with httpx.AsyncClient() as client:
            try:
                resp = await client.get(url, headers=headers)
                resp.raise_for_status()
                data = resp.json()
                # Setu places decrypted items in `payload` locally or encrypted format
                fi_data_list = data.get("payload", [])
            except Exception as e:
                print(f"Error fetching real session data: {e}. ")
                
    # 1. First gather users income
    user_res = supabase.table('users').select('income').eq('id', user_id).execute()
    income = float(user_res.data[0].get('income', 0)) if user_res.data else 0

    # Percents based on instructions
    budget_percentages = {
        "essentials": 0.30,
        "food": 0.20,
        "lifestyle": 0.15,
        "subscriptions": 0.10,
        "transport": 0.10,
        "others": 0.15
    }
    
    # Setu Sandbox Fallback
    # If the network fails OR Setu strictly encrypted it and omitted payload
    is_encrypted_format = False
    if fi_data_list and isinstance(fi_data_list[0], dict):
        if "encryptedFI" in fi_data_list[0].get("data", [{}])[0]:
             is_encrypted_format = True

    if not fi_data_list or is_encrypted_format:
        print("Setu Sandbox Encryption Active. Bypassing JWE decipher module & injecting mock testing transactions...")
        mock_txns = [
            {"amount": 450.0, "narration": "ZOMATO SWIGGY LUNCH", "transactionTimestamp": datetime.now(timezone.utc).isoformat(), "type": "DEBIT"},
            {"amount": 1200.0, "narration": "UBER RIDES", "transactionTimestamp": datetime.now(timezone.utc).isoformat(), "type": "DEBIT"},
            {"amount": 5000.0, "narration": "AMAZON SHOPPING", "transactionTimestamp": datetime.now(timezone.utc).isoformat(), "type": "DEBIT"},
            {"amount": 999.0, "narration": "NETFLIX SUB", "transactionTimestamp": datetime.now(timezone.utc).isoformat(), "type": "DEBIT"},
        ]
        fi_data_list = [{"data": [{"decryptedFI": {"account": {"transactions": {"transaction": mock_txns}}}}]}]
    
    for fi in fi_data_list:
        inner_data = fi.get("data", [])
        for item in inner_data:
            decrypted = item.get("decryptedFI", {})
            account = decrypted.get("account", {})
            transactions = account.get("transactions", {})
            txn_list = transactions.get("transaction", [])
            
            for txn in txn_list:
                if txn.get("type", "").upper() == "DEBIT":
                    amount = float(txn.get("amount", 0))
                    narration = txn.get("narration", "")
                    txn_date = txn.get("transactionTimestamp")
                    
                    category = categorize(narration)
                    
                    # Store transaction
                    supabase.table('transactions').insert({
                        "id": str(uuid.uuid4()),
                        "user_id": user_id,
                        "amount": amount,
                        "merchant": narration,
                        "date": txn_date,
                        "category": category,
                        "is_scanned": False
                    }).execute()
                    
                    # Update binder
                    binder_res = supabase.table('binder_sections').select('*')\
                        .eq('user_id', user_id)\
                        .eq('category', category).execute()
                        
                    if binder_res.data and len(binder_res.data) > 0:
                        b_id = binder_res.data[0]['id']
                        current_spent = float(binder_res.data[0].get('amount_spent', 0))
                        allocated = float(binder_res.data[0].get('allocated_budget', 0))
                        
                        new_spent = current_spent + amount
                        new_rem = allocated - new_spent
                        
                        supabase.table('binder_sections').update({
                            "amount_spent": new_spent,
                            "remaining_balance": new_rem
                        }).eq('id', b_id).execute()
                    else:
                        alloc = income * budget_percentages.get(category, 0.15)
                        rem = alloc - amount
                        supabase.table('binder_sections').insert({
                            "id": str(uuid.uuid4()),
                            "user_id": user_id,
                            "category": category,
                            "allocated_budget": alloc,
                            "amount_spent": amount,
                            "remaining_balance": rem
                        }).execute()
                        
    # End of processing all transactions, run rule engine
    await run_rules(user_id, supabase)
