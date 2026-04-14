from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.setu import router as setu_router
from routes.binder import router as binder_router
from routes.mood import router as mood_router
from routes.letters import router as letters_router
from routes.insights import router as insights_router
from routes.transactions import router as transactions_router
from routes.investment import router as investment_router
from routes.quiz import router as quiz_router
from routes.fake_bank import router as fake_bank_router
from routes.users import router as users_router

app = FastAPI(title="Monager Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(setu_router, prefix="/api")
app.include_router(binder_router, prefix="/api")
app.include_router(mood_router, prefix="/api")
app.include_router(letters_router, prefix="/api")
app.include_router(insights_router, prefix="/api")
app.include_router(transactions_router, prefix="/api")
app.include_router(investment_router, prefix="/api")
app.include_router(quiz_router, prefix="/api")
app.include_router(fake_bank_router, prefix="/api")
app.include_router(users_router, prefix="/api")

@app.get("/")
def health_check():
    return {"status": "Monager Backend is running"}
