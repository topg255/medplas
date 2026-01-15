"use client";
import { useScroll, useTransform, motion, AnimatePresence, useSpring } from "framer-motion";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  IconSearch,
  IconCalendarEvent,
  IconPlaneDeparture,
  IconHotelService,
  IconStethoscope,
  IconHeartbeat,
  IconChecklist,
  IconStar,
  IconX,
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

// Placeholder images
const imageSearch = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800";
const imagePlanning = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800";
const imageTravel = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800";
const imageAccommodation = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800";
const imageConsultation = "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800";
const imageTreatment = "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800";
const imageFollowup = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800";
const imageReview = "https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=800";

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

const DETAILED_CONTENT = {
  search: {
    title: "Explore Your Options",
    description: "Begin your medical journey by researching world-class facilities and treatments in Tunisia. Our platform provides comprehensive information on procedures, accredited clinics, and verified patient testimonials to help you make the best decision for your health.",
    highlights: [
      "Access to JCI-accredited medical centers",
      "Transparent pricing with no hidden costs",
      "Real patient reviews and success stories"
    ],
    image: imageSearch
  },
  planning: {
    title: "Personalized Planning",
    description: "Our dedicated medical coordinators work with you to create a customized treatment plan. We arrange consultations, schedule procedures, and coordinate every detail to ensure your medical journey is seamless and stress-free.",
    highlights: [
      "Dedicated personal medical coordinator",
      "Pre-treatment virtual consultations",
      "Complete visa and travel documentation support"
    ],
    image: imagePlanning
  },
  travel: {
    title: "Comfortable Journey",
    description: "Experience hassle-free travel with our comprehensive concierge services. From airport pickup to private transfers, we ensure every aspect of your journey is comfortable, safe, and tailored to your medical needs.",
    highlights: [
      "VIP airport meet-and-greet service",
      "Medical-grade transportation with trained staff",
      "Round-the-clock emergency travel assistance"
    ],
    image: imageTravel
  },
  accommodation: {
    title: "Recovery Comfort",
    description: "Rest and recover in carefully selected accommodations near premier medical facilities. Our partner hotels offer specialized recovery suites with medical-grade amenities and 24/7 nursing support if needed.",
    highlights: [
      "Post-operative recovery suites",
      "Nutritious meal plans designed by dietitians",
      "On-call nursing and medical assistance"
    ],
    image: imageAccommodation
  },
  consultation: {
    title: "Expert Medical Consultation",
    description: "Meet with internationally trained specialists who use advanced diagnostic technology. Our doctors take time to understand your medical history, answer all questions, and develop a personalized treatment approach.",
    highlights: [
      "Consultation with board-certified specialists",
      "State-of-the-art diagnostic imaging",
      "Second opinion services available"
    ],
    image: imageConsultation
  },
  treatment: {
    title: "Advanced Medical Care",
    description: "Receive treatment in internationally accredited facilities equipped with cutting-edge medical technology. Our experienced surgical teams follow the highest international standards to ensure optimal outcomes.",
    highlights: [
      "Latest minimally invasive techniques",
      "International safety protocols",
      "Comprehensive post-operative monitoring"
    ],
    image: imageTreatment
  },
  followup: {
    title: "Continuous Care",
    description: "Your health journey doesn't end after treatment. We provide ongoing support through virtual follow-ups, local care coordination, and 24/7 access to your medical team for any concerns during recovery.",
    highlights: [
      "Virtual follow-up consultations",
      "Medical record sharing with your home doctor",
      "24/7 medical support hotline"
    ],
    image: imageFollowup
  },
  review: {
    title: "Share Your Story",
    description: "Help future patients by sharing your experience. Your honest feedback helps us continuously improve our services and gives others confidence in choosing Tunisia for their medical care.",
    highlights: [
      "Contribute to our patient community",
      "Receive exclusive benefits for detailed reviews",
      "Help others make informed decisions"
    ],
    image: imageReview
  }
};

