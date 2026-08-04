<div align="center">

  # 🎓 CampusFlow
  ### **Minimalist Student Expense Tracker & Daily Task Manager**

  [![Live Demo](https://img.shields.io/badge/Live_Demo-🚀_Visit_CampusFlow-10B981?style=for-the-badge&logo=githubpages&logoColor=white)](https://rajdeep18-lab.github.io/campusflow/)
  [![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Deployed-222222?style=for-the-badge&logo=github&logoColor=white)](https://rajdeep18-lab.github.io/campusflow/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

  <p align="center">
    <b>CampusFlow</b> is an offline-first SaaS productivity web application crafted specifically for college students. It seamlessly unifies expense tracking, monthly budgeting, assignment deadlines, and daily task management into one intuitive dashboard.
  </p>

  <p align="center">
    <a href="https://rajdeep18-lab.github.io/campusflow/"><strong>Explore Live Application »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Rajdeep18-lab/campusflow/issues">Report Bug</a>
    ·
    <a href="https://github.com/Rajdeep18-lab/campusflow/issues">Request Feature</a>
  </p>
</div>

---

## 🔗 Live Application

> 🚀 **Deployed App:** [https://rajdeep18-lab.github.io/campusflow/](https://rajdeep18-lab.github.io/campusflow/)

Experience **CampusFlow** directly in your browser without requiring registration or server dependencies. All data remains 100% private in your browser's local storage.

---

## 📖 Table of Contents

- [Overview & Problem Statement](#-overview--problem-statement)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Screenshots](#-project-screenshots)
- [Folder Structure](#-folder-structure)
- [Getting Started & Installation](#-getting-started--installation)
- [Deployment Guide](#-deployment-guide)
- [Architecture & State Management](#-architecture--state-management)
- [Future Improvements](#-future-improvements)
- [License](#-license)
- [Author](#-author)

---

## 🌟 Overview & Problem Statement

College students manage tight budgets alongside relentless project deadlines, assignment submissions, and exam schedules. Existing apps are often overcomplicated, require forced user logins, or split finances and tasks into disparate tools.

**CampusFlow** solves this with surgical focus:
1. **Financial Discipline**: Tracking food, canteen, books, travel, mess, and hostel rent with automated monthly budget usage indicators and over-budget warnings.
2. **Academic & Task Management**: Managing daily study goals, lab reports, and assignments with priority badges (High, Medium, Low) and due date filters.
3. **Privacy & Offline Access**: Native `localStorage` sync with full JSON backup, import, and data reset capabilities.

---

## ✨ Key Features

- 💰 **Expense Tracking**: Log expenses instantly with custom categories (Food 🍲, Travel 🚌, Books 📚, Hostel 🏠, Mess 🍱, Shopping 🛍️, Recharge 📱, Entertainment 🎬, Others 💡), dates, notes, and rupee amounts (₹). Includes category filtering and search.
- 📊 **Budget Management**: Set a monthly budget limit, monitor dynamic progress bars, and receive warning alerts when expenses exceed your budget.
- ✅ **Task Management**: Create and track daily tasks with priority tags (*High*, *Medium*, *Low*), completion toggles, and status filters (*All*, *Today*, *Pending*, *Completed*).
- 📅 **Interactive Calendar View**: A clean monthly grid highlighting days with recorded expenses or scheduled deadlines, with an instant daily breakdown drawer.
- 📈 **Analytics Dashboard**: Real-time spending category distribution charts, daily averages, task completion metrics, and automated smart savings tips.
- 🌙 **Dark / Light Theme**: Built-in sleek dark mode (`#020617`) and crisp light mode (`#F8FAFC`) with CSS design tokens and smooth theme switching.
- 📱 **Fully Responsive Layout**: Adaptive layout featuring a glassmorphic sidebar on desktop (`≥768px`) and a mobile bottom navigation bar (`<768px`).
- 💾 **Local Storage Persistence**: 100% offline-first storage with zero latency, zero backend overhead, and JSON backup export/import tools.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Library** | [React 19](https://react.dev/) |
| **Build Tool & Bundler** | [Vite 8](https://vite.dev/) |
| **Styling & Design Tokens** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom CSS Variables |
| **Iconography** | [Lucide React](https://lucide.dev/) |
| **Visual Effects** | Canvas Confetti (Task Celebrations) & Chart.js |
| **Data Persistence** | HTML5 Web Storage API (`localStorage`) |
| **Deployment Platform** | GitHub Pages (`gh-pages`) & Vercel-ready |

---

## 📸 Project Screenshots

<div align="center">
  <img src="src/assets/hero.png" alt="CampusFlow Dashboard Overview" width="900" style="border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" />
  <p><em>CampusFlow Command Center — Overview of Expenses, Monthly Budget, and Active Tasks</em></p>
</div>

<br/>

| Module | Preview Description |
| :--- | :--- |
| 📊 **Dashboard & Metrics** | Overview cards for Today's Expenses, Monthly Budget Remaining, and Pending Tasks. |
| 💸 **Expense Manager** | Searchable expense table with category filters and action triggers. |
| 🎯 **Task Board** | Priority-tagged todo list with instant completion toggles and celebration effects. |
| 📈 **Analytics Center** | Category spending pie charts, daily spending averages, and completion statistics. |

---

## 📁 Folder Structure

```
campusflow/
├── public/
│   ├── favicon.svg             # Emerald SVG Favicon
│   └── icons.svg               # SVG Icon Sprite Map
├── src/
│   ├── assets/                 # Static Application Assets & Images
│   │   ├── hero.png            # Main Dashboard Screenshot Preview
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/             # Reusable UI Components & Modal Dialogs
│   │   ├── BottomNav.jsx       # Mobile Bottom Navigation Bar (<768px)
│   │   ├── BudgetModal.jsx     # Set / Edit Monthly Budget Modal
│   │   ├── EmptyState.jsx      # Clean Zero-Data Visual Fallback State
│   │   ├── GlobalSearchModal.jsx # Cmd/Ctrl + K Command Palette Search Modal
│   │   ├── Navbar.jsx          # Top Navigation Bar & Theme Selector
│   │   ├── OnboardingModal.jsx # First-Time Welcome Modal
│   │   ├── QuickAddExpenseModal.jsx # Add / Edit Expense Drawer
│   │   ├── Sidebar.jsx         # Desktop Navigation Sidebar (≥768px)
│   │   ├── TaskModal.jsx       # Create / Edit Task Drawer
│   │   ├── Toast.jsx           # Non-intrusive Toast Notifications
│   │   └── UserAvatar.jsx      # Custom Dynamic User Initials Avatar
│   ├── context/
│   │   └── AppContext.jsx      # Centralized React Context & State Storage Logic
│   ├── views/                  # Main Page Views
│   │   ├── AnalyticsView.jsx   # Visual Charts & Analytics Report
│   │   ├── CalendarView.jsx    # Monthly Grid & Daily Breakdown View
│   │   ├── DashboardView.jsx   # Command Center & Summary View
│   │   ├── ExpenseView.jsx     # Expense Log, Search & Filter View
│   │   ├── SettingsView.jsx    # Profile, Data Backup & Local Storage Controls
│   │   └── TodoView.jsx        # Task Management Board
│   ├── App.css                 # Component Layout Styles
│   ├── App.jsx                 # Application Main Router Shell
│   ├── index.css               # Tailwind CSS Base & Theme Design Tokens
│   └── main.jsx                # React DOM Application Entrypoint
├── index.html                  # HTML Shell with SEO Meta & Fonts
├── package.json                # Project Dependencies & Deployment Scripts
├── vite.config.js              # Vite Compiler Configuration (GitHub Pages Base Path)
└── README.md                   # Repository Documentation
```

---

## 🚀 Getting Started & Installation

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher) or [yarn](https://yarnpkg.com/)

### Step-by-Step Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rajdeep18-lab/campusflow.git
   ```

2. **Navigate into the project directory:**
   ```bash
   cd campusflow
   ```

3. **Install project dependencies:**
   ```bash
   npm install
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Open your browser and navigate to `http://localhost:5173`.

---

## 📦 Production Build & Deployment

### Building for Production

To compile static assets for production deployment:
```bash
npm run build
```

To preview the built production bundle locally:
```bash
npm run preview
```

### Deploying to GitHub Pages

CampusFlow is configured with `gh-pages` and automatic subpath support (`base: "/campusflow/"`).

Deploy updates directly to GitHub Pages with a single command:
```bash
npm run deploy
```

*(This automatically triggers `npm run build` and publishes the output to the `gh-pages` branch).*

---

## 🏗️ Architecture & State Management

```
               ┌────────────────────────┐
               │    React AppProvider   │
               │   (Central State Hook) │
               └───────────┬────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
   ┌──────────────────┐        ┌──────────────────┐
   │ HTML5 LocalStorage│       │ Context Consumers│
   │  Persistence Layer│       │  (Views & Modals)│
   └──────────────────┘        └──────────────────┘
```

1. **Unidirectional Data Flow**: `AppContext.jsx` exposes clean mutation methods (`addExpense`, `editTodo`, `toggleTheme`, `saveMonthlyBudget`).
2. **Auto Synchronization**: React `useEffect` hooks serialize state changes to `localStorage` automatically.
3. **Zero Stale State**: Dynamic calculations (remaining budget, spending totals, completion rates) derive instantly from state during render without duplicating data.

---

## 🔮 Future Improvements

- [ ] **Recurring Expenses & Subscriptions**: Track monthly recharge, hostel rent, and OTT platform renewals automatically.
- [ ] **Export to CSV / PDF**: Download monthly expense summaries for personal record-keeping.
- [ ] **Split Bill Calculator**: Quick calculator for shared hostel or canteen bill splitting between roommates.
- [ ] **Custom Category Creator**: Allow students to define custom categories with custom icons.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 👤 Author

**Rajdeep**
- **GitHub**: [@Rajdeep18-lab](https://github.com/Rajdeep18-lab)
- **Project Link**: [https://github.com/Rajdeep18-lab/campusflow](https://github.com/Rajdeep18-lab/campusflow)
- **Live Demo**: [https://rajdeep18-lab.github.io/campusflow/](https://rajdeep18-lab.github.io/campusflow/)

---

<div align="center">
  <sub>Built with ❤️ for students worldwide. If you find CampusFlow helpful, feel free to give it a ⭐️!</sub>
</div>
