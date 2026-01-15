"use client";
import { IconArrowLeft, IconArrowRight, IconQuote, IconStar } from "@tabler/icons-react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

export const AnimatedTestimonials = ({ testimonials, autoplay = true, interval = 5000 }) => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);
  const progressRef = useRef(null);
  const { t } = useTranslation();

  // Handle mouse move for 3D effect
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleNext = useCallback(() => {
    setDirection(1);
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const goToIndex = useCallback((index) => {
    setDirection(index > active ? 1 : -1);
    setActive(index);
  }, [active]);

  // Reset progress animation
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.animation = 'none';
      setTimeout(() => {
        if (progressRef.current) {
          progressRef.current.style.animation = isPaused ? 'none' : `progress ${interval / 1000}s linear`;
        }
      }, 10);
    }
  }, [active, isPaused, interval]);

  // Autoplay handling
  useEffect(() => {
    if (!autoplay || testimonials.length <= 1 || isHovering || isPaused) return;
    const timer = setInterval(handleNext, interval);
    return () => clearInterval(timer);
  }, [autoplay, handleNext, interval, testimonials.length, isHovering, isPaused]);

  if (!testimonials.length) return null;

  return (
    <div className="w-full py-24 lg:py-40 bg-gradient-to-b from-blue-50 via-blue-50 to-white  relative overflow-hidden">      
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 relative z-10 ">
        {/* Enhanced Animated Title Section */}
        <div className="px-6 lg:px-8 text-center mb-24">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative mb-3"
          >

          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-6xl text-center font-bold font-bump bg-gradient-to-r from-blue-900 via-blue-800 to-blue-800 bg-clip-text text-transparent"
          >
            {t("testimonials_title")}
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="relative h-[3px] w-40 mx-auto my-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent blur-sm" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            viewport={{ once: true }}
            className="text-sm md:text-sm text-gray-600 max-w-2xl mx-auto font-bump leading-relaxed"
          >
            {t("testimonials_subtitle")}
          </motion.p>
        </div>

        {/* Ultra Premium Testimonial Content */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            mouseX.set(0);
            mouseY.set(0);
          }}
          className="relative  grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
        >
          {/* Images Section - Now in a premium 3D showcase */}
          <div className="relative lg:col-span-7 w-full">
            <motion.div
              style={{
                perspective: 1000,
                height: "38rem"
              }}
              className="relative mx-auto"
            >
              {/* Decorative elements */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.8 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="absolute -top-16 -left-16 w-32 h-32 border-2 border-blue-200 rounded-full z-0 hidden lg:block"
              />
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.5 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
                className="absolute -bottom-10 -right-10 w-48 h-48 border border-blue-200 rounded-full z-0 hidden lg:block"
              />

              {/* Image 3D container */}
              <motion.div
                style={{
                  transformStyle: "preserve-3d",
                  height: "100%",
                  width: "100%",
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative rounded-3xl shadow-2xl overflow-hidden"
              >
                <AnimatePresence custom={direction} initial={false}>
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={`${testimonial.src}-${index}`}
                      custom={direction}
                      initial={{
                        opacity: 0,
                        x: direction > 0 ? 200 : -200,
                        scale: 0.8,
                        zIndex: 0,
                        rotateY: direction > 0 ? 15 : -15
                      }}
                      animate={{
                        opacity: index === active ? 1 : 0,
                        x: 0,
                        scale: 1,
                        zIndex: index === active ? 10 : 1,
                        rotateY: 0
                      }}
                      exit={{
                        opacity: 0,
                        x: direction > 0 ? -200 : 200,
                        scale: 0.8,
                        zIndex: 0,
                        rotateY: direction > 0 ? -15 : 15
                      }}
                      transition={{
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1], // Custom ease curve for premium feel
                        opacity: { duration: 0.5 }
                      }}
                      className={`absolute inset-0 ${index === active ? 'cursor-grab' : 'cursor-pointer'}`}
                      onClick={() => goToIndex(index)}
                      style={{
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden"
                      }}
                      aria-label={`View testimonial from ${testimonial.name}`}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="relative h-full w-full overflow-hidden rounded-3xl">
                        {/* Main image */}
                        <img
                          src={testimonial.src}
                          alt={testimonial.name}
                          className="h-full w-full object-cover"
                          style={{
                            filter: "brightness(0.9) contrast(1.1)",
                            transform: "translateZ(0)",
                          }}
                          draggable={false}
                          loading="lazy"
                        />

                        {/* Premium gradient overlay */}
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                          style={{ mixBlendMode: "multiply" }}
                        />

                        {/* Subtle vignette effect */}
                        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>

                        {/* Bottom information panel */}
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                          className="absolute bottom-0 left-0 right-0 p-8 text-white"
                        >
                          {/* Client rating */}


                          {/* Client info badge */}
                          
                        </motion.div>
                      </div>

                      {/* Decorative thin line at the bottom */}
                      <div className="absolute bottom-0 left-0 right-0 h-1">
                        <div className="h-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400"></div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Premium navigation controls */}
            <div className="flex justify-between items-center mt-8">
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => goToIndex(index)}
                    className={`relative h-2 rounded-full transition-all duration-500 ${index === active ? "w-12 bg-blue-600" : "w-2 bg-blue-200"
                      }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    {index === active && (
                      <span
                        ref={progressRef}
                        className="absolute inset-0 bg-blue-400 rounded-full origin-left"
                        style={{
                          animation: isPaused ? 'none' : `progress ${interval / 1000}s linear`,
                          transformOrigin: 'left'
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Play/Pause control */}
              <motion.button
                onClick={() => setIsPaused(!isPaused)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${isPaused
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border border-blue-200"
                  }`}
              >
                {isPaused ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 2.5L13 8L3 13.5V2.5Z" fill="currentColor" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="3" width="4" height="10" rx="1" fill="currentColor" />
                    <rect x="9" y="3" width="4" height="10" rx="1" fill="currentColor" />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>

          {/* Content Section - Luxury glass-like card */}
          <div className="relative lg:col-span-5 " >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                initial={{
                  opacity: 0,
                  x: direction > 0 ? 80 : -80,
                  rotateY: direction > 0 ? 5 : -5
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  rotateY: 0
                }}
                exit={{
                  opacity: 0,
                  x: direction > 0 ? -80 : 80,
                  rotateY: direction > 0 ? -5 : 5
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  opacity: { duration: 0.5 }
                }}
                className="relative z-10"
              >
                {/* Luxury glass card effect */}
                <div className="relative p-1 rounded-3xl overflow-hidden shadow-xl">
                  {/* Glass effect background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-xl border border-white/30"></div>

                  {/* Subtle inner shadow */}
                  <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(59,130,246,0.1)]"></div>

                  {/* Content */}
                  <div className="relative p-8 lg:p-12 overflow-hidden">
                    {/* Decorative quote mark */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 0.1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="absolute top-6 left-6 text-blue-700"
                    >
                      <IconQuote className="w-24 h-24" stroke={1} />
                    </motion.div>

                    <motion.blockquote
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="text-base lg:text-base font-bump text-gray-700 leading-relaxed relative z-10 mb-8"
                    >
                      "{testimonials[active].quote}"
                    </motion.blockquote>

                    {/* Animated separator */}
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className="h-px w-full bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 my-8"
                    />

                    {/* Client details */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                      className="flex items-center space-x-5"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden ring-2 ring-blue-100 shadow-inner">
                          <img
                            src={testimonials[active].avatar || testimonials[active].src}
                            alt={testimonials[active].name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Decorative ring */}
                        <div className="absolute -inset-1 border-2 border-dashed border-blue-200 rounded-full animate-slow-spin"></div>
                      </div>
                      <div>
                        <h3 className="text-2xl lg:text-3xl font-bold font-bump text-blue-800 mb-1">
                          {testimonials[active].name}
                        </h3>
                        <p className="text-sm lg:text-base font-bump text-blue-600">
                          {testimonials[active].designation}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Premium navigation controls */}
                <div className="flex gap-4 mt-8 justify-end">
                  <motion.button
                    onClick={handlePrev}
                    whileHover={{ scale: 1.05, backgroundColor: "#EFF6FF" }}
                    whileTap={{ scale: 0.95 }}
                    className="h-14 w-14 rounded-full bg-white shadow-lg flex items-center justify-center group border border-blue-100 transition-all duration-300"
                    aria-label="Previous testimonial"
                  >
                    <IconArrowLeft className="h-6 w-6 text-blue-600 group-hover:text-blue-800 transition-colors" />
                  </motion.button>
                  <motion.button
                    onClick={handleNext}
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg flex items-center justify-center group transition-all duration-300"
                    aria-label="Next testimonial"
                  >
                    <IconArrowRight className="h-6 w-6 text-white group-hover:text-white transition-colors" />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* CSS for progress animation */}
      <style jsx>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes slow-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-slow-spin {
          animation: slow-spin 12s linear infinite;
        }
      `}</style>
    </div>
  );
};