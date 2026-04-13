from fastapi import APIRouter, HTTPException
from models import TransactionRequest
from database import supabase
from services.categorizer import categorize
from services.rule_engine import run_rules
import uuid
from datetime import datetime

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.post("/")
async def log_transaction(payload: TransactionRequest):
    """
    Submits a scanned or manual transaction.
    - Categorizes the merchant
    - Updates binder sections
    - Triggers full rule pipeline
    """
    # 1. Categorize
    category = categorize(payload.merchant)
    
    # 2. Insert Transaction Record
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
    
    # 3. Update Binder Section
    # First, find if section exists
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
        # For simplicity, if section doesn't exist, we skip updating binder
        # In a full app, we might create a default 'Others' section.
        print(f"Warning: Category {category} not found in user's binder sections.")
        
    # 4. Trigger Rule Engine
    new_alerts = await run_rules(payload.user_id, supabase)
    
    return {
        "status": "success",
        "transaction_id": txn_id,
        "category": category,
        "alerts_triggered": len(new_alerts)
    }
