from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Base and simple schemas first

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
    championship: Optional[ChampionshipRead] = None # Nested Championship

    class Config:
        from_attributes = True

class SessionBase(BaseModel):
    name: str
    start_time: datetime
    session_number: int

class Session(SessionBase): # This is the main Session schema
    id: int
    event_id: int
    event: Optional[EventRead] = None # Nested Event

    class Config:
        from_attributes = True


# Existing schemas for other purposes, keeping them as is for now.
# If EventDetail/ChampionshipDetail were meant to include these, they should be updated.
class CategoryBase(BaseModel):
    name: str

class Category(CategoryBase):
    id: int
    class Config:
        from_attributes = True

class EventDetail(EventRead): # Inherit from EventRead
    sessions: List["Session"] = [] # Only include basic session info

class ChampionshipDetail(ChampionshipRead): # Inherit from ChampionshipRead
    events: List[EventRead] = [] # Include EventRead

class CategoryDetail(Category):
    championships: List[ChampionshipRead] = [] # Include ChampionshipRead