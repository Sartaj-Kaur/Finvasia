from database import supabase
from datetime import datetime

def build_user_context(user_id: str):
    """
    Fetches User Archetype, Finances, top categories, and moods
    to build a comprehensive context prompt for Gemini.
    """
    context_str = ""
    
    # 1. User & Archetype
    user_res = supabase.table('users').select('*').eq('id', user_id).execute()
    if user_res.data:
        user = user_res.data[0]
        archetype = user.get('archetype', 'Balanced Coach')
        scores = user.get('ocean_scores', {})
        context_str += f"USER PROFILE: The user's psychological financial archetype is '{archetype}'. "
        if scores:
            context_str += f"Big 5 Personality Scores: {scores}. "
            
    # 2. Binder sections
    sections_res = supabase.table('binder_sections').select('*').eq('user_id', user_id).execute()
    total_spent = sum(float(s.get('amount_spent', 0)) for s in sections_res.data)
    total_alloc = sum(float(s.get('allocated_budget', 0)) for s in sections_res.data)
    
    context_str += f"\nFINANCES THIS MONTH: Total spent so far is ₹{total_spent} out of an allocated budget of ₹{total_alloc}. "
    
    # Top spend categories
    top_categories = sorted(sections_res.data, key=lambda x: float(x.get('amount_spent', 0)), reverse=True)
    if top_categories:
        top_cat = top_categories[0]
        context_str += f"The highest spending category is '{top_cat.get('category')}' with ₹{top_cat.get('amount_spent')} spent. "
        
    # 3. Recent Transactions (Receipts)
    txn_res = supabase.table('transactions').select('*').eq('user_id', user_id).order('date', desc=True).limit(5).execute()
    if txn_res.data:
        txns = ", ".join([f"₹{t.get('amount')} at {t.get('merchant', 'unknown')}" for t in txn_res.data])
        context_str += f"\nRECENT SPEND HISTORY: The user recently spent on: {txns}. "
        
    # 4. Moods
    mood_res = supabase.table('mood_logs').select('mood').eq('user_id', user_id).order('timestamp', desc=True).limit(10).execute()
    if mood_res.data:
        recent_mood = mood_res.data[0].get('mood')
        context_str += f"\nEMOTIONAL STATE: The user's most recent logged mood is '{recent_mood}'. "
        
    return context_str
