# Handoff: Kanban-Rich Notes Backend (v1.0.0)

## 📌 Overview
The backend for the **Kanban-Rich Notes Application** is complete and verified. It supports a polymorphic entry system (Notes & Tasks), hierarchical folders, client-side encryption hooks, and local asset storage.

**Feature Directory**: `specs/003-kanban-rich-notes/`
**Base URL**: `http://localhost:8000`

---

## 🛠️ Technical Architecture

### 1. Polymorphic Entries (`/entries`)
The system uses a single table for both Notes and Tasks.
- **`type: "note"`**: Simple content items.
- **`type: "task"`**: Includes Kanban metadata (`priority`, `status_column`, `due_date`).
- **Validation**: The API will reject Kanban metadata updates if the entry `type` is `note`.

### 2. Client-Side Encryption
**Critical**: The server **never** sees plaintext for encrypted items.
- **`is_encrypted: true`**: When set, the `contenido` field should contain the encrypted blob.
- **`encryption_metadata`**: A JSON string field for the frontend to store IVs, salts, and algorithm hints.
- **Cascading**: If an entry is created inside an encrypted folder, it automatically inherits `is_encrypted: true` and the folder's `encryption_metadata`.

### 3. Asset Management (`/assets`)
- **Upload**: `POST /assets` accepts `multipart/form-data`. You can optionally pass `entry_id` to link it immediately.
- **Retrieval**: `GET /assets/{asset_id}` returns the binary file.
- **Deletion**: `DELETE /assets/{asset_id}` cleans up both DB metadata and the local disk.

### 4. Organization
- **Folders**: Hierarchical support via `parent_id`.
- **Tags**: Handled as a JSON list in the API, but optimized as a comma-separated string in the DB.

---

## 🚀 Key Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/entries` | List entries with filters (`type`, `status_column`, `priority`, `is_encrypted`, `folder_id`) and sorting (`sort_by`, `order`). |
| `POST` | `/entries` | Create Note or Task. |
| `PATCH` | `/entries/{id}` | Update content or move tasks between Kanban columns. |
| `POST` | `/assets` | Upload images/drawings. |
| `GET` | `/folders` | List hierarchical folder structure. |

---

## 🧪 Verification & Quality
- **Integration Tests**: 19 tests in `tests/test_entries.py` cover all critical paths.
- **Contract**: `openapi.yaml` is the source of truth for all schemas and parameters.
- **Checklist**: All technical integrity requirements from `checklists/technical-integrity.md` have been met.

---

## 📝 Frontend Implementation Tips (React)
1.  **Encryption**: Use the Web Crypto API to handle AES-256 encryption before sending data to `/entries`.
2.  **Rich Text**: Store your WYSIWYG JSON structure in the `contenido` field.
3.  **Kanban**: Use the `status_column` field for your drag-and-drop implementation; the backend handles the sorting logic via `order_by`.
4.  **Auth**: Bearer Token authentication is required for all `/entries`, `/assets`, and `/folders` endpoints.
