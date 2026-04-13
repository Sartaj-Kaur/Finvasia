from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class ConsentRequest(BaseModel):
    """Payload for initiating a consent request."""
    user_id: str
    mobile_number: str

class MoodLogRequest(BaseModel):
    """Payload for keeping track of user mood."""
    user_id: str
    mood: str  # expected: "happy", "meh", "stressed"

class SetuWebhook(BaseModel):
    """
    Flexible payload for Setu webhooks.
    Webhooks can vary depending on `type`.
    - FI_DATA_READY has `fiData` array
    - CONSENT_STATUS_UPDATE has `data` detailing the status
    """
    type: str
    consentId: str
    status: Optional[str] = None
    fiData: Optional[List[Dict[str, Any]]] = None
    data: Optional[Dict[str, Any]] = None
