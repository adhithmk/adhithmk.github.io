from sqlalchemy import Column, Integer, String, Date
from ..database import Base

class Education(Base):
    __tablename__ = "education"

    id = Column(Integer, primary_key=True, index=True)
    institution = Column(String, index=True)
    degree = Column(String, index=True)
    field_of_study = Column(String, index=True)
    start_date = Column(Date)
    end_date = Column(Date, nullable=True)
    description = Column(String, nullable=True)
