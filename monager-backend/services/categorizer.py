def categorize(narration: str) -> str:
    """
    Categorize a transaction based on the narration string.
    Categories: food, subscriptions, transport, essentials, lifestyle
    """
    if not narration:
        return "lifestyle"
        
    # Normalize narration for case-insensitive matching
    lower_narration = narration.lower()
    
    # Food category keywords
    if any(keyword in lower_narration for keyword in [
        "zomato", "swiggy", "dominos", "mcdonalds", "kfc", 
        "restaurant", "food", "burger", "pizza"
    ]):
        return "food"
        
    # Subscriptions category keywords
    if any(keyword in lower_narration for keyword in [
        "netflix", "spotify", "prime", "hotstar", "youtube premium", 
        "subscription", "apple"
    ]):
        return "subscriptions"
        
    # Transport category keywords
    if any(keyword in lower_narration for keyword in [
        "uber", "ola", "rapido", "petrol", "fuel", 
        "irctc", "train", "flight", "bus"
    ]):
        return "transport"
        
    # Essentials category keywords
    if any(keyword in lower_narration for keyword in [
        "rent", "electricity", "water", "gas", "bigbasket", 
        "dmart", "grofers", "blinkit", "grocery"
    ]):
        return "essentials"
        
    # Default lifestyle category keywords (and fallback)
    # The default is "lifestyle" so even if keywords don't match, we return it
    return "lifestyle"
