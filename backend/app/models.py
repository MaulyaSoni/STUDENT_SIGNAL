from pydantic import BaseModel
from typing import List

class Subject(BaseModel):
    subject: str
    scores: List[int]
    attempts_used: int

class Student(BaseModel):
    student_id: str
    name: str
    department: str
    attendance: int
    consecutive_absences: int
    academics: List[Subject]
