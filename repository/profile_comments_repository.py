from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models import profile_comments_model
from repository.user_repository import get_user_by_id, get_current_user
from schemas import profile_comments_schema


def write_comment(db: Session, request: profile_comments_schema.ProfileBase, mail: str):
    get_user_by_id(db, request.user_id)
    user = get_current_user(db, mail)

    new_comment = profile_comments_model.Profile_Comments(
        text=request.text,
        user_id=request.user_id,
        writer_id=user.id

    )
    print(new_comment)
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment


def show_user_comments(db: Session, user_id: int, mail: str):
    get_user_by_id(db, user_id)
    comments = db.query(profile_comments_model.Profile_Comments).filter(
        profile_comments_model.Profile_Comments.user_id == user_id).all()
    return comments


def update_comment(db: Session, comment_id: int, text: str, mail: str):
    user = get_current_user(db, mail)
    comment = db.query(profile_comments_model.Profile_Comments).filter(
        profile_comments_model.Profile_Comments.id == comment_id).first()
    if comment is not None:
        if user.id == comment.writer_id:
            comment.text = text
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
    comment = db.query(profile_comments_model.Profile_Comments).filter(
        profile_comments_model.Profile_Comments.id == comment_id).first()

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
