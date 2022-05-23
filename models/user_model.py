from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True}
    __bind_key__ = 'user'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String)
    password = Column(String)
    age = Column(Integer)
    city = Column(String)
    profile_picture = Column(String)
    events = relationship("Event", back_populates="owner")

