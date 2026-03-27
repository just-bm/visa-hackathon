import SectionTitle from "../components/section-title";
import { motion } from "framer-motion";

export default function TrustedCompanies() {
    return (
        <section className="flex flex-col items-center">
            <SectionTitle title="Global Security Standards" description="DQS-AI is designed to integrate with the most rigorous financial data environments." />
            <motion.div className="relative max-w-5xl py-20 md:py-26 mt-18 md:w-full overflow-hidden mx-2 md:mx-auto border border-indigo-900 flex flex-col md:flex-row items-center justify-around bg-gradient-to-br from-[#401B98]/5 to-[#180027]/10 rounded-3xl p-4 md:p-10 text-white"
                initial={{ y: 150, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                <div className="absolute pointer-events-none top-10 -z-1 left-20 size-64 bg-gradient-to-br from-[#536DFF] to-[#4F39F6]/60 blur-[180px]"></div>
                <div className="absolute pointer-events-none bottom-10 -z-1 right-20 size-64 bg-gradient-to-br from-[#536DFF] to-[#4F39F6]/60 blur-[180px]"></div>
                <div className="flex flex-col items-center md:items-start max-md:text-center">
                    <div className="group flex items-center gap-2 rounded-full text-sm p-1 pr-3 text-indigo-300 bg-indigo-200/15">
                        <span className="bg-indigo-600 text-white text-xs px-3.5 py-1 rounded-full">
                            ENTERPRISE
                        </span>
                        <p className="flex items-center gap-1">
                            <span>Schedule a secure pilot audit </span>
                        </p>
                    </div>
                    <h1 className="text-3xl font-medium max-w-xl mt-5 bg-gradient-to-r from-white to-[#b6abff] text-transparent bg-clip-text">Trusted by leading financial institutions.</h1>
                    <p className="text-base text-slate-400 max-w-lg mt-4">
                        Built to integrate effortlessly with your existing data warehouses, SIEM tools, and compliance workflows.
                    </p>
                    <button className="flex items-center gap-1 text-sm px-6 py-2.5 border border-indigo-400 hover:bg-indigo-300/10 active:scale-95 transition rounded-full mt-6">
                        Case Studies
                        <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.4243 5.42426C12.6586 5.18995 12.6586 4.81005 12.4243 4.57574L8.60589 0.757359C8.37157 0.523045 7.99167 0.523045 7.75736 0.757359C7.52304 0.991674 7.52304 1.37157 7.75736 1.60589L11.1515 5L7.75736 8.39411C7.52304 8.62843 7.52304 9.00833 7.75736 9.24264C7.99167 9.47696 8.37157 9.47696 8.60589 9.24264L12.4243 5.42426ZM0 5L0 5.6L12 5.6V5V4.4L0 4.4L0 5Z" fill="white" />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center md:justify-start gap-12 md:gap-20 opacity-80 hover:opacity-100 transition-opacity duration-500">
                    {/* Visa Official SVG */}
                    <div className="flex flex-col items-center gap-1">
                        <svg className="h-12 md:h-14 w-auto fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z"/>
                        </svg>
                    </div>

                    {/* Mastercard Official SVG */}
                    <div className="flex flex-col items-center gap-1">
                        <svg className="h-12 md:h-14 w-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.343 18.031c.058.049.12.098.181.146-1.177.783-2.59 1.238-4.107 1.238C3.32 19.416 0 16.096 0 12c0-4.095 3.32-7.416 7.416-7.416 1.518 0 2.931.456 4.105 1.238-.06.051-.12.098-.165.15C9.6 7.489 8.595 9.688 8.595 12c0 2.311 1.001 4.51 2.748 6.031z" fill="#EB001B"/>
                            <path d="M16.584 4.584c-1.52 0-2.931.456-4.105 1.238.06.051.12.098.165.15C14.4 7.489 15.405 9.688 15.405 12c0 2.31-1.001 4.507-2.748 6.031-.058.049-.12.098-.181.146 1.177.783 2.588 1.238 4.107 1.238C20.68 19.416 24 16.096 24 12c0-4.094-3.32-7.416-7.416-7.416z" fill="#F79E1B"/>
                            <path d="M12 6.174c-.096.075-.189.15-.28.231C10.156 7.764 9.169 9.765 9.169 12c0 2.236.987 4.236 2.551 5.595.09.08.185.158.28.232.096-.074.189-.152.28-.232 1.563-1.359 2.551-3.359 2.551-5.595 0-2.235-.987-4.236-2.551-5.595-.09-.08-.184-.156-.28-.231z" fill="#FF5F00"/>
                        </svg>
                    </div>

                    {/* NPCI Reliable SVG Logo */}
                    <div className="flex items-center gap-1">
                        <span className="text-white font-black italic tracking-tighter text-2xl md:text-3xl">NPCI</span>
                        <svg className="h-4 md:h-5 w-auto fill-indigo-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2l10 10-10 10v-20z"/>
                        </svg>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}