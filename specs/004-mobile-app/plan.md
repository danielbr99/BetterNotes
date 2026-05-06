# Implementation Plan: Mobile Application (React Native)

**Branch**: `004-mobile-app` | **Date**: 2026-05-05 | **Spec**: [specs/004-mobile-app/spec.md](spec.md)

## Summary
Building a React Native (Expo) mobile client for the Kanban-Rich Notes system. The technical approach leverages Expo Router for navigation, NativeWind for "Apple Notes" styling, and TanStack Query for high-performance backend synchronization.

## Technical Context

**Language/Version**: TypeScript / Node.js 20+  
**Primary Dependencies**: React Native, Expo, NativeWind, TanStack Query, Axios  
**Storage**: `expo-secure-store` (tokens/keys), TanStack cache (data)  
**Testing**: Jest + React Native Testing Library  
**Target Platform**: iOS & Android (Cross-platform)
**Project Type**: Mobile Application
**Performance Goals**: 60fps for Kanban animations, <1s list rendering  
**Constraints**: Must run over local network, must handle client-side encryption.

## Project Structure

### Documentation
```text
specs/004-mobile-app/
├── spec.md              # Feature requirements
├── plan.md              # This file
├── tasks.md             # Implementation tasks
└── checklists/          # Quality validation
```

### Source Code
```text
mobile/
├── app/                 # Expo Router (routes)
├── src/
│   ├── components/      # Atomic UI components
│   ├── services/        # API and Encryption logic
│   ├── hooks/           # Custom React hooks (React Query)
│   ├── store/           # Global state (Zustand or context)
│   ├── theme/           # NativeWind config
│   └── types/           # Generated from openapi.yaml
└── assets/              # App static assets
```

## Implementation Phases

### Phase 1: Environment Setup
- Initialize Expo template.
- Install core dependencies (NativeWind, React Query, Axios).
- Generate TS types from `openapi.yaml`.

### Phase 2: Auth & Connection
- Implement login UI and service.
- Add local network IP configuration screen.

### Phase 3: The Dashboard
- Implement Folder navigation.
- Implement the polymorphic Entries list.

### Phase 4: Core Workflow
- Build the Rich Text Editor.
- Build the Kanban Board (drag-and-drop).

### Phase 5: Security
- Port the AES-256 encryption logic.
- Implement biometric/password gating for encrypted items.
