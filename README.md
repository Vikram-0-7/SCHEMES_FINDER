# 🏛️ SchemesMadeSimple

An AI-powered platform that **discovers, extracts, and catalogs government welfare schemes** from official Indian government web portals (`.gov.in`) using an automated web scraping and LLM extraction pipeline. Search for welfare schemes, check eligibility, get legal guidance, and view personalized recommendation profiles in seconds.

---

## 📸 Screenshots

### 🏠 Home Page

<p align="center">
  <img src="./web_photos/home.png" alt="Home Page" width="900"/>
</p>

### 🔍 All Schemes Directory

<p align="center">
  <img src="./web_photos/schemes.png" alt="Home Page" width="900"/>
</p>
### 🧭 Discover & Filter Page

<p align="center">
  <img src="./web_photos/live_search.png" alt="Home Page" width="900"/>
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| **🔍 Live Web Search** | Dynamic scraping of `.gov.in` sites using DuckDuckGo search + HTTP extraction |
| **🤖 AI Info Extractor** | Parses unstructured government text into structured database schemas using Groq Llama 3 |
| **💬 AI Copilot Widget** | Context-aware floating assistant on all pages with voice controls and automated UI actions |
| **⚖️ AI Legal Helper** | Dedicated full-page chat interface explaining rights and application guidelines |
| **👤 Profile Personalization** | Logged-in dashboard with 4-level fallback demographics matching (occupation, state, age) |
| **📦 Seeded Database** | Pre-populated with 24 major Indian government schemes (Central and State level) |
| **🎨 Custom Design System** | Rich glassmorphism aesthetics and dark mode tokens built using Vanilla CSS |

---

## 🏗️ Architecture

```mermaid
graph TD
    A[React + TypeScript Frontend] <-->|REST API| B[FastAPI Backend]
    B <-->|SQLAlchemy ORM| C[Neon PostgreSQL]
    B -->|Site-scoped Search| D[DuckDuckGo Search]
    B -->|Scrapes Text| E[Government Websites]
    B -->|AI Chat & Extraction| F[Groq — Llama 3]
```

### How It Works

1. **Search & Cache Check** — When a user searches for a scheme (e.g., *"PM Kisan"*), the backend checks Neon PostgreSQL first for fast local retrieval.
2. **Dynamic Live Search** — If insufficient matches exist locally, the backend initiates a search query targeted to `site:gov.in` using DuckDuckGo.
3. **BeautifulSoup Scraping** — The backend fetches page HTML asynchronously via `httpx` and parses it with `BeautifulSoup` to extract clean body text, removing redundant tags (scripts, styles, headers, and footers).
4. **AI-Powered Schema Extraction** — The parsed text (limited to 3,000 characters to conserve LLM contexts) is sent to Groq Llama 3 (`llama-3.3-70b-versatile`) with a strict prompt to structure it into a validated JSON schema.
5. **Database Commit** — The backend checks for duplicate records (matching against titles), updates Category count relations, saves new schemes to PostgreSQL, and returns them to the client.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **TypeScript 6** (Vite 8 SPA)
- **Vanilla CSS** with customizable theme variables and glassmorphism styling
- **Lucide React** for modern, lightweight vector iconography
- **React Router DOM v7** for single page app client-side routing
- **Axios** for backend REST API integration

### Backend
- **FastAPI 0.115** with asynchronous router endpoints
- **SQLAlchemy 2.0** ORM for structured database operations
- **Neon PostgreSQL** serverless relational cloud database
- **httpx** + **BeautifulSoup 4** for asynchronous parallel scraping
- **DuckDuckGo Search (DDGS)** for site-scoped web crawling queries
- **Groq Python SDK** for Llama 3 LLM completions
- **Alembic 1.13** for database schema migrations
- **PyJWT** + **Bcrypt** for session authentication

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.12+**
- **Node.js 20+** and **npm**
- A **Neon PostgreSQL** cloud database (or any PostgreSQL instance)
- A **Groq API key** ([console.groq.com](https://console.groq.com))

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/schemas.git
cd schemas
```

### 2. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv

# Windows (PowerShell)
.venv\Scripts\Activate.ps1
# macOS/Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the root `schemas/` directory:

```env
GROQ_API_KEY=gsk_your_groq_api_key_here
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

Start the FastAPI application server:

```bash
python -m uvicorn app.main:app --reload --port 8000
```

The API docs will be available at `http://localhost:8000/docs`.

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start the local development server
npm run dev
```

The application client will open at `http://localhost:5173`.

---

## 📁 Project Structure

```
schemas/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app entrypoint
│   │   ├── config.py          # Environment settings
│   │   ├── database.py        # SQLAlchemy engine & session configurations
│   │   ├── models.py          # SQLAlchemy ORM models (Scheme, User, Category)
│   │   ├── schemas.py         # Pydantic schemas
│   │   ├── seed.py            # Seeding script for 24 initial schemes
│   │   ├── routers/
│   │   │   ├── auth.py          # JWT user registration and login
│   │   │   ├── chatbot.py       # Groq-powered Chatbot & AI Copilot endpoints
│   │   │   ├── discover.py      # Profile builders and live search scraper
│   │   │   ├── personalized.py  # Tiered recommendation engine
│   │   │   └── schemes.py       # Scheme details and category APIs
│   │   └── services/
│   │       ├── groq_service.py  # LLM query templates and JSON extraction
│   │       └── scraper_service.py # DDG searching & BeautifulSoup parser
│   ├── sql_app.db             # Local dev database backup
│   └── requirements.txt       # Backend Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main routes definition
│   │   ├── index.css          # Design tokens and custom theme styles
│   │   ├── pages/             # Pages (Home, AllSchemes, Discover, LegalHelper, etc.)
│   │   ├── components/        # Components (ChatWidget, Navbar, Footer, SchemeCard)
│   │   ├── services/          # API services wrapper (Axios)
│   │   └── types/             # Type definitions
│   ├── package.json
│   └── vite.config.ts
├── walkthrough.md             # Build walkthrough documentation
├── verification_report.md     # Feature verification report
├── .env                       # Root environment parameters
└── README.md                  # Project documentation
```

---

## 🔐 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection URL string (Neon PostgreSQL recommended) | Yes |
| `GROQ_API_KEY` | API key from Groq Cloud Console | Yes |
#
