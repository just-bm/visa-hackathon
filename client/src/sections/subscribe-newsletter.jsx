import SectionTitle from "../components/section-title";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
export default function SubscribeNewsletter() {
    return (
        <section className="flex flex-col items-center">
            <SectionTitle title="Stay Updated" description="Receive the latest insights on payments regulation, AI-driven auditing, and data quality best practices." />
            <motion.div className="flex items-center justify-center mt-10 border border-slate-700 focus-within:outline focus-within:outline-indigo-600 text-sm rounded-full h-14 max-w-xl w-full"
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
                <input type="text" className="bg-transparent outline-none rounded-full px-4 h-full flex-1 placeholder:text-slate-400" placeholder="Enter your email address" />
                <button 
                    onClick={() => toast.success("Subscribed! You'll receive our next update.")}
                    className="bg-indigo-600 text-white rounded-full h-11 mr-1 px-10 flex items-center justify-center hover:bg-indigo-700 active:scale-95 transition"
                >
                    Subscribe
                </button>
            </motion.div>
        </section>
    );
}