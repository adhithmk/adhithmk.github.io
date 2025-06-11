from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from typing import List, Optional

Base = declarative_base()

class Skill(Base):
    __tablename__ = 'skills'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    level = Column(Integer, nullable=False)
    profile_id = Column(Integer, ForeignKey('profiles.id'))
    profile = relationship('Profile', back_populates='skills')

class ResearchInterest(Base):
    __tablename__ = 'research_interests'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    profile_id = Column(Integer, ForeignKey('profiles.id'))
    profile = relationship('Profile', back_populates='profile')

class Profile(Base):
    __tablename__ = 'profiles'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    tagline = Column(String, nullable=False)
    subtitle = Column(String, nullable=False)
    about_text = Column(String, nullable=False)
    academic_background = Column(String, nullable=False)
    skills = Column(String, nullable=False)  # Store skills as JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    research_interests = relationship('ResearchInterest', back_populates='profile')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'title': self.title,
            'tagline': self.tagline,
            'subtitle': self.subtitle,
            'about_text': self.about_text,
            'academic_background': self.academic_background,
            'skills': self.skills
        }
