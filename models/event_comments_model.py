from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from database import Base


class Event_Comments(Base):
    __tablename__ = "event_comments"
    __table_args__ = {'extend_existing': True}
    __bind_key__ = 'event_comments'
    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Integer)
    text = Column(String)
    writer_id = Column(Integer)
    event_id = Column(Integer, ForeignKey("event.id"))
    created_at = Column(DateTime(timezone=True), default=datetime.now())
    event_comments = relationship("Event", back_populates="event_comments")
