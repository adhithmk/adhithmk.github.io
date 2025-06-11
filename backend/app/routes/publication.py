from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..database import get_db
from ..models.publication import Publication as PublicationModel
from ..schemas.publication import Publication

router = APIRouter()

@router.get("/publications", response_model=List[Publication])
def get_publications(db: Session = Depends(get_db)):
    publications = db.query(PublicationModel).all()
    return publications

@router.get("/publications/{pub_id}", response_model=Publication)
def get_publication(pub_id: int, db: Session = Depends(get_db)):
    pub = db.query(PublicationModel).filter(PublicationModel.id == pub_id).first()
    if not pub:
        raise HTTPException(status_code=404, detail="Publication not found")
    return pub

@router.post("/publications", response_model=Publication)
def create_publication(pub: Publication, db: Session = Depends(get_db)):
    db_pub = PublicationModel(
        title=pub.title,
        authors=pub.authors,
        journal=pub.journal,
        year=pub.year,
        doi=pub.doi,
        abstract=pub.abstract
    )
    db.add(db_pub)
    db.commit()
    db.refresh(db_pub)
    return db_pub

@router.put("/publications/{pub_id}", response_model=Publication)
def update_publication(pub_id: int, pub: Publication, db: Session = Depends(get_db)):
    db_pub = db.query(PublicationModel).filter(PublicationModel.id == pub_id).first()
    if not db_pub:
        raise HTTPException(status_code=404, detail="Publication not found")
    
    db_pub.title = pub.title
    db_pub.authors = pub.authors
    db_pub.journal = pub.journal
    db_pub.year = pub.year
    db_pub.doi = pub.doi
    db_pub.abstract = pub.abstract
    
    db.commit()
    db.refresh(db_pub)
    return db_pub

@router.delete("/publications/{pub_id}")
def delete_publication(pub_id: int, db: Session = Depends(get_db)):
    db_pub = db.query(PublicationModel).filter(PublicationModel.id == pub_id).first()
    if not db_pub:
        raise HTTPException(status_code=404, detail="Publication not found")
    
    db.delete(db_pub)
    db.commit()
    return {"detail": "Publication deleted successfully"}
