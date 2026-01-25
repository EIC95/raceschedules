from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class ChampionshipBase(BaseModel):
    name: str
    slug: str

class ChampionshipRead(ChampionshipBase):
    id: int
    category_id: int
    class Config:
        from_attributes = True

class EventBase(BaseModel):
    name: str
    slug: str
    start_date: datetime
    end_date: datetime

class EventRead(EventBase):
    id: int
    championship_id: Optional[int] = None
    championship: Optional[ChampionshipRead] = None

    class Config:
        from_attributes = True

class SessionBase(BaseModel):
    name: str
    start_time: datetime
    session_number: int
    timezone: str

class Session(SessionBase):
    id: int
    event_id: int
    event: Optional[EventRead] = None

    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str

class Category(CategoryBase):
    id: int
    class Config:
        from_attributes = True

class EventDetail(EventRead):
    sessions: List["Session"] = []

class ChampionshipDetail(ChampionshipRead):
    events: List[EventRead] = []

class CategoryDetail(Category):
    championships: List[ChampionshipRead] = []