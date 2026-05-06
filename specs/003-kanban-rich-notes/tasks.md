# Tasks: Kanban-Rich Notes Implementation

This document outlines the tasks required to implement the Kanban-Based Notes Application with Encryption, as defined in `spec.md`.

## Phase 1: Setup & Foundations
- [x] T001 - Update `openapi.yaml` with polymorphic `/entries` and `/assets` endpoints
- [x] T002 - Refactor `src/models.py` to use Polymorphic Single Table Inheritance (Entry, Note, Task)
- [x] T003 - Update `src/schemas.py` with polymorphic Pydantic models
- [x] T004 - Implement core CRUD logic in `src/crud.py` for polymorphic entries
- [x] T005 - Refactor `src/app.py` to route `/entries` and handle polymorphic creation
- [x] T006 - Implement integration tests in `tests/test_entries.py` for basic CRUD and type handling

## Phase 2: Asset Management
- [x] T007 - Create local `assets/` storage directory
- [x] T008 - Implement `POST /assets` to persist uploaded files to local storage with UUID names
- [x] T009 - Implement `GET /assets/{asset_id}` for binary file retrieval
- [x] T010 - Verify asset persistence and retrieval with integration tests
- [x] T011 - Implement asset deletion logic and cleanup of orphan files
- [x] T012 - Add asset metadata tracking in the database (Asset model)

## Phase 3: Kanban Workflow
- [x] T013 - Implement `KanbanColumn` model and CRUD endpoints
- [x] T014 - Implement logic to move tasks between columns (update `status_column`)
- [x] T015 - Implement task-specific metadata updates (priority, due_date)
- [x] T016 - Add filtering and sorting by Kanban properties in `GET /entries`
- [x] T017 - Verify Kanban transitions with unit and integration tests

## Phase 4: Encryption & Security
- [x] T018 - Implement client-side encryption hook architecture (API stores encrypted blobs)
- [x] T019 - Update `Entry` model to support separate storage for encrypted content vs plaintext
- [x] T020 - Implement Folder/Tag level encryption logic (cascading protection)
- [x] T021 - Implement "Protected View" filtering logic (aggregate all encrypted items)
- [x] T022 - Verify encryption security boundaries with dedicated test cases

## Phase 5: Rich Text & Media Integration
- [x] T023 - Define Rich Text schema for storing formatting and media references
- [x] T024 - Implement media reference resolution (mapping asset IDs to content positions)
- [x] T025 - Implement drawing tool backend support (storing drawing data as assets)
- [x] T026 - Add Apple-Notes-style metadata (autosave timestamps, simple versioning)

## Phase 6: Organization & Cleanup
- [x] T027 - Implement `Folder` and `Tag` models and relationships
- [x] T028 - Implement hierarchical folder movement and multi-tag assignment
- [x] T029 - Perform final security audit of asset access and encryption boundaries
- [x] T030 - Final polish of API error messages and validation constraints
- [x] T031 - Implement keyword search in `GET /entries` (title and content)
- [x] T032 - Implement automatic physical file cleanup on Entry deletion (SQLAlchemy listeners)
