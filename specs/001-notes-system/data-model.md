# Data Model: Pro Notes System

## Entities

### Note

| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| `id` | int64 | Read-only, Unique | Automatically generated primary key. |
| `titulo` | string | Mandatory, Non-empty | The title of the note. |
| `contenido` | string | Mandatory | The main text body of the note. |
| `fecha_creacion` | datetime | Read-only, ISO 8601 | Timestamp when the note was stored. |

## Relationships

- Currently standalone entity. No relationships defined for MVP.

## State Transitions

- **Pending** -> **Stored**: When a valid POST request is received.
- **Stored** -> **Retrieved**: When a GET request is made.
