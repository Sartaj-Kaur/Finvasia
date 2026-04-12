# PURPOSE: This file defines the endpoint for the Wallet desk component.
# Serves the consolidated overview of assets, liabilities, and net worth
# using `wallet_service.py`.

from fastapi import APIRouter, HTTPException
from app.services import wallet_service

router = APIRouter()

@router.get("/{user_id}")
def get_wallet(user_id: str):
    """
    Get holistic net worth snapshot.
    """
    try:
        data = wallet_service.get_wallet_profile(user_id)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
