# Finance Manager Pro - Premium Mobile App

A high-performance, modern fintech expense tracker built with **React Native** and **Expo**. Designed with a premium aesthetic, featuring glassmorphism, fluid animations, and data persistence.

## 📱 App Overview
This application allows users to manage their daily finances with ease. It tracks income and expenses, provides categorized insights, and visualizes spending trends through animated charts.

---

## 🚀 Mandatory Requirements (Completed)
- **Gradient-Based UI**: Utilizes sleek linear gradients for the balance cards and primary buttons.
- **Dark / Light Mode**: Dynamic theme switching that adapts to the system setting.
- **Bottom Tab Navigation**: 3 Tabs (Home, Wallet History, Profile) for seamless navigation.
- **Animations**: Micro-interactions on clicks and entrance animations for all screens using **Moti**.
- **Keyboard Handling**: Smooth UX for forms with optimized keyboard behavior.
- **Data Persistence**: Local storage implementation via **AsyncStorage** and **Zustand**.

## ✨ Feature Requirements (Completed)
- **Transaction Management**: 
  - Add Income and Expense with amount, category, and notes.
  - Real-time balance updates.
  - View detailed history.
- **Category-Based Tracking**:
  - Visual distinction using custom icons and a vibrant color palette.
- **Monthly Financial Summary**:
  - Automatically calculated totals for Income, Expense, and remaining Balance.

## 🎁 Bonus Features (Included)
- **Animated Bar Charts**: Weekly spending visualization with interactive top labels.
- **Smart Empty States**: Engaging "Ghost" states when no data is available.
- **Gestures**: Long-press on any transaction to delete it instantly.
- **Premium Glassmorphism**: Surface components with subtle blurs and shadows.

---

## 🛠️ Tech Stack
- **Framework**: Expo (React Native)
- **State**: Zustand (with Persist Middleware)
- **Animations**: Moti / Reanimated
- **Charts**: Gifted Charts
- **Icons**: Lucide React Native
- **Storage**: AsyncStorage

## ⚙️ Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npx expo start
   ```

3. **Open the App**:
   - Install **Expo Go** on your Android/iOS device.
   - Scan the **QR Code** from your terminal.

---

## 📁 Project Highlights
- **Architecture**: Clean component-based architecture for scalability.
- **Theme System**: Centralized design system in `src/theme/index.js`.
- **Validation**: Form validation for transaction entries to ensure data integrity.

---
Built for the Finance Manager App Assignment.
