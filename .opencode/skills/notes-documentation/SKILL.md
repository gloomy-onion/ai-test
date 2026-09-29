---
name: notes-documentation
description: Create, review, and maintain append-only engineering notes in ./docs/notes/. Use when the user asks for a project note, engineering note, implementation note, gotcha, lesson learned, investigation note, provider quirk, debugging finding. Do NOT use for ADRs, meeting notes, live reference docs, or task plans.
---

# Notes Documentation

Use this skill to write and maintain `./docs/notes/`: an append-only engineering notebook for observations, gotchas, implementation findings, and lessons learned that should survive the task where they were discovered.

The goal is to preserve hard-won context before it disappears, without turning `notes/` into architecture decisions, meeting minutes, or live reference documentation.

## When to Use

Use this skill when the task is about:

- Creating a note in `./docs/notes/`.
- Reviewing or improving a note draft.
- Capturing a gotcha, provider quirk, debugging finding, production lesson, or implementation observation.
- Recording behavior that is not obvious from code, public docs, or current reference docs.
- Preserving cross-cutting knowledge that may help future tasks avoid the same mistake.

Do not use this skill for:

- Architecture decisions, alternatives, and consequences. Use `adr-documentation` and store them in `./docs/adr/`.
- Meeting or chat records. Store those in `./docs/meets/`.
- Current system contracts and maintained descriptions. Store those in `./docs/refs/internal/` or `./docs/refs/external/`.
- Task-specific implementation plans. Keep those in the planning artifact used by the active workflow, outside `docs/`.
- Secrets, credentials, private customer data, raw tokens, or sensitive logs.

## Documentation Index

- Read `./docs/index.md` before changing documentation. Paths beginning with `./docs/` are relative to the project root, not this skill directory.
- In the same change, ensure every created or modified document has a relative Markdown link in `./docs/index.md`; update its title or summary when needed. If the entry is already accurate, do not add a duplicate or make a cosmetic edit.
- When moving or renaming documents, update index entries and incoming links. When deleting a document, remove its entry and fix incoming links. Preserve historical records according to the rules below.
- Create `./docs/index.md` if missing. Keep it as the single project-wide documentation index, grouped by document type; validate links before finishing.

## Core Rules

- Store notes in `./docs/notes/`.
- Treat committed notes as point-in-time records. Do not rewrite old notes to make them current.
- If a note becomes outdated or wrong, create a newer note that corrects it and link back to the older note.
- Keep one note focused on one finding, incident pattern, provider behavior, or implementation gotcha.
- Prefer facts and evidence over speculation. If something is a hypothesis, label it as such.
- Capture enough context to make the observation reproducible or falsifiable later.
- Keep notes short enough to scan quickly. If the note becomes a maintained contract, move the stable content to `refs/`.
- If the observation leads to a significant choice, create or propose an ADR instead of hiding the decision inside a note.
- Redact secrets and sensitive data before writing. Use placeholders like `<redacted-token>` and describe the data shape, not the value.

## Filename Convention

Use chronological, kebab-case filenames:

```text
YYYY-MM-DD-short-topic.md
```

Examples:

```text
2026-06-16-provider-webhook-duplicates.md
2026-06-16-next-image-cache-invalidates-on-width.md
2026-06-16-fallow-fsd-boundary-output.md
```

Rules:

- Use the date when the observation was captured, not when the underlying bug first appeared.
- Keep the slug specific enough to understand from search results.
- If a filename already exists, append a short qualifier instead of overwriting: `2026-06-16-provider-webhook-duplicates-retry.md`.

## Note Types

Choose the closest type and reflect it in the frontmatter `type` field:

- `gotcha`: a trap future work may hit again.
- `investigation`: what was found while debugging or researching.
- `provider-quirk`: behavior of an external API/vendor that differs from expectations.
- `implementation`: non-obvious implementation detail that is not a decision.
- `incident-lesson`: blameless lesson from a production or operational problem.
- `tooling`: behavior of build, test, lint, CI, agents, or local tooling.

