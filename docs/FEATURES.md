# CampusFlow – Comprehensive Feature Specification

This document provides an exhaustive inventory of all functional and non-functional features implemented in **CampusFlow 2.1**. It details user interactions, input validations, edge cases handled, accessibility standards, and design system tokens.

---

## Table of Contents

1. [Overview & Dashboard Module](#1-overview--dashboard-module)
2. [Expenses Management Module](#2-expenses-management-module)
3. [Budget Tracking Module](#3-budget-tracking-module)
4. [Task & Todo Management Module](#4-task--todo-management-module)
5. [Calendar & Daily Timeline Module](#5-calendar--daily-timeline-module)
6. [Expense Analytics & Visualizations](#6-expense-analytics--visualizations)
7. [Monthly Financial PDF Report Generator](#7-monthly-financial-pdf-report-generator)
8. [User Profile & Account Management](#8-user-profile--account-management)
9. [Application Settings & Customization](#9-application-settings--customization)
10. [Authentication & Session Management](#10-authentication--session-management)
11. [Navigation & Responsive Layout System](#11-navigation--responsive-layout-system)
12. [Notification & Audio Feedback Service](#12-notification--audio-feedback-service)
13. [Data Backup, Restore & Offline Storage](#13-data-backup-restore--offline-storage)
14. [Design System & Color Token Specifications](#14-design-system--color-token-specifications)

---

## 1. Overview & Dashboard Module

The Dashboard (`DashboardView.jsx`) is the primary landing view for authenticated users, presenting an executive summary of financial health, budget progress, upcoming academic tasks, and quick actions.

### 1.1 Summary Stat Cards
- **Total Spent This Month**:
  - Dynamically calculates all expenses matching the current calendar month (`YYYY-MM`).
  - Displays localized currency value (e.g., `₹4,250.00`).
  - Shows transaction count for the current month.
- **Monthly Budget Limit**:
  - Shows the configured budget ceiling.
  - One-click "Edit Budget" button to open the budget modification modal.
- **Remaining Budget**:
  - Computes `Monthly Budget - Total Spent`.
  - Turns red with warning indicators when spending exceeds 100% of the allocated budget.
  - Displays percentage remaining or overspent percentage.
- **Daily Average Spending**:
  - Computes average spend per elapsed day in the active month (`Total Spent / Current Day Number`).
  - Projects expected end-of-month spend based on the daily burn rate.

### 1.2 Visual Budget Progress Bar
- Smooth horizontal progress bar indicating percentage of budget consumed.
- Multi-tier color coding:
  - Green (`#1F4D3A`): Spending is between 0% and 75%.
  - Amber / Warning: Spending is between 75% and 90%.
  - Crimson / Danger: Spending exceeds 90% or has crossed 100%.

### 1.3 Quick Action Buttons
- **+ Add Expense**: Opens the `QuickAddExpenseModal` with pre-filled current timestamp and currency.
- **+ New Task**: Opens the `TaskModal` to quickly capture an assignment, exam deadline, or personal chore.
- **Download Report**: Opens the `DownloadReportModal` for generating a branded PDF statement.
- **Search**: Global search shortcut (`Ctrl+K` or search button) to locate any expense or task.

### 1.4 Recent Transactions Stream
- Lists the 5 most recent expense entries.
- Displays category icon badge with category-specific tinting.
- Shows transaction title, payment method, date in user-preferred format, and amount.
- Direct navigation link to the full Expenses page.

### 1.5 Pending Tasks Widget
- Displays the top priority tasks due today or upcoming.
- Interactive checkbox allowing instant task completion toggle directly from the dashboard.
- Priority badge indicators (*High*, *Medium*, *Low*).
- Confetti celebration trigger upon completing the final pending task.

---

## 2. Expenses Management Module

The Expenses module (`ExpenseView.jsx`) provides full lifecycle management of student transactions.

### 2.1 Expense Creation (`QuickAddExpenseModal.jsx`)
- **Fields**:
  - **Title / Merchant** (Required, text): What was purchased (e.g., "Physics Textbook", "Canteen Lunch").
  - **Amount** (Required, numeric): Positive currency amount. Supports decimals up to 2 decimal places.
  - **Category** (Required, select): Food, Travel, Books, Hostel, Mess, Shopping, Recharge, Entertainment, Health, Education, Other.
  - **Date** (Required, date picker): Defaults to current local date (`YYYY-MM-DD`). Allows backdating and future scheduling.
  - **Payment Method** (Optional, select): UPI, Cash, Debit Card, Credit Card, Net Banking. Defaults to user's preferred method.
  - **Notes / Description** (Optional, textarea): Context, bill number, or co-payer remarks.
- **Input Validation**:
  - Title cannot be empty or whitespace only.
  - Amount must be strictly greater than zero (`amount > 0`).
  - Rejects negative signs or invalid non-numeric inputs.
  - Date must be a valid ISO format date.

### 2.2 Expense Filtering & Searching
- **Text Search**: Real-time fuzzy filtering matching expense title, merchant, notes, and category.
- **Category Filter**: Filter transactions by one or multiple categories simultaneously.
- **Month & Year Selector**: Fast jump between months to review past academic terms.
- **Sorting Options**:
  - Date (Newest first / Oldest first).
  - Amount (Highest first / Lowest first).
  - Alphabetical title (A–Z / Z–A).

### 2.3 Expense Modification & Deletion
- **Edit Action**: Re-populates the modal with all existing fields for in-place editing.
- **Delete Action**: Instant removal with optional confirmation dialog based on user preferences. Automatically recalculates all monthly totals, budget bars, and analytics charts.

---

## 3. Budget Tracking Module

The Budget module provides granular visibility into spending thresholds to prevent mid-month insolvency.

### 3.1 Monthly Budget Configuration (`BudgetModal.jsx`)
- User specifies a maximum monthly spending allowance.
- Stored independently per user profile in both LocalStorage and Firestore (`/users/{uid}/settings/budget`).
- Supports zero-budget mode for students who track expenses without a fixed ceiling.

### 3.2 Dynamic Visual Indicators
- **Utilization Percentage**: `(Total Spent / Budget) * 100` rendered as an animated progress bar.
- **Burn Rate Warning**: Warns if the daily spending average will cause the user to run out of money before the end of the month.
- **Category-Wise Breakdown**: Displays which categories are consuming the greatest portion of the allocated budget.

---

## 4. Task & Todo Management Module

The Task module (`TodoView.jsx`) unifies student assignments, exam prep, project milestones, and daily routines alongside financial schedules.

### 4.1 Task Creation (`TaskModal.jsx`)
- **Fields**:
  - **Title** (Required): Brief description of the task (e.g., "Submit Machine Learning Assignment 3").
  - **Due Date** (Required): Date deadline for assignment submission or task execution.
  - **Priority Level** (Required):
    - **High**: Urgent deadlines, exam submissions, rent payments (Crimson badge).
    - **Medium**: Regular lab reports, project milestones, grocery runs (Amber badge).
    - **Low**: Optional reading, revision, leisure (Emerald badge).
  - **Category / Course**: Academic, Personal, Finance, Project, Health.

### 4.2 Task Organization & Filters
- **Status Tabs**:
  - **All Tasks**: Complete chronological list.
  - **Today**: Only tasks scheduled for the current system date.
  - **Pending**: Incomplete tasks sorted by urgency and due date.
  - **Completed**: Successfully finished tasks with strikethrough styling and completion timestamps.
- **Batch Actions**: Mark all visible tasks as complete; clear completed tasks.

### 4.3 Task Completion Celebration
- Integrated with `canvas-confetti` to trigger a particle celebration when an urgent task or all daily tasks are completed, providing positive reinforcement.

---

## 5. Calendar & Daily Timeline Module

The Calendar module (`CalendarView.jsx`) displays a comprehensive monthly view combining both financial transactions and academic commitments.

### 5.1 Monthly Grid View
- Full calendar grid displaying day numbers, day-of-week headers (Monday or Sunday start based on preferences).
- Current day highlighted with a distinct primary accent ring.
- Days containing recorded expenses display an expense indicator dot with total daily spend.
- Days containing tasks display task priority badges.

### 5.2 Day Inspector Drawer / Side Sheet
- Clicking any date cell opens a slide-over panel showing:
  - Total money spent on that specific calendar day.
  - Granular breakdown of individual expenses with amounts and categories.
  - List of tasks scheduled for that date with completion checkboxes.
  - "+ Add Expense for this Day" and "+ Add Task for this Day" direct shortcuts.

### 5.3 Month Navigation
- Previous month / Next month toggle buttons.
- "Today" quick-jump button to immediately return to the current calendar date.

---

## 6. Expense Analytics & Visualizations

The Analytics module (`AnalyticsView.jsx`) transforms raw transaction records into actionable visual insights using `Chart.js` and custom SVG components.

### 6.1 Category Distribution Chart
- Doughnut chart illustrating the proportional expenditure across each category (Food, Travel, Books, etc.).
- Hover tooltips displaying exact rupee amount, transaction count, and percentage share.
- Dynamic color assignment using a curated 12-color accessible palette.

### 6.2 Monthly Spending Trend Chart
- Bar / Line chart showing expenditure trajectory across the 12 calendar months.
- Allows students to observe semester-start spikes (books, fees, hostel setup) versus steady-state monthly living costs.

### 6.3 Weekly Expense Histogram
- Breaks down the active month into 5 chronological weeks (Days 1–7, 8–14, 15–21, 22–28, 29–31) to identify mid-month or weekend spending surges.

### 6.4 Smart Savings Insights & Metrics
- Automatically calculates:
  - Top spending category.
  - Most expensive single transaction.
  - Least spent day of the week.
  - Potential monthly savings if discretionary categories (Entertainment, Shopping) are reduced by 15%.

---

## 7. Monthly Financial PDF Report Generator

The PDF Report module (`pdfGenerator.js` & `DownloadReportModal.jsx`) generates professional, printable A4 PDF statements client-side using `jsPDF` and `jspdf-autotable`.

### 7.1 Report Configuration Modal
- User selects the target **Year** and **Month**.
- Option to include/exclude student profile details (Name, Email).
- Option to select output currency formatting.
- Instant validation: Disables export and alerts if no expenses exist for the selected month.

### 7.2 PDF Document Layout & Styling
- **Page Format**: Standard A4 Portrait (210mm × 297mm).
- **Header Section**:
  - Branded CampusFlow header bar in Forest Green (`#1F4D3A`).
  - Document Title: "Monthly Expense & Financial Statement".
  - Student Name, Registered Email, and Statement Period (e.g., "October 2026").
  - Generation Timestamp (ISO standard date and time).
- **Executive Summary Box**:
  - 4 key metrics presented in distinct cards: Total Spending, Monthly Budget, Remaining Balance, Budget Utilization %.
- **Category Breakdown Table**:
  - Formatted with headers: Category, Transaction Count, Total Amount (₹), Percentage of Monthly Spend.
- **Detailed Transactions Table**:
  - Full tabular ledger: Date, Merchant / Description, Category, Payment Method, Amount (₹).
  - Alternate row striping (`#F7F5F0`) for readability.
- **Footer**:
  - Automatic page numbering (`Page X of Y`).
  - Verification note: "Generated securely on-device by CampusFlow".

---

## 8. User Profile & Account Management

The Profile module (`ProfileView.jsx`) provides a complete dashboard for personal identity and account security.

### 8.1 Personal Identity
- **Profile Avatar**:
  - Displays user avatar image or initials fallback.
  - Image upload functionality supporting JPEG/PNG files. Image is converted to optimized Base64 string and persisted in user profile state.
  - Preset avatar picker with student/campus-themed icons.
- **Display Name**:
  - Editable display name field with real-time preview and save confirmation.
- **Email Address**:
  - Displays registered email (read-only for security; matches Firebase Auth).
- **Account Metadata**:
  - Account creation date (formatted via Firebase Auth `metadata.creationTime`).
  - Last sign-in timestamp (`metadata.lastSignInTime`).

### 8.2 Security & Authentication Details
- **Authentication Provider**:
  - Clear badge showing whether account is authenticated via **Email & Password** or **Google OAuth**.
- **Password Modification**:
  - Available for Email & Password accounts.
  - Requires current password verification and new password confirmation (minimum 6 characters).
- **Account Deletion**:
  - Secure deletion workflow using `deleteUser()` from Firebase Auth.
  - Removes all local storage data associated with the user's UID and signs out cleanly.

---

## 9. Application Settings & Customization

The Settings module (`SettingsView.jsx`) enables users to personalize their workflow, localization, and data management.

### 9.1 Localization & Preferences
- **Currency Selection**: INR (₹), USD ($), EUR (€), GBP (£), JPY (¥), CAD (C$), AUD (A$). All monetary displays across the app automatically reformat.
- **Date Format**: `DD/MM/YYYY`, `MM/DD/YYYY`, or `YYYY-MM-DD`.
- **First Day of Week**: Monday or Sunday (updates Calendar grid).
- **Default Category**: Pre-selected category for new expenses.
- **Default Payment Method**: UPI, Cash, Card, Net Banking.

### 9.2 Appearance & Theme Mode
- **Theme Selection**:
  - **Light Mode**: Crisp, paper-clean background (`#FBF9F4`) with warm neutral cards (`#FFFFFF`, `#F7F5F0`) and forest green accents.
  - **Dark Mode**: Premium deep charcoal/slate background (`#121815`) with forest green highlights (`#2D6A4F`).
  - **System Default**: Automatically listens to OS `prefers-color-scheme` media query.

### 9.3 Notification Preferences
- Toggle budget limit threshold warnings (80%, 90%, 100%).
- Toggle daily evening expense logging reminders (8:00 PM local time).
- Toggle academic task deadline reminders.
- Toggle Web Audio API sound effects for button clicks and completions.

---

## 10. Authentication & Session Management

The Authentication module (`AuthView.jsx` & `AuthContext.jsx`) manages the complete security lifecycle.

### 10.1 Supported Authentication Flows
- **Email & Password Registration**:
  - Real-time password validation (minimum 6 characters).
  - Full name capture during signup.
  - Auto-initialization of user profile and default preferences.
- **Email & Password Sign-in**:
  - Secure credential verification with friendly error mapping (`authUtils.js`).
- **Google OAuth Sign-in**:
  - One-tap sign-in popup using `GoogleAuthProvider`.
  - Automatic extraction of display name and Google profile picture.
- **Password Reset**:
  - Sends a secure password reset email using Firebase `sendPasswordResetEmail()`.
  - Visual confirmation banner upon dispatch.
- **Session Persistence**:
  - Automatic session restoration via `onAuthStateChanged()`.
  - Token refresh handled transparently by the Firebase SDK.

---

## 11. Navigation & Responsive Layout System

The navigation architecture provides an adaptive experience tailored to screen dimensions from 320px smartphones to 1920px widescreen monitors.

### 11.1 Desktop Layout (`≥ 768px`)
- **Persistent Left Sidebar (`Sidebar.jsx`)**:
  - Fixed width of `232px`.
  - Logo and brand identifier.
  - Primary navigation links: Overview, Expenses, Tasks, Calendar, Analytics, Settings.
  - Active page highlighted with forest green pill and subtle background tint.
  - Quick "+ Expense" button embedded directly in the sidebar.
  - Mini profile widget at the bottom showing user avatar, name, and quick logout button.

### 11.2 Mobile Layout (`< 768px`)
- **Top Header Bar (`Navbar.jsx`)**:
  - Current view title and subtitle.
  - Global search icon.
  - Active profile avatar with direct tap target opening the Profile page.
- **Bottom Navigation Bar (`BottomNav.jsx`)**:
  - Fixed to bottom viewport with `safe-area-inset-bottom` padding for modern edge-to-edge mobile screens.
  - **5-Tab Navigation Structure**:
    1. **Overview**: Dashboard icon and label.
    2. **Expenses**: Wallet/receipt icon and label.
    3. **Tasks**: Check-square icon and label with pending task badge count.
    4. **Calendar**: Calendar icon and label.
    5. **More**: Menu/grid icon opening the `MobileMoreDrawer`.

### 11.3 Mobile More Drawer (`MobileMoreDrawer.jsx`)
- Polished bottom sheet / drawer opening upon tapping the 5th "More" tab.
- Quick navigation to pages not in the primary 4 bottom tabs:
  - **Analytics** (Visual spending charts).
  - **Profile** (Personal info, avatar, security).
  - **Settings** (Preferences, theme, backup).
- Displays user card with name, email, and authentication badge.
- Quick action to trigger "+ Add Expense" modal.
- Dedicated "Log Out" button with confirmation.
- Smooth backdrop dismiss and ESC key accessibility.

---

## 12. Notification & Audio Feedback Service

The Notification Service (`services/NotificationService.js`) provides native browser push notifications and auditory cues.

### 12.1 Browser Push Notifications
- Requests standard HTML5 Notification permission via `Notification.requestPermission()`.
- **Scheduled Reminders**:
  - Daily expense logging notification dispatched at 8:00 PM if no transactions were logged today.
  - Task due warnings dispatched on the morning of a task's due date.
  - Budget alert dispatched when spending crosses 80% or 100% of the monthly limit.

### 12.2 Audio Synthesizer (Web Audio API)
- Zero external MP3 asset dependencies; generates synthetic micro-tones on-device using `AudioContext`:
  - **Success Chime**: Dual-tone ascending sine wave (520Hz -> 660Hz) on task completion.
  - **Add Tone**: Subtle click frequency (440Hz) on expense logging.
  - **Warning Tone**: Low frequency alert (220Hz) on budget exceedance.

---

## 13. Data Backup, Restore & Offline Storage

CampusFlow operates with an offline-first philosophy, guaranteeing full functionality without an active network connection.

### 13.1 LocalStorage UID Isolation
- All user data keys in `localStorage` are strictly partitioned by the user's Firebase UID:
  - `campusflow_${uid}_profile`
  - `campusflow_${uid}_expenses`
  - `campusflow_${uid}_budget`
  - `campusflow_${uid}_todos`
  - `campusflow_${uid}_preferences`
  - `campusflow_${uid}_categories`
- Ensures that multiple users logging in on the same shared computer or device never see or overwrite each other's data.
- Fallback keys (`campusflow_*_v2`) provided for guest / unauthenticated preview mode.

### 13.2 JSON Data Backup & Restore
- **Export Backup**:
  - Bundles all user profile data, expenses, tasks, budgets, and settings into a single timestamped JSON file: `campusflow_backup_YYYY-MM-DD.json`.
  - Dispatched via automated client-side browser download.
- **Import Restore**:
  - Parses uploaded JSON backup files with rigorous schema validation.
  - Validates array structures, required object fields, and timestamp formats.
  - Merges or cleanly replaces local data and triggers instant UI re-render.

---

## 14. Design System & Color Token Specifications

CampusFlow 2.1 is built upon a cohesive **Warm Neutral + Forest Green** design language.

| Token Name | Hex Code | Purpose / Usage |
| :--- | :--- | :--- |
| **Primary Green** | `#1F4D3A` | Primary brand accent, primary CTA buttons, active navigation states, PDF header |
| **Primary Green Dark** | `#16392B` | Primary button hover state, deep accent highlights |
| **Primary Green Light**| `#E8F0EC` | Active pill background, selected tab highlight, badge background |
| **Warm Canvas Light** | `#FBF9F4` | Main application background (Light mode) |
| **Card Surface Light** | `#FFFFFF` | Primary card background, modal surface, elevated components |
| **Card Muted Light**   | `#F7F5F0` | Secondary background, table alternate striping, input container fill |
| **Border Neutral**     | `#E4E0D6` | Card borders, table dividers, input borders |
| **Text Primary Dark**  | `#1C1B18` | Main body text, headings, prominent monetary values |
| **Text Secondary Dark**| `#5F5B52` | Subtitles, helper text, timestamps, table column headers |
| **Dark Theme Canvas**  | `#121815` | Main application background (Dark mode) |
| **Dark Theme Card**    | `#1B2420` | Card surface and sidebar background (Dark mode) |
| **Dark Theme Border**  | `#2D3B34` | Component borders (Dark mode) |
| **Urgent / Crimson**   | `#DC2626` | Over-budget alerts, High priority task badge, delete actions |
| **Warning / Amber**    | `#D97706` | Approaching budget threshold (75-90%), Medium priority badge |
| **Success / Emerald**  | `#10B981` | Completed tasks, savings indicator, positive cash balance |
