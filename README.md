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
1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click **Connect** → **Connect your application**
4. Copy the connection string (replace `<password>` with your DB password)

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


