import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

if not MONGO_URI:
    raise RuntimeError("MONGO_URI not found in environment variables")

if not DB_NAME:
    raise RuntimeError("DB_NAME not found in environment variables")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

students_collection = db["students"]
alerts_collection = db["alerts"]

print("✅ MongoDB connected")
