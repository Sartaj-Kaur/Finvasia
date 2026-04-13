import os
from google import genai
from services.llm_context import build_user_context

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
else:
    client = None

async def generate_letter(user_id: str) -> str:
    """
    Call Gemini API to generate a personality-aware financial summary letter.
    """
    if not client:
        return "System configuration missing: GEMINI_API_KEY not set."

    # 1. Get entire month context
    user_context = build_user_context(user_id)
    
    prompt = f"""
    System: You are Monager — a personality-aware financial manager. You are not a chatbot. You manage money silently and report back. 
    
    Below is the user's current context:
    {user_context}
    
    Task: Write a warm personal letter (150-200 words) from Monager's perspective. Do not give financial advice. Reflect on their spending and mood, observe their behavior based on their archetype, and encourage them. End with one specific thing to focus on next month based strictly on their top spending category. Sign off as "— Monager"
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt
    )
    if response and response.text:
        return response.text
    return "Error generating content."
