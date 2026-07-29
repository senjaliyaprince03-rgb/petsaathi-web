"use client";

import { useEffect, useState } from "react";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Expand cursor on clickable elements
      if (
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") ||
        target.closest("a")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // Use a smaller circle normally, expand and blend on hover
  const variants: Variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      width: 32,
      height: 32,
      backgroundColor: "rgba(37, 99, 235, 0.2)",
      border: "1px solid rgba(37, 99, 235, 0.5)",
      transition: {
        type: "spring",
        mass: 0.1,
        stiffness: 800,
        damping: 35,
      },
    },
    hover: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      width: 64,
      height: 64,
      backgroundColor: "rgba(37, 99, 235, 0.1)",
      border: "1px solid rgba(37, 99, 235, 0.8)",
      mixBlendMode: "difference" as const,
      transition: {
        type: "spring",
        mass: 0.1,
        stiffness: 800,
        damping: 35,
      },
    },
  };

  // Hide the custom cursor on touch devices to avoid ghost cursors
  if (typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
        variants={variants}
        animate={isHovered ? "hover" : "default"}
      />
      <div
        className="fixed top-0 left-0 w-2 h-2 bg-primary-600 rounded-full pointer-events-none z-[10000]"
        style={{
          transform: `translate(${mousePosition.x - 4}px, ${mousePosition.y - 4}px)`,
        }}
      />
    </>
  );
}
