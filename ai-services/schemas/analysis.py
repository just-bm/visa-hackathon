from pydantic import BaseModel, Field
from typing import List, Dict

class DQIssue(BaseModel):
    dimension: str = Field(description="The data quality dimension (Completeness, Accuracy, etc.)")
    issue: str = Field(default="No issues identified", description="Brief summary of the issue")
    affected_columns: List[str] = Field(default_factory=list, description="List of columns affected by this issue")
    description: str = Field(default="No specific issues were identified for this dimension.", description="Detailed explanation of the issue and its impact")


class RemediationAction(BaseModel):
    action: str = Field(description="Concrete step to fix the data quality issue")
    priority: int = Field(ge=1, le=5, description="Priority level from 1 (lowest) to 5 (lowest)")
    description: str = Field(default="", description="Explanation of how the action addresses the issue")

class DQAnalysisResponse(BaseModel):
    status: str = Field(default="success", description="Status indicator")
    data_quality_issues: List[DQIssue] = Field(description="List of issues categorized by dimension")
    remediation_actions: List[RemediationAction] = Field(description="List of recommended actions to improve data quality")
    regulatory_compliance_risks: List[str] = Field(default_factory=list, description="Potential compliance risks identified")
    composite_dqs: float = Field(ge=0.0, le=1.0, description="Overall data quality score (weighted average)")
    dimension_scores: Dict[str, float] = Field(description="Scores for each DQ dimension between 0.0 and 1.0")

