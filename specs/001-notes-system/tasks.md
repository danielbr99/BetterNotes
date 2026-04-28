# Tasks: Pro Notes System

**Input**: Design documents from `/specs/001-notes-system/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are requested in the feature specification under "User Scenarios & Testing".

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure: `src/`, `tests/` directories
- [x] T002 Initialize Python 3.12 project with dependencies in `requirements.txt`
- [x] T003 [P] Configure `pytest` and `pytest-asyncio` in `pyproject.toml`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T004 Setup database connection and session management in `src/database.py`
- [x] T005 [P] Create SQLAlchemy base and models structure in `src/models.py`
- [x] T006 [P] Initialize FastAPI application instance in `src/app.py`
- [x] T007 [P] Implement global error handling for API responses in `src/app.py`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Create and Store Personal Notes (Priority: P1) 🎯 MVP

**Goal**: Allow users to capture notes with title and content.

**Independent Test**: Send POST to `/notas` with valid JSON and verify 201 response and persistence.

### Tests for User Story 1

- [x] T008 [P] [US1] Create contract test for POST `/notas` in `tests/test_api.py`
- [x] T009 [P] [US1] Create integration test for note creation flow in `tests/test_api.py`

### Implementation for User Story 1

- [x] T010 [P] [US1] Define `Note` SQLAlchemy model in `src/models.py`
- [x] T011 [P] [US1] Define `NoteCreate` and `Note` Pydantic schemas in `src/schemas.py`
- [x] T012 [US1] Implement `create_note` CRUD operation in `src/crud.py`
- [x] T013 [US1] Implement POST `/notas` endpoint in `src/app.py`

**Checkpoint**: User Story 1 is functional - notes can be created.

---

## Phase 4: User Story 2 - Prevent Notes Without Titles (Priority: P1)

**Goal**: Ensure data integrity by validating mandatory fields.

**Independent Test**: Send POST to `/notas` with empty title and verify 400 Bad Request.

### Tests for User Story 2

- [x] T014 [P] [US2] Create validation test for missing title in `tests/test_api.py`

### Implementation for User Story 2

- [x] T015 [US2] Add Pydantic validation for non-empty title in `src/schemas.py`
- [x] T016 [US2] Implement custom 400 error response for validation failures in `src/app.py`

**Checkpoint**: User Story 2 is functional - invalid notes are rejected.

---

## Phase 5: User Story 3 - Unique Identification and Metadata (Priority: P2)

**Goal**: Retrieve notes by ID and list all notes with metadata (ID, timestamp).

**Independent Test**: Retrieve a created note by its ID and verify it matches the stored data.

### Tests for User Story 3

- [x] T017 [P] [US3] Create contract test for GET `/notas` and GET `/notas/{id}` in `tests/test_api.py`
- [x] T018 [P] [US3] Create test case for GET `/notas/{id}` with non-existent ID (404 verification) in `tests/test_api.py`

### Implementation for User Story 3

- [x] T019 [P] [US3] Implement `get_note` and `get_notes` CRUD operations in `src/crud.py`
- [x] T020 [US3] Implement GET `/notas` endpoint in `src/app.py`
- [x] T021 [US3] Implement GET `/notas/{id}` endpoint in `src/app.py`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and documentation.

- [x] T021 [P] Update `README.md` with API usage examples
- [x] T022 [P] Validate 100% compliance with `openapi.yaml` using `spectral`
- [x] T023 Run `quickstart.md` validation to ensure setup works as documented

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on T001-T003.
- **User Stories (Phase 3+)**: All depend on Phase 2 completion.
- **Polish (Phase 6)**: Depends on all user stories completion.

### Parallel Opportunities

- T003, T005, T006, T007 can run in parallel.
- T008, T009 (US1 Tests) can run in parallel.
- T010, T011 (US1 Models/Schemas) can run in parallel.
- Once Foundation is ready, US1, US2, and US3 tests can be drafted in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Setup and Foundation.
2. Complete US1 (Creation) and US2 (Validation).
3. Validate that notes can be created and invalid ones are blocked.

### Incremental Delivery

1. Add US3 (Retrieval) to complete the basic note management lifecycle.
2. Final Polish and contract validation.
