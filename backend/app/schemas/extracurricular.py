from pydantic import BaseModel
from typing import Optional

class ExtracurricularBase(BaseModel):
    title: str
    description: str
    start_date: str
    end_date: Optional[str] = None
    organization: str

class ExtracurricularCreate(ExtracurricularBase):
    pass

class Extracurricular(ExtracurricularBase):
    id: int

    class Config:
        from_attributes = True
