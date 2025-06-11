from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from .. import models, schemas
from ..database import get_db
from ..models import field_experience

router = APIRouter()

@router.get("/field-experiences", response_model=List[schemas.FieldExperience])
def get_field_experiences(db: Session = Depends(get_db)):
    experiences = db.query(models.FieldExperience).all()
    return experiences

@router.get("/field-experiences/{exp_id}", response_model=schemas.FieldExperience)
def get_field_experience(exp_id: int, db: Session = Depends(get_db)):
    exp = db.query(models.FieldExperience).filter(models.FieldExperience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Field experience not found")
    return exp

@router.post("/field-experiences", response_model=schemas.FieldExperience)
def create_field_experience(exp: schemas.FieldExperience, db: Session = Depends(get_db)):
    db_exp = models.FieldExperience(
        title=exp.title,
        description=exp.description,
        location=exp.location,
        start_date=exp.start_date,
        end_date=exp.end_date,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return db_exp

@router.put("/field-experiences/{exp_id}", response_model=schemas.FieldExperience)
def update_field_experience(exp_id: int, exp: schemas.FieldExperience, db: Session = Depends(get_db)):
    db_exp = db.query(models.FieldExperience).filter(models.FieldExperience.id == exp_id).first()
    if not db_exp:
        raise HTTPException(status_code=404, detail="Field experience not found")
    
    db_exp.title = exp.title
    db_exp.description = exp.description
    db_exp.location = exp.location
    db_exp.start_date = exp.start_date
    db_exp.end_date = exp.end_date
    db_exp.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_exp)
    return db_exp

@router.delete("/field-experiences/{exp_id}")
def delete_field_experience(exp_id: int, db: Session = Depends(get_db)):
    db_exp = db.query(models.FieldExperience).filter(models.FieldExperience.id == exp_id).first()
    if not db_exp:
        raise HTTPException(status_code=404, detail="Field experience not found")
    
    db.delete(db_exp)
    db.commit()
    return {"message": "Field experience deleted successfully"}
