from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..database import get_db
from ..models.profile import Profile as ProfileModel
from ..schemas.profile import Profile

router = APIRouter()

@router.get("/profile", response_model=Profile)
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(ProfileModel).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.post("/profile", response_model=Profile)
def create_profile(profile: Profile, db: Session = Depends(get_db)):
    db_profile = ProfileModel(
        name=profile.name,
        title=profile.title,
        tagline=profile.tagline,
        academic_background=profile.academic_background
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.put("/profile", response_model=Profile)
def update_profile(profile: Profile, db: Session = Depends(get_db)):
    db_profile = db.query(ProfileModel).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    db_profile.name = profile.name
    db_profile.title = profile.title
    db_profile.tagline = profile.tagline
    db_profile.academic_background = profile.academic_background
    
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.delete("/profile", response_model=dict)
async def delete_profile(db: Session = Depends(get_db)):
    db_profile = db.query(ProfileModel).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    db.delete(db_profile)
    db.commit()
    return {"message": "Profile deleted successfully"}
