from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.profile import router as profile_router
from app.routes.certification import router as certification_router
from app.routes.education import router as education_router
from app.routes.award import router as award_router
from app.routes.publication import router as publication_router
from app.routes.blog import router as blog_router
from app.routes.project import router as project_router
from app.routes.extracurricular import router as extracurricular_router
from app.routes.contact import router as contact_router
from app.routes.trends import router as trends_router

from fastapi.staticfiles import StaticFiles

app = FastAPI( 
    title="Academic Website API",
    description="API for managing academic website content",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(profile_router, prefix="/api", tags=["profile"])
app.include_router(certification_router, prefix="/api", tags=["certification"])
app.include_router(education_router, prefix="/api", tags=["education"])
app.include_router(award_router, prefix="/api", tags=["award"])
app.include_router(publication_router, prefix="/api", tags=["publication"])
app.include_router(blog_router, prefix="/api", tags=["blog"])
app.include_router(project_router, prefix="/api", tags=["project"])
app.include_router(extracurricular_router, prefix="/api", tags=["extracurricular"])
app.include_router(contact_router, prefix="/api", tags=["contact"])
app.include_router(trends_router, prefix="/api", tags=["trends"])



@app.get("/") 
def read_root():
    return {"message": "Welcome to the Academic Website API"}
