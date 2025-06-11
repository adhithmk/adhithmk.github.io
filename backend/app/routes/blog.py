from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..database import get_db
from ..models.blog import Blog as BlogModel
from ..schemas.blog import Blog

router = APIRouter()

@router.get("/blogs", response_model=List[Blog])
def get_blogs(db: Session = Depends(get_db)):
    blogs = db.query(BlogModel).all()
    return blogs

@router.get("/blogs/{blog_id}", response_model=Blog)
def get_blog(blog_id: int, db: Session = Depends(get_db)):
    blog = db.query(BlogModel).filter(BlogModel.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return blog

@router.post("/blogs", response_model=Blog)
def create_blog(blog: Blog, db: Session = Depends(get_db)):
    db_blog = BlogModel(
        title=blog.title,
        content=blog.content,
        date=blog.date,
        category=blog.category,
        tags=",".join(blog.tags),
        image_url=blog.image_url
    )
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return db_blog

@router.put("/blogs/{blog_id}", response_model=Blog)
def update_blog(blog_id: int, blog: Blog, db: Session = Depends(get_db)):
    db_blog = db.query(BlogModel).filter(BlogModel.id == blog_id).first()
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    db_blog.title = blog.title
    db_blog.content = blog.content
    db_blog.date = blog.date
    db_blog.category = blog.category
    db_blog.tags = ",".join(blog.tags)
    db_blog.image_url = blog.image_url
    
    db.commit()
    db.refresh(db_blog)
    return db_blog

@router.delete("/blogs/{blog_id}")
def delete_blog(blog_id: int, db: Session = Depends(get_db)):
    db_blog = db.query(BlogModel).filter(BlogModel.id == blog_id).first()
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    db.delete(db_blog)
    db.commit()
    return {"detail": "Blog post deleted successfully"}
