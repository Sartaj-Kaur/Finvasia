-- PURPOSE: This script contains the Data Definition Language (DDL) for creating 
-- all tables within the Supabase Postgres database. Running this in the Supabase 
-- SQL Editor will set up the entire relational schema required by the Finvasia backend.

-- Users Table: Stores the core profile data, OCEAN scores, and FinTwin archetype synced from the mobile app.
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    avatar_url TEXT,
    total_balance NUMERIC(12, 2) DEFAULT 0.00,
    archetype TEXT,
    ocean_openness INTEGER,
    ocean_conscientiousness INTEGER,
    ocean_extraversion INTEGER,
    ocean_agreeableness INTEGER,
    ocean_neuroticism INTEGER,
    income NUMERIC(12, 2),
    risk_appetite TEXT,
    inv_instrument_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions Table: Stores mock/seeded transactions and those synced from mobile receipt scanning.
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    merchant TEXT,
    date DATE NOT NULL,
    category TEXT NOT NULL, -- e.g., 'Essentials', 'Lifestyle', 'Subscriptions', 'Goals'
    is_scanned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Binder Sections Table: Tracks allocated and spent budget for the Budget Binder.
CREATE TABLE IF NOT EXISTS binder_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    allocated_budget NUMERIC(10, 2) DEFAULT 0.00,
    amount_spent NUMERIC(10, 2) DEFAULT 0.00,
    remaining_balance NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goals Table: Tracks user saving goals inside the Binder.
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_amount NUMERIC(10, 2) NOT NULL,
    target_date DATE,
    current_saved NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investments Table: Tracks fixed SIPs and dynamic surplus sweeps in the Investment Grid.
CREATE TABLE IF NOT EXISTS investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sip_amount NUMERIC(10, 2) DEFAULT 0.00,
    surplus_sweep_amount NUMERIC(10, 2) DEFAULT 0.00,
    total_invested NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mood Logs Table: Synced daily from the mobile app to correlate mood with spending patterns (Sticky Notes).
CREATE TABLE IF NOT EXISTS mood_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mood TEXT NOT NULL, -- 'Happy', 'Meh', 'Stressed'
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sticky Notes Table: Generated messages indicating triggers/warnings based on user data.
CREATE TABLE IF NOT EXISTS sticky_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    condition_triggered TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Twin Letters Table: Monthly generated LLM summaries acting as physical letters in the UI envelope.
CREATE TABLE IF NOT EXISTS twin_letters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insurance Products Table: Seeded static catalog for the Filing Cabinet.
CREATE TABLE IF NOT EXISTS insurance_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    monthly_cost NUMERIC(10, 2) NOT NULL,
    coverage_summary TEXT,
    exclusions TEXT,
    video_url TEXT,
    requirements TEXT,
    apply_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loan Products Table: Seeded static catalog for Loan Folders.
CREATE TABLE IF NOT EXISTS loan_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    interest_rate NUMERIC(5, 2) NOT NULL, -- e.g., 8.5 for 8.5%
    min_amount NUMERIC(12, 2),
    max_amount NUMERIC(12, 2),
    tenure_options TEXT, -- comma separated, e.g., "12,24,36"
    requirements TEXT,
    apply_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved Reels Table: Syncs user bookmarked financial videos which populate the Filing Cabinet / Loans.
CREATE TABLE IF NOT EXISTS saved_reels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    object_id UUID NOT NULL, -- References either an insurance_product or a loan_product
    object_type TEXT NOT NULL, -- 'insurance' or 'loan'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets Table: Data for calculating Wallet net worth.
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT,
    estimated_value NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Liabilities Table: Data for calculating Wallet net worth.
CREATE TABLE IF NOT EXISTS liabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT,
    outstanding_amount NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
