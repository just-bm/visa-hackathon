from fastapi import APIRouter, HTTPException
from datetime import datetime
from schemas import ExtractedMetadata, DQAnalysisResponse
from services.llm import dq_chain
from core.logger import logger

router = APIRouter(prefix="", tags=["Data Quality"])

@router.post("/analyze-dqs", response_model=DQAnalysisResponse)
async def analyze_dqs(metadata: ExtractedMetadata):
    """Analyze data quality from extracted metadata using GenAI."""
    logger.info(f"Analyzing data quality for dataset: {metadata.dataset.dataset_name}")
    try:
        response = dq_chain.invoke({"metadata": metadata.model_dump_json()})
        return response
    except Exception as e:
        logger.error(f"Error during DQ analysis: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/export-report")
async def export_remediation_report(analysis: DQAnalysisResponse):
    """Generates a professional Markdown report for remediation."""
    logger.info("Generating remediation report")
    try:
        report = f"""# Data Quality Remediation Report
**Generated on**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Composite DQ Score**: {(analysis.composite_dqs * 100):.1f}%

## 🚨 Critical Issues
"""
        for issue in analysis.data_quality_issues:
            report += f"### {issue.dimension}\n- **Issue**: {issue.issue}\n- **Impact**: {issue.description}\n- **Columns**: {', '.join(issue.affected_columns)}\n\n"

        report += "\n## ✅ Recommended Actions\n"
        # Sort by priority
        sorted_actions = sorted(analysis.remediation_actions, key=lambda x: x.priority)
        for action in sorted_actions:
            report += f"- **[Priority {action.priority}]** {action.action}: {action.description}\n"

        report += "\n## ⚖️ Compliance & Risks\n"
        for risk in analysis.regulatory_compliance_risks:
            report += f"- {risk}\n"

        return {"markdown": report}
    except Exception as e:
        logger.error(f"Report generation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate report")