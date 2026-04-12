# PURPOSE: This file handles the business logic for the Budget Binder component.
# It interfaces with the Supabase `binder_sections` and `goals` tables.
# Logic included: recalculating remaining balances based on transactions, and 
# adjusting budget allocations when short-term savings goals are created.

from app.config import supabase
from uuid import UUID

def get_binder_summary(user_id: str):
    """
    Fetches the current status of all binder sections for a user.
    """
    response = supabase.table("binder_sections").select("*").eq("user_id", user_id).execute()
    return response.data

def adjust_budget_for_goal(user_id: str, new_target_amount: float):
    """
    Checks feasibility against user income and auto-adjusts budget allocations 
    across sections to accommodate a new short-term saving target.
    """
    # Placeholder for actual logic: 
    # 1. Fetch user income.
    # 2. Check if total allocated + new_target_amount <= income.
    # 3. Deduct proportionally from 'Lifestyle' or 'Subscriptions' if over budget.
    pass

def create_goal(user_id: str, name: str, target_amount: float, target_date: str):
    """
    Creates a new goal and triggers budget reallocation.
    """
    adjust_budget_for_goal(user_id, target_amount)
    
    data = {
        "user_id": user_id,
        "name": name,
        "target_amount": target_amount,
        "target_date": target_date
    }
    response = supabase.table("goals").insert(data).execute()
    return response.data
