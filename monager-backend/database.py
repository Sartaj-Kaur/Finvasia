import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
# This handles loading variables from the .env file implicitly.
load_dotenv()

# Get Supabase credentials from the environment
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    # Fail fast if essential config is missing
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY in environment variables.")

# Create and export a single, reusable Supabase client instance
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
