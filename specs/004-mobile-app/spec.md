# Feature Specification: Mobile Application (React Native)

**Feature Branch**: `004-mobile-app`  
**Created**: 05 de mayo de 2026  
**Status**: Draft  
**Reference**: Apple Notes (UX/UI Benchmark)

## Overview
Develop a high-polish mobile frontend for the Kanban-Rich Notes system using React Native and Expo. The application will serve as a primary client for the FastAPI backend, supporting the full polymorphic entry system, Kanban workflows, and client-side encryption.

## User Stories

### US-01: Seamless Access
As a user, I want to securely log in to my account and connect to my local backend server so that I can access my notes and tasks from my mobile device.

### US-02: Native Organization
As a user, I want to navigate my hierarchical folder structure using native mobile gestures so that organizing my data feels natural and efficient.

### US-03: Rich Media Editor
As a user, I want to create and edit rich text notes with inline images and drawings so that my mobile experience matches the benchmark of Apple Notes.

### US-04: Mobile Kanban
As a user, I want a fluid Kanban board with drag-and-drop support so that I can manage my tasks on the go without the overhead of a desktop interface.

### US-05: Secure Vault
As a user, I want to use my device's biometric authentication (optional) or a password to unlock my client-side encrypted notes so that my most sensitive data remains private even if I lose my phone.

## Functional Requirements

**Core UI/UX**:
- **FR-001**: System MUST implement a minimalist "Apple Notes" design using NativeWind (Tailwind CSS).
- **FR-002**: System MUST support hierarchical folder navigation with a clean sidebar/drill-down interface.
- **FR-003**: System MUST provide a unified search bar that queries the backend using the `q` parameter.

**Editor & Kanban**:
- **FR-004**: System MUST support rich text editing for notes.
- **FR-005**: System MUST implement a horizontal-scrolling Kanban board for tasks.
- **FR-006**: System MUST support drag-and-drop movement of task cards between columns.

**Security & Connectivity**:
- **FR-007**: System MUST provide a settings screen to configure the backend IP address and port.
- **FR-008**: System MUST perform client-side AES-256 encryption for entries marked with `is_encrypted: true`.
- **FR-009**: System MUST store the JWT token and encryption keys securely using `expo-secure-store`.

**Asset Handling**:
- **FR-010**: System MUST support uploading photos from the device camera or gallery to the `/assets` endpoint.
- **FR-011**: System MUST support creating and saving sketches/drawings as assets.

## Technical Context

- **Framework**: React Native with Expo (SDK 51+).
- **Navigation**: Expo Router (File-based routing).
- **Data Layer**: TanStack Query (React Query) for caching and optimistic updates.
- **Styling**: NativeWind (Tailwind CSS for Native).
- **Backend Sync**: Client-Server over Local Network.
- **Encryption**: `expo-crypto` for cryptographic operations.

## Success Criteria

- **SC-001**: App launch to functional dashboard in under 3 seconds.
- **SC-002**: Drag-and-drop transitions between Kanban columns are fluid (60fps).
- **SC-003**: Zero plaintext data for encrypted items is sent over the local network (verified via interceptor).
- **SC-004**: Images and drawings are correctly rendered inline within the rich text editor.
