# Feature Specification: User Authentication

**Status**: Draft
**Owner**: [User]
**Created**: 2026-04-28

## Problem Statement
The current Pro Notes API is public, allowing anyone to read or create notes. To protect user data, the system needs a way to verify user identity and ensure that notes are private to their owners.

## User Stories
- **US1**: As a new user, I want to create an account so I can start saving my notes securely.
- **US2**: As a returning user, I want to log in with my credentials to access my existing notes.
- **US3**: As a user, I want my notes to be protected so that other users cannot see or modify them.

## Functional Requirements
- **FR1: User Registration**: Users must be able to register with an email and a secure password.
- **FR2: Secure Login**: The system must provide a token-based login mechanism (JWT).
- **FR3: Protected Endpoints**: All `/notas` endpoints must require a valid authentication token.
- **FR4: Resource Ownership**: Users should only be able to see and manage notes they created.

## Success Criteria
- [ ] Users can register and log in through the API.
- [ ] Unauthenticated requests to `/notas` return a `401 Unauthorized` status.
- [ ] A user cannot access another user's notes by changing the ID in the URL.
- [ ] Authentication adds less than 100ms of latency to protected requests.

## User Scenarios & Testing
1. **Scenario: Successful Registration**
   - Given a new user email and password.
   - When POSTing to `/auth/register`.
   - Then the user is created and a success message is returned.
2. **Scenario: Access Denied**
   - Given no authentication token.
   - When GETting `/notas`.
   - Then the system returns `401 Unauthorized`.

## Assumptions
- We will use JWT for stateless authentication.
- Passwords will be hashed using a modern algorithm (e.g., bcrypt).
- For this phase, we won't implement password recovery or email verification.
