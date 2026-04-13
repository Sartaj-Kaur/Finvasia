# Monager Backend - Swagger UI Payloads

You can use these payloads to test the endpoints in the [Swagger UI](http://127.0.0.1:8000/docs) once the server is running.

---

### `POST /api/setu/consent/{user_id}`

Creates a consent request to Setu AA, redirecting the user.
Note: You don't need the `user_id` in the body if it's already a path parameter. The model in the backend expects both right now.

**Payload**:
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "mobile_number": "9999999999"
}
```

---

### `POST /api/setu/webhook`

Simulates the Setu `FI_DATA_READY` webhook triggered after a user grants consent and data is ready.

**Payload**:
```json
{
  "type": "FI_DATA_READY",
  "consentId": "your-consent-id-from-consent-endpoint",
  "status": "COMPLETED",
  "fiData": [
    {
      "fipID": "setu-fip",
      "data": [
        {
          "linkRefNumber": "ref-123",
          "maskedAccNumber": "****1234",
          "decryptedFI": {
            "account": {
              "type": "deposit",
              "transactions": {
                "transaction": [
                  {
                    "amount": "1240.50",
                    "narration": "UPI/935314560764/Zomato/zomato@axisbank",
                    "transactionTimestamp": "2024-03-15T14:30:00+05:30",
                    "txnId": "TXN123456",
                    "type": "DEBIT",
                    "mode": "UPI",
                    "currentBalance": "45230.50"
                  },
                  {
                    "amount": "299.00",
                    "narration": "UPI/Netflix/subscription",
                    "transactionTimestamp": "2024-03-16T10:00:00+05:30",
                    "txnId": "TXN987654",
                    "type": "DEBIT",
                    "mode": "UPI"
                  }
                ]
              }
            }
          }
        }
      ]
    }
  ]
}
```

---

### `POST /api/mood`

Logs a daily mood. Try passing "stressed" to see if it catches your spending patterns!

**Payload**:
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "mood": "stressed"
}
```

---

### `POST /api/letter/generate/{user_id}`

Generates the Monager twin letter using the Gemini API based on real data found in backend.
*No request body needed, just the `user_id` as a path parameter (URL string).*

---

### `GET /api/binder/{user_id}`

Fetches the binder, sticky notes, users info, and investments info.
*No request body needed, just the `user_id` as a path parameter (URL string).*

---

### `GET /api/insights/summary/{user_id}`

Generates percentage usage of categories and total investment portfolio values.
*No request body needed, just the `user_id` as a path parameter (URL string).*
