from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models import User, HealthScoreLog
from app.schemas import HealthScoreRequest, HealthScoreResponse
from app.auth import get_current_user
from app.services.health_calculator import HealthCalculator

router = APIRouter()

# Let's create an extended schema mapping for response with breakdown & tips
class DetailedHealthScoreResponse(HealthScoreResponse):
    status: str
    breakdown: Dict[str, int]
    tips: List[str]

@router.post("", response_model=DetailedHealthScoreResponse)
def create_health_score(
    request: HealthScoreRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Calculate score metrics
    analysis = HealthCalculator.calculate(
        sleep_hours=request.sleep_hours,
        exercise_mins=request.exercise_mins,
        water_ml=request.water_ml,
        systolic_bp=request.systolic_bp,
        diastolic_bp=request.diastolic_bp,
        heart_rate=request.heart_rate,
        weight_kg=request.weight_kg,
        height_cm=request.height_cm,
        diet_quality=request.diet_quality,
        smoking_alcohol=request.smoking_alcohol
    )

    # Save to database
    db_log = HealthScoreLog(
        user_id=current_user.id,
        score=analysis["score"],
        sleep_hours=request.sleep_hours,
        exercise_mins=request.exercise_mins,
        water_ml=request.water_ml,
        systolic_bp=request.systolic_bp,
        diastolic_bp=request.diastolic_bp,
        heart_rate=request.heart_rate,
        weight_kg=request.weight_kg,
        height_cm=request.height_cm,
        bmi=analysis["bmi"],
        diet_quality=request.diet_quality,
        smoking_alcohol=request.smoking_alcohol
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)

    return {
        "id": db_log.id,
        "user_id": db_log.user_id,
        "score": db_log.score,
        "sleep_hours": db_log.sleep_hours,
        "exercise_mins": db_log.exercise_mins,
        "water_ml": db_log.water_ml,
        "systolic_bp": db_log.systolic_bp,
        "diastolic_bp": db_log.diastolic_bp,
        "heart_rate": db_log.heart_rate,
        "weight_kg": db_log.weight_kg,
        "height_cm": db_log.height_cm,
        "bmi": db_log.bmi,
        "diet_quality": db_log.diet_quality,
        "smoking_alcohol": db_log.smoking_alcohol,
        "created_at": db_log.created_at,
        "status": analysis["status"],
        "breakdown": analysis["breakdown"],
        "tips": analysis["tips"]
    }

@router.get("/history", response_model=List[DetailedHealthScoreResponse])
def get_health_score_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logs = db.query(HealthScoreLog).filter(HealthScoreLog.user_id == current_user.id).order_by(HealthScoreLog.created_at.desc()).all()
    
    response_list = []
    for log in logs:
        # Re-calculate analysis parameters for reporting
        analysis = HealthCalculator.calculate(
            sleep_hours=log.sleep_hours,
            exercise_mins=log.exercise_mins,
            water_ml=log.water_ml,
            systolic_bp=log.systolic_bp,
            diastolic_bp=log.diastolic_bp,
            heart_rate=log.heart_rate,
            weight_kg=log.weight_kg,
            height_cm=log.height_cm,
            diet_quality=log.diet_quality,
            smoking_alcohol=log.smoking_alcohol
        )
        response_list.append({
            "id": log.id,
            "user_id": log.user_id,
            "score": log.score,
            "sleep_hours": log.sleep_hours,
            "exercise_mins": log.exercise_mins,
            "water_ml": log.water_ml,
            "systolic_bp": log.systolic_bp,
            "diastolic_bp": log.diastolic_bp,
            "heart_rate": log.heart_rate,
            "weight_kg": log.weight_kg,
            "height_cm": log.height_cm,
            "bmi": log.bmi,
            "diet_quality": log.diet_quality,
            "smoking_alcohol": log.smoking_alcohol,
            "created_at": log.created_at,
            "status": analysis["status"],
            "breakdown": analysis["breakdown"],
            "tips": analysis["tips"]
        })
    return response_list
