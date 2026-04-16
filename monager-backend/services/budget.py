from supabase import Client
import uuid

BUDGET_PERCENTAGES = {
    "essentials": 0.30,
    "food": 0.20,
    "lifestyle": 0.15,
    "subscriptions": 0.10,
    "transport": 0.10,
    "others": 0.15
}

def reallocate_user_budgets(user_id: str, income: float, supabase_client: Client):
    """
    Re-calculates and updates all binder_sections for a user based on new income.
    If sections don't exist, they are created.
    """
    if income <= 0:
        return

    # 1. Fetch existing binder sections
    res = supabase_client.table('binder_sections').select('*').eq('user_id', user_id).execute()
    existing_sections = {s['category']: s for s in res.data}

    for category, pct in BUDGET_PERCENTAGES.items():
        new_alloc = round(income * pct, 2)
        
        if category in existing_sections:
            # Update existing section
            section = existing_sections[category]
            spent = float(section.get('amount_spent', 0))
            new_remaining = max(0, new_alloc - spent)
            
            supabase_client.table('binder_sections').update({
                "allocated_budget": new_alloc,
                "remaining_balance": new_remaining
            }).eq('id', section['id']).execute()
        else:
            # Create if missing (unlikely if onboarding done, but safe)
            supabase_client.table('binder_sections').insert({
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "category": category,
                "allocated_budget": new_alloc,
                "amount_spent": 0,
                "remaining_balance": new_alloc
            }).execute()
