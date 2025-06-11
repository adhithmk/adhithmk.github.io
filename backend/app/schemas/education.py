from pydantic import BaseModel
from typing import Optional

class EducationBase(BaseModel):
    institution: str
    degree: str
    field_of_study: str
    start_date: str
    end_date: Optional[str] = None
    description: Optional[str] = None

class EducationCreate(EducationBase):
    pass

class Education(EducationBase):
    id: int

    class Config:
        from_attributes = True
