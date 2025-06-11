from pydantic import BaseModel
from typing import List, Optional

class Profile(BaseModel):
    id: int
    name: str
    title: str
    tagline: str
    subtitle: str
    about_text: str
    academic_background: str
    skills: str  # Assuming skills are stored as a JSON string

    class Config:
        orm_mode = True
