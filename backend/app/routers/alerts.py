from fastapi import APIRouter, HTTPException
from app.services.email_service import send_alert
from app.database import students_collection
from typing import List
import traceback

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.post("/send")
async def send_alerts(risk_level: str = "high"):
    """Send alerts to mentors for high-risk students"""
    try:
        # Find students with specified risk level
        query = {"risk_level": risk_level.lower()}
        students = list(students_collection.find(query))
        
        if not students:
            return {
                "message": f"No {risk_level} risk students found",
                "alerts_sent": 0
            }
        
        alerts_sent = 0
        
        for student in students:
            try:
                student_id = student.get("student_id", "Unknown")
                name = student.get("name", "Unknown")
                email = "mentor@example.com"  # Replace with actual mentor email logic
                
                send_alert(email, student_id, risk_level, name)
                alerts_sent += 1
            except Exception as e:
                print(f"Failed to send alert for student {student_id}: {str(e)}")
                continue
        
        return {
            "message": f"Alerts sent for {risk_level} risk students",
            "total_students": len(students),
            "alerts_sent": alerts_sent
        }
    
    except Exception as e:
        print(f"Error sending alerts: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_alerts():
    """Get all alert-worthy students (high risk)"""
    try:
        students = list(students_collection.find({"risk_level": "high"}))
        
        alerts = []
        for student in students:
            alerts.append({
                "student_id": student.get("student_id"),
                "name": student.get("name"),
                "department": student.get("department"),
                "dropout_probability": student.get("dropout_probability", 0),
                "risk_factors": student.get("risk_factors", []),
                "attendance": student.get("attendance", 0)
            })
        
        return {
            "total_alerts": len(alerts),
            "students": alerts
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        raise HTTPException(status_code=500, detail=str(e))
