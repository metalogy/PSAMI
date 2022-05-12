from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models import event_model
from repository.user_repository import get_current_user, get_user_by_id
from schemas import event_schema


def create_event(db: Session, request: event_schema.EventBase, mail: str):
    user = get_current_user(db, mail)
    new_event = event_model.Event(
        name=request.name,
        description=request.description,
        date=request.date,
        pictures=request.pictures,
        status=request.status,
        localization=request.localization,
        is_private=request.is_private,
        is_reserved=request.is_reserved,
        min_users=request.min_users,
        max_users=request.max_users,
        suggested_age=request.suggested_age,
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
        if request.pictures:
            event.pictures = request.pictures
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
