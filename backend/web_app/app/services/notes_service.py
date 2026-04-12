# PURPOSE: This file powers the Sticky Notes rule-based trigger engine.
# It evaluates conditions (like lifestyle overspend, stress-spend patterns, 
# and milestones) against user data and decides if a new sticky note should be generated,
# customizing the tone based on the user's FinTwin archetype.

from app.config import supabase
from datetime import datetime

def evaluate_triggers(user_id: str):
    """
    Evaluate user data against predefined rules to generate sticky notes.
    """
    # 1. Fetch user archetype
    user_res = supabase.table("users").select("archetype").eq("id", user_id).execute()
    archetype = user_res.data[0]['archetype'] if user_res.data else "Balanced"

    # 2. Check for lifestyle overspend
    binder_res = supabase.table("binder_sections").select("*").eq("user_id", user_id).eq("category", "Lifestyle").execute()
    
    # Example logic:
    # if binder_res.data and binder_res.data[0]['amount_spent'] > binder_res.data[0]['allocated_budget']:
    #     content = generate_message("overspend", archetype)
    #     save_sticky_note(user_id, content, "lifestyle_overspend")

def save_sticky_note(user_id: str, content: str, condition: str):
    """
    Persists a triggered sticky note to the database.
    """
    data = {
        "user_id": user_id,
        "content": content,
        "condition_triggered": condition
    }
    supabase.table("sticky_notes").insert(data).execute()

def get_sticky_notes(user_id: str):
    """
    Retrieves all sticky notes for a user to display on the desk.
    """
    response = supabase.table("sticky_notes").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return response.data
