"use client";
import React, { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../public/utils";
import { IconMicroscope } from "@tabler/icons-react";
import { MemoizedMedicalSparkles } from "./sparkless";

export const Compare = ({
  beforeImage,
  afterImage,
  className,
  beforeLabel = "",
  afterLabel = "",
  showLabels = true,
  showMicroscopeEffect = true,
  professionalMode = false
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isInteracting, setIsInteracting] = useState(false);
  const containerRef = useRef(null);

  const handleInteraction = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(10, Math.min(90, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const interactionStart = () => {
    setIsInteracting(true);
    if (professionalMode) {
      document.body.style.cursor = "col-resize";
    }
  };

  const interactionEnd = () => {
    setIsInteracting(false);
    if (professionalMode) {
      document.body.style.cursor = "";
    }
  };

  const { t } = useTranslation();
  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden",
        "border border-gray-200 shadow-xl",
        professionalMode && "ring-2 ring-blue-500/20",
        className
      )}
      onMouseMove={handleInteraction}
      onMouseEnter={interactionStart}
      onMouseLeave={interactionEnd}
      onTouchMove={(e) => handleInteraction(e.touches[0])}
      onTouchStart={interactionStart}
      onTouchEnd={interactionEnd}
    >
      {/* Image Before */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <img
          src={beforeImage}
          alt={t("compare_before_alt")}
          className="w-full h-full object-cover"
        />
        {showLabels && (
          <div className="absolute bottom-6 left-6 bg-white/90 px-4 py-2 rounded-lg shadow-md">
            <p className="text-gray-900 font-medium text-sm uppercase tracking-wider">
              {beforeLabel || t("compare_before_label")}
            </p>
          </div>
        )}
      </div>

      {/* Image After */}
      <div 
        className="absolute inset-0 z-20 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={afterImage}
          alt={t("compare_after_alt")}
          className="w-full h-full object-cover"
        />
        {showLabels && (
          <div className="absolute bottom-6 right-6 bg-white/90 px-4 py-2 rounded-lg shadow-md">
            <p className="text-gray-900 font-medium text-sm uppercase tracking-wider">
              {afterLabel || t("compare_after_label")}
            </p>
          </div>
        )}
      </div>

      {/* Medical Divider */}
      <div 
        className="absolute inset-y-0 w-0.5 bg-white z-30 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
          <IconMicroscope className="w-4 h-4 text-blue-600" />
        </div>
      </div>

      {/* Medical Effects */}
      {showMicroscopeEffect && (
        <>
          <MemoizedMedicalSparkles
            type="follicle" 
            className="left-0 right-1/2" 
          />
          <MemoizedMedicalSparkles 
            type="blood-flow" 
            className="left-1/2 right-0" 
            particleDensity={400}
          />
        </>
      )}

      {/* Professional HUD */}
      {professionalMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full text-xs font-mono text-blue-600 z-40 shadow-sm">
          {Math.round(sliderPosition)}% {t("compare_hud_label")}
        </div>
      )}

      {/* Animated Border Effect */}
      <AnimatePresence>
        {isInteracting && (
          <motion.div
            className="absolute inset-0 border-2 border-blue-400/30 pointer-events-none z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};