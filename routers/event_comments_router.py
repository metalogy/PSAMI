from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

import database
from authentication import oauth2
from repository import event_comments_repository
from schemas import event_comments_schema

router = APIRouter(prefix="/event_comments", tags=["Event_Comments"])
get_db = database.get_db


@router.post("/", status_code=status.HTTP_200_OK)
def write_comment(request: event_comments_schema.CommentBase, db: Session = Depends(get_db),
                  mail: str = Depends(oauth2.get_current_user)):
    return event_comments_repository.write_comment(db, request, mail)


@router.get("/{event_id}", status_code=status.HTTP_200_OK)
def show_comments(event_id: int, db: Session = Depends(get_db), mail: str = Depends(oauth2.get_current_user)):
    return event_comments_repository.show_event_comments(db, event_id, mail)


@router.put("/", status_code=status.HTTP_200_OK)
def update_comment(comment_id: int, request: event_comments_schema.CommentUpdate, db: Session = Depends(get_db),
                   mail: str = Depends(oauth2.get_current_user)):
    return event_comments_repository.update_comment(db, comment_id, request, mail)


@router.delete("/", status_code=status.HTTP_200_OK)
def delete_comment(comment_id: int, db: Session = Depends(get_db), mail: str = Depends(oauth2.get_current_user)):
    return event_comments_repository.delete_comment(db, comment_id, mail)
