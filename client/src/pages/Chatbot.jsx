import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Bot, User, Sparkles, Trash2, Loader2 
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { chatWithAIStream } from "../api/api";

const Chatbot = ({ auditContext }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("dqs_chat_history");
    return saved ? JSON.parse(saved) : [
      { role: "bot", content: "Audit complete. I've analyzed your data. How can I help you interpret these findings?" }
    ];
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Persist chat history
  useEffect(() => {
    localStorage.setItem("dqs_chat_history", JSON.stringify(messages));
  }, [messages]);

  // Robust Auto-scroll logic
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const currentInput = input;
    const userMessage = { role: "user", content: currentInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Initial bot message for streaming
    setMessages((prev) => [...prev, { role: "bot", content: "" }]);

    try {
      await chatWithAIStream({
        auditContext: auditContext,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        userInput: currentInput,
        onChunk: (chunk) => {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            return [...prev.slice(0, -1), { ...last, content: last.content + chunk }];
          });
          setIsTyping(false); // Stop loader once we start getting tokens
        }
      });
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages((prev) => [
        ...prev.slice(0, -1), 
        { role: "bot", content: "I encountered an error connecting to the AI Auditor engine. Please try again later." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    const initialMessage = [{ role: "bot", content: "Chat history cleared. How can I help with the audit?" }];
    setMessages(initialMessage);
    localStorage.removeItem("dqs_chat_history");
  };

  const suggestedQuestions = [
    "What are the top 3 critical issues?",
    "Explain the compliance risks.",
    "Show remediation priority.",
  ];

  const handleSuggestedClick = (q) => {
    setInput(q);
  };

  if (!auditContext) {
    return (
      <div className="flex flex-col min-h-[600px] h-[85vh] w-full max-w-6xl mx-auto bg-white/[0.02] border border-white/10 rounded-[2.5rem] backdrop-blur-xl items-center justify-center p-12 text-center">
        <div className="size-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
          <Bot className="size-10 text-indigo-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No Audit context found</h3>
        <p className="text-slate-400 max-w-sm mb-8">
          Please upload a dataset or connect to a data source first so I can analyze the results and answer your questions.
        </p>
        <button 
          onClick={() => window.location.href = '/csv'}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition-all"
        >
          Go to Audit
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[85vh] w-full max-w-6xl mx-auto bg-white/[0.02] border border-white/10 rounded-[2.5rem] backdrop-blur-xl overflow-hidden relative shadow-2xl">
      <div className="absolute -top-24 -right-24 size-64 bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none" />
      
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
            <p className="text-xs text-slate-500">Real-time Analysis</p>
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

      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-4 max-w-[90%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
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
                  {msg.role === "bot" ? (
                    <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-table:border prose-table:border-white/10 prose-th:bg-white/5 prose-th:px-2 prose-td:px-2">
                       <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content || (isTyping && idx === messages.length - 1 ? "..." : "")}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && messages[messages.length - 1]?.content === "" && (
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

      <div className="p-6 bg-white/[0.02] border-t border-white/10 relative z-10">
        {!isTyping && messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSuggestedClick(q)}
                className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-slate-400 transition-all active:scale-95"
              >
                {q}
              </button>
            ))}
          </div>
        )}
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
