# PURPOSE: This file handles Filing Cabinet (Insurance) logic.
# It interacts with the `insurance_products` table to serve static policies to the user.
# It calculates the binder impact if a user adopts a policy and computes a Twin Score
# indicating how well a given insurance policy fits the user's profile.

from app.config import supabase

def get_insurance_policies():
    """
    Fetches all seeded insurance products from the Filing Cabinet.
    """
    res = supabase.table("insurance_products").select("*").execute()
    return res.data

def calculate_binder_impact(user_id: str, monthly_cost: float):
    """
    Calculates how subscribing to an insurance policy impacts the remaining budget
    in the Budget Binder sections.
    """
    # Simply reducing unallocated budget or checking against essentials
    return {
        "monthly_cost": monthly_cost,
        "impact": "Decreases your unallocated budget by the monthly cost."
    }

def get_twin_score(user_id: str, policy_id: str):
    """
    Rule-based rating (1-10) evaluating the fit of an insurance policy 
    compared to the user's financial profile.
    """
    # 1. Fetch user income, dependent scale (placeholder)
    # 2. Fetch policy cost and coverage
    # 3. Output numeric fit 1-10
    return {"policy_id": policy_id, "score": 8, "reason": "Good coverage for your income range."}
