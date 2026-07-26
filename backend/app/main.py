from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import auth, symptoms, reports, health_score

# Create database tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for MediVision AI Healthcare application",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(symptoms.router, prefix="/api/symptoms", tags=["Symptom Analysis"])
app.include_router(reports.router, prefix="/api/reports", tags=["Medical Report Analysis"])
app.include_router(health_score.router, prefix="/api/health-score", tags=["Health Score Tracker"])

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "message": "Welcome to the MediVision AI Healthcare API. Use /docs to view documentation."
    }
