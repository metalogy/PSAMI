from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

import database
from authentication import tokens, oauth2
from authentication.hashing import Hash
from models import user_model
from schemas import user_schema

get_db = database.get_db

router = APIRouter(tags=["Authentication"])


def get_user(request: OAuth2PasswordRequestForm = Depends(),
             db: Session = Depends(get_db)):
    user = db.query(user_model.User) \
        .filter(user_model.User.email == request.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid Credentials"
        )
    if not Hash.verify(user.password, request.password):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incorrect password"
        )
    return user


@router.post("/login")
def login(
        request: OAuth2PasswordRequestForm = Depends(),
        db: Session = Depends(get_db)
):
    user = get_user(request, db)
    access_token = tokens.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post('/refresh')
def refresh(
        current_user: user_schema.UserBase = Depends(oauth2.get_current_user)):
    new_access_token = tokens.create_access_token(data={"sub": current_user})
    return {"refresh_token": new_access_token}


@router.get("/who_am_i")
def who_am_i(
        current_user: user_schema.UserBase = Depends(oauth2.get_current_user),
        db: Session = Depends(get_db)
):
    user = db.query(user_model.User) \
        .filter(user_model.User.email == current_user).first()
    return {"user": user}
