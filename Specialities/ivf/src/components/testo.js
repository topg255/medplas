"use client";
import { IconArrowLeft, IconArrowRight, IconX, IconClock, IconCalendar, IconMicroscope, IconEgg, IconDna2, IconHeartbeat } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import IVF1 from '../assets/ivf1.jpeg';
import IVF2 from '../assets/ivf2.jpg';
import IVF3 from '../assets/ivf3.jpeg';
import IVF4 from '../assets/ivf4.jpeg';
import { useTranslation } from "react-i18next";

export const MedicalTestimonialsCarousel = ({ autoplay = true }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [direction, setDirection] = useState(1);
  const { t } = useTranslation();

  const successStories = [
    {
      name: t("ivf_story_1_name"),
      procedureType: "Classic IVF",
      src: IVF1,
      quote: t("ivf_story_1_quote"),
      beforeAfter: { before: IVF1, after: IVF2 },
      caseId: "IVF-2024-156",
      babyName: t("ivf_story_1_baby")
    },
    {
      name: t("ivf_story_2_name"),
      procedureType: "ICSI",
      src: IVF2,
      quote: t("ivf_story_2_quote"),
      beforeAfter: { before: IVF2, after: IVF3 },
      caseId: "ICSI-2024-089",
      babyName: t("ivf_story_2_baby")
    },
    {
      name: t("ivf_story_3_name"),
      procedureType: "Vitrification",
      src: IVF3,
      quote: t("ivf_story_3_quote"),
      beforeAfter: { before: IVF3, after: IVF4 },
      caseId: "VIT-2023-045",
      babyName: t("ivf_story_3_baby")
    },
    {
      name: t("ivf_story_4_name"),
      procedureType: "PGD",
      src: IVF4,
      quote: t("ivf_story_4_quote"),
      beforeAfter: { before: IVF4, after: IVF1 },
      caseId: "PGD-2024-112",
      babyName: t("ivf_story_4_baby")
    }
  ];

  const procedureData = {
    "Classic IVF": {
      title: t("ivf_procedure_classic_title"),
      description: t("ivf_procedure_classic_desc"),
      duration: t("ivf_procedure_classic_duration"),
      successRate: t("ivf_procedure_classic_success"),
      technique: t("ivf_procedure_classic_technique"),
      overview: t("ivf_procedure_classic_overview"),
      approach: t("ivf_procedure_classic_approach"),
      outcome: t("ivf_procedure_classic_outcome"),
      specialNotes: t("ivf_procedure_classic_notes")
    },
    "ICSI": {
      title: t("ivf_procedure_icsi_title"),
      description: t("ivf_procedure_icsi_desc"),
      duration: t("ivf_procedure_icsi_duration"),
      successRate: t("ivf_procedure_icsi_success"),
      technique: t("ivf_procedure_icsi_technique"),
      overview: t("ivf_procedure_icsi_overview"),
      approach: t("ivf_procedure_icsi_approach"),
      outcome: t("ivf_procedure_icsi_outcome"),
      specialNotes: t("ivf_procedure_icsi_notes")
    },
    "Vitrification": {
      title: t("ivf_procedure_vit_title"),
      description: t("ivf_procedure_vit_desc"),
      duration: t("ivf_procedure_vit_duration"),
      successRate: t("ivf_procedure_vit_success"),
      technique: t("ivf_procedure_vit_technique"),
      overview: t("ivf_procedure_vit_overview"),
      approach: t("ivf_procedure_vit_approach"),
      outcome: t("ivf_procedure_vit_outcome"),
      specialNotes: t("ivf_procedure_vit_notes")
    },
    "PGD": {
      title: t("ivf_procedure_pgd_title"),
      description: t("ivf_procedure_pgd_desc"),
      duration: t("ivf_procedure_pgd_duration"),
      successRate: t("ivf_procedure_pgd_success"),
      technique: t("ivf_procedure_pgd_technique"),
      overview: t("ivf_procedure_pgd_overview"),
      approach: t("ivf_procedure_pgd_approach"),
      outcome: t("ivf_procedure_pgd_outcome"),
      specialNotes: t("ivf_procedure_pgd_notes")
    }
  };

  const nextSlide = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % successStories.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + successStories.length) % successStories.length);
  };

  const goToSlide = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  useEffect(() => {
    if (autoplay && !isHovered && !isModalOpen) {
      const interval = setInterval(nextSlide, 8000);
      return () => clearInterval(interval);
    }
  }, [autoplay, isHovered, isModalOpen, activeIndex]);

  const currentStory = successStories[activeIndex];
  const currentProcedure = procedureData[currentStory.procedureType];

  return (
    <div className="relative w-full  bg-gradient-to-br from-rose-50/90 to-rose-50/90 py-24 overflow-hidden">
      {/* Floating IVF elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-200/20"
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
            {Math.random() > 0.5 ? <IconEgg /> : <IconDna2 />}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <div className="px-6 lg:px-8 text-center">
          <motion.h4
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl lg:text-5xl font-bold font-munika text-rose-800 mb-6"
          >
            {t("ivf_testimonials_title")}
          </motion.h4>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[2px] bg-gradient-to-r from-transparent via-rose-400 to-transparent w-3/4 mx-auto mb-7"
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto font-munika mb-10"
          >
            {t("ivf_testimonials_subtitle")}
          </motion.p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image Panel */}
            <motion.div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20"
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
                    src={currentStory.src}
                    alt={currentStory.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end p-8">
                    <div>
                      <h3 className="text-2xl font-munika text-white">{currentStory.name}</h3>
                      <p className="text-rose-200 font-munika">{currentProcedure.title}</p>
                      {currentStory.babyName && (
                        <p className="text-white/90 mt-2 text-sm">
                          <IconHeartbeat className="inline mr-2" />
                          {currentStory.babyName}
                        </p>
                      )}
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
                <div className="bg-rose-100 p-3 rounded-full">
                  {currentStory.procedureType === "Classic IVF" && <IconMicroscope className="w-6 h-6 text-rose-600" />}
                  {currentStory.procedureType === "ICSI" && <IconDna2 className="w-6 h-6 text-rose-600" />}
                  {currentStory.procedureType === "Vitrification" && <IconClock className="w-6 h-6 text-rose-600" />}
                  {currentStory.procedureType === "PGD" && <IconCalendar className="w-6 h-6 text-rose-600" />}
                </div>
                <div>
                  <h3 className="text-2xl font-munika text-gray-900">{currentProcedure.title}</h3>
                  <p className="text-rose-600 font-munika">{currentProcedure.description}</p>
                </div>
              </div>

              <motion.blockquote
                className="text-lg text-gray-700 leading-relaxed border-l-4 border-rose-500 pl-6 py-2 mb-8 font-munika"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                "{currentStory.quote}"
              </motion.blockquote>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-rose-50 p-4 rounded-xl">
                  <p className="text-sm text-rose-600 font-munika">{t("duration")}</p>
                  <p className="text-lg font-munika text-gray-900">{currentProcedure.duration}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <p className="text-sm text-green-600 font-medium">{t("success_rate")}</p>
                  <p className="text-lg font-munika text-gray-900">{currentProcedure.successRate}</p>
                </div>
              </div>

              <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-rose-600 to-rose-600 text-white rounded-xl font-munika shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {t("ivf_view_journey_details")}
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
              className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-rose-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <IconArrowLeft className="w-6 h-6 text-gray-700" />
            </motion.button>

            <div className="flex items-center gap-2 mx-4">
              {successStories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-8 bg-rose-600' : 'w-4 bg-gray-300'}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <motion.button
              onClick={nextSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-rose-50 transition-colors"
              aria-label="Next testimonial"
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
                <div className="bg-gradient-to-r from-rose-700 to-rose-800 p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-munika">{currentProcedure.title}</h3>
                      <p className="text-rose-200 font-munika mt-1">
                        {currentStory.name} • {currentStory.babyName} • Case: {currentStory.caseId}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      aria-label="Close"
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
                          src={currentStory.src}
                          alt={currentStory.name}
                          className="w-full h-64 object-cover"
                        />
                      </div>

                      {currentStory.beforeAfter && (
                        <div>
                          <h4 className="text-lg font-munika text-gray-800 mb-4">{t("ivf_before_after")}</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-2">{t("journey_start")}</p>
                              <img
                                src={currentStory.beforeAfter.before}
                                alt="Journey start"
                                className="rounded-lg shadow-md border border-gray-200"
                              />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-2">{t("final_result")}</p>
                              <img
                                src={currentStory.beforeAfter.after}
                                alt="Final result"
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
                        <div className="bg-rose-50 p-4 rounded-lg">
                          <p className="text-xs text-rose-600 uppercase font-munika">{t("duration")}</p>
                          <p className="text-lg font-munika text-gray-900">{currentProcedure.duration}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-xs text-green-600 uppercase font-munika">{t("success")}</p>
                          <p className="text-lg font-munika text-gray-900">{currentProcedure.successRate}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg col-span-2">
                          <p className="text-xs text-purple-600 uppercase font-munika">{t("technique")}</p>
                          <p className="text-lg font-munika text-gray-900">{currentProcedure.technique}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-munika text-gray-900 mb-3">{t("ivf_protocol_description")}</h4>
                        <p className="text-gray-700 font-munika">{currentProcedure.overview}</p>
                      </div>

                      <div>
                        <h4 className="text-xl font-munika text-gray-900 mb-3">{t("ivf_medical_approach")}</h4>
                        <p className="text-gray-700 font-munika">{currentProcedure.approach}</p>
                      </div>

                      <div>
                        <h4 className="text-xl font-munika text-gray-900 mb-3">{t("expected_outcomes")}</h4>
                        <p className="text-gray-700 font-munika">{currentProcedure.outcome}</p>
                      </div>

                      {currentProcedure.specialNotes && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                          <h4 className="text-lg font-munika text-gray-900 mb-2">{t("important_notes")}</h4>
                          <p className="text-gray-700 font-munika">{currentProcedure.specialNotes}</p>
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
                      className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors flex items-center gap-2 font-munika"
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