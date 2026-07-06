"""
Database configuration.

SQLite is used here for simplicity (portfolio / demo project).
In a real deployment this would point to a managed Postgres instance,
and the "money movement" tables below would sit behind a licensed
payment partner rather than being the source of truth for real funds
(see README -> "Regulatory notice").
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "sqlite:///./cashlink.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
