from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from .. import models, schemas
from ..database import get_db
from ..models import research

router = APIRouter()

@router.get("/research/projects", response_model=List[schemas.Project])
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(models.Project).all()
    return projects

@router.get("/research/projects/{project_id}", response_model=schemas.Project)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/research/projects", response_model=schemas.Project)
def create_project(project: schemas.Project, db: Session = Depends(get_db)):
    db_project = models.Project(
        title=project.title,
        description=project.description,
        image_url=project.image_url,
        tags=project.tags,
        start_date=project.start_date,
        end_date=project.end_date,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.put("/research/projects/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, project: schemas.Project, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db_project.title = project.title
    db_project.description = project.description
    db_project.image_url = project.image_url
    db_project.tags = project.tags
    db_project.start_date = project.start_date
    db_project.end_date = project.end_date
    db_project.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_project)
    return db_project

@router.delete("/research/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(db_project)
    db.commit()
    return {"message": "Project deleted successfully"}
