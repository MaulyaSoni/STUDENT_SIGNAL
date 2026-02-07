from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import students

app = FastAPI(title="EarlySignal Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(students.router)

@app.get("/")
def root():
    return {"status": "Backend running"}

# app.include_router(students.router)
# app.include_router(upload.router)
# app.include_router(risk.router)
# app.include_router(alerts.router)
