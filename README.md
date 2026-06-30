# 🎓 Adaptive Academic System

An intelligent academic planning and productivity platform for students, featuring AI-powered resume enhancement, DSA practice scheduling, GPA strategy planning, and more.

## ✨ Features

- **📄 AI Resume Generator** - Create professional resumes with AI-powered text enhancement using Groq (Llama 3.3)
- **🧠 DSA Practice Scheduler** - Daily coding practice with streak tracking, topic rotation, and contest notifications
- **🎯 GPA Strategizer** - Plan and optimize your academic performance
- **📚 Flashcards** - Study with interactive flashcards
- **📅 Calendar** - Track assignments, exams, and deadlines
- **🎓 Elective Planner** - Choose electives strategically
- **⏱️ Focus Mode** - Distraction-free study sessions with fullscreen enforcement

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 
- MongoDB Atlas account (or local MongoDB)
- Clerk account (for authentication)
- Groq account (for AI features)

---

## 🔑 API Keys & Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend/` folder by copying `.env.example`:

```bash
cd backend
cp .env.example .env
```

Fill in the following values:

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `DB_NAME` | Your MongoDB database name | Choose any name, e.g., `academic_system_db` |
| `MONGODB_URI` | MongoDB connection string | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) → Create Cluster → Connect → Get URI |
| `PORT` | Backend server port | Use `8000` |
| `CORS_ORIGIN` | Frontend URL | Use `*` for development |
| `CLERK_PUBLISHABLE_KEY` | Clerk public key | [Clerk Dashboard](https://dashboard.clerk.com) → Your App → API Keys |
| `CLERK_SECRET_KEY` | Clerk secret key | [Clerk Dashboard](https://dashboard.clerk.com) → Your App → API Keys |
| `GROQ_API_KEY` | Groq API key for AI | [Groq Console](https://console.groq.com) → API Keys → Create (FREE) |

### Frontend Environment Variables

Create a `.env` file in the `devhacks-frontend/` folder by copying `.env.example`:

```bash
cd devhacks-frontend
cp .env.example .env
```

Fill in the following values:

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk public key (same as backend) | [Clerk Dashboard](https://dashboard.clerk.com) → Your App → API Keys |
| `VITE_BASE_URL` | Backend API URL | Use `http://localhost:8000/api/v1` for local development |

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/DevHack-7-0/Team10.git
cd Team10
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd devhacks-frontend
npm install
```

### 4. Set up environment files

Copy the example files and fill in your API keys (see above):

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend  
cp devhacks-frontend/.env.example devhacks-frontend/.env
```

### 5. Run the application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd devhacks-frontend
npm run dev
```

The app will be available at `http://localhost:5173` (check terminal if port varies)

---

## 🔗 Getting Free API Keys

### Groq API (AI Enhancement - FREE)
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up / Log in
3. Go to **API Keys**
4. Click **Create API Key**
5. Copy and use in `GROQ_API_KEY`

### Clerk (Authentication - FREE tier)
1. Go to [clerk.com](https://clerk.com)
2. Sign up and create an application
3. Go to **API Keys** in dashboard
4. Copy **Publishable Key** and **Secret Key**

### MongoDB Atlas (Database - FREE tier)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas) and sign up
2. Click **Build a Database** → choose **Free (M0)** tier → pick a cloud provider and region → click **Create**
3. Set a **username** and **password** for your DB user → click **Create User**
4. Under **Network Access** in the left sidebar → click **Add IP Address**
   - Enter `0.0.0.0/0` in the Access List Entry field (this allows connections from any IP — fine for development/demo, avoid in production)
   - Make sure the **"This entry is temporary"** toggle is **OFF**
   - Click **Confirm**
5. Go to **Database** in the left sidebar → click **Connect** → **Drivers** → copy the connection string
6. Your connection string looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net`
   - Replace `<password>` with your DB user password
   - Do **not** include the database name in the URI — set it separately as `DB_NAME` in your `.env`

---

## 🚀 Deployment

This project is deployed with the **backend on Railway** and the **frontend on Vercel**.

### Backend → Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo** → select this repo
3. Once the service is created, go to **Settings** → **Source** → click **Add Root Directory** → set it to `/backend`
   > This tells Railway to look inside the `backend/` folder for `package.json` and run all commands from there
4. Under **Settings** → **Build** → set **Custom Build Command** to `npm install`
5. Under **Settings** → **Deploy** → click **+ Start Command** → set it to `node server.js`
   > Use `node` directly, not `nodemon` — nodemon is for development only (file watching has no use in production)
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

   > ⚠️ Do **not** wrap values in quotes — Railway reads them literally, so `"value"` becomes `"value"` with the quotes included, breaking connections like MongoDB URI

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

> **Note:** `devhacks-frontend/vercel.json` contains a rewrite rule that redirects all routes to `index.html` — this is required for React Router to work correctly on Vercel (otherwise refreshing on `/dashboard` returns a 404).

### Clerk Configuration for Deployment

This project uses Clerk's **Development instance** (`pk_test_` keys) which works fine for demo/portfolio purposes.

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
Team10/
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
- **Styling:** Custom CSS with glassmorphism

---

## 👥 Team

**Team 10** - DevHack 7.0


