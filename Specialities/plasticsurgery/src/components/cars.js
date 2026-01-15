"use client";
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconX, 
  IconMicroscope, 
  IconClock, 
  IconChartLine,
  IconArrowRight,
  IconHeartbeat
} from '@tabler/icons-react';
import { useTranslation } from "react-i18next";

// Assets
import B1 from '../assets/b1.jpg';
import F1 from '../assets/f1.jpg';
import T1 from '../assets/t1.jpg';
import M1 from '../assets/m1.jpg';

// Constants
const PROCEDURES_KEYS = [
  "facial",
  "breast",
  "body",
  "extremity"
];

export const PlasticSurgeryJourney = () => {
  const { t } = useTranslation();

  const steps = [
    {
      title: t("ps_journey_step1_title"),
      desc: t("ps_journey_step1_desc"),
      icon: <IconMicroscope className="w-6 h-6 text-yellow-600" />,
    },
    {
      title: t("ps_journey_step2_title"),
      desc: t("ps_journey_step2_desc"),
      icon: <IconHeartbeat className="w-6 h-6 text-yellow-600" />,
    },
    {
      title: t("ps_journey_step3_title"),
      desc: t("ps_journey_step3_desc"),
      icon: <IconChartLine className="w-6 h-6 text-yellow-600" />,
    },
    {
      title: t("ps_journey_step4_title"),
      desc: t("ps_journey_step4_desc"),
      icon: <IconClock className="w-6 h-6 text-yellow-600" />,
    },
    {
      title: t("ps_journey_step5_title"),
      desc: t("ps_journey_step5_desc"),
      icon: <IconArrowRight className="w-6 h-6 text-yellow-600" />,
    }
  ];

  const PROCEDURES = [
    {
      title: t("facial_title"),
      description: t("facial_desc"),
      image: F1,
      duration: t("facial_duration"),
      recovery: t("facial_recovery"),
      successRate: t("facial_success"),
      technique: t("facial_technique"),
      details: t("facial_details"),
      icon: <IconMicroscope className="w-6 h-6 text-yellow-600" />,
      benefits: [
        t("facial_benefit1"),
        t("facial_benefit2"),
        t("facial_benefit3")
      ],
      technologies: [
        t("facial_tech1"),
        t("facial_tech2"),
        t("facial_tech3")
      ]
    },
    {
      title: t("breast_title"),
      description: t("breast_desc"),
      image: B1,
      duration: t("breast_duration"),
      recovery: t("breast_recovery"),
      successRate: t("breast_success"),
      technique: t("breast_technique"),
      details: t("breast_details"),
      icon: <IconHeartbeat className="w-6 h-6 text-yellow-600" />,
      benefits: [
        t("breast_benefit1"),
        t("breast_benefit2"),
        t("breast_benefit3")
      ],
      technologies: [
        t("breast_tech1"),
        t("breast_tech2"),
        t("breast_tech3")
      ]
    },
    {
      title: t("body_title"),
      description: t("body_desc"),
      image: T1,
      duration: t("body_duration"),
      recovery: t("body_recovery"),
      successRate: t("body_success"),
      technique: t("body_technique"),
      details: t("body_details"),
      icon: <IconChartLine className="w-6 h-6 text-yellow-600" />,
      benefits: [
        t("body_benefit1"),
        t("body_benefit2"),
        t("body_benefit3")
      ],
      technologies: [
        t("body_tech1"),
        t("body_tech2"),
        t("body_tech3")
      ]
    },
    {
      title: t("extremity_title"),
      description: t("extremity_desc"),
      image: M1,
      duration: t("extremity_duration"),
      recovery: t("extremity_recovery"),
      successRate: t("extremity_success"),
      technique: t("extremity_technique"),
      details: t("extremity_details"),
      icon: <IconClock className="w-6 h-6 text-yellow-600" />,
      benefits: [
        t("extremity_benefit1"),
        t("extremity_benefit2"),
        t("extremity_benefit3")
      ],
      technologies: [
        t("extremity_tech1"),
        t("extremity_tech2"),
        t("extremity_tech3")
      ]
    }
  ];

  const [currentProcedure, setCurrentProcedure] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentItem = PROCEDURES[currentProcedure];

  const goToProcedure = useCallback((index) => {
    setCurrentProcedure(index);
  }, []);

  const toggleModal = useCallback(() => {
    setIsModalOpen(prev => !prev);
  }, []);

  return (
    <div className="relative mb-16 w-full min-h-screen overflow-hidden"
    style={{background:'linear-gradient(to right, rgb(254, 245, 231), rgb(254, 245, 231)'}}>
      {/* Floating medical elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-200/30"
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
            {Math.random() > 0.5 ? <IconMicroscope /> : <IconHeartbeat />}
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
                layoutId={`modal-${currentProcedure}`}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <motion.h2 
                        className="text-2xl md:text-3xl font-bold"
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {currentItem.title}
                      </motion.h2>
                      <p className="text-yellow-100">{currentItem.description}</p>
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
                        <p className="text-white text-sm font-medium">{t("medical_illustration")}</p>
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
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                          <p className="text-xs text-yellow-600 uppercase font-semibold">{t("duration")}</p>
                          <p className="text-lg font-bold text-yellow-800">{currentItem.duration}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                          <p className="text-xs text-green-600 uppercase font-semibold">{t("recovery")}</p>
                          <p className="text-lg font-bold text-green-800">{currentItem.recovery}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                          <p className="text-xs text-purple-600 uppercase font-semibold">{t("success_rate")}</p>
                          <p className="text-lg font-bold text-purple-800">{currentItem.successRate}</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                          <p className="text-xs text-yellow-600 uppercase font-semibold">{t("technique")}</p>
                          <p className="text-lg font-bold text-yellow-800">{currentItem.technique}</p>
                        </div>
                      </motion.div>

                      {/* Detailed Description */}
                      <motion.div
                        className="prose"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <h3 className="text-xl font-bold text-gray-800">{t("procedure_overview")}</h3>
                        <p className="text-gray-600">{currentItem.details}</p>

                        {/* Benefits */}
                        <div className="mt-6 space-y-3">
                          <h4 className="text-lg font-semibold text-gray-800">{t("key_benefits")}</h4>
                          <ul className="space-y-2">
                            {currentItem.benefits.map((benefit, i) => (
                              <li key={i} className="flex items-start">
                                <div className="flex-shrink-0 mt-1 mr-3 text-green-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <span className="text-gray-600">{benefit}</span>
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
                      <h3 className="text-xl font-bold text-gray-800 mb-4">{t("technologies_used")}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {currentItem.technologies.map((tech, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                              {currentItem.icon}
                            </div>
                            <span className="text-sm font-medium">{tech}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t p-4 bg-white">
                  <div className="flex justify-between items-center max-w-4xl mx-auto">
                    <p className="text-sm text-gray-500">
                      {t("procedure")} #{currentProcedure + 1} - {currentItem.title}
                    </p>
                    <button
                      onClick={toggleModal}
                      className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      {t("close")}
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
        

        {/* Interactive Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-yellow-200 to-yellow-200 transform -translate-x-1/2 hidden md:block"></div>
          
          {/* Procedures */}
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {PROCEDURES.map((procedure, index) => (
              <motion.div
                key={index}
                className={`flex flex-col items-center ${index % 2 === 0 ? 'md:flex-col' : 'md:flex-col-reverse md:mt-16'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Procedure Card */}
                <motion.div
                  className={`w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden border border-white/20 transition-all duration-300 ${currentProcedure === index ? 'ring-2 ring-yellow-500 scale-105' : 'hover:shadow-xl'}`}
                  whileHover={{ y: -5 }}
                  onClick={() => goToProcedure(index)}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        {procedure.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{procedure.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{procedure.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-yellow-50 text-yellow-600 text-xs rounded-full">
                        {procedure.duration}
                      </span>
                      <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full">
                        {procedure.successRate}
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

        {/* Selected Procedure Details */}
        <motion.div 
          className="mt-16 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden max-w-5xl mx-auto"
          key={currentProcedure}
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
                <h3 className="text-2xl font-bold text-white">{currentItem.title}</h3>
              </div>
            </div>

            <div className="p-8">
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="bg-yellow-50 p-3 rounded-lg flex-1 min-w-[120px]">
                  <p className="text-xs text-yellow-500">{t("duration")}</p>
                  <p className="font-semibold">{currentItem.duration}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg flex-1 min-w-[120px]">
                  <p className="text-xs text-green-500">{t("success_rate")}</p>
                  <p className="font-semibold">{currentItem.successRate}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg flex-1 min-w-[120px]">
                  <p className="text-xs text-purple-500">{t("technique")}</p>
                  <p className="font-semibold">{currentItem.technique}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{currentItem.details}</p>

              <button
                onClick={toggleModal}
                className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
              >
                <span>{t("view_details")}</span>
                <IconArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md border border-white/20">
            <div className="text-4xl font-bold text-yellow-600 mb-2">98%</div>
            <p className="text-gray-700">{t("stat_satisfaction")}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-white/20">
            <div className="text-4xl font-bold text-yellow-600 mb-2">15+</div>
            <p className="text-gray-700">{t("stat_experience")}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-white/20">
            <div className="text-4xl font-bold text-yellow-600 mb-2">24/7</div>
            <p className="text-gray-700">{t("stat_support")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlasticSurgeryJourney;