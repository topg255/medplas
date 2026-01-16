"use client";
import { useScroll, useTransform, motion, AnimatePresence, useSpring } from "framer-motion";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
//import { cn } from "../utils/utils";
import {
  IconSearch,
  IconCalendarEvent,
  IconPlaneDeparture,
  IconHotelService,
  IconStethoscope,
  IconHeartbeat,
  IconChecklist,
  IconStar,
  IconX
} from "@tabler/icons-react";

// Extract icon mapping to a separate constant
const ICON_COMPONENTS = {
  search: IconSearch,
  planning: IconCalendarEvent,
  travel: IconPlaneDeparture,
  accommodation: IconHotelService,
  consultation: IconStethoscope,
  treatment: IconHeartbeat,
  followup: IconChecklist,
  review: IconStar,
  default: IconCalendarEvent
};

// Données détaillées pour chaque étape
const DETAILED_CONTENT = {
  search: {
    title: "Explore Your Options",
    description: "Begin by researching the best medical facilities and treatments available in Tunisia. Our platform provides detailed information on procedures, clinics, and patient reviews to help you make an informed decision.",
    highlights: [
      "Access verified clinic profiles",
      "Compare treatment costs",
      "Read patient testimonials"
    ]
  },
  planning: {
    title: "Plan Your Journey",
    description: "Work with our dedicated concierge team to create a personalized treatment plan. We handle appointments, travel logistics, and ensure everything aligns with your schedule and preferences.",
    highlights: [
      "Customized treatment schedules",
      "Priority appointment booking",
      "Visa and travel assistance"
    ]
  },
  travel: {
    title: "Seamless Travel",
    description: "Enjoy stress-free travel with our VIP transfer services. From airport pickups to private transportation, we ensure your journey to Tunisia is comfortable and hassle-free.",
    highlights: [
      "Private airport transfers",
      "Multilingual drivers",
      "24/7 travel support"
    ]
  },
  accommodation: {
    title: "Luxury Accommodation",
    description: "Recover in style with our curated selection of 5-star hotels and wellness resorts. Each accommodation is chosen for its proximity to medical facilities and exceptional amenities.",
    highlights: [
      "Ocean-view recovery suites",
      "Wellness and spa facilities",
      "All-inclusive meal plans"
    ]
  },
  consultation: {
    title: "Expert Consultation",
    description: "Meet with internationally certified specialists for comprehensive consultations. Our doctors use cutting-edge diagnostics to tailor treatments to your unique needs.",
    highlights: [
      "One-on-one specialist meetings",
      "Advanced diagnostic tools",
      "Personalized treatment plans"
    ]
  },
  treatment: {
    title: "World-Class Treatment",
    description: "Undergo your procedure in JCI-accredited facilities equipped with state-of-the-art technology. Our expert surgeons and staff ensure the highest standards of care.",
    highlights: [
      "Minimally invasive techniques",
      "High success rates",
      "Post-treatment care packages"
    ]
  },
  followup: {
    title: "Dedicated Follow-Up",
    description: "Receive ongoing support after your procedure with virtual check-ins and local follow-up appointments. We ensure your recovery is smooth and successful.",
    highlights: [
      "Telemedicine consultations",
      "Recovery progress tracking",
      "24/7 medical support"
    ]
  },
  review: {
    title: "Share Your Experience",
    description: "Your feedback helps us improve and inspires others. Share your journey and rate our services to contribute to our community of medical tourists.",
    highlights: [
      "Easy review submission",
      "Community engagement",
      "Exclusive loyalty rewards"
    ]
  }
};

// Custom hook for managing active timeline item
const useActiveTimelineItem = () => {
  const [activeItem, setActiveItem] = useState(null);

  const checkActiveItem = useCallback(() => {
    const items = document.querySelectorAll('.timeline-item');
    let closest = null;
    let closestDistance = Infinity;

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);

      if (distance < closestDistance) {
        closestDistance = distance;
        closest = index;
      }
    });

    if (closest !== null) {
      setActiveItem(closest);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', checkActiveItem);
    checkActiveItem();

    return () => window.removeEventListener('scroll', checkActiveItem);
  }, [checkActiveItem]);

  return activeItem;
};

// Custom hook for intersection observer
const useIntersectionObserver = (ref, threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold }
    );

    if (ref && ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref && ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, threshold]);

  return isInView;
};

