import datetime
from typing import Optional

from fastapi import APIRouter, status, Depends, UploadFile, File
from sqlalchemy.orm import Session

import database
from authentication import oauth2
from schemas import event_schema
from repository import event_repository

router = APIRouter(prefix="/event", tags=["Event"])
get_db = database.get_db


@router.post("/", status_code=status.HTTP_200_OK)
def create_event(
    name: str,
    description: str,
    date: datetime.datetime,
    status: str,
    city: str,
    address: str,
    is_private: bool,
    is_reserved: bool,
    min_users: int,
    max_users: int,
    suggested_age: int,
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    mail: str = Depends(oauth2.get_current_user),
):
    return event_repository.create_event(
        db,
        name,
        description,
        date,
        status,
        city,
        address,
        is_private,
        is_reserved,
        min_users,
        max_users,
        suggested_age,
        mail,
        file,
    )


@router.get("/{event_id}", status_code=status.HTTP_200_OK)
def show_event(
    event_id: int,
    db: Session = Depends(get_db),
    mail: str = Depends(oauth2.get_current_user),
):
    return event_repository.show_event(event_id, db, mail)


@router.put("/{event_id}", status_code=status.HTTP_200_OK)
def update_event(
    event_id: int,
    request: event_schema.EventUpdate,
    db: Session = Depends(get_db),
    mail: str = Depends(oauth2.get_current_user),
):
    return event_repository.update(event_id, request, db, mail)


@router.delete("/", status_code=status.HTTP_200_OK)
def delete(
    event_id: int,
    db: Session = Depends(get_db),
    mail: str = Depends(oauth2.get_current_user),
):
    return event_repository.delete_event(db, event_id, mail)


@router.post("/uploadfile/")
def update_event_picture(
    event_id: int,
    file: UploadFile,
    db: Session = Depends(get_db),
    mail: str = Depends(oauth2.get_current_user),
):
    return event_repository.update_event_picture(db, file, mail, event_id)


@router.get("/", status_code=status.HTTP_200_OK)
def search(
    name: Optional[str] = None,
    date: Optional[datetime.date] = None,
    db: Session = Depends(get_db),
    mail: str = Depends(oauth2.get_current_user),
):
    return event_repository.search_event(db, name, date)


@router.post("/participate", status_code=status.HTTP_200_OK)
def participate(
    event_id: int,
    db: Session = Depends(get_db),
    mail: str = Depends(oauth2.get_current_user),
):
    return event_repository.participate(db, event_id, mail)


@router.delete("/not_participate", status_code=status.HTTP_200_OK)
def not_participate(
    event_id: int,
    db: Session = Depends(get_db),
    mail: str = Depends(oauth2.get_current_user),
):
    return event_repository.delete_participate(db, event_id, mail)
