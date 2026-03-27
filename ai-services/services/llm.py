from langchain_groq import ChatGroq
from schemas import (
    DQAnalysisResponse, ChatResponse, ChatMessage
)
from prompt import DQ_PROMPT, CHAT_PROMPT, SUMMARIZE_PROMPT
from core.config import GROQ_MODEL, GROQ_API_KEY
from core.logger import logger

try:
    llm = ChatGroq(
        model=GROQ_MODEL,
        temperature=0.1,
        api_key=GROQ_API_KEY
    )
    
    structured_llm_dq = llm.with_structured_output(DQAnalysisResponse, method="json_mode")
    dq_chain = DQ_PROMPT | structured_llm_dq
    
    structured_llm_chat = llm.with_structured_output(ChatResponse, method="json_mode")
    chat_chain = CHAT_PROMPT | structured_llm_chat
    
    summary_chain = SUMMARIZE_PROMPT | llm

    logger.info(f"🚀 LLMs initialized with model: {GROQ_MODEL}")
except Exception as e:
    logger.error(f"Failed to initialize LLM: {str(e)}")
    raise RuntimeError(f"Failed to initialize LLM: {str(e)}")

async def summarize_history(messages: list[ChatMessage]) -> str:
    """
    Intelligent memory management: summarizes history if it's too long,
    preserving essential audit context.
    """
    if not messages:
        return ""
        
    history_str = "\n".join([f"{m.role}: {m.content}" for m in messages])
    
    if len(messages) > 10:
        logger.info(f"Summarizing conversation history (length: {len(messages)})")
        try:
            summary = await summary_chain.ainvoke({"chat_history": history_str})
            return f"Summary of previous audit interaction: {summary.content}"
        except Exception as e:
            logger.error(f"Summarization failed: {str(e)}, falling back to truncation")
            return "\n".join([f"{m.role}: {m.content}" for m in messages[-10:]])
            
    return history_str
