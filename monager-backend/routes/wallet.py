from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/api/wallet", tags=["Wallet"])

# Dummy logic for the monager archetype
def determine_archetype():
    return {
        "archetype": "The Strategic Saver",
        "description": "You aggressively round up your expenses and allocate cashbacks. A solid foundation builder.",
        "icon": "💎"
    }

@router.get("/profile")
def get_wallet_profile():
    return determine_archetype()

@router.get("/cards")
def get_wallet_cards():
    return [
        {
            "bankName": "Axis Bank",
            "cardType": "Debit",
            "maskedNumber": "XXXX-XXXX-XXXX-9876",
            "balance": "62,289.25",
            "status": "Active"
        },
        {
            "bankName": "HDFC Bank",
            "cardType": "Credit",
            "maskedNumber": "XXXX-XXXX-XXXX-1234",
            "balance": "9,756.00 (Due)",
            "status": "Active"
        }
    ]

@router.get("/tags")
def get_wallet_tags():
    return [
        {"name": "🚗 Auto Loan Active", "type": "liability"},
        {"name": "🏠 Mortgage Paid", "type": "asset"},
        {"name": "📈 High-Yield Saver", "type": "asset"}
    ]
