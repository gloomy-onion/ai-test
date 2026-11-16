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

<!-- corp-ai-tools:figma:start -->
## Figma: реализация и визуальная проверка

- [implement-design](.opencode/skills/implement-design/SKILL.md): реализация UI по конкретному Figma frame, с переиспользованием компонентов и токенов проекта.
- [validate-design](.opencode/skills/validate-design/SKILL.md): read-only сравнение работающего UI с Figma, отчёт Expected/Actual/Fix. Не редактировать реализацию в рамках проверки.

Пакет не подключает Figma MCP или браузер. Используй уже разрешённые инструменты; если дизайн, preview или нужная capability недоступны, сообщи о блокере, не выдумывай результат. Не делегируй задачу автоматически и не меняй разрешения агента.

При создании или изменении документации поддерживай её относительную ссылку в [docs/index.md](docs/index.md). Не создавай отчёты в репозитории, если задача требует только ответа в чате.
<!-- corp-ai-tools:figma:end -->

<!-- corp-ai-tools:ticket-to-release:start -->
## Ticket to release: от задачи Jira до готового к ревью изменения

Запуск: `ticket-to-release` с ключом задачи, например `/ticket-to-release FI-2312`. Флаги: `--auto` — без остановки на вопросах, решения фиксируются как допущения; `--approve-plan` — с подтверждением плана; `--no-worktree` — работать в текущей копии; `--base <ветка>` — базовая ветка.

По умолчанию работа идёт в git worktree `.worktrees/<ключ>/` внутри репозитория; рабочая копия разработчика не меняется. Пока worktree существует, инструменты, запущенные из основной копии (тест-раннеры, линтеры, `tsc`, IDE), могут видеть его файлы — удаляй worktree после merge или отказа от изменения.

- [ticket-to-release](.opencode/skills/ticket-to-release/SKILL.md): оркестратор стадий, контрольные точки, финальная проверка и отчёт.
- [requirements-clarify](.opencode/skills/requirements-clarify/SKILL.md): документация, Confluence и код → вопросы → требования R1..Rn и вердикт.
- [implementation-plan](.opencode/skills/implementation-plan/SKILL.md): план с доказательствами по файлам и ревью плана.
- [test-first](.opencode/skills/test-first/SKILL.md): падающие тесты до реализации.
- [plan-implement](.opencode/skills/plan-implement/SKILL.md): реализация до зелёных тестов и проверки проекта.
- [change-review](.opencode/skills/change-review/SKILL.md): read-only ревью; в Claude Code — отдельным субагентом.
- [code-simplify](.opencode/skills/code-simplify/SKILL.md): упрощение без изменения поведения.

Доступ к задачам Jira и документации Confluence — только через Atlassian MCP; если он недоступен, сообщи о блокере. Результаты стадий хранятся в `.ticket-to-release/<ключ>/` — рабочие материалы, не часть изменения. Без явной просьбы разработчика не делай push, merge request, merge и записи в Jira.

При создании или изменении документации поддерживай её относительную ссылку в [docs/index.md](docs/index.md).
<!-- corp-ai-tools:ticket-to-release:end -->
