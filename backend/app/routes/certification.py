from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..database import get_db
from ..models.certification import Certification as CertificationModel
from ..schemas.certification import Certification  # Importing the Pydantic model

router = APIRouter()

@router.get("/certifications", response_model=List[Certification])
def get_certifications(db: Session = Depends(get_db)):
    certifications = db.query(CertificationModel).all()
    return certifications

@router.get("/certifications/{cert_id}", response_model=Certification)
def get_certification(cert_id: int, db: Session = Depends(get_db)):
    cert = db.query(CertificationModel).filter(CertificationModel.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certification not found")
    return cert

@router.post("/certifications", response_model=Certification)
def create_certification(cert: Certification, db: Session = Depends(get_db)):
    db_cert = CertificationModel(
        name=cert.name,
        organization=cert.organization,
        icon=cert.icon,
        obtained_date=cert.obtained_date,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_cert)
    db.commit()
    db.refresh(db_cert)
    return db_cert

@router.put("/certifications/{cert_id}", response_model=Certification)
def update_certification(cert_id: int, cert: Certification, db: Session = Depends(get_db)):
    db_cert = db.query(CertificationModel).filter(CertificationModel.id == cert_id).first()
    if not db_cert:
        raise HTTPException(status_code=404, detail="Certification not found")
    
    db_cert.name = cert.name
    db_cert.organization = cert.organization
    db_cert.icon = cert.icon
    db_cert.obtained_date = cert.obtained_date
    db_cert.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_cert)
    return db_cert

@router.delete("/certifications/{cert_id}")
def delete_certification(cert_id: int, db: Session = Depends(get_db)):
    db_cert = db.query(CertificationModel).filter(CertificationModel.id == cert_id).first()
    if not db_cert:
        raise HTTPException(status_code=404, detail="Certification not found")
    
    db.delete(db_cert)
    db.commit()
    return {"message": "Certification deleted successfully"}

@router.get("/certifications/crud", response_model=List[Certification])
async def get_certifications_crud(db: Session = Depends(get_db)):
    return db.query(CertificationModel).all()

@router.post("/certifications/crud", response_model=Certification)
async def create_certification_crud(certification: Certification, db: Session = Depends(get_db)):
    db_certification = CertificationModel(**certification.dict())
    db.add(db_certification)
    db.commit()
    db.refresh(db_certification)
    return db_certification

@router.put("/certifications/crud/{certification_id}", response_model=Certification)
async def update_certification_crud(certification_id: int, certification: Certification, db: Session = Depends(get_db)):
    db_certification = db.query(CertificationModel).filter(CertificationModel.id == certification_id).first()
    if not db_certification:
        raise HTTPException(status_code=404, detail="Certification not found")
    
    for key, value in certification.dict().items():
        setattr(db_certification, key, value)
    
    db.commit()
    db.refresh(db_certification)
    return db_certification

@router.delete("/certifications/crud/{certification_id}", response_model=dict)
async def delete_certification_crud(certification_id: int, db: Session = Depends(get_db)):
    db_certification = db.query(CertificationModel).filter(CertificationModel.id == certification_id).first()
    if not db_certification:
        raise HTTPException(status_code=404, detail="Certification not found")
    
    db.delete(db_certification)
    db.commit()
    return {"message": "Certification deleted successfully"}
