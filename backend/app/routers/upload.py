from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.preprocessing import process_csv
from app.database import students_collection
from app.ml.predict import predict_dropout_probability, calculate_risk_level, identify_risk_factors
import traceback

router = APIRouter(prefix="/upload", tags=["Upload"])

@router.post("/")
async def upload_data(file: UploadFile = File(...)):
    """Upload and process student data CSV file"""
    try:
        # Validate file type
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Only CSV files are allowed")
        
        # Process CSV
        df = process_csv(file.file)
        
        if df.empty:
            raise HTTPException(status_code=400, detail="CSV file is empty")
        
        rows_processed = 0
        rows_analyzed = 0
        
        for _, row in df.iterrows():
            try:
                # Convert row to dict and handle NaN values
                student_data = row.to_dict()
                student_data = {k: (v if v == v else 0) for k, v in student_data.items()}  # Replace NaN with 0
                
                # Ensure required fields
                if "student_id" not in student_data:
                    continue
                
                # Predict risk if features are available
                if all(k in student_data for k in ["attendance", "internal_marks"]):
                    prediction_data = {
                        "attendance": float(student_data.get("attendance", 75)),
                        "internal_marks": float(student_data.get("internal_marks", 75)),
                        "backlogs": int(student_data.get("backlogs", 0)),
                        "study_hours": float(student_data.get("study_hours", 4)),
                        "previous_failures": int(student_data.get("previous_failures", 0))
                    }
                    
                    # Get ML prediction
                    probability = predict_dropout_probability(prediction_data)
                    risk_level = calculate_risk_level(probability, prediction_data)
                    risk_factors = identify_risk_factors(prediction_data)
                    
                    student_data["dropout_probability"] = probability
                    student_data["risk_level"] = risk_level
                    student_data["risk_factors"] = risk_factors
                    rows_analyzed += 1
                else:
                    # Set default values if features missing
                    student_data["dropout_probability"] = 0.0
                    student_data["risk_level"] = "low"
                    student_data["risk_factors"] = []
                
                # Upsert student record
                students_collection.update_one(
                    {"student_id": student_data["student_id"]},
                    {"$set": student_data},
                    upsert=True
                )
                
                rows_processed += 1
                
            except Exception as e:
                print(f"Error processing row: {str(e)}")
                continue
        
        return {
            "message": "Data uploaded successfully",
            "rows_processed": rows_processed,
            "rows_analyzed": rows_analyzed,
            "total_rows": len(df)
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error uploading data: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Upload error: {str(e)}")
