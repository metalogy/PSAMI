import uvicorn
from fastapi import FastAPI, File

from database import engine
from models import user_model
from routers import (
    authentication_router,
    event_router,
    profile_comments_router,
    event_comments_router,
    user_router,
)

app = FastAPI()

user_model.Base.metadata.create_all(engine)
app.include_router(authentication_router.router)
app.include_router(user_router.router)
app.include_router(event_router.router)
app.include_router(profile_comments_router.router)
app.include_router(event_comments_router.router)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="info")
