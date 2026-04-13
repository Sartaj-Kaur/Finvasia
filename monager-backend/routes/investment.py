from fastapi import APIRouter, HTTPException
from models import InvestmentSweepRequest
from database import supabase
from services.investment import sweep_surplus

router = APIRouter(prefix="/investment", tags=["Investment"])

@router.post("/sweep")
async def approve_sweep(payload: InvestmentSweepRequest):
    """
    User approves a surplus sweep from the Activity Screen.
    - Updates investments record
    - (Optional) Clears the corresponding sticky note
    """
    try:
        await sweep_surplus(payload.user_id, payload.amount, supabase)
        
        # 2. Archive surplus detected sticky notes for this month
        # This keeps the dashboard clean after sweep is done.
        supabase.table('sticky_notes').delete()\
            .eq('user_id', payload.user_id)\
            .eq('condition_triggered', 'surplus_detected').execute()
            
        return {"status": "success", "message": f"Swept ₹{payload.amount} into investments."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
