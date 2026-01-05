from langchain_core.prompts import PromptTemplate

DQ_PROMPT = PromptTemplate(
    input_variables=["metadata"],
    template="""

Dataset Metadata:
{metadata}

analyze data quality based on the above metadata.
This is the output format you must follow EXACTLY no other go.

REQUIRED JSON STRUCTURE:
{{
    "status": "success",
    "genai_insights": {{
        "data_quality_issues": {{
            "Completeness": {{
                "issue": "",
                "affected_columns": [],
                "description": ""
            }},
            "Accuracy": {{
                "issue": "",
                "affected_columns": [],
                "description": ""
            }},
            "Consistency": {{
                "issue": "",
                "affected_columns": [],
                "description": ""
            }},
            "Validity": {{
                "issue": "",
                "affected_columns": [],
                "description": ""
            }},
            "Timeliness": {{
                "issue": "",
                "affected_columns": [],
                "description": ""
            }},
            "Uniqueness": {{
                "issue": "",
                "affected_columns": [],
                "description": ""
            }},
            "Integrity": {{
                "issue": "",
                "affected_columns": [],
                "description": ""
            }}
        }},
        "remediation_actions": [
            {{
                "action": "",
                "priority": 1,
                "description": ""
            }},
            {{
                "action": "",
                "priority": 2,
                "description": ""
            }},
            {{
                "action": "",
                "priority": 3,
                "description": ""
            }}
        ],
        "regulatory_compliance_risks": [],
        "composite_dqs": 0.0,
        "dimension_scores": {{
            "Completeness": 0.0,
            "Accuracy": 0.0,
            "Consistency": 0.0,
            "Validity": 0.0,
            "Timeliness": 0.0,
            "Uniqueness": 0.0,
            "Integrity": 0.0
        }}
    }}
}}

FINAL RULE:
Return ONLY the JSON object.
Dont include any status messages or explanations.
Only give me the JSON object with the required structure.
Use ONLY double quotes
genai_insights MUST be a JSON object
All required keys MUST exist
Scores must be floats between 0.0 and 1.0
composite_dqs MUST be the weighted average of dimension scores
"""
)
