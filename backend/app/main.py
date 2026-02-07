from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import students, upload, risk, alerts, predict
from app.database import db

app = FastAPI(
    title="EarlySignal.AI Backend",
    description="Student Dropout Prediction API with ML-powered risk analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(students.router)
app.include_router(upload.router)
app.include_router(risk.router)
app.include_router(alerts.router)
app.include_router(predict.router)

@app.get("/")
def root():
    return {
        "status": "Backend running",
        "service": "EarlySignal.AI",
        "version": "1.0.0",
        "endpoints": {
            "students": "/students",
            "upload": "/upload",
            "risk": "/risk",
            "alerts": "/alerts",
            "predict": "/predict",
            "docs": "/docs"
        }
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        db.command('ping')
        db_status = "connected"
    except:
        db_status = "disconnected"
    
    return {
        "status": "healthy",
        "database": db_status
    }
