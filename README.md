<div align="center">

# ✦ M O N A G E R ✦
> **Built for the generation that wants their finances handled, not explained.**

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

**Finvasia Innovation Hackathon 2026 — Open Innovation Track**  
*Pillars: Payments · Investment · Advisory*

---
</div>

## 0. The Problem We Are Solving

**"Design the Financial Super App for Gen Z India"**

Gen Z earns money. Gen Z spends money. Gen Z saves almost nothing — not because they are irresponsible, but because every financial app ever built assumes they want to be their own CFO. They do not.

| The Assumption | The Reality | What Breaks |
| :--- | :--- | :--- |
| Users will track expenses. | Nobody opens a tracker voluntarily. | Budgeting apps die in week two. |
| Users understand finance. | Most Gen Z has zero financial education. | Investment feels scary, insurance is incomprehensible. |
| Users will take action. | Decision fatigue is real. | Money sits in savings doing nothing. |
| Personalisation = colour themes. | Behaviour is driven by personality. | Generic advice lands on deaf ears. |
| One super app covers all needs. | Five disconnected modules = five problems. | Users switch off entirely. |

### The Insight
> *"The generation that uses Zomato, Swiggy, Uber and Spotify — all passive, all automatic, all just works — has been handed financial apps that require active participation every single day. That is why they ignore them."*

Gen Z does not want to manage their finances. They want their finances managed. **The difference is everything.**

---

## 1. What Is Monager?

**Monager is a passive financial operating system.**

It automatically organises your money, invests your surplus, tracks your behaviour, and explains everything back to you — in a voice that actually matches who your personality is. **You do not manage your money on Monager. Monager manages it for you. You just check in.**

Every service Gen Z loves is passive and automatic. Monager runs your finances the same way Spotify curates your music — intelligently and in a way that feels like it gets you.

---

## 2. Two Products, One System

Monager is not one app. It is a system with two surfaces that work together. They share a single backend and a single database. Everything is in sync, always.

| Feature | Monager Pocket (Mobile) | Monager Desk (Web) |
| --- | --- | --- |
| **What it is** | Your daily check-in companion. | Your financial operating system. |
| **What you do here** | Scan receipts, log mood, read notes. | See the full picture — binder, investments. |
| **When you use it** | 30 seconds, on the go, anytime. | Weekly or monthly deep dives. |
| **Tech Stack** | React Native (Expo) | React / Vite / Three.js |

---

## 3. The User Flow 

Monager Pocket (mobile) is your entry point — not the web app. You create your Monager on your phone first. The desk comes to life after.

* **Step 1 — Create Your Monager (Mobile):** Download Monager Pocket. Enter your name and monthly income. Takes 20 seconds.
* **Step 2 — The OCEAN Quiz (Mobile):** 10 questions, 90 seconds. Monager uses a psychometric profile to assign a complementary twin archetype — The Anchor, The Planner, The Strategist, The Coach, or The Challenger. This archetype shapes every note, nudge, and letter.
* **Step 3 — Connect Your Bank (Mobile):** Setu AA opens natively. Select your bank, approve consent. Setu fetches your last 3 months of real transactions securely. No credentials shared.
* **Step 4 — Monager's Desk Appears (Web):** The web desk activates — pre-populated with real data, binder sections filled, Investment Punch Card ready. You just check in.

<div align="center">
  <img width="1024" height="572" alt="Diagram: Monager — How It Works (OCEAN Quiz to Push Sync)" src="[INSERT_GITHUB_LINK_OR_FILE_PATH_TO_UPLOADED_IMAGE_HERE]" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin: 20px 0;" />
</div>

---

## 4. The Tech Stack

### Backend
* **Framework:** FastAPI (Python) - Async, fast, auto Swagger docs.
* **Database:** Supabase (PostgreSQL) - Handles API layers and Realtime Pub/Sub.
* **Open Banking:** Setu Account Aggregator - API for real bank transactions.
* **AI / LLM:** Google Gemini API - Intelligent deep translation & Monthly Letter Engine.

### Frontend (Web & Mobile)
* **Mobile APP:** React Native (Expo). Built for rapid deployments natively.
* **Web Desk:** React + Vite. Features full 3D interactive visualizations using Three.js & React-Spring.
* **State & Data:** Supabase Realtime subscriptions driving UI updates instantly across screens.

---

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


---

## 6. Core API Endpoints

A quick overview of what powers the Monager machine:

| Method | Path | Description |
| :---: | :--- | :--- |
| `POST` | `/api/users/onboard` | Initiates the OCEAN Quiz and assigns a Twin Archetype. |
| `POST` | `/api/setu/webhook` | Listens for AA Data Sessions. Instantly grabs transactions passively. |
| `GET` | `/api/binder/overview/{user_id}` | Calculates current spend vs Budget, generating the Github-style heatmap. |
| `GET` | `/api/transactions/user/{user_id}`| Returns cleanly auto-categorised transactions. |
| `POST` | `/api/investment/sweep` | Sweeps the unused budget directly into market instruments. |
| `GET` | `/api/insights/summary/{user_id}`| Rule Engine evaluation generating personality-matched sticky notes. |

---

## 7. Database Schema (Supabase)

Our schema revolves around making interactions trackable and relational:
* `users`: Core profiling, OCEAN traits, chosen twin archetype.
* `transactions`: Granular debit/credits fetched via Setu API and mapped to categories.
* `binder_sections`: Budget limits + utilization, updated continuously via triggers.
* `sticky_notes`: Historical ledger of push nudges sent (e.g., *"Food boundary crossed. 👀"*).
* `investments`: Ledger for end-of-month piggy-bank sweeps.
* `mood_logs`: Tracks daily user emotional state vs spending.
* `twin_letters`: Caches the 150-word Gemini outputs so they're only generated once a month.

---

<div align="center">
  <h3>Ready to let go of your finances?</h3>
  <p><i>Made for Gen Z, by Gen Z.</i></p>
</div>
