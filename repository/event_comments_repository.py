from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models import event_comments_model, event_model
from repository.user_repository import get_current_user
from schemas import event_comments_schema


def write_comment(db: Session, request: event_comments_model.Event_Comments, mail: str):
    user = get_current_user(db, mail)

    new_comment = event_comments_model.Event_Comments(
        text=request.text,
        rating=request.rating,
        event_id=request.event_id,
        writer_id=user.id

    )
    event = db.query(event_model.Event).filter(
        event_model.Event.id == request.event_id).first()
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with id {request.event_id} does not exist!"
        )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment


def show_event_comments(db: Session, event_id: int, mail: str):
    comments = db.query(event_comments_model.Event_Comments).filter(
        event_comments_model.Event_Comments.event_id == event_id).all()
    return comments


def update_comment(db: Session, comment_id: int, request: event_comments_schema.CommentUpdate, mail: str):
    user = get_current_user(db, mail)
    comment = db.query(event_comments_model.Event_Comments).filter(
        event_comments_model.Event_Comments.id == comment_id).first()
    if comment is not None:
        if user.id == comment.writer_id:
            if request.text:
                comment.text = request.text
            if request.rating:
                comment.rating = request.rating
            db.commit()
            db.refresh(comment)
            return f"Comment with id {comment_id} has been updated"
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"This is not your comment!"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"This comment does not exist!"
        )


def delete_comment(db: Session, comment_id: int, mail: str):
    user = get_current_user(db, mail)
    comment = db.query(event_comments_model.Event_Comments).filter(
        event_comments_model.Event_Comments.id == comment_id).first()
    if comment is not None:
        if user.id == comment.writer_id:
            db.delete(comment)
            db.commit()
            return f"Comment with id {comment_id} has been deleted"
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"This is not your comment!"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"This comment does not exist!"
        )
