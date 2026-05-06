# Technical Integrity Checklist: Kanban-Rich Notes

**Purpose**: This checklist serves as a requirements-quality validation suite ("Unit Tests for English") for the Kanban-Rich Notes feature. It focuses on technical integrity, API contract robustness, polymorphic data consistency, and UX clarity.
**Created**: 2026-05-05
**Feature**: 003-kanban-rich-notes

## Requirement Completeness

- [ ] CHK001 - Are all CRUD operations defined for the polymorphic `Entry` entity (Note vs Task)? [Completeness, Spec §FR-001]
- [ ] CHK002 - Are requirements defined for how the system distinguishes between `Note` and `Task` types at the API level? [Clarity, Spec §Key Entities]
- [ ] CHK003 - Is the lifecycle of a `Media Item` (upload, attachment, deletion) fully specified? [Completeness, Spec §FR-030-035]
- [ ] CHK004 - Are the specific rich-text formatting tags supported by the system explicitly listed? [Completeness, Spec §FR-010-015]

## Requirement Clarity

- [ ] CHK005 - Is "client-side encryption" quantified with specific hand-off points between the client and API (e.g., "The API receives only encrypted bytes")? [Clarity, Spec §Assumptions]
- [ ] CHK006 - Is the format of the `content` field for encrypted items defined (e.g., Base64 encoded blob)? [Clarity, Spec §FR-022]
- [ ] CHK007 - Are "Apple Notes style" UI elements quantified with specific positioning or layout requirements? [Clarity, Spec §FR-040]
- [ ] CHK008 - Is the behavior for "image attachment styles" (inline, floating, full-width) defined with clear layout rules? [Clarity, Spec §FR-031]

## Requirement Consistency

- [ ] CHK009 - Do the metadata requirements for `Entry` align between the base class and the `Task` subtype without redundant fields? [Consistency, Spec §Key Entities]
- [ ] CHK010 - Are tag and folder association requirements consistent across both Notes and Tasks? [Consistency, Spec §FR-016-017]
- [ ] CHK011 - Is the handling of encrypted content consistent across search and filter operations (e.g., "Search MUST NOT index encrypted content")? [Consistency, Spec §FR-036]

## Edge Case & Exception Coverage

- [ ] CHK012 - Does the spec define the system's behavior when a user forgets their encryption password (e.g., "Data is permanently lost")? [Coverage, Spec §Edge Cases]
- [ ] CHK013 - Are requirements defined for handling large media uploads (e.g., size limits, timeout behavior)? [Gap, Spec §Edge Cases]
- [ ] CHK014 - Is the behavior specified for "orphan assets" (media uploaded but never attached to a note)? [Gap]
- [ ] CHK015 - Does the spec define what happens if a task is moved to a non-existent kanban column via the API? [Edge Case, Spec §Edge Cases]

## Non-Functional Requirements

- [ ] CHK016 - Are latency targets defined for the encryption/decryption process on the client side? [Gap, SC-004]
- [ ] CHK017 - Is the performance requirement for 1,000 items specified for both "list" and "search" operations? [Measurability, SC-009-010]
- [ ] CHK018 - Are accessibility requirements (ARIA labels, keyboard shortcuts) defined for the rich-text editor? [Coverage, Spec §FR-042]

## Traceability & Measurability

- [ ] CHK019 - Can the "100% data retention" success criterion be objectively verified with specific persistence requirements? [Measurability, SC-003]
- [ ] CHK020 - Are all Success Criteria (SC-001 through SC-011) mapped to specific Functional Requirements? [Traceability]
