---
name: adr-documentation
description: Create, review, and maintain Architecture Decision Records (ADRs) in ./docs/adr/. Use when the user asks for an ADR, architecture decision record, decision log, documenting an architectural choice, superseding an ADR, or reviewing ADR documentation.
---

# ADR Documentation

Use this skill to write and maintain Architecture Decision Records. The goal of an ADR is to preserve the context, constraints, alternatives, and consequences behind a significant architecture decision before that context disappears from the team memory.

## When to Use

Use this skill when the task is about:
- Creating a new ADR.
- Reviewing or improving an ADR draft.
- Documenting a significant architecture decision.
- Superseding or linking existing ADRs.
- Maintaining the ADR decision log in `./docs/adr/`.

An ADR is appropriate when the decision is expensive to misunderstand later or hard to reverse. Typical cases include storage choices, service communication, layer contracts, caching strategy, event formats, identifiers, consistency policy, queues, domain boundaries, routing rules, inter-process protocols, security posture, migration strategy, and operational tradeoffs.

Do not use ADRs for every small implementation detail. If the decision is cheap to reverse, recommend a PR comment, issue note, or regular documentation instead.

## Documentation Index

- Read `./docs/index.md` before changing documentation. Paths beginning with `./docs/` are relative to the project root, not this skill directory.
- In the same change, ensure every created or modified document has a relative Markdown link in `./docs/index.md`; update its title or summary when needed. If the entry is already accurate, do not add a duplicate or make a cosmetic edit.
- When moving or renaming documents, update index entries and incoming links. When deleting a document, remove its entry and fix incoming links. Preserve historical records according to the rules below.
- Create `./docs/index.md` if missing. Keep it as the single project-wide documentation index, grouped by document type; validate links before finishing.

## Core Rules

- Store ADR files in `./docs/adr/`.
- Use filenames in the form `NNN-kebab-title.md`, for example `001-use-postgres-for-primary-storage.md`.
- Treat the stable reference as `ADR-NNN` in titles, links, and indexes.
- Number ADRs monotonically by scanning existing ADR files and using the next highest number. Do not reuse gaps.
- Keep one ADR focused on one decision.
- Keep ADRs short enough to read quickly, but complete enough to preserve context.
- Do not invent facts, stakeholders, metrics, dates, constraints, or alternatives. Ask or mark them as `TBD` in a draft.
- Draft first and ask for explicit approval before writing or finalizing an ADR.
- Accepted ADRs are immutable in substance. If the decision changes, create a new ADR and mark the old ADR as superseded.
- It is acceptable to update only status, supersession links, and the ADR index when superseding an accepted ADR.

## Statuses

Use this status vocabulary unless the repository already has a different ADR convention:
- `Proposed`: under discussion, not yet accepted.
- `Accepted`: agreed and currently active.
- `Rejected`: considered but not chosen.
- `Superseded`: replaced by a newer ADR.

Recognize `Historic` and `Obsolete` in existing documents, but prefer `Superseded` for new ADRs because it points to replacement history more clearly.

## Workflow

1. Inspect `./docs/adr/` if it exists. Learn the existing filename pattern, headings, statuses, language, and index format.
2. Inspect relevant code, docs, issues, or prior ADRs before drafting. Build context from the repository instead of assuming it.
3. Challenge whether an ADR is needed. If the decision is reversible or low impact, say so and propose a lighter record.
4. Identify the decision boundary. The ADR should answer one question, not bundle unrelated choices.
5. Gather or infer only supported facts: context, constraints, decision drivers, considered alternatives, consequences, scope boundaries, success metrics, revisit triggers, stakeholders, and links.
6. Produce a draft in the chat first. Include open questions and controversial tradeoffs.
7. Ask for explicit approval before writing the ADR file or setting status to `Accepted`.
8. After approval, create or update files with the smallest correct change: the ADR file and its entry in `./docs/index.md`. If a legacy ADR-specific index exists, keep it consistent without creating another index.
9. When superseding an ADR, create a new ADR, link both directions, update the old ADR status to `Superseded`, and update the index.
10. Validate that there are no unresolved placeholders unless the status remains `Proposed` and the placeholders are intentionally listed as open questions.

## ADR Template

Use this compact hybrid template by default. Match the repository language or the user's requested language. If unclear, ask.

```markdown
---
status: Proposed
date: YYYY-MM-DD
author: TBD
decision-makers: []
consulted: []
informed: []
supersedes: []
superseded-by: []
tags: []
---

# ADR-NNN: Short Decision Title

## Context

What situation, constraints, forces, and business or technical facts made this decision necessary?

## Decision

We will ...

## Alternatives

| Option | Pros | Cons | Why not chosen |
|--------|------|------|----------------|
| Option A | ... | ... | ... |
| Option B | ... | ... | ... |

## Consequences

- Positive: ...
- Negative: ...
- Tradeoffs and follow-up work: ...

## Scope

- Applies when: ...
- Does not apply when: ...

## Success Metrics

- ...

## Revisit Triggers

- Revisit if ...

## Links

- RFCs, issues, PRs, diagrams, benchmarks, incidents, or related ADRs.
```

Omit empty optional metadata only after confirming the repository style allows it. Keep `status`, `date`, and title for every ADR.

## ADR Index

Maintain the ADR section of `./docs/index.md` as a lightweight decision log when writing ADRs. Do not create a separate ADR index in a new project.

Use this table shape unless the repository already has one:

```markdown
# Architecture Decision Records

| ADR | Status | Date | Title | Supersedes | Summary |
|-----|--------|------|-------|------------|---------|
| [ADR-001](adr/001-example.md) | Accepted | 2026-05-05 | Example | - | One sentence summary. |
```

Keep the index sorted by ADR number. Update status and supersession links when an ADR is superseded.

## Review Checklist

Before presenting or writing an ADR, verify:
- The ADR captures one significant decision.
- Context explains why the decision is needed now.
- Constraints include time, load, team, data model, compatibility, operational cost, product maturity, security, and acceptable error cost when relevant.
- Alternatives are real options, not strawmen.
- Consequences include negative outcomes and tradeoffs.
- Scope boundaries say where the decision stops being valid.
- Success metrics and revisit triggers are measurable when possible.
- Related RFCs, issues, PRs, diagrams, benchmarks, incidents, and ADRs are linked.
- Status is correct and not prematurely `Accepted`.
- The document is useful to both humans and AI: stable headings, explicit links, and machine-readable metadata.

## Response Pattern

When drafting before approval, respond with:
- ADR necessity check.
- Proposed ADR title and file path.
- Draft ADR content.
- Open questions or disputed tradeoffs.
- A clear approval question before writing files.

When reviewing an ADR, lead with findings and risks, then provide suggested edits.
