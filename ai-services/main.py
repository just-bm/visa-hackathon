import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from schemas import ExtractedMetadata
from prompt import DQ_PROMPT
from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser
import re
import json

load_dotenv()

app = FastAPI(
    title="DQS-AI Agent",
    description="Data Quality Service powered by GenAI",
    version="1.0.0"
)

GROQ_MODEL = os.getenv("GROQ_MODEL", "mixtral-8x7b-32768")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY or not GROQ_API_KEY.startswith("gsk_"):
    raise RuntimeError("❌ Invalid or missing GROQ_API_KEY")

llm = ChatGroq(
    model=GROQ_MODEL,
    temperature=0.2,
    api_key=GROQ_API_KEY
)

dq_chain = DQ_PROMPT | llm | StrOutputParser()


@app.post("/analyze-dqs")
async def analyze_dqs(payload: dict):
    """
    Analyze data quality from extracted metadata.
    
    Args:
        payload: Dictionary containing dataset metadata
        
    Returns:
        JSON response with GenAI insights
    """
    try:
        metadata = ExtractedMetadata.normalize(payload)
        # response = dq_chain.invoke({
        #     "metadata": metadata.model_dump()
        # })
        # return {
        #     "status": "success",
        #     "genai_insights": response
        # }

        raw_response = dq_chain.invoke({
            "metadata": metadata.model_dump()
        })

        # If LangChain returns AIMessage, extract content
        if hasattr(raw_response, "content"):
            raw_response = raw_response.content

        # Remove markdown fences if present
        cleaned = re.sub(r"```json\s*", "", raw_response)
        cleaned = re.sub(r"\s*```$", "", cleaned)
        cleaned = cleaned.strip()

        # Parse JSON safely
        genai_insights = json.loads(cleaned)

        # return {
        #     "status": "success",
        #     "genai_insights": genai_insights
        # }

        return genai_insights
        
    except ValueError as e:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid payload format: {str(e)}"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze data quality: {str(e)}"
        )

    # return {
    #     "status": "success",
    #     "genai_insights": {
    #         "data_quality_issues": {
    #             "Completeness": {
    #                 "issue": "Some columns have high null ratios",
    #                 "affected_columns": [
    #                     "customer_id",
    #                     "amount",
    #                     "kyc_address"
    #                 ],
    #                 "description": "The columns customer_id, amount, and kyc_address have null ratios of 0.0012, 0.0005, and 0.22 respectively, indicating some missing values."
    #             },
    #             "Accuracy": {
    #                 "issue": "No specific accuracy issues detected",
    #                 "affected_columns": [],
    #                 "description": "No specific accuracy issues detected, but some data may be incorrect or inconsistent."
    #             },
    #             "Consistency": {
    #                 "issue": "Inconsistent data formats",
    #                 "affected_columns": [
    #                     "currency"
    #                 ],
    #                 "description": "The currency column has both 'INR' and 'inr' values, indicating inconsistent data formats."
    #             },
    #             "Validity": {
    #                 "issue": "Some values may not be valid",
    #                 "affected_columns": [
    #                     "amount",
    #                     "txn_timestamp"
    #                 ],
    #                 "description": "The amount column has a negative value ratio of 0.015 and a min value of -50.0, indicating some potentially invalid values. The txn_timestamp column has a future timestamp ratio of 0.02 and a stale record ratio of 0.18."
    #             },
    #             "Timeliness": {
    #                 "issue": "Some records may be stale or have future timestamps",
    #                 "affected_columns": [
    #                     "txn_timestamp"
    #                 ],
    #                 "description": "The txn_timestamp column has a future timestamp ratio of 0.02 and a stale record ratio of 0.18, indicating some records may not be up-to-date."
    #             },
    #             "Uniqueness": {
    #                 "issue": "Some columns have low uniqueness ratios",
    #                 "affected_columns": [
    #                     "customer_id",
    #                     "amount",
    #                     "kyc_address"
    #                 ],
    #                 "description": "The columns customer_id, amount, and kyc_address have unique ratios of 0.42, 0.23, and 0.76 respectively, indicating some duplicate values."
    #             },
    #             "Integrity": {
    #                 "issue": "No specific integrity issues detected",
    #                 "affected_columns": [],
    #                 "description": "No specific integrity issues detected."
    #             }
    #         },
    #         "remediation_actions": [
    #             {
    #                 "action": "Validate and correct inconsistent data formats",
    #                 "priority": 1,
    #                 "description": "Validate and correct inconsistent data formats in the currency column."
    #             },
    #             {
    #                 "action": "Verify and correct potentially invalid values",
    #                 "priority": 2,
    #                 "description": "Verify and correct potentially invalid values in the amount and txn_timestamp columns."
    #             },
    #             {
    #                 "action": "Handle missing values",
    #                 "priority": 3,
    #                 "description": "Handle missing values in the customer_id, amount, and kyc_address columns."
    #             }
    #         ],
    #         "regulatory_compliance_risks": [
    #             "KYC and AML regulations may be impacted by inconsistent or invalid data in the kyc_address and customer_id columns."
    #         ],
    #         "composite_dqs": 0.72,
    #         "dimension_scores": {
    #             "Completeness": 0.7,
    #             "Validity": 0.75,
    #             "Consistency": 0.8,
    #             "Timeliness": 0.85,
    #             "Uniqueness": 0.9,
    #             "Accuracy": 0.0
    #         }
    #     }
    # }


@app.get("/")
async def root():
    """Root endpoint with service info"""
    return {
        "message": "DQS-AI Agent is running",
        "endpoints": {
            "analyze": "/analyze-dqs",
            "docs": "/docs"
        },
        "model": GROQ_MODEL,
        "api_key_configured": bool(GROQ_API_KEY),
        "api_key:" : GROQ_API_KEY
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model": GROQ_MODEL,
        "api_key_configured": bool(GROQ_API_KEY)
    }

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": str(exc),
            "type": type(exc).__name__
        }
    )


if __name__ == "__main__":
    print("=" * 50)
    print("🚀 DQS-AI Agent")
    print("=" * 50)
    print(f"📦 Model: {GROQ_MODEL}")
    print(f"🔑 API Key: {'✅ Configured' if GROQ_API_KEY else '❌ Not set'}")
    print("\n💡 Run with: uvicorn main:app --reload")
    print("📚 Docs at: http://localhost:8000/docs")
    print("=" * 50)