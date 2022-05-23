from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

import database
from authentication import oauth2
from repository import profile_comments_repository
from schemas import profile_comments_schema

router = APIRouter(prefix="/profile_comments", tags=["Profile_Comments"])
get_db = database.get_db


@router.post("/", status_code=status.HTTP_200_OK)
def write_comment(request: profile_comments_schema.ProfileBase, db: Session = Depends(get_db),
                  mail: str = Depends(oauth2.get_current_user)):
    return profile_comments_repository.write_comment(db, request, mail)


@router.get("/{user_id}", status_code=status.HTTP_200_OK)
def show_user_comments(user_id: int, db: Session = Depends(get_db), mail: str = Depends(oauth2.get_current_user)):
    return profile_comments_repository.show_user_comments(db, user_id, mail)


@router.put("/", status_code=status.HTTP_200_OK)
def update_comment(id: int, text: str, db: Session = Depends(get_db), mail: str = Depends(oauth2.get_current_user)):
    return profile_comments_repository.update_comment(db, id, text, mail)


@router.delete("/", status_code=status.HTTP_200_OK)
def delete_comments(comment_id: int, db: Session = Depends(get_db), mail: str = Depends(oauth2.get_current_user)):
    return profile_comments_repository.delete_comment(db, comment_id, mail)
