import { motion } from "framer-motion";

export default function Footer() {
    return (
        <motion.footer className="px-6 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-slate-400 mt-40"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 border-t border-slate-800 pt-16">
                <div className="sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-2">
                        <img className="h-8 w-auto" src="/assets/logo.svg" width={138} height={36} alt="logo" />
                        <span className="text-xl font-bold text-white tracking-tight">DQS-AI</span>
                    </div>
                    <p className="text-sm/7 mt-6 max-w-sm">
                        GenAI-Powered Data Quality Scoring Agent for Payments. Standardizing integrity, transparency, and compliance in global financial datasets.
                    </p>
                </div>
                <div className="flex flex-col lg:items-center lg:justify-center">
                    <div className="flex flex-col text-sm space-y-2.5">
                        <h2 className="font-semibold mb-5 text-white underline decoration-indigo-500 underline-offset-8">Resources</h2>
                        <a className="hover:text-indigo-400 transition" href="/#docs">Documentation</a>
                        <a className="hover:text-indigo-400 transition" href="/#paper">Research Paper</a>
                        <a className="hover:text-indigo-400 transition" href="https://github.com/Balaji-R-05/visa-hackathon">GitHub Repository</a>
                        <a className="hover:text-indigo-400 transition" href="/#api">API Reference</a>
                    </div>
                </div>
                <div>
                    <h2 className="font-semibold text-white mb-5 underline decoration-indigo-500 underline-offset-8">Shaastra 2026</h2>
                    <div className="text-sm space-y-4 max-w-sm">
                        <p>Built for the 24-Hour AI Hackathon (Visa Track) at IIT Madras.</p>
                        <div className="flex items-center gap-4 mt-4">
                           <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-indigo-400 border border-slate-700">Payments</span>
                           <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-indigo-400 border border-slate-700">GenAI</span>
                           <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-indigo-400 border border-slate-700">RegTech</span>
                        </div>
                    </div>
                </div>
            </div>
            <p className="py-8 text-center border-t mt-12 border-slate-800 text-xs">
                Copyright 2026 © DQS-AI. All Rights Reserved. Built with ❤️ for Shaastra.
            </p>
        </motion.footer>
    );
};