from fastapi import APIRouter
from pydantic import BaseModel
from database import supabase
from utils import format_uid
from services.budget import reallocate_user_budgets

router = APIRouter(prefix="/users", tags=["Users"])

class UserProfileRequest(BaseModel):
    name: str
    income: float

@router.post("/{user_id}")
def upsert_user(user_id: str, profile: UserProfileRequest):
    """
    Creates or updates the user profile context.
    - Updates income and name
    - Automatically re-allocates binder budgets
    """
    user_id = format_uid(user_id)
    res = supabase.table('users').select('id').eq('id', user_id).execute()
    
    if res.data and len(res.data) > 0:
        supabase.table('users').update({
            'name': profile.name,
            'income': profile.income
        }).eq('id', user_id).execute()
    else:
        supabase.table('users').insert({
            'id': user_id,
            'name': profile.name,
            'income': profile.income,
            'archetype': 'Pending' # default
        }).execute()
    
    # Trigger budget re-allocation
    reallocate_user_budgets(user_id, profile.income, supabase)
        
    return {"status": "success", "message": "User profile and budgets synced"}
