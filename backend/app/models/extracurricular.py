from sqlalchemy import Column, Integer, String, Date
from ..database import Base

class Extracurricular(Base):
    __tablename__ = "extracurriculars"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    start_date = Column(Date)
    end_date = Column(Date, nullable=True)
    organization = Column(String)
