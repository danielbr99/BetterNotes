# Feature Specification: Kanban-Based Notes Application with Encryption

**Feature Branch**: `001-kanban-notes-app`  
**Created**: 28 de abril de 2026  
**Status**: Draft  
**Input**: User description: Build a Notes style application based on a kanban table with category, date, importance/priority and done/not done status. The application must contain encryption capabilities and a kanban view to help organize the workflow. Notes will be written with an Apple Notes style interface with basic and quality of life tools. The app will integrate drawing and image inserting tools that blend seamlessly into the text with different image attachment styles like Microsoft Word.

## Clarifications

### Session 2026-04-28

- Q: What is the distinction between Tasks and Notes? → A: Tasks have kanban properties (priority, state/done/not done); Notes are simple with title, content, date, encryption only
- Q: How are items organized? → A: Both Tasks and Notes can be stored in folders (previously named groups)
- Q: How are items classified? → A: Tags (previously named categories) classify Tasks and Notes based on content; single item can have multiple Tags

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Create and Organize Tasks in Kanban View (Priority: P1)

Users need to create tasks and view them in a kanban-style board organized by customizable columns representing status, priority, or workflow stages. Tasks have kanban-specific properties like priority and completion state. This is the core MVP that enables users to see all their tasks at a glance and move them through different states.

**Why this priority**: Without the ability to create, view, and organize tasks in kanban, the application has no primary workflow value. This is the essential foundation that makes the app functional as a task management system.

**Independent Test**: Can be fully tested by creating 5-10 tasks, assigning them to different kanban columns, and verifying they persist and display correctly in the kanban view.

**Acceptance Scenarios**:

1. **Given** a user opens the application for the first time, **When** they create a new task, **Then** it appears in the default kanban column and is assigned a unique identifier
2. **Given** a task exists in one kanban column, **When** the user drags it to another column, **Then** the task's status updates and persists
3. **Given** multiple tasks exist, **When** the user views the kanban board, **Then** tasks are organized by their assigned columns and visible simultaneously
4. **Given** a task is created, **When** the user closes and reopens the application, **Then** the task and its kanban column assignment are preserved

---

### User Story 2 - Write and Edit Notes and Tasks with Rich Text Tools (Priority: P1)

Users need a text editor inspired by Apple Notes that allows them to write notes and tasks with basic formatting (bold, italic, underline, lists, headings) and quality-of-life features. This provides the primary interface for content creation for both simple notes and task descriptions.

**Why this priority**: Without a functional and intuitive text editor, users cannot effectively create meaningful notes or task descriptions. This is co-equal with the kanban view as a core MVP component.

**Independent Test**: Can be fully tested by creating a note or task with various text formats, verifying formatting is applied and persists when saved, and confirming the interface is intuitive without requiring documentation.

**Acceptance Scenarios**:

1. **Given** a user opens a note or task for editing, **When** they select text and apply bold/italic/underline formatting, **Then** the formatting is visually applied immediately
2. **Given** formatted text exists, **When** the user saves the note or task, **Then** formatting is preserved when the note or task is reopened
3. **Given** a user is typing, **When** they use keyboard shortcuts (Cmd/Ctrl+B for bold, Cmd/Ctrl+I for italic), **Then** formatting applies correctly
4. **Given** a note or task editor is open, **When** the user creates lists or headings, **Then** text is properly formatted and indented

---

### User Story 3 - Encrypt Notes and Tasks and Manage Encryption (Priority: P1)

Users need the ability to encrypt sensitive notes and tasks (such as diaries or password credentials) with individual passwords on a per-item basis. By default, notes and tasks are unencrypted; users can opt-in to protect individual items. Users can also encrypt entire folders or tag groups with a single password, and all encrypted items are visible in a dedicated "Protected" view. This protects private information and is essential for the application's security positioning.

**Why this priority**: Encryption is explicitly required and critical for user trust and data protection. Without it, the application cannot safely store sensitive information.

