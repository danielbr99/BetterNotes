# Implementation Plan: Folder Organization

**Branch**: `006-folder-organization` | **Date**: 2026-05-20 | **Spec**: [specs/006-folder-organization/spec.md](spec.md)
**Input**: Feature specification from `/specs/006-folder-organization/spec.md`

## Summary

This feature introduces a nested folder organization system. Users can create, delete, and rename folders. Notes and tasks can be moved into specific folders. Deleting a folder recursively deletes its nested subfolders and all contained notes and tasks.

## Technical Context

**Language/Version**: Python 3.12 (Backend), TypeScript / React Native Expo (Frontend)
**Primary Dependencies**: FastAPI, SQLAlchemy (Backend), React Native, Expo Router, Zustand/Context (Frontend)
**Storage**: SQLite (Backend), SecureStore/localStorage (Frontend for tokens)
**Testing**: Pytest (Backend), Jest (Frontend)
**Target Platform**: Linux server/local-first, iOS/Android/Web
**Project Type**: Mobile App + API
**Performance Goals**: <1s load time for folder contents, 60 fps UI transitions
**Constraints**: Support local network, backward compatibility with existing notes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec-First Development**: OpenAPI `openapi.yaml` will be updated to document the new `DELETE /folders/{id}` cascading behavior.
- **Data Integrity & Validation**: Backend will enforce `parent_id` foreign keys and prevent circular references.
- **Test-First Discipline**: Pytest endpoints will be created to verify cascading deletions.
- **Simplicity & Local-First**: SQLite handles cascading deletes natively; we will ensure `cascade="all, delete"` is configured correctly in SQLAlchemy.

## Project Structure

### Documentation (this feature)

```text
specs/006-folder-organization/
├── plan.md              # This file (/speckit.plan command output)
└── spec.md              # Feature requirements
```

### Source Code

```text
# Mobile + API 
src/
├── models.py            # Update Folder -> Entry relationship for cascading deletes
├── crud.py              # Add circular dependency checks or recursive delete logic
├── app.py               # Update /folders endpoints if needed

mobile/
├── app/
│   ├── folder/
│   │   └── [id].tsx     # Folder view screen (already exists, verify functionality)
│   ├── _layout.tsx      # Sidebar navigation
│   └── index.tsx        # Dashboard root view
└── src/
    ├── services/api.ts  # Add endpoints for moving items
    └── components/      # Sidebar / Folder list UI
```

**Structure Decision**: Using the existing Backend (FastAPI) and Frontend (React Native) structure. The data model for Folders and Entries already exists, but relationship cascading rules need refinement, and the mobile sidebar UI must be fully hooked up to display the nested structure.

## Phase 1: Data Model & Contracts

### 1. Database Model (`src/models.py`)
- Ensure `Folder.entries` relationship has `cascade="all, delete, delete-orphan"` so deleting a folder removes its entries.
- Ensure `Folder.subfolders` has `cascade="all, delete, delete-orphan"` for recursive deletion.

### 2. API Contracts (`openapi.yaml`)
- Document that `DELETE /folders/{id}` performs a batch deletion.
- Verify `PATCH /entries/{id}` includes `folder_id` for moving items.
