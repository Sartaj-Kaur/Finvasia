from fastapi import APIRouter
from pydantic import BaseModel
from database import supabase
from utils import format_uid
from services.budget import reallocate_user_budgets

router = APIRouter(prefix="/users", tags=["Users"])

from typing import Optional

class UserProfileRequest(BaseModel):
    name: str
    income: float
    age: Optional[int] = None

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
        update_data = {
            'name': profile.name,
            'income': profile.income,
            # age not yet in DB schema — add column in Supabase before re-enabling
        }
        supabase.table('users').update(update_data).eq('id', user_id).execute()
    else:
        insert_data = {
            'id': user_id,
            'name': profile.name,
            'income': profile.income,
            'archetype': 'Pending',  # default
            # age not yet in DB schema — add column in Supabase before re-enabling
        }
        supabase.table('users').insert(insert_data).execute()
    
    # Trigger budget re-allocation
    reallocate_user_budgets(user_id, profile.income, supabase)
        
    return {"status": "success", "message": "User profile and budgets synced"}
