"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import MagneticButton from "./MagneticButton";

const plans = [
  {
    name: "Standard Walk",
    price: "₹199",
    duration: "per 30 min",
    features: [
      "GPS tracking",
      "Pee & poop updates",
      "Post-walk report card",
      "Verified walker",
    ],
    popular: false,
  },
  {
    name: "Premium Boarding",
    price: "₹799",
    duration: "per night",
    features: [
      "24/7 care in a verified home",
      "Daily photo & video updates",
      "Emergency vet coverage",
      "Meet & greet included",
    ],
    popular: true,
  },
  {
    name: "House Sitting",
    price: "₹599",
    duration: "per day",
    features: [
      "Pet care in your home",
      "Home security presence",
      "Plant watering included",
      "Detailed daily reports",
    ],
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-background relative">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-foreground">
            Transparent Pricing
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            No hidden fees. Just trusted care at straightforward prices.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, type: "spring" as const, stiffness: 100 }}
              className={`relative rounded-3xl p-8 ${
                plan.popular
                  ? "bg-primary-950 text-white shadow-2xl shadow-primary-900/40 md:-mt-8"
                  : "glass-card text-foreground"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              
              <h3 className={`text-xl font-bold font-heading mb-2 ${plan.popular ? "text-primary-100" : ""}`}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className={`text-sm ${plan.popular ? "text-primary-300" : "text-gray-500"}`}>
                  {plan.duration}
                </span>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? "bg-primary-800" : "bg-primary-100"}`}>
                      <Check className={`w-3 h-3 ${plan.popular ? "text-primary-300" : "text-primary-600"}`} />
                    </div>
                    <span className={`text-sm ${plan.popular ? "text-gray-200" : "text-gray-700"}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <MagneticButton
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  plan.popular
                    ? "bg-white text-primary-950 hover:bg-gray-100"
                    : "bg-primary-50 text-primary-700 hover:bg-primary-100"
                }`}
              >
                Get Started
              </MagneticButton>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
