# DQS-AI Evaluation Framework

## Overview

This framework generates synthetic payment datasets with **controlled quality defects**, runs them through the DQS-AI pipeline, and measures detection accuracy against known ground truth.

## Quick Start

```bash
# 1. Make sure the DQS-AI services are running
#    Terminal 1: cd server && npm run dev          (port 5000)
#    Terminal 2: cd client && npm run dev           (port 5173)
#    Terminal 3: cd ai-services && uvicorn main:app --reload  (port 8000)

# 2. Install Python dependencies
pip install requests

# 3. Run the full evaluation
cd evaluation
python run_evaluation.py

# Or generate datasets only (no services needed)
python run_evaluation.py --generate-only

# Or evaluate pre-generated datasets
python run_evaluation.py --evaluate-only

# Custom row count
python run_evaluation.py --rows 5000
```

## What It Does

### 1. Generates Synthetic Payment Data
Creates realistic payment CSVs with 11 columns:
| Column | Type | Example |
|--------|------|---------|
| `transaction_id` | string | TXN000042 |
| `customer_id` | string | CUST7832 |
| `amount` | numeric | 12450.50 |
| `currency` | string | INR |
| `txn_timestamp` | datetime | 2025-08-14 09:23:11 |
| `merchant_name` | string | Amazon India |
| `payment_method` | string | UPI |
| `status` | string | SUCCESS |
| `pan_number` | string | ABCDE1234F |
| `email` | string | amazon.india42@gmail.com |
| `kyc_address` | string | 123, MG Road, Mumbai |

### 2. Injects Controlled Defects
Three severity profiles (`low`, `medium`, `high`):

| Defect Type | Low | Medium | High |
|------------|-----|--------|------|
| Missing values | 5% | 15% | 30% |
| Duplicates | 2% | 10% | 25% |
| Invalid values (negative amounts) | 3% | 8% | 15% |
| Format inconsistencies | 5% | 12% | 20% |
| Temporal anomalies | 3% | 10% | 20% |

### 3. Measures Detection Accuracy
| Metric | Description |
|--------|------------|
| **Precision** | Issues flagged that are real / Total flagged |
| **Recall** | Real issues detected / Total real issues |
| **F1 Score** | Harmonic mean of precision and recall |
| **MAE** | Mean Absolute Error of dimension scores vs ground truth |
| **Composite DQS** | Overall quality score produced by DQS-AI |

## Output Files

```
evaluation/
├── datasets/
│   ├── payment_data_low.csv
│   ├── payment_data_medium.csv
│   ├── payment_data_high.csv
│   ├── ground_truth_low.json
│   ├── ground_truth_medium.json
│   └── ground_truth_high.json
└── results/
    └── evaluation_YYYYMMDD_HHMMSS.json
```
