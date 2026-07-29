"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, MapPin, Camera, HeartPulse } from "lucide-react";

const features = [
  {
    title: "100% Verified Caregivers",
    description: "Every sitter passes a strict multi-step background check and interview process.",
    icon: ShieldCheck,
  },
  {
    title: "Live GPS Tracking",
    description: "Follow your dog's route in real-time during walks directly from the app.",
    icon: MapPin,
  },
  {
    title: "Daily Photo Updates",
    description: "Receive delightful photos and detailed report cards for every single booking.",
    icon: Camera,
  },
  {
    title: "24/7 Vet Support",
    description: "Emergency veterinary assistance available during any active booking.",
    icon: HeartPulse,
  },
];

export default function TrustSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <section id="trust" ref={sectionRef} className="py-32 relative overflow-hidden bg-primary-950 text-white">
      {/* Background abstract elements */}
      <motion.div 
        style={{ y }}
        className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full blur-[120px] opacity-30 pointer-events-none"
      />
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]) }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500 rounded-full blur-[120px] opacity-20 pointer-events-none"
      />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-accent-300 text-sm font-semibold mb-6">
                <ShieldCheck className="w-4 h-4" />
                The PetSaathi Trust Promise
              </div>
              <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight">
                Safety isn&apos;t a feature. <br/>
                <span className="text-primary-400">It&apos;s our foundation.</span>
              </h2>
              <p className="text-xl text-primary-100 mb-8 max-w-lg leading-relaxed opacity-80">
                We know how much you love them. That&apos;s why we&apos;ve built the most rigorous trust and safety systems in the Indian pet care market.
              </p>
            </motion.div>
          </div>

          <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center mb-6 text-primary-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-heading mb-3">{feature.title}</h3>
                <p className="text-primary-100/70 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
