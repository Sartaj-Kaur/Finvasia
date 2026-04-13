from datetime import datetime
import uuid
from supabase import Client
from .investment import sweep_surplus

async def run_rules(user_id: str, supabase_client: Client) -> list:
    """
    Fetches user's income and all binder_sections, then checks conditions
    and creates sticky notes if triggered (and not already triggered this month).
    """
    created_notes = []
    
    # 1. Fetch user to get income
    user_res = supabase_client.table('users').select('income').eq('id', user_id).execute()
    if not user_res.data:
        return []
    income = float(user_res.data[0].get('income', 0))
    if income <= 0:
        return []
        
    # 2. Fetch all binder sections
    sections_res = supabase_client.table('binder_sections').select('*').eq('user_id', user_id).execute()
    sections = sections_res.data
    
    # Calculate total spent
    total_spent = sum(float(s.get('amount_spent', 0)) for s in sections)
    
    # Quick lookup for categories
    section_map = {s['category'].lower(): s for s in sections}
    
    # 3. Check existing sticky notes for this month to avoid duplicates
    now = datetime.now()
    start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0).isoformat()
    notes_res = supabase_client.table('sticky_notes').select('condition_triggered')\
        .eq('user_id', user_id)\
        .gte('created_at', start_of_month)\
        .execute()
    
    existing_conditions = {n['condition_triggered'] for n in notes_res.data}
    
    def add_sticky_note(condition: str, content: str):
        if condition not in existing_conditions:
            supabase_client.table('sticky_notes').insert({
                'id': str(uuid.uuid4()),
                'user_id': user_id,
                'content': content,
                'condition_triggered': condition,
                'created_at': datetime.utcnow().isoformat()
            }).execute()
            created_notes.append({'condition': condition, 'content': content})
            existing_conditions.add(condition)

    # Rule 1: food_overspend
    if 'food' in section_map:
        food_spent = float(section_map['food'].get('amount_spent', 0))
        if food_spent > (income * 0.20):
            add_sticky_note(
                "food_overspend", 
                "You've spent a big chunk on food this month. Monager noticed — maybe cook once in a while? 👀"
            )
            
    # Rule 2: lifestyle_overrun
    if 'lifestyle' in section_map:
        life_spent = float(section_map['lifestyle'].get('amount_spent', 0))
        life_budget = float(section_map['lifestyle'].get('allocated_budget', 0))
        if life_spent > life_budget:
            add_sticky_note(
                "lifestyle_overrun", 
                "Lifestyle binder is looking full. Monager's keeping an eye on things."
            )
            
    # Rule 3: essentials_critical
    if 'essentials' in section_map:
        ess_budget = float(section_map['essentials'].get('allocated_budget', 0))
        ess_rem = float(section_map['essentials'].get('remaining_balance', 0))
        if ess_rem < (ess_budget * 0.10):
            add_sticky_note(
                "essentials_critical", 
                "Essentials are almost maxed out. Monager has flagged this — check what's eating into it."
            )
            
    # Rule 4: subscription_spike
    if 'subscriptions' in section_map:
        sub_spent = float(section_map['subscriptions'].get('amount_spent', 0))
        if sub_spent > (income * 0.10):
            add_sticky_note(
                "subscription_spike", 
                "That's a lot of subscriptions this month. Monager counted them — want a review?"
            )
            
    # Rule 5: surplus_detected
    if total_spent < (income * 0.60):
        if "surplus_detected" not in existing_conditions:
            # Sweeping 30% of the surplus
            surplus = (income - total_spent)
            amount_to_sweep = surplus * 0.30
            await sweep_surplus(user_id, amount_to_sweep, supabase_client)
            
            add_sticky_note(
                "surplus_detected", 
                "You've been careful this month. Monager swept some surplus toward your investment pool."
            )
            
    return created_notes
