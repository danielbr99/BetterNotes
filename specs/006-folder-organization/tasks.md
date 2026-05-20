# Tasks: Folder Organization

**Input**: Design documents from `/specs/006-folder-organization/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup

- [ ] T001 Verify project structure and verify that `test.db` migrations are up-to-date with SQLAlchemy changes.

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T002 Update Database relationships for `Folder.entries` and `Folder.subfolders` with `cascade="all, delete-orphan"` in `src/models.py`.

## Phase 3: User Story 1 - Create and Manage Folders (P1)

**Goal**: Users can create, delete, and rename folders. Deleting is recursive.

- [ ] T003 [US1] Update folder deletion logic in `src/crud.py` to ensure proper cascading.
- [ ] T004 [US1] Expose API documentation for batch deletion in `openapi.yaml`.
- [ ] T005 [US1] Add a folder create/delete mutation in `mobile/src/services/api.ts`.
- [ ] T006 [US1] Hook up folder creation/deletion to the mobile UI sidebar in `mobile/app/_layout.tsx`.

## Phase 4: User Story 2 - Organize Items into Folders (P1)

**Goal**: Users can move existing notes and tasks into folders.

- [ ] T007 [US2] Ensure `PATCH /entries/{id}` supports `folder_id` updates in `src/crud.py` and `src/schemas.py`.
- [ ] T008 [US2] Update mobile `api.ts` to allow patching entries with a new `folder_id`.
- [ ] T009 [US2] Implement dragging or "move to" option in the Mobile Dashboard/Kanban UI (`mobile/app/index.tsx`).

## Phase 5: User Story 3 - Nested Folder Hierarchy (P2)

**Goal**: Users can create folders inside other folders.

- [ ] T010 [US3] Verify `POST /folders` supports `parent_id` in backend.
- [ ] T011 [US3] Update mobile UI sidebar to recursively render subfolders instead of a flat list.
- [ ] T012 [US3] Add capability to select a parent folder when creating a new folder in the UI.

## Phase 6: Polish

- [ ] T013 Verify nested hierarchy UI interactions on web/mobile.
- [ ] T014 Clean up logs.
