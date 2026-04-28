---
name: speckit-plan
description: Execute the implementation planning workflow using the plan template to generate design artifacts.
---

# Spec Kit Plan Skill

## When to Use

- The feature spec is ready and you need a technical implementation plan.

## Inputs

- `specs/<feature>/spec.md`
- Repo context and `.specify/` templates

## Pre-Execution Checks

**Check for extension hooks (before planning)**:
- Check if `.specify/extensions.yml` exists.
- Check `hooks.before_plan`. Execute mandatory or optional hooks as defined.

## Workflow

1. **Setup**: Run `.specify/scripts/powershell/setup-plan.ps1 -Json` from repo root and parse JSON for FEATURE_SPEC, IMPL_PLAN, SPECS_DIR, BRANCH.

2. **Load context**: Read FEATURE_SPEC and `.specify/memory/constitution.md`. Load IMPL_PLAN template (already copied).

3. **Execute plan workflow**: Follow the structure in IMPL_PLAN template:
   - Fill Technical Context (mark unknowns as "NEEDS CLARIFICATION")
   - Fill Constitution Check section from constitution.
   - Evaluate gates.
   - Phase 0: Generate `research.md` (resolve all NEEDS CLARIFICATION).
   - Phase 1: Generate `data-model.md`, `contracts/`, `quickstart.md`.
   - Update agent context: Update reference in `GEMINI.md` between `<!-- SPECKIT START -->` and `<!-- SPECKIT END -->` to point to the new plan file.

4. **Stop and report**: Report branch, IMPL_PLAN path, and generated artifacts.

5. **Check for extension hooks (after planning)**:
   - Check `hooks.after_plan` in `.specify/extensions.yml`.

## Outputs

- `specs/<feature>/plan.md`
- `specs/<feature>/research.md`
- `specs/<feature>/data-model.md`
- `specs/<feature>/contracts/`
- `specs/<feature>/quickstart.md`
- Updated `GEMINI.md`

## Next Steps

- **Generate tasks** with `speckit-tasks`.
- **Create a checklist** with `speckit-checklist`.
