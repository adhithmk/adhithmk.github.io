from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Certification(BaseModel):
    name: str
    organization: str
    icon: str  # Font Awesome icon class
    obtained_date: Optional[datetime]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CertificationSQL(Base):
    __tablename__ = 'certifications'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    institution = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
