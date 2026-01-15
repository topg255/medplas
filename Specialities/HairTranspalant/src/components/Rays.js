import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../public/utils";

export const Rays = ({ className }) => {
  return (
    <motion.svg
      width="380"
      height="397"
      viewBox="0 0 380 397"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "absolute left-0 top-0 pointer-events-none z-[1]",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.4 }}
    >
      {/* Rayons avec animations individuelles */}
      <motion.g 
        filter="url(#filter0_f_120_7480)"
        initial={{ rotate: -15, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <path
          d="M-37.4202 -76.0163L-18.6447 -90.7295L242.792 162.228L207.51 182.074L-37.4202 -76.0163Z"
          fill="url(#paint0_linear_120_7480)"
        />
      </motion.g>

      <motion.g
        style={{ mixBlendMode: "plus-lighter" }}
        opacity="0.3"
        filter="url(#filter1_f_120_7480)"
        initial={{ rotate: 10, opacity: 0 }}
        animate={{ rotate: 0, opacity: 0.3 }}
        transition={{ duration: 1.5, delay: 0.2 }}
      >
        <path
          d="M-109.54 -36.9027L-84.2903 -58.0902L178.786 193.228L132.846 223.731L-109.54 -36.9027Z"
          fill="url(#paint1_linear_120_7480)"
        />
      </motion.g>

      {/* Dégradés optimisés */}
      <defs>
        <linearGradient
          id="paint0_linear_120_7480"
          x1="-57.5042"
          y1="-134.741"
          x2="403.147"
          y2="351.523"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.214779" stopColor="#0423b0" />
          <stop offset="0.781583" stopColor="#53c6ff" stopOpacity="0" />
        </linearGradient>
        {/* ... (autres gradients conservés) */}
      </defs>
    </motion.svg>
  );
};