from pydantic import BaseModel
from typing import Optional

class BlogBase(BaseModel):
    title: str
    content: str
    date: str
    category: str
    tags: list
    image_url: Optional[str] = None

class BlogCreate(BlogBase):
    pass

class Blog(BlogBase):
    id: int

    class Config:
        from_attributes = True
