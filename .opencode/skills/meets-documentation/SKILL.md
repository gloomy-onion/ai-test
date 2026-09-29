---
name: meets-documentation
description: Create, review, and maintain append-only meeting records in ./docs/meets/. Use when the user asks for meeting notes, meeting minutes, protocol, sync notes, client call notes, async agreement records. Do NOT use for ADRs, engineering gotchas, live reference docs, or task plans.
---

# Meets Documentation

Use this skill to write and maintain `./docs/meets/`: an append-only archive of meetings, calls, syncs, and asynchronous discussion records.

The goal is to preserve what happened, who was involved, what was agreed, what remains open, and what follow-up work was assigned at a specific point in time. `meets/` records the event and links to durable artifacts; it does not replace ADRs, issues, PRs, or live reference documentation.

## When to Use

Use this skill when the task is about:

- Creating a meeting note in `./docs/meets/`.
- Reviewing or improving a meeting note draft.
- Capturing team syncs, client calls, planning sessions, reviews, incident discussions, demos, handoffs, or retrospectives.
- Recording an important async discussion from chat, email, issue comments, or PR comments.
- Preserving agreements, action items, open questions, and links from a concrete conversation.

Do not use this skill for:

- Architecture decisions and their rationale. Use `adr-documentation` and store them in `./docs/adr/`.
- Engineering gotchas, provider quirks, or implementation observations not tied to a specific conversation. Use `notes-documentation` and store them in `./docs/notes/`.
- Current maintained contracts, API descriptions, system diagrams, or onboarding docs. Store those in `./docs/refs/internal/` or `./docs/refs/external/`.
- Task-local implementation plans. Keep those in the planning artifact used by the active workflow, outside `docs/`.
- Secrets, credentials, private customer data, raw recordings, or sensitive transcripts.

## Documentation Index

- Read `./docs/index.md` before changing documentation. Paths beginning with `./docs/` are relative to the project root, not this skill directory.
- In the same change, ensure every created or modified document has a relative Markdown link in `./docs/index.md`; update its title or summary when needed. If the entry is already accurate, do not add a duplicate or make a cosmetic edit.
- When moving or renaming documents, update index entries and incoming links. When deleting a document, remove its entry and fix incoming links. Preserve historical records according to the rules below.
- Create `./docs/index.md` if missing. Keep it as the single project-wide documentation index, grouped by document type; validate links before finishing.

## Core Rules

- Store meeting records in `./docs/meets/`.
- Treat committed meeting records as point-in-time records. Do not rewrite old records to make them current.
- If the record needs correction, create a newer follow-up record or add a clearly dated correction only when the user explicitly asks.
- Record decisions as facts of the conversation. If a decision is architecturally significant, create or link an ADR and keep the decision rationale in the ADR.
- Capture action items with owners and due dates when known, but do not use `meets/` as a task tracker. Link to issues or PRs for ongoing status.
- Prefer concise summaries over verbatim transcripts. Quote only when exact wording matters.
- Separate facts, agreements, open questions, and interpretation.
- Redact secrets, credentials, personal data, customer data, and sensitive logs before writing.
- Use neutral, blameless wording for conflicts, incidents, or missed commitments.

## Filename Convention

Use chronological, kebab-case filenames:

```text
YYYY-MM-DD-short-topic.md
```

Examples:

```text
2026-06-16-sync.md
2026-06-20-client-scope.md
2026-06-22-async-api-contract.md
2026-06-25-incident-follow-up.md
```

Rules:

- Use the date of the meeting or async agreement, not the date when the note is later cleaned up.
- Keep the slug specific enough to find from search results.
- If multiple meetings share the same date and topic, add a qualifier: `2026-06-16-sync-frontend.md`.

## Record Types

Choose the closest type and reflect it in the frontmatter `type` field:

- `sync`: recurring team/project sync.
- `client-call`: client or stakeholder call.
- `planning`: scope, roadmap, estimation, or delivery planning.
- `review`: design, code, architecture, demo, or milestone review.
- `incident`: incident discussion, follow-up, or post-incident meeting.
- `retro`: retrospective or lessons-learned session.
- `handoff`: transfer of context or ownership.
- `async`: agreement captured from chat, email, issue, or PR discussion.

## Workflow

