# PURPOSE: This file defines the API endpoints for the Investment Grid.
# All complex XIRR simulation and milestone calculations are delegated to `invest_service.py`.

from fastapi import APIRouter, HTTPException
from app.services import invest_service

router = APIRouter()

@router.get("/{user_id}")
def get_investments(user_id: str):
    """
    Get the user's investment grid data including SIPs and Surplus Sweeps.
    """
    try:
        data = invest_service.get_investments(user_id)
        # Also could return milestone checks here
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}/simulate")
def simulate_portfolio(user_id: str, rate: float = 12.0, years: int = 10):
    """
    Simulate the portfolio growth over `years` at `rate`%.
    """
    try:
        inv_data = invest_service.get_investments(user_id)
        projected = invest_service.simulate_portfolio_value(inv_data, rate, years)
        return {"status": "success", "data": {"projected_value": projected}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
