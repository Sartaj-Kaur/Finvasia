# PURPOSE: This script populates the Supabase database with initial mock data.
# It is essential for populating the Filing Cabinet (insurance policies), Loan Folders,
# and some realistic 25-30 Indian Rupee (INR) transactions for testing the UI components 
# locally without needing a live mobile frontend or bank sync.

from app.config import supabase
from app.models.enums import BinderCategory
from datetime import date, timedelta
import random
import uuid

def clear_existing_seed():
    print("Clearing existing mock data (handled by cascade typically but safe to do here)...")
    # For a real DB, you might not do this, but for sandbox we can purge.
    # We will assume we just insert new data.

def create_mock_user():
    print("Creating mock user...")
    user_id = str(uuid.uuid4())
    data = {"id": user_id, "name": "Test User", "archetype": "Balanced", "income": 100000.0}
    supabase.table("users").insert(data).execute()
    return user_id

def insert_static_products():
    print("Seeding Insurance Policies...")
    insurance_data = [
        {"name": "Health Shield Pro", "type": "Health", "monthly_cost": 850.00, "coverage_summary": "5L Cover + Maternity", "apply_link": "https://example.com/apply"},
        {"name": "Term Life Gold", "type": "Life", "monthly_cost": 1200.00, "coverage_summary": "1Cr Cover", "apply_link": "https://example.com/apply"},
        {"name": "Motor Basic", "type": "Auto", "monthly_cost": 400.00, "coverage_summary": "Third party + Theft", "apply_link": "https://example.com/apply"},
        {"name": "Home Secure", "type": "Home", "monthly_cost": 500.00, "coverage_summary": "Fire & Burglary 10L", "apply_link": "https://example.com/apply"},
        {"name": "Cyber Safe", "type": "Cyber", "monthly_cost": 150.00, "coverage_summary": "Identity theft protection", "apply_link": "https://example.com/apply"}
    ]
    supabase.table("insurance_products").insert(insurance_data).execute()

    print("Seeding Loan Products...")
    loan_data = [
        {"name": "Instant Personal Loan", "type": "Personal", "interest_rate": 10.5, "min_amount": 50000, "max_amount": 500000, "tenure_options": "12,24,36"},
        {"name": "Dream Home Loan", "type": "Home", "interest_rate": 8.5, "min_amount": 1500000, "max_amount": 10000000, "tenure_options": "120,240,360"},
        {"name": "DriveEasy Auto Loan", "type": "Auto", "interest_rate": 9.2, "min_amount": 100000, "max_amount": 2000000, "tenure_options": "36,48,60"},
        {"name": "Education Plus", "type": "Student", "interest_rate": 8.0, "min_amount": 200000, "max_amount": 3000000, "tenure_options": "60,84,120"}
    ]
    supabase.table("loan_products").insert(loan_data).execute()

def insert_mock_transactions(user_id: str):
    print("Seeding 30 Mock Transactions...")
    merchants = {
        BinderCategory.ESSENTIALS: ["Amazon Grocery", "Local Pharmacy", "Electricity Board", "Rent", "Uber Commute"],
        BinderCategory.LIFESTYLE: ["Swiggy", "Zomato", "Myntra", "PVR Cinemas", "Starbucks"],
        BinderCategory.SUBSCRIPTIONS: ["Netflix", "Spotify", "Amazon Prime", "Hotstar"],
    }
    
    transactions = []
    base_date = date.today()
    
    for _ in range(30):
        # Pick random category (excluding goals for simple spending)
        cat = random.choice([BinderCategory.ESSENTIALS, BinderCategory.LIFESTYLE, BinderCategory.SUBSCRIPTIONS])
        merchant = random.choice(merchants[cat])
        
        # Ranges based on Indian INR (monthly cost)
        if merchant == "Rent":
            amt = random.uniform(15000, 25000)
        elif cat == BinderCategory.SUBSCRIPTIONS:
            amt = random.uniform(149, 999)
        else:
            amt = random.uniform(200, 2500)
            
        t_date = base_date - timedelta(days=random.randint(0, 30))
        
        transactions.append({
            "user_id": user_id,
            "amount": round(amt, 2),
            "merchant": merchant,
            "date": t_date.isoformat(),
            "category": cat.value,
            "is_scanned": random.choice([True, False])
        })
        
    supabase.table("transactions").insert(transactions).execute()

if __name__ == "__main__":
    print("Starting Seed Process...")
    # NOTE: Run this cautiously as it attempts to write to the connected Supabase instance.
    try:
        user_id = create_mock_user()
        insert_static_products()
        insert_mock_transactions(user_id)
        print("Seed completed successfully. Test User ID:", user_id)
    except Exception as e:
        print("Error during seeding:", str(e))
