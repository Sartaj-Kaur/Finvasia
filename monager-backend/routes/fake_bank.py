from fastapi import APIRouter
from database import supabase
import uuid
import random
from datetime import datetime, timedelta

router = APIRouter(prefix="/fake-bank", tags=["Fake Bank"])

CATEGORIES = ["food", "transport", "lifestyle", "subscriptions", "essentials", "others"]
MERCHANTS = {
    "food": ["Zomato", "Swiggy", "Domino's", "Starbucks", "Local Cafe"],
    "transport": ["Uber", "Ola", "Indian Railways", "Metro"],
    "lifestyle": ["Myntra", "Amazon", "Nike", "H&M"],
    "subscriptions": ["Netflix", "Spotify", "Amazon Prime", "Gym"],
    "essentials": ["Apollo Pharmacy", "BigBasket", "Electricity Bill"],
    "others": ["Miscellaneous Store", "Amazon"]
}

@router.post("/{user_id}/inject-data")
async def inject_fake_data(user_id: str):
    # Fetch user to get their income
    user_res = supabase.table('users').select('income').eq('id', user_id).execute()
    if not user_res.data:
        return {"error": "User not found."}
    
    income = float(user_res.data[0].get('income', 50000))
    
    # 1. Clear out existing fake data to prevent bloating
    supabase.table('transactions').delete().eq('user_id', user_id).execute()
    supabase.table('binder_sections').delete().eq('user_id', user_id).execute()
    
    # 2. Setup Monthly Budgets
    budget_percentages = {
        "essentials": 0.30,
        "food": 0.20,
        "lifestyle": 0.15,
        "subscriptions": 0.10,
        "transport": 0.10,
        "others": 0.15
    }
    
    for category, pct in budget_percentages.items():
        alloc = income * pct
        supabase.table('binder_sections').insert({
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "category": category,
            "allocated_budget": alloc,
            "amount_spent": 0,
            "remaining_balance": alloc
        }).execute()
        
    # 3. Generate Fake Transactions over the last 30 days
    now = datetime.utcnow()
    total_txns = random.randint(15, 30)
    
    binder_sections_res = supabase.table('binder_sections').select('*').eq('user_id', user_id).execute()
    binder_dict = {s["category"]: s for s in binder_sections_res.data}
    
    for _ in range(total_txns):
        cat = random.choice(CATEGORIES)
        merchant = random.choice(MERCHANTS[cat])
        amount = round(random.uniform(50, 1500), 2)
        days_ago = random.randint(0, 29)
        txn_date = (now - timedelta(days=days_ago)).isoformat()
        
        # Insert transaction
        supabase.table('transactions').insert({
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "amount": amount,
            "merchant": merchant,
            "date": txn_date,
            "category": cat,
            "is_scanned": False
        }).execute()
        
        # Update binder
        if cat in binder_dict:
            b = binder_dict[cat]
            b["amount_spent"] += amount
            b["remaining_balance"] -= amount
            
            supabase.table('binder_sections').update({
                "amount_spent": round(b["amount_spent"], 2),
                "remaining_balance": round(b["remaining_balance"], 2)
            }).eq('id', b["id"]).execute()
            
    return {"status": "success", "message": f"Injected {total_txns} mock transactions and calculated budgets."}
