from fastapi import FastAPI
from app.routers import upload, students, risk, alerts

app = FastAPI(title="EarlySignal.AI Backend")

app.include_router(upload.router)
app.include_router(students.router)
app.include_router(risk.router)
app.include_router(alerts.router)

@app.get("/")
def health():
    return {"status": "Backend running"}
