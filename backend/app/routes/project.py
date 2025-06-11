from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..database import get_db
from ..models.project import Project as ProjectModel
from ..schemas.project import Project

router = APIRouter()

@router.get("/projects", response_model=List[Project])
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(ProjectModel).all()
    return projects

@router.get("/projects/{project_id}", response_model=Project)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/projects", response_model=Project)
def create_project(project: Project, db: Session = Depends(get_db)):
    db_project = ProjectModel(
        title=project.title,
        description=project.description,
        start_date=project.start_date,
        end_date=project.end_date,
        technologies=",".join(project.technologies),
        github_url=project.github_url,
        demo_url=project.demo_url
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.put("/projects/{project_id}", response_model=Project)
def update_project(project_id: int, project: Project, db: Session = Depends(get_db)):
    db_project = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db_project.title = project.title
    db_project.description = project.description
    db_project.start_date = project.start_date
    db_project.end_date = project.end_date
    db_project.technologies = ",".join(project.technologies)
    db_project.github_url = project.github_url
    db_project.demo_url = project.demo_url
    
    db.commit()
    db.refresh(db_project)
    return db_project

@router.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    db_project = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(db_project)
    db.commit()
    return {"detail": "Project deleted successfully"}
