import { motion } from "framer-motion";

export default function SectionTitle({ title, description }) {
    const words = title.split(" ");
    const lastWord = words.pop();
    const firstPart = words.join(" ");
    return (
        <div className="flex flex-col items-center mt-32">
            
            <motion.h2 className="text-center text-4xl font-semibold max-w-2xl"
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                {firstPart}{" "}
                <motion.span className="bg-gradient-to-t from-indigo-600 to-black p-1 bg-left inline-block bg-no-repeat"
                    initial={{ backgroundSize: "0% 100%", }}
                    whileInView={{ backgroundSize: "100% 100%", }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.7, ease: "easeInOut" }}
                >
                    {lastWord}
                </motion.span>

            </motion.h2>
            <motion.p className="text-center text-slate-400 max-w-lg mt-3"
                initial={{ y: 120, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
            >
                {description}
            </motion.p>
        </div>
    );
}