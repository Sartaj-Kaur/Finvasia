> Built for the generation that wants their finances handled, not explained.

# Monager  ·  Finvasia Innovation Hackathon 2026

**Open Innovation Track**  
*Pillars: Payments · Investment · Advisory*

---

## 0. The Problem We Are Solving

**"Design the Financial Super App for Gen Z India"**

### The Real Problem
Gen Z earns money. Gen Z spends money. Gen Z saves almost nothing — not because they are irresponsible, but because every financial app ever built assumes they want to be their own CFO. They do not.

| The Assumption | The Reality | What Breaks |
| --- | --- | --- |
| Users will track expenses. | Nobody opens a tracker voluntarily. | Budgeting apps die in week two. |
| Users understand finance. | Most Gen Z has zero financial education. | Investment feels scary, insurance is incomprehensible. |
| Users will take action. | Decision fatigue is real. | Money sits in savings doing nothing. |
| Personalisation = colour themes. | Behaviour is driven by personality. | Generic advice lands on deaf ears. |
| One super app covers all needs. | Five disconnected modules = five problems. | Users switch off entirely. |

### The Insight
*"The generation that uses Zomato, Swiggy, Uber and Spotify — all passive, all automatic, all just works — has been handed financial apps that require active participation every single day. That is why they ignore them."*

Gen Z does not want to manage their finances. They want their finances managed. **The difference is everything.**

---

## 1. What Is Monager?

**Monager is a passive financial operating system.**

It automatically organises your money, invests your surplus, tracks your behaviour, and explains everything back to you — in a voice that actually matches who you are. **You do not manage your money on Monager. Monager manages it for you. You just check in.**

Every service Gen Z loves is passive and automatic. Monager runs your finances the same way Spotify curates your music — intelligently and in a way that feels like it gets you.

---

## 2. Two Products, One System

Monager is not one app. It is a system with two surfaces that work together. They share a single backend and a single database. Everything is in sync, always.

| Feature | Monager Pocket (Mobile) | Monager Desk (Web) |
| --- | --- | --- |
| **What it is** | Your daily check-in companion. | Your financial operating system. |
| **What you do here** | Scan receipts, log mood, read notes. | See the full picture — binder, investments. |
| **When you use it** | 30 seconds, on the go, anytime. | Weekly or monthly deep dives. |
| **Tech Stack** | React Native (Expo) | React / Next.js |

---

## 3. The User Flow 

Monager Pocket (mobile) is your entry point — not the web app. You create your Monager on your phone first. The desk comes to life after.
**Step 1** — Create Your Monager (Mobile): Download Monager Pocket. Enter your name and monthly income. Takes 20 seconds.
**Step 2** — The OCEAN Quiz (Mobile): 10 questions, 90 seconds, 5-point scale. Monager uses your Big Five psychometric profile to assign a complementary twin archetype — The Anchor, The Planner, The Strategist, The Coach, or The Challenger. This archetype shapes every note, nudge and letter you ever receive.
**Step 3** — Connect Your Bank (Mobile): Setu Account Aggregator opens in-app. Select your bank, approve consent. Setu fetches your last 3 months of real transactions. No credentials shared with Monager. RBI-regulated and fully secure.
**Step 4** — Monager's Desk Appears (Web): The moment consent is approved, your web desk activates — pre-populated with real data, binder sections filled, Investment Punch Card ready. Monager drops the first sticky note. From here, Monager runs. You just check in.

<img width="1024" height="572" alt="image" src="https://github.com/user-attachments/assets/e5764471-31fa-41c0-9fdc-482c830cfb62" />


---

## 4. The Tech Stack

**Backend**
* **Framework:** FastAPI (Python) - Async, fast, auto Swagger docs.
* **Database:** Supabase (PostgreSQL) - Handles Data and Realtime Pub/Sub.
* **Open Banking:** Setu Account Aggregator - Fetching real banks with user consent.
* **AI / LLM:** Google Gemini API - Used for deep translation & the Monthly Letter Engine.
* **Testing / Dev:** Uvicorn, ngrok.

**Frontend (Web & Mobile)**
* React Native (Expo) for Mobile.
* Next.js / React for Web Dashboard.
* Supabase Realtime subscriptions driving UI updates seamlessly.

---

## 5. Setup Instructions

To get the Monager Backend running locally:

```bash
# 1. Clone the repository
git clone https://github.com/Sartaj-Kaur/Finvasia.git
cd Finvasia/monager-backend

# 2. Setup your virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# 3. Install dependencies
pip install -r requirements.txt

# 4. Environment Configuration
# Copy `.env.example` to `.env` and fill out your variables:
# SUPABASE_URL, SUPABASE_KEY
# SETU_CLIENT_ID, SETU_CLIENT_SECRET, SETU_PRODUCT_INSTANCE_ID
# GEMINI_API_KEY
cp .env.example .env

# 5. Run the Server
uvicorn main:app --reload --port 8000
```
> **Webhook Tunneling**: Run `ngrok http 8000` to expose your localhost. Copy the HTTPS link generated and update your Setu Sandbox Webhook URI.

---

## 6. API Endpoints

A quick overview of what powers the Monager machine:

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/users/onboard` | Initiates the OCEAN Quiz and assigns a Twin Archetype. |
| `GET` | `/api/wallet/profile/{user_id}` | Fetches user net worth, wallet breakdown, and profile summary. |
| `POST` | `/api/setu/consent/{user_id}` | Hit the Setu AA and generate a redirect URL for user auth. |
| `POST` | `/api/setu/webhook` | Listens for AA Data Sessions. Instantly grabs transactions passively. |
| `GET` | `/api/binder/overview/{user_id}` | Returns current spend vs budget per category, percentage utilisation, and top merchant per section. |
| `GET` | `/api/transactions/user/{user_id}`| Returns cleanly auto-categorised transactions. |
| `POST` | `/api/investment/sweep` | Sweeps unused budget surplus into a new stamp on your Investment Punch Card — micro investment, one stamp at a time. |
| `GET` | `/api/insights/summary/{user_id}`| Rule Engine evaluation generating personality-matched sticky notes. |
| `POST` | `/api/mood` | Logs daily Stress/Happiness parameters for analytics correlation computation. |
| `POST` | `/api/letters/generate` | Calls Gemini API to author the deeply personal Monthly update. |

---

## 7. Database Schema (Supabase)

Our schema revolves around making interactions trackable and relational:
* **`users`**: Core profiling, OCEAN traits (`openness`, `neuroticism`, etc.), chosen twin archetype.
* **`transactions`**: Granular debits/credits fetched via Setu API and mapped to auto-categories.
* **`binder_sections`**: Budget limits + limits utilized, updated continuously via triggers.
* **`sticky_notes`**: Historical ledger of push nudges sent (e.g., "Food boundary crossed. 👀").
* **`investments`**: Tracks total stamps earned, surplus swept, SIP amount, and total invested on the Investment Punch Card.
* **`mood_logs`**: Tracks daily user emotional state vs spending.
* **`twin_letters`**: Caches the 150-word Gemini outputs so they're only generated once a month.
* **setu_sessions**: Maps Setu consent IDs and data session IDs to users. Persisted in the database — not memory — so webhook lookups survive server restarts.

---

> *"Built for the generation that wants their finances handled, not explained."*
