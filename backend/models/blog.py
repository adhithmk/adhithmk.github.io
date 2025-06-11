from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Tag(BaseModel):
    name: str

class BlogPost(BaseModel):
    title: str
    content: str
    category: str
    tags: List[str]
    image_url: Optional[str]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
