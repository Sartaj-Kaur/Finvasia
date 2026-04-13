# PURPOSE: This file manages the user's Wallet.
# It pulls from the `users`, `assets`, and `liabilities` tables to compile a holistic
# snapshot of the user's net worth (Total Assets minus Total Liabilities).

from app.config import supabase

def get_wallet_profile(user_id: str):
    """
    Fetches the full wallet profile including assets, liabilities, and net worth.
    """
    # 1. Fetch User Base Data
    user_res = supabase.table("users").select("name, avatar_url, total_balance, archetype").eq("id", user_id).execute()
    
    # 2. Fetch Assets
    assets_res = supabase.table("assets").select("*").eq("user_id", user_id).execute()
    assets = assets_res.data
    
    # 3. Fetch Liabilities
    liabs_res = supabase.table("liabilities").select("*").eq("user_id", user_id).execute()
    liabilities = liabs_res.data
    
    # 4. Calculation
    total_assets = sum([a['estimated_value'] for a in assets]) if assets else 0
    total_liabilities = sum([l['outstanding_amount'] for l in liabilities]) if liabilities else 0
    net_worth = total_assets - total_liabilities
    
    return {
        "profile": user_res.data[0] if user_res.data else None,
        "total_assets": total_assets,
        "total_liabilities": total_liabilities,
        "net_worth": net_worth,
        "assets": assets,
        "liabilities": liabilities
    }
