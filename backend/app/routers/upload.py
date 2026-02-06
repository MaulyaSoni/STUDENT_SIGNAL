from fastapi import APIRouter, UploadFile, File
from app.services.preprocessing import process_csv
from app.database import students_collection

router = APIRouter(prefix="/upload-data")

@router.post("")
async def upload_data(file: UploadFile = File(...)):
    df = process_csv(file.file)

    for _, row in df.iterrows():
        students_collection.update_one(
            {"student_id": row["student_id"]},
            {"$set": row.to_dict()},
            upsert=True
        )

    return {"message": "Data uploaded successfully"}
