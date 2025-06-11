from sqlalchemy import Column, Integer, String, Date
from ..database import Base

class Award(Base):
    __tablename__ = "awards"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    organization = Column(String, index=True)
    date = Column(Date)
    description = Column(String, nullable=True)
