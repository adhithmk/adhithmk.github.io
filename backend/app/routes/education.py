from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..database import get_db
from ..models.education import Education as EducationModel
from ..schemas.education import Education

router = APIRouter()

@router.get("/education", response_model=List[Education])
def get_education(db: Session = Depends(get_db)):
    education = db.query(EducationModel).all()
    return education

@router.get("/education/{edu_id}", response_model=Education)
def get_education(edu_id: int, db: Session = Depends(get_db)):
    edu = db.query(EducationModel).filter(EducationModel.id == edu_id).first()
    if not edu:
        raise HTTPException(status_code=404, detail="Education entry not found")
    return edu

@router.post("/education", response_model=Education)
def create_education(edu: Education, db: Session = Depends(get_db)):
    db_edu = EducationModel(
        institution=edu.institution,
        degree=edu.degree,
        field_of_study=edu.field_of_study,
        start_date=edu.start_date,
        end_date=edu.end_date,
        description=edu.description
    )
    db.add(db_edu)
    db.commit()
    db.refresh(db_edu)
    return db_edu

@router.put("/education/{edu_id}", response_model=Education)
def update_education(edu_id: int, edu: Education, db: Session = Depends(get_db)):
    db_edu = db.query(EducationModel).filter(EducationModel.id == edu_id).first()
    if not db_edu:
        raise HTTPException(status_code=404, detail="Education entry not found")
    
    db_edu.institution = edu.institution
    db_edu.degree = edu.degree
    db_edu.field_of_study = edu.field_of_study
    db_edu.start_date = edu.start_date
    db_edu.end_date = edu.end_date
    db_edu.description = edu.description
    
    db.commit()
    db.refresh(db_edu)
    return db_edu

@router.delete("/education/{edu_id}")
def delete_education(edu_id: int, db: Session = Depends(get_db)):
    db_edu = db.query(EducationModel).filter(EducationModel.id == edu_id).first()
    if not db_edu:
        raise HTTPException(status_code=404, detail="Education entry not found")
    
    db.delete(db_edu)
    db.commit()
    return {"detail": "Education entry deleted successfully"}
