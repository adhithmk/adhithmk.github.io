from sqlalchemy import Column, Integer, String, Date
from ..database import Base

class Blog(Base):
    __tablename__ = "blogs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)
    date = Column(Date)
    category = Column(String)
    tags = Column(String)  # Will store as comma-separated string
    image_url = Column(String, nullable=True)
