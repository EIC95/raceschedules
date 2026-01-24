from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app import models, schemas
from app.database import get_db
from datetime import datetime, timezone

router = APIRouter()

@router.get("/sessions/next", response_model=schemas.Session)
def read_next_session(db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    next_session = db.query(models.Session) \
        .options(
            joinedload(models.Session.event).joinedload(models.Event.championship)
        ) \
        .filter(models.Session.start_time > now) \
        .order_by(models.Session.start_time) \
        .first()
    if next_session is None:
        raise HTTPException(status_code=404, detail="No upcoming session found")
    return next_session