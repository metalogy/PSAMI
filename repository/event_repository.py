from hashlib import new
import io
from operator import ge
import re
from threading import local
from typing import Optional
import datetime
from typing import Optional

from fastapi import HTTPException, status
from geopy import Nominatim
from numpy import full
from sqlalchemy.orm import Session

from PIL import Image
from fastapi import HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
import datetime
from models import event_model, user_model
from repository.user_repository import get_current_user
from schemas import event_schema


def check_localization(address: str, city: str):
    geolocator = Nominatim(user_agent="Event app")
    full_localization = address + " " + city
    location = geolocator.geocode(full_localization)
    if location is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Place with this localization does not exist!",
        )
    return location


def check_file_upload(file):
    full_path_picture = "event_picture.png"
    if file is not None:
        event_picture = file.file.read()
        timestamp = datetime.datetime.now()
        timestamp_to_str = timestamp.strftime("%Y-%m-%d-%H-%M-%S")
        full_path_picture = file.filename[:-
                                          4] + "_" + timestamp_to_str + ".png"
        image = Image.open(io.BytesIO(event_picture))
        image.save(f".\\GUI\\src\\assets\\{full_path_picture}", format="png")
    return full_path_picture


def create_event(
        db: Session,
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
        mail: str,
        file: Optional[UploadFile] = File(None),
):
    user = get_current_user(db, mail)
    localization = check_localization(address, city)
    full_path_picture = check_file_upload(file)

    new_event = event_model.Event(
        name=name,
        description=description,
        date=date,
        event_picture=full_path_picture,
        status=status,
        city=city,
        address=address,
        is_private=is_private,
        is_reserved=is_reserved,
        min_users=min_users,
        max_users=max_users,
        suggested_age=suggested_age,
        user_id=user.id,
        latitude=localization.latitude,
        longitude=localization.longitude,
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event


def show_event(event_id: int, db: Session, mail: str):
    get_current_user(db, mail)
    event = db.query(event_model.Event).filter(
        event_model.Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with id {event_id} not found",
        )
    return event


def update(event_id: int, request: event_schema.EventUpdate, db: Session, mail: str):
    user = get_current_user(db, mail)
    event = db.query(event_model.Event).filter(
        event_model.Event.id == event_id).first()
    localization = check_localization(request.address, request.city)
    if event.user_id == user.id:
        if request.name:
            event.name = request.name
        if request.description:
            event.description = request.description
        if request.date:
            event.date = request.date
        if request.status:
            event.status = request.status
        if request.city:
            event.city = request.city
        if request.address:
            event.address = request.address
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
        event.longitude = localization.longitude
        event.latitude = localization.latitude

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"You can't edit someone's event!",
        )
    db.commit()
    db.refresh(event)
    return event


def delete_event(db: Session, event_id: int, mail: str):
    user = get_current_user(db, mail)
    event = (
        db.query(event_model.Event).filter(
            event_model.Event.id == event_id).first()
    )
    if user.id is not event.user_id:
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            detail=f"You can't delete someone's event! ",
        )
    db.delete(event)
    db.commit()
    return f"Event with id {event_id} has been deleted"


def update_event_picture(db: Session, file, mail: str, event_id: int):
    current_user = get_current_user(db, mail)
    event = db.query(event_model.Event).filter(
        event_model.Event.id == event_id).first()
    if current_user.id == event.user_id:
        full_path_picture = check_file_upload(file)
    else:
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            detail=f"You can't change someone's event image!",
        )

    event.event_picture = full_path_picture

    db.add(event)
    db.commit()
    db.refresh(event)

    return event


def search_event(
        db: Session, name: Optional[str] = None, date: Optional[datetime.date] = None
):
    events = db.query(event_model.Event)

    if name:
        events = events.filter(event_model.Event.name.contains(name))
    if date:
        date = date.strftime("%Y-%m-%d")
        start_date = date + " 00:00:00.0"
        end_date = date + " 23:59:59.99999"
        events = events.filter(
            event_model.Event.date >= start_date, event_model.Event.date <= end_date
        )
    return events.all()


def participate(db: Session, event_id: int, mail: str):
    user = get_current_user(db, mail)
    events = db.query(event_model.Event).filter(
        event_model.Event.id == event_id).first()
    if events:
        participate = event_model.event_participants.insert().values(
            event_id=event_id, user_id=user.id)
        is_already_participating = db.query(event_model.event_participants).filter(
            event_model.event_participants.c.event_id == event_id).filter(
            event_model.event_participants.c.user_id == user.id).first()
        if is_already_participating:
            raise HTTPException(
                status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                detail="You have taken part in this event already!"
            )

    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with id {event_id} not found!"
        )
    db.execute(participate)
    db.commit()
    return "You take part in this event!"


def delete_participate(db: Session, event_id: int, mail: str):
    user = get_current_user(db, mail)
    events = db.query(event_model.Event).filter(
        event_model.Event.id == event_id).first()
    if events:
        is_already_participating = db.query(event_model.event_participants).filter(
            event_model.event_participants.c.event_id == event_id).filter(
            event_model.event_participants.c.user_id == user.id).first()
        statement = event_model.event_participants.delete().where(
            event_model.event_participants.c.event_id == event_id,
            event_model.event_participants.c.user_id == user.id,
        )
        if is_already_participating is not None:
            db.execute(statement)
            db.commit()
            return "You have canceled a participation in event!"
        else:
            raise HTTPException(
                status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                detail=f"You don't participate in this event"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with id {event_id} not found!"
        )


def show_participants(db: Session, event_id: int, mail: str):
    user = get_current_user(db, mail)
    events = db.query(user_model.User).join(event_model.event_participants).filter(
        event_model.event_participants.c.event_id == event_id).all()
    return events