// Modal component for detailed content
const DetailsModal = ({ isOpen, onClose, item }) => {
  if (!item) return null;

  const details = DETAILED_CONTENT[item.iconType] || {
    title: item.title,
    description: "No additional details available.",
    highlights: []
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          <motion.div
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 border border-blue-100/50 overflow-hidden"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full opacity-20" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100 to-transparent rounded-tr-full opacity-20" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 id="modal-title" className="text-2xl font-bold font-munika text-blue-800">{details.title}</h2>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                aria-label="Close modal"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconX size={24} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed">{details.description}</p>
              {details.highlights.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-blue-700 mb-3">Highlights</h3>
                  <ul className="space-y-2">
                    {details.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-blue-500 mr-2 mt-1 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-end">
              <motion.button
                onClick={onClose}
                className="px-6 py-2 text-white bg-blue-600 rounded-full font-medium font-munika hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close details"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Extracted TimelineIcon component
const TimelineIcon = ({ type, isActive }) => {
  const IconComponent = ICON_COMPONENTS[type] || ICON_COMPONENTS.default;

  return (
    <motion.div
      className={`p-4 rounded-2xl shadow-lg border-2 transition-all duration-300 ease-in-out ${isActive
        ? "bg-gradient-to-br from-blue-500 to-blue-700 border-blue-400 shadow-blue-200/50"
        : "bg-white border-blue-100 group-hover:border-blue-300"
        }`}
      whileHover={{
        scale: 1.1,
        rotate: [0, -5, 5, 0],
        transition: { duration: 0.5 }
      }}
      animate={{
        scale: isActive ? 1.05 : 1,
        boxShadow: isActive
          ? "0 10px 30px -10px rgba(59, 130, 246, 0.5)"
          : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
      }}
    >
      <IconComponent
        className={`h-8 w-8 ${isActive ? "text-white" : "text-blue-600 group-hover:text-blue-700"
          }`}
        aria-hidden="true"
      />
    </motion.div>
  );
};

// Background decorative elements
const BackgroundElements = ({ count = 10, scrollYProgress }) => {
  const elements = [];
  for (let i = 0; i < count; i++) {
    const el = {
      id: `bg-${i}`,
      width: `${Math.random() * 40 + 10}rem`,
      height: `${Math.random() * 40 + 10}rem`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    };
    elements.push(el);
  }

  return elements.map((el) => (
    <motion.div
      key={el.id}
      className="absolute rounded-full bg-blue-300/10 blur-3xl"
      style={{
        width: el.width,
        height: el.height,
        left: el.left,
        top: el.top,
        y: useTransform(scrollYProgress, [0, 1], [parseInt(el.id.split('-')[1]) * 50, -parseInt(el.id.split('-')[1]) * 50]),
      }}
      aria-hidden="true"
    />
  ));
};

// Extracted TimelineItem component
const TimelineItem = ({ item, index, isActive, onLearnMore }) => {
  return (
    <motion.div
      key={`${item.id || index}-timeline-item`}
      className={`timeline-item flex flex-col md:flex-row gap-8 items-start relative z-10 ${isActive ? "active" : ""
        }`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: Math.min(index * 0.15, 0.9),
        type: "spring",
        stiffness: 50
      }}
      viewport={{ once: false, margin: "-100px" }}
      id={`timeline-item-${index}`}
    >
      {/* Icon and Title */}
      <div className="md:sticky top-32 md:w-1/3 flex-shrink-0">
        <motion.div
          className="flex items-center gap-5 group"
          whileHover={{ x: 8, transition: { type: "spring", stiffness: 400 } }}
        >
          <TimelineIcon type={item.iconType} isActive={isActive} />
          <motion.h3
            className={`text-2xl lg:text-3xl font-bold font-munika transition-colors duration-300 ${isActive ? "text-blue-800" : "text-blue-700"
              }`}
            animate={{
              x: isActive ? 5 : 0,
            }}
          >
            {item.title}
            <motion.div
              className={`h-[2px] bg-blue-400 mt-2 origin-left ${isActive ? "opacity-100" : "opacity-0"}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isActive ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            />
          </motion.h3>
        </motion.div>
      </div>

      {/* Content Card */}
      <div className="md:pl-12 flex-1">
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 border border-blue-50 relative overflow-hidden"
          whileHover={{
            y: -5,
            boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.1)",
            transition: { type: "spring", stiffness: 300 }
          }}
          animate={{
            boxShadow: isActive
              ? "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
              : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            borderColor: isActive ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.1)"
          }}
          tabIndex={0}
          role="region"
          aria-labelledby={`timeline-title-${index}`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-bl-full opacity-20 -mr-10 -mt-10" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100 to-transparent rounded-tr-full opacity-20 -ml-10 -mb-10" aria-hidden="true" />

          <div className="prose prose-lg max-w-none relative z-10">
            {item.content}
          </div>

          <motion.div
            className="mt-6 flex justify-end"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => onLearnMore(item)}
              className="text-blue-600 flex items-center gap-2 font-medium text-sm group hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-md px-2 py-1"
              whileHover={{ x: 5 }}
              aria-label={`Learn more about ${item.title}`}
            >
              Learn more
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              >
                <path
                  d="M4.16669 10H15.8334"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.8334 5L15.8334 10L10.8334 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute left-[26px] md:left-[calc(33%+14px)] top-8 rounded-full text-xs font-bold flex items-center justify-center"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        aria-hidden="true"
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 border-blue-300 text-blue-700">
          {index + 1}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main component with optimizations
export const Timeline = ({ data = [] }) => {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);

  const activeItem = useActiveTimelineItem();
  const isInView = useIntersectionObserver(containerRef);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 30%", "end 70%"]
  });

  const pathLength = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 50,
    damping: 15
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.1], [-20, 0]);

  const validatedData = useMemo(() => {
    return data.map((item, i) => ({
      ...item,
      id: item.id || `timeline-${i}`
    }));
  }, [data]);

  useEffect(() => {
    if (timelineRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        setHeight(entries[0].contentRect.height);
      });
      resizeObserver.observe(timelineRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const handleKeyNavigation = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.min(activeItem + 1, validatedData.length - 1);
      document.getElementById(`timeline-item-${nextIndex}`)?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = Math.max(activeItem - 1, 0);
      document.getElementById(`timeline-item-${prevIndex}`)?.focus();
    }
  }, [activeItem, validatedData.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyNavigation);
    return () => window.removeEventListener('keydown', handleKeyNavigation);
  }, [handleKeyNavigation]);

  const scrollToSection = useCallback((index) => {
    const element = document.getElementById(`timeline-item-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handleLearnMore = useCallback((item) => {
    setSelectedItem(item);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return (
    <motion.section
      className="w-full bg-gradient-to-b from-blue-50 to-blue-50 py-9 lg:py-9"
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ scale }}
      aria-label="Plasfora Medical Tourism Journey Timeline"
    >
      <div className="absolute inset-0 overflow-hidden z-0" aria-hidden="true">
        <BackgroundElements count={10} scrollYProgress={scrollYProgress} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          style={{ y: headerY }}
          className="text-center mb-12"
        >
          <div className="px-6 lg:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, type: "spring" }}
              className="text-4xl lg:text-6xl font-bold font-munika bg-clip-text text-transparent bg-gradient-to-r from-blue-800 via-blue-600 to-blue-900 mb-8"
              tabIndex={0}
            >
              Your Journey with Plasfora
            </motion.h2>

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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto font-munika leading-relaxed"
              tabIndex={0}
            >
              Discover why Tunisia is becoming a premier destination for medical tourism,
              combining <span className="text-blue-700 font-semibold">world-class healthcare</span> with
              an <span className="text-blue-700 font-semibold">unforgettable cultural experience</span>.
            </motion.p>
          </div>
        </motion.div>

        <div className="hidden md:flex justify-center mb-12">
          <div className="flex gap-3" role="tablist" aria-label="Timeline navigation">
            {validatedData.map((_, i) => (
              <motion.button
                key={`nav-dot-${i}`}
                onClick={() => scrollToSection(i)}
                className={`w-3 h-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${activeItem === i ? 'bg-blue-600' : 'bg-blue-200 hover:bg-blue-300'
                  }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                role="tab"
                aria-selected={activeItem === i}
                aria-label={`Navigate to section ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="relative" ref={timelineRef}>
          <AnimatePresence>
            <motion.div
              className="space-y-16 md:space-y-20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-100px 0px" }}
              role="list"
              aria-label="Timeline events"
            >
              {validatedData.map((item, index) => (
                <TimelineItem
                  key={item.id}
                  item={item}
                  index={index}
                  isActive={activeItem === index}
                  onLearnMore={handleLearnMore}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          <div
            className="absolute left-[30px] md:left-[calc(33%+18px)] top-8 w-1 h-[calc(100%-4rem)] bg-blue-100 overflow-hidden rounded-full"
            aria-hidden="true"
          >
            <motion.div
              style={{
                scaleY: pathLength,
                background: "linear-gradient(to bottom, #3b82f6, #60a5fa, #93c5fd)"
              }}
              className="w-full h-full origin-top rounded-full shadow-glow"
            />
          </div>

          <motion.div
            className="absolute right-0 top-1/4 w-64 h-64 bg-blue-100 rounded-full opacity-20 blur-3xl"
            animate={{
              x: [50, 0, 50],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute left-0 bottom-1/4 w-48 h-48 bg-indigo-100 rounded-full opacity-20 blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [50, 0, 50],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            aria-hidden="true"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center mt-16"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 15px 30px -8px rgba(59, 130, 246, 0.5)"
            }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-4 text-lg font-munika font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 rounded-full shadow-lg transition-all relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            aria-label="Begin Your Medical Tourism Journey"
          >
            <span className="relative z-10">Begin Your Journey</span>
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-hidden="true"
            />
            <motion.span
              className="absolute top-0 left-0 w-full h-full bg-white opacity-20"
              initial={{ x: "-100%", y: "-100%" }}
              whileHover={{ x: "100%", y: "100%" }}
              transition={{ duration: 0.5 }}
              aria-hidden="true"
            />
          </motion.button>
        </motion.div>
      </div>

      <DetailsModal
        isOpen={!!selectedItem}
        onClose={handleCloseModal}
        item={selectedItem}
      />
    </motion.section>
  );
};