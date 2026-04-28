# Pro Notes System

Personal note management system focused on SDD (Spec-Driven Development) standards.

## API Usage

### Create a Note
```bash
curl -X POST http://localhost:4010/notas \
  -H "Content-Type: application/json" \
  -d '{"titulo": "My Note", "contenido": "Note content here"}'
```

### List All Notes
```bash
curl http://localhost:4010/notas
```

### Get a Note by ID
```bash
curl http://localhost:4010/notas/1
```

## Setup & Development

See [specs/001-notes-system/quickstart.md](specs/001-notes-system/quickstart.md) for full setup instructions.
