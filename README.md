<div align="center">

# ✦ M O N A G E R ✦
> **Built for the generation that wants their finances handled, not explained.**

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

<br/>

**Finvasia Innovation Hackathon 2026 — Open Innovation Track**  
*Pillars: Payments · Investment · Advisory*

<br/>
<hr/>
</div>

## 0. The Problem We Are Solving

<br/>
<div align="center">
  <h3><em>"Design the Financial Super App for Gen Z India"</em></h3>
</div>
<br/>

Gen Z earns money. Gen Z spends money. Gen Z saves almost nothing — not because they are irresponsible, but because every financial app ever built assumes they want to be their own CFO. They do not.

| The Assumption | The Reality | What Breaks |
| :--- | :--- | :--- |
| **Users will track expenses.** | Nobody opens a tracker voluntarily. | Budgeting apps die in week two. |
| **Users understand finance.** | Most Gen Z has zero financial education. | Investment feels scary, insurance is incomprehensible. |
| **Users will take action.** | Decision fatigue is real. | Money sits in savings doing nothing. |
| **Personalisation = colour themes.**| Behaviour is driven by personality. | Generic advice lands on deaf ears. |
| **One super app covers all needs.** | Five disconnected modules = five problems. | Users switch off entirely. |

<br/>

> **The Core Insight**  
> *"The generation that uses Zomato, Swiggy, Uber and Spotify — all passive, all automatic, all just works — has been handed financial apps that require active participation every single day. That is why they ignore them."*

Gen Z does not want to manage their finances. They want their finances managed. **The difference is everything.**

<br/>
<hr/>

## 1. What Is Monager?

**Monager is a passive financial operating system.**

It automatically organises your money, invests your surplus, tracks your behaviour, and explains everything back to you — in a voice that actually matches your personality. **You do not manage your money on Monager. Monager manages it for you. You just check in.**

Every service Gen Z loves is passive and automatic. Monager runs your finances the same way Spotify curates your music — intelligently and in a way that feels like it gets you.

<br/>
<hr/>

## 2. Two Products, One System

Monager is not one app. It is a system with two surfaces that work together. They share a single backend and a single database. Everything is in sync, always.

| Interface | Platform | Primary Purpose | Usage Frequency |
| :--- | :--- | :--- | :--- |
| **Monager Pocket** | `React Native (Expo)` | Your daily check-in companion. Scan receipts, log mood, read notes. | 30 seconds, on the go. |
| **Monager Desk** | `React / Vite / Three.js` | Your financial operating system. See the full picture — binder, investments. | Weekly or monthly deep dives. |

<br/>
<hr/>

## 3. The User Flow 

Monager Pocket (mobile) is your entry point — not the web app. You create your Monager on your phone first. The desk comes to life after.

<details open>
<summary><b>The Core Pipeline</b></summary>
<br/>

1. **Step 1 — Create Your Monager (Mobile):** Download Monager Pocket. Enter your name and monthly income. Takes 20 seconds.
2. **Step 2 — The OCEAN Quiz (Mobile):** 10 questions, 90 seconds. Monager uses a psychometric profile to assign a complementary twin archetype — The Anchor, The Planner, The Strategist, The Coach, or The Challenger. This archetype shapes every note, nudge, and letter.
3. **Step 3 — Connect Your Bank (Mobile):** Setu AA opens natively. Select your bank, approve consent. Setu fetches your last 3 months of real transactions securely. No credentials shared.
4. **Step 4 — Monager's Desk Appears (Web):** The web desk activates — pre-populated with real data, binder sections filled, Investment Punch Card ready. You just check in.
</details>

<br/>

<div align="center">
  <img width="1024" height="572" alt="Diagram: Monager — How It Works (OCEAN Quiz to Push Sync)" src="[INSERT_GITHUB_LINK_OR_FILE_PATH_TO_UPLOADED_IMAGE_HERE]" style="border-radius: 12px; border: 1px solid #333; box-shadow: 0 4px 15px rgba(0,0,0,0.2); margin: 20px 0;" />
</div>

<br/>
<hr/>

## 4. The Tech Stack

