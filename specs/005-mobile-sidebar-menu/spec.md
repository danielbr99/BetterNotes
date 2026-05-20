# Feature Specification: Mobile Sidebar Menu & UI Refactor

**Feature Branch**: `005-mobile-sidebar-menu`  
**Created**: 2026-05-12  
**Status**: Draft  
**Input**: User description: "Implementar un menú lateral que se pueda desplegar con un botón de 3 barras arriba a la izquierda del menú principal. Desde este menú se podrá acceder a la vista de carpetas, Todas las Notas y papelera. La barra lateral incluye acceso a la vista kanban y a la vista ajustes. En la vista ajustes podremos acceder a la vista conexiones que ya existe y al botón de cerrar sesión que actualmente está arriba a la derecha. El botón de acceso a la vista kanban se moverá a la barra lateral en lugar de la parte superior de la pantalla inicial. El botón actual de crear una nota nueva se moverá a la parte inferior derecha de la pantalla en forma de un 'call to action', volviéndose un círculo con fondo del color de la aplicación y forma de cruz transparente en su interior."

## Clarifications

### Session 2026-05-12

- Q: Define the Trash behavior (Backend support needed for true deletion logic) → A: Implement support in Backend (Add `is_deleted` field to notes and create necessary endpoint).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sidebar Navigation (Priority: P1)

As a user, I want a centralized sidebar to access all main sections (Folders, All Notes, Kanban, Settings, Trash) so that the top header remains clean.

**Why this priority**: Core navigation overhaul. Essential for the new app structure.

**Independent Test**: Open the sidebar from any main screen and verify that all 5 items are present and functional.

**Acceptance Scenarios**:

1. **Given** the app is on the main screen, **When** I click the hamburger icon, **Then** I see: Folders, All Notes, Kanban, Settings, and Trash.
2. **Given** the sidebar is open, **When** I click "Kanban", **Then** I am navigated to the Kanban view and the sidebar closes.
3. **Given** the sidebar is open, **When** I click "Settings", **Then** I am navigated to the Settings view which contains "Connections" and "Logout".

---

### User Story 2 - Floating Action Button (Priority: P1)

As a user, I want a prominent "Create" button at the bottom right so that I can quickly add notes with one hand.

**Why this priority**: Critical UI change affecting the primary app action (creating content).

**Independent Test**: Verify the presence of a circular button with a cross icon at the bottom right of the Dashboard.

**Acceptance Scenarios**:

1. **Given** I am on the Dashboard, **When** I look at the bottom right, **Then** I should see a circular button in the app's primary color with a transparent "+" icon.
2. **Given** I tap the Floating Action Button, **Then** the "New Entry" selection (Note/Task) should appear.

---

### User Story 3 - Settings Refactor (Priority: P2)

As a user, I want to find "Logout" and "Connections" inside the Settings view so that account management is grouped logically.

**Why this priority**: Improves information architecture.

**Acceptance Scenarios**:

1. **Given** I am in the Settings view, **When** I look for account options, **Then** I should see "Connections" and a "Logout" button.

---

### Edge Cases

- **Header Cleanliness**: Ensure the old "Kanban", "Logout", and "Plus" buttons are removed from the Dashboard header.
- **FAB Visibility**: Does the FAB hide when scrolling or stay fixed? (Assumption: Stay fixed).
- **Settings Hierarchy**: Does the sidebar link directly to the main Settings page? (Assumption: Yes).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Implement a Drawer Navigator with the following items: Folders, All Notes, Kanban, Settings, Trash.
- **FR-002**: REMOVE the Kanban, Settings (from header), and Logout buttons from the Dashboard header.
- **FR-003**: Implement a Floating Action Button (FAB) at the bottom-right corner of the Dashboard.
- **FR-004**: The FAB MUST be circular, use the application's primary color, and contain a transparent "+" (cross) icon.
- **FR-005**: The "Settings" view MUST include a link to "Connections" and the "Logout" functionality.
- **FR-006**: The Backend MUST implement a soft delete mechanism using an `is_deleted` boolean field in the `entries` table.
- **FR-007**: The System MUST provide an endpoint/filter to retrieve only "trashed" (deleted) items.

### Key Entities *(include if feature involves data)*

- **Floating Action Button (FAB)**: The primary entry point for creating new content.
- **Sidebar Menu**: The primary navigation hub.
- **Trashed Entry**: An entry where `is_deleted` is True.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Dashboard header only contains the Hamburger icon (left) and possibly the Search bar.
- **SC-002**: FAB is reachable by the thumb in a natural grip (bottom-right).
- **SC-003**: Navigation to any major module takes 2 taps via the Sidebar.
- **SC-004**: Deleted notes are visible in the Trash view and hidden from "All Notes" and "Folders".

## Assumptions

- **Color Palette**: The "application color" refers to `#D4A017` (Gold/Brownish) seen in the current icons.
- **Icon Set**: We will use `Lucide` icons as established in the project.
- **Folders View**: A "Folders" view already exists or its route is defined.
