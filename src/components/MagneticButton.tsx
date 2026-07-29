"use client";

import { useRef, useState } from "react";
import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export default function MagneticButton({ children, className, intensity = 40, ...props }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = buttonRef.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * (intensity / 100), y: middleY * (intensity / 100) });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring" as const, stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn(
        "relative overflow-hidden rounded-full font-medium transition-colors focus:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
