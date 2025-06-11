from sqlalchemy import Column, Integer, String
from ..database import Base

class Publication(Base):
    __tablename__ = "publications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    authors = Column(String, index=True)
    journal = Column(String, index=True)
    year = Column(Integer)
    doi = Column(String, nullable=True)
    abstract = Column(String, nullable=True)
