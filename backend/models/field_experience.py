from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FieldExperience(BaseModel):
    title: str
    description: str
    location: str
    start_date: datetime
    end_date: Optional[datetime]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
