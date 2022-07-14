from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from database import Base


class Profile_Comments(Base):
    __tablename__ = "profile_comments"
    __table_args__ = {'extend_existing': True}
    __bind_key__ = 'profile_comments'
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    writer_id = Column(Integer)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), default=datetime.now())
    profile_comments = relationship("User", back_populates="user_comments")
