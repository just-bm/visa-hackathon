import React from "react";
import { motion } from "framer-motion";
import {
    BarChart3, AlertTriangle, CheckCircle2, RefreshCcw,
    ShieldAlert, Activity, ArrowLeft, Zap, ListChecks, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router";

// Hardcoded data based on your JSON
const HARDCODED_DATA = {
    "status": "success",
    "genai_insights": {
        "data_quality_issues": {
            "Completeness": {
                "issue": "Missing KYC Tier Attribution",
                "affected_columns": ["beneficiary_account_type", "source_of_funds_code"],
                "description": "22% of cross-border transfers lack mandatory 'Source of Funds' declaration, violating FATF Recommendation 16."
            },
            "Accuracy": {
                "issue": "Currency Conversion Rounding Errors",
                "affected_columns": ["fx_rate_applied", "settlement_amount_usd"],
                "description": "Detected a 0.004% variance in decimal precision for JPY to USD conversions, resulting in a $14,200 discrepancy across the batch."
            },
            "Consistency": {
                "issue": "Cross-Network MID Mismatch",
                "affected_columns": ["merchant_id", "terminal_id"],
                "description": "Merchant IDs from the 'Visa-Direct' channel do not match the Master Merchant Registry format for 1,200 records."
            },
            "Validity": {
                "issue": "Impossible Transaction Velocity",
                "affected_columns": ["card_proxy_id", "geo_location_ip"],
                "description": "Detected 'Impossible Travel' anomalies: same Card Proxy used in London and Singapore within a 4-minute window."
            },
            "Timeliness": {
                "issue": "Settlement Batch Lag",
                "affected_columns": ["auth_timestamp", "clearing_date"],
                "description": "Clearing delay exceeds 48-hour banking window for 15% of weekend transactions, affecting liquidity forecasting."
            },
            "Uniqueness": {
                "issue": "Ghost Authorization Duplication",
                "affected_columns": ["retrieval_ref_number"],
                "description": "High volume of identical RRNs (Retrieval Reference Numbers) detected, indicating potential replay attacks or POS software bugs."
            },
            "Integrity": {
                "issue": "Broken Parent-Child Transaction Links",
                "affected_columns": ["refund_original_txn_id"],
                "description": "84 refund records are 'orphaned,' meaning they reference original Transaction IDs that do not exist in the primary ledger."
            }
        },
        "remediation_actions": [
            {
                "action": "Force Multi-Factor KYC Re-validation",
                "priority": 1,
                "description": "Quarantine all records missing 'Source of Funds' and trigger automated KYC refresh for affected accounts."
            },
            {
                "action": "Update FX Precision Logic",
                "priority": 2,
                "description": "Standardize rounding to 8 decimal places across all micro-service conversion layers to stop balance leakage."
            },
            {
                "action": "Deploy Velocity Firewall",
                "priority": 3,
                "description": "Implement real-time geo-location fencing to block 'Impossible Travel' transactions at the authorization gateway."
            }
        ],
        "regulatory_compliance_risks": [
            "CRITICAL: Potential AML (Anti-Money Laundering) breach detected. Missing beneficiary data and high-velocity travel anomalies pose a high risk for FINCEN reporting."
        ],
        "composite_dqs": 0.61, // Lowered to reflect high risk
        "dimension_scores": {
            "Completeness": 0.58,
            "Validity": 0.45, // Very low due to "Impossible Travel"
            "Consistency": 0.72,
            "Timeliness": 0.89,
            "Uniqueness": 0.64,
            "Accuracy": 0.96
        }
    }
};

const ResultTable = ({ result = HARDCODED_DATA }) => {
    const navigate = useNavigate();

    // Safety check in case the passed prop is null
    const finalResult = result || HARDCODED_DATA;

    if (!finalResult || !finalResult.genai_insights) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4">
                <ShieldAlert className="size-16 text-indigo-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Analysis Results Found</h2>
                <p className="text-slate-400 mb-6 text-center max-w-md">
                    Please upload a dataset to generate a quality audit report.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full font-medium transition-colors"
                >
                    Return Home
                </button>
            </div>
        );
    }

    const { genai_insights } = finalResult;
    const { dimension_scores, data_quality_issues, remediation_actions, composite_dqs, regulatory_compliance_risks } = genai_insights;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-hidden selection:bg-indigo-500/30">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 px-6 md:px-16 lg:px-24 xl:px-32 pt-12 pb-20">
                <motion.div
                    className="max-w-7xl mx-auto"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    {/* Top Navigation */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Audit
                    </button>
                    <div className="flex items-center justify-between mb-8">
    {/* Top Navigation */}
    <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
    >
        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
        Back to Audit
    </button>

    {/* Enhanced Login Button */}
    <button onClick={() => navigate('/chat')} className="relative overflow-hidden group px-8 py-2 rounded-full bg-white/5 border border-white/10 text-slate-200 text-sm font-bold tracking-wide transition-all duration-300 hover:bg-white/10 hover:border-indigo-500/50 hover:text-white hover:shadow-[0_0_20px_rgba(79,70,229,0.2)] active:scale-95">
        <span className="relative z-10 flex items-center gap-2">
            Chat with Ai for more Clarity
            <ChevronRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
        </span>
        {/* Subtle shine effect */}
        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
            <div className="relative h-full w-8 bg-white/10" />
        </div>
    </button>
</div>

                    {/* Header Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
                        <motion.div variants={cardVariants} className="lg:col-span-2 bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <span className="text-indigo-400 text-sm font-medium flex items-center gap-2 mb-2">
                                    <Activity className="size-4" /> Composite Quality Score
                                </span>
                                <h2 className="text-6xl font-bold">{(composite_dqs * 100).toFixed(0)}%</h2>
                                <p className="text-slate-400 mt-4 max-w-sm">Global structural integrity rating based on weighted GenAI analysis.</p>
                            </div>
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Zap className="size-32 text-indigo-500" />
                            </div>
                        </motion.div>

                        {/* Compliance Risk Card */}
                        <motion.div variants={cardVariants} className="lg:col-span-2 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <span className="text-red-400 text-sm font-medium flex items-center gap-2 mb-4">
                                <ShieldAlert className="size-4" /> Regulatory Compliance Risk
                            </span>
                            <p className="text-slate-300 text-lg leading-relaxed italic">
                                "{regulatory_compliance_risks[0]}"
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Dimension Breakdown */}
                        <motion.div variants={cardVariants} className="space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-3 ml-2">
                                <BarChart3 className="size-5 text-indigo-400" /> Dimension Scores
                            </h3>
                            <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-6 space-y-6">
                                {Object.entries(dimension_scores).map(([key, value]) => (
                                    <div key={key} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">{key}</span>
                                            <span className="text-indigo-400 font-mono">{(value * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${value * 100}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quality Issues List */}
                        <motion.div variants={cardVariants} className="lg:col-span-2 space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-3 ml-2">
                                <AlertTriangle className="size-5 text-amber-400" /> Detected Anomalies
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(data_quality_issues).map(([key, data]) => (
                                    data.affected_columns.length > 0 && (
                                        <div key={key} className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 rounded-3xl p-6 transition-all">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h4 className="font-bold text-lg text-slate-200">{key} Issue</h4>
                                                    <p className="text-amber-400/80 text-sm font-medium">{data.issue}</p>
                                                </div>
                                                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] uppercase tracking-widest text-slate-500">
                                                    Criticality: High
                                                </div>
                                            </div>
                                            <p className="text-slate-400 text-sm mb-4 leading-relaxed">{data.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {data.affected_columns.map(col => (
                                                    <span key={col} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300 text-xs">
                                                        {col}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>

                            {/* Remediation Strategy */}
                            <h3 className="text-xl font-bold flex items-center gap-3 ml-2 pt-6">
                                <ListChecks className="size-5 text-emerald-400" /> Remediation Roadmap
                            </h3>
                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] p-8">
                                <div className="space-y-8">
                                    {remediation_actions.sort((a, b) => a.priority - b.priority).map((item, idx) => (
                                        <div key={idx} className="flex gap-6">
                                            <div className="flex flex-col items-center">
                                                <div className="size-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
                                                    {item.priority}
                                                </div>
                                                {idx !== remediation_actions.length - 1 && <div className="w-px h-full bg-white/10 my-2" />}
                                            </div>
                                            <div className="pb-2">
                                                <h5 className="font-bold text-slate-200 mb-1">{item.action}</h5>
                                                <p className="text-slate-500 text-sm">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ResultTable;