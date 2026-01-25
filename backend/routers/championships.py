from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app import models, schemas
from app.database import get_db

router = APIRouter()

@router.get("/championships", response_model=List[schemas.ChampionshipRead])
def read_championships(db: Session = Depends(get_db)):
    query = db.query(models.Championship).options(joinedload(models.Championship.category))
    return query.all()

@router.get("/championships/{slug}", response_model=schemas.ChampionshipDetail)
def read_championship_details(slug: str, db: Session = Depends(get_db)):
    db_championship = db.query(models.Championship).options(joinedload(models.Championship.events)).filter(models.Championship.slug == slug).first()
    if db_championship is None:
        raise HTTPException(status_code=404, detail="Championship not found")
    return db_championship