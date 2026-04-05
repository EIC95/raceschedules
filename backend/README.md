# RaceSchedules Backend API

This directory contains the backend API for the Race Schedules project, built using FastAPI. It provides endpoints for managing championships, events, and sessions, with data stored in a PostgreSQL database.

## Technologies Used

- **FastAPI:** Web framework for building APIs with Python.
- **SQLAlchemy:** ORM for interacting with the PostgreSQL database.
- **Alembic:** Database migration tool.
- **Pydantic:** Data validation and settings management.
- **pip:** Dependency management.

## Getting Started

### Prerequisites

- Python 3.10+
- PostgreSQL database instance

### Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: .\venv\Scripts\activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up environment variables:**
    Create a `.env` file in this directory based on `.env.example`.
    ```
    DATABASE_URL="postgresql://user:password@host:port/database_name"
    # Example: DATABASE_URL="postgresql://raceschedules:raceschedules@localhost:5432/raceschedules_db"
    ```

5.  **Run database migrations:**
    ```bash
    python -m alembic upgrade head
    ```

6.  **Seed initial data (optional):**
    ```bash
    python scripts/seed.py
    ```

### Running the API

To start the FastAPI development server:

```bash
uvicorn main:app --reload
```

The API documentation (Swagger UI) will be available at `http://127.0.0.1:8000/docs`.

## API Endpoints

Refer to the Swagger UI (`/docs`) for a comprehensive list of available endpoints and their usage.

## Database Migrations

- To create a new migration:
    ```bash
    python -m alembic revision --autogenerate -m "Your migration message"
    ```
- To apply migrations:
    ```bash
    python -m alembic upgrade head
    ```
- To revert migrations:
    ```bash
    python -m alembic downgrade -1
    ```
