"""
Quick Backend Test Script
Run this to verify your backend is working correctly
"""

import sys
import os

# Add backend to path
sys.path.insert(0, "D:\\STUDENT_Signal\\backend")

print("=" * 50)
print("Testing Backend Configuration")
print("=" * 50)

# Test 1: Environment Variables
print("\n1. Testing Environment Variables...")
try:
    from dotenv import load_dotenv
    load_dotenv("D:\\STUDENT_Signal\\backend\\.env")
    
    mongo_uri = os.getenv("MONGO_URI")
    db_name = os.getenv("DB_NAME")
    
    if mongo_uri:
        print(f"   ✅ MONGO_URI found: {mongo_uri[:30]}...")
    else:
        print("   ❌ MONGO_URI not found!")
        
    if db_name:
        print(f"   ✅ DB_NAME found: {db_name}")
    else:
        print("   ❌ DB_NAME not found!")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test 2: Database Connection
print("\n2. Testing Database Connection...")
try:
    from app.database import db, students_collection
    print(f"   ✅ Database connected: {db.name}")
    print(f"   ✅ Students collection: {students_collection.name}")
    
    # Try to count students
    count = students_collection.count_documents({})
    print(f"   📊 Students in database: {count}")
    
except Exception as e:
    print(f"   ❌ Database Error: {e}")

# Test 3: FastAPI App
print("\n3. Testing FastAPI App...")
try:
    from app.main import app
    print("   ✅ FastAPI app loaded successfully")
    
    # List routes
    print("\n   Routes:")
    for route in app.routes:
        if hasattr(route, 'path'):
            print(f"      - {route.path}")
            
except Exception as e:
    print(f"   ❌ FastAPI Error: {e}")

# Test 4: Students Router
print("\n4. Testing Students Router...")
try:
    from app.routers.students import router, serialize_student
    print("   ✅ Students router loaded successfully")
    
    # Try to fetch students
    from app.database import students_collection
    students = list(students_collection.find().limit(5))
    
    if students:
        print(f"   ✅ Found {len(students)} students (showing first 5)")
        serialized = serialize_student(students[0])
        print(f"   📄 Sample student: {serialized.get('name', 'No name')}")
    else:
        print("   ⚠️ No students found in database")
        print("   ℹ️ This is OK - upload data via /upload/ endpoint")
        
except Exception as e:
    print(f"   ❌ Router Error: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 50)
print("Test Complete!")
print("=" * 50)

print("\n🚀 To start the server:")
print("   conda activate earlysignal")
print("   cd D:\\STUDENT_Signal\\backend")
print("   uvicorn app.main:app --reload")

print("\n🧪 To test endpoints:")
print("   curl http://127.0.0.1:8000/")
print("   curl http://127.0.0.1:8000/students/")
print("   Open: http://127.0.0.1:8000/docs")
