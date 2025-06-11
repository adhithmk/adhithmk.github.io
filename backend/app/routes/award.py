from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..database import get_db
from ..models.award import Award as AwardModel
from ..schemas.award import Award

router = APIRouter()

@router.get("/awards", response_model=List[Award])
def get_awards(db: Session = Depends(get_db)):
    awards = db.query(AwardModel).all()
    return awards

@router.get("/awards/{award_id}", response_model=Award)
def get_award(award_id: int, db: Session = Depends(get_db)):
    award = db.query(AwardModel).filter(AwardModel.id == award_id).first()
    if not award:
        raise HTTPException(status_code=404, detail="Award not found")
    return award

@router.post("/awards", response_model=Award)
def create_award(award: Award, db: Session = Depends(get_db)):
    db_award = AwardModel(
        title=award.title,
        organization=award.organization,
        date=award.date,
        description=award.description
    )
    db.add(db_award)
    db.commit()
    db.refresh(db_award)
    return db_award

@router.put("/awards/{award_id}", response_model=Award)
def update_award(award_id: int, award: Award, db: Session = Depends(get_db)):
    db_award = db.query(AwardModel).filter(AwardModel.id == award_id).first()
    if not db_award:
        raise HTTPException(status_code=404, detail="Award not found")
    
    db_award.title = award.title
    db_award.organization = award.organization
    db_award.date = award.date
    db_award.description = award.description
    
    db.commit()
    db.refresh(db_award)
    return db_award

@router.delete("/awards/{award_id}")
def delete_award(award_id: int, db: Session = Depends(get_db)):
    db_award = db.query(AwardModel).filter(AwardModel.id == award_id).first()
    if not db_award:
        raise HTTPException(status_code=404, detail="Award not found")
    
    db.delete(db_award)
    db.commit()
    return {"detail": "Award deleted successfully"}
