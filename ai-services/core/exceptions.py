from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from core.logger import logger
import traceback

async def global_exception_handler(_request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}\n{traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."},
    )

async def http_exception_handler(_request: Request, exc: HTTPException):
    logger.warning(f"HTTP {exc.status_code}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

def setup_exception_handlers(app):
    app.add_exception_handler(Exception, global_exception_handler)
    app.add_exception_handler(HTTPException, http_exception_handler)
