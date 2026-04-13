import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

async def generate_letter(archetype: str, income: float, total_spent: float, 
                          happy: int, meh: int, stressed: int, new_investment: float) -> str:
    """
    Call Gemini API to generate a personality-aware financial summary letter.
    """
    if not GEMINI_API_KEY:
        return "System configuration missing: GEMINI_API_KEY not set."

    # Using gemini model
    model = genai.GenerativeModel('gemini-1.5-pro')
    
    prompt = f"""
System: You are Monager — a personality-aware financial manager. You are not a chatbot. You manage money silently and report back. The user's archetype is {archetype}. Communicate in that style.

This month: income was ₹{income}, total spent was ₹{total_spent}, mood breakdown: happy {happy} days, stressed {stressed} days, meh {meh} days. Investment pool grew by ₹{new_investment}.

Write a warm personal letter (150-200 words) from Monager's perspective. Do not give financial advice. Reflect, observe, encourage. End with one specific thing to focus on next month. Sign off as "— Monager"
    """
    
    response = await model.generate_content_async(prompt)
    if response and response.text:
        return response.text
    return "Error generating content."
