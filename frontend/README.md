# RaceSchedules Frontend

This directory contains the frontend web application for the RaceSchedules project, built using React and Vite. It provides a user interface to view and interact with the data served by the backend API.

## Technologies Used

- **React:** A JavaScript library for building user interfaces.
- **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
- **Vite:** A fast build tool for modern web projects.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **react-router-dom:** For declarative routing in React.
- **axios:** Promise based HTTP client for the browser and node.js.

## Getting Started

### Prerequisites

- Node.js (18+)
- npm or yarn

### Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```

3.  **Configure API URL:**
    Create a `.env` file in this directory if you need to override the default API URL.
    By default, it assumes the backend is running on `http://localhost:8000`.
    ```
    VITE_API_BASE_URL=http://localhost:8000
    ```

### Running the Development Server

To start the development server:

```bash
npm run dev
# or yarn dev
```

The application will typically be available at `http://localhost:5173`.

## Building for Production

To build the application for production:

```bash
npm run build
# or yarn build
```

This will create a `dist` directory with the optimized production build.

## Linting

To run ESLint for code quality checks:

```bash
npm run lint
```
