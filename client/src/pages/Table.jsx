import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTableData, getMongoData } from "../api/api.js";
import { Database, Table as TableIcon, Link2, ShieldCheck, ChevronRight, Sparkles, Loader2, Zap } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const Table = ({ onResult }) => {
  const [mode, setMode] = useState("sql"); // "sql" or "nosql"
  const [dbLink, setDbLink] = useState("");
  const [tableName, setTableName] = useState("");
  const [dbName, setDbName] = useState(""); // For Mongo
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleConnect = async () => {
    if (!dbLink) return;
    if (mode === "sql" && !tableName) return;
    if (mode === "nosql" && (!dbName || !tableName)) return; // tableName used as collectionName
    
    setLoading(true);
    try {
      let result;
      if (mode === "sql") {
        result = await getTableData({ dbLink, tableName });
      } else {
        result = await getMongoData({ dbLink, dbName, collectionName: tableName });
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (onResult) onResult(result);
      toast.success(`${mode === "sql" ? "PostgreSQL" : "MongoDB"} Audit Initialized`);
      navigate("/result", { state: { data: result } });

    } catch (err) {
      console.error("Connection failed", err);
      toast.error(`Failed to connect to ${mode === "sql" ? "PostgreSQL" : "MongoDB"}. Check credentials.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-hidden selection:bg-indigo-500/30">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <svg className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[140%] opacity-50" viewBox="0 0 1440 676" fill="none">
          <rect x="-92" y="-948" width="1624" height="1624" rx="812" fill="url(#db-gradient)" />
          <defs>
            <radialGradient id="db-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(90 428 292)scale(812)">
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
          transition={{ duration: 0.8 }}
        >
          
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div 
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            >
              <Sparkles className="size-3" />
              Hybrid DB Orchestration
            </motion.div>
            <motion.h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                {mode === "sql" ? "SQL" : "NoSQL"} <span className="text-indigo-500 italic">Database</span> Audit
            </motion.h1>
            <motion.p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Connect your {mode === "sql" ? "PostgreSQL" : "MongoDB"} instance directly for real-time transaction monitoring and structural integrity reporting.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Area */}
            <motion.div className="lg:col-span-2">
              <div className="relative bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
                
                {/* Mode Toggle */}
                <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 mb-10 w-fit mx-auto md:mx-0">
                  <button 
                    onClick={() => setMode("sql")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === "sql" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    <Database className="size-4" /> SQL (Postgres)
                  </button>
                  <button 
                    onClick={() => setMode("nosql")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === "nosql" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    <Zap className="size-4" /> NoSQL (MongoDB)
                  </button>
                </div>

                <div className="space-y-8 relative">
                  {/* DB Link Input */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 ml-1">
                      <Link2 className="size-4 text-indigo-400" /> Connection String
                    </label>
                    <input 
                      type="text" 
                      placeholder={mode === "sql" ? "postgresql://user:password@localhost:5432/dbname" : "mongodb+srv://user:pass@cluster.mongodb.net/dbname"}
                      value={dbLink}
                      onChange={(e) => setDbLink(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono text-sm"
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {mode === "nosql" && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 overflow-hidden"
                      >
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 ml-1">
                          <Database className="size-4 text-indigo-400" /> Database Name
                        </label>
                        <input 
                          type="text" 
                          placeholder="e.g. visa_audit_db"
                          value={dbName}
                          onChange={(e) => setDbName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Table/Collection Name Input */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 ml-1">
                      <TableIcon className="size-4 text-indigo-400" /> {mode === "sql" ? "Target Table" : "Collection Name"}
                    </label>
                    <input 
                      type="text" 
                      placeholder={mode === "sql" ? "e.g. public.transactions" : "e.g. transactions_log"}
                      value={tableName}
                      onChange={(e) => setTableName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <button 
                    onClick={handleConnect}
                    disabled={loading || !dbLink}
                    className="w-full group relative flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 disabled:text-slate-500 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Analyzing Schema...
                      </>
                    ) : (
                      <>
                        Initialize {mode === "sql" ? "SQL" : "NoSQL"} Audit
                        <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Sidebar Cards */}
            <div className="space-y-6">
              <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8">
                <h4 className="flex items-center gap-3 text-lg font-bold mb-6 text-indigo-400">
                  <Database className="size-5" /> Connection Specs
                </h4>
                <ul className="space-y-4">
                  {(mode === "sql" ? [
                    "Read-only access required",
                    "SSL/TLS Encryption support",
                    "PostgreSQL 12.0+ supported",
                    "Automatic Schema Mapping"
                  ] : [
                    "MongoDB 4.4+ supported",
                    "Atlas & Local compatible",
                    "BSON to Metadata mapping",
                    "Read-only recommendation"
                  ]).map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                      <div className="size-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/10 rounded-[2rem]">
                <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="size-5 text-indigo-500" />
                    <span className="font-bold text-sm uppercase tracking-wider">Zero-Storage</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  "Your credentials are encrypted in transit and never persisted. Analysis runs against a volatile execution layer."
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Table;
