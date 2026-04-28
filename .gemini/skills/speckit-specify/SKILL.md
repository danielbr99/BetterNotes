---
name: speckit-specify
description: Create or update a feature specification from a natural language feature description.
---

# Spec Kit Specify Skill

## When to Use

- The user wants a new or updated feature spec from a natural language description.

## Inputs

- Feature description from the user.
- Repo context with `.specify/` scripts and templates.

## Pre-Execution Checks

**Check for extension hooks (before specification)**:
- Check if `.specify/extensions.yml` exists in the project root.
- If it exists, read it and look for entries under the `hooks.before_specify` key.
- Filter out hooks where `enabled` is explicitly `false`.
- For each executable hook, output the instruction to execute it (Optional or Mandatory).
- If a mandatory hook is present, wait for its result before proceeding.

## Workflow

The user's feature description in the request **is** the input.

1. **Generate a concise short name** (2-4 words) for the feature:
   - Example: "Add user authentication" → "user-auth".

2. **Branch creation** (optional, via hook):
   - If a `before_specify` hook ran, note the `BRANCH_NAME` and `FEATURE_NUM`.

3. **Create the spec feature directory**:
   - Resolution order for `SPECIFY_FEATURE_DIRECTORY`:
     1. User provided `SPECIFY_FEATURE_DIRECTORY`.
     2. Auto-generate under `specs/`:
        - Prefix: Sequential (`NNN`) or Timestamp (`YYYYMMDD-HHMMSS`) based on `.specify/init-options.json`.
        - Name: `<prefix>-<short-name>` (e.g., `001-user-auth`).
   - `mkdir -p SPECIFY_FEATURE_DIRECTORY`
   - Copy `.specify/templates/spec-template.md` to `SPECIFY_FEATURE_DIRECTORY/spec.md`.
   - Persist path to `.specify/feature.json`.

4. **Execute specification workflow**:
   - Parse user description.
   - Extract concepts: actors, actions, data, constraints.
   - Make informed guesses for gaps; limit `[NEEDS CLARIFICATION]` markers to **max 3**.
   - Fill Functional Requirements, Success Criteria (measurable, tech-agnostic), and User Scenarios.

5. **Write the specification**: Fill the template in `SPECIFY_FEATURE_DIRECTORY/spec.md`.

6. **Quality Validation**:
   - Generate `SPECIFY_FEATURE_DIRECTORY/checklists/requirements.md`.
   - Run validation check against the spec.
   - If `[NEEDS CLARIFICATION]` markers exist, present them to the user in a table format (max 3).
   - Update spec based on user choices.

7. **Report completion**:
   - Show `SPECIFY_FEATURE_DIRECTORY` and `SPEC_FILE` path.
   - Summary of checklist results.

8. **Check for extension hooks (after specification)**:
   - Look for `hooks.after_specify` in `.specify/extensions.yml` and execute as needed.

## Outputs

- `specs/<feature>/spec.md`
- `specs/<feature>/checklists/requirements.md`
- `.specify/feature.json` (persisted state)

## Next Steps

- **Plan** implementation with `speckit-plan`.
- **Clarify** if needed with `speckit-clarify`.
