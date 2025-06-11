from pydantic import BaseModel

class Profile(BaseModel):
    id: int
    name: str
    title: str
    tagline: str
    subtitle: str
    about_text: str
    academic_background: str
    skills: str  # Assuming skills are stored as a JSON string

    class Config:
        from_attributes = True  # Updated to reflect Pydantic V2 changes

class Award(BaseModel):
    id: int
    name: str
    organization: str
    icon: str
    obtained_date: str  # Assuming this is a string representation of the date

    class Config:
        from_attributes = True  # Updated to reflect Pydantic V2 changes

class Education(BaseModel):
    id: int
    degree: str
    institution: str
    start_date: str  # Assuming this is a string representation of the date
    end_date: str    # Assuming this is a string representation of the date

    class Config:
        from_attributes = True  # Updated to reflect Pydantic V2 changes

class Publication(BaseModel):  # Adding the Publication Pydantic model
    id: int
    title: str
    author: str
    published_date: str  # Assuming this is a string representation of the date
    content: str  # Assuming this is the content of the publication

    class Config:
        from_attributes = True  # Updated to reflect Pydantic V2 changes

class Certification(BaseModel):  # Adding the Certification Pydantic model
    id: int
    name: str
    organization: str
    icon: str
    obtained_date: str  # Assuming this is a string representation of the date

    class Config:
        from_attributes = True  # Updated to reflect Pydantic V2 changes

class BlogPost(BaseModel):  # Adding the BlogPost Pydantic model
    id: int
    title: str
    content: str
    author: str
    published_date: str  # Assuming this is a string representation of the date

    class Config:
        from_attributes = True  # Updated to reflect Pydantic V2 changes

class BlogPostCreate(BaseModel):  # Adding the BlogPostCreate Pydantic model
    title: str
    content: str
    author: str
    published_date: str  # Assuming this is a string representation of the date

    class Config:
        from_attributes = True  # Updated to reflect Pydantic V2 changes

class Project(BaseModel):  # Adding the Project Pydantic model
    id: int
    title: str
    description: str
    technologies: list  # Assuming this is a list of technologies
    duration: str
    status: str  # 'Ongoing' or 'Completed'

    class Config:
        from_attributes = True  # Updated to reflect Pydantic V2 changes

class ProjectCreate(BaseModel):  # Adding the ProjectCreate Pydantic model
    title: str
    description: str
    technologies: list  # Assuming this is a list of technologies
    duration: str
    status: str  # 'Ongoing' or 'Completed'

    class Config:
        from_attributes = True  # Updated to reflect Pydantic V2 changes

class ExtraCurricular(BaseModel):  # Adding the ExtraCurricular Pydantic model
    id: int
    name: str
    role: str
    duration: str
    description: str

    class Config:
        from_attributes = True  # Updated to reflect Pydantic V2 changes

class ExtraCurricularCreate(BaseModel):  # Adding the ExtraCurricularCreate Pydantic model
    name: str
    role: str
    duration: str
    description: str

    class Config:
        from_attributes = True  # Updated to reflect Pydantic V2 changes

class ContactInfo(BaseModel):  # Adding the ContactInfo Pydantic model
    id: int
    email: str
    phone: str
    location: str
    social_links: dict  # Assuming social_links is a JSON object

    class Config:
        from_attributes = True  # Updated to reflect Pydantic V2 changes

class ContactInfoCreate(BaseModel):  # Adding the ContactInfoCreate Pydantic model
    email: str
    phone: str
    location: str
    social_links: dict  # Assuming social_links is a JSON object

    class Config:
        from_attributes = True  # Updated to reflect Pydantic V2 changes
