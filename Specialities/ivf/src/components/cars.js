"use client";
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconX, 
  IconMicroscope, 
  IconEgg, 
  IconDna2, 
  IconFlask, 
  IconChartLine, 
  IconArrowRight,
  IconHeartbeat
} from '@tabler/icons-react';
import { useTranslation } from "react-i18next";

// Assets
import EmbryoDevelopment from '../assets/ivf1.jpeg';
import IVFProcess from '../assets/ivf2.jpg';
import LabWork from '../assets/ivf3.jpeg';
import SuccessStory from '../assets/ivf4.jpeg';

export const IVFJourney = () => {
  const { t } = useTranslation();
  const [currentStage, setCurrentStage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const IVF_STAGES = [
    {
      title: t("ivf_stage1_title"),
      description: t("ivf_stage1_desc"),
      image: EmbryoDevelopment,
      duration: t("ivf_stage1_duration"),
      successRate: t("ivf_stage1_success"),
      technique: t("ivf_stage1_technique"),
      details: t("ivf_stage1_details"),
      icon: <IconHeartbeat className="w-6 h-6 text-rose-600" />
    },
    {
      title: t("ivf_stage2_title"),
      description: t("ivf_stage2_desc"),
      image: IVFProcess,
      duration: t("ivf_stage2_duration"),
      successRate: t("ivf_stage2_success"),
      technique: t("ivf_stage2_technique"),
      details: t("ivf_stage2_details"),
      icon: <IconEgg className="w-6 h-6 text-rose-600" />
    },
    {
      title: t("ivf_stage3_title"),
      description: t("ivf_stage3_desc"),
      image: LabWork,
      duration: t("ivf_stage3_duration"),
      successRate: t("ivf_stage3_success"),
      technique: t("ivf_stage3_technique"),
      details: t("ivf_stage3_details"),
      icon: <IconFlask className="w-6 h-6 text-rose-600" />
    },
    {
      title: t("ivf_stage4_title"),
      description: t("ivf_stage4_desc"),
      image: SuccessStory,
      duration: t("ivf_stage4_duration"),
      successRate: t("ivf_stage4_success"),
      technique: t("ivf_stage4_technique"),
      details: t("ivf_stage4_details"),
      icon: <IconDna2 className="w-6 h-6 text-rose-600" />
    }
  ];

  const currentItem = IVF_STAGES[currentStage];

  const goToStage = useCallback((index) => {
    setCurrentStage(index);
  }, []);

  const toggleModal = useCallback(() => {
    setIsModalOpen(prev => !prev);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-b from-white to-white py-12 font-munika">
      {/* Floating Embryo Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-200/30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
            }}
            animate={{
              y: [0, Math.random() * 40 - 20],
              x: [0, Math.random() * 40 - 20],
              rotate: [0, Math.random() * 360],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          >
            {Math.random() > 0.5 ? <IconEgg /> : <IconDna2 />}
          </motion.div>
        ))}
      </div>

      {/* Professional Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={toggleModal}
            />

            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <motion.div 
                className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                layoutId={`modal-${currentStage}`}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <motion.h2 
                        className="text-2xl md:text-3xl font-bold font-munika"
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {currentItem.title}
                      </motion.h2>
                      <p className="text-rose-100 font-munika">{currentItem.description}</p>
                    </div>
                    <button
                      onClick={toggleModal}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      aria-label="Close"
                    >
                      <IconX className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="overflow-y-auto flex-1">
                  <div className="grid md:grid-cols-2 gap-8 p-6">
                    {/* Left Column - Visual */}
                    <motion.div
                      className="relative h-64 md:h-full rounded-xl overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <img
                        src={currentItem.image}
                        alt={currentItem.title}
                        className="w-full h-full object-cover"
                      />
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <p className="text-white text-sm font-medium font-munika">Medical illustration</p>
                      </motion.div>
                    </motion.div>

                    {/* Right Column - Content */}
                    <div className="space-y-6">
                      {/* Technical Info */}
                      <motion.div
                        className="grid grid-cols-2 gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                          <p className="text-xs text-rose-600 uppercase font-semibold font-munika">{t("Duration")}</p>
                          <p className="text-lg font-bold text-rose-800 font-munika">{currentItem.duration}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                          <p className="text-xs text-green-600 uppercase font-semibold font-munika">{t("Success Rate")}</p>
                          <p className="text-lg font-bold text-green-800 font-munika">{currentItem.successRate}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 col-span-2">
                          <p className="text-xs text-purple-600 uppercase font-semibold font-munika">{t("Technique")}</p>
                          <p className="text-lg font-bold text-purple-800 font-munika">{currentItem.technique}</p>
                        </div>
                      </motion.div>

                      {/* Detailed Description */}
                      <motion.div
                        className="prose"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <h3 className="text-xl font-bold text-gray-800 font-munika">{t("Procedure Details")}</h3>
                        <p className="text-gray-600 font-munika">{currentItem.details}</p>

                        {/* Benefits */}
                        <div className="mt-6 space-y-3">
                          <h4 className="text-lg font-semibold text-gray-800 font-munika">{t("Key Benefits")}</h4>
                          <ul className="space-y-2">
                            {[
                              t("State-of-the-art technology with 24/7 monitoring"),
                              t("Fully personalized protocol"),
                              t("Daily follow-up by our team of experts")
                            ].map((benefit, i) => (
                              <li key={i} className="flex items-start font-munika">
                                <div className="flex-shrink-0 mt-1 mr-3 text-green-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <span className="text-gray-600 font-munika">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Technologies Section */}
                  <div className="bg-gray-50 border-t p-6">
                    <div className="max-w-4xl mx-auto">
                      <h3 className="text-xl font-bold text-gray-800 font-munika mb-4">{t("Technologies Used")}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { icon: <IconMicroscope className="w-6 h-6 text-rose-600" />, name: t("High-resolution microscopy") },
                          { icon: <IconFlask className="w-6 h-6 text-rose-600" />, name: t("EmbryoScope+ incubators") },
                          { icon: <IconDna2 className="w-6 h-6 text-rose-600" />, name: t("IMSI system") },
                          { icon: <IconChartLine className="w-6 h-6 text-rose-600" />, name: t("Time-lapse analysis") }
                        ].map((tech, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                            {tech.icon}
                            <span className="text-sm font-medium font-munika">{tech.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t p-4 bg-white">
                  <div className="flex justify-between items-center max-w-4xl mx-auto">
                    <p className="text-sm text-gray-500 font-munika">
                      {t("Procedure")} #{currentStage + 1} - {currentItem.title}
                    </p>
                    <button
                      onClick={toggleModal}
                      className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors flex items-center gap-2 font-munika"
                    >
                      Close
                      <IconX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-4">
        <div className="px-6 lg:px-8 text-center">
          <motion.h4
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl lg:text-5xl font-bold font-munika text-rose-800 mb-6"
          >
            {t("ivf_process_title")}
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
            {t("ivf_process_subtitle")}
          </motion.p>
        </div>

        {/* Interactive Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-rose-200 to-rose-200 transform -translate-x-1/2 hidden md:block"></div>
          
          {/* Stages */}
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {IVF_STAGES.map((stage, index) => (
              <motion.div
                key={index}
                className={`flex flex-col items-center ${index % 2 === 0 ? 'md:flex-col' : 'md:flex-col-reverse md:mt-16'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Stage Card */}
                <motion.div
                  className={`w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden border border-white/20 transition-all duration-300 ${currentStage === index ? 'ring-2 ring-rose-500 scale-105' : 'hover:shadow-xl'}`}
                  whileHover={{ y: -5 }}
                  onClick={() => goToStage(index)}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                        {stage.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 font-munika">{stage.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4 font-munika">{stage.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-rose-50 text-rose-600 text-xs rounded-full font-munika">
                        {stage.duration}
                      </span>
                      <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full font-munika">
                        {stage.successRate} success
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Mobile connector */}
                <div className="h-8 w-px bg-gray-300 my-2 md:hidden"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Selected Stage Details */}
        <motion.div 
          className="mt-16 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden max-w-5xl mx-auto"
          key={currentStage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative h-64 md:h-full">
              <img
                src={currentItem.image}
                alt={currentItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-6">
                <h3 className="text-2xl font-bold text-white font-munika">{currentItem.title}</h3>
              </div>
            </div>
            <div className="p-8">
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="bg-rose-50 p-3 rounded-lg flex-1 min-w-[120px]">
                  <p className="text-xs text-rose-500 font-munika">{t("duration")}</p>
                  <p className="font-semibold font-munika">{currentItem.duration}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg flex-1 min-w-[120px]">
                  <p className="text-xs text-green-500 font-munika">{t("success_rate")}</p>
                  <p className="font-semibold font-munika">{currentItem.successRate}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg flex-1 min-w-[120px]">
                  <p className="text-xs text-purple-500 font-munika">{t("technique")}</p>
                  <p className="font-semibold font-munika">{currentItem.technique}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6 font-munika">{currentItem.details}</p>
              <button
                onClick={toggleModal}
                className="px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 group font-munika"
              >
                <span>{t("learn_more")}</span>
                <IconArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md border border-white/20">
            <div className="text-4xl font-bold text-rose-600 mb-2 font-munika">85%</div>
            <p className="text-gray-700 font-munika">{t("ivf_stat_overall_success")}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-white/20">
            <div className="text-4xl font-bold text-rose-600 mb-2 font-munika">2000+</div>
            <p className="text-gray-700 font-munika">{t("ivf_stat_babies_born")}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-white/20">
            <div className="text-4xl font-bold text-rose-600 mb-2 font-munika">24/7</div>
            <p className="text-gray-700 font-munika">{t("ivf_stat_embryo_monitoring")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IVFJourney;