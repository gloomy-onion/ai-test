---
name: refs-documentation
description: Create, review, and maintain live reference documentation in ./docs/refs/internal/ and ./docs/refs/external/. Use when the user asks for refs, reference docs, current system docs, internal architecture reference, API contract docs, provider docs, integration reference, dependency contract, or docs/refs/*. Do NOT use for ADRs, meeting records, append-only notes, or task plans.
---

# Refs Documentation

Use this skill to write and maintain `./docs/refs/*`: the live reference layer for facts that must stay current.

`refs/` is not a historical log. If the system, API, provider, dependency, contract, or operational procedure changes, update the existing reference document instead of creating a dated replacement.

## When to Use

Use this skill when the task is about:

- Creating or updating a document in `./docs/refs/internal/` or `./docs/refs/external/`.
- Describing the current structure of our system, modules, services, data flows, runtime behavior, or operational interfaces.
- Documenting an external API, provider, dependency, SDK, webhook contract, integration protocol, quota, environment, or authentication scheme.
- Turning scattered current facts from code, config, tests, tickets, vendor docs, or meetings into a maintained reference page.
- Reviewing whether a reference document is accurate, complete, and still current.

Do not use this skill for:

- Architecture decisions and their rationale. Use `adr-documentation` and store them in `./docs/adr/`.
- Meeting or chat records. Use `meets-documentation` and store them in `./docs/meets/`.
- Gotchas, observed deviations, debugging findings, or lessons learned. Use `notes-documentation` and store them in `./docs/notes/`.
- Task-local implementation plans. Keep those in the planning artifact used by the active workflow, outside `docs/`.
- Legal documents, secrets, credentials, private customer data, or raw sensitive logs.

## Directory Boundary

Use `internal/` for facts about systems we own:

```text
docs/refs/internal/
```

Examples:

- Module boundaries and public interfaces.
- Service ownership and runtime topology.
- Event schemas and data flow maps.
- Build, deployment, feature flag, observability, and operational contracts.
- Current domain model or persistence shape.

Use `external/` for facts about systems we do not own:

```text
docs/refs/external/
```

Examples:

- Vendor API contracts and SDK usage.
- Third-party authentication, webhooks, retries, errors, quotas, and rate limits.
- Provider environments, test credentials shape, sandbox limitations, and versioning policy.
- Dependency behavior that is part of the documented contract.

When a document mixes our behavior and an external contract, split it or keep the canonical contract in `external/` and link from `internal/` to how our system uses it.

## Documentation Index

- Read `./docs/index.md` before changing documentation. Paths beginning with `./docs/` are relative to the project root, not this skill directory.
- In the same change, ensure every created or modified document has a relative Markdown link in `./docs/index.md`; update its title or summary when needed. If the entry is already accurate, do not add a duplicate or make a cosmetic edit.
- When moving or renaming documents, update index entries and incoming links. When deleting a document, remove its entry and fix incoming links. Preserve historical records according to the rules below.
- Create `./docs/index.md` if missing. Keep it as the single project-wide documentation index, grouped by document type; validate links before finishing.

## Core Rules

- Store maintained reference docs under `./docs/refs/internal/` or `./docs/refs/external/`.
- Reference docs are live. Update them when reality changes.
- Use stable filenames without date prefixes. Dates belong to `meets/` and `notes/`, not live reference.
- Structure docs around the system or contract they describe, not around the story of how the knowledge was discovered.
- Describe facts neutrally. Do not use reference docs to argue, speculate, or preserve decision rationale.
- Include enough source links that a future reader can verify the claim.
- Prefer tables, field lists, endpoint lists, state diagrams, and concise examples over prose-heavy explanations.
- Keep how-to steps short and limited to correct usage of the contract. Long task flows belong elsewhere and should be linked.
- Do not duplicate ADR bodies, meeting minutes, or notes. Link to them.
- Redact secrets and sensitive data. Document variable names, header names, payload shapes, and secret storage locations, not secret values.

## Filename Convention

Use stable, kebab-case filenames that mirror the system or contract:

```text
docs/refs/internal/<subsystem>.md
docs/refs/internal/<subsystem>/<contract>.md
docs/refs/external/<provider>.md
docs/refs/external/<provider>/<contract>.md
```

Examples:

```text
docs/refs/internal/auth.md
docs/refs/internal/publication/events.md
docs/refs/internal/frontend-routing.md
docs/refs/external/stripe.md
docs/refs/external/unleash/feature-flags.md
docs/refs/external/yandex-cloud/object-storage.md
```

Rules:

- Do not prefix reference filenames with dates.
- Prefer one page per contract, subsystem, provider, or integration surface.
- If a page becomes too large to scan, split by the structure of the system: endpoint group, domain area, event family, module, or provider feature.
- If a file represents a specific external API version, include the version in metadata or title, not necessarily the filename, unless multiple versions are maintained side by side.

## Internal Reference Template

Use this template for `./docs/refs/internal/`.

```markdown
---
owner: TBD
status: current | draft | stale
last-reviewed: YYYY-MM-DD
source-of-truth:
  code: []
  config: []
  tests: []
related:
  adr: []
  notes: []
  meets: []
  issues: []
  prs: []
tags: []
---

# Subsystem Or Contract Name

## Summary

What this subsystem or contract is, what it owns, and why a maintainer consults this page.

## Scope

- Covers: ...
- Does not cover: ...

## Ownership

- Owner/team: ...
- Primary code paths: ...
- Runtime/config owners: ...

## Public Interface

Describe stable module exports, API routes, events, commands, data contracts, environment variables, feature flags, or integration points.

## Data And State

Document important entities, fields, invariants, state transitions, persistence, caching, and retention.

## Runtime Behavior

Describe lifecycle, dependencies, background jobs, error handling, retries, idempotency, observability, and operational constraints.

## Configuration

| Name | Required | Default | Scope | Description |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

## Limits And Guarantees

- Supported: ...
- Not guaranteed: ...
- Known constraints: ...

## Examples

Minimal examples that illustrate the described contract. Avoid long tutorials.

## Links

- Code, tests, ADRs, notes, meeting records, dashboards, runbooks, issues, PRs.
```

## External Reference Template

Use this template for `./docs/refs/external/`.

```markdown
---
external-system: External System Name
status: current | draft | stale
last-reviewed: YYYY-MM-DD
contract-version: TBD
official-docs: []
related:
  adr: []
  notes: []
  meets: []
  issues: []
  prs: []
tags: []
---

# External System Or Contract Name

## Summary

What the external system provides and where our project depends on it.

## Scope

- Covers: ...
- Does not cover: ...

## Official Contract

- Official docs: ...
- API/version: ...
- Environments: production, sandbox, staging, etc.
- Support/contact path: ...

## Authentication And Security

Document auth scheme, token shape, signing headers, IP allowlists, permissions, and secret storage locations. Do not store secrets.

## Endpoints, Events, Or SDK Surface

| Operation | Method/Event | Path/Name | Request | Response | Notes |
|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ... |

## Data Model

Document important fields, enum values, identifiers, timestamps, currencies, encoding, nullability, and compatibility rules.

## Errors, Retries, And Idempotency

Document status codes, error shapes, retry policy, duplicate delivery, ordering, timeout behavior, and idempotency keys.

## Limits And Quotas

Document rate limits, size limits, pagination, batching, retention, regional constraints, and SLA/SLO facts.

## Webhooks Or Callbacks

Document signature verification, replay protection, event order, retry schedule, payload shape, and acknowledgment rules.

## Known Deviations

Link to `docs/notes/` for observed deviations or gotchas. Keep this section short; do not turn `external/` into a war story.

## Links

- Official docs, changelog, support tickets, SDK source, notes, ADRs, meeting records, issues, PRs.
```

## Workflow

1. Inspect `./docs/index.md`, existing `./docs/refs/`, and neighboring ADRs/notes/meets before writing.
2. Decide destination: `refs/internal/` for owned systems, `refs/external/` for third-party systems.
3. Find the source of truth: code, tests, config, OpenAPI/schema files, official vendor docs, SDK source, support tickets, or runtime evidence.
4. If you cannot verify a claim, mark it `TBD`, `unknown`, or omit it. Do not invent contract details.
5. Prefer updating an existing reference page over creating a duplicate.
6. If the document captures why a choice was made, move that rationale to an ADR and link it.
7. If the document captures when something was discussed, move that event record to `meets/` and link it.
8. If the document captures a painful discovery, deviation, or gotcha, move that observation to `notes/` and link it.
9. Write or update the reference document with the smallest correct change.
10. Update `last-reviewed` when you actually verify the content, not when you only touch formatting.

## Boundaries With Other Docs

Use these tests before writing:

| Question | Destination |
|---|---|
| Is this a current fact about our system? | `./docs/refs/internal/` |
| Is this a current fact about a third-party system? | `./docs/refs/external/` |
| Is this a significant choice and rationale? | `./docs/adr/` via `adr-documentation` |
| Did this happen in a specific meeting, call, or async thread? | `./docs/meets/` via `meets-documentation` |
| Is this a gotcha, observed deviation, or lesson learned? | `./docs/notes/` via `notes-documentation` |
| Is this task-local planning or scratch work? | Task-planning artifacts outside `docs/` |

## Quality Checklist

Before writing or approving a reference document, verify:

- The document is live reference, not a historical record.
- The destination is correct: `internal/` for owned systems, `external/` for third-party systems.
- Scope and non-scope are explicit.
- Facts are current and tied to source-of-truth links.
- Structure mirrors the system, API, provider, or contract being described.
- The page uses stable headings, tables, and lists so readers can scan it quickly.
- Examples are minimal and illustrate the contract without becoming tutorials.
- Decision rationale links to ADRs instead of living in reference docs.
- Meeting facts link to `meets/`; gotchas and deviations link to `notes/`.
- Secrets, credentials, customer data, and sensitive logs are redacted.
- `status` and `last-reviewed` are truthful.

## Response Pattern

When drafting before writing, respond with:

- Destination check: why this belongs in `docs/refs/internal/` or `docs/refs/external/` instead of `adr/`, `meets/`, `notes/`, or task-planning artifacts.
- Proposed file path.
- Source-of-truth links or files inspected.
- Draft reference content.
- Unknowns, stale areas, or redaction concerns.
- A clear approval question before writing if the user asked for a draft rather than direct creation.

When reviewing reference docs, lead with findings and risks, then suggested edits. Treat stale or unverifiable reference content as a real defect because `refs/` is trusted as current.
