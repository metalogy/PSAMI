import datetime

from pydantic.main import BaseModel


class EventBase(BaseModel):
    name: str
    description: str
    date: datetime.datetime
    pictures: str
    status: str
    localization: str
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

    class Config:
        orm_mode = True
