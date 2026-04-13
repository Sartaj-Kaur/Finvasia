# PURPOSE: This file orchestrates synchronization with the Finvasia mobile app.
# It exposes functions to ingest data captured on mobile (mood check-ins, scanned
# receipts, onboarding OCEAN scores) and persists them into the Supabase database.

from app.config import supabase
from app.models.schemas import UserProfileSyncRequest, TransactionsSyncRequest, MoodSyncRequest

def sync_user_profile(payload: UserProfileSyncRequest):
    """
    Updates the user profile with OCEAN scores and archetype gathered from mobile onboarding.
    """
    data = payload.dict()
    # Assuming user_id exists, we update. Otherwise, we might insert.
    res = supabase.table("users").update(data).eq("id", str(payload.user_id)).execute()
    return res.data

def sync_scanned_transactions(payload: TransactionsSyncRequest):
    """
    Ingests transactions scanned from bills on the mobile app into the binder.
    """
    inserts = []
    for tx in payload.transactions:
        inserts.append({
            "user_id": str(payload.user_id),
            "amount": tx.amount,
            "merchant": tx.merchant,
            "date": tx.date.isoformat(),
            "category": tx.category.value,
            "is_scanned": tx.is_scanned
        })
    res = supabase.table("transactions").insert(inserts).execute()
    
    # Might also trigger a binder recalculation here
    return res.data

def log_mood(payload: MoodSyncRequest):
    """
    Logs daily mood to correlate with spending behavior.
    """
    data = {
        "user_id": str(payload.user_id),
        "mood": payload.mood.value,
        "timestamp": payload.timestamp.isoformat()
    }
    res = supabase.table("mood_logs").insert(data).execute()
    return res.data
