from fastapi import APIRouter
from app.database import students_collection

router = APIRouter(prefix="/students")

@router.get("")
def get_students():
    students = list(students_collection.find({}, {"_id": 0}))
    return students

@router.get("/{student_id}")
def get_student(student_id: str):
    student = students_collection.find_one(
        {"student_id": student_id},
        {"_id": 0}
    )
    return student
