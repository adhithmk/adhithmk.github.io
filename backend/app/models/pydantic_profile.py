from pydantic import BaseModel
from typing import Optional

class Profile(BaseModel):
    name: str
    email: str
    bio: Optional[str] = None
    website: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
