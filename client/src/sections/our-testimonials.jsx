import SectionTitle from "../components/section-title";
import { motion } from "framer-motion";

export default function OurTestimonials() {
    const testimonials = [
        { quote: "DQS-AI's compliance mapping saved our regulatory team weeks of manual reconciliation. The explainable AI is a game-changer.", name: "Sarah Chen", role: "Head of Compliance @ FinPay", image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200", },
        { quote: "Detected a complex 'impossible travel' fraud pattern that we'd missed for months. The composite scoring is intuitive and powerful.", name: "Marcus Thorne", role: "Chief Risk Officer", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200", },
        { quote: "Finally, an AI tool that respects data privacy. Processing only metadata while getting deep insights is exactly what we needed.", name: "Elena Rodriguez", role: "Data Privacy Officer", image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60", },
        { quote: "The remediation roadmap is actionable and precise. It turned our data quality from a liability into a competitive edge.", name: "David Kim", role: "VP of Engineering @ SwiftTransact", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60", },
        { quote: "Seamless integration with our existing data stack. The speed of audit generation is unprecedented in our industry.", name: "James Wilson", role: "Solutions Architect", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop", },
        { quote: "DQS-AI doesn't just find issues; it explains why they matter for our bottom line and regulatory standing.", name: "Aarav Patel", role: "Payment Operations Lead", image: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/userImage/userImage1.png", },
    ];

    return (
        <section className="flex flex-col items-center" id="testimonials">
            <SectionTitle title="Voices from the Industry" description="Leading compliance and risk professionals trust DQS-AI for their most critical payment data audits." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-18 max-w-6xl mx-auto">
                {testimonials.map((testimonial, index) => (
                    <motion.div key={testimonial.name} className="group border border-slate-800 p-6 rounded-xl"
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: `${index * 0.15}`, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <p className="text-slate-100 text-base">{testimonial.quote}</p>
                        <div className="flex items-center gap-3 mt-8 group-hover:-translate-y-1 duration-300">
                            <img className="size-10 rounded-full" src={testimonial.image} alt="user image" />
                            <div>
                                <h2 className="text-gray-200 font-medium">
                                    {testimonial.name}
                                </h2>
                                <p className="text-indigo-500">{testimonial.role}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}