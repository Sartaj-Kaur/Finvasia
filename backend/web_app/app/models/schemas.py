# PURPOSE: This file defines Pydantic models for the whole API.
# Pydantic is used to validate incoming HTTP request payloads, serialize
# outgoing responses, and automatically generate Swagger/OpenAPI documentation.

from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID
from datetime import date, datetime
from app.models.enums import BinderCategory, MoodType, Archetype

# --- Mobile Sync Requests ---

class UserProfileSyncRequest(BaseModel):
    user_id: UUID
    name: str
    ocean_openness: int = Field(ge=1, le=10)
    ocean_conscientiousness: int = Field(ge=1, le=10)
    ocean_extraversion: int = Field(ge=1, le=10)
    ocean_agreeableness: int = Field(ge=1, le=10)
    ocean_neuroticism: int = Field(ge=1, le=10)
    archetype: Archetype
    income: float
    risk_appetite: str
    inv_instrument_type: str

class TransactionSyncItem(BaseModel):
    amount: float
    merchant: str
    date: date
    category: BinderCategory
    is_scanned: bool = False

class TransactionsSyncRequest(BaseModel):
    user_id: UUID
    transactions: List[TransactionSyncItem]

class MoodSyncRequest(BaseModel):
    user_id: UUID
    mood: MoodType
    timestamp: datetime

# --- Letters / Envelope ---

class LetterContextRequest(BaseModel):
    user_id: UUID
    # Any additional context mobile app wants to force, otherwise backend fetches
    month: int
    year: int

# --- Loans ---

class EMICalculationRequest(BaseModel):
    loan_amount: float
    interest_rate: float
    tenure_months: int

class BinderImpactRequest(BaseModel):
    user_id: UUID
    monthly_cost: float

# --- Wallet ---

class AssetModel(BaseModel):
    name: str
    type: str
    estimated_value: float

class LiabilityModel(BaseModel):
    name: str
    type: str
    outstanding_amount: float

class WalletResponse(BaseModel):
    user_id: UUID
    total_assets: float
    total_liabilities: float
    net_worth: float
    assets: List[AssetModel]
    liabilities: List[LiabilityModel]
