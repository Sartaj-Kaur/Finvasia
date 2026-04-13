# PURPOSE: This file registers endpoints for the Filing Cabinet (Insurance).
# Allows frontend to fetch the seeded insurance policies and calculate their
# affordability and impact based on the user's current binder state.

from fastapi import APIRouter, HTTPException
from app.models.schemas import BinderImpactRequest
from app.services import cabinet_service

router = APIRouter()

@router.get("/policies")
def get_policies():
    """
    Get all seeded insurance policies.
    """
    try:
        data = cabinet_service.get_insurance_policies()
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/impact")
def binder_impact(request: BinderImpactRequest):
    """
    Calculate how the monthly cost of an insurance policy impacts the binder.
    """
    try:
        impact = cabinet_service.calculate_binder_impact(str(request.user_id), request.monthly_cost)
        return {"status": "success", "data": impact}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}/score/{policy_id}")
def twin_score(user_id: str, policy_id: str):
    """
    Get the 1-10 Twin Fit score for a specific policy.
    """
    try:
        score_data = cabinet_service.get_twin_score(user_id, policy_id)
        return {"status": "success", "data": score_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
