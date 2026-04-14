import uuid

def format_uid(firebase_uid: str) -> str:
    """Consistently converts a Firebase UID string into a valid PostgreSQL UUID"""
    if not firebase_uid:
        return firebase_uid
    try:
        uuid.UUID(firebase_uid)
        return firebase_uid
    except ValueError:
        return str(uuid.uuid5(uuid.NAMESPACE_OID, firebase_uid))
