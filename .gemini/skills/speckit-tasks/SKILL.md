---
name: speckit-tasks
description: Generate an actionable, dependency-ordered tasks.md for the feature based on available design artifacts.
---

# Spec Kit Tasks Skill

## When to Use

- The implementation plan is ready and you need to break it down into actionable tasks.

## Inputs

- `specs/<feature>/plan.md`
- `specs/<feature>/spec.md`
- Repo context and `.specify/` templates

## Pre-Execution Checks

**Check for extension hooks (before tasks generation)**:
- Check if `.specify/extensions.yml` exists.
- Check `hooks.before_tasks`. Execute mandatory or optional hooks as defined.

## Workflow

1. **Setup**: Run `.specify/scripts/powershell/check-prerequisites.ps1 -Json` from repo root and parse `FEATURE_DIR` and `AVAILABLE_DOCS`.

2. **Load design documents**: Read from `FEATURE_DIR` (`plan.md`, `spec.md`, and optional docs like `data-model.md`).

3. **Execute task generation workflow**:
   - Generate tasks organized by user story (P1, P2, P3).
   - Generate dependency graph showing user story completion order.
   - Create parallel execution examples per user story.
   - Validate task completeness.

4. **Generate tasks.md**: Use `.specify/templates/tasks-template.md`.
   - Phase 1: Setup tasks.
   - Phase 2: Foundational tasks.
   - Phase 3+: One phase per user story.
   - Final Phase: Polish.
   - Ensure all tasks follow the strict checkbox format (`- [ ]`).

5. **Report**: Output path to `tasks.md` and summary (task count, MVP scope).

6. **Check for extension hooks (after tasks generation)**:
   - Check `hooks.after_tasks` in `.specify/extensions.yml`.

## Outputs

- `specs/<feature>/tasks.md`

## Next Steps

- **Implement** tasks with `speckit-implement`.
