from fastapi import APIRouter
from database import supabase

router = APIRouter(prefix="/binder", tags=["Binder"])

@router.get("/{user_id}")
async def get_binder(user_id: str):
    """
    Returns:
    - All binder_sections for user
    - All sticky_notes sorted newest first
    - Investments record
    - User archetype, income, name
    """
    # 1. Fetch binder sections
    sections_res = supabase.table('binder_sections').select('*').eq('user_id', user_id).execute()
    
    # 2. Fetch sticky notes
    notes_res = supabase.table('sticky_notes').select('*').eq('user_id', user_id).order('created_at', desc=True).execute()
    
    # 3. Fetch investments
    inv_res = supabase.table('investments').select('*').eq('user_id', user_id).execute()
    
    # 4. Fetch user
    user_res = supabase.table('users').select('name, archetype, income').eq('id', user_id).execute()
    user_data = user_res.data[0] if user_res.data else {}
    
    return {
        "user": user_data,
        "binder_sections": sections_res.data,
        "sticky_notes": notes_res.data,
        "investments": inv_res.data[0] if inv_res.data else None
    }
