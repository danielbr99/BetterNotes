# Feature Specification: Folder Organization

**Feature Branch**: `006-folder-organization`  
**Created**: 2026-05-20  
**Status**: Draft  
**Input**: User description: "id like to create a new spec, its about folders, id like to be able to introduce notes and tasks into them, for organizational purposes"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and Manage Folders (Priority: P1)

As a user, I want to create, rename, and delete folders so that I can establish a structure for my notes and tasks.

**Why this priority**: Folders are the fundamental building block for organizational hierarchy. Without them, users cannot organize their content.

**Independent Test**: Can be fully tested by creating a folder in the UI, verifying it persists, and then deleting it.

**Acceptance Scenarios**:

1. **Given** I am on the dashboard, **When** I click "New Folder" and provide a name, **Then** a new empty folder is created and displayed.
2. **Given** an existing folder, **When** I choose to delete it, **Then** the folder is removed [NEEDS CLARIFICATION: What happens to the items inside the folder? Are they deleted or moved to the root?].

---

### User Story 2 - Organize Items into Folders (Priority: P1)

As a user, I want to move existing notes and tasks into specific folders so that they are logically grouped.

**Why this priority**: The primary goal is to organize items. Moving items into folders fulfills this core need.

**Independent Test**: Can be tested by selecting an existing note/task and assigning it to a destination folder.

**Acceptance Scenarios**:

1. **Given** a note at the root level, **When** I drag and drop it into a folder (or use a move menu), **Then** the note's `folder_id` is updated and it appears inside that folder.
2. **Given** a task inside Folder A, **When** I move it to Folder B, **Then** it no longer appears in Folder A and is now listed under Folder B.

---

### User Story 3 - Nested Folder Hierarchy (Priority: P2)

As a user, I want to create folders inside other folders so that I can have a multi-level organizational structure.

**Why this priority**: Power users need deeper categorization, but a flat folder structure is sufficient for an MVP.

**Independent Test**: Create a folder and set its parent to another existing folder. Verify it displays correctly in the UI tree.

**Acceptance Scenarios**:

1. **Given** Folder A exists, **When** I create Folder B and select Folder A as its parent, **Then** Folder B is nested under Folder A.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create a new folder with a required `name`.
- **FR-002**: System MUST allow notes and tasks to optionally reference a `folder_id`.
- **FR-003**: System MUST provide an interface to navigate into a folder and view only the items within it.
- **FR-004**: System MUST allow users to move an entry between folders or out of a folder to the root level.
- **FR-005**: System MUST support nested folders via a `parent_id` self-referential relationship on the Folder entity.

### Key Entities

- **Folder**: Represents a container for entries. Attributes: `id`, `name`, `parent_id` (optional), `user_id`, `is_encrypted`.
- **Entry (Note/Task)**: The items being organized. Must include a `folder_id` foreign key.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully create a folder and move an item into it without errors.
- **SC-002**: Folder navigation loads its contents in under 1 second.
- **SC-003**: The UI visually distinguishes between folders, notes, and tasks.

## Assumptions

- We assume the backend schema (`src/models.py`) already supports `folder_id` on entries and `parent_id` on folders, as seen in the current implementation. This feature focuses on the logic and UI integration.
- We assume encrypted folders will encrypt the metadata (e.g., folder name) similar to entries.
