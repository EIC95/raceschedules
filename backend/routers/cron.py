from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models
from app.database import get_db

router = APIRouter()

@router.get("/cron/wakeup", methods=["GET", "HEAD"])
def wakeup(db: Session = Depends(get_db)):
    """
    This endpoint is used to keep the backend awake on free hosting services.
    It performs a simple database query to prevent the service from sleeping.
    """
    db.query(models.Championship).first()
    return {"message": "Backend is awake"}
