import os
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

if not MONGO_URI:
    raise RuntimeError("MONGO_URI not found in environment variables")

if not DB_NAME:
    raise RuntimeError("DB_NAME not found in environment variables")

# Create client with timeout settings
client = MongoClient(
    MONGO_URI,
    serverSelectionTimeoutMS=5000,  # 5 second timeout
    connectTimeoutMS=5000
)
db = client[DB_NAME]

students_collection = db["students"]
alerts_collection = db["alerts"]

# Try to connect but don't fail on startup
try:
    client.admin.command('ping')
    print("✅ MongoDB connected successfully")
    print(f"   Database: {DB_NAME}")
    try:
        collections = db.list_collection_names()
        print(f"   Collections: {collections}")
    except:
        print("   Collections: Unable to list")
except (ConnectionFailure, ServerSelectionTimeoutError) as e:
    print("⚠️  Warning: MongoDB is not connected")
    print("   The server will start but database operations will fail")
    print("   Please ensure MongoDB is running or check your connection string")
except Exception as e:
    print(f"⚠️  Database connection warning: {str(e)}")
