from fastapi import APIRouter, HTTPException, UploadFile, File, BackgroundTasks
from models import TransactionRequest
from database import supabase
from services.categorizer import categorize
from services.rule_engine import run_rules
from routes.insights import _generate_sticky_note
from utils import format_uid
import uuid
import os
import json
from google import genai
from google.genai import types
from datetime import datetime

router = APIRouter(prefix="/transactions", tags=["Transactions"])

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
else:
    client = None

@router.post("/")
async def log_transaction(payload: TransactionRequest, background_tasks: BackgroundTasks):
    """
    Submits a scanned or manual transaction.
    - Categorizes the merchant
    - Updates binder sections
    - Triggers full rule pipeline
    """
    category = categorize(payload.merchant)
    uid = format_uid(payload.user_id)
    
    txn_id = str(uuid.uuid4())
    txn_date = payload.date or datetime.utcnow().isoformat()
    
    supabase.table('transactions').insert({
        "id": txn_id,
        "user_id": uid,
        "amount": payload.amount,
        "merchant": payload.merchant,
        "date": txn_date,
        "category": category,
        "is_scanned": True
    }).execute()
    
    res = supabase.table('binder_sections').select('*')\
        .eq('user_id', uid)\
        .eq('category', category).execute()
        
    if res.data and len(res.data) > 0:
        section = res.data[0]
        new_spent = float(section.get('amount_spent', 0)) + payload.amount
        new_rem = float(section.get('allocated_budget', 0)) - new_spent
        
        supabase.table('binder_sections').update({
            "amount_spent": new_spent,
            "remaining_balance": new_rem
        }).eq('id', section['id']).execute()
    else:
        print(f"Warning: Category {category} not found in user's binder sections.")
        
    new_alerts = await run_rules(uid, supabase)
    background_tasks.add_task(_generate_sticky_note, uid)
    
    return {
        "status": "success",
        "transaction_id": txn_id,
        "category": category,
        "alerts_triggered": len(new_alerts)
    }

@router.post("/scan-receipt/{user_id}")
async def scan_receipt(user_id: str, background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """
    Uses Gemini Vision to OCR a receipt image, extract data, and log the transaction.
    """
    user_id = format_uid(user_id)
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured.")
        
    try:
        contents = await file.read()
        image_part = types.Part.from_bytes(data=contents, mime_type=file.content_type)
        
        prompt = """
        Analyze this receipt. Extract the following information and return strictly a valid JSON object without markdown formatting:
        {
            "merchant": "Name of the store or merchant",
            "amount": "Total final amount as a float number (do not include currency symbols)",
            "date": "Date of transaction in YYYY-MM-DD format (if visible, else null)"
        }
        """
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[prompt, image_part]
        )
        
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3].strip()
        elif text.startswith("```"):
            text = text[3:-3].strip()
            
        data = json.loads(text)
        
        merchant = data.get("merchant") or "Unknown Merchant"
        amount = float(data.get("amount") or 0)
        date_str = data.get("date")
        
        category = categorize(merchant)
        txn_id = str(uuid.uuid4())
        txn_date = date_str if date_str else datetime.utcnow().isoformat()
        
        supabase.table('transactions').insert({
            "id": txn_id,
            "user_id": user_id,
            "amount": amount,
            "merchant": merchant,
            "date": txn_date,
            "category": category,
            "is_scanned": True
        }).execute()
        
        # Update binder logic
        res = supabase.table('binder_sections').select('*').eq('user_id', user_id).eq('category', category).execute()
        if res.data and len(res.data) > 0:
            section = res.data[0]
            new_spent = float(section.get('amount_spent', 0)) + amount
            new_rem = float(section.get('allocated_budget', 0)) - new_spent
            supabase.table('binder_sections').update({
                "amount_spent": new_spent,
                "remaining_balance": new_rem
            }).eq('id', section['id']).execute()
            
        background_tasks.add_task(_generate_sticky_note, user_id)
            
        return {
            "status": "success",
            "transaction_id": txn_id,
            "merchant": merchant,
            "amount": amount,
            "category": category
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process receipt: {str(e)}")

@router.get("/{user_id}")
async def get_recent_transactions(user_id: str):
    """
    Fetches the latest 10 transactions for the user to display in the scanner list.
    """
    user_id = format_uid(user_id)
    res = supabase.table('transactions')\
        .select('*')\
        .eq('user_id', user_id)\
        .order('created_at', desc=True)\
        .limit(10)\
        .execute()
        
    return {"transactions": res.data}
