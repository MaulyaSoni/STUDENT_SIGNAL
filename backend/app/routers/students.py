from fastapi import APIRouter, HTTPException
from app.database import students_collection
from bson import ObjectId
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
        "risk_level": student.get("risk_level", "low"),
        "dropout_probability": student.get("dropout_probability", 0.0),
    }

@router.get("/")
def get_students():
    """Get all students from the database"""
    try:
        students = list(students_collection.find().limit(100))  # Limit for performance
        if not students:
            return []  # Return empty array if no students found
        return [serialize_student(student) for student in students]
    except Exception as e:
        print(f"Error fetching students: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
