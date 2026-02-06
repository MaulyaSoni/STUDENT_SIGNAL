from fastapi import APIRouter
from app.database import students_collection
from app.services.risk_engine import calculate_risk
from app.services.ml_model import predict_dropout

router = APIRouter(prefix="/analyze-risk")

@router.post("")
def analyze():
    students = students_collection.find()

    for s in students:
        rule_score = calculate_risk(s)
        ml_prob = predict_dropout(
            s["attendance"],
            s["consecutive_absences"]
        )

        level = "Low"
        if rule_score >= 3 or ml_prob > 0.7:
            level = "High"
        elif rule_score == 2:
            level = "Medium"

        students_collection.update_one(
            {"student_id": s["student_id"]},
            {"$set": {
                "risk": {
                    "rule_score": rule_score,
                    "ml_probability": ml_prob,
                    "level": level
                }
            }}
        )

    return {"message": "Risk analysis completed"}
