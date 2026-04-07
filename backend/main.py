import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import categories, championships, events, sessions, cron
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Configure CORS
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categories.router)
app.include_router(championships.router)
app.include_router(events.router)
app.include_router(sessions.router)
app.include_router(cron.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the RaceSchedules API"}