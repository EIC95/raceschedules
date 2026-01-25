from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False, default="")
    championships = relationship("Championship", back_populates="category")

class Championship(Base):
    __tablename__ = "championships"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    slug = Column(String, unique=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="championships")
    events = relationship("Event", back_populates="championship")

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    slug = Column(String, unique=True, index=True)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    championship_id = Column(Integer, ForeignKey("championships.id"), nullable=True)
    championship = relationship("Championship", back_populates="events")
    sessions = relationship("Session", back_populates="event")

class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    start_time = Column(DateTime)
    session_number = Column(Integer)
    event_id = Column(Integer, ForeignKey("events.id"))
    event = relationship("Event", back_populates="sessions")
    timezone = Column(String, nullable=False, default="UTC") # Changed to non-nullable with default
