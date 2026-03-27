from fastapi import APIRouter
from core.config import GROQ_MODEL

router = APIRouter(tags=["Health"])

@router.get("/health")
async def health_check():
    return {"status": "healthy", "model": GROQ_MODEL}

@router.get("/")
async def root():
    return {
        "message": "DQS-AI Agent v1.3.0", 
        "endpoints": [
            "/analyze-dqs", 
            "/chat", 
            "/chat/stream", 
            "/export-report", 
            "/health",
            "/docs"
        ]
    }