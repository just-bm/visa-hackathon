import os
from dotenv import load_dotenv

load_dotenv(override=True)

GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
PORT = os.getenv("PORT", 8000)
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")

if not GROQ_API_KEY or not GROQ_API_KEY.startswith("gsk_"):
    raise RuntimeError("Invalid or missing GROQ_API_KEY. Ensure it starts with 'gsk_'.")
