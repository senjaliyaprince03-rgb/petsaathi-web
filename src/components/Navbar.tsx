"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import MagneticButton from "./MagneticButton";
import { PawPrint } from "lucide-react";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-card py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 20 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <PawPrint className="w-8 h-8 text-primary-600" />
          </motion.div>
          <span className="font-heading font-bold text-2xl tracking-tight text-foreground">
            PetSaathi
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#services" className="text-sm font-medium hover:text-primary-600 transition-colors">
            Services
          </Link>
          <Link href="#trust" className="text-sm font-medium hover:text-primary-600 transition-colors">
            Trust & Safety
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-primary-600 transition-colors">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/sitter" className="hidden lg:block text-sm font-medium text-foreground hover:text-primary-600 transition-colors">
            Become a Sitter
          </Link>
          <MagneticButton className="px-6 py-2.5 bg-foreground text-background hover:bg-primary-900 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)]">
            Book a Sitter
          </MagneticButton>
        </div>
      </div>
    </motion.nav>
  );
}
