"use client";
import React, { useId, useEffect, useState } from "react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "../utils";
import { motion, useAnimation } from "framer-motion";

export const MemoizedMedicalSparkles = (props) => {
  const {
    id,
    className,
    background = "transparent",
    minSize = 0.3,
    maxSize = 1.2,
    speed = 1.5,
    particleColor = "#3B82F6",
    particleDensity = 600,
    type = "follicle" // 'follicle' or 'blood-flow'
  } = props;

  const [init, setInit] = useState(false);
  const controls = useAnimation();
  const generatedId = useId();

  // Configuration médicale avancée
  const getParticleShape = () => {
    return type === "follicle" ? "circle" : "triangle";
  };

  const getParticleOptions = () => ({
    background: { color: { value: background } },
    fullScreen: { enable: false, zIndex: 5 },
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "bubble",
          parallax: { enable: true, force: 20 }
        }
      },
      modes: {
        bubble: {
          distance: 100,
          size: 8,
          duration: 0.3,
          opacity: 0.8
        }
      }
    },
   
    detectRetina: true
  });

  useEffect(() => {
    const initEngine = async () => {
      await initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      });
      setInit(true);
      controls.start({ 
        opacity: 1,
        transition: { duration: 1.5 }
      });
    };
    initEngine();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={controls}
      className={cn(
        "absolute inset-0 pointer-events-none",
        type === "follicle" ? "z-20" : "z-10",
        className
      )}
    >
     
    </motion.div>
  );
};