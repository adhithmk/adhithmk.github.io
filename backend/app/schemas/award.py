from pydantic import BaseModel
from typing import Optional

class AwardBase(BaseModel):
    title: str
    organization: str
    date: str
    description: Optional[str] = None

class AwardCreate(AwardBase):
    pass

class Award(AwardBase):
    id: int

    class Config:
        from_attributes = True
