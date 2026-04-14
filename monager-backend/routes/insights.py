from fastapi import APIRouter
from database import supabase
from services.investment import get_portfolio_value
from services.llm_context import build_user_context
from services.memory import embed_and_store_memory
from utils import format_uid
from google import genai
import os
import uuid
from datetime import datetime

router = APIRouter(prefix="/insights", tags=["Insights"])
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
else:
    client = None

@router.get("/summary/{user_id}")
async def get_insights_summary(user_id: str):
    """
    Returns insights summary including percentages and monager_observation.
    """
    user_id = format_uid(user_id)
    # 1. Binder sections and percentages
    sections_res = supabase.table('binder_sections').select('*').eq('user_id', user_id).execute()
    sections = []
    top_spent = -1
    top_category = "none"
    
    for s in sections_res.data:
        spent = float(s.get('amount_spent', 0))
        budget = float(s.get('allocated_budget', 0))
        percentage_used = (spent / budget * 100) if budget > 0 else 0
        
        s['percentage_used'] = percentage_used
        sections.append(s)
        
        if spent > top_spent:
            top_spent = spent
            top_category = s.get('category', "none")
            
    # 2. Mood summary
    mood_res = supabase.table('mood_logs').select('mood').eq('user_id', user_id).execute()
    mood_summary = {
        "happy": sum(1 for m in mood_res.data if m.get('mood') == 'happy'),
        "meh": sum(1 for m in mood_res.data if m.get('mood') == 'meh'),
        "stressed": sum(1 for m in mood_res.data if m.get('mood') == 'stressed')
    }
    
    # 3. Investment totals
    inv_res = supabase.table('investments').select('total_invested').eq('user_id', user_id).execute()
    investment_total = float(inv_res.data[0].get('total_invested', 0)) if inv_res.data else 0
    simulated_value = get_portfolio_value(investment_total, 12)
    
    # 4. Monager Observation
    observation = f"You spent most on {top_category} this month. Your investment pool sits at ₹{simulated_value:.2f}."
    
    return {
        "binder_sections": sections,
        "top_category": top_category,
        "mood_summary": mood_summary,
        "investment_total": investment_total,
        "simulated_value": simulated_value,
        "monager_observation": observation
    }

async def _generate_sticky_note(user_id: str):
    if not client:
        return "GEMINI_API_KEY not configured."
        
    user_context = build_user_context(user_id)
    
    prompt = f"""
    System: You are Monager, the financial twin. 
    Context:
    {user_context}
    
    Task: Write a very short (1-2 sentences max) "sticky note" to the user. It should sound like a quick post-it note left on their desk. Be highly personal based on their archetype tone. Pick one randomness element to focus on: a specific recent transaction they just made, their recent mood, or their overall budget pace. Do NOT greet them, just write the note.
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt
    )
    
    note_text = response.text.strip() if response and response.text else "Keep an eye on that budget today!"
    
    # Save to UI database table
    try:
        supabase.table("sticky_notes").insert({
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "content": note_text,
            "condition_triggered": "dynamic_ai",
            "created_at": datetime.utcnow().isoformat()
        }).execute()
    except Exception as e:
        print("Failed to save sticky note:", e)
        
    # Embed and store
    await embed_and_store_memory(user_id, note_text, memory_type="sticky_note")
    
    return note_text

@router.post("/sticky-note/{user_id}")
async def generate_sticky_note(user_id: str):
    """
    Generates a new AI sticky note based on recent activity.
    """
    user_id = format_uid(user_id)
    note_text = await _generate_sticky_note(user_id)
    return {"note": note_text}
