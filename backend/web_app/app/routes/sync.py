# PURPOSE: This file processes incoming sync requests from the mobile app.
# Allows the desktop backend to have current context on the user's receipts, mood,
# and static profile parameters like OCEAN scores and FinTwin archetypes.

from fastapi import APIRouter, HTTPException
from app.models.schemas import UserProfileSyncRequest, TransactionsSyncRequest, MoodSyncRequest
from app.services import sync_service

router = APIRouter()

@router.post("/profile")
def sync_profile(request: UserProfileSyncRequest):
    """
    Sync OCEAN scores, archetype, income from mobile onboarding.
    """
    try:
        data = sync_service.sync_user_profile(request)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/transactions")
def sync_transactions(request: TransactionsSyncRequest):
    """
    Sync scanned receipt transactions into the database.
    """
    try:
        data = sync_service.sync_scanned_transactions(request)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/mood")
def sync_mood(request: MoodSyncRequest):
    """
    Log a daily mood check-in.
    """
    try:
        data = sync_service.log_mood(request)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
