# Implementation Plan: User Authentication

**Branch**: `002-user-auth` | **Date**: 2026-04-28 | **Spec**: [specs/002-user-auth/spec.md]
**Input**: Secure Pro Notes with JWT authentication and resource ownership.

## Summary
Implement a secure authentication layer using JWT and OAuth2. We will add a `User` entity, establish a one-to-many relationship with `Note`, and protect all API endpoints.

## Technical Context
**Language/Version**: Python 3.12+
**Primary Dependencies**: FastAPI, SQLAlchemy, python-jose, passlib[bcrypt]
**Storage**: SQLite (updated schema with Users table)
**Testing**: pytest (async)
**Performance Goals**: <100ms latency for auth checks

## Constitution Check
- **PRINCIPLE_1 (Spec-First)**: We will update `openapi.yaml` to include security schemes.
- **PRINCIPLE_3 (Data Integrity)**: Password hashing is mandatory.
- **PRINCIPLE_4 (Test-First)**: New tests for registration, login, and unauthorized access.

## Project Structure
### Source Code
```text
src/
├── auth.py              # New: JWT and Hashing utilities
├── app.py               # Updated: Auth dependencies
├── models.py            # Updated: User model + Relationship
├── schemas.py           # Updated: User schemas + Note user_id
└── crud.py              # Updated: User-specific CRUD
```

## Phases

### Phase 0: Research & Setup
- [x] Research completed (see research.md)
- [ ] Install new dependencies

### Phase 1: Design & Contracts
- [ ] Update `openapi.yaml` with `/auth` endpoints and security schemas.
- [ ] Define `User` and `UserCreate` Pydantic schemas.
- [ ] Update `Note` model with `user_id`.

### Phase 2: Implementation
- [ ] Implement `auth.py` (password hashing + token generation).
- [ ] Update `app.py` with `/auth/register` and `/auth/token`.
- [ ] Apply `get_current_user` dependency to all `/notas` endpoints.
- [ ] Update CRUD to filter notes by the authenticated user's ID.
