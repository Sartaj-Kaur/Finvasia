# PURPOSE: This file handles the logic for generating the monthly Letter / Envelope.
# It collects user context (spending, mood, investments, OCEAN profile) and passes it 
# to a prompt engine (currently a placeholder) to generate an LLM-based monthly review letter.

from app.config import supabase

def generate_monthly_letter(user_id: str, month: int, year: int) -> str:
    """
    Collects user context to instruct an LLM (placeholder) on generating a letter.
    """
    # Context aggregation:
    # 1. Fetch OCEAN profile and Archetype
    # 2. Fetch monthly spend summary from Binder
    # 3. Fetch mood trend from Mood Logs
    # 4. Fetch investment milestones
    
    # 5. Build prompt and call Gemini API (Placeholder here)
    placeholder_letter = (
        f"Dear User,\n\n"
        f"This is your personalized financial review for {month}/{year}. "
        f"Based on your profile, we noticed you had some interesting spending spikes this month, "
        f"yet you managed to stay aligned with your long-term goals. Keep it up!"
    )

    # 6. Store generated letter
    data = {
        "user_id": user_id,
        "content": placeholder_letter,
        "month": month,
        "year": year
    }
    supabase.table("twin_letters").insert(data).execute()
    
    return placeholder_letter

def get_letters(user_id: str):
    """
    Retrieves previously generated letters for the user's envelope.
    """
    response = supabase.table("twin_letters").select("*").eq("user_id", user_id).order("year", desc=True).order("month", desc=True).execute()
    return response.data
