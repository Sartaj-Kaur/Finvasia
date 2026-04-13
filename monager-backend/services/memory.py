import os
from google import genai
from database import supabase
import uuid

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
else:
    client = None

async def embed_and_store_memory(user_id: str, content: str, memory_type: str = "insight"):
    """
    Creates a vector embedding for the content and stores it in Supabase pgvector.
    memory_type can be 'insight', 'monthly_letter', 'receipt_summary'
    """
    if not client:
        print("GEMINI_API_KEY missing, skipping memory embedding.")
        return False
        
    try:
        response = client.models.embed_content(
            model="gemini-embedding-001",
            contents=content
        )
        
        embedding_vector = response.embeddings[0].values
        
        # Store in Supabase
        supabase.table('memory_embeddings').insert({
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "content": content,
            "memory_type": memory_type,
            "embedding": embedding_vector
        }).execute()
        
        return True
    except Exception as e:
        print(f"Error embedding memory: {e}")
        return False
        
def get_pgvector_setup_sql():
    return """
    -- Run this inside your Supabase SQL Editor
    CREATE EXTENSION IF NOT EXISTS vector;

    CREATE TABLE IF NOT EXISTS memory_embeddings (
      id UUID PRIMARY KEY,
      user_id TEXT, -- Or UUID depending on your users table format
      content TEXT,
      memory_type TEXT,
      embedding VECTOR(3072),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
    );

    -- Function to search memories via cosine similarity
    CREATE OR REPLACE FUNCTION match_memories(
      query_embedding VECTOR(3072),
      match_threshold FLOAT,
      match_count INT,
      p_user_id TEXT -- or UUID
    )
    RETURNS TABLE (
      id UUID,
      content TEXT,
      similarity FLOAT
    )
    LANGUAGE SQL STABLE
    AS $$
      SELECT
        id,
        content,
        1 - (embedding <=> query_embedding) AS similarity
      FROM memory_embeddings
      WHERE user_id = p_user_id AND 1 - (embedding <=> query_embedding) > match_threshold
      ORDER BY similarity DESC
      LIMIT match_count;
    $$;
    """
