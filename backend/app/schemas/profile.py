from pydantic import BaseModel
from typing import Optional

class ProfileBase(BaseModel):
    name: str
    title: str
    tagline: str
    academic_background: str

class ProfileCreate(ProfileBase):
    pass

class Profile(ProfileBase):
    id: int

    class Config:
        from_attributes = True
