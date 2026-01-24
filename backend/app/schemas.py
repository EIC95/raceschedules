from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Base and simple schemas first

class SessionBase(BaseModel):
    name: str
    start_time: datetime
    session_number: int

class Session(SessionBase):
    id: int
    event_id: int

    class Config:
        from_attributes = True

class EventBase(BaseModel):
    name: str
    slug: str
    start_date: datetime
    end_date: datetime

class EventSimple(EventBase):
    id: int
    championship_id: Optional[int] = None
    class Config:
        from_attributes = True

class ChampionshipBase(BaseModel):
    name: str
    slug: str

class ChampionshipSimple(ChampionshipBase):
    id: int
    category_id: int
    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str

class Category(CategoryBase):
    id: int
    class Config:
        from_attributes = True


# Schemas with relationships for detail views

class EventDetail(EventSimple):
    sessions: List[Session] = []

class ChampionshipDetail(ChampionshipSimple):
    events: List[EventSimple] = []

class CategoryDetail(Category):
    championships: List[ChampionshipSimple] = []