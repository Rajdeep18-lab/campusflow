# CampusFlow 🚀
> **Student Expense Tracker & Daily Task Manager**

CampusFlow is a minimal, modern, and high-performance SaaS productivity web application designed specifically for college students. It combines personal expense tracking and daily task management in one offline-first, local-storage powered application.

---

## 🌟 Overview & Vision

College students manage tight budgets and constant assignment deadlines. **CampusFlow** solves exactly two core problems with surgical focus:
1. **Personal Expense Management** (Tracking canteen bills, travel, books, hostel rent, and monthly spending limits).
2. **Daily Task Management** (Managing lab reports, assignment submission deadlines, and study goals).

---

## ✨ Features

- 📱 **Mobile-First Native App Experience**: Fully responsive across 320px, 375px, 425px, 768px, 1024px, and 1440px devices. Includes a sticky glassmorphic sidebar on desktop and a mobile bottom navigation bar on handhelds.
- 🎨 **SaaS Aesthetics**: Dark (`#020617`) and Light (`#F8FAFC`) modes, glassmorphism blur effects, Inter & Manrope typography, and micro-interactions.
- 💰 **Expense Tracking & Categorization**: Log expenses with categories (Food, Travel, Books, Hostel, Mess, Shopping, Recharge, Entertainment, Others), dates, notes, and rupee amounts (₹). Instant search, category filters, and sorting.
- 🎯 **Monthly Budgeting & Exceeded Alerts**: Set target monthly budget limits, track percentage usage bars, and receive real-time over-budget warning alerts.
- ✅ **Task Manager**: Organize daily goals with High (Red), Medium (Yellow), and Low (Green) priority badges, due dates, completion checkboxes, and task completion percentages.
- 📊 **Dynamic Analytics**: Real-time spending category distributions, budget progress, and task completion rates calculated strictly from your data. Zero fake data!
- 📅 **Interactive Monthly Calendar**: Grid view highlighting dates with expenses or due tasks, accompanied by a detailed daily breakdown pane.
- 🔍 **Command Palette (`Cmd/Ctrl + K`)**: Real-time modal search across expenses and tasks simultaneously.
- 🔐 **Privacy-First & 100% Offline**: Zero backend, zero Firebase, zero external API dependencies. All data is persisted safely in browser `localStorage` with JSON export/import & full app reset capabilities.

---

## 🛠️ Tech Stack

- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS v4 + Vanilla CSS Custom Tokens
- **Icons**: Lucide React
- **Persistence**: LocalStorage (Offline Native)

---

## 📁 Project Folder Structure

```
Expense/
├── public/
│   └── favicon.svg           # Custom Emerald SVG Favicon
├── src/
│   ├── components/           # Reusable UI Components & Modals
│   │   ├── BottomNav.jsx            # Mobile Bottom Navigation Bar (<768px)
│   │   ├── BudgetModal.jsx          # Set/Edit Monthly Budget Modal
│   │   ├── EmptyState.jsx           # Zero-Data Clean Visual State
│   │   ├── GlobalSearchModal.jsx    # Cmd/Ctrl+K Search Palette
│   │   ├── Navbar.jsx               # Topbar with Dynamic Greeting & Theme Toggle
│   │   ├── OnboardingModal.jsx      # First-Launch Experience Modal
│   │   ├── QuickAddExpenseModal.jsx # Log/Edit Expense Modal
│   │   ├── Sidebar.jsx              # Desktop Sticky Sidebar (≥768px)
│   │   ├── TaskModal.jsx            # Create/Edit Task Modal
│   │   ├── Toast.jsx                # Non-intrusive Toast Notifications
│   │   └── UserAvatar.jsx           # Dynamic Initials Avatar & Custom Upload
│   ├── context/
│   │   └── AppContext.jsx           # Global State, LocalStorage Sync & Calculations
│   ├── views/                # Core Main Module Views
│   │   ├── AnalyticsView.jsx        # Dynamic Category & Task Breakdown Charts
│   │   ├── CalendarView.jsx         # Monthly Interactive Grid & Date Details
│   │   ├── DashboardView.jsx        # Overview Command Center
│   │   ├── ExpenseView.jsx          # Expense Management, Filtering & Sorting
│   │   ├── SettingsView.jsx         # Profile, Theme, JSON Export/Import & Reset
│   │   └── TodoView.jsx             # Task Manager with Priority Badges & Tabs
│   ├── App.jsx               # Layout Shell & Router
│   ├── index.css             # Design Tokens & Utilities
│   └── main.jsx              # React Entrypoint
├── index.html                # Main HTML with SEO Meta & Typography
├── vercel.json               # SPA Rewrite Routing Config
└── vite.config.js            # Vite Compiler Config
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/your-username/campusflow.git

# 2. Navigate to project folder
cd campusflow

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

---

## 📦 Production Build & Deployment

```bash
# Build production bundle
npm run build

# Preview build locally
npm run preview
```

### Vercel Deployment
CampusFlow includes a pre-configured `vercel.json` for seamless zero-config deployment on Vercel:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 📄 License
MIT License. Built for students worldwide.
