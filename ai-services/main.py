from fastapi import FastAPI
from routers import dq, chat, health
from core.logger import logger
from core.config import PORT, CORS_ORIGINS
from core.exceptions import setup_exception_handlers
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 DQS-AI Agent starting up...")
    yield
    logger.info("🛑 DQS-AI Agent shutting down...")

app = FastAPI(
    title="DQS-AI Agent",
    description="Data Quality Service powered by GenAI",
    version="1.3.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_exception_handlers(app)

app.include_router(health.router)
app.include_router(dq.router)
app.include_router(chat.router, prefix="/chat", tags=["Chat"])



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(PORT))