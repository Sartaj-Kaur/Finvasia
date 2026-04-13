# PURPOSE: This file contains the logic for the Investment Grid.
# It recalculates total investments based on fixed SIPs and sweeps from under-budget 
# binder sections. It also simulates portfolio values using XIRR math.

from app.config import supabase

def get_investments(user_id: str):
    """
    Fetches the active investment state for a user.
    """
    response = supabase.table("investments").select("*").eq("user_id", user_id).execute()
    return response.data

def simulate_portfolio_value(investments: list, annualized_rate: float, years: int):
    """
    Simulate portfolio value using XIRR (Extended Internal Rate of Return) math.
    This acts as a simplified compound interest calculation in this scaffold.
    """
    total_value = 0.0
    # Logic to map SIP and surplus over a timeline of `years`
    # and applying `annualized_rate`.
    return total_value

def check_milestones(user_id: str):
    """
    Detects when investment thresholds are crossed and generates milestones.
    """
    data = get_investments(user_id)
    if data:
        inv = data[0]
        # if inv['total_invested'] > 100000:
        #    trigger milestone
        pass
