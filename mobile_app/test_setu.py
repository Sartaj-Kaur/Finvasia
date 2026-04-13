import os
import httpx
from dotenv import load_dotenv
from datetime import datetime, timezone

# Load env
load_dotenv(override=True)

SETU_BASE_URL = os.getenv("SETU_BASE_URL", "https://fiu-sandbox.setu.co")
SETU_CLIENT_ID = os.getenv("SETU_CLIENT_ID")
SETU_CLIENT_SECRET = os.getenv("SETU_CLIENT_SECRET")

print(f"Testing with ID: {SETU_CLIENT_ID}")
print(f"Testing with Secret: {SETU_CLIENT_SECRET[:4]}...{SETU_CLIENT_SECRET[-4:]}")

async def test_consent():
    url = f"{SETU_BASE_URL}/consents"
    headers = {
        "x-client-id": SETU_CLIENT_ID,
        "x-client-secret": SETU_CLIENT_SECRET,
        "Content-Type": "application/json"
    }
    
    body = {
        "consentDuration": {"unit": "MONTH", "value": 24},
        "dataRange": {
            "from": "2023-01-01T00:00:00Z",
            "to": datetime.now(timezone.utc).isoformat()
        },
        "vua": "9999999999@setu-sandbox",
        "purpose": {"code": "101", "text": "Wealth management service"},
        "fiTypes": ["DEPOSIT"],
        "consentTypes": ["TRANSACTIONS", "SUMMARY", "PROFILE"],
        "fetchType": "PERIODIC",
        "frequency": {"unit": "MONTH", "value": 1}
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, headers=headers, json=body)
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_consent())
