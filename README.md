# 🎓 Adaptive Academic System

An intelligent academic planning and productivity platform for students, featuring AI-powered resume enhancement, DSA practice scheduling, GPA strategy planning, and more.

## ✨ Features

### 📄 AI Resume Generator
Build a professional resume with a live side-by-side preview. Fill in personal info, education, work experience, skills, projects, and certifications. Click **Enhance with AI** to send all text fields through the Groq API (Llama 3.3 70B), which rewrites descriptions in a more professional, impactful tone. You can revert to your original text at any time. Export the final resume as a PDF using html2pdf.

### 🧠 DSA Practice Scheduler
A structured daily coding practice system. Every day gets a problem auto-selected based on a weekly difficulty schedule (Mon–Thu: Easy, Fri–Sat: Medium, Sunday: Hard). Problems are picked with topic rotation so you don't repeat the same category back-to-back. Features:
- **Streak tracking** — consecutive days solved with milestone badges
- **Weekly plan view** — see all 7 problems for the current week at a glance
- **Hints** — context-sensitive hints based on the problem's topic (hash maps, two pointers, DFS, etc.)
- **Skip** — get a fresh problem if you want a different one (disabled after solving)
- **Contests tab** — links to LeetCode, Codeforces, CodeChef, and AtCoder contest pages
- **All Problems tab** — filterable by topic and difficulty, with solved problems highlighted
- All progress (streak, solved list, total days) stored in `localStorage` per user

