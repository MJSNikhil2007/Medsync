import datetime
from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    symptom_logs = relationship("SymptomLog", back_populates="user", cascade="all, delete-orphan")
    report_logs = relationship("ReportLog", back_populates="user", cascade="all, delete-orphan")
    health_score_logs = relationship("HealthScoreLog", back_populates="user", cascade="all, delete-orphan")


class SymptomLog(Base):
    __tablename__ = "symptom_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    symptoms = Column(String, nullable=False)  # JSON or comma-separated list
    duration_days = Column(Integer, nullable=False)
    severity = Column(String, nullable=False)  # Low, Medium, High, Critical
    diagnosis = Column(String, nullable=False)  # Primary suspected condition
    recommendations = Column(Text, nullable=False)  # JSON list of recommendations
    additional_info = Column(Text, nullable=True)  # JSON map of additional details
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="symptom_logs")


class ReportLog(Base):
    __tablename__ = "report_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_name = Column(String, nullable=False)
    extracted_text = Column(Text, nullable=True)
    summary = Column(Text, nullable=False)
    metrics = Column(Text, nullable=False)  # JSON representing key metrics found (name, value, unit, reference, status)
    explanations = Column(Text, nullable=False)  # JSON representing key medical terms explained
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="report_logs")


class HealthScoreLog(Base):
    __tablename__ = "health_score_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    score = Column(Integer, nullable=False)
    sleep_hours = Column(Float, nullable=False)
    exercise_mins = Column(Integer, nullable=False)
    water_ml = Column(Integer, nullable=False)
    systolic_bp = Column(Integer, nullable=False)
    diastolic_bp = Column(Integer, nullable=False)
    heart_rate = Column(Integer, nullable=False)
    weight_kg = Column(Float, nullable=False)
    height_cm = Column(Float, nullable=False)
    bmi = Column(Float, nullable=False)
    diet_quality = Column(String, nullable=False)
    smoking_alcohol = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="health_score_logs")
