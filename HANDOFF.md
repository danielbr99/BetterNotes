# Internship Handoff: BetterNotes Project

Hey! Here is the status of the **BetterNotes** project as of April 28, 2026. We are following a **Spec-Driven Development (SDD)** workflow.

## 🚀 What's been implemented
1.  **Project Foundation (`specs/001-notes-system`)**:
    *   Asynchronous FastAPI backend with SQLAlchemy & SQLite.
    *   Full CRUD for Notes (Create, List, Get by ID).
    *   Data validation (titles are mandatory).
2.  **User Authentication (`specs/002-user-auth`)**:
    *   **JWT Security**: All note endpoints are now protected.
    *   **Registration/Login**: `/auth/register` and `/auth/token` are functional.
    *   **Resource Ownership**: Users can only see and manage their own notes.

## 🛠 Tech Stack
- **Backend**: Python 3.12, FastAPI.
- **Database**: SQLite (local-first).
- **Security**: JWT (python-jose) + Bcrypt (password hashing).
- **Testing**: Pytest (Async).

## 💡 How to pick up where we left off
1.  **Sync**: Pull the latest changes from the repo.
2.  **Environment**: `pip install -r requirements.txt`.
3.  **Run Server**: `python -m uvicorn src.app:app --reload`.
4.  **Agent Context**: Open Gemini CLI. It will read `GEMINI.md`, which points to `specs/002-user-auth/plan.md`. This tells the agent exactly what we just finished.

## 📌 Next Steps
- We need to implement a search feature or a simple Front-End dashboard.