### 🎯 GPA Strategizer
A multi-step wizard that calculates the exact grade required in each subject to hit your target CGPA. Steps:
1. Enter your current semester's courses and their credits
2. Enter your semester number, previous credits earned, current CGPA, and target CGPA
3. Rate each subject as Easy/Medium/Hard and set the competition level (Low/Medium/High)
4. The optimizer runs a **hill-climbing algorithm** that respects a grade hierarchy constraint (Easy ≥ Medium ≥ Hard) and factors in competition levels, then outputs the minimum grade needed per subject (AA/AB/BB/BC etc.)
- Handles edge cases: target CGPA mathematically unreachable (shows max possible), target already exceeded (tells you you're underestimating yourself)
- Auto-pulls your enrolled subjects from context if already set up

### 📚 Flashcards
Create, manage, and study flashcards organized by subject. Features:
- Create cards with a question, answer, subject, and difficulty (Easy/Medium/Hard)
- Browse your card collection filtered by subject
- **Quiz Mode** — 3D flip-card animation, tap to reveal answer, then rate yourself as "Got It" or "Need Practice"
- Progress bar during quiz, session summary showing mastered vs. still-learning count
- Cards stored in MongoDB, synced to your account across devices

### ⏱️ Focus Mode
A fullscreen distraction-blocking study session tied to a specific task. Features:
- **Enforced fullscreen** — entering exits fullscreen counts as an interruption
- **Tab switch detection** — switching tabs or losing window focus triggers a "Focus Locked" blocker overlay
- **Study material upload** — drag-and-drop or select a PDF/image to display alongside the timer during the session; uploaded to the backend server and rendered in-app
- **Smart completion logic** — if you end a session before completing 50% of the estimated task time, the task is NOT marked as completed (you get a warning)
- **XP system** — sessions earn XP tracked in MongoDB
- Timer tracks actual focused seconds (pauses when interrupted)

### 🎓 Elective Planner
Helps students choose electives that fit their schedule and career goals. Enter your branch, career interests (e.g. AI/ML, Web Dev, Finance), and which core course slots are already taken. The planner:
- Filters electives from a built-in IIT Dharwad database (odd + even semester)
- Scores each elective based on career match and branch relevance
- Shows slot conflicts with your core courses
- Manual slot conflict checker for verifying any elective manually

### 📅 Calendar
Visual calendar to track scheduled tasks, assignments, and deadlines. Integrated with the task system — tasks with scheduled dates appear on the calendar.

### 📊 Dashboard & Analytics
The main hub showing:
- **Academic Health Score** (0–100) — calculated from study patterns, streaks, and session consistency
- **Weekly stats** — bar chart of study minutes, sessions, and XP earned over the last 7 days
- **Today's tasks** — prioritized list with urgency scores, estimated time, status, and a direct link to Focus Mode for each task
- **Level & XP progress** — gamified progression system

### 🏃 Subjects & Task Management
- Add subjects with custom names, icons, and colors
- Tasks are auto-generated daily based on your subjects or created manually
- Each task has priority, estimated minutes, scheduled date, and completion percentage
- Task status transitions: Not Started → In Progress → Completed

---

## 🏗️ Architecture Overview

```
┌──────────────────────────┐
│   React Frontend (Vite)  │
│   Deployed on Vercel     │
└────────────┬─────────────┘
             │ login / session token
             ▼
┌──────────────────────────┐
│      Clerk Auth          │
│  (identity bridge —      │
│   issues & verifies JWT) │
└────────────┬─────────────┘
             │ verified request
             ▼
┌──────────────────────────┐        ┌─────────────────────┐
│  Express.js Backend      │───────►│   Groq API          │
│  Deployed on Railway     │        │   (Llama 3.3 70B)   │
│                          │        │   AI resume enhance │
│                          │        └─────────────────────┘
│                          │        ┌─────────────────────┐
│                          │───────►│   Cloudinary        │
└────────────┬─────────────┘        │   (file uploads)    │
             │                      └─────────────────────┘
             ▼
┌──────────────────────────┐
│   MongoDB Atlas          │
│   (tasks, flashcards,    │
│    XP, streaks)          │
└──────────────────────────┘
```

**Request flow:**
1. User logs in via Clerk on the frontend (Google/GitHub OAuth or email)
2. Clerk issues a session token to the frontend
3. Every API call from frontend includes this token in the `Authorization` header
4. Express middleware verifies the token with Clerk on every protected route — unauthenticated requests are rejected
5. Controllers query MongoDB for user data (tasks, flashcards, XP, streaks)
6. AI resume enhancement calls Groq API **from the backend only** — the API key is never exposed to the frontend
7. Study material uploads (Focus Mode) go to the backend server via multipart form upload and are served back to the frontend

**Key design decisions:**
- DSA problems and scheduling logic live entirely on the frontend (`localStorage`) — no backend needed for that feature
- Elective planner uses a hardcoded IIT Dharwad course database on the frontend
- GPA hill-climbing algorithm runs client-side — pure JavaScript, no API call

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas account (or local MongoDB)
- Clerk account (for authentication)
- Groq account (for AI features)
- Cloudinary account (for file uploads)

---

## 🔗 Getting Free API Keys

Get all your keys before setting up env files.

### MongoDB Atlas (Database - FREE tier)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas) and sign up
2. Click **Build a Database** → choose **Free (M0)** tier → pick a cloud provider and region → click **Create**
3. Set a **username** and **password** for your DB user → click **Create User**
4. Under **Network Access** in the left sidebar → click **Add IP Address**
   - Enter `0.0.0.0/0` in the Access List Entry field (allows connections from any IP — fine for development/demo, avoid in production)
   - Make sure the **"This entry is temporary"** toggle is **OFF**
   - Click **Confirm**
5. Go to **Database** in the left sidebar → click **Connect** → **Drivers** → copy the connection string
6. Your connection string looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net`
   - Replace `<password>` with your DB user password
   - Do **not** include the database name in the URI — set it separately as `DB_NAME` in your `.env`

### Clerk (Authentication - FREE tier)
1. Go to [clerk.com](https://clerk.com) and sign up
2. Click **Create application** → name it → enable **Google** and **GitHub** under SSO connections
3. Go to **Configure** → **API Keys** → copy:
   - **Publishable Key** (`pk_test_...`) → use as `CLERK_PUBLISHABLE_KEY` in backend and `VITE_CLERK_PUBLISHABLE_KEY` in frontend (same key for both)
   - **Secret Key** (`sk_test_...`) → use as `CLERK_SECRET_KEY` in backend only
4. For local development, Clerk auto-detects `localhost` as the dev host — no extra configuration needed
5. For deployed environments, see the **Clerk Configuration for Deployment** section below

### Groq API (AI Enhancement - FREE)
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up / Log in
3. Go to **API Keys** → click **Create API Key**
4. Copy and use in `GROQ_API_KEY`

### Cloudinary (File Uploads - FREE tier)
1. Go to [cloudinary.com](https://cloudinary.com) and sign up
2. On the Dashboard, copy your:
   - **Cloud Name** → use as `CLOUDINARY_CLOUD_NAME`
   - **API Key** → use as `CLOUDINARY_API_KEY`
   - **API Secret** → use as `CLOUDINARY_API_SECRET`
3. No extra configuration needed — the first upload will automatically create an `adaptive-academic-system` folder in your media library to keep files organized

---

## 🔑 Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend/` folder:

```bash
cp backend/.env.example backend/.env
```

Fill in the following values:

| Variable | Description | Value |
|----------|-------------|-------|
| `DB_NAME` | MongoDB database name | Choose any name e.g. `academic_system_db` |
| `MONGODB_URI` | MongoDB connection string | From MongoDB Atlas → Connect → Drivers |
| `PORT` | Backend server port | `8000` |
| `CORS_ORIGIN` | Allowed frontend origin | `*` for local dev; your Vercel URL in production |
| `CLERK_PUBLISHABLE_KEY` | Clerk public key | `pk_test_...` from Clerk Dashboard |
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_test_...` from Clerk Dashboard |
| `GROQ_API_KEY` | Groq API key for AI | From Groq Console |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | From Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key | From Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | From Cloudinary Dashboard |

### Frontend Environment Variables

Create a `.env` file in the `devhacks-frontend/` folder:

```bash
cp devhacks-frontend/.env.example devhacks-frontend/.env
```

Fill in the following values:

| Variable | Description | Value |
|----------|-------------|-------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk public key (same as backend) | `pk_test_...` from Clerk Dashboard |
| `VITE_BASE_URL` | Backend API URL | `http://localhost:8000/api/v1` for local dev |

---

## 📦 Installation & Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/avkhalkar/adaptive-academic-system.git
cd adaptive-academic-system
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../devhacks-frontend
npm install
```

### 3. Run the application

> ⚠️ **Start the backend first** — the frontend makes API calls on load, so if the backend isn't running you'll see errors

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Wait until you see `MongoDB connected` and `Server running on port 8000`, then verify by visiting:
```
http://localhost:8000/api/v1/healthcheck
```
You should see `{ "status": "success", "message": "Router is working!" }`

**Terminal 2 - Frontend:**
```bash
cd devhacks-frontend
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🌐 Deployment

This project is deployed with the **backend on Railway** and the **frontend on Vercel**.

### Backend → Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo** → select this repo
3. Once the service is created, go to **Settings** → **Source** → click **Add Root Directory** → set it to `/backend`
   > This tells Railway to look inside the `backend/` folder for `package.json` and run all commands from there
4. Under **Settings** → **Build** → set **Custom Build Command** to `npm install`
5. Under **Settings** → **Deploy** → click **+ Start Command** → set it to `node server.js`
   > Use `node` directly, not `nodemon` — nodemon is for development only
6. Go to **Variables** and add all backend env vars:

| Variable | Value |
|----------|-------|
| `DB_NAME` | your database name e.g. `adaptive_academic_db` |
| `MONGODB_URI` | your MongoDB Atlas connection string (no quotes) |
| `PORT` | `8000` |
| `CORS_ORIGIN` | `*` |
| `CLERK_PUBLISHABLE_KEY` | your `pk_test_...` key |
| `CLERK_SECRET_KEY` | your `sk_test_...` key |
| `GROQ_API_KEY` | your Groq API key |
| `CLOUDINARY_CLOUD_NAME` | your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | your Cloudinary API secret |

   > ⚠️ Do **not** wrap values in quotes — Railway reads them literally, so `"value"` becomes `"value"` with quotes included, breaking connections like MongoDB URI

7. Go to **Settings** → **Networking** → click **Generate Domain** to get your public backend URL (e.g. `https://your-app.up.railway.app`)

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project** → import this repo
3. Set **Root Directory** to `devhacks-frontend`
4. Build settings are auto-detected (Vite): Build Command `npm run build`, Output Directory `dist`, Install Command `npm install`
5. Add these environment variables:

| Variable | Value |
|----------|-------|
| `VITE_CLERK_PUBLISHABLE_KEY` | your Clerk publishable key (`pk_test_...`) — **same key as `CLERK_PUBLISHABLE_KEY` in backend** |
| `VITE_BASE_URL` | your Railway backend URL + `/api/v1` e.g. `https://your-app.up.railway.app/api/v1` |

6. Click **Deploy**

> **Note:** `devhacks-frontend/vercel.json` contains a rewrite rule that redirects all routes to `index.html` — required for React Router to work on Vercel (otherwise refreshing on `/dashboard` returns 404).

### Clerk Configuration for Deployment

This project uses Clerk's **Development instance** (`pk_test_` keys) which works fine for demo/portfolio purposes.

> **Why not a Production instance?** Clerk's production instances require a custom domain — they don't accept free subdomains like `*.vercel.app`. Since this project is deployed on Vercel without a custom domain, the development instance is the only option.

#### 1. Enable SSO (Social Login)
Go to Clerk Dashboard → **Configure** → **User & authentication** → **SSO connections** → enable:
- **GitHub** (uses shared credentials in dev — no setup needed)
- **Google** (uses shared credentials in dev — no setup needed)

#### 2. Set Fallback Development Host
Go to **Configure** → **Paths** → set **Fallback development host** to:
```
https://adaptive-academic-system.vercel.app
```
> This tells Clerk which domain to use when auth is initiated from an external source (e.g. OAuth redirects)

#### 3. Set Component Paths to Development Host
Go to **Configure** → **Paths** → scroll to **Component paths** → for all **4** options below:
- `<SignIn />`
- `<SignUp />`
- **Signing Out**
- **OAuth consent**

For each one:
- Select **"Sign-in page on development host"** (or "Page on development host")
- Set the path field to `/` (just a forward slash, nothing else)

> ⚠️ **This is the most critical step.** By default, Clerk sets all these to "Account Portal" which points to `https://kind-magpie-xx.clerk.accounts.dev/...` — a Clerk-hosted page that has no knowledge of your Vercel app. After OAuth (Google/GitHub login), Clerk redirects to this URL which returns a 404. Setting all 4 to development host with `/` fixes this by redirecting back to your own domain instead.

---

## 📁 Project Structure

```
adaptive-academic-system/
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API routes
│   │   └── middlewares/  # Auth & validation
│   ├── .env.example      # Example environment file
│   └── app.js            # Express app setup
│
├── devhacks-frontend/    # React + Vite frontend
│   ├── src/
│   │   ├── constants/    # DSA questions, config
│   │   ├── context/      # React context providers
│   │   ├── hooks/        # Custom hooks
│   │   └── *.jsx         # Page components
│   ├── .env.example      # Example environment file
│   ├── vercel.json       # Vercel SPA routing config (rewrites all routes to index.html)
│   └── vite.config.js    # Vite configuration
│
└── README.md             # This file
```

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** Clerk
- **AI:** Groq API (Llama 3.3 70B)
- **File Uploads:** Cloudinary
- **Styling:** Custom CSS with glassmorphism

---

## 👥 Team

**Team 10** - DevHack 7.0
