# PURPOSE: This file provides endpoints for the Loan Folders component.
# Delegates EMI math and affordability rule checks to `loan_service.py`.

from fastapi import APIRouter, HTTPException
from app.models.schemas import EMICalculationRequest
from app.services import loan_service

router = APIRouter()

@router.get("/products")
def get_loan_products():
    """
    Get all seeded loan products.
    """
    try:
        data = loan_service.get_loans()
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/calculate-emi")
def calculate_emi(request: EMICalculationRequest):
    """
    Calculate the monthly EMI given interest rate, months, and principal.
    """
    try:
        emi = loan_service.calculate_emi(
            request.loan_amount, request.interest_rate, request.tenure_months
        )
        return {"status": "success", "data": {"emi": emi}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}/affordability")
def check_affordability(user_id: str, emi: float):
    """
    Get the affordability score projection for a given EMI based on binder profile.
    """
    try:
        score_data = loan_service.calculate_affordability(user_id, emi)
        return {"status": "success", "data": score_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
