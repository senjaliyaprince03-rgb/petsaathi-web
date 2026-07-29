"use client";

import { motion } from "framer-motion";
import { Search, Users, CreditCard, Bell } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Search & Filter",
    description: "Find verified sitters and walkers near you based on your pet's specific needs.",
    icon: Search,
  },
  {
    num: "02",
    title: "Meet & Greet",
    description: "Connect safely through our platform and arrange a free meet-up before booking.",
    icon: Users,
  },
  {
    num: "03",
    title: "Book Securely",
    description: "Pay through our secure system. Funds are held in escrow until the service is complete.",
    icon: CreditCard,
  },
  {
    num: "04",
    title: "Get Live Updates",
    description: "Relax while receiving GPS routes, photo updates, and daily digital report cards.",
    icon: Bell,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6"
          >
            How it works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-lg max-w-2xl mx-auto"
          >
            A simple, secure, and stress-free process designed for modern pet parents.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-gray-100 z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-full bg-background border-4 border-white shadow-xl flex items-center justify-center mb-8 relative group-hover:scale-110 transition-transform duration-500">
                <step.icon className="w-8 h-8 text-primary-600" />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {step.num}
                </div>
              </div>
              <h3 className="text-2xl font-bold font-heading mb-4 text-foreground">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
