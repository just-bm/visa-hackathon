import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Bot, User, Sparkles, Trash2, Loader2 
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HARDCODED_DATA } from "./Result";

const Chatbot = ({ auditContext }) => {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Audit complete. I've analyzed your data. How can I help you interpret these findings?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Initialize Gemini (In production, use a backend proxy to hide this key!)
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Create a context-aware prompt
      const systemPrompt = `
        You are an expert Data Quality Auditor. 
        Context of the current audit:
        - Composite Quality Score: ${72}%
        - Dimension Scores: ${62}
        - Detected Issues: ${12}
        - Regulatory Risks: ${15}
        
        Answer user questions based on this data. Be concise, technical, and helpful.
         "status": "success",
    "genai_insights": {
        "data_quality_issues": {
            "Completeness": {
                "issue": "Some columns have high null ratios",
                "affected_columns": [
                    "customer_id",
                    "amount",
                    "kyc_address"
                ],
                "description": "The columns customer_id, amount, and kyc_address have null ratios of 0.0012, 0.0005, and 0.22 respectively, indicating some missing values."
            },
            "Accuracy": {
                "issue": "No specific accuracy issues detected",
                "affected_columns": [],
                "description": "No specific accuracy issues detected, but some data may be incorrect or inconsistent."
            },
            "Consistency": {
                "issue": "Inconsistent data formats",
                "affected_columns": [
                    "currency"
                ],
                "description": "The currency column has both 'INR' and 'inr' values, indicating inconsistent data formats."
            },
            "Validity": {
                "issue": "Some values may not be valid",
                "affected_columns": [
                    "amount",
                    "txn_timestamp"
                ],
                "description": "The amount column has a negative value ratio of 0.015 and a min value of -50.0, indicating some potentially invalid values. The txn_timestamp column has a future timestamp ratio of 0.02 and a stale record ratio of 0.18."
            },
            "Timeliness": {
                "issue": "Some records may be stale or have future timestamps",
                "affected_columns": [
                    "txn_timestamp"
                ],
                "description": "The txn_timestamp column has a future timestamp ratio of 0.02 and a stale record ratio of 0.18, indicating some records may not be up-to-date."
            },
            "Uniqueness": {
                "issue": "Some columns have low uniqueness ratios",
                "affected_columns": [
                    "customer_id",
                    "amount",
                    "kyc_address"
                ],
                "description": "The columns customer_id, amount, and kyc_address have unique ratios of 0.42, 0.23, and 0.76 respectively, indicating some duplicate values."
            },
            "Integrity": {
                "issue": "No specific integrity issues detected",
                "affected_columns": [],
                "description": "No specific integrity issues detected."
            }
        },
        "remediation_actions": [
            {
                "action": "Validate and correct inconsistent data formats",
                "priority": 1,
                "description": "Validate and correct inconsistent data formats in the currency column."
            },
            {
                "action": "Verify and correct potentially invalid values",
                "priority": 2,
                "description": "Verify and correct potentially invalid values in the amount and txn_timestamp columns."
            },
            {
                "action": "Handle missing values",
                "priority": 3,
                "description": "Handle missing values in the customer_id, amount, and kyc_address columns."
            }
        ],
        "regulatory_compliance_risks": [
            "KYC and AML regulations may be impacted by inconsistent or invalid data in the kyc_address and customer_id columns."
        ],
        "composite_dqs": 0.72,
        "dimension_scores": {
            "Completeness": 0.7,
            "Validity": 0.75,
            "Consistency": 0.8,
            "Timeliness": 0.85,
            "Uniqueness": 0.9,
            "Accuracy": 0.0
        }
      `;

      const result = await model.generateContent([systemPrompt, ...messages.map(m => `${m.role}: ${m.content}`), input]);
      const response = await result.response;
      const text = response.text();

      setMessages((prev) => [...prev, { role: "bot", content: text }]);
    } catch (err) {
      console.error("Gemini Error:", err);
      setMessages((prev) => [...prev, { role: "bot", content: "I encountered an error connecting to the logic engine. Please check your API key." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: "bot", content: "Chat history cleared. How can I help with the audit?" }]);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto bg-white/[0.02] border border-white/10 rounded-[2.5rem] backdrop-blur-xl overflow-hidden relative shadow-2xl">
      {/* Subtle Internal Glow */}
      <div className="absolute -top-24 -right-24 size-64 bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none" />
      
      {/* Chat Header */}
      <div className="px-8 py-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Sparkles className="size-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 flex items-center gap-2">
              Audit Intelligence
              <span className="size-2 bg-emerald-500 rounded-full animate-pulse" />
            </h3>
            <p className="text-xs text-slate-500">Powered by Gemini 1.5</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={clearChat}
            className="p-2 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-400 transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`size-8 rounded-lg flex-shrink-0 flex items-center justify-center border ${
                  msg.role === "user" 
                  ? "bg-indigo-600 border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.4)]" 
                  : "bg-white/5 border-white/10"
                }`}>
                  {msg.role === "user" ? <User size={14} className="text-white" /> : <Bot size={14} className="text-indigo-400" />}
                </div>
                <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user" 
                  ? "bg-indigo-600/20 border border-indigo-500/30 text-indigo-50" 
                  : "bg-white/5 border border-white/10 text-slate-300"
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <Loader2 size={14} className="text-indigo-400 animate-spin" />
              </div>
              <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex gap-1.5">
                  <span className="size-1.5 bg-indigo-500/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="size-1.5 bg-indigo-500/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="size-1.5 bg-indigo-500/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white/[0.02] border-t border-white/10 relative z-10">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about data validity or remediation steps..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pr-14 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-3 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
          >
            {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot; 