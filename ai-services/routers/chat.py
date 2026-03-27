import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from schemas import ChatRequest, ChatResponse
from services.llm import chat_chain, llm, summarize_history
from prompt import CHAT_PROMPT
from core.logger import logger

router = APIRouter(prefix="", tags=["Chat"])

@router.post("", response_model=ChatResponse)
async def chat_with_auditor(request: ChatRequest):
    """Standard chat endpoint (non-streaming)."""
    try:
        history_str = await summarize_history(request.messages)
        response = chat_chain.invoke({
            "audit_context": request.audit_context.model_dump_json(),
            "chat_history": history_str,
            "user_input": request.user_input
        })
        return response
    except Exception as e:
        logger.error(f"Chat Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/stream")
async def chat_with_auditor_stream(request: ChatRequest):
    """Streaming chat endpoint for real-time AI responses."""
    logger.info("Streaming chat request received")
    async def event_generator():
        try:
            history_str = await summarize_history(request.messages)
            prompt = CHAT_PROMPT.format(
                audit_context=request.audit_context.model_dump_json(),
                chat_history=history_str,
                user_input=request.user_input
            )
            async for chunk in llm.astream(prompt):
                if chunk.content:
                    yield f"data: {json.dumps({'content': chunk.content})}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            logger.error(f"Stream error: {str(e)}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    return StreamingResponse(event_generator(), media_type="text/event-stream")