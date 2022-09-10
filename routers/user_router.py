import datetime
from typing import Optional

from fastapi import Depends, APIRouter, status, UploadFile, File, Form
from sqlalchemy.orm import Session

import database
from authentication import oauth2
from repository import user_repository
from schemas import user_schema

router = APIRouter(prefix="/user", tags=["Users"])
get_db = database.get_db


@router.get("/{user_id}", status_code=status.HTTP_200_OK)
def get_user(user_id: int, db: Session = Depends(get_db), mail: str = Depends(oauth2.get_current_user), ):
    return user_repository.get_user_by_id(db, user_id)


@router.post("/", status_code=status.HTTP_200_OK)
def create_user(
        username: str,
        first_name: str,
        last_name: str,
        email: str,
        password: str,
        age: datetime.date,
        city: str,
        file: Optional[UploadFile] = File(None),
        db: Session = Depends(get_db),
):
    return user_repository.create_user(
        db, username, first_name, last_name, email, password, age, city, file
    )


@router.put(
    "/{user_id}", status_code=status.HTTP_200_OK, response_model=user_schema.UserUpdate
)
def update(
        user_id: int, request: user_schema.UserUpdate, db: Session = Depends(get_db),
        mail: str = Depends(oauth2.get_current_user)
):
    return user_repository.update(db, user_id, request, mail)


@router.delete("/", status_code=status.HTTP_200_OK)
def delete(user_id: int, db: Session = Depends(get_db), mail: str = Depends(oauth2.get_current_user)):
    return user_repository.delete(db, mail)


@router.put("/uploadfile/")
def update_profile_picture(
        file: UploadFile,
        db: Session = Depends(get_db),
        mail: str = Depends(oauth2.get_current_user),
):
    return user_repository.update_profile_picture(db, file, mail)


@router.get("/", status_code=status.HTTP_200_OK)
def search(
        username: Optional[str] = None,
        email: Optional[str] = None,
        db: Session = Depends(get_db),
        mail: str = Depends(oauth2.get_current_user),
):
    return user_repository.search_user(db, username, email)
