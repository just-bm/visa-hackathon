import { useState } from "react";
import { motion } from "framer-motion";
import {getTableData} from "../api/api.js";
import { Database, Table as TableIcon, Link2, CheckCircle, BarChart3, ShieldCheck, ChevronRight, Sparkles, Loader2 } from "lucide-react";
// Assuming you have a similar API call for DBs
// import { evaluateDatabase } from "../api/api.js";

const Table = ({ onResult }) => {
  const [dbLink, setDbLink] = useState("");
  const [tableName, setTableName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (!dbLink || !tableName) return;
    setLoading(true);
    try {
      // Logic for your database evaluation API
      // const result = await evaluateDatabase(dbLink, tableName);
      // if (onResult) onResult(result);
      console.log("Connecting to:", dbLink, "Table:", tableName);
      const data = getTableData({ dbLink, tableName });
      console.log(data)
    } catch (err) {
      console.error("Connection failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-hidden selection:bg-indigo-500/30">
      
      {/* Background Glow - Consistent with Csv Component */}
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
              Live DB Orchestration
            </motion.div>
            <motion.h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
              Direct <span className="text-indigo-500 italic">Database</span> Audit
            </motion.h1>
            <motion.p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Connect your PostgreSQL instance directly for real-time transaction monitoring and structural integrity reporting.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Area */}
            <motion.div className="lg:col-span-2">
              <div className="relative bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                
                <div className="space-y-8 relative">
                  {/* DB Link Input */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 ml-1">
                      <Link2 className="size-4 text-indigo-400" /> Connection String
                    </label>
                    <input 
                      type="text" 
                      placeholder="postgresql://user:password@localhost:5432/dbname"
                      value={dbLink}
                      onChange={(e) => setDbLink(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>

                  {/* Table Name Input */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 ml-1">
                      <TableIcon className="size-4 text-indigo-400" /> Target Table
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. public.transactions"
                      value={tableName}
                      onChange={(e) => setTableName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <button 
                    onClick={handleConnect}
                    disabled={loading || !dbLink || !tableName}
                    className="w-full group relative flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 disabled:text-slate-500 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
                  >
                    {loading ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <>
                        Initialize Audit
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
                  {[
                    "Read-only access required",
                    "SSL/TLS Encryption support",
                    "PostgreSQL 12.0+ supported",
                    "Automatic Schema Mapping"
                  ].map((item, i) => (
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