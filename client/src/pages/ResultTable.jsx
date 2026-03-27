import React from "react";
import { motion } from "framer-motion";
import {
    BarChart3, AlertTriangle, CheckCircle2, RefreshCcw,
    ShieldAlert, Activity, ArrowLeft, Zap, ListChecks, ChevronRight, Printer
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";

const ResultTable = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Support both prop-based and location-based data (for different navigation paths)
    const result = location.state?.data;
    const data = result?.genai_insights || result;

    const handlePrint = () => {
        window.print();
    };

    if (!data || !data.dimension_scores) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4">
                <ShieldAlert className="size-16 text-indigo-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Analysis Results Found</h2>
                <p className="text-slate-400 mb-6 text-center max-w-md">
                    Please upload a dataset or use sample data to generate a quality audit report.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full font-medium transition-colors"
                    >
                        Return Home
                    </button>
                    <button
                        onClick={() => navigate('/csv')}
                        className="px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full font-medium transition-colors"
                    >
                        Go to Audit
                    </button>
                </div>
            </div>
        );
    }

    const { dimension_scores, data_quality_issues, remediation_actions, composite_dqs, regulatory_compliance_risks } = data;

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

            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; color: black !important; }
                    .print-card { border: 1px solid #eee !important; background: white !important; color: black !important; break-inside: avoid; }
                    .text-slate-400, .text-slate-500 { color: #666 !important; }
                    .text-indigo-400, .text-indigo-500 { color: #4f46e5 !important; }
                    .bg-white\\/\\[0\\.02\\], .bg-white\\/\\[0\\.03\\] { background: #f9fafb !important; }
                }
            `}} />

            <div className="relative z-10 px-6 md:px-16 lg:px-24 xl:px-32 pt-12 pb-20">
                <motion.div
                    className="max-w-7xl mx-auto"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    {/* Top Navigation & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 no-print">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                        >
                            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Audit
                        </button>
                        
                        <div className="flex gap-3">
                            <button 
                                onClick={handlePrint}
                                className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95"
                            >
                                <Printer size={16} /> Print Report
                            </button>
                            <button 
                                onClick={() => navigate('/chat')} 
                                className="relative overflow-hidden group px-8 py-2 rounded-full bg-indigo-600 text-white text-sm font-bold tracking-wide transition-all duration-300 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-95"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Chat with AI
                                    <ChevronRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Header Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
                        <motion.div variants={cardVariants} className="print-card lg:col-span-2 bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <span className="text-indigo-400 text-sm font-medium flex items-center gap-2 mb-2">
                                    <Activity className="size-4" /> Composite Quality Score
                                </span>
                                <h2 className="text-6xl font-bold">{(composite_dqs * 100).toFixed(0)}%</h2>
                                <p className="text-slate-400 mt-4 max-w-sm">Global structural integrity rating based on weighted GenAI analysis.</p>
                            </div>
                            <div className="absolute top-0 right-0 p-8 opacity-10 no-print">
                                <Zap className="size-32 text-indigo-500" />
                            </div>
                        </motion.div>

                        {/* Compliance Risk Card */}
                        <motion.div variants={cardVariants} className="print-card lg:col-span-2 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-8 backdrop-blur-xl">
                            <span className="text-red-400 text-sm font-medium flex items-center gap-2 mb-4">
                                <ShieldAlert className="size-4" /> Regulatory Compliance Risk
                            </span>
                            <p className="text-slate-300 text-lg leading-relaxed italic">
                                "{regulatory_compliance_risks?.[0] || 'No immediate critical regulatory risks identified.'}"
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Dimension Breakdown */}
                        <motion.div variants={cardVariants} className="space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-3 ml-2">
                                <BarChart3 className="size-5 text-indigo-400" /> Dimension Scores
                            </h3>
                            <div className="print-card bg-white/[0.02] border border-white/10 rounded-[2rem] p-6 space-y-6">
                                {Object.entries(dimension_scores).map(([key, value]) => (
                                    <div key={key} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">{key}</span>
                                            <span className="text-indigo-400 font-mono">{(value * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden no-print">
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
                                {(data_quality_issues || []).map((data, index) => (
                                    data?.affected_columns?.length > 0 && data.issue !== "No issues identified" && (
                                        <div key={data.dimension || index} className="print-card group bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 rounded-3xl p-6 transition-all">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h4 className="font-bold text-lg text-slate-200">{data.dimension} Issue</h4>
                                                    <p className="text-amber-400/80 text-sm font-medium">{data.issue}</p>
                                                </div>
                                                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] uppercase tracking-widest text-slate-500 no-print">
                                                    Criticality: High
                                                </div>
                                            </div>
                                            <p className="text-slate-400 text-sm mb-4 leading-relaxed">{data.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {(data.affected_columns || []).map(col => (
                                                    <span key={col} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300 text-xs">
                                                        {col}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                ))}
                                {(!data_quality_issues || data_quality_issues.length === 0) && (
                                    <div className="text-slate-500 italic p-4">No significant anomalies detected in this session.</div>
                                )}
                            </div>

                            {/* Remediation Strategy */}
                            <h3 className="text-xl font-bold flex items-center gap-3 ml-2 pt-6">
                                <ListChecks className="size-5 text-emerald-400" /> Remediation Roadmap
                            </h3>
                            <div className="print-card bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] p-8">
                                <div className="space-y-8">
                                    {(remediation_actions || []).sort((a, b) => a.priority - b.priority).map((item, idx) => (
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