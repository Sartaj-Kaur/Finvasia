from fastapi import APIRouter
from database import supabase
from services.mock_data import get_all_transactions
import datetime

# We match the prefix registered in main, usually main handles the /api 
# but let's define it explicitly or rely on existing setup.
router = APIRouter(prefix="/binder", tags=["Binder"])

@router.get("/{user_id}")
async def get_binder(user_id: str):
    """
    Original skeleton endpoint. Returns:
    - All binder_sections for user
    - All sticky_notes sorted newest first
    - Investments record
    - User archetype, income, name
    """
    # 1. Fetch binder sections
    sections_res = supabase.table('binder_sections').select('*').eq('user_id', user_id).execute()
    
    # 2. Fetch sticky notes
    notes_res = supabase.table('sticky_notes').select('*').eq('user_id', user_id).order('created_at', desc=True).execute()
    
    # 3. Fetch investments
    inv_res = supabase.table('investments').select('*').eq('user_id', user_id).execute()
    
    # 4. Fetch user
    user_res = supabase.table('users').select('name, archetype, income').eq('id', user_id).execute()
    user_data = user_res.data[0] if user_res.data else {}
    
    return {
        "user": user_data,
        "binder_sections": sections_res.data,
        "sticky_notes": notes_res.data,
        "investments": inv_res.data[0] if inv_res.data else None
    }


@router.get("/overview/{user_id}")
async def get_binder_overview(user_id: str):
    txns = get_all_transactions()
    total_spent = 0.0
    heatmap = {}
    
    for t in txns:
        if t.get("type") == "DEBIT" or t.get("txnType") == "DEBIT":
            try:
                amt = float(t.get("amount", 0))
                total_spent += amt
                
                # Try getting date, typically in transactionTimestamp or txnDate or valueDate
                date_str = t.get("transactionTimestamp", t.get("txnDate", t.get("valueDate", "")))
                if date_str:
                    # just extract YYYY-MM-DD
                    day = date_str[:10]
                    heatmap[day] = heatmap.get(day, 0) + amt
            except ValueError:
                pass
                
    return {
        "total_balance": 185400.0, # Mock static balance
        "total_spent_this_month": round(total_spent, 2),
        "total_saved": 40500.0,
        "monthly_activity_heatmap": [{"date": k, "intensity": v} for k, v in heatmap.items()],
        "monager_summary": "You've been spending more on weekends, but overall you're within limits."
    }

@router.get("/category/{category_name}")
async def get_binder_category(category_name: str):
    """ Returns filtered transaction insights for dynamic category tabs """
    txns = get_all_transactions()
    # Mocking filtering logic
    filtered = txns[:5] # just return 5 random mock transactions
    spent = sum([float(t.get("amount", 0)) for t in filtered if t.get("amount")])
    
    return {
        "category": category_name,
        "header": {
            "budget_allocated": 15000,
            "spent": spent,
            "remaining": 15000 - spent
        },
        "month_comparison": {
            "this_month": spent,
            "last_month": spent * 1.2
        },
        "recent_transactions": filtered,
        "spending_pattern": f"Higher spending towards the end of the month in {category_name}.",
        "monager_remark": "You've been slightly impulsive here this week."
    }
