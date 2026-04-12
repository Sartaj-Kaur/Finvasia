# PURPOSE: This file defines endpoints to retrieve and refresh Sticky Notes.
# Actual rule execution is managed by `notes_service.py`.

from fastapi import APIRouter, HTTPException
from app.services import notes_service

router = APIRouter()

@router.get("/{user_id}")
def get_sticky_notes(user_id: str):
    """
    Get all active triggered sticky notes for the user.
    """
    try:
        data = notes_service.get_sticky_notes(user_id)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{user_id}/evaluate")
def evaluate_triggers(user_id: str):
    """
    Manually trigger the rule engine to evaluate user data and create new notes.
    """
    try:
        notes_service.evaluate_triggers(user_id)
        return {"status": "success", "message": "Trigger evaluation complete."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
