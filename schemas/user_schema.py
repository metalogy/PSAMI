from typing import Optional

from pydantic import BaseModel


class UserBase(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: str
    password: str
    age: int
    avatar: str
    city: str


class UserUpdate(UserBase):
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    age: Optional[int] = None
    city: Optional[str] = None

    # avatar: Optional[str] = None

    class Config:
        orm_mode = True


class UserBaseWithPassword(UserBase):
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class Login(BaseModel):
    username: str
    password: str
