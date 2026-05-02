# SmartFinance Dashboard (Full-Stack Application)

**Live Demo:** [https://smartfinance-app.vercel.app](https://smartfinance-app.vercel.app)

A complete Full-Stack Personal Finance Tracker built for an internship project. It allows users to add expenses, categorize them, and track their total spending in real-time.

## 🚀 Tech Stack
- **Frontend:** React.js (Vite), Vanilla CSS
- **Backend:** Node.js, Express.js
- **Database:** SQLite (Lightweight, zero-configuration SQL database)

## 📁 Project Structure
- `/backend`: Contains the Node.js API server and the SQLite database.
- `/frontend`: Contains the React application.

## ⚙️ How to Run Locally

### 1. Start the Backend Server
```bash
cd backend
npm install
node server.js
```
*The backend will run on `http://localhost:5000`*

### 2. Start the Frontend App
Open a **new** terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`*

## ✨ Features
- **Real-Time Data:** Uses `useEffect` and `fetch` to keep the UI in sync with the database.
- **Full CRUD:** Create (Add expense), Read (View list), Delete (Remove expense).
- **Responsive Design:** Custom CSS grid that works on both desktop and mobile.
- **SQL Database:** Uses real SQL queries instead of simple JSON files or arrays.
