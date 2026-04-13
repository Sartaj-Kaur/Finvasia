from datetime import datetime
import uuid
from fastapi import APIRouter
from database import supabase
from services.letter_gen import generate_letter

router = APIRouter(prefix="/letter", tags=["Letters"])

@router.post("/generate/{user_id}")
async def trigger_letter_generation(user_id: str):
    # Fetch user details
    user_res = supabase.table('users').select('*').eq('id', user_id).execute()
    if not user_res.data:
        return {"error": "User not found"}
    user_data = user_res.data[0]
    
    # Binder sections (assume all represent 'this month' as requested)
    sections_res = supabase.table('binder_sections').select('*').eq('user_id', user_id).execute()
    total_spent = sum(float(s.get('amount_spent', 0)) for s in sections_res.data)
    
    # Mood logs (last 30)
    mood_res = supabase.table('mood_logs').select('mood').eq('user_id', user_id).order('timestamp', desc=True).limit(30).execute()
    
    happy_count = sum(1 for m in mood_res.data if m.get('mood') == 'happy')
    meh_count = sum(1 for m in mood_res.data if m.get('mood') == 'meh')
    stressed_count = sum(1 for m in mood_res.data if m.get('mood') == 'stressed')
    
    # Investments (mock logic for 'new_investment' as just surplus_sweep_amount)
    inv_res = supabase.table('investments').select('surplus_sweep_amount').eq('user_id', user_id).execute()
    new_investment = float(inv_res.data[0].get('surplus_sweep_amount', 0)) if inv_res.data else 0.0
    
    # Generate content
    content = await generate_letter(
        archetype=user_data.get('archetype', 'anchor'),
        income=float(user_data.get('income', 0)),
        total_spent=total_spent,
        happy=happy_count,
        meh=meh_count,
        stressed=stressed_count,
        new_investment=new_investment
    )
    
    # Save letter
    now = datetime.now()
    supabase.table('twin_letters').insert({
        'id': str(uuid.uuid4()),
        'user_id': user_id,
        'content': content,
        'month': now.month,
        'year': now.year
    }).execute()
    
    return {"letter": content}
