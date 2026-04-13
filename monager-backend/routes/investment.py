from fastapi import APIRouter
from services.mock_data import simulate_micro_investments, get_fi_data_by_type

router = APIRouter(prefix="/api/investment", tags=["Investment Grid"])

PUNCHCARD_THRESHOLD = 500.0

@router.get("/punchcard")
def get_punchcard_status():
    """
    Returns the current state of the punchcard based on the virtual accumulation of
    round-ups, cashbacks, and budget shards.
    """
    investments = simulate_micro_investments()
    total = investments["grand_total"]
    
    # Calculate how many spots are filled on a 10-spot card
    # Assuming each spot is PUNCHCARD_THRESHOLD / 10
    spot_value = PUNCHCARD_THRESHOLD / 10.0
    filled_spots = min(10, int(total // spot_value))
    
    return {
        "status": "accumulating", # could be 'ready_to_deposit' if total >= PUNCHCARD_THRESHOLD
        "threshold": PUNCHCARD_THRESHOLD,
        "current_total": total,
        "filled_spots": filled_spots,
        "total_spots": 10,
        "flip_side_analytics": {
            "round_ups": investments["round_ups_total"],
            "cashbacks": investments["cashbacks_total"],
            "budget_shards": investments["budget_shards_total"],
            "breakdown": [
                {"source": "Round Ups", "amount": investments["round_ups_total"]},
                {"source": "Cashbacks", "amount": investments["cashbacks_total"]},
                {"source": "Budget Leftovers", "amount": investments["budget_shards_total"]}
            ]
        }
    }

@router.get("/sip")
def get_sip_portfolio():
    """
    Returns the core investing portfolio data from Account Aggregators.
    """
    mf_data = get_fi_data_by_type("MUTUAL_FUNDS")
    return {
        "mutual_funds": mf_data,
        "sip_status": "Active"
    }
