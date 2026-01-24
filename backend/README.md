# Motorsport Race Schedules API

This is a minimalist FastAPI backend for managing motorsport race schedules, including categories, championships, events, and sessions.

## Features

*   **Models:**
    *   `Category`: Represents a type of motorsport (e.g., Formula 1, WEC).
    *   `Championship`: A series within a category (e.g., F1 World Championship).
    *   `Event`: A specific race weekend or event (e.g., Monaco Grand Prix).
    *   `Session`: Individual sessions within an event (e.g., Free Practice, Qualifying, Race).
*   **GET Endpoints:**
    *   `/categories`: List all motorsport categories.
    *   `/championships`: List all championships.
    *   `/championships/{slug}`: Get details of a specific championship, including its events.
    *   `/events/upcoming`: Get events scheduled for the next week.
    *   `/events/{slug}`: Get details of a specific event, including its sessions.
    *   `/sessions/next`: Get the next upcoming session across all events.
*   **Database Management:**
    *   PostgreSQL database.
    *   Alembic for database migrations.
*   **Dependency Management:** `pipenv`.

## Technical Stack

*   **Web Framework:** FastAPI
*   **ORM:** SQLAlchemy
*   **Database:** PostgreSQL
*   **Data Validation:** Pydantic
*   **Migrations:** Alembic
*   **Dependency Management:** pipenv
*   **Environment Variables:** `python-dotenv`

## Setup and Installation

### Prerequisites

*   Python 3.8+
*   PostgreSQL server running and accessible.

### Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/motorsport-schedules-api.git
    cd motorsport-schedules-api
    ```
    (Replace `https://github.com/your-repo/motorsport-schedules-api.git` with the actual repository URL)

2.  **Install `pipenv`** (if you don't have it):
    ```bash
    pip install pipenv
    ```

3.  **Install project dependencies:**
    ```bash
    pipenv install
    ```
    This will create a virtual environment and install all necessary packages.

4.  **Database Setup:**
    *   **Create a PostgreSQL database** (e.g., `raceschedules`).
        ```sql
        CREATE DATABASE raceschedules;
        ```
    *   **Create a `.env` file** in the project root based on `.env.example`.
        ```bash
        cp .env.example .env
        ```
    *   **Edit `.env`** and set your `DATABASE_URL` with your PostgreSQL credentials:
        ```
        DATABASE_URL="postgresql://user:password@localhost/raceschedules?client_encoding=utf8"
        ```
        _Make sure `user`, `password`, and `localhost` (or your database host) are correct._

5.  **Run database migrations:**
    Activate the pipenv shell and run Alembic migrations to create the tables.
    ```bash
    pipenv shell
    alembic upgrade head
    exit
    ```
    (You can also run `pipenv run alembic upgrade head` without activating the shell)

6.  **Seed the database** with initial data:
    ```bash
    pipenv run python seed.py
    ```

## Running the Application

To start the FastAPI server:

```bash
pipenv run uvicorn main:app --reload
```

The application will be accessible at `http://127.0.0.1:8000`.

### API Documentation

Once the server is running, you can access the interactive API documentation (Swagger UI) at:
[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

And the alternative ReDoc documentation at:
[http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

Enjoy exploring the Motorsport Race Schedules API!