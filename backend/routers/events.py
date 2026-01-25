from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app import models, schemas
from app.database import get_db
from datetime import datetime, timedelta, timezone

router = APIRouter()

@router.get("/events/upcoming", response_model=List[schemas.EventRead])
def read_upcoming_events(db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    one_week_from_now = now + timedelta(weeks=1)
    return db.query(models.Event).options(joinedload(models.Event.championship)).filter(models.Event.start_date.between(now, one_week_from_now)).order_by(models.Event.start_date).all()

@router.get("/events/{slug}", response_model=schemas.EventDetail)
def read_event_details(slug: str, db: Session = Depends(get_db)):
    db_event = db.query(models.Event).options(joinedload(models.Event.sessions)).filter(models.Event.slug == slug).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event