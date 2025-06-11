from sqlalchemy import Column, Integer, String, Date
from ..database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    start_date = Column(Date)
    end_date = Column(Date, nullable=True)
    technologies = Column(String)  # Will store as comma-separated string
    github_url = Column(String, nullable=True)
    demo_url = Column(String, nullable=True)
