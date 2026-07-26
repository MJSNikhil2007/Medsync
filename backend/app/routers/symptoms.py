import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, SymptomLog
from app.schemas import SymptomCheckRequest, SymptomLogResponse
from app.auth import get_current_user
from app.services.symptom_analyzer import SymptomAnalyzer

router = APIRouter()

@router.post("/analyze", response_model=SymptomLogResponse)
def analyze_symptoms(
    request: SymptomCheckRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Perform heuristic symptom analysis
    analysis = SymptomAnalyzer.analyze(
        symptoms=request.symptoms,
        duration_days=request.duration_days,
        age=request.age,
        gender=request.gender,
        notes=request.additional_notes
    )

    # Save to database
    db_log = SymptomLog(
        user_id=current_user.id,
        symptoms=analysis["symptoms"],
        duration_days=analysis["duration_days"],
        severity=analysis["severity"],
        diagnosis=analysis["diagnosis"],
        recommendations=json.dumps(analysis["recommendations"]),
        additional_info=json.dumps(analysis["additional_info"])
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)

    # Convert JSON strings to python structures for response schema
    response_data = {
        "id": db_log.id,
        "user_id": db_log.user_id,
        "symptoms": db_log.symptoms,
        "duration_days": db_log.duration_days,
        "severity": db_log.severity,
        "diagnosis": db_log.diagnosis,
        "recommendations": json.loads(db_log.recommendations),
        "additional_info": json.loads(db_log.additional_info) if db_log.additional_info else None,
        "created_at": db_log.created_at
    }
    return response_data

@router.get("/history", response_model=List[SymptomLogResponse])
def get_symptom_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logs = db.query(SymptomLog).filter(SymptomLog.user_id == current_user.id).order_by(SymptomLog.created_at.desc()).all()
    
    response_logs = []
    for log in logs:
        response_logs.append({
            "id": log.id,
            "user_id": log.user_id,
            "symptoms": log.symptoms,
            "duration_days": log.duration_days,
            "severity": log.severity,
            "diagnosis": log.diagnosis,
            "recommendations": json.loads(log.recommendations),
            "additional_info": json.loads(log.additional_info) if log.additional_info else None,
            "created_at": log.created_at
        })
    return response_logs
