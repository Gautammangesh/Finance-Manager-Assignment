# Finance Manager / Expense Tracker

> A polished fintech-style mobile app for tracking income, expenses, analytics, and smarter money habits.

A modern fintech-style mobile app built for the Finance Manager App Assignment using Expo and React Native. The app helps users track income and expenses, monitor category-based spending, view financial summaries, and manage everything locally with a polished dark/light experience.

## Overview

### Why this project?

This project focuses on:
- clean mobile-first UI/UX
- scalable component structure
- local-first finance tracking
- thoughtful product polish beyond the minimum assignment requirements

The app includes the assignment core flows along with a few standout additions like smart insights, transaction search/filter, and undo delete.

## Features

### Core Features
- 💸 Add income and expense transactions
- 📝 Transaction fields: amount, category, date, and note
- ✅ Form validation for transaction creation
- 🏷️ Category-based tracking with icons and color distinction
- 📆 Weekly, monthly, and yearly finance views
- 📊 Financial summary with balance, income, and expense visibility
- 💾 Local persistence using AsyncStorage
- 🧭 Bottom tab navigation with 3 primary sections
- 🌗 Dark, light, and system theme support
- 🎨 Gradient-based fintech-style UI
- ⌨️ Keyboard-aware forms for smoother mobile UX

### Standout Features
- ✨ Smart insights card on the Home screen
- 🔎 Search and filter on the transactions screen
- ↩️ Undo delete flow for removed transactions
- 🍩 Spending by category donut chart
- 📈 Cash flow trend line chart
- 🎬 Animated entrances and micro-interactions
- 👻 Better empty states and polished visual hierarchy

## Tech Stack

- ⚡ Expo
- 📱 React Native
- 🧭 Expo Router
- 🗂️ Zustand
- 💾 AsyncStorage
- 📊 react-native-gifted-charts
- 👆 react-native-gesture-handler
- 🌈 expo-linear-gradient
- 🧩 lucide-react-native

## Project Structure

```text
app/
  (tabs)/
    index.jsx
    transactions.jsx
    profile.jsx
  add-transaction.jsx
src/
  components/
  store/
  theme/
assets/
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Gautammangesh/Finance-Manager-Assignment.git
cd Finance-Manager-Assignment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the Expo development server

```bash
npx expo start
```

If you want a cleaner mobile connection flow, you can also use:

```bash
npx expo start --clear --tunnel
```

### 4. Run on device

- 📲 Install Expo Go on your Android or iOS device
- 🔍 Scan the QR code shown in the terminal

### 5. Run checks

```bash
npx tsc --noEmit
npm test -- --runInBand
npx expo-doctor
```

## Screenshots

### 1. Home Dashboard
Shows the main finance overview with the balance card, summary cards, smart insights card, and recent transactions.

![Home Dashboard](./screenshots/home-dashboard.png)

### 2. Add Transaction Flow
Shows the add income/expense form with amount, date, category, note, validation, and save action.

![Add Transaction Flow](./screenshots/add-transaction.png)

### 3. Category Tracking
Shows predefined categories, custom category creation, and the visual distinction using icons and colors.

![Category Tracking](./screenshots/category-tracking.png)

### 4. Balances & Analytics
Shows weekly/monthly/yearly views with spending analytics, category breakdown, and the cash flow trend chart.

![Balances & Analytics](./screenshots/balances-analytics.png)

### 5. Search & Filter Transactions
Shows transaction search and filter controls for quickly finding income and expense entries.

![Search & Filter Transactions](./screenshots/search-filter.png)

### 6. Profile & Theme Settings
Shows profile preview/edit flow along with dark/light/system theme switching.

![Profile & Theme Settings](./screenshots/profile-theme.png)

## Testing

The project has been validated with:
- 🧪 TypeScript check via `npx tsc --noEmit`
- ✅ Jest tests via `npm test -- --runInBand`
- 🩺 Expo environment validation via `npx expo-doctor`

Current automated coverage includes:
- adding transactions
- deleting transactions
- undo-related store restoration
- profile updates
- theme mode updates
- custom category creation

## Assignment Requirements Mapping

### Mandatory Requirements
- 🎨 Gradient-based UI: implemented
- 🌗 Dark / Light mode toggle: implemented
- 🧭 Bottom Tab Navigation: implemented
- 🎬 Animations: implemented
- ⌨️ Keyboard handling: implemented
- 💾 Local storage: implemented

### Feature Requirements
- 💸 Add income / expense: implemented
- 📝 Fields: amount, category, date, note: implemented
- ✅ Form validation: implemented
- 🏷️ Category-based tracking: implemented
- 📊 Monthly summary: implemented

## Notes

- Pixel-perfect design was not the goal; the UI was built to stay aligned with the assignment while still showing creativity.
- The app uses local persistence only and does not require a backend.

## Repository

GitHub Repo:

`https://github.com/Gautammangesh/Finance-Manager-Assignment`

## Author

Built by Gautam for the Finance Manager App Assignment.
