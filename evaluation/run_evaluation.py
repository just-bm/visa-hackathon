"""
DQS-AI Evaluation Framework
============================
Generates synthetic payment datasets with controlled quality defects,
runs them through DQS-AI, and measures detection accuracy.

Usage:
    python run_evaluation.py                    # Full evaluation
    python run_evaluation.py --generate-only    # Only generate datasets
    python run_evaluation.py --evaluate-only    # Only evaluate (datasets must exist)
"""

import os
import json
import csv
import random
import string
import argparse
import time
from datetime import datetime, timedelta
from pathlib import Path
from dataclasses import dataclass, field, asdict
from typing import Optional

# ---------------------------------------------------------------------------
#  Configuration
# ---------------------------------------------------------------------------

EVALUATION_DIR = Path(__file__).parent
DATASETS_DIR = EVALUATION_DIR / "datasets"
RESULTS_DIR = EVALUATION_DIR / "results"

# DQS-AI service endpoints
SERVER_URL = os.getenv("DQS_SERVER_URL", "http://127.0.0.1:5000")
AI_SERVICE_URL = os.getenv("DQS_AI_URL", "http://127.0.0.1:8000")

# Defect injection rates to test
DEFECT_PROFILES = {
    "low":    {"missing": 0.05, "duplicates": 0.02, "invalid": 0.03, "format": 0.05, "temporal": 0.03},
    "medium": {"missing": 0.15, "duplicates": 0.10, "invalid": 0.08, "format": 0.12, "temporal": 0.10},
    "high":   {"missing": 0.30, "duplicates": 0.25, "invalid": 0.15, "format": 0.20, "temporal": 0.20},
}

NUM_ROWS = 1000  # Rows per generated dataset


# ---------------------------------------------------------------------------
#  Ground Truth Tracking
# ---------------------------------------------------------------------------

@dataclass
class GroundTruth:
    """Tracks known defects injected into a dataset."""
    total_rows: int = 0
    missing_value_count: int = 0
    missing_value_columns: list = field(default_factory=list)
    duplicate_count: int = 0
    invalid_value_count: int = 0
    invalid_value_columns: list = field(default_factory=list)
    format_inconsistency_count: int = 0
    format_inconsistency_columns: list = field(default_factory=list)
    temporal_anomaly_count: int = 0
    temporal_anomaly_columns: list = field(default_factory=list)
    expected_completeness: float = 1.0
    expected_validity: float = 1.0
    expected_consistency: float = 1.0
    expected_uniqueness: float = 1.0
    expected_timeliness: float = 1.0


# ---------------------------------------------------------------------------
#  Synthetic Data Generators
# ---------------------------------------------------------------------------

def generate_transaction_id(i: int) -> str:
    return f"TXN{i:06d}"

def generate_customer_id() -> str:
    return f"CUST{random.randint(1000, 9999)}"

def generate_amount() -> float:
    return round(random.uniform(10.0, 50000.0), 2)

def generate_currency() -> str:
    return random.choice(["INR", "USD", "EUR", "GBP"])

def generate_timestamp(days_back: int = 365) -> str:
    base = datetime.now() - timedelta(days=random.randint(0, days_back))
    return base.strftime("%Y-%m-%d %H:%M:%S")

def generate_merchant_name() -> str:
    merchants = [
        "Amazon India", "Flipkart", "Swiggy", "Zomato", "PhonePe",
        "Paytm", "BigBasket", "Myntra", "BookMyShow", "MakeMyTrip",
        "Reliance Digital", "Croma", "DMart", "Uber India", "Ola"
    ]
    return random.choice(merchants)

def generate_pan() -> str:
    """Generate a valid-format Indian PAN number: AAAAA0000A"""
    letters = string.ascii_uppercase
    return (
        "".join(random.choices(letters, k=5))
        + "".join(random.choices(string.digits, k=4))
        + random.choice(letters)
    )

def generate_email(name: str) -> str:
    domains = ["gmail.com", "yahoo.com", "outlook.com", "company.co.in"]
    clean = name.lower().replace(" ", ".").replace("'", "")
    return f"{clean}{random.randint(1,99)}@{random.choice(domains)}"

def generate_clean_row(i: int) -> dict:
    """Generate a single clean payment transaction row."""
    merchant = generate_merchant_name()
    return {
        "transaction_id": generate_transaction_id(i),
        "customer_id": generate_customer_id(),
        "amount": generate_amount(),
        "currency": generate_currency(),
        "txn_timestamp": generate_timestamp(),
        "merchant_name": merchant,
        "payment_method": random.choice(["UPI", "Credit Card", "Debit Card", "Net Banking"]),
        "status": random.choice(["SUCCESS", "SUCCESS", "SUCCESS", "FAILED", "PENDING"]),
        "pan_number": generate_pan(),
        "email": generate_email(merchant),
        "kyc_address": f"{random.randint(1,999)}, {random.choice(['MG Road','Brigade Road','Park Street','Connaught Place','Bandra'])}, {random.choice(['Mumbai','Delhi','Bangalore','Chennai','Kolkata'])}",
    }


