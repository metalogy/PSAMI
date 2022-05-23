from typing import Optional

from pydantic.main import BaseModel


class CommentBase(BaseModel):
    text: str
    rating: str
    event_id: int


class CommentUpdate(BaseModel):
    text: Optional[str]
    rating: Optional[int]

    class Config:
        orm_mode = True
