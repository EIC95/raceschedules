# RaceSchedules

This project is a web application designed to help motorsports enthusiasts track the schedules of numerous racing categories. Faced with the difficulty of staying informed and the risk of missing important events, RaceSchedules aims to simplify this task.

This project is designed to be **open source and completely free**, developed by and for the motorsports community. We invite you to keep it alive and contribute to its improvement.

## Project Structure

- `backend/`: Contains the FastAPI application, database models, API endpoints, and migration scripts.
- `frontend/`: Contains the Next.js application, including components, pages, and API integration.

## Features

- **Championship Management:** List all available racing championships.
- **Event Management:** Schedule and detail individual events within championships.
- **Session Management:** Define specific sessions (e.g., practice, qualifying, race) for each event with timezone handling.

## Getting Started

### Option 1: Docker (recommended)

The easiest way to run the full stack locally is with Docker Compose.

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

---

### Option 2: Manual setup

Follow the instructions in the `backend/README.md` and `frontend/README.md` files to set up and run each part of the application.

## Development

### Prerequisites
- Docker and Docker Compose (for Docker setup)
- Python 3.10+ and Node.js 18+ (for manual setup)

### Setup

1.  **Backend Setup:** Refer to `backend/README.md`
2.  **Frontend Setup:** Refer to `frontend/README.md`

## Contributions

### General Contributions

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

### Data Contributions (Championships and Schedules)

The world of motorsports is vast and covers many categories. It's challenging to keep all championship and schedule data up to date. That's why we rely on the community!

If you wish to contribute data for an existing championship or add a new one, please refer to the [DATA_CONTRIBUTING.md](DATA_CONTRIBUTING.md) file. You will find a detailed guide on how to contribute, a list of currently covered championships, and those we would like to see added. Your help is invaluable in enriching the database and making RaceSchedules more comprehensive!

Please see [roadmap.md](roadmap.md) for planned features and project vision.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## Disclaimer

**RaceSchedules** is a community-driven, open-source project created for informational purposes.

*   **Data Sources**: All race schedules, dates, and related factual information are compiled from publicly available sources, including official championship websites and public calendars. We strive for accuracy but make no guarantees regarding the completeness or timeliness of the data.
*   **Intellectual Property**: All trademarks and brand names (e.g., Formula 1, NASCAR, FIA) are the property of their respective owners. This project is not endorsed by, affiliated with, or sponsored by any of these entities. The use of such marks is for informational identification purposes only.
*   **No Commercial Use**: This project and its data are provided free of charge for personal, non-commercial use by the motorsport community.
*   **Limitation of Liability**: The maintainers and contributors of this project are not liable for any errors, omissions, or any losses, injuries, or damages arising from the use of this information. Always verify critical details with official sources.

*For any copyright or trademark concerns, please open an issue in the repository to discuss.*

## Support Me
If you like this project and want to support it, you can **donate** via Ko-fi:

<p>
  <a href="https://ko-fi.com/X8X511TO4J" target="_blank">
    <img src="https://storage.ko-fi.com/cdn/kofi3.png?v=6" alt="Donate" height="36"/>
  </a>
</p>

---
Built with ❤️ by [Ibrahima Cissé](https://github.com/EIC95)