# ---------------------------------------------------------------------------
#  Defect Injectors
# ---------------------------------------------------------------------------

def inject_missing_values(rows: list, rate: float, gt: GroundTruth) -> list:
    """Replace random cell values with empty strings."""
    target_cols = ["customer_id", "amount", "kyc_address", "email"]
    count = 0
    for row in rows:
        for col in target_cols:
            if random.random() < rate:
                row[col] = ""
                count += 1
    gt.missing_value_count = count
    gt.missing_value_columns = target_cols
    gt.expected_completeness = 1.0 - (count / (len(rows) * len(target_cols)))
    return rows


def inject_duplicates(rows: list, rate: float, gt: GroundTruth) -> list:
    """Duplicate random rows."""
    num_dupes = int(len(rows) * rate)
    dupes = [dict(random.choice(rows)) for _ in range(num_dupes)]
    gt.duplicate_count = num_dupes
    gt.expected_uniqueness = 1.0 - rate
    rows.extend(dupes)
    return rows


def inject_invalid_values(rows: list, rate: float, gt: GroundTruth) -> list:
    """Inject invalid amounts (negative) and out-of-range values."""
    target_cols = ["amount"]
    count = 0
    for row in rows:
        if random.random() < rate and row.get("amount"):
            try:
                row["amount"] = -abs(float(row["amount"]))
                count += 1
            except (ValueError, TypeError):
                pass
    gt.invalid_value_count = count
    gt.invalid_value_columns = target_cols
    gt.expected_validity = 1.0 - (count / len(rows))
    return rows


def inject_format_inconsistencies(rows: list, rate: float, gt: GroundTruth) -> list:
    """Mix case in currency, corrupt PAN format."""
    target_cols = ["currency", "pan_number"]
    count = 0
    for row in rows:
        if random.random() < rate:
            row["currency"] = row["currency"].lower()  # "INR" → "inr"
            count += 1
        if random.random() < rate:
            row["pan_number"] = row["pan_number"][:3]  # Truncate PAN
            count += 1
    gt.format_inconsistency_count = count
    gt.format_inconsistency_columns = target_cols
    gt.expected_consistency = 1.0 - (count / (len(rows) * 2))
    return rows


def inject_temporal_anomalies(rows: list, rate: float, gt: GroundTruth) -> list:
    """Add future dates and very old dates."""
    target_cols = ["txn_timestamp"]
    count = 0
    for row in rows:
        if random.random() < rate / 2:
            # Future timestamp
            future = datetime.now() + timedelta(days=random.randint(30, 365))
            row["txn_timestamp"] = future.strftime("%Y-%m-%d %H:%M:%S")
            count += 1
        elif random.random() < rate / 2:
            # Very stale record (3+ years old)
            stale = datetime.now() - timedelta(days=random.randint(1100, 2000))
            row["txn_timestamp"] = stale.strftime("%Y-%m-%d %H:%M:%S")
            count += 1
    gt.temporal_anomaly_count = count
    gt.temporal_anomaly_columns = target_cols
    gt.expected_timeliness = 1.0 - (count / len(rows))
    return rows


# ---------------------------------------------------------------------------
#  Dataset Generation
# ---------------------------------------------------------------------------

def generate_dataset(profile_name: str, profile: dict) -> tuple[str, GroundTruth]:
    """Generate a dataset with the given defect profile. Returns (filepath, ground_truth)."""
    DATASETS_DIR.mkdir(parents=True, exist_ok=True)

    # Generate clean data
    rows = [generate_clean_row(i) for i in range(NUM_ROWS)]

    # Track ground truth
    gt = GroundTruth(total_rows=NUM_ROWS)

    # Inject defects
    rows = inject_missing_values(rows, profile["missing"], gt)
    rows = inject_invalid_values(rows, profile["invalid"], gt)
    rows = inject_format_inconsistencies(rows, profile["format"], gt)
    rows = inject_temporal_anomalies(rows, profile["temporal"], gt)
    rows = inject_duplicates(rows, profile["duplicates"], gt)  # Last, since it adds rows

    gt.total_rows = len(rows)

    # Write CSV
    filepath = DATASETS_DIR / f"payment_data_{profile_name}.csv"
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)

    # Write ground truth
    gt_path = DATASETS_DIR / f"ground_truth_{profile_name}.json"
    with open(gt_path, "w", encoding="utf-8") as f:
        json.dump(asdict(gt), f, indent=2)

    print(f"  ✅ Generated {filepath.name}: {len(rows)} rows, profile={profile_name}")
    return str(filepath), gt


