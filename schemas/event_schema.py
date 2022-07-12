import datetime
from typing import Optional

from pydantic.main import BaseModel


class EventBase(BaseModel):
    name: str
    description: str
    date: datetime.datetime
    status: str
    city: str
    address: str
    is_private: bool
    is_reserved: bool
    min_users: int
    max_users: int
    suggested_age: int

    # users tabela
    # comments tabela


class ShowEvent(EventBase):
    id: int
    name: str
    date: datetime.datetime

    class Config:
        orm_mode = True


class EventUpdate(EventBase):
    name: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime.datetime] = None
    status: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    is_private: Optional[bool] = None
    is_reserved: Optional[bool] = None
    min_users: Optional[int] = None
    max_users: Optional[int] = None
    suggested_age: Optional[int] = None

    class Config:
        orm_mode = True
