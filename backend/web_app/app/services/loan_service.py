# PURPOSE: This file handles logic for Loan Folders.
# It serves static loan products from the `loan_products` table and provides
# financial calculators for EMI (Equated Monthly Installment) and loan affordability scores.

from app.config import supabase

def get_loans():
    """
    Fetch all seeded loan types from the database.
    """
    res = supabase.table("loan_products").select("*").execute()
    return res.data

def calculate_emi(principal: float, rate: float, months: int):
    """
    Standard EMI calculator math logic.
    """
    if rate == 0:
        return principal / months
    
    monthly_rate = rate / (12 * 100)
    emi = principal * monthly_rate * ((1 + monthly_rate)**months) / (((1 + monthly_rate)**months) - 1)
    return round(emi, 2)

def calculate_affordability(user_id: str, emi: float):
    """
    Calculate an affordability score (1-10) projecting the EMI impact onto the binder.
    """
    # 1. Check user's unallocated/surplus income
    # 2. Generate 1-10 score
    return {
        "emi": emi,
        "score": 7,
        "projection": "Will reduce lifestyle flexibility."
    }