**Independent Test**: Can be fully tested by encrypting a note or task with a password, closing the application, reopening it, and verifying the item is inaccessible without the correct password.

**Acceptance Scenarios**:

1. **Given** a user has created a note or task, **When** they enable encryption and set a password, **Then** the item is encrypted and locked
2. **Given** an encrypted note or task exists, **When** a user attempts to view it without the correct password, **Then** they are prompted to enter the password
3. **Given** a user enters the correct password for an encrypted item, **When** the decryption succeeds, **Then** the content becomes readable
4. **Given** a user has an encrypted item, **When** they close and reopen the application, **Then** the item remains encrypted until decrypted

---

### User Story 4 - Add Images and Drawings to Notes and Tasks (Priority: P2)

Users need to insert images and drawings directly into their notes and tasks with multiple attachment styles (inline, floating, full-width) similar to Microsoft Word. This enables users to create richer, more visual content that blends text with media seamlessly.

**Why this priority**: While essential for a polished feature set, image and drawing capabilities are secondary to the core content creation and encryption features. They enhance the user experience but aren't blocking basic functionality.

**Independent Test**: Can be fully tested by inserting an image into a note or task, applying different attachment styles, verifying it displays correctly, and confirming it persists when the item is reopened.

**Acceptance Scenarios**:

1. **Given** a note or task is open for editing, **When** the user selects "Insert Image," **Then** a file picker opens and allows selection of image files
2. **Given** an image has been inserted, **When** the user right-clicks on it, **Then** options appear to change attachment style (inline, floating, full-width)
3. **Given** a user is in drawing mode, **When** they draw on the canvas, **Then** the drawing is inserted into the note or task at the cursor position
4. **Given** a note or task contains images and drawings, **When** the item is saved and reopened, **Then** all media elements display in their original positions and styles

---

### User Story 5 - Manage Task Metadata (Priority, Date, Status) (Priority: P2)

Users need to set and view metadata for each task including priority level, due date, and completion status. This metadata drives the kanban organization and helps users prioritize their workflow. Notes have simpler metadata (date, encryption) without kanban properties.

**Why this priority**: While important for task organization and workflow management, metadata management is secondary to having a functional content-creation and editing experience. It enhances organization but isn't blocking core functionality.

**Independent Test**: Can be fully tested by creating a task, setting priority/date/status metadata, verifying it displays in the kanban view, and confirming filters/sorting by metadata work correctly.

**Acceptance Scenarios**:

1. **Given** a task is open, **When** the user sets a priority level (high/medium/low), **Then** the priority is reflected visually in the kanban board
2. **Given** a task exists, **When** the user assigns a due date, **Then** the date is stored and can be used for filtering and sorting
3. **Given** a user assigns a due date to a task, **When** the date passes, **Then** the task is marked as overdue or shows a visual indicator
4. **Given** a task is complete, **When** the user marks it as done, **Then** it moves to the done column and can be filtered or hidden from the main view

### Edge Cases

- What happens when a user forgets their encryption password for an encrypted note? (Recovery mechanism needed or note is permanently inaccessible)
- How does the system handle very large images or many images in a single note for performance?
- What happens when a user attempts to move a note to an invalid or non-existent kanban column?
- How does the application handle concurrent edits if the same note is opened in multiple windows/tabs?
- What happens when encryption is applied to an already-modified note that hasn't been saved?
- How does the system manage image storage and cleanup if images are deleted from notes?
- What happens if the application crashes during a note save operation?
- How does the system behave when storage is full or quota is exceeded?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

**Item Creation & Management**:
- **FR-001**: System MUST allow users to create new notes (simple items with title, content, date, encryption) and tasks (items with kanban properties like priority and status)
- **FR-002**: System MUST allow users to edit existing notes and tasks without restrictions on length or content
- **FR-003**: System MUST automatically save notes and tasks at regular intervals (autosave) to prevent data loss
- **FR-004**: System MUST allow users to delete notes and tasks with a confirmation prompt

