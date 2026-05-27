<div align="center">

<img src="https://img.shields.io/badge/FinTrack-Pro-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyek0xMSAxN3YtNkg5bDMtNCAzIDRoLTJ2NmgtMnoiLz48L3N2Zz4=" alt="FinTrack Pro"/>

# 💰 FinTrack Pro

### A Modern Personal Finance Tracker — Built for Real Life

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)

**[🌐 Live Demo](#)** • **[📸 Screenshots](#-screenshots)** • **[🚀 Quick Start](#-quick-start)** • **[📡 API Docs](#-api-documentation)**

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [Author](#-author)

---

## 🧭 Overview

**FinTrack Pro** is a full-stack personal finance management web application designed to help users take complete control of their financial life.

From tracking daily expenses to setting long-term savings goals, FinTrack Pro combines a **clean modern UI** with **powerful features** like AI-powered expense insights, recurring transaction automation, multi-currency support, and detailed analytics — all secured with JWT authentication.

> 🎯 Built as part of an internship/hackathon assessment to demonstrate full-stack development skills using the MERN stack.

---

## ✨ Features

### 🔐 Authentication & Security
- User registration and login
- JWT-based authentication with protected routes
- bcrypt password hashing
- Rate limiting and helmet security headers

### 📊 Dashboard
- Total balance, income & expense summary cards
- Monthly analytics with area charts
- Category-wise pie chart breakdown
- Recent transactions preview
- Budget limit warning alerts

### 💳 Transaction Management
- Add, edit, delete income/expense transactions
- 10 categories: Food, Travel, Shopping, Salary, Bills, Entertainment, Healthcare, Education, Investment, Others
- Pagination (10 per page)
- Search by title
- Filter by category, type, and date range
- Export to **CSV** and **PDF**

### 🔁 Recurring Transactions
- Set up daily, weekly, monthly, or yearly recurring transactions
- Auto-processed via background cron scheduler
- Enable/disable without deleting

### 🎯 Savings Goals
- Create goals with target amounts and deadlines
- Visual progress bars
- Mark goals as completed
- 9 goal categories (Vacation, House, Car, etc.)

### 🤖 AI Expense Insights
- Powered by Claude AI (Anthropic)
- Analyzes last 50 transactions
- Provides 3–5 personalized financial tips
- Actionable and friendly advice

### 📄 Reports & Export
- Export transactions to **CSV**
- Download **PDF reports** with jsPDF
- Monthly summary table

### 📧 Email Reminders
- Weekly email digest of upcoming recurring transactions
- Beautiful HTML email template
- Toggle on/off from profile settings

### 🌍 Multi-Currency Support
- 7 currencies: USD, EUR, GBP, INR, JPY, CAD, AUD
- Auto-formatting based on user preference
- Stored per user account

### 🌙 Dark / Light Mode
- System preference detection
- Manual toggle
- Persisted across sessions

### 📱 Responsive Design
- Mobile-first design
- Works perfectly on phones, tablets, and desktops
- Collapsible sidebar on mobile

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js 18 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS v3 | Styling & responsive design |
| React Router v6 | Client-side routing |
| Axios | HTTP requests |
| Recharts | Charts & data visualization |
| React Hot Toast | Toast notifications |
| Lucide React | Icons |
| jsPDF + AutoTable | PDF export |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Nodemailer | Email reminders |
| node-cron | Recurring transaction scheduler |
| Helmet | Security headers |
| express-rate-limit | API rate limiting |

### AI & External Services
| Service | Purpose |
|---|---|
| Anthropic Claude API | AI expense insights |
| MongoDB Atlas | Cloud-hosted database |
| Gmail SMTP | Email reminders |

### Deployment
| Platform | Service |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Database hosting |

---

## 📸 Screenshots

> 📷 Screenshots will be added after deployment.

| Page | Preview |
|---|---|
| 🔐 Login | *Coming soon* |
| 📊 Dashboard | *Coming soon* |
| 💳 Transactions | *Coming soon* |
| 📈 Analytics | *Coming soon* |
| 🎯 Savings Goals | *Coming soon* |
| 🤖 AI Insights | *Coming soon* |
| 👤 Profile | *Coming soon* |

---

## 📁 Project Structure

fintrack-pro/
│
├── client/                          # React + Vite Frontend
│   ├── public/
│   └── src/
│       ├── assets/                  # Images, icons
│       ├── charts/                  # Recharts wrappers
│       │   ├── AreaChart.jsx
│       │   ├── PieChart.jsx
│       │   └── BarChart.jsx
│       ├── components/
│       │   ├── ai/                  # AI insights panel
│       │   ├── dashboard/           # Stats, recent transactions
│       │   ├── layout/              # Sidebar, Navbar, AppLayout
│       │   ├── recurring/           # Recurring transaction UI
│       │   ├── savings/             # Savings goal cards & forms
│       │   ├── transactions/        # Table, form, filters
│       │   └── ui/                  # Button, Card, Modal, Badge...
│       ├── context/                 # Auth, Theme, Currency context
│       ├── hooks/                   # Custom React hooks
│       ├── layouts/                 # Protected route layout
│       ├── pages/                   # Full pages (Dashboard, Login...)
│       ├── services/                # Axios API service functions
│       └── utils/                   # Helpers (CSV, PDF, currency...)
│
└── server/                          # Node + Express Backend
├── config/                      # DB connection, Mailer config
├── controllers/                 # Route handler logic
├── middleware/                  # Auth guard, error handler
├── models/                      # Mongoose schemas
├── routes/                      # Express route definitions
└── utils/                       # Token, email templates, scheduler

---

## 🚀 Quick Start

### Prerequisites
Make sure you have these installed:
- [Node.js](https://nodejs.org/) v18 or higher
- [Git](https://git-scm.com/)
- A [MongoDB Atlas](https://mongodb.com/atlas) account (free)
- A [Gmail](https://gmail.com) account (for email reminders)
- An [Anthropic](https://console.anthropic.com/) API key (for AI insights)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/srivastavsuyash/fintrack-pro.git
cd fintrack-pro
```

---

### 2️⃣ Setup the Backend

```bash
cd server
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

✅ You should see:
🚀 Server running on port 5000
✅ MongoDB Connected
✅ Recurring scheduler started

---

### 3️⃣ Setup the Frontend

```bash
cd client
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

✅ Open browser at: **http://localhost:5173**

---

## 🔑 Environment Variables

### `server/.env`

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fintrack
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
CLIENT_URL=http://localhost:5173
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Documentation

### Base URL
http://localhost:5000/api

### 🔐 Auth Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| GET | `/auth/profile` | Get user profile | ✅ |
| PUT | `/auth/profile` | Update profile | ✅ |

### 💳 Transaction Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/transactions` | Get all (paginated) | ✅ |
| POST | `/transactions` | Create transaction | ✅ |
| PUT | `/transactions/:id` | Update transaction | ✅ |
| DELETE | `/transactions/:id` | Delete transaction | ✅ |
| GET | `/transactions/summary` | Dashboard summary | ✅ |

### 🎯 Savings Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/savings` | Get all goals | ✅ |
| POST | `/savings` | Create goal | ✅ |
| PUT | `/savings/:id` | Update goal | ✅ |
| DELETE | `/savings/:id` | Delete goal | ✅ |

### 🔁 Recurring Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/recurring` | Get all recurring | ✅ |
| POST | `/recurring` | Create recurring | ✅ |
| PUT | `/recurring/:id` | Update recurring | ✅ |
| DELETE | `/recurring/:id` | Delete recurring | ✅ |

### 🤖 AI Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/ai/insights` | Get AI insights | ✅ |

---

## ☁️ Deployment

### 🗄️ Step 1 — MongoDB Atlas
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free account
2. Create a **free M0 cluster**
3. Create database user with username & password
4. Network Access → Add IP `0.0.0.0/0`
5. Connect → Drivers → Copy connection string
6. Paste as `MONGO_URI` in your `.env`

### ⚙️ Step 2 — Backend on Render
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect GitHub repo
4. Root Directory: `server`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Add all environment variables
8. Deploy ✅

### 🌐 Step 3 — Frontend on Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import GitHub repo
3. Root Directory: `client`
4. Framework: Vite
5. Add `VITE_API_URL` = your Render URL + `/api`
6. Deploy ✅

---

## 🔮 Future Improvements

- [ ] Google OAuth login
- [ ] Bank account sync via Plaid API
- [ ] Mobile app with React Native
- [ ] Shared expenses / split bills
- [ ] Investment portfolio tracker
- [ ] SMS bill payment reminders
- [ ] Multi-language support
- [ ] PWA / Offline mode
- [ ] Advanced AI budgeting
- [ ] Tax report generation

---

## 🤝 Contributing

```bash
# 1. Fork the repo
# 2. Create your branch
git checkout -b feature/AmazingFeature

# 3. Commit changes
git commit -m "feat: add AmazingFeature"

# 4. Push
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

---

## 👨‍💻 Author

**Suyash Srivastava**

[![GitHub](https://img.shields.io/badge/GitHub-@srivastavsuyash-181717?style=flat-square&logo=github)](https://github.com/srivastavsuyash)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Suyash%20Srivastava-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/suyashsrivastava-abes/)

---

<div align="center">

⭐ **If you found this project helpful, please give it a star!** ⭐

Made with ❤️ by Suyash Srivastava

</div>

