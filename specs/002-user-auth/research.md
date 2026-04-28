# Research: User Authentication

## Decisions

### 1. Authentication Strategy: JWT (JSON Web Tokens)
- **Decision**: Use JWT for stateless authentication.
- **Rationale**: Standard practice for FastAPI applications. It allows the server to verify user identity without storing session state in the database, aligning with our "Simplicity" principle.
- **Alternatives considered**: Session-based auth (requires server-side storage/Redis).

### 2. Password Hashing: Passlib with Bcrypt
- **Decision**: Use `passlib[bcrypt]` for secure password storage.
- **Rationale**: Industry standard for Python. Prevents storing plain-text passwords and protects against rainbow table attacks.

### 3. API Security Flow: OAuth2 Password Bearer
- **Decision**: Use FastAPI's `OAuth2PasswordBearer` with JWT.
- **Rationale**: Provides native integration with Swagger UI (`/docs`), allowing the user to click "Authorize" and test the API directly from the browser.

### 4. Database Schema Update
- **Decision**: Add a `User` model and a `user_id` foreign key to the `Note` model.
- **Rationale**: Enables FR4 (Resource Ownership). Each note will belong to exactly one user.

## Dependencies to Add
- `python-jose[cryptography]` (for JWT tokens)
- `passlib[bcrypt]` (for hashing)
- `python-multipart` (required for OAuth2 password flow in FastAPI)
