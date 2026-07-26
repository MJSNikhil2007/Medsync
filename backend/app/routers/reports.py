import json
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, ReportLog
from app.schemas import ReportResponse
from app.auth import get_current_user
from app.services.report_analyzer import ReportAnalyzer

router = APIRouter()

@router.post("/analyze", response_model=ReportResponse)
async def analyze_report(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify file extension
    file_name = file.filename
    file_name_lower = file_name.lower()
    if not (file_name_lower.endswith(".pdf") or file_name_lower.endswith(".png") or 
            file_name_lower.endswith(".jpg") or file_name_lower.endswith(".jpeg")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload a PDF or an Image (PNG, JPG)."
        )

    # Read bytes
    try:
        file_bytes = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read upload file: {str(e)}"
        )

    # Perform text extraction
    text = ReportAnalyzer.extract_text(file_bytes, file_name)
    
    # Perform text analysis
    analysis = ReportAnalyzer.analyze(text)

    # Save to database
    db_log = ReportLog(
        user_id=current_user.id,
        file_name=file_name,
        extracted_text=text,
        summary=analysis["summary"],
        metrics=json.dumps(analysis["metrics"]),
        explanations=json.dumps(analysis["explanations"])
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)

    # Structure data for response schema
    response_data = {
        "id": db_log.id,
        "user_id": db_log.user_id,
        "file_name": db_log.file_name,
        "summary": db_log.summary,
        "metrics": json.loads(db_log.metrics),
        "explanations": json.loads(db_log.explanations),
        "created_at": db_log.created_at
    }
    return response_data

@router.get("/history", response_model=List[ReportResponse])
def get_reports_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logs = db.query(ReportLog).filter(ReportLog.user_id == current_user.id).order_by(ReportLog.created_at.desc()).all()
    
    response_logs = []
    for log in logs:
        response_logs.append({
            "id": log.id,
            "user_id": log.user_id,
            "file_name": log.file_name,
            "summary": log.summary,
            "metrics": json.loads(log.metrics),
            "explanations": json.loads(log.explanations),
            "created_at": log.created_at
        })
    return response_logs
