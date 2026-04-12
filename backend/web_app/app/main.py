# PURPOSE: This is the primary entry point for the FastAPI application.
# It initializes the FastAPI server, configures CORS (Cross-Origin Resource Sharing)
# so the frontend can securely call the backend locally, and registers all the
# route components (Routers) into a unified API structure.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import binder, investments, sticky_notes, letters, filing_cabinet, loans, wallet, sync

app = FastAPI(
    title="Finvasia Fintech Backend API",
    description="Backend API for Budget Binder, Investments, Sticky Notes, Wallet, and other Finvasia desk components.",
    version="1.0.0"
)

# CORS configuration to allow local web development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, restrict this to frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Finvasia Fintech Backend API"}

# Route Registrations
app.include_router(binder.router, prefix="/api/binder", tags=["Budget Binder"])
app.include_router(investments.router, prefix="/api/investments", tags=["Investment Grid"])
app.include_router(sticky_notes.router, prefix="/api/notes", tags=["Sticky Notes"])
app.include_router(letters.router, prefix="/api/letters", tags=["Twin Letters / Envelope"])
app.include_router(filing_cabinet.router, prefix="/api/insurance", tags=["Filing Cabinet / Insurance"])
app.include_router(loans.router, prefix="/api/loans", tags=["Loan Folders"])
app.include_router(wallet.router, prefix="/api/wallet", tags=["Wallet"])
app.include_router(sync.router, prefix="/api/sync", tags=["Mobile App Sync"])
