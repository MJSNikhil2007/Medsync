import os
import sys

# Ensure backend directory is in python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_workflow():
    print("Starting MediVision AI API Workflow tests...")

    # 1. Clean data.db if it exists to have a fresh state
    # (Optional, since SQLite file will be created/appended)

    # 2. Register user
    register_payload = {
        "email": "doctor@medivision.ai",
        "password": "securepassword123",
        "full_name": "Dr. Alex Carter"
    }
    print("\n[TEST] Registering user...")
    response = client.post("/api/auth/register", json=register_payload)
    if response.status_code == 201:
        print("SUCCESS: User registered:", response.json())
    elif response.status_code == 400 and "already registered" in response.json().get("detail", ""):
        print("INFO: User already registered. Proceeding.")
    else:
        print("FAILURE: Registration failed:", response.status_code, response.text)
        return

    # 3. Login user
    login_payload = {
        "email": "doctor@medivision.ai",
        "password": "securepassword123"
    }
    print("\n[TEST] Logging in user...")
    response = client.post("/api/auth/login", json=login_payload)
    assert response.status_code == 200, f"Login failed: {response.text}"
    token_data = response.json()
    token = token_data["access_token"]
    print("SUCCESS: Token acquired")

    headers = {"Authorization": f"Bearer {token}"}

    # 4. Get Current User profile
    print("\n[TEST] Retrieving current user profile...")
    response = client.get("/api/auth/me", headers=headers)
    assert response.status_code == 200, f"Get current user failed: {response.text}"
    print("SUCCESS: Logged in user detail:", response.json())

    # 5. Symptom Analyzer
    symptom_payload = {
        "symptoms": ["chest pain", "shortness of breath", "dizziness"],
        "duration_days": 2,
        "age": 45,
        "gender": "Male",
        "additional_notes": "Felt a heavy sensation in chest after climbing stairs."
    }
    print("\n[TEST] Testing Symptom Analyzer...")
    response = client.post("/api/symptoms/analyze", json=symptom_payload, headers=headers)
    assert response.status_code == 200, f"Symptom check failed: {response.text}"
    symptom_result = response.json()
    print("SUCCESS: Suspended Diagnosis:", symptom_result["diagnosis"])
    print("Severity level:", symptom_result["severity"])

    # 6. Retrieve Symptom History
    print("\n[TEST] Retrieving Symptom History...")
    response = client.get("/api/symptoms/history", headers=headers)
    assert response.status_code == 200, f"Symptom history retrieve failed: {response.text}"
    print("SUCCESS: Logs count in history:", len(response.json()))

    # 7. Health Score Calculator
    health_payload = {
        "sleep_hours": 7.5,
        "exercise_mins": 45,
        "water_ml": 2500,
        "systolic_bp": 120,
        "diastolic_bp": 80,
        "heart_rate": 68,
        "weight_kg": 72.5,
        "height_cm": 178.0,
        "diet_quality": "Good",
        "smoking_alcohol": "None"
    }
    print("\n[TEST] Testing Health Score Calculator...")
    response = client.post("/api/health-score", json=health_payload, headers=headers)
    assert response.status_code == 200, f"Health score calculation failed: {response.text}"
    health_result = response.json()
    print("SUCCESS: Health Score calculated:", health_result["score"])
    print("BMI calculated:", health_result["bmi"])
    print("Breakdown:", health_result["breakdown"])

    # 8. Retrieve Health Score History
    print("\n[TEST] Retrieving Health Score History...")
    response = client.get("/api/health-score/history", headers=headers)
    assert response.status_code == 200, f"Health score history retrieve failed: {response.text}"
    print("SUCCESS: Logs count in history:", len(response.json()))

    # 9. Medical Report Analyzer (using multipart file upload)
    print("\n[TEST] Testing Medical Report Analyzer (with simulated file upload)...")
    
    # Create a small simulated file
    mock_file_content = b"LIPID PANEL REPORT\nTotal Cholesterol: 245 mg/dL\nLDL Cholesterol: 145 mg/dL\nHDL Cholesterol: 38 mg/dL\nTriglycerides: 180 mg/dL"
    
    files = {"file": ("lipid_panel_report.pdf", mock_file_content, "application/pdf")}
    response = client.post("/api/reports/analyze", files=files, headers=headers)
    assert response.status_code == 200, f"Report analysis failed: {response.text}"
    report_result = response.json()
    print("SUCCESS: Report Summary:", report_result["summary"])
    print("Metrics detected count:", len(report_result["metrics"]))
    print("Explanations count:", len(report_result["explanations"]))

    # 10. Retrieve Report History
    print("\n[TEST] Retrieving Report History...")
    response = client.get("/api/reports/history", headers=headers)
    assert response.status_code == 200, f"Report history retrieve failed: {response.text}"
    print("SUCCESS: Logs count in history:", len(response.json()))

    print("\nALL TESTS COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    test_workflow()
