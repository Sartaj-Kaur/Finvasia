from supabase import Client

def get_portfolio_value(total_invested: float, months: int = 12) -> float:
    """
    Calculate simulated portfolio value at 12% XIRR annualized
    Formula: total_invested * (1 + 0.12/12)^months
    """
    return total_invested * ((1 + 0.12 / 12) ** months)

async def sweep_surplus(user_id: str, surplus_amount: float, supabase_client: Client):
    """
    Sweeps a portion of the surplus into investments.
    surplus_amount passed should already be calculated as 30% of the total saved for the month.
    """
    if surplus_amount <= 0:
        return
        
    # Fetch investments record for user
    res = supabase_client.table('investments').select('*').eq('user_id', user_id).execute()
    investments = res.data
    
    if investments and len(investments) > 0:
        inv = investments[0]
        new_surplus_sweep = float(inv.get('surplus_sweep_amount', 0)) + surplus_amount
        new_total_invested = float(inv.get('total_invested', 0)) + surplus_amount
        
        # Update the record in Supabase
        supabase_client.table('investments').update({
            'surplus_sweep_amount': new_surplus_sweep,
            'total_invested': new_total_invested
        }).eq('id', inv['id']).execute()
    else:
        # Create it if it doesn't exist
        supabase_client.table('investments').insert({
            'user_id': user_id,
            'sip_amount': 0,
            'surplus_sweep_amount': surplus_amount,
            'total_invested': surplus_amount
        }).execute()
