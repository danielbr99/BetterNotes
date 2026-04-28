# Tasks: User Authentication

**Input**: Design documents from `/specs/002-user-auth/`
**Prerequisites**: plan.md, spec.md, research.md

**Tests**: Required for registration, login, and unauthorized access scenarios.

## Phase 1: Setup & Dependencies

- [x] T001 Install `python-jose[cryptography]`, `bcrypt`, and `python-multipart`
- [x] T002 Update `requirements.txt` with new dependencies

## Phase 2: Design & Contracts

- [x] T003 Update `openapi.yaml` with authentication security schemes (OAuth2)
- [x] T004 Add endpoints for `/auth/register` and `/auth/token` to `openapi.yaml`
- [x] T005 Define `User` and `UserCreate` schemas in `src/schemas.py`
- [x] T006 Update `Note` schemas to include `user_id` in `src/schemas.py`

## Phase 3: Auth Infrastructure

- [x] T007 Implement JWT utility functions (create token, verify token) in `src/auth.py`
- [x] T008 Implement password hashing and verification utilities in `src/auth.py`
- [x] T009 Create the `get_current_user` dependency in `src/auth.py`

## Phase 4: User Story 1 - Registration (US1)

- [x] T010 [US1] Create `User` model in `src/models.py`
- [x] T011 [US1] Implement `create_user` in `src/crud.py` (with password hashing)
- [x] T012 [US1] Implement POST `/auth/register` endpoint in `src/app.py`
- [x] T013 [US1] Create test for successful user registration in `tests/test_auth.py`

## Phase 5: User Story 2 - Login & Token (US2)

- [x] T014 [US2] Implement POST `/auth/token` endpoint (OAuth2 flow) in `src/app.py`
- [x] T015 [US2] Create test for successful login and token generation in `tests/test_auth.py`
- [x] T016 [US2] Create test for login with invalid credentials

## Phase 6: User Story 3 - Protection & Ownership (US3)

- [x] T017 [US3] Add `user_id` foreign key to `Note` model in `src/models.py`
- [x] T018 [US3] Update `create_note` CRUD to require `user_id` in `src/crud.py`
- [x] T019 [US3] Update `get_notes` and `get_note` CRUD to filter by `user_id`
- [x] T020 [US3] Apply `get_current_user` dependency to all `/notas` endpoints in `src/app.py`
- [x] T021 [US3] Create test: Authenticated user can only see their own notes
- [x] T022 [US3] Create test: Unauthenticated user receives 401 for `/notas`

## Phase 7: Polish & Documentation

- [x] T023 Run full test suite (`tests/test_api.py` and `tests/test_auth.py`)
- [ ] T024 Validate updated `openapi.yaml` with `spectral`
- [x] T025 Update `README.md` with authentication instructions
