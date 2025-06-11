from pydantic import BaseModel
from typing import Optional

class CertificationBase(BaseModel):
    name: str
    organization: str
    date: str
    description: Optional[str] = None

class CertificationCreate(CertificationBase):
    pass

class Certification(CertificationBase):
    id: int

    class Config:
        from_attributes = True
