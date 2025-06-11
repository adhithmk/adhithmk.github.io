from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProjectTag(BaseModel):
    name: str

class Project(BaseModel):
    title: str
    description: str
    image_url: str
    tags: List[ProjectTag]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
