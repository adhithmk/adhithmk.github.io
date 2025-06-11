from pydantic import BaseModel
from typing import Optional

class PublicationBase(BaseModel):
    title: str
    authors: str
    journal: str
    year: int
    doi: Optional[str] = None
    abstract: Optional[str] = None

class PublicationCreate(PublicationBase):
    pass

class Publication(PublicationBase):
    id: int

    class Config:
        from_attributes = True
