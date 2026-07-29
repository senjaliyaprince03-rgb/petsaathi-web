"use client";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { Bone, Home, BriefcaseMedical } from "lucide-react";
import MagneticButton from "./MagneticButton";

const services = [
  {
    id: "walking",
    title: "Dog Walking",
    description: "Daily walks with GPS tracking and live photo updates to keep your dog active and happy.",
    icon: Bone,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "sitting",
    title: "Pet Sitting",
    description: "Verified sitters care for your pet in the comfort of your own home while you are away.",
    icon: Home,
    color: "bg-green-100 text-green-600",
  },
  {
    id: "boarding",
    title: "Safe Boarding",
    description: "Your pet stays safely with a verified caregiver, receiving 24/7 care and attention.",
    icon: BriefcaseMedical,
    color: "bg-purple-100 text-purple-600",
  },
];

export default function Services() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Everything your pet needs.
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Professional, verified care for every situation. We&apos;ve got your furry family members covered.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="glass-card rounded-3xl p-8 transition-shadow hover:shadow-2xl hover:shadow-primary-500/10 relative group overflow-hidden"
            >
              {/* Background Glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-6`}>
                  <service.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-heading mb-4 text-foreground">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {service.description}
                </p>
                <MagneticButton intensity={20} className="text-primary-600 font-semibold flex items-center gap-2 hover:text-primary-800">
                  Learn more &rarr;
                </MagneticButton>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
