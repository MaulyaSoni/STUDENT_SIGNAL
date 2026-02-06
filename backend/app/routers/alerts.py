from fastapi import APIRouter
from app.services.email_service import send_alert

router = APIRouter(prefix="/send-alerts")

@router.post("")
def send():
    send_alert("mentor@example.com", "S101", "High")
    return {"message": "Alert sent"}
