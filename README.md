# test-ai

Next.js 15 application with React 19, TypeScript, Supabase authentication and TanStack Query.

## Описание

Приложение для обучения (testcraft) на Next.js Pages Router с аутентификацией через Supabase и API-роутами. Данные кэшируются через TanStack Query, стилизация на SCSS.

## Оглавление

- [Описание](#описание)
- [Инструкция по запуску](#инструкция-по-запуску)
- [Сборка и деплой](#сборка-и-депой)
- [Зависимости](#зависимости)
- [Структура проекта](#структура-проекта)
- [Тестирование и линтинг](#тестирование-и-линтинг)

---

## Инструкция по запуску

**Требуемые версии:**
- Node.js: 22+
- pnpm: 9+

**Установка:**

```bash
pnpm install
```

**Запуск в разработке:**

```bash
pnpm dev
```

**Запуск в production:**

```bash
pnpm build
pnpm start
```

**Переменные окружения:**

Скопируйте `.env.example` в `.env.local`:

```bash
cp .env.example .env.local
```

Пример `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Сборка и деплой

Docker-образ на базе `node:22-alpine` с multi-stage build:

```bash
docker build -t test-ai .
docker run -p 3000:3000 test-ai
```

---

## Зависимости

| Пакет | Назначение |
|---|---|
| `next@15.5` | Next.js Pages Router |
| `react@19.2` / `react-dom` | React 19 |
| `@supabase/supabase-js` / `@supabase/ssr` | Supabase аутентификация |
| `next-auth@5.0-beta` | Auth.js v5 |
| `@tanstack/react-query` / `react-query-devtools` | Управление данными и кэширование |
| `axios` | HTTP-клиент |
| `sass` | SCSS precompiler |

**Dev-зависимости:**

TypeScript, ESLint, Prettier, Husky + Commitlint, Stylistic ESLint plugin.

---

## Структура проекта

```
src/
├── api/              # API роуты (Next.js API routes)
├── pages-fsd/        # Pages с FSD-архитектурой
│   ├── auth/         # Страница авторизации
│   ├── app-layout/   # Базовый лейаут приложения
│   ├── main/         # Главная страница
│   └── testcraft/    # Модули приложения
│       └── components/
│           ├── header/
│           ├── sidebar/
│           ├── feedback/
│           └── screens/
│               ├── dashboard/
│               ├── tasks-list/
│               ├── theory/
│               ├── history/
│               ├── workspace/
│               ├── profile/
│               └── settings/
├── pages/            # Остальные страницы (_app, _document, auth, dashboard и др.)
└── shared/           # Общие модули
    ├── api/          # Запросы и query-хуки
    ├── lib/          # Утилиты (supabase, helpers, config)
    ├── styles/       # SCSS (tokens, mixins, globals)
    └── ui/           # Компоненты (atoms, molecules)
```

---

## Тестирование и линтинг

```bash
pnpm lint            # ESLint
pnpm lint:fix        # ESLint с автофиксом
```

Git-хуки (Husky + Commitlint) проверяют формат коммитов при push.
