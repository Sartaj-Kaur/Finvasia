# PURPOSE: This file defines custom enumerated types used across the application.
# It ensures type safety and consistency for variables like spending categories,
# mood states, or FinTwin archetypes instead of relying on loose strings.

from enum import Enum

class BinderCategory(str, Enum):
    ESSENTIALS = "Essentials"
    LIFESTYLE = "Lifestyle"
    SUBSCRIPTIONS = "Subscriptions"
    GOALS = "Goals"

class MoodType(str, Enum):
    HAPPY = "Happy"
    MEH = "Meh"
    STRESSED = "Stressed"

class Archetype(str, Enum):
    # Depending on your exact list:
    SAVER = "Saver"
    SPENDER = "Spender"
    BALANCED = "Balanced"
    CAUTIOUS = "Cautious"
    RISK_TAKER = "Risk Taker"

class ProductType(str, Enum):
    INSURANCE = "insurance"
    LOAN = "loan"
