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

    # Début et fin de la semaine actuelle (lundi 00:00 → dimanche 23:59)
    start_of_week = now - timedelta(days=now.weekday())
    start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_week = start_of_week + timedelta(days=6, hours=23, minutes=59, seconds=59, microseconds=999999)

    # Récupération des événements de la semaine en cours
    events_this_week = db.query(models.Event) \
        .options(joinedload(models.Event.championship)) \
        .filter(
            models.Event.start_date <= end_of_week,
            models.Event.end_date >= start_of_week,
            models.Event.postponed == False,
            models.Event.cancelled == False
        ) \
        .order_by(models.Event.start_date) \
        .all()

    if events_this_week:
        return events_this_week

    # Fallback : événements à venir les plus proches
    upcoming_events = db.query(models.Event) \
        .options(joinedload(models.Event.championship)) \
        .filter(
            models.Event.start_date >= now,
            models.Event.postponed == False,
            models.Event.cancelled == False
        ) \
        .order_by(models.Event.start_date) \
        .limit(5) \
        .all()

    return upcoming_events


@router.get("/events/{slug}", response_model=schemas.EventDetail)
def read_event_details(slug: str, db: Session = Depends(get_db)):
    db_event = db.query(models.Event).options(joinedload(models.Event.sessions)).filter(models.Event.slug == slug).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event