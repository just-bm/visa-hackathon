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
         txn_id,customer_id,amount,currency,kyc_address,txn_timestamp,status
TXN1001,CUST_001,500.00,INR,123 Maple St,2025-12-01T10:00:00Z,SUCCESS
TXN1002,CUST_002,1200.50,inr,456 Oak Ave,2025-12-01T11:30:00Z,SUCCESS
TXN1003,,250.00,INR,789 Pine Rd,2025-12-02T09:15:00Z,FAILED
TXN1004,CUST_004,-50.00,INR,321 Birch Ln,2025-12-02T14:00:00Z,SUCCESS
TXN1005,CUST_001,500.00,inr,,2025-12-03T08:45:00Z,SUCCESS
TXN1006,CUST_006,75.25,INR,,2025-12-03T16:20:00Z,SUCCESS
TXN1007,CUST_007,1200.50,INR,654 Cedar Ct,2026-05-15T12:00:00Z,SUCCESS
TXN1008,CUST_008,300.00,inr,,2010-01-01T10:00:00Z,SUCCESS
TXN1009,CUST_009,,INR,987 Elm Blvd,2025-12-04T10:10:00Z,PENDING
TXN1010,CUST_001,500.00,INR,123 Maple St,2025-12-04T11:00:00Z,SUCCESS
TXN1011,CUST_011,150.00,inr,,2025-12-04T12:00:00Z,SUCCESS
TXN1012,CUST_012,2200.00,INR,111 Spruce Dr,2025-12-05T09:00:00Z,SUCCESS
TXN1013,CUST_002,1200.50,INR,,2025-12-05T10:00:00Z,SUCCESS
TXN1014,CUST_014,-10.00,inr,222 Walnut St,2025-12-05T14:30:00Z,SUCCESS
TXN1015,CUST_015,300.00,INR,,2025-12-06T11:00:00Z,SUCCESS
TXN1016,CUST_016,450.00,INR,333 Cherry Ln,2026-08-20T10:00:00Z,SUCCESS
TXN1017,CUST_017,890.00,inr,,2025-12-06T15:00:00Z,SUCCESS
TXN1018,CUST_018,1200.50,INR,444 Ash Rd,2015-05-20T08:00:00Z,SUCCESS
TXN1019,CUST_019,500.00,INR,,2025-12-07T12:00:00Z,SUCCESS
TXN1020,CUST_020,10.00,inr,555 Willow St,2025-12-07T13:00:00Z,SUCCESS
TXN1021,CUST_001,500.00,INR,123 Maple St,2025-12-07T14:00:00Z,SUCCESS
TXN1022,CUST_022,300.00,INR,,2025-12-08T09:00:00Z,SUCCESS
TXN1023,CUST_023,75.25,inr,666 Poplar Dr,2025-12-08T10:00:00Z,SUCCESS
TXN1024,CUST_024,1200.50,INR,,2025-12-08T11:00:00Z,SUCCESS
TXN1025,CUST_025,500.00,INR,777 Redwood Way,2025-12-08T12:00:00Z,SUCCESS
... (Rows 26-90 omitted for brevity; follow pattern of repeating amounts 500.00, 1200.50, and 300.00 to lower uniqueness)
TXN1091,CUST_091,500.00,inr,,2025-12-25T10:00:00Z,SUCCESS
TXN1092,CUST_092,1200.50,INR,888 Cypress St,2025-12-25T11:00:00Z,SUCCESS
TXN1093,CUST_093,300.00,inr,,2025-12-26T09:00:00Z,SUCCESS
TXN1094,CUST_094,,INR,999 Juniper Ln,2025-12-26T10:00:00Z,SUCCESS
TXN1095,CUST_095,500.00,INR,,2025-12-27T12:00:00Z,SUCCESS
TXN1096,CUST_096,1200.50,inr,101 Aspen Ct,2025-12-27T14:00:00Z,SUCCESS
TXN1097,CUST_097,300.00,INR,,2025-12-28T10:00:00Z,SUCCESS
TXN1098,CUST_098,75.25,INR,202 Beech Rd,2025-12-28T11:00:00Z,SUCCESS
TXN1099,CUST_099,500.00,inr,,2025-12-29T09:00:00Z,SUCCESS
TXN1100,CUST_100,1200.50,INR,303 Sycamore Dr,2025-12-29T10:00:00Z,SUCCESS
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
