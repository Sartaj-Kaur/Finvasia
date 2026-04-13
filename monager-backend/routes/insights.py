from fastapi import APIRouter
from database import supabase
from services.investment import get_portfolio_value

router = APIRouter(prefix="/insights", tags=["Insights"])

@router.get("/summary/{user_id}")
async def get_insights_summary(user_id: str):
    """
    Returns insights summary including percentages and monager_observation.
    """
    # 1. Binder sections and percentages
    sections_res = supabase.table('binder_sections').select('*').eq('user_id', user_id).execute()
    sections = []
    top_spent = -1
    top_category = "none"
    
    for s in sections_res.data:
        spent = float(s.get('amount_spent', 0))
        budget = float(s.get('allocated_budget', 0))
        percentage_used = (spent / budget * 100) if budget > 0 else 0
        
        s['percentage_used'] = percentage_used
        sections.append(s)
        
        if spent > top_spent:
            top_spent = spent
            top_category = s.get('category', "none")
            
    # 2. Mood summary
    mood_res = supabase.table('mood_logs').select('mood').eq('user_id', user_id).execute()
    mood_summary = {
        "happy": sum(1 for m in mood_res.data if m.get('mood') == 'happy'),
        "meh": sum(1 for m in mood_res.data if m.get('mood') == 'meh'),
        "stressed": sum(1 for m in mood_res.data if m.get('mood') == 'stressed')
    }
    
    # 3. Investment totals
    inv_res = supabase.table('investments').select('total_invested').eq('user_id', user_id).execute()
    investment_total = float(inv_res.data[0].get('total_invested', 0)) if inv_res.data else 0
    simulated_value = get_portfolio_value(investment_total, 12)
    
    # 4. Monager Observation
    observation = f"You spent most on {top_category} this month. Your investment pool sits at ₹{simulated_value:.2f}."
    
    return {
        "binder_sections": sections,
        "top_category": top_category,
        "mood_summary": mood_summary,
        "investment_total": investment_total,
        "simulated_value": simulated_value,
        "monager_observation": observation
    }
