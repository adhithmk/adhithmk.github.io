from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..database import get_db
from ..models.extracurricular import Extracurricular as ExtracurricularModel
from ..schemas.extracurricular import Extracurricular

router = APIRouter()

@router.get("/extracurriculars", response_model=List[Extracurricular])
def get_extracurriculars(db: Session = Depends(get_db)):
    extracurriculars = db.query(ExtracurricularModel).all()
    return extracurriculars

@router.get("/extracurriculars/{extra_id}", response_model=Extracurricular)
def get_extracurricular(extra_id: int, db: Session = Depends(get_db)):
    extra = db.query(ExtracurricularModel).filter(ExtracurricularModel.id == extra_id).first()
    if not extra:
        raise HTTPException(status_code=404, detail="Extracurricular activity not found")
    return extra

@router.post("/extracurriculars", response_model=Extracurricular)
def create_extracurricular(extra: Extracurricular, db: Session = Depends(get_db)):
    db_extra = ExtracurricularModel(
        title=extra.title,
        description=extra.description,
        start_date=extra.start_date,
        end_date=extra.end_date,
        organization=extra.organization
    )
    db.add(db_extra)
    db.commit()
    db.refresh(db_extra)
    return db_extra

@router.put("/extracurriculars/{extra_id}", response_model=Extracurricular)
def update_extracurricular(extra_id: int, extra: Extracurricular, db: Session = Depends(get_db)):
    db_extra = db.query(ExtracurricularModel).filter(ExtracurricularModel.id == extra_id).first()
    if not db_extra:
        raise HTTPException(status_code=404, detail="Extracurricular activity not found")
    
    db_extra.title = extra.title
    db_extra.description = extra.description
    db_extra.start_date = extra.start_date
    db_extra.end_date = extra.end_date
    db_extra.organization = extra.organization
    
    db.commit()
    db.refresh(db_extra)
    return db_extra

@router.delete("/extracurriculars/{extra_id}")
def delete_extracurricular(extra_id: int, db: Session = Depends(get_db)):
    db_extra = db.query(ExtracurricularModel).filter(ExtracurricularModel.id == extra_id).first()
    if not db_extra:
        raise HTTPException(status_code=404, detail="Extracurricular activity not found")
    
    db.delete(db_extra)
    db.commit()
    return {"detail": "Extracurricular activity deleted successfully"}
