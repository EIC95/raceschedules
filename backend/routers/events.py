from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import exists, and_
from app import models, schemas
from app.database import get_db
from datetime import datetime, timedelta, timezone

router = APIRouter()

def get_week_bounds(date: datetime):
    start = date - timedelta(days=date.weekday())
    start = start.replace(hour=0, minute=0, second=0, microsecond=0)
    end = start + timedelta(days=6, hours=23, minutes=59, seconds=59, microseconds=999999)
    return start, end

def query_events_in_range(db, start, end, now=None, require_active_session=False):
    query = db.query(models.Event).options(
        joinedload(models.Event.championship)
    ).filter(
        models.Event.start_date <= end,
        models.Event.end_date >= start,
        models.Event.postponed == False,
        models.Event.cancelled == False
    )

    if require_active_session and now:
        query = query.filter(
            exists().where(
                and_(
                    models.Session.event_id == models.Event.id,
                    models.Session.start_time >= now
                )
            )
        )

    return query.order_by(models.Event.start_date).all()

@router.get("/events/upcoming", response_model=List[schemas.EventRead])
def read_upcoming_events(db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)

    # --- 1. CURRENT WEEK-END ---
    start_of_week, end_of_week = get_week_bounds(now)

    events_this_week = query_events_in_range(
        db,
        start_of_week,
        end_of_week,
        now=now,
        require_active_session=True
    )

    if events_this_week:
        return events_this_week

    # --- 2. NEXT WEEK-END ---
    next_event = db.query(models.Event).filter(
        models.Event.start_date > end_of_week,
        models.Event.postponed == False,
        models.Event.cancelled == False
    ).order_by(models.Event.start_date).first()

    if next_event:
        next_start, next_end = get_week_bounds(next_event.start_date) # type: ignore

        next_week_events = query_events_in_range(
            db,
            next_start,
            next_end
        )

        if next_week_events:
            return next_week_events

    # --- 3. FALLBACK ---
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


@router.get("/events", response_model=List[schemas.EventRead])
def read_all_events(db: Session = Depends(get_db)):
    return db.query(models.Event).options(joinedload(models.Event.championship)).all()


@router.get("/events/{slug}", response_model=schemas.EventDetail)
def read_event_details(slug: str, db: Session = Depends(get_db)):
    db_event = db.query(models.Event).options(joinedload(models.Event.sessions)).filter(models.Event.slug == slug).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event