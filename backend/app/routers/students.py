from fastapi import APIRouter, HTTPException, Query
from app.database import students_collection
from app.ml.predict import predict_dropout_probability, calculate_risk_level, identify_risk_factors
from bson import ObjectId
from typing import Optional
import traceback

router = APIRouter(prefix="/students", tags=["Students"])

def serialize_student(student):
    """Serialize MongoDB document to JSON-compatible dict"""
    return {
        "id": str(student["_id"]),
        "student_id": student.get("student_id", ""),
        "name": student.get("name", ""),
        "email": student.get("email", ""),
        "department": student.get("department", ""),
        "semester": student.get("semester", 1),
        "gpa": student.get("gpa", 0.0),
        "attendance": student.get("attendance", 0),
        "internal_marks": student.get("internal_marks", 0),
        "backlogs": student.get("backlogs", 0),
        "study_hours": student.get("study_hours", 0),
        "previous_failures": student.get("previous_failures", 0),
        "risk_level": student.get("risk_level", "low"),
        "dropout_probability": student.get("dropout_probability", 0.0),
        "risk_factors": student.get("risk_factors", []),
    }

@router.get("/")
async def get_students(
    department: Optional[str] = Query(None, description="Filter by department"),
    semester: Optional[int] = Query(None, description="Filter by semester"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level (low/medium/high)")
):
    """Get all students with optional filters"""
    try:
        # Build query
        query = {}
        if department:
            query["department"] = department
        if semester:
            query["semester"] = semester
        if risk_level:
            query["risk_level"] = risk_level.lower()
        
        students = list(students_collection.find(query).limit(500))
        
        if not students:
            return []
        
        return [serialize_student(student) for student in students]
    
    except Exception as e:
        print(f"Error fetching students: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/dashboard-stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        total = students_collection.count_documents({})
        high_risk = students_collection.count_documents({"risk_level": "high"})
        medium_risk = students_collection.count_documents({"risk_level": "medium"})
        low_risk = students_collection.count_documents({"risk_level": "low"})
        
        # Calculate average dropout probability
        pipeline = [
            {"$group": {
                "_id": None,
                "avg_probability": {"$avg": "$dropout_probability"}
            }}
        ]
        
        result = list(students_collection.aggregate(pipeline))
        avg_probability = result[0]["avg_probability"] if result else 0.0
        
        return {
            "total_students": total,
            "high_risk_count": high_risk,
            "medium_risk_count": medium_risk,
            "low_risk_count": low_risk,
            "avg_dropout_probability": round(avg_probability, 4) if avg_probability else 0.0
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{student_id}")
async def get_student_detail(student_id: str):
    """Get detailed information for a specific student"""
    try:
        # Try to find by student_id field first
        student = students_collection.find_one({"student_id": student_id})
        
        # If not found, try by MongoDB _id
        if not student:
            try:
                student = students_collection.find_one({"_id": ObjectId(student_id)})
            except:
                pass
        
        if not student:
            raise HTTPException(status_code=404, detail=f"Student {student_id} not found")
        
        # Serialize basic info
        student_data = serialize_student(student)
        
        # Add additional details
        student_data.update({
            "consecutive_absences": student.get("consecutive_absences", 0),
            "last_attendance_date": student.get("last_attendance_date"),
            "academics": student.get("academics", []),
            "interventions": student.get("interventions", []),
            "last_analysis": student.get("last_analysis"),
        })
        
        # Generate trends if data available
        student_data["attendance_trend"] = generate_attendance_trend(student)
        student_data["score_trend"] = generate_score_trend(student)
        
        return student_data
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching student detail: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{student_id}/analyze")
async def analyze_student(student_id: str):
    """Analyze risk for a specific student"""
    try:
        # Find student
        student = students_collection.find_one({"student_id": student_id})
        
        if not student:
            try:
                student = students_collection.find_one({"_id": ObjectId(student_id)})
            except:
                pass
        
        if not student:
            raise HTTPException(status_code=404, detail=f"Student {student_id} not found")
        
        # Prepare data for prediction
        student_data = {
            "attendance": student.get("attendance", 75),
            "internal_marks": student.get("internal_marks", 75),
            "backlogs": student.get("backlogs", 0),
            "study_hours": student.get("study_hours", 4),
            "previous_failures": student.get("previous_failures", 0)
        }
        
        # Get prediction
        probability = predict_dropout_probability(student_data)
        risk_level = calculate_risk_level(probability, student_data)
        risk_factors = identify_risk_factors(student_data)
        
        # Update student record
        students_collection.update_one(
            {"_id": student["_id"]},
            {"$set": {
                "dropout_probability": probability,
                "risk_level": risk_level,
                "risk_factors": risk_factors
            }}
        )
        
        return {
            "student_id": student.get("student_id"),
            "name": student.get("name"),
            "dropout_probability": probability,
            "risk_level": risk_level,
            "risk_factors": risk_factors
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error analyzing student: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

def generate_attendance_trend(student):
    """Generate attendance trend data"""
    # Placeholder - replace with actual trend data when available
    attendance = student.get("attendance", 75)
    return [
        {"week": 1, "percentage": min(100, attendance + 5)},
        {"week": 2, "percentage": min(100, attendance + 3)},
        {"week": 3, "percentage": attendance},
        {"week": 4, "percentage": max(0, attendance - 2)},
    ]

def generate_score_trend(student):
    """Generate score trend data"""
    # Placeholder - replace with actual trend data when available
    marks = student.get("internal_marks", 75)
    return [
        {"exam": "Mid 1", "score": max(0, marks - 5)},
        {"exam": "Mid 2", "score": marks},
        {"exam": "Assignment", "score": min(100, marks + 3)},
    ]
