from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import sys
import os
from dotenv import load_dotenv

# Load .env before any local imports
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path, override=True)

# Append monager-backend so we can import its routes
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'monager-backend')))

from routes.setu import router as setu_router
from routes.binder import router as binder_router
from routes.mood import router as mood_router
from routes.letters import router as letters_router
from routes.insights import router as insights_router
from routes.transactions import router as transactions_router
from routes.investment import router as investment_router

app = FastAPI(title="Mobile App Personality Quiz API")

class QuizAnswer(BaseModel):
    trait: str
    value: int
    reverse: bool

class QuizSubmitRequest(BaseModel):
    answers: List[QuizAnswer]

QUESTIONS = [
    { "id": 1, "text": "Am the life of the party.", "trait": "E", "reverse": False },
    { "id": 2, "text": "Don't talk a lot.", "trait": "E", "reverse": True },
    { "id": 3, "text": "Am interested in people.", "trait": "A", "reverse": False },
    { "id": 4, "text": "Feel little concern for others.", "trait": "A", "reverse": True },
    { "id": 5, "text": "Am always prepared.", "trait": "C", "reverse": False },
    { "id": 6, "text": "Leave my belongings around.", "trait": "C", "reverse": True },
    { "id": 7, "text": "Get stressed out easily.", "trait": "N", "reverse": False },
    { "id": 8, "text": "Am relaxed most of the time.", "trait": "N", "reverse": True },
    { "id": 9, "text": "Have a rich vocabulary.", "trait": "O", "reverse": False },
    { "id": 10, "text": "Have a vivid imagination.", "trait": "O", "reverse": False },
]

def calculate_scores(answers: List[QuizAnswer]):
    scores = {"O": 0, "C": 0, "E": 0, "A": 0, "N": 0}
    counts = {"O": 0, "C": 0, "E": 0, "A": 0, "N": 0}
    
    for ans in answers:
        score = (6 - ans.value) if ans.reverse else ans.value
        scores[ans.trait] += score
        counts[ans.trait] += 1
        
    return {
        "openness": round((scores["O"] / (counts["O"] * 5)) * 100) if counts["O"] else 0,
        "conscientiousness": round((scores["C"] / (counts["C"] * 5)) * 100) if counts["C"] else 0,
        "extraversion": round((scores["E"] / (counts["E"] * 5)) * 100) if counts["E"] else 0,
        "agreeableness": round((scores["A"] / (counts["A"] * 5)) * 100) if counts["A"] else 0,
        "neuroticism": round((scores["N"] / (counts["N"] * 5)) * 100) if counts["N"] else 0,
    }

def match_archetype(scores: dict):
    N, C, O, E, A = scores["neuroticism"], scores["conscientiousness"], scores["openness"], scores["extraversion"], scores["agreeableness"]
    
    if N > 60:
        return {"name": "The Calm Guide", "tone": "reassuring", "description": "You seem to worry about finances. Your FinTwin will be calm, steady and reassuring."}
    if C < 40:
        return {"name": "The Disciplined Mentor", "tone": "structured", "description": "You tend to be spontaneous. Your FinTwin will be organized and keep you on track."}
    if O < 40:
        return {"name": "The Gentle Challenger", "tone": "encouraging", "description": "You prefer routine. Your FinTwin will gently push you to explore new financial ideas."}
    if E < 40:
        return {"name": "The Supportive Friend", "tone": "warm", "description": "You are more reserved. Your FinTwin will be warm and easy to open up to."}
    if A < 40:
        return {"name": "The Honest Advisor", "tone": "direct", "description": "You are independent. Your FinTwin will be straightforward and no-nonsense."}
        
    return {"name": "The Balanced Coach", "tone": "balanced", "description": "You have a well-rounded personality. Your FinTwin will adapt to what you need."}

@app.get("/")
def health_check():
    return {"message": "Mobile backend is running!"}

@app.get("/quiz/questions")
def get_questions():
    return {"questions": QUESTIONS}

@app.post("/quiz/submit")
def submit_quiz(req: QuizSubmitRequest):
    if not req.answers:
        raise HTTPException(status_code=400, detail="No answers provided")
        
    scores = calculate_scores(req.answers)
    archetype = match_archetype(scores)
    

    return {
        "scores": scores,
        "archetype": archetype["name"],
        "description": archetype["description"]
    }

# Include all the routes from monager-backend
app.include_router(setu_router, prefix="/api")
app.include_router(binder_router, prefix="/api")
app.include_router(mood_router, prefix="/api")
app.include_router(letters_router, prefix="/api")
app.include_router(insights_router, prefix="/api")
app.include_router(transactions_router, prefix="/api")
app.include_router(investment_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=4000, reload=True)

