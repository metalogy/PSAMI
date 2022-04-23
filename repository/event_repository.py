from sqlalchemy.orm import Session

from models import event_model
from repository.user_repository import get_current_user
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