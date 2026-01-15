"use client";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const Lens = ({
  children,
  zoomFactor = 1.5,
  lensSize = 200, // Taille augmentée pour plus de visibilité
  isStatic = false,
  position = { x: 200, y: 150 },
  hovering,
  setHovering,
}) => {
  const containerRef = useRef(null);
  const [localIsHovering, setLocalIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState(position);

  const isHovering = hovering !== undefined ? hovering : localIsHovering;
  const setIsHovering = setHovering || setLocalIsHovering;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top 
    });
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl shadow-2xl z-20 border border-transparent hover:border-purple-300/30 transition-all duration-300"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02 }} // Effet subtil au survol
    >
      {children}

      <AnimatePresence>
        {(isStatic || isHovering) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute inset-0 overflow-hidden"
            style={{
              maskImage: `radial-gradient(circle ${lensSize / 2}px at ${
                isStatic ? position.x : mousePosition.x
              }px ${
                isStatic ? position.y : mousePosition.y
              }px, black 100%, transparent 100%)`,
              WebkitMaskImage: `radial-gradient(circle ${lensSize / 2}px at ${
                isStatic ? position.x : mousePosition.x
              }px ${
                isStatic ? position.y : mousePosition.y
              }px, black 100%, transparent 100%)`,
              transformOrigin: `${isStatic ? position.x : mousePosition.x}px ${
                isStatic ? position.y : mousePosition.y
              }px`,
            }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                transform: `scale(${zoomFactor})`,
                transformOrigin: `${isStatic ? position.x : mousePosition.x}px ${
                  isStatic ? position.y : mousePosition.y
                }px`,
              }}
              whileHover={{ scale: zoomFactor * 1.05 }} // Zoom légèrement accru au survol
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bordure animée autour de la loupe */}
      {isHovering && !isStatic && (
        <motion.div
          className="absolute pointer-events-none border-2 border-purple-400/50 rounded-full"
          style={{
            width: `${lensSize}px`,
            height: `${lensSize}px`,
            left: `${mousePosition.x - lensSize / 2}px`,
            top: `${mousePosition.y - lensSize / 2}px`,
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400 }}
        />
      )}
    </motion.div>
  );
};