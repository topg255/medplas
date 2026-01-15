"use client";
import { IconArrowLeft, IconArrowRight, IconX, IconClock, IconCalendar, IconMicroscope, IconChartLine } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BR from '../assets/br1.jpg';
import C1 from '../assets/C1.jpg';
import FT1 from '../assets/Ft1.jpg';
import O1 from '../assets/o1.jpg';
import G from '../assets/grok1.jpg';
import G1 from '../assets/grok2.jpg';
import OS from '../assets/os1.jpg';
import OS1 from '../assets/os2.jpg';
import BRN from '../assets/brn1.jpg';
import BRN1 from '../assets/brn2.jpg';

export const MedicalTestimonialsCarousel = ({ autoplay = true }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const { t } = useTranslation();
  // Place testimonialsData *inside* the component so it uses the latest t()
  const testimonialsData = [
    {
      name: t("testimonial_name_1"),
      procedureType: "Facial Trauma",
      src: FT1,
      quote: t("testimonial_quote_1"),
      beforeAfter: { before: G, after: G1 },
      caseId: "FT-2025-045"
    },
    {
      name: t("testimonial_name_2"),
      procedureType: "Osteotomy",
      src: O1,
      quote: t("testimonial_quote_2"),
      beforeAfter: { before: OS1, after: OS },
      caseId: "OS-2025-112"
    },
    {
      name: t("testimonial_name_3"),
      procedureType: "Burns",
      src: BR,
      quote: t("testimonial_quote_3"),
      beforeAfter: { before: BRN, after: BRN1 },
      caseId: "BR-2025-078"
    },
    {
      name: t("testimonial_name_4"),
      procedureType: "Cranioplasty",
      src: C1,
      quote: t("testimonial_quote_4"),
      beforeAfter: { before: "/images/burns-before.jpg", after: "/images/burns-after.jpg" },
      caseId: "CR-2025-089"
    }
  ];
  // Place procedureData inside the component and use t() for all fields
  const procedureData = {
    "Facial Trauma": {
      title: t("procedure_ft_title"),
      description: t("procedure_ft_description"),
      duration: t("procedure_ft_duration"),
      recovery: t("procedure_ft_recovery"),
      technique: t("procedure_ft_technique"),
      overview: t("procedure_ft_overview"),
      approach: t("procedure_ft_approach"),
      outcome: t("procedure_ft_outcome"),
      specialNotes: t("procedure_ft_specialNotes")
    },
    "Osteotomy": {
      title: t("procedure_os_title"),
      description: t("procedure_os_description"),
      duration: t("procedure_os_duration"),
      recovery: t("procedure_os_recovery"),
      technique: t("procedure_os_technique"),
      overview: t("procedure_os_overview"),
      approach: t("procedure_os_approach"),
      outcome: t("procedure_os_outcome"),
      specialNotes: t("procedure_os_specialNotes")
    },
    "Burns": {
      title: t("procedure_burns_title"),
      description: t("procedure_burns_description"),
      duration: t("procedure_burns_duration"),
      recovery: t("procedure_burns_recovery"),
      technique: t("procedure_burns_technique"),
      overview: t("procedure_burns_overview"),
      approach: t("procedure_burns_approach"),
      outcome: t("procedure_burns_outcome"),
      specialNotes: t("procedure_burns_specialNotes")
    },
    "Cranioplasty": {
      title: t("procedure_cr_title"),
      description: t("procedure_cr_description"),
      duration: t("procedure_cr_duration"),
      recovery: t("procedure_cr_recovery"),
      technique: t("procedure_cr_technique"),
      overview: t("procedure_cr_overview"),
      approach: t("procedure_cr_approach"),
      outcome: t("procedure_cr_outcome"),
      specialNotes: t("procedure_cr_specialNotes")
    }
  };

  const nextSlide = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonialsData.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  };

  const goToSlide = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  useEffect(() => {
    if (autoplay && !isHovered && !isModalOpen) {
      const interval = setInterval(nextSlide, 6000);
      return () => clearInterval(interval);
    }
  }, [autoplay, isHovered, isModalOpen, activeIndex]);

  const currentTestimonial = testimonialsData[activeIndex];
  const currentProcedure = procedureData[currentTestimonial.procedureType];

  return (
    <div className="relative w-full bg-gradient-to-b from-white to-white py-1 overflow-hidden">
      {/* Floating medical elements background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-200/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 24 + 12}px`,
            }}
            animate={{
              y: [0, Math.random() * 60 - 30],
              x: [0, Math.random() * 60 - 30],
              rotate: [0, Math.random() * 360],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          >
            <IconMicroscope />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-[#88570b] to-[#88570b] bg-clip-text text-transparent">
              {t("testimonials_title")}
            </span>
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            {t("testimonials_subtitle")}
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image Panel */}
            <motion.div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl"
            >
              <AnimatePresence custom={direction}>
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-0"
                >
                  <img
                    src={currentTestimonial.src}
                    alt={currentTestimonial.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end p-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{currentTestimonial.name}</h3>
                      <p className="text-yellow-200">{currentProcedure.title}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Testimonial Panel */}
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-yellow-100 p-3 rounded-full">
                  {currentTestimonial.procedureType === "Facial Trauma" && <IconMicroscope className="w-6 h-6 text-yellow-600" />}
                  {currentTestimonial.procedureType === "Osteotomy" && <IconChartLine className="w-6 h-6 text-yellow-600" />}
                  {currentTestimonial.procedureType === "Burns" && <IconClock className="w-6 h-6 text-yellow-600" />}
                  {currentTestimonial.procedureType === "Cranioplasty" && <IconCalendar className="w-6 h-6 text-yellow-600" />}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{currentProcedure.title}</h3>
                  <p className="text-yellow-600">{currentProcedure.description}</p>
                </div>
              </div>

              <motion.blockquote
                className="text-lg text-gray-700 leading-relaxed border-l-4 border-yellow-500 pl-6 py-2 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                "{currentTestimonial.quote}"
              </motion.blockquote>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-yellow-50 p-4 rounded-xl">
                  <p className="text-sm text-yellow-600 font-medium">{t("duration")}</p>
                  <p className="text-lg font-semibold text-gray-900">{currentProcedure.duration}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <p className="text-sm text-green-600 font-medium">{t("recovery")}</p>
                  <p className="text-lg font-semibold text-gray-900">{currentProcedure.recovery}</p>
                </div>
              </div>

              <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {t("view_full_case")}
                <IconArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center mt-12 gap-4">
            <motion.button
              onClick={prevSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-yellow-50 transition-colors"
              aria-label="Previous case"
            >
              <IconArrowLeft className="w-6 h-6 text-gray-700" />
            </motion.button>

            <div className="flex items-center gap-2 mx-4">
              {testimonialsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-8 bg-yellow-600' : 'w-4 bg-gray-300'}`}
                  aria-label={`Go to case ${index + 1}`}
                />
              ))}
            </div>

            <motion.button
              onClick={nextSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-yellow-50 transition-colors"
              aria-label="Next case"
            >
              <IconArrowRight className="w-6 h-6 text-gray-700" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Professional Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsModalOpen(false)}
            />

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-yellow-700 to-yellow-800 p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold">{currentProcedure.title}</h3>
                      <p className="text-yellow-200 mt-1">{currentTestimonial.name} • Case ID: {currentTestimonial.caseId}</p>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      aria-label="Close modal"
                    >
                      <IconX className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="overflow-y-auto flex-1">
                  <div className="grid md:grid-cols-2 gap-8 p-8">
                    {/* Left Column - Visuals */}
                    <div className="space-y-6">
                      <div className="rounded-xl overflow-hidden shadow-lg">
                        <img
                          src={currentTestimonial.src}
                          alt={currentTestimonial.name}
                          className="w-full h-64 object-cover"
                        />
                      </div>

                      {currentTestimonial.beforeAfter && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">{t("treatment_progress")}</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-2">{t("before")}</p>
                              <img
                                src={currentTestimonial.beforeAfter.before}
                                alt="Before treatment"
                                className="rounded-lg shadow-md border border-gray-200"
                              />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-2">{t("after")}</p>
                              <img
                                src={currentTestimonial.beforeAfter.after}
                                alt="After treatment"
                                className="rounded-lg shadow-md border border-gray-200"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <p className="text-xs text-yellow-600 uppercase font-medium">{t("duration")}</p>
                          <p className="text-lg font-bold text-gray-900">{currentProcedure.duration}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-xs text-green-600 uppercase font-medium">{t("recovery")}</p>
                          <p className="text-lg font-bold text-gray-900">{currentProcedure.recovery}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg col-span-2">
                          <p className="text-xs text-purple-600 uppercase font-medium">{t("technique")}</p>
                          <p className="text-lg font-bold text-gray-900">{currentProcedure.technique}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-3">{t("procedure_overview")}</h4>
                        <p className="text-gray-700">{currentProcedure.overview}</p>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-3">{t("surgical_approach")}</h4>
                        <p className="text-gray-700">{currentProcedure.approach}</p>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-3">{t("expected_outcomes")}</h4>
                        <p className="text-gray-700">{currentProcedure.outcome}</p>
                      </div>

                      {currentProcedure.specialNotes && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{t("special_considerations")}</h4>
                          <p className="text-gray-700">{currentProcedure.specialNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t p-4 bg-gray-50">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      {t("close")}
                      <IconX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};