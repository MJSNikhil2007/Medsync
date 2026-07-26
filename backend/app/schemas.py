from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Auth Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=1)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[int] = None

# Symptom Checker Schemas
class SymptomCheckRequest(BaseModel):
    symptoms: List[str]
    duration_days: int = Field(..., ge=1)
    age: int = Field(..., ge=1, le=120)
    gender: str = Field(..., pattern="^(Male|Female|Other)$")
    additional_notes: Optional[str] = None

class SymptomLogResponse(BaseModel):
    id: int
    user_id: int
    symptoms: str
    duration_days: int
    severity: str
    diagnosis: str
    recommendations: List[str]
    additional_info: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Medical Report Schemas
class MetricDetail(BaseModel):
    name: str
    value: float
    unit: str
    reference_range: str
    status: str  # Normal, High, Low
    description: str

class TermExplanation(BaseModel):
    term: str
    meaning: str
    context: str

class ReportResponse(BaseModel):
    id: int
    user_id: int
    file_name: str
    summary: str
    metrics: List[MetricDetail]
    explanations: List[TermExplanation]
    created_at: datetime

    class Config:
        from_attributes = True

# Health Score Schemas
class HealthScoreRequest(BaseModel):
    sleep_hours: float = Field(..., ge=0.0, le=24.0)
    exercise_mins: int = Field(..., ge=0)
    water_ml: int = Field(..., ge=0)
    systolic_bp: int = Field(..., ge=50, le=250)
    diastolic_bp: int = Field(..., ge=30, le=150)
    heart_rate: int = Field(..., ge=30, le=220)
    weight_kg: float = Field(..., ge=10.0, le=300.0)
    height_cm: float = Field(..., ge=50.0, le=250.0)
    diet_quality: str = Field(..., pattern="^(Poor|Average|Good|Excellent)$")
    smoking_alcohol: str = Field(..., pattern="^(None|Occasional|Frequent)$")

class HealthScoreResponse(BaseModel):
    id: int
    user_id: int
    score: int
    sleep_hours: float
    exercise_mins: int
    water_ml: int
    systolic_bp: int
    diastolic_bp: int
    heart_rate: int
    weight_kg: float
    height_cm: float
    bmi: float
    diet_quality: str
    smoking_alcohol: str
    created_at: datetime

    class Config:
        from_attributes = True
