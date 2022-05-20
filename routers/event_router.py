from typing import Optional

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


@router.get("/{event_id}", status_code=status.HTTP_200_OK)
def show_event(event_id: int, db: Session = Depends(get_db), mail: str = Depends(oauth2.get_current_user)):
    return event_repository.show_event(event_id, db, mail)


@router.put("/{event_id}", status_code=status.HTTP_200_OK)
def update_event(event_id: int, request: event_schema.EventUpdate, db: Session = Depends(get_db),
                 mail: str = Depends(oauth2.get_current_user)):
    return event_repository.update(event_id, request, db, mail)


@router.delete("/", status_code=status.HTTP_200_OK)
def delete(event_id: int, db: Session = Depends(get_db), mail: str = Depends(oauth2.get_current_user)):
    return event_repository.delete_event(db, event_id, mail)


@router.get("/", status_code=status.HTTP_200_OK)
def search(name: Optional[str] = None, db: Session = Depends(get_db)):
    return event_repository.search_event(db, name)
