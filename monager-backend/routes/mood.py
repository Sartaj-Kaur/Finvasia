from datetime import datetime, timezone
import uuid
from fastapi import APIRouter
from models import MoodLogRequest
from database import supabase
from utils import format_uid

router = APIRouter(prefix="/mood", tags=["Mood"])

@router.post("/log")
async def log_mood(mood_req: MoodLogRequest):
    """
    Accepts: user_id, mood (one of: happy, meh, stressed)
    Store in mood_logs.
    If mood is "stressed", check if today's food or lifestyle spend is above daily average.
    If so, create sticky note.
    """
    user_id = format_uid(mood_req.user_id)
    mood = mood_req.mood
    
    # Store mood
    mood_entry_id = str(uuid.uuid4())
    supabase.table('mood_logs').insert({
        'id': mood_entry_id,
        'user_id': user_id,
        'mood': mood,
        'timestamp': datetime.now(timezone.utc).isoformat()
    }).execute()
    
    created_note = None
    
    if mood == "stressed":
        # Check spending
        # 1. Daily averages
        sections_res = supabase.table('binder_sections').select('*').eq('user_id', user_id).execute()
        
        # 2. Today's spending
        today_iso = datetime.utcnow().strftime("%Y-%m-%d")
        txns_res = supabase.table('transactions')\
            .select('*')\
            .eq('user_id', user_id)\
            .gte('date', today_iso)\
            .execute()
            
        today_food_spend = sum(float(t.get('amount', 0)) for t in txns_res.data if t.get('category') == 'food')
        today_lifestyle_spend = sum(float(t.get('amount', 0)) for t in txns_res.data if t.get('category') == 'lifestyle')
        
        # Determine averages
        food_avg = 0
        lifestyle_avg = 0
        for s in sections_res.data:
            budget = float(s.get('allocated_budget', 0))
            if s.get('category') == 'food':
                food_avg = budget / 30
            elif s.get('category') == 'lifestyle':
                lifestyle_avg = budget / 30
                
        if (today_food_spend > food_avg) or (today_lifestyle_spend > lifestyle_avg):
            note_content = "Stressed day + extra spending detected. Monager sees the pattern. 👀"
            supabase.table('sticky_notes').insert({
                'id': str(uuid.uuid4()),
                'user_id': user_id,
                'content': note_content,
                'condition_triggered': 'stress_spend_detected',
                'created_at': datetime.now(timezone.utc).isoformat()
            }).execute()
            created_note = note_content
            
    return {
        "message": "Mood logged successfully",
        "triggered_note": created_note
    }
