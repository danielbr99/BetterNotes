# Technical Integrity Checklist: Mobile Sidebar Menu & UI Refactor

**Purpose**: Ensure the implementation follows the architectural standards and best practices defined in the plan.
**Created**: 2026-05-12
**Feature**: [specs/005-mobile-sidebar-menu/spec.md](../spec.md)

## Architecture & Navigation

- [ ] CHK014 Expo Drawer navigator is correctly nested within the root layout.
- [ ] CHK015 Route transitions between Dashboard, Kanban, and Settings are handled by the Drawer.
- [ ] CHK016 Navigation state is persisted or correctly re-initialized on app reload.

## Backend & Data

- [ ] CHK017 `is_deleted` field is correctly indexed in the database for filtering performance.
- [ ] CHK018 All entry queries (List, Get, Search) correctly filter by `is_deleted` status.
- [ ] CHK019 Permanent deletion logic is restricted to entries already in the Trash.

## UI & Styling

- [ ] CHK020 Tamagui and Gluestack UI configurations do not conflict with each other.
- [ ] CHK021 FAB component is responsive and remains accessible across different screen sizes.
- [ ] CHK022 Lucide icons are used consistently throughout the new UI elements.

## Quality & Performance

- [ ] CHK023 Drawer animation maintains 60fps on target devices.
- [ ] CHK024 API endpoints for Trash/Restore are covered by integration tests.
- [ ] CHK025 Type safety is maintained for new entry schemas and navigation parameters.
