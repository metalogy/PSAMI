import io
from os import stat
import re
import datetime
from typing import Union, Optional
import imageio as iio
from PIL import Image
from typing import Optional

from sqlalchemy.orm import Session

from authentication import hashing
from models import user_model

from fastapi import HTTPException, status, UploadFile, File

from schemas import user_schema


def check_file_upload(file):
    full_path_picture = "profile_picture.png"
    if file is not None:
        event_picture = file.file.read()
        timestamp = datetime.datetime.now()
        timestamp_to_str = timestamp.strftime("%Y-%m-%d-%H-%M-%S")
        full_path_picture = file.filename[:-
        4] + "_" + timestamp_to_str + ".png"
        image = Image.open(io.BytesIO(event_picture))
        image.save(f".\\GUI\\src\\assets\\{full_path_picture}", format="png")
    return full_path_picture


def validate_email_format(email):
    regex = """^(\w|\.|\_|\-)+[@](\w|\_|\-|\.)+[.]\w{2,3}$"""
    if re.search(regex, email) is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email"
        )


def get_current_user(db: Session, mail: str):
    user = db.query(user_model.User).filter(
        user_model.User.email == mail).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {mail} not found",
        )
    return user


def get_user_by_id(db: Session, user_id: int):
    user = db.query(user_model.User).filter(
        user_model.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found",
        )
    return user


def update(db: Session, user_id: int, request: user_schema.UserUpdate, mail: str):
    user = get_current_user(db, mail)
    validate_email_format(request.email)
    if user.id == user_id:
        if request.username is not None:
            user.username = request.username
        if request.first_name:
            user.first_name = request.first_name
        if request.last_name:
            user.last_name = request.last_name
        if request.email:
            user.email = request.email
        if request.password:
            user.password = hashing.Hash.bcrypt(request.password)
        if request.age:
            user.age = request.age
        if request.city:
            user.city = request.city
    else:
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            detail=f"You can not update someone's profile!"
        )

    db.commit()
    db.refresh(user)
    return user


def delete(db: Session, mail: str):
    user = get_current_user(db, mail)
    db.delete(user)
    db.commit()
    return f"User with id {user.id} has been deleted"


def create_user(
        db: Session,
        username: str,
        first_name: str,
        last_name: str,
        email: str,
        password: str,
        age: datetime.date,
        city: str,
        file: Optional[UploadFile] = File(None),
):
    user = db.query(user_model.User).filter(
        user_model.User.email == email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="User with this email already exists",
        )
    validate_email_format(email)

    full_path_picture = check_file_upload(file)

    new_user = user_model.User(
        username=username,
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=hashing.Hash.bcrypt(password),
        age=age,
        city=city,
        profile_picture=full_path_picture,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return "User has been created!"


def update_profile_picture(db: Session, file, mail):
    current_user = get_current_user(db, mail)
    user = (
        db.query(user_model.User).filter(
            user_model.User.id == current_user.id).first()
    )
    full_path_picture = check_file_upload(file)

    user.profile_picture = full_path_picture

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def search_user(
        db: Session, username: Optional[str] = None, email: Optional[str] = None
):
    users = db.query(user_model.User)
    if username:
        users = users.filter(user_model.User.username.contains(username))
    if email:
        users = users.filter(user_model.User.email.contains(email))
    return users.all()
