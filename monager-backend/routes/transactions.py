from fastapi import APIRouter, HTTPException, UploadFile, File
from models import TransactionRequest
from database import supabase
from services.categorizer import categorize
from services.rule_engine import run_rules
import uuid
import os
import json
from google import genai
from datetime import datetime

router = APIRouter(prefix="/transactions", tags=["Transactions"])

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
else:
    client = None

@router.post("/")
async def log_transaction(payload: TransactionRequest):
    """
    Submits a scanned or manual transaction.
    - Categorizes the merchant
    - Updates binder sections
    - Triggers full rule pipeline
    """
    category = categorize(payload.merchant)
    
    txn_id = str(uuid.uuid4())
    txn_date = payload.date or datetime.utcnow().isoformat()
    
    supabase.table('transactions').insert({
        "id": txn_id,
        "user_id": payload.user_id,
        "amount": payload.amount,
        "merchant": payload.merchant,
        "date": txn_date,
        "category": category,
        "is_scanned": True
    }).execute()
    
    res = supabase.table('binder_sections').select('*')\
        .eq('user_id', payload.user_id)\
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
        
    new_alerts = await run_rules(payload.user_id, supabase)
    
    return {
        "status": "success",
        "transaction_id": txn_id,
        "category": category,
        "alerts_triggered": len(new_alerts)
    }

@router.post("/scan-receipt/{user_id}")
async def scan_receipt(user_id: str, file: UploadFile = File(...)):
    """
    Uses Gemini Vision to OCR a receipt image, extract data, and log the transaction.
    """
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured.")
        
    try:
        contents = await file.read()
        image_parts = [
            {
                "mime_type": file.content_type,
                "data": contents
            }
        ]
        
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
            contents=[prompt, image_parts[0]]
        )
        
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3].strip()
        elif text.startswith("```"):
            text = text[3:-3].strip()
            
        data = json.loads(text)
        
        merchant = data.get("merchant", "Unknown Merchant")
        amount = float(data.get("amount", 0))
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
            
        return {
            "status": "success",
            "transaction_id": txn_id,
            "merchant": merchant,
            "amount": amount,
            "category": category
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process receipt: {str(e)}")
