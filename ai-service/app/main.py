
from fastapi import FastAPI

app = FastAPI(
    title="IntervAI AI Service",
    description="AI-powered interview processing service",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "success": True,
        "message": "IntervAI AI Service is running"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