### Backend Architecture
* <kbd>FastAPI (Python)</kbd> Async, highly performant, auto Swagger documentation via endpoint decorators.
* <kbd>Supabase (PostgreSQL)</kbd> Handles structured relational data models and Realtime Pub/Sub websockets.
* <kbd>Setu Account Aggregator</kbd> Direct integration API for RBI-regulated open banking transactions.
* <kbd>Google Gemini API</kbd> Intelligent context-aware translation & the Monthly Letter Engine.

### Frontend (Web & Mobile)
* <kbd>React Native (Expo)</kbd> Builds the **Mobile App** for rapid cross-platform deployments with native integrations.
* <kbd>React + Vite</kbd> Builds the **Web Desk** utilizing full 3D interactive visualizations via `Three.js` & `React-Spring`.
* <kbd>Supabase Realtime</kbd> Subscriptions driving live UI updates instantly across screens without manual refresh.

<br/>
<hr/>

## 5. Setup Instructions (Running Monager Locally)

Monager is split into three independent environments. **Run the backend first**, then start up your frontends.

<details>
<summary><b>1. Auto-Pilot Backend (FastAPI)</b></summary>

```bash
cd monager-backend

# Setup your virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Environment Configuration (Fill in Supabase, Setu, and Gemini Keys)
cp .env.example .env

# Start the engine!
uvicorn main:app --reload --port 8000
```
> **Webhook Tunneling**: Run `ngrok http 8000` to expose your localhost. Copy the generated HTTPS link and update your Setu Sandbox Webhook URI to receive live mock transactions.
</details>

<details>
<summary><b>2. Monager Pocket (React Native / Expo)</b></summary>

```bash
cd frontend/mobile

# Install dependencies
npm install

# Environment Variables (Fill API endpoints, Supabase Keys, etc)
cp .env.example .env

# Launch the Metro Bundler
npx expo start
```
> Use the Expo Go app on your phone, or an iOS/Android simulator to view the mobile client.
</details>

<details>
<summary><b>3. Monager Desk (React / Vite Web App)</b></summary>

```bash
cd "frontend/web app"

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

> The development server will run on `http://localhost:5173`. Open it to view the full immersive 3D budget binder and wallet.
</details>

<br/>
<hr/>

## 6. Core API Endpoints

A quick overview of what powers the Monager machine:

| Method | Path | Description |
| :---: | :--- | :--- |
| `POST` | `/api/users/onboard` | Initiates the OCEAN Quiz and assigns a Twin Archetype. |
| `POST` | `/api/setu/webhook` | Listens for AA Data Sessions. Instantly grabs transactions passively. |
| `GET` | `/api/binder/overview/{user_id}` | Returns current spend vs budget per category, percentage utilisation, and top merchant per section. |
| `GET` | `/api/transactions/user/{user_id}`| Returns cleanly auto-categorised transactions. |
| `POST` | `/api/investment/sweep` | Sweeps unused budget surplus into a new stamp on your Investment Punch Card — micro investment, one stamp at a time. |
| `GET` | `/api/insights/summary/{user_id}`| Rule Engine evaluation generating personality-matched sticky notes. |

<br/>
<hr/>

## 7. Database Schema (Supabase)

Our schema revolves around making interactions trackable and relational:

* `users`: Core profiling, OCEAN traits, chosen twin archetype.
* `transactions`: Granular debit/credits fetched via Setu API and mapped to categories.
* `binder_sections`: Budget limits + utilization, updated continuously via triggers.
* `sticky_notes`: Historical ledger of push nudges sent (e.g., *"Food boundary crossed."*).
* `investments`: Tracks total stamps earned, surplus swept, SIP amount, and total invested on the Investment Punch Card.
* `mood_logs`: Tracks daily user emotional state vs spending.
* `twin_letters`: Caches the 150-word Gemini outputs so they're only generated once a month.
* `setu_sessions`: Maps Setu consent IDs and data session IDs to users. Persisted in the database — not memory — so webhook lookups survive server restarts.

<br/>
<hr/>

<div align="center">
  <h3>Ready to let go of your finances?</h3>
  <p><i>Made for Gen Z, by Gen Z.</i></p>
</div>
