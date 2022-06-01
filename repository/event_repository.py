import io
from typing import Optional

from PIL import Image
from fastapi import HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
import datetime
from models import event_model
from repository.user_repository import get_current_user
from schemas import event_schema


def create_event(db: Session, name: str, description: str, date: datetime.datetime, status: str, localization: str,
                 is_private: bool,
                 is_reserved: bool, min_users: int, max_users: int, suggested_age: int, mail: str,
                 file: Optional[UploadFile] = File(None)):
    user = get_current_user(db, mail)

    full_path_picture = "event_picture.png"
    if file is not None:
        event_picture = file.file.read()
        timestamp = datetime.datetime.now()
        timestamp_to_str = timestamp.strftime("%Y-%m-%d-%H-%M-%S")
        full_path_picture = file.filename[:-4] + "_" + timestamp_to_str + ".png"
        image = Image.open(io.BytesIO(event_picture))
        image.save(f".\\images\\{full_path_picture}", format='png')
    new_event = event_model.Event(
        name=name,
        description=description,
        date=date,
        event_picture="images\\" + full_path_picture,
        status=status,
        localization=localization,
        is_private=is_private,
        is_reserved=is_reserved,
        min_users=min_users,
        max_users=max_users,
        suggested_age=suggested_age,
        user_id=user.id
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event


def show_event(event_id: int, db: Session, mail: str):
    get_current_user(db, mail)
    event = db.query(event_model.Event).filter(event_model.Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with id {event_id} not found"
        )
    return event


def update(event_id: int, request: event_schema.EventUpdate, db: Session, mail: str):
    user = get_current_user(db, mail)
    event = db.query(event_model.Event).filter(event_model.Event.id == event_id).first()
    if event.user_id == user.id:
        if request.name:
            event.name = request.name
        if request.description:
            event.description = request.description
        if request.date:
            event.date = request.date
        if request.status:
            event.status = request.status
        if request.localization:
            event.localization = request.localization
        if request.is_private:
            event.is_private = request.is_private
        if request.is_reserved:
            event.is_reserved = request.is_reserved
        if request.min_users:
            event.min_users = request.min_users
        if request.max_users:
            event.max_users = request.max_users
        if request.suggested_age:
            event.suggested_age = request.suggested_age

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"You can't edit someone's event!"
        )
    db.commit()
    db.refresh(event)
    return event


def delete_event(db: Session, event_id: int, mail: str):
    user = get_current_user(db, mail)
    event = db.query(event_model.Event) \
        .filter(event_model.Event.user_id == user.id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            detail=f"You can't delete someone's event! "
        )
    db.delete(event)
    db.commit()
    return f"Event with id {event_id} has been deleted"


def update_event_picture(db: Session, file, mail: str, event_id: int):
    current_user = get_current_user(db, mail)

    picture = file.file.read()
    timestamp = datetime.datetime.now()
    timestamp_to_str = timestamp.strftime("%Y-%m-%d-%H-%M-%S")
    full_path_picture = file.filename[:-4] + "_" + timestamp_to_str + ".png"
    event = db.query(event_model.Event).filter(event_model.Event.id == event_id).first()
    if current_user.id == event.user_id:
        image = Image.open(io.BytesIO(picture))
        image.save(f".\\images\\{full_path_picture}", format='png')
        event.event_picture = "images\\" + full_path_picture
    else:
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            detail=f"You can't change someone's event image!"
        )
    db.add(event)
    db.commit()
    db.refresh(event)

    return event