**Kanban View & Organization** (Tasks only):
- **FR-005**: System MUST display tasks in a kanban board view with customizable columns representing workflow states
- **FR-006**: System MUST support dragging tasks between kanban columns to update their status
- **FR-007**: System MUST allow users to create, rename, and delete kanban columns
- **FR-008**: System MUST support at least these default columns: To-Do, In Progress, Done, and allow unlimited custom columns with a UX warning after 10 columns to encourage focused workflow organization
- **FR-009**: System MUST persist kanban column configuration and task positions across sessions

**Rich Text Editing**:
- **FR-010**: System MUST support bold, italic, underline, and strikethrough text formatting for both notes and tasks
- **FR-011**: System MUST support heading levels (H1, H2, H3) and body text styles for both notes and tasks
- **FR-012**: System MUST support ordered and unordered lists with indentation for both notes and tasks
- **FR-013**: System MUST support keyboard shortcuts for common formatting (Cmd/Ctrl+B, Cmd/Ctrl+I, Cmd/Ctrl+U) for both notes and tasks
- **FR-014**: System MUST allow users to change text color and highlight text for both notes and tasks
- **FR-015**: System MUST provide text formatting toolbar accessible from the editor interface for both notes and tasks

**Item Metadata & Organization**:
- **FR-016**: System MUST allow users to organize notes and tasks into folders (hierarchical containers)
- **FR-017**: System MUST allow users to assign multiple tags to notes and tasks for flexible classification and filtering
- **FR-018**: System MUST allow users to set a priority level (High, Medium, Low) for tasks only
- **FR-019**: System MUST allow users to assign a due date to tasks only
- **FR-020**: System MUST allow users to mark tasks as complete/done with a status indicator
- **FR-021**: System MUST display task metadata visually in the kanban view (color coding, badges, icons)

**Encryption & Security**:
- **FR-022**: System MUST allow users to encrypt individual notes and tasks with a unique password-based encryption mechanism (AES-256 or equivalent)
- **FR-023**: System MUST allow users to encrypt an entire folder or tag group with a single password
- **FR-024**: System MUST prevent viewing of encrypted content without the correct password
- **FR-025**: System MUST display visual indicators for encrypted items (lock icon, badge, or color indicator)
- **FR-026**: System MUST provide a "Protected" view that shows all encrypted notes, tasks, and folders in one consolidated location for easy access
- **FR-027**: System MUST allow users to toggle encryption on/off for individual items (password entry required to turn off encryption)
- **FR-028**: System MUST securely store encrypted items with no plaintext recovery option if password is lost
- **FR-029**: System MUST support different passwords for different items and folder/tag groups

**Image & Drawing Integration**:
- **FR-030**: System MUST allow users to insert images into notes and tasks from file system
- **FR-031**: System MUST support multiple image attachment styles (inline, floating, full-width, wrapped) for both notes and tasks
- **FR-032**: System MUST allow users to resize and reposition inserted images within notes and tasks
- **FR-033**: System MUST provide a drawing tool that allows users to draw directly within notes and tasks
- **FR-034**: System MUST support multiple drawing tools (pen, eraser, shapes) with customizable colors and line widths for both notes and tasks
- **FR-035**: System MUST preserve images and drawings when notes and tasks are saved, closed, and reopened

**Search & Filtering**:
- **FR-036**: System MUST allow users to search notes and tasks by title and content (excluding encrypted content without password entry)
- **FR-037**: System MUST allow users to filter items by tags, folders, priority (tasks only), due date (tasks only), and completion status (tasks only)
- **FR-038**: System MUST support filtering to show/hide encrypted items or only display unencrypted items
- **FR-039**: System MUST provide a "Protected" view that aggregates all encrypted notes, tasks, and folders for easy access

