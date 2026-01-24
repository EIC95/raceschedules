from fastapi import FastAPI
from routers import categories, championships, events, sessions

app = FastAPI()

app.include_router(categories.router)
app.include_router(championships.router)
app.include_router(events.router)
app.include_router(sessions.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Motorsport Schedules API"}