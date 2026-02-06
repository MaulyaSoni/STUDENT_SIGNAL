from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

print("DEBUG MONGO_URI:", MONGO_URI)  # 👈 ADD THIS

client = MongoClient(
    MONGO_URI,
    serverSelectionTimeoutMS=5000
)

db = client["student_signal"]
students_collection = db["students"]
alerts_collection = db["alerts"]
