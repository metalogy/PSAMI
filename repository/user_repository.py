import re
from typing import Optional

from sqlalchemy.orm import Session

from authentication import hashing
from models import user_model

from fastapi import HTTPException, status

from schemas import user_schema


def validate_email_format(email):
    regex = """^(\w|\.|\_|\-)+[@](\w|\_|\-|\.)+[.]\w{2,3}$"""
    if re.search(regex, email) is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email"
        )


def get_current_user(db: Session, mail: str):
    user = db.query(user_model.User) \
        .filter(user_model.User.email == mail).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {mail} not found"
        )
    return user


def get_user_by_id(db: Session, user_id: int):
    user = db.query(user_model.User) \
        .filter(user_model.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )
    return user


def update(db: Session, user_id: int, request: user_schema.UserUpdate):
    user = get_user_by_id(db, user_id)
    if request.username is not None:
        user.username = request.username
    if request.first_name:
        user.first_name = request.first_name
    if request.last_name:
        user.last_name = request.last_name
    if request.email:
        user.email = request.email
    if request.password:
        user.password = request.password
    if request.age:
        user.age = request.age
    if request.city:
        user.city = request.city
    if request.avatar:
        user.avatar = request.avatar
    db.commit()
    db.refresh(user)
    return user


def write_opinion(db: Session, opinion: str, user_id: int):
    user = get_user_by_id(db, user_id)
    user.opinions = opinion
    db.commit()
    db.refresh(user)
    return user


def delete(db: Session, user_id: int):
    user = get_user_by_id(db, user_id)
    db.delete(user)
    db.commit()
    return f"User with id {user_id} has been deleted"


def create_user(db: Session, request: user_schema.UserBase):
    user = db.query(user_model.User) \
        .filter(user_model.User.email == request.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="User with this email already exists"
        )
    validate_email_format(request.email)
    new_user = user_model.User(
        username=request.username,
        first_name=request.first_name,
        last_name=request.last_name,
        email=request.email,
        password=hashing.Hash.bcrypt(request.password),
        age=request.age,
        city=request.city,
        avatar=request.avatar

    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def search_user(db: Session,
                username: Optional[str] = None,
                email: Optional[str] = None):
    users = db.query(user_model.User)
    if username:
        users = users.filter(user_model.User.username.contains(username))
    if email:
        users = users.filter(user_model.User.email.contains(email))
    return users.all()