**User Interface Quality**:
- **FR-040**: System MUST display an intuitive editor interface inspired by Apple Notes with minimal visual clutter for both notes and tasks
- **FR-041**: System MUST provide tooltips and help text for non-obvious features and tools
- **FR-042**: System MUST support keyboard navigation for power users (Tab through elements, shortcuts for actions)
- **FR-043**: System MUST automatically delete associated physical asset files from disk when their corresponding Note or Task is deleted to prevent storage bloat.

### Key Entities

- **Entry (Base)**: Polymorphic base entity containing common fields: title, content (rich text or encrypted blob), date, encryption state, tags, folder, and owner.
- **Note (Entry Subtype)**: Simple item with no kanban workflow properties.
- **Task (Entry Subtype)**: Workflow item extending Entry with kanban properties: priority, status (column), and due date.
- **Folder**: Hierarchical container that can hold Entries.
- **Tag**: Flexible classification label that can be assigned to multiple Entries.
- **Kanban Column**: Represents a workflow stage in the kanban board with a name, position, and associated Tasks.
- **Media Item**: Represents an attached image or drawing with position, size, attachment style, and reference to a storage ID (handled via asset endpoint).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create and view a note or task with title and content within 10 seconds from application launch
- **SC-002**: Users can organize tasks in a kanban board and move them between columns without page reload or lag (visual feedback within 200ms)
- **SC-003**: Notes and tasks persist across application restarts with 100% data retention (no loss of content, metadata, or media)
- **SC-004**: Users can encrypt a note or task and decrypt it with the correct password within 5 seconds
- **SC-005**: Encrypted items are completely inaccessible without the correct password (no plaintext visible in storage or UI)
- **SC-006**: Users can insert an image into a note or task and apply different attachment styles within 15 seconds
- **SC-007**: Users can apply at least 5 different text formatting options (bold, italic, underline, heading, list) and have formatting persist for both notes and tasks
- **SC-008**: 90% of users can complete a full workflow (create task → add metadata → encrypt → add image → move in kanban) without documentation
- **SC-009**: Application supports at least 1,000 notes and tasks without noticeable performance degradation (UI remains responsive)
- **SC-010**: Search functionality returns relevant results within 500ms for a 1,000-item collection (notes and tasks)
- **SC-011**: All notes and tasks remain secure with no unauthorized access even if storage is compromised for encrypted items

## Assumptions

- **User Base**: Target users are individuals and teams who want a modern note-taking and task management solution with organization capabilities; casual to power users
- **Platform**: The application will be a cross-platform (desktop) solution supporting local-first storage; cloud sync is out of scope for v1
- **Data Storage**: Local-first storage using a central database; while currently hosted via FastAPI, the architecture prioritizes offline-readiness and local persistence.
- **Item Types**: Notes are simple content items without kanban workflow properties; Tasks include kanban properties (priority, status, due date) for workflow management
- **Organization**: Both notes and tasks can be organized in folders (hierarchical) and classified with tags (flexible, multi-assignment)
- **Encryption Method**: Client-side password-based encryption (AES-256 or similar industry standard) is used; recovery options for lost passwords are not available in v1. The server only stores encrypted blobs.
- **Image Handling**: Images are embedded or referenced; image optimization and compression are handled automatically to prevent storage bloat
- **Performance Baseline**: The application targets responsive performance for up to 5,000 notes and tasks; larger collections may experience performance trade-offs
- **Browser Compatibility**: If web-based, modern browsers (Chrome, Firefox, Safari, Edge) released within the last 2 years are supported
- **Markdown vs. Rich Text**: The application uses rich text editing (WYSIWYG) rather than markdown for user-friendliness inspired by Apple Notes
- **Autosave Interval**: Notes and tasks are automatically saved every 30 seconds or on blur (when editor loses focus), whichever comes first
- **Column Customization**: Users can have unlimited custom kanban columns, but the UI should provide clear guidance to prevent excessive column proliferation
- **Undo/Redo**: Standard undo/redo functionality (Cmd/Ctrl+Z, Cmd/Ctrl+Y) is available for all edit operations within the current session
- **Concurrency**: v1 assumes single-user access per item; concurrent editing is out of scope for v1
