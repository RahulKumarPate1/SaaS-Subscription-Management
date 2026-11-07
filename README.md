# Multi-Tenant Subscription Management System

A full-stack subscription tracking and customer onboarding system built using FastAPI and Vanilla JS.

## 🚀 Features
- **Admin Portal**: Login and manage multiple application subscriptions.
- **Dynamic Onboarding**: Unique link generation for customer registration per app.
- **Real-Time Validation**: Frontend & Backend regex validation for Email and Phone numbers.
- **REST APIs**: Automated Swagger documentation available at `/docs`.

## 🛠️ Tech Stack
- **Backend**: Python, FastAPI, SQLAlchemy, MySQL
- **Frontend**: HTML5, Tailwind CSS, JavaScript (Fetch API)

## ⚡ How to Run
1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Run FastAPI server: `uvicorn backend.main_entry_point:app --reload`
4. Open browser at `http://127.0.0.1:8000/docs`
