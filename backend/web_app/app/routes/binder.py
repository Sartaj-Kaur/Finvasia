# PURPOSE: This file defines the API endpoints for the Budget Binder component.
# It exposes HTTP GET and POST routes that delegates execution to `binder_service.py`.
# Keeps routing logic completely separate from business logic.

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services import binder_service

router = APIRouter()

class GoalCreateRequest(BaseModel):
    user_id: str
    name: str
    target_amount: float
    target_date: str

@router.get("/{user_id}")
def get_binder_status(user_id: str):
    """
    Get all binder sections (budget vs spent).
    """
    try:
        data = binder_service.get_binder_summary(user_id)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/goal")
def create_new_goal(request: GoalCreateRequest):
    """
    Create a new goal and trigger automatic budget reallocation.
    """
    try:
        data = binder_service.create_goal(
            request.user_id, request.name, request.target_amount, request.target_date
        )
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
