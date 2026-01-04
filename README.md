# DQS-AI: GenAI-Powered Data Quality Scoring Agent for Payments

Payment organizations process massive volumes of transactional and customer data across multiple systems. However, there is **no universal, objective, or explainable way** to measure data quality across critical dimensions, leading to unreliable analytics, regulatory risk, and costly manual investigations.




## 💡 Solution
DQS-AI is an autonomous agent that:
- Analyzes any payments-related dataset
- Scores it across **standard enterprise data quality dimensions**
- Produces a **single composite Data Quality Score (DQS)**
- Uses GenAI to explain issues and recommend prioritized fixes

---

## 🧠 Key Features
- ✅ **Universal Data Quality Score (0–100)**
- 📊 **Dimension-wise Scoring**
  - Completeness
  - Accuracy
  - Consistency
  - Validity
  - Uniqueness
  - Timeliness
  - Integrity
- 🧠 **Explainable GenAI Insights**
- 🛠️ **Actionable Remediation Recommendations**
- 🔐 **Privacy-First Design** (No raw data stored)

---



## 🏗️ System Architecture
User
│
▼
Web UI (Dataset Upload & Dashboard)
│
▼
DQ Orchestrator Agent
│
├── Metadata Extractor
├── Rule-Based Scoring Engine
├── Composite DQS Calculator
└── GenAI Insight Agent
    ├─ Plain-language explanations
    ├─ Risk & regulatory impact
    └─ Fix recommendations

---


## 🔢 Scoring Logic

Each data quality dimension is scored on a **0–100 scale** using deterministic, rule-based checks.


---


## 📊 Example Output
- **Overall DQS:** 71.3
- **AI Insight:**  
  > “Completeness and timeliness are the primary risks. Missing KYC address fields and outdated verification records may impact regulatory readiness.”
- **Top Recommendations:**
  1. Refresh KYC records older than 12 months
  2. Enforce PAN format validation
  3. Deduplicate customer records

---


## 🔐 Privacy & Compliance
- No sensitive transaction data is stored
- Only metadata, scores, and insights are retained
- Designed with regulatory and audit-readiness in mind

---





Built as part of Shaastra 2026 – 24 Hour AI Hackathon (Visa Track)
Focus area: Payments, FinTech, GenAI, RegTech