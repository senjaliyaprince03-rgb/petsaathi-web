"use client";

import dynamic from "next/dynamic";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";

const Hero3DScene = dynamic(() => import("./Hero3DScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-transparent blur-3xl" />
  ),
});

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* 3D Background */}
      <Hero3DScene />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center">
        <motion.div
          className="w-full lg:w-3/5 text-center lg:text-left pt-12 lg:pt-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-1.5 rounded-full glass border-primary-200 text-primary-700 text-sm font-semibold tracking-wide">
            India&apos;s Most Trusted Pet Care
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-heading font-extrabold text-foreground leading-[1.1] tracking-tight mb-6"
          >
            Peace of mind for you, <br />
            <span className="text-primary-600">pure joy for them.</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
          >
            Book verified dog walkers, pet sitters, and safe boarding with live GPS tracking, daily photo updates, and emergency veterinary support.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <MagneticButton className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/30 text-lg">
              Find a Sitter Nearby
            </MagneticButton>
            <MagneticButton className="w-full sm:w-auto px-8 py-4 bg-white text-foreground border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm text-lg">
              Become a Sitter
            </MagneticButton>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-12 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" /> Police Verified
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" /> GPS Tracking
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" /> Vet on Call
            </div>
          </motion.div>
        </motion.div>

        {/* Optional Right Side Image/Element */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full lg:w-2/5 hidden lg:block"
        >
          {/* A glowing orb or high-quality image placeholder */}
          <div className="relative w-full aspect-square rounded-full bg-gradient-to-tr from-primary-200 to-accent-100 blur-3xl opacity-50 absolute right-0 translate-x-1/4" />
        </motion.div>
      </div>
    </section>
  );
}
