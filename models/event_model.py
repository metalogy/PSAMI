from datetime import datetime

from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Table
from sqlalchemy.orm import relationship

from database import Base

event_participants = Table(
    "event_participants",
    Base.metadata,
    Column("event_id", ForeignKey("event.id")),
    Column("user_id", ForeignKey("users.id"))
)


class Event(Base):
    __tablename__ = "event"
    __table_args__ = {'extend_existing': True}
    __bind_key__ = 'event'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    date = Column(DateTime)
    event_picture = Column(String)
    status = Column(String)
    city = Column(String)
    address = Column(String)
    is_private = Column(Boolean)
    is_reserved = Column(Boolean)
    min_users = Column(Integer)
    max_users = Column(Integer)
    suggested_age = Column(Integer)
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="events")
    event_comments = relationship(
        "Event_Comments", back_populates="event_comments")
    event_participants = relationship("User", secondary=event_participants)

    created_at = Column(DateTime(timezone=True), default=datetime.now())
    updated_at = Column(DateTime(timezone=True),
                        default=datetime.now(), onupdate=datetime.now())
    longitude = Column(String)
    latitude = Column(String)
