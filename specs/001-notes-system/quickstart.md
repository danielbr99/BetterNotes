# Quickstart: Pro Notes System

## Prerequisites

- Python 3.12+
- `uv` (recommended) or `pip`

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Or .venv\Scripts\activate on Windows
   ```

2. Install dependencies:
   ```bash
   pip install fastapi sqlalchemy uvicorn pydantic pytest httpx
   ```

## Running the API

Start the development server with:
```bash
uvicorn src.app:app --reload --port 4010
```

## Running Tests

Execute the test suite:
```bash
pytest
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:4010/docs
- ReDoc: http://localhost:4010/redoc