// Modal Component
const DetailsModal = ({ isOpen, onClose, item }) => {
  const { t } = useTranslation();
  if (!item) return null;

  const details = DETAILED_CONTENT[item.iconType] || {
    title: item.title,
    description: t("timeline_no_details"),
    highlights: [],
    image: null
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden mx-4"
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              {details.image && (
                <div className="w-full md:w-2/5 h-48 sm:h-64 md:h-auto relative">
                  <img
                    src={details.image}
                    alt={details.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-600/20" />
                </div>
              )}

              {/* Content Section */}
              <div className="flex-1 p-6 sm:p-8 md:p-10">
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 pr-4">
                    {details.title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors flex-shrink-0"
                  >
                    <IconX size={20} className="text-slate-600" />
                  </button>
                </div>

                <p className="text-slate-600 leading-relaxed mb-6 sm:mb-8 text-base sm:text-lg">
                  {details.description}
                </p>

                {details.highlights.length > 0 && (
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800">{t("timeline_key_benefits")}</h3>
                    <ul className="space-y-2 sm:space-y-3">
                      {details.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-slate-700 text-sm sm:text-base">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6 sm:mt-8 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm sm:text-base"
                  >
                    {t("timeline_got_it")}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Mobile Timeline Item Component
const MobileTimelineItem = ({ item, index, onLearnMore, isActive }) => {
  const { t } = useTranslation();
  const IconComponent = ICON_COMPONENTS[item.iconType] || ICON_COMPONENTS.default;
  
  return (
    <motion.div
      className="w-full mb-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: false, margin: "-50px" }}
    >
      <div className="flex items-start space-x-4">
        {/* Mobile Icon with connecting line */}
        <div className="relative flex flex-col items-center flex-shrink-0">
          <motion.div
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10 ${
              isActive 
                ? 'bg-gradient-to-br from-blue-500 to-cyan-600 scale-110' 
                : 'bg-gradient-to-br from-blue-400 to-cyan-500'
            }`}
            animate={{ 
              scale: isActive ? 1.1 : 1,
              boxShadow: isActive ? '0 0 20px rgba(20, 184, 166, 0.5)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </motion.div>
          {/* Connecting line between steps */}
          {index < 7 && (
            <div className="w-0.5 h-8 bg-gradient-to-b from-blue-300 to-cyan-300 mt-2" />
          )}
        </div>

        {/* Content Card */}
        <motion.div
          className="flex-1 bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500"
          animate={{
            scale: isActive ? 1.02 : 1,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold ${
              isActive ? 'text-blue-600' : 'text-blue-500'
            }`}>
              {t("timeline_step")} {index + 1}
            </span>
            <span className="text-xs text-slate-400">{t("timeline_medical_tourism")}</span>
          </div>
          
          <h3 className={`text-lg font-bold mb-2 ${
            isActive ? 'text-slate-900' : 'text-slate-800'
          }`}>
            {item.title}
          </h3>
          
          <div className="text-slate-600 text-sm mb-3">
            {item.content}
          </div>

          <button
            onClick={() => onLearnMore(item)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-xs group"
          >
            {t("timeline_learn_more")}
            <IconArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Desktop Timeline Item Component
const DesktopTimelineItem = ({ item, index, isLeft, onLearnMore, isActive }) => {
  const { t } = useTranslation();
  const IconComponent = ICON_COMPONENTS[item.iconType] || ICON_COMPONENTS.default;
  
  return (
    <div className={`flex items-center w-full mb-12 lg:mb-16 ${isLeft ? 'lg:flex-row-reverse' : ''}`}>
      <div className="hidden lg:block w-5/12" />
      
      {/* Center Icon */}
      <div className="relative z-20 flex items-center justify-center flex-shrink-0">
        <motion.div
          className={`w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shadow-lg ${
            isActive 
              ? 'bg-gradient-to-br from-blue-500 to-cyan-600 scale-110' 
              : 'bg-gradient-to-br from-blue-400 to-cyan-500'
          }`}
          whileHover={{ scale: 1.15, rotate: 5 }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          animate={{ 
            scale: isActive ? 1.1 : 1,
            boxShadow: isActive ? '0 0 20px rgba(20, 184, 166, 0.5)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <IconComponent className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
        </motion.div>
      </div>

      {/* Content Card */}
      <motion.div
        className={`w-full lg:w-5/12 ${isLeft ? 'lg:pr-8 xl:pr-12' : 'lg:pl-8 xl:pl-12'}`}
        initial={{ opacity: 0, x: isLeft ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: false, margin: "-100px" }}
        animate={{
          scale: isActive ? 1.02 : 1,
          y: isActive ? -5 : 0
        }}
      >
        <motion.div
          className={`bg-white rounded-xl shadow-lg p-5 lg:p-6 border-l-4 transition-all duration-300 ${
            isActive 
              ? 'border-blue-500 shadow-xl border-l-8' 
              : 'border-blue-300 hover:shadow-xl'
          }`}
          whileHover={{ y: -5 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-semibold transition-colors ${
              isActive ? 'text-blue-600' : 'text-blue-500'
            }`}>
              {t("timeline_step")} {index + 1}
            </span>
            <span className="text-xs text-slate-400">{t("timeline_medical_tourism")}</span>
          </div>
          
          <h3 className={`text-lg lg:text-xl font-bold mb-3 transition-colors ${
            isActive ? 'text-slate-900' : 'text-slate-800'
          }`}>
            {item.title}
          </h3>
          
          <div className="text-slate-600 text-sm lg:text-base mb-4">
            {item.content}
          </div>

          <button
            onClick={() => onLearnMore(item)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm group"
          >
            {t("timeline_learn_more")}
            <IconArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

// SVG Curved Line Component
const CurvedLine = ({ startY, endY, isLeft, isActive }) => {
  const curveIntensity = 80;
  const midX = isLeft ? -curveIntensity : curveIntensity;
  
  return (
    <motion.path
      d={`M 0,${startY} Q ${midX},${(startY + endY) / 2} 0,${endY}`}
      stroke="url(#gradient)"
      strokeWidth={isActive ? 4 : 3}
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      viewport={{ once: false }}
      animate={{
        stroke: isActive ? 'url(#activeGradient)' : 'url(#gradient)',
        strokeWidth: isActive ? 5 : 3,
        opacity: isActive ? 1 : 0.8
      }}
    />
  );
};

// Mobile Navigation Dots
const MobileNavigation = ({ activeStep, totalSteps, onStepClick }) => {
  return (
    <div className="flex justify-center mb-8 lg:hidden">
      <div className="flex space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-3 shadow-lg">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <motion.button
            key={`mobile-dot-${index}`}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === activeStep 
                ? 'bg-blue-500 scale-125' 
                : 'bg-blue-300 hover:bg-blue-400'
            }`}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onStepClick(index)}
            title={`Go to step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Main Timeline Component
export const Timeline = ({ data = [] }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const { t } = useTranslation();

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"]
  });

  const validatedData = useMemo(() => {
    return data.map((item, i) => ({
      ...item,
      id: item.id || `timeline-${i}`
    }));
  }, [data]);

  // Check mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate active step based on scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const step = Math.floor(latest * (validatedData.length - 1));
      setActiveStep(Math.min(step, validatedData.length - 1));
    });

    return () => unsubscribe();
  }, [scrollYProgress, validatedData.length]);

  const handleLearnMore = useCallback((item) => {
    setSelectedItem(item);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const scrollToStep = useCallback((index) => {
    const element = document.getElementById(`timeline-step-${index}`);
    if (element) {
      const offset = isMobile ? 80 : 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, [isMobile]);

  // Mobile navigation handlers
  const nextStep = useCallback(() => {
    const next = (activeStep + 1) % validatedData.length;
    scrollToStep(next);
  }, [activeStep, validatedData.length, scrollToStep]);

  const prevStep = useCallback(() => {
    const prev = (activeStep - 1 + validatedData.length) % validatedData.length;
    scrollToStep(prev);
  }, [activeStep, validatedData.length, scrollToStep]);

  return (
    <section className="relative bg-gradient-to-b from-white via-blue-50 to-blue-50 py-12 sm:py-16 lg:py-20 w-full overflow-hidden" ref={containerRef}>
      {/* Medical Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="medical-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#14b8a6" />
              <circle cx="25" cy="25" r="1.5" fill="#06b6d4" />
              <circle cx="75" cy="75" r="1.5" fill="#06b6d4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#medical-pattern)" />
        </svg>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10" ref={timelineRef}>
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16 lg:mb-20 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-semibold">
              {t("timeline_journey")}
            </span>
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-800 mb-4 sm:mb-6 px-4">
            {t("timeline_title")}
          </h2>
          
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
            {t("timeline_subtitle")}
          </p>
        </motion.div>

        {/* Mobile Navigation */}
        <MobileNavigation 
          activeStep={activeStep} 
          totalSteps={validatedData.length} 
          onStepClick={scrollToStep}
        />

        {/* Mobile Navigation Arrows */}
        {isMobile && (
          <div className="flex justify-center items-center gap-4 mb-8 lg:hidden">
            <motion.button
              onClick={prevStep}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all border border-blue-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconChevronLeft size={20} className="text-blue-600" />
            </motion.button>
            
            <span className="text-sm font-medium text-slate-700 min-w-[80px] text-center">
              {t("timeline_step")} {activeStep + 1} {t("timeline_of")} {validatedData.length}
            </span>
            
            <motion.button
              onClick={nextStep}
              className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all border border-blue-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconChevronRight size={20} className="text-blue-600" />
            </motion.button>
          </div>
        )}

        {/* Desktop Step Navigation Dots */}
        <div className="hidden lg:flex justify-center mb-12">
          <div className="flex space-x-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
            {validatedData.map((_, index) => (
              <motion.button
                key={`dot-${index}`}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeStep 
                    ? 'bg-blue-500 scale-125' 
                    : 'bg-blue-300 hover:bg-blue-400'
                }`}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollToStep(index)}
                title={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Center Line with Curves - Desktop only */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -ml-px">
            <svg className="absolute inset-0 w-full h-full" style={{ left: '-1px' }}>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="activeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="50%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              {validatedData.map((_, index) => {
                if (index < validatedData.length - 1) {
                  const isLeft = index % 2 === 0;
                  const isActive = index === activeStep || index + 1 === activeStep;
                  return (
                    <CurvedLine
                      key={`curve-${index}`}
                      startY={index * 280 + 32}
                      endY={(index + 1) * 280 + 32}
                      isLeft={isLeft}
                      isActive={isActive}
                    />
                  );
                }
                return null;
              })}
            </svg>
          </div>

          {/* Timeline Items */}
          <div className="relative">
            {validatedData.map((item, index) => (
              <div key={item.id} id={`timeline-step-${index}`}>
                {isMobile ? (
                  <MobileTimelineItem
                    item={item}
                    index={index}
                    onLearnMore={handleLearnMore}
                    isActive={index === activeStep}
                  />
                ) : (
                  <DesktopTimelineItem
                    item={item}
                    index={index}
                    isLeft={index % 2 === 0}
                    onLearnMore={handleLearnMore}
                    isActive={index === activeStep}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          className="text-center mt-12 sm:mt-16 lg:mt-20 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.a
            href="http://localhost:3009/"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-full font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {t("timeline_cta")}
            <IconArrowRight size={18} className="sm:w-5 sm:h-5" />
          </motion.a>
        </motion.div>
      </div>

      <DetailsModal
        isOpen={!!selectedItem}
        onClose={handleCloseModal}
        item={selectedItem}
      />
    </section>
  );
};