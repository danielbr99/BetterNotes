# Implementation Plan: Mobile Sidebar Menu & UI Refactor

**Branch**: `005-mobile-sidebar-menu` | **Date**: 2026-05-12 | **Spec**: [specs/005-mobile-sidebar-menu/spec.md](spec.md)
**Input**: Feature specification from `/specs/005-mobile-sidebar-menu/spec.md`

## Summary

This feature centralizes app navigation into an Expo Drawer (sidebar), refactors the Dashboard UI by introducing a Floating Action Button (FAB) for entry creation, and implements a "Trash" (soft delete) mechanism. The technical approach involves updating the backend models/API for soft deletes and integrating `expo-drawer`, `gluestack-ui`, and `tamagui` into the mobile app.

## Technical Context

**Language/Version**: Python 3.12+ (Backend), TypeScript/React Native 0.81+ (Mobile)
**Primary Dependencies**: FastAPI, SQLAlchemy, expo-router, @react-navigation/drawer (via expo-drawer), lucide-react-native, @gluestack-ui/themed, tamagui, @tanstack/react-query
**Storage**: SQLite (Backend), expo-secure-store (Mobile)
**Testing**: pytest (Backend), Jest/React Native Testing Library (Mobile)
**Target Platform**: Android, iOS
**Project Type**: Mobile App + Web Service
**Performance Goals**: 60 fps UI animations, <100ms API response time
**Constraints**: Support for offline navigation state, consistent Lucide iconography
**Scale/Scope**: ~5 main navigation views, 1 FAB, 1 new backend database field

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Spec-First**: Feature spec is complete and integrated with user feedback.
- **Automatic Documentation**: OpenAPI schema must be updated for `is_deleted` and trash filtering.
- **Data Integrity**: Soft delete logic must ensure data remains recoverable but filtered from active views.
- **Test-First**: Implementation includes backend integration tests for trash and mobile UI tests for navigation.
- **Simplicity**: Using standard Expo/React Navigation drawer patterns.

## Project Structure

### Documentation (this feature)

```text
specs/005-mobile-sidebar-menu/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0: Research (Drawer & Styling setup)
├── data-model.md        # Phase 1: Soft delete model
├── quickstart.md        # Setup guide for new UI libraries
├── contracts/           
│   └── openapi.yaml     # Updated API contract
└── checklists/
    ├── requirements.md
    └── technical-integrity.md
```

### Source Code (repository root)

```text
src/
├── app.py               # Updated Trash endpoints
├── models.py            # Entry.is_deleted field
├── schemas.py           # Entry schemas with is_deleted
└── crud.py              # Filtering logic for trash

mobile/
├── app/
│   ├── _layout.tsx      # Drawer navigator root
│   ├── index.tsx        # Dashboard with FAB
│   ├── settings.tsx     # Settings refactor
│   ├── kanban.tsx       # Navigation link update
│   └── (drawer)/        # New drawer module folder (optional)
└── src/
    ├── theme/           # Tamagui/Gluestack config
    └── services/
        └── api.ts       # Trash API calls
```

**Structure Decision**: Mobile-centric feature with backend extension. Modifying `src/` for data persistence and `mobile/app/` for navigation/UI refactor.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Tamagui + Gluestack | Unified styling + Rich UI | Standard RN styles are harder to scale for themed/responsive layouts |
