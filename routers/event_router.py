from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

from authentication import oauth2
from repository import event_repository
import database
from schemas import event_schema

router = APIRouter(prefix="/event", tags=["Event"])
get_db = database.get_db


@router.post("/", status_code=status.HTTP_200_OK)
def create_event(request: event_schema.EventBase, db: Session = Depends(get_db),
                 mail: str = Depends(oauth2.get_current_user)):
    return event_repository.create_event(db, request, mail)
