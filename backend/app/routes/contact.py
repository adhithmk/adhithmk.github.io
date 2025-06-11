from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..database import get_db
from ..models.contact import Contact as ContactModel
from ..schemas.contact import Contact

router = APIRouter()

@router.get("/contacts", response_model=List[Contact])
def get_contacts(db: Session = Depends(get_db)):
    contacts = db.query(ContactModel).all()
    return contacts

@router.get("/contacts/{contact_id}", response_model=Contact)
def get_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.query(ContactModel).filter(ContactModel.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact message not found")
    return contact

@router.post("/contacts", response_model=Contact)
def create_contact(contact: Contact, db: Session = Depends(get_db)):
    db_contact = ContactModel(
        name=contact.name,
        email=contact.email,
        subject=contact.subject,
        message=contact.message
    )
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

@router.delete("/contacts/{contact_id}")
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    db_contact = db.query(ContactModel).filter(ContactModel.id == contact_id).first()
    if not db_contact:
        raise HTTPException(status_code=404, detail="Contact message not found")
    
    db.delete(db_contact)
    db.commit()
    return {"detail": "Contact message deleted successfully"}
