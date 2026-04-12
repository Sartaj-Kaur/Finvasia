# PURPOSE: This file centrally manages configuration variables (like Supabase credentials)
# by securely reading them from the environment or `.env` file using pydantic-settings.
# It also provides an instantiated Supabase client to be imported by services.

from pydantic_settings import BaseSettings
from supabase import create_client, Client
from functools import lru_cache

class Settings(BaseSettings):
    supabase_url: str
    supabase_key: str

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

# Centralized Supabase client instance
settings = get_settings()
supabase: Client = create_client(settings.supabase_url, settings.supabase_key)