## Workflow

1. Inspect `./docs/index.md` and existing `./docs/notes/` files before writing.
2. Decide whether this belongs in `notes/`, `adr/`, `meets/`, `refs/`, or a task plan.
3. Gather only supported facts: context, environment, versions, commands, symptoms, logs after redaction, links, and current workaround.
4. If the note records an incident or mistake, write it blamelessly. Focus on system conditions and missing information, not on people.
5. Draft the note with scope and non-scope clear enough that future readers know what the note does not claim.
6. Ask one concise question if a critical fact is missing and cannot be inferred safely.
7. Create a new file in `./docs/notes/` with the date-based filename.
8. Do not delete or rewrite older notes unless the user explicitly asks and understands that this breaks the append-only history.

## Template

Use this compact template by default. Match the repository language or the user's requested language. If unclear, use the language of `./docs/index.md`.

```markdown
---
date: YYYY-MM-DD
type: gotcha | investigation | provider-quirk | implementation | incident-lesson | tooling
scope: subsystem-or-provider
confidence: observed | confirmed | hypothesis
tags: []
related:
  adr: []
  refs: []
  issues: []
  prs: []
---

# Short Note Title

## Summary

One short paragraph with the finding and why future work should care.

## Context

What was being implemented, debugged, integrated, or operated. Include relevant versions, environment, flags, or assumptions.

## Observation

What happened. Include exact symptoms, commands, error messages, timings, payload shapes, or other evidence after redaction.

## Implication

Why this matters. Describe the failure mode, risk, cost, or future trap.

## Current Handling

How the project currently works around it, detects it, or avoids it. If there is no handling yet, say so.

## Follow-ups

- [ ] Optional action item, owner/link if known.

## Links

- Related code, issues, PRs, external docs, ADRs, refs, dashboards, incidents, or meeting notes.
```

Omit optional sections only when they add no value. Keep `Summary`, `Context`, `Observation`, and `Implication` for every note.

## Boundaries With Other Docs

Use these tests before writing:

| Question | Destination |
|---|---|
| Is this a significant choice between alternatives? | `./docs/adr/` via `adr-documentation` |
| Did this happen in a meeting or async discussion? | `./docs/meets/` |
| Is this the current maintained contract of our system? | `./docs/refs/internal/` |
| Is this the current maintained contract of an external system? | `./docs/refs/external/` |
| Is this task-local planning or scratch work? | Task-planning artifacts outside `docs/` |
| Is this a reusable observation, trap, deviation, or lesson? | `./docs/notes/` |

When a note matures into a decision, keep the note as historical context and create an ADR that links back to it. Do not copy the whole note into the ADR.

When a note stabilizes into maintained knowledge, create or update a `refs/` document and link back to the note as the discovery record.

## Quality Checklist

Before writing or approving a note, verify:

- The note records a reusable observation, not a decision or live contract.
- The scope and non-scope are clear.
- The summary explains why the note matters.
- Claims are backed by evidence, links, commands, or explicit confidence level.
- Secrets, tokens, customer data, and sensitive logs are redacted.
- The note is blameless when it describes an incident, outage, or mistake.
- Follow-ups are actionable or omitted.
- Related ADRs, refs, issues, PRs, meetings, and external docs are linked when known.
- The filename is chronological and search-friendly.

## Response Pattern

When drafting before writing, respond with:

- Destination check: why this belongs in `docs/notes/` instead of `adr/`, `meets/`, `refs/`, or task-planning artifacts.
- Proposed file path.
- Draft note content.
- Missing facts or redaction concerns.
- A clear approval question before writing if the user asked for a draft rather than direct creation.

When reviewing notes, lead with findings and risks, then suggested edits. Treat misplaced notes as a blocking issue: a correct note in the wrong folder makes the documentation system less trustworthy.
