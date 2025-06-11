from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from datetime import datetime

# Create database engine
SQLALCHEMY_DATABASE_URL = "sqlite:///./ecology.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for declarative models
Base = declarative_base()

# Import all models to ensure they are registered with Base
from .models.profile import Profile
from .models.certification import Certification
from .models.education import Education
from .models.award import Award
from .models.publication import Publication
from .models.blog import Blog
from .models.project import Project

# Create all tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
