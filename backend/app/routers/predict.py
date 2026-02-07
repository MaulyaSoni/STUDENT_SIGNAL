"""
Prediction Router
Handles single student prediction requests
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List

from app.ml.predict import predict_dropout

router = APIRouter(prefix="/predict", tags=["Prediction"])


class PredictionRequest(BaseModel):
    """Request model for student prediction"""

    attendance: float = Field(..., ge=0, le=100, description="Attendance percentage (0-100)")
    internal_marks: float = Field(75, ge=0, le=100, description="Internal marks (0-100)")
    backlogs: int = Field(0, ge=0, description="Number of backlogs")
    study_hours: float = Field(4, ge=0, le=24, description="Daily study hours")
    previous_failures: int = Field(0, ge=0, description="Number of previous failures")

    class Config:
        json_schema_extra = {
            "example": {
                "attendance": 65.5,
                "internal_marks": 55,
                "backlogs": 2,
                "study_hours": 3,
                "previous_failures": 1,
            }
        }


class PredictionResponse(BaseModel):
    """Response model for prediction"""

    dropout_probability: float
    risk_level: str
    prediction: int
    risk_factors: List[str]
    confidence: str
    recommendations: List[str]


@router.post("/", response_model=PredictionResponse)
async def predict_student_dropout(request: PredictionRequest):
    """
    Predict dropout probability for a student based on their academic data
    """
    try:
        result = predict_dropout(
            attendance=request.attendance,
            internal_marks=request.internal_marks,
            backlogs=request.backlogs,
            study_hours=request.study_hours,
            previous_failures=request.previous_failures,
        )

        result["recommendations"] = generate_recommendations(
            request.dict(), result["risk_level"]
        )

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@router.post("/batch")
async def predict_batch(students: List[PredictionRequest]):
    """Predict dropout for multiple students at once"""
    try:
        results = []

        for student in students:
            result = predict_dropout(
                attendance=student.attendance,
                internal_marks=student.internal_marks,
                backlogs=student.backlogs,
                study_hours=student.study_hours,
                previous_failures=student.previous_failures,
            )

            result["recommendations"] = generate_recommendations(
                student.dict(), result["risk_level"]
            )
            results.append(result)

        return {"total": len(students), "predictions": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction error: {str(e)}")


def generate_recommendations(student_data: dict, risk_level: str) -> List[str]:
    """Generate intervention recommendations based on student data"""

    recommendations = []

    attendance = student_data.get("attendance", 100)
    internal_marks = student_data.get("internal_marks", 100)
    backlogs = student_data.get("backlogs", 0)
    study_hours = student_data.get("study_hours", 0)
    previous_failures = student_data.get("previous_failures", 0)

    # Attendance
    if attendance < 60:
        recommendations += [
            "🚨 Critical: Schedule immediate counseling session",
            "📞 Contact parents/guardians about attendance issues",
        ]
    elif attendance < 75:
        recommendations += [
            "⚠️ Monitor attendance closely",
            "📧 Send attendance warning notification",
        ]

    # Academics
    if internal_marks < 40:
        recommendations += [
            "📚 Assign peer tutor",
            "🎯 Create personalized study plan",
        ]
    elif internal_marks < 60:
        recommendations.append("📖 Recommend additional tutoring sessions")

    # Backlogs
    if backlogs >= 3:
        recommendations += [
            "⏰ Urgent: Backlog clearance counseling",
            "📝 Create backlog clearance timeline",
        ]
    elif backlogs > 0:
        recommendations.append("📋 Set up backlog study group")

    # Study habits
    if study_hours < 2:
        recommendations += [
            "⏱️ Time management workshop",
            "📱 Recommend productivity tools",
        ]
    elif study_hours < 4:
        recommendations.append("💡 Optimize study schedule")

    # Failures
    if previous_failures > 0:
        recommendations += [
            "🎓 Academic counseling",
            "🔄 Review failure patterns",
        ]

    # Risk level
    if risk_level == "high":
        recommendations += [
            "👥 Assign dedicated mentor",
            "📊 Weekly progress monitoring",
        ]
    elif risk_level == "medium":
        recommendations += [
            "👀 Monthly monitoring",
            "💬 Encourage support programs",
        ]
    else:
        recommendations += [
            "✅ Maintain current performance",
            "🌟 Consider peer mentoring",
        ]

    return recommendations or ["✅ No specific interventions required"]
