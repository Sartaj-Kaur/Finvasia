# PURPOSE: This file exposes API endpoints to handle Monthly Envelope/Letters.
# It uses the `letter_service.py` functions to aggregate context and act as a facade
# to LLM generation.

from fastapi import APIRouter, HTTPException
from app.models.schemas import LetterContextRequest
from app.services import letter_service

router = APIRouter()

@router.get("/{user_id}")
def list_letters(user_id: str):
    """
    Retrieve all previously generated letters for the envelope UI.
    """
    try:
        data = letter_service.get_letters(user_id)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate")
def generate_letter(request: LetterContextRequest):
    """
    Generate a new letter for the given month and year using LLM (currently placeholder).
    """
    try:
        letter_content = letter_service.generate_monthly_letter(
            str(request.user_id), request.month, request.year
        )
        return {"status": "success", "data": {"content": letter_content}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
