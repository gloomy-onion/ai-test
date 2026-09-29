<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- corp-ai-tools:base:start -->
## Base: документация

Перед изменением документации прочитай [docs/index.md](docs/index.md), [правила структуры docs](docs/README.md) и соответствующий скилл:

- [adr-documentation](.opencode/skills/adr-documentation/SKILL.md) — архитектурные решения в `docs/adr/`.
- [meets-documentation](.opencode/skills/meets-documentation/SKILL.md) — встречи и договорённости в `docs/meets/`.
- [notes-documentation](.opencode/skills/notes-documentation/SKILL.md) — инженерные наблюдения в `docs/notes/`.
- [refs-documentation](.opencode/skills/refs-documentation/SKILL.md) — актуальные справочники в `docs/refs/internal/` и `docs/refs/external/`.

При создании или изменении документа проверь его относительную Markdown-ссылку в `docs/index.md` в той же задаче. Добавь отсутствующую запись, обнови изменившиеся название и описание; не дублируй корректную запись. При переносе/переименовании исправь индекс и входящие ссылки, при удалении убери запись и исправь ссылки. Индекс — единый, без отдельных индексов категорий.

Не выдумывай факты. Соблюдай правила исторических записей и принятых ADR. Каталоги `docs/adr/`, `docs/meets/`, `docs/notes/`, `docs/refs/`, `docs/refs/internal/` и `docs/refs/external/` поставляются с `.gitkeep`; не удаляй placeholders, принадлежащие набору. Перед завершением проверь существование целей ссылок.
<!-- corp-ai-tools:base:end -->
