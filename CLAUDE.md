# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RaceSchedules is a motorsports schedule tracker. It has a FastAPI backend, a Next.js frontend, and a PostgreSQL database. The full stack runs via Docker Compose.

## Commands

### Docker (recommended)

```bash
docker compose up --build        # Start all services
docker compose down              # Stop all services
docker compose down -v           # Stop and remove DB volume
docker compose exec backend python scripts/seed.py   # Seed data interactively
```

### Backend (manual, from `backend/`)

```bash
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python -m alembic upgrade head           # Apply migrations
uvicorn main:app --reload                # Start dev server on :8000
python scripts/seed.py                  # Seed data (interactive)
```

### Frontend (manual, from `frontend/`)

```bash
npm install
npm run dev      # Start dev server on :3000
npm run build
npm run lint
```

### Alembic migrations (from `backend/`)

```bash
python -m alembic revision --autogenerate -m "description"
python -m alembic upgrade head
python -m alembic downgrade -1
```

## Architecture

### Data model

```
Category → Championship → Event → Session
```

- All four models live in `backend/app/models.py`
- Relationships use SQLAlchemy ORM with `joinedload` in routers
- All datetimes are stored as UTC in the database; `Session.timezone` stores the original IANA timezone string

### Backend (`backend/`)

- `main.py` — FastAPI app entry point; registers all routers and CORS config
- `app/models.py` — SQLAlchemy models
- `app/schemas.py` — Pydantic schemas (Read/Detail variants per resource)
- `app/database.py` — engine + `get_db` dependency; reads `DATABASE_URL` from `.env`
- `routers/` — one file per resource (`categories`, `championships`, `events`, `sessions`, `cron`)
- `alembic/` — migration scripts; `env.py` reads `DATABASE_URL` from `.env`

All routes are slug-based (no integer IDs exposed in URLs).

`/cron/wakeup` (GET/HEAD) exists solely to keep the service alive on free hosting providers by performing a cheap DB query.

### Frontend (`frontend/src/`)

- `app/` — Next.js App Router pages
  - `page.tsx` — home page (upcoming events + next session)
  - `championships/[slug]/` — championship detail page with event list
- `components/` — UI components; `TimezoneToggle.tsx` lets users switch between local and UTC display
- `context/TimezoneContext.tsx` — React context that stores the user's timezone preference (local vs UTC); consumed throughout session time display components
- `api/` — one file per resource, wraps `api.ts` (axios instance); `NEXT_PUBLIC_API_URL` sets the base URL

### Data seeding (`backend/data/`)

Race data lives as JSON files, not in migrations:

- `data/categories.json` — list of categories
- `data/championships.json` — list of championships with category slugs
- `data/championships/<slug>.json` — events + sessions per championship

`scripts/seed.py` validates and upserts this data. It is interactive: it prompts per championship file. `scripts/validate_data.py` contains Pydantic-based validators used by the seed script.

When adding a new championship, add its JSON file to `data/championships/` and register it in `data/championships.json`.

### Environment variables

| Variable | Where | Description |
|---|---|---|
| `DATABASE_URL` | `backend/.env` | PostgreSQL connection string |
| `NEXT_PUBLIC_API_URL` | `frontend/.env` | Backend base URL (client-side) |

Docker Compose injects `DATABASE_URL` automatically; `NEXT_PUBLIC_API_URL` defaults to `http://localhost:8000`.
