<!-- 
Sync Impact Report:
- Version change: N/A -> 1.0.0
- List of modified principles:
  - PRINCIPLE_1: Spec-First Development
  - PRINCIPLE_2: Automatic Documentation
  - PRINCIPLE_3: Data Integrity & Validation
  - PRINCIPLE_4: Test-First Discipline
  - PRINCIPLE_5: Simplicity & Local-First
- Added sections: Core Principles, Additional Constraints, Governance
- Templates requiring updates: ✅ plan-template.md, ✅ spec-template.md, ✅ tasks-template.md
- Follow-up TODOs: None
-->

# Pro Notes System Constitution

## Core Principles

### I. Spec-First Development
All features MUST start with a machine-readable specification (OpenAPI 3.1) and a natural language feature spec before any implementation code is written. The contract is the source of truth for all API interactions.

### II. Automatic Documentation
The system MUST provide interactive API documentation (Swagger/ReDoc) that stays in sync with the implementation. Any drift between implementation and the OpenAPI contract is considered a critical failure.

### III. Data Integrity & Validation
Every input into the system MUST be validated against the defined schemas. We prioritize data correctness over "guesswork" parsing; invalid data MUST be rejected with clear error messages.

### IV. Test-First Discipline
A feature implementation is not complete without automated tests. We prefer writing contract and integration tests that verify the specification before the implementation is finalized.

### III. Simplicity & Local-First
The system is designed for local-first usage. Dependencies should be minimal, and the setup process must be straightforward (e.g., using SQLite). We avoid unnecessary complexity in favor of maintainable, clean code.

## Additional Constraints

- **Technology Stack**: Python 3.12+, FastAPI, SQLAlchemy, SQLite.
- **Documentation**: All technical specs must be written in English.
- **Versioning**: Semantic versioning (SemVer) is mandatory for API and documentation releases.

## Governance

- **Amendments**: Changes to this constitution require a version bump and an update to all dependent templates.
- **Compliance**: All tasks and plans must be reviewed against these principles during the `speckit-analyze` phase.

**Version**: 1.0.0 | **Ratified**: 2026-04-27 | **Last Amended**: 2026-04-27
