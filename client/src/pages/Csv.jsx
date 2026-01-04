import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, BarChart3, X, FileText, ChevronRight, Sparkles } from "lucide-react";
import { evaluateDataset } from "../api/api.js";

const Csv = ({ onResult }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
      setFileName(droppedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const result = await evaluateDataset(file);
      if (onResult) onResult(result);
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-hidden selection:bg-indigo-500/30">
      
      {/* Background Glow - Fixed SVG Integration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <svg className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[140%] opacity-50" viewBox="0 0 1440 676" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="-92" y="-948" width="1624" height="1624" rx="812" fill="url(#hero-gradient)" />
          <defs>
            <radialGradient id="hero-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(90 428 292)scale(812)">
              <stop offset=".63" stopColor="#372AAC" stopOpacity="0" />
              <stop offset="1" stopColor="#372AAC" />
            </radialGradient>
          </defs>
        </svg>
      </div>
            
      <div className="relative z-10 px-6 md:px-16 lg:px-24 xl:px-32 pt-12 pb-20">
        <motion.div 
          className="max-w-6xl mx-auto" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          
          {/* Hero Header */}
          <div className="text-center mb-16">
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
            >
              Is your data <span className="text-indigo-500 italic">ready</span>?
            </motion.h1>
            
            <motion.p 
              className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              Upload your payment datasets for automated integrity checks, anomaly detection, and regulatory compliance scoring.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Area */}
            <motion.div className="lg:col-span-2">
              <div 
                className={`relative group border-[1.5px] rounded-[2.5rem] p-1 transition-all duration-700 
                  ${dragActive ? 'border-indigo-500 bg-indigo-500/5 shadow-[0_0_40px_rgba(79,70,229,0.1)]' : 'border-white/10 bg-white/[0.02]'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="relative border border-dashed border-white/10 rounded-[2.3rem] p-12 flex flex-col items-center overflow-hidden">
                  {/* Grainy Texture Overlay */}
                  <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                  
                  <motion.div 
                    animate={dragActive ? { scale: 1.1 } : { scale: 1 }}
                    className={`p-7 rounded-3xl transition-all duration-500 mb-8 
                    ${fileName ? 'bg-indigo-600 shadow-[0_0_30px_rgba(79,70,229,0.4)]' : 'bg-white/5 border border-white/10'}`}
                  >
                    {fileName ? <FileText className="size-12 text-white" /> : <Upload className="size-12 text-indigo-400" />}
                  </motion.div>
                  
                  <h3 className="text-2xl font-semibold mb-3 tracking-tight">
                    {fileName || "Drop your dataset here"}
                  </h3>
                  
                  <p className="text-slate-500 mb-10 text-center max-w-xs text-sm">
                    {fileName ? "Ready for deep analysis" : "Accepting .CSV files (Max 25MB). All data is processed securely."}
                  </p>

                  <AnimatePresence mode="wait">
                    {!fileName ? (
                      <motion.label 
                        key="browse"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="group px-10 py-4 bg-white text-black font-bold rounded-2xl cursor-pointer hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-xl active:scale-95"
                      >
                        Browse Files
                        <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                        <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
                      </motion.label>
                    ) : (
                      <motion.div 
                        key="actions"
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-wrap justify-center gap-4"
                      >
                        <button 
                          onClick={handleUpload}
                          disabled={loading}
                          className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition shadow-xl shadow-indigo-600/20 flex items-center gap-3 disabled:opacity-50"
                        >
                          {loading ? (
                            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : "Start Analysis"}
                        </button>
                        <button 
                          onClick={() => { setFile(null); setFileName(""); }}
                          className="px-6 py-4 bg-white/5 border border-white/10 text-slate-300 rounded-2xl hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
                        >
                          <X className="size-5" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Sidebar Cards */}
            <div className="space-y-6">
              <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8">
                <h4 className="flex items-center gap-3 text-lg font-bold mb-6 text-indigo-400">
                  <BarChart3 className="size-5" /> Audit Metrics
                </h4>
                <div className="space-y-4">
                  {[
                    "Data Completeness",
                    "Transaction Consistency",
                    "Anomaly Intelligence",
                    "Schema Validation"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                      <div className="size-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/10 rounded-[2rem]">
                <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="size-5 text-indigo-500" />
                    <span className="font-bold text-sm uppercase tracking-wider">Privacy First</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  "Your data is processed locally within our secure VPC. We ensure SOC2 compliance across all analysis pipelines."
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Csv;