export const SAMPLE_ANALYSIS_RESULT = {
  status: "success",
  composite_dqs: 0.88,
  dimension_scores: {
    "Completeness": 0.92,
    "Accuracy": 0.85,
    "Consistency": 0.95,
    "Validity": 0.80,
    "Timeliness": 0.88,
    "Uniqueness": 1.0,
    "Integrity": 0.92
  },
  data_quality_issues: [
    {
      dimension: "Validity",
      issue: "Negative Transaction Amounts",
      affected_columns: ["amount"],
      description: "12 records (1.2%) contain negative values in the 'amount' field, which violates business logic for SUCCESS transactions."
    },
    {
      dimension: "Completeness",
      issue: "Missing KYC Information",
      affected_columns: ["kyc_address", "email"],
      description: "85 records (8.5%) are missing mandatory PII fields required for compliance reporting."
    },
    {
      dimension: "Timeliness",
      issue: "Stale Records Detected",
      affected_columns: ["txn_timestamp"],
      description: "45 records appear to be older than the assumed 2-year data retention policy."
    }
  ],
  remediation_actions: [
    {
      action: "Standardize Address Formats",
      priority: 1,
      description: "Apply regex-based formatting to 'kyc_address' to ensure consistency across regional records."
    },
    {
      action: "Implement Amount Guards",
      priority: 2,
      description: "Add a database-level constraint to prevent negative 'amount' values in the transaction table."
    },
    {
      action: "Archive Stale Data",
      priority: 3,
      description: "Migrate records older than 24 months to long-term cold storage to improve query performance."
    }
  ],
  regulatory_compliance_risks: [
    "High Risk: Missing KYC details may lead to non-compliance with regional AML/KYC directives.",
    "Medium Risk: Negative amounts in successful transactions may indicate data entry corruption."
  ]
};
