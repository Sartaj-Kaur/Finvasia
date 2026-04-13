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

# In-memory dictionary for storing consentId -> user_id mappings
consent_store: Dict[str, str] = {}

SETU_BASE_URL = os.getenv("SETU_BASE_URL", "https://fiu-sandbox.setu.co")
SETU_CLIENT_ID = os.getenv("SETU_CLIENT_ID")
SETU_CLIENT_SECRET = os.getenv("SETU_CLIENT_SECRET")

@router.post("/consent/{user_id}")
async def create_consent(user_id: str, payload: ConsentRequest):
    """
    Creates a consent request with Setu AA API
    """
    url = f"{SETU_BASE_URL}/consents"
    headers = {
        "x-client-id": SETU_CLIENT_ID,
        "x-client-secret": SETU_CLIENT_SECRET,
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
            
            # Store memory mapping
            if consent_id:
                consent_store[consent_id] = user_id
                
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
    user_id = consent_store.get(consent_id)
    if not user_id:
        print(f"Warning: consentId {consent_id} not mapped to any specific user_id in memory.")
        return
        
    fi_data_list = payload.fiData or []
    
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
                    txn_id = txn.get("txnId")
                    
                    category = categorize(narration)
                    
                    # Prevent duplicates if txnId exists (simplification)
                    # For demo purposes, we trust Setu doesn't send duplicate txns
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


@router.post("/webhook")
async def handle_webhook(payload: SetuWebhook, background_tasks: BackgroundTasks):
    """
    Handles Setu webhook requests
    """
    if payload.type == "FI_DATA_READY":
        background_tasks.add_task(process_webhook_data, payload)
        
    return {"status": "ok"}


@router.post("/consent/callback")
async def handle_consent_callback(payload: SetuWebhook):
    """
    Handles status updates for consents (ACTIVE, REJECTED, REVOKED)
    """
    if payload.type == "CONSENT_STATUS_UPDATE":
        status = payload.data.get("status") if payload.data else None
        print(f"Setu consent {payload.consentId} status updated to: {status}")
        
    return {"status": "ok"}
