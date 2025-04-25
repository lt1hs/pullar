import React from "react";
import { motion } from "framer-motion";

interface MiningAnimationProps {
  size?: "sm" | "md" | "lg";
}

export const MiningAnimation: React.FC<MiningAnimationProps> = ({ size = "md" }) => {
  const sizes = {
    sm: {
      outer: "w-10 h-10",
      middle: "w-7 h-7",
      inner: "w-4 h-4",
      icon: "text-xs"
    },
    md: {
      outer: "w-14 h-14",
      middle: "w-10 h-10",
      inner: "w-6 h-6",
      icon: "text-sm"
    },
    lg: {
      outer: "w-20 h-20",
      middle: "w-14 h-14",
      inner: "w-8 h-8",
      icon: "text-base"
    }
  };
  
  const pulseVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <motion.div
      variants={pulseVariants}
      animate="pulse"
      className={`${sizes[size].outer} rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center`}
    >
      <div className={`${sizes[size].middle} rounded-full bg-gradient-to-r from-primary/40 to-secondary/40 flex items-center justify-center`}>
        <div className={`${sizes[size].inner} rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center`}>
          <i className={`ri-cpu-line text-white ${sizes[size].icon}`}></i>
        </div>
      </div>
    </motion.div>
  );
};
