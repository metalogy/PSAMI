import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from database import engine
from models import user_model
from routers import user_router, authentication_router, event_router

app = FastAPI()

user_model.Base.metadata.create_all(engine)
app.include_router(authentication_router.router)
app.include_router(user_router.router)
app.include_router(event_router.router)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="info")