def generate_all_datasets():
    """Generate datasets for all defect profiles."""
    print("\n📦 Generating synthetic payment datasets...\n")
    results = {}
    for name, profile in DEFECT_PROFILES.items():
        filepath, gt = generate_dataset(name, profile)
        results[name] = {"filepath": filepath, "ground_truth": gt}
    print(f"\n✅ Generated {len(results)} datasets in {DATASETS_DIR}/\n")
    return results


# ---------------------------------------------------------------------------
#  Evaluation Runner
# ---------------------------------------------------------------------------

def evaluate_with_dqs_ai(filepath: str) -> Optional[dict]:
    """
    Send a CSV file to the DQS-AI pipeline and get back the analysis results.
    Calls: Server (metadata extraction) → AI Service (GenAI analysis)
    """
    try:
        import requests
    except ImportError:
        print("  ⚠️  Install 'requests' package: pip install requests")
        return None

    # Step 1: Upload CSV to Express server for metadata extraction
    print(f"  📤 Uploading {Path(filepath).name} to server...")
    with open(filepath, "rb") as f:
        resp = requests.post(
            f"{SERVER_URL}/api/csv",
            files={"file": (Path(filepath).name, f, "text/csv")},
            timeout=30,
        )

    if resp.status_code != 200:
        print(f"  ❌ Server error: {resp.status_code} — {resp.text[:200]}")
        return None

    metadata = resp.json()
    print(f"  📊 Metadata extracted: {metadata['dataset']['row_count']} rows, {metadata['dataset']['column_count']} columns")

    # Step 2: Send metadata to AI service for GenAI analysis
    print(f"  🧠 Sending to AI service for analysis...")
    resp2 = requests.post(
        f"{AI_SERVICE_URL}/analyze-dqs",
        json=metadata,
        timeout=60,
    )

    if resp2.status_code != 200:
        print(f"  ❌ AI service error: {resp2.status_code} — {resp2.text[:200]}")
        return None

    result = resp2.json()
    print(f"  ✅ Analysis complete. Composite DQS: {result.get('genai_insights', result).get('composite_dqs', 'N/A')}")
    return {"metadata": metadata, "analysis": result}


def compute_metrics(gt: GroundTruth, analysis: dict) -> dict:
    """Compare DQS-AI results against ground truth."""
    insights = analysis.get("genai_insights", analysis)
    scores = insights.get("dimension_scores", {})
    # Convert list of issues to a dictionary for easier lookup
    issues_list = insights.get("data_quality_issues", [])
    issues = {issue["dimension"]: issue for issue in issues_list if isinstance(issue, dict)}
    if not issues and issues_list and not isinstance(issues_list[0], dict):
        # Handle cases where Pydantic models might be returned (unlikely here but safe)
        issues = {issue.dimension: issue for issue in issues_list}

    metrics = {}

    # --- Score accuracy (MAE) ---
    expected_scores = {
        "Completeness": gt.expected_completeness,
        "Validity": gt.expected_validity,
        "Consistency": gt.expected_consistency,
        "Uniqueness": gt.expected_uniqueness,
        "Timeliness": gt.expected_timeliness,
    }

    score_errors = []
    for dim, expected in expected_scores.items():
        actual = scores.get(dim, 0.0)
        error = abs(expected - actual)
        score_errors.append(error)
        metrics[f"{dim}_expected"] = round(expected, 4)
        metrics[f"{dim}_actual"] = round(actual, 4)
        metrics[f"{dim}_error"] = round(error, 4)

    metrics["mean_absolute_error"] = round(sum(score_errors) / len(score_errors), 4)

    # --- Detection accuracy ---
    # Check which issues were correctly identified
    known_issue_dims = []
    if gt.missing_value_count > 0:
        known_issue_dims.append("Completeness")
    if gt.invalid_value_count > 0:
        known_issue_dims.append("Validity")
    if gt.format_inconsistency_count > 0:
        known_issue_dims.append("Consistency")
    if gt.duplicate_count > 0:
        known_issue_dims.append("Uniqueness")
    if gt.temporal_anomaly_count > 0:
        known_issue_dims.append("Timeliness")

    detected = 0
    for dim in known_issue_dims:
        issue = issues.get(dim, {})
        if issue.get("affected_columns") and len(issue["affected_columns"]) > 0:
            detected += 1

    total_detected_by_system = sum(
        1 for dim_data in issues.values()
        if dim_data.get("affected_columns") and len(dim_data["affected_columns"]) > 0
    )

    tp = detected
    fn = len(known_issue_dims) - detected
    fp = max(0, total_detected_by_system - detected)

    metrics["true_positives"] = tp
    metrics["false_negatives"] = fn
    metrics["false_positives"] = fp
    metrics["precision"] = round(tp / (tp + fp), 4) if (tp + fp) > 0 else 0.0
    metrics["recall"] = round(tp / (tp + fn), 4) if (tp + fn) > 0 else 0.0
    f1 = metrics["precision"] + metrics["recall"]
    metrics["f1_score"] = round(2 * metrics["precision"] * metrics["recall"] / f1, 4) if f1 > 0 else 0.0

    # Composite DQS
    metrics["composite_dqs"] = insights.get("composite_dqs", 0.0)
    metrics["remediation_count"] = len(insights.get("remediation_actions", []))
    metrics["compliance_risks_count"] = len(insights.get("regulatory_compliance_risks", []))

    return metrics