1. Inspect `./docs/index.md` and existing `./docs/meets/` files before writing.
2. Confirm the content is tied to a concrete meeting, call, or async thread.
3. Decide whether any part belongs elsewhere: ADR for decisions, notes for gotchas, refs for maintained contracts, issues for tracking.
4. Gather supported facts: date, participants, source, agenda, context, key points, agreements, action items, open questions, and links.
5. Write a concise summary first so readers can understand the outcome without reading the whole record.
6. Capture decisions and agreements with links to ADRs/issues/PRs where applicable.
7. Capture action items with owner and due date when known. If ownership or due date is unknown, mark `TBD` rather than inventing.
8. Redact sensitive content before writing. Do not include full raw transcripts or recordings.
9. Create a new file in `./docs/meets/` with the date-based filename.
10. Do not delete or rewrite older meeting records unless the user explicitly requests it.

## Template

Use this compact template by default. Match the repository language or the user's requested language. If unclear, use the language of `./docs/index.md`.

```markdown
---
date: YYYY-MM-DD
type: sync | client-call | planning | review | incident | retro | handoff | async
source: meeting | chat | email | issue | pr
participants: []
notetaker: TBD
tags: []
related:
  adr: []
  refs: []
  issues: []
  prs: []
---

# YYYY-MM-DD Short Meeting Title

## Summary

One short paragraph with the purpose and outcome of the conversation.

## Context

Why the conversation happened, what scope it covered, and what it explicitly did not cover.

## Participants

- Present: ...
- Needs update: ...

## Agenda

- Topic 1
- Topic 2

## Notes

### Topic 1

- Key fact, concern, constraint, or discussion point.

## Agreements

| Agreement | Owner | Link |
|---|---|---|
| ... | ... | ... |

## Decisions

| Decision fact | ADR / follow-up | Notes |
|---|---|---|
| ... | ... | Do not duplicate ADR rationale here. |

## Action Items

| Action | Owner | Due | Tracking |
|---|---|---|---|
| ... | ... | ... | issue/PR link |

## Open Questions

- Question, owner if known, expected place for resolution.

## Links

- Meeting invite, recording location, issue, PR, ADR, reference doc, external artifact.
```

Omit optional sections only when they add no value. Keep `Summary`, `Context`, `Participants`, `Agreements` or `Notes`, and `Action Items` for every meeting record. For `async` records, replace `Participants` with the people or handles involved in the thread.

## Boundaries With Other Docs

Use these tests before writing:

| Question | Destination |
|---|---|
| Did this happen in a specific meeting, call, or async thread? | `./docs/meets/` |
| Is this the decision itself and its rationale? | `./docs/adr/` via `adr-documentation` |
| Is this an implementation gotcha or lesson not tied to a specific conversation? | `./docs/notes/` via `notes-documentation` |
| Is this the current maintained contract of our system? | `./docs/refs/internal/` |
| Is this the current maintained contract of an external system? | `./docs/refs/external/` |
| Is this task-local planning or scratch work? | Task-planning artifacts outside `docs/` |

When a meeting produces an architectural decision, create or link an ADR. The meeting note should say that the decision was made and link to the ADR; the ADR owns the stable decision text, alternatives, rationale, and consequences.

When a meeting reveals a reusable gotcha, create or link a note in `./docs/notes/`. The meeting note owns who said it and when; the note owns the reusable lesson.

When a meeting updates a live contract, update `refs/` and link back to the meeting record. The meeting record stays historical; `refs/` stays current.

## Quality Checklist

Before writing or approving a meeting record, verify:

- The record is tied to a specific meeting, call, or async conversation.
- Date, source, participants, and notetaker are present or explicitly `TBD`.
- The summary states the purpose and outcome.
- Agenda or topic sections make the record skimmable.
- Agreements are separated from discussion notes.
- Action items have owner, due date, and tracking link when known.
- Architectural decisions link to ADRs or have a clear ADR follow-up.
- Maintained facts link to or update `refs/` rather than living only in the meeting record.
- Sensitive content is redacted.
- The wording is neutral and blameless.
- The filename is chronological and search-friendly.

## Response Pattern

When drafting before writing, respond with:

- Destination check: why this belongs in `docs/meets/` instead of `adr/`, `notes/`, `refs/`, or task-planning artifacts.
- Proposed file path.
- Draft meeting record content.
- Missing facts, unresolved ownership, or redaction concerns.
- A clear approval question before writing if the user asked for a draft rather than direct creation.

When reviewing meeting records, lead with findings and risks, then suggested edits. Treat misplaced records as a blocking issue: a correct record in the wrong folder makes the documentation system less trustworthy.
