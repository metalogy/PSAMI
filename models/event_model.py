from datetime import datetime

from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from database import Base


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
    localization = Column(String)
    is_private = Column(Boolean)
    is_reserved = Column(Boolean)
    min_users = Column(Integer)
    max_users = Column(Integer)
    suggested_age = Column(Integer)
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="events")
    created_at = Column(DateTime(timezone=True), default=datetime.now())
    updated_at = Column(DateTime(timezone=True), default=datetime.now(), onupdate=datetime.now())