def run_evaluation():
    """Run the full evaluation pipeline."""
    print("\n" + "=" * 60)
    print("🔬 DQS-AI EVALUATION FRAMEWORK")
    print("=" * 60)

    # Step 1: Generate datasets
    datasets = generate_all_datasets()

    # Step 2: Evaluate each dataset
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    all_results = {}

    for profile_name, data in datasets.items():
        print(f"\n{'─' * 40}")
        print(f"📋 Evaluating profile: {profile_name}")
        print(f"{'─' * 40}")

        result = evaluate_with_dqs_ai(data["filepath"])
        if result is None:
            print(f"  ⚠️  Skipping {profile_name} (service unavailable)")
            all_results[profile_name] = {"status": "skipped"}
            continue

        metrics = compute_metrics(data["ground_truth"], result["analysis"])
        all_results[profile_name] = {
            "status": "completed",
            "ground_truth": asdict(data["ground_truth"]),
            "metrics": metrics,
        }

        print(f"\n  📊 Results for '{profile_name}':")
        print(f"     Precision:  {metrics['precision']:.2%}")
        print(f"     Recall:     {metrics['recall']:.2%}")
        print(f"     F1 Score:   {metrics['f1_score']:.2%}")
        print(f"     MAE:        {metrics['mean_absolute_error']:.4f}")
        print(f"     DQS:        {metrics['composite_dqs']}")

    # Step 3: Save results
    results_path = RESULTS_DIR / f"evaluation_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(results_path, "w", encoding="utf-8") as f:
        json.dump(all_results, f, indent=2)
    print(f"\n✅ Full results saved to: {results_path}")

    # Step 4: Print summary table
    print_summary_table(all_results)

    return all_results


def print_summary_table(results: dict):
    """Print a formatted summary of evaluation results."""
    print("\n" + "=" * 70)
    print("📊 EVALUATION SUMMARY")
    print("=" * 70)
    print(f"{'Profile':<10} {'Precision':>10} {'Recall':>10} {'F1':>10} {'MAE':>10} {'DQS':>10}")
    print("─" * 70)

    for profile, data in results.items():
        if data["status"] == "skipped":
            print(f"{profile:<10} {'SKIPPED':>50}")
            continue
        m = data["metrics"]
        print(
            f"{profile:<10}"
            f" {m['precision']:>9.2%}"
            f" {m['recall']:>9.2%}"
            f" {m['f1_score']:>9.2%}"
            f" {m['mean_absolute_error']:>9.4f}"
            f" {m['composite_dqs']:>9.2f}"
        )

    print("=" * 70)


# ---------------------------------------------------------------------------
#  CLI Entry Point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="DQS-AI Evaluation Framework")
    parser.add_argument("--generate-only", action="store_true", help="Only generate datasets")
    parser.add_argument("--evaluate-only", action="store_true", help="Only evaluate existing datasets")
    parser.add_argument("--rows", type=int, default=1000, help="Number of rows per dataset")
    args = parser.parse_args()

    NUM_ROWS = args.rows

    if args.generate_only:
        generate_all_datasets()
    elif args.evaluate_only:
        # Load existing ground truths
        datasets = {}
        for name in DEFECT_PROFILES:
            fp = DATASETS_DIR / f"payment_data_{name}.csv"
            gt_fp = DATASETS_DIR / f"ground_truth_{name}.json"
            if fp.exists() and gt_fp.exists():
                with open(gt_fp) as f:
                    gt_data = json.load(f)
                gt = GroundTruth(**gt_data)
                datasets[name] = {"filepath": str(fp), "ground_truth": gt}

        RESULTS_DIR.mkdir(parents=True, exist_ok=True)
        all_results = {}
        for profile_name, data in datasets.items():
            print(f"\n📋 Evaluating profile: {profile_name}")
            result = evaluate_with_dqs_ai(data["filepath"])
            if result:
                metrics = compute_metrics(data["ground_truth"], result["analysis"])
                all_results[profile_name] = {
                    "status": "completed",
                    "ground_truth": asdict(data["ground_truth"]),
                    "metrics": metrics,
                }
        print_summary_table(all_results)
    else:
        run_evaluation()
