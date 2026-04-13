import json
import os
import random
from datetime import datetime, timedelta

MOCK_FILE_PATH = os.path.join(os.path.dirname(__file__), "mock_fi_data.json")

def _load_mock_data():
    if os.path.exists(MOCK_FILE_PATH):
        with open(MOCK_FILE_PATH, "r") as f:
            return json.load(f)
    return {}

RAW_MOCK_DATA = _load_mock_data()

def get_fi_data_by_type(asset_type: str):
    return RAW_MOCK_DATA.get(asset_type.upper())

def get_all_transactions():
    """Aggregates all transactions from all asset types to form a comprehensive list."""
    transactions = []
    for asset_type, data in RAW_MOCK_DATA.items():
        if "transactions" in data and "transaction" in data["transactions"]:
            txn_list = data["transactions"]["transaction"]
            if isinstance(txn_list, list):
                transactions.extend(txn_list)
            else:
                transactions.append(txn_list)
    return transactions

def simulate_micro_investments():
    """
    Simulates three streams of micro investments:
    1. Transaction Round-ups
    2. Cashbacks
    3. End-of-month Budget Shards
    """
    round_ups = []
    cashbacks = []
    budget_shards = []

    # 1. Simulate Round-ups from real mock transactions
    txns = get_all_transactions()
    total_round_up = 0
    for txn in txns:
        if "amount" in txn and txn["amount"]:
            try:
                amt = float(txn["amount"])
                # Calculate round up to nearest 100
                round_up = (100 - (amt % 100)) if (amt % 100) != 0 else 0
                if round_up > 0:
                    total_round_up += round_up
            except ValueError:
                pass
    
    # 2. Simulate cashbacks (Randomly generated for demonstration)
    total_cashbacks = sum([float(random.randint(5, 50)) for _ in range(5)])

    # 3. Simulate End of month budget shards (Whatever is left from mock budget limits)
    budget_shards_total = random.choice([250.0, 110.5, 450.0, 0.0])

    return {
        "round_ups_total": round(total_round_up, 2),
        "cashbacks_total": round(total_cashbacks, 2),
        "budget_shards_total": round(budget_shards_total, 2),
        "grand_total": round(total_round_up + total_cashbacks + budget_shards_total, 2)
    }

