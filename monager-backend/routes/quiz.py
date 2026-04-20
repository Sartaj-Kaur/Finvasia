from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from database import supabase

router = APIRouter(prefix="/quiz", tags=["Quiz"])

class QuizAnswer(BaseModel):
    value: str # 'A', 'B', 'C', or 'D'

class QuizSubmitRequest(BaseModel):
    user_id: str
    answers: List[QuizAnswer]

@router.get("/questions")
def get_questions():
    # Frontend handles the hardcoded questions directly now to ensure perfect adherence.
    return {"questions": []}

def match_archetype(answers: List[QuizAnswer], age: int):
    counts = {"A": 0, "B": 0, "C": 0, "D": 0}
    for ans in answers:
        if ans.value in counts:
            counts[ans.value] += 1
            
    # Scoring logic:
    # A-heavy (cautious, avoidant or rule-follower): 
    #   if age <= 25 = SPROUT, if age > 25 check other answers
    # B/C-heavy (casual, growth-oriented): -> VOLT
    # D-heavy (strategic, systematic): -> ORACLE
    # Final rules:
    # SPROUT  = beginner / avoidant / first-timer / age <=20
    # VOLT    = intermediate / action-oriented / hustler
    # ORACLE  = advanced / systematic / analytical / age >=26 or D-heavy

    dominant = max(counts, key=counts.get)
    max_count = counts[dominant]

    bc_count = counts["B"] + counts["C"]
    
    if age <= 20:
        assigned = "SPROUT"
    elif age >= 26 and (dominant == "D" or counts["D"] >= 3):
        assigned = "ORACLE"
    elif dominant == "A":
        if age <= 25:
            assigned = "SPROUT"
        else:
            if bc_count > counts["D"]:
                assigned = "VOLT"
            else:
                assigned = "ORACLE"
    elif dominant in ["B", "C"] or bc_count >= 4:
        assigned = "VOLT"
    elif dominant == "D":
        assigned = "ORACLE"
    else:
        # Mix/Fallback
        if age <= 23:
            assigned = "VOLT"
        else:
            assigned = "ORACLE"

    agents = {
        "SPROUT": {
            "name": "SPROUT", "tone": "encouraging",
            "description": "I keep it simple. I celebrate every win.\nNo jargon. No judgment. Just growth.\nWe learn about money together. 🌱"
        },
        "VOLT": {
            "name": "VOLT", "tone": "direct",
            "description": "Real talk only. No sugar coating.\nI'll push you when you're slipping.\nYour money should work as hard as you do. ⚡"
        },
        "ORACLE": {
            "name": "ORACLE", "tone": "precise",
            "description": "Data. Patterns. Projections.\nI speak your language — numbers.\nStrategy over emotion. Always. 🧠"
        }
    }
    
    return agents[assigned]

@router.post("/submit")
def submit_quiz(req: QuizSubmitRequest):
    if not req.answers:
        raise HTTPException(status_code=400, detail="No answers provided")
        
    # Fetch age from DB
    age = 22 # default fallback
    try:
        user_res = supabase.table('users').select('age').eq('id', req.user_id).execute()
        if user_res.data and len(user_res.data) > 0:
            if user_res.data[0].get('age') is not None:
                age = int(user_res.data[0]['age'])
    except Exception as e:
        print("Error fetching user age:", e)
        
    archetype = match_archetype(req.answers, age)
    
    try:
        # Save to database
        supabase.table('users').update({
            "archetype": archetype["name"]
        }).eq('id', req.user_id).execute()
    except Exception as e:
        print("Could not update supabase user archetype:", e)
    
    return {
        "scores": {}, # Not using OCEAN scores anymore
        "archetype": archetype["name"],
        "description": archetype["description"]
    }
