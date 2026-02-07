from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.database import students_collection
from app.ml.predict import predict_dropout_probability, calculate_risk_level, identify_risk_factors
from app.ml.visualize import generate_tree_visualization, get_feature_importance
from typing import Optional
import traceback

router = APIRouter(prefix="/risk", tags=["Risk Analysis"])

@router.post("/analyze-all")
async def analyze_all_students():
    """Analyze risk for all students in the database"""
    try:
        students = list(students_collection.find())
        
        if not students:
            return {"message": "No students found in database", "analyzed": 0}
        
        analyzed_count = 0
        
        for student in students:
            try:
                # Prepare student data
                student_data = {
                    "attendance": student.get("attendance", 75),
                    "internal_marks": student.get("internal_marks", 75),
                    "backlogs": student.get("backlogs", 0),
                    "study_hours": student.get("study_hours", 4),
                    "previous_failures": student.get("previous_failures", 0)
                }
                
                # Get ML prediction
                ml_probability = predict_dropout_probability(student_data)
                risk_level = calculate_risk_level(ml_probability, student_data)
                risk_factors = identify_risk_factors(student_data)
                
                # Update student record
                students_collection.update_one(
                    {"_id": student["_id"]},
                    {"$set": {
                        "dropout_probability": ml_probability,
                        "risk_level": risk_level,
                        "risk_factors": risk_factors,
                        "last_analysis": None  # You can add datetime here
                    }}
                )
                
                analyzed_count += 1
                
            except Exception as e:
                print(f"Error analyzing student {student.get('student_id', 'unknown')}: {str(e)}")
                continue
        
        return {
            "message": "Risk analysis completed",
            "total_students": len(students),
            "analyzed": analyzed_count,
            "failed": len(students) - analyzed_count
        }
    
    except Exception as e:
        print(f"Error in analyze_all_students: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/visualize/tree")
async def visualize_decision_tree(max_depth: Optional[int] = 4):
    """Generate decision tree visualization"""
    try:
        result = generate_tree_visualization(max_depth=max_depth)
        
        if "error" in result and result["error"]:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return JSONResponse(content=result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/feature-importance")
async def feature_importance():
    """Get feature importance from the ML model"""
    try:
        result = get_feature_importance()
        
        if "error" in result and result["error"]:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return JSONResponse(content=result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
async def get_risk_statistics():
    """Get overall risk statistics"""
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
            "avg_dropout_probability": round(avg_probability, 4) if avg_probability else 0.0,
            "high_risk_percentage": round((high_risk / total * 100), 2) if total > 0 else 0,
            "medium_risk_percentage": round((medium_risk / total * 100), 2) if total > 0 else 0,
            "low_risk_percentage": round((low_risk / total * 100), 2) if total > 0 else 0
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
