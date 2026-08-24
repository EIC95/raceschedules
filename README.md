# RaceSchedules

RaceSchedules is a web application designed to help motorsports enthusiasts track the schedules of numerous racing categories, built with a FastAPI backend, a Next.js frontend, and a PostgreSQL database.

**This is a personal portfolio project, no longer maintained or open for contributions.** It's kept here as a showcase of the code and architecture.

## Project Structure

- `backend/`: FastAPI application, database models, API endpoints, and migration scripts.
- `frontend/`: Next.js application, including components, pages, and API integration.

## Features

- **Championship Management:** List all available racing championships.
- **Event Management:** Schedule and detail individual events within championships.
- **Session Management:** Define specific sessions (e.g., practice, qualifying, race) for each event with timezone handling.

## Running Locally

### Option 1: Docker (recommended)

#### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

#### Run

```bash
docker compose up --build
```

This will start:
- **PostgreSQL** on port `5432`
- **Backend API** on port `8000` — docs at `http://localhost:8000/docs`
- **Frontend** on port `3000` — app at `http://localhost:3000`

Database migrations are applied automatically on backend startup.

To seed initial data:

```bash
docker compose exec backend python scripts/seed.py
```

To stop:

```bash
docker compose down
```

To stop and remove the database volume:

```bash
docker compose down -v
```

### Option 2: Manual setup

#### Backend (from `backend/`)

```bash
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python -m alembic upgrade head           # Apply migrations
uvicorn main:app --reload                # Start dev server on :8000
python scripts/seed.py                  # Seed data (interactive)
```

#### Frontend (from `frontend/`)

```bash
npm install
npm run dev      # Start dev server on :3000
```

## Architecture

See [CLAUDE.md](CLAUDE.md) for a detailed overview of the data model, backend/frontend structure, and data seeding approach.
