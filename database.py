import os

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

default_database = 'sqlite:///events.db'
default_connection_args = {'check_same_thread': False}

SQLALCHEMY_DATABASE_URL = os.getenv(
    'DATABASE_URL',
    default_database
)

if SQLALCHEMY_DATABASE_URL == default_database:
    connect_args = default_connection_args
else:
    connect_args = {}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args=connect_args
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
