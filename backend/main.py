from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import categories, championships, events, sessions, cron

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://raceschedules.vercel.app", "https://raceschedules.ibrahima.dev"],
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