from datetime import datetime
import uuid
from fastapi import APIRouter
from database import supabase
from services.letter_gen import generate_letter
from services.memory import embed_and_store_memory

router = APIRouter(prefix="/letter", tags=["Letters"])

@router.post("/generate/{user_id}")
async def trigger_letter_generation(user_id: str):
    try:
        content = await generate_letter(user_id=user_id)
    except Exception as e:
        print("Letter generation error: ", e)
        content = f"Hey! Monager couldn't fetch your analysis this month. Linking your fake bank might help!"
    
    # Save letter
    now = datetime.now()
    supabase.table('twin_letters').insert({
        'id': str(uuid.uuid4()),
        'user_id': user_id,
        'content': content,
        'month': now.month,
        'year': now.year
    }).execute()
    
    # Store into Embeddings Long Term Memory!
    await embed_and_store_memory(user_id, content, memory_type="monthly_letter")
    
    return {"letter": content}

@router.get("/{user_id}")
async def get_latest_letter(user_id: str):
    """
    Returns current month letter content from twin_letters table.
    """
    res = supabase.table('twin_letters')\
        .select('*')\
        .eq('user_id', user_id)\
        .order('year', desc=True)\
        .order('month', desc=True)\
        .limit(1)\
        .execute()
        
    if res.data and len(res.data) > 0:
        return res.data[0]
    
    return {"content": "No letter from Monager yet. Linking your bank will trigger your first analysis!"}
