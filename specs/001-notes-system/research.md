# Research: Pro Notes System

## Decision: FastAPI with SQLAlchemy and SQLite

- **Rationale**: FastAPI provides native support for OpenAPI 3.1, matching our contract requirement. SQLAlchemy is the industry standard ORM for Python, and SQLite is perfect for a local "Pro Notes" tool without requiring a separate database server.
- **Alternatives considered**: 
  - Django: Rejected as too heavy for a simple note API.
  - Flask: Rejected as it lacks native async support and built-in OpenAPI documentation compared to FastAPI.

## Decision: Pydantic v2 for Data Validation

- **Rationale**: Pydantic v2 is significantly faster than v1 and has better support for JSON Schema and OpenAPI. It aligns perfectly with FastAPI's latest versions.
- **Alternatives considered**: None (Pydantic is the default and best choice for FastAPI).

## Decision: Async Pytest with HTTPX

- **Rationale**: Testing async FastAPI endpoints requires an async-capable client. HTTPX with the `pytest-asyncio` plugin is the recommended pattern.
- **Alternatives considered**: Flask's `TestClient` (not compatible).

## Technical Unknowns Resolved

- **Unknown**: How to handle unique ID generation in SQLite.
- **Resolution**: Use SQLAlchemy's `Integer` with `primary_key=True`, which defaults to `AUTOINCREMENT` in SQLite.
- **Unknown**: Date-time format for `fecha_creacion`.
- **Resolution**: Use Python's `datetime.datetime.now(datetime.UTC)` to ensure ISO 8601 compliance as specified in the contract.
