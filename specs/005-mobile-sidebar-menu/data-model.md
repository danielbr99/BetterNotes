# Data Model: Soft Delete

## Database Changes (SQLite)

### Table: `entries`
- **New Field**: `is_deleted`
  - **Type**: BOOLEAN
  - **Default**: FALSE
  - **Description**: Flag to indicate if the entry is in the trash.

## SQL Migration
```sql
ALTER TABLE entries ADD COLUMN is_deleted BOOLEAN DEFAULT 0;
```

## Application Model (SQLAlchemy)
```python
class Entry(Base):
    # ... existing fields ...
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
```

## Logic
- **Soft Delete**: `UPDATE entries SET is_deleted = 1 WHERE id = ?;`
- **Restore**: `UPDATE entries SET is_deleted = 0 WHERE id = ?;`
- **Permanent Delete**: `DELETE FROM entries WHERE id = ? AND is_deleted = 1;`
- **Active Entries**: `SELECT * FROM entries WHERE is_deleted = 0;`
- **Trash Entries**: `SELECT * FROM entries WHERE is_deleted = 1;`
