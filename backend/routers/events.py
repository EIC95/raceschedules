from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app import models, schemas
from app.database import get_db
from datetime import datetime, timedelta, timezone
from sqlalchemy import distinct

router = APIRouter()

@router.get("/events/upcoming", response_model=List[schemas.EventRead])
def read_upcoming_events(db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    one_week_from_now = (now + timedelta(weeks=1)).replace(hour=23, minute=59, second=59, microsecond=999999)

    upcoming_events = db.query(models.Event) \
        .options(joinedload(models.Event.championship)) \
        .filter(
            models.Event.start_date <= one_week_from_now,  # commence avant la fin de la semaine
            models.Event.end_date >= today_start           # pas encore terminé
        ) \
        .order_by(models.Event.start_date) \
        .all()
    
    return upcoming_events


@router.get("/events/{slug}", response_model=schemas.EventDetail)
def read_event_details(slug: str, db: Session = Depends(get_db)):
    db_event = db.query(models.Event).options(joinedload(models.Event.sessions)).filter(models.Event.slug == slug).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event