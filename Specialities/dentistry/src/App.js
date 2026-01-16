"use client";
import './i18n.js';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconMicroscope,
  IconDental,
  IconDentalOff,
  IconMedicalCross,
  IconCalendar,
  IconCheck,
  IconMenu2,
  IconArrowRight
} from "@tabler/icons-react";

import { GallerySection } from './components/galerie'

// Import your images
import Image from './assets/d1.jpg';
import Image1 from './assets/d2.jpg';
import Image2 from './assets/d3.jpg';
import Image3 from './assets/d4.jpg';
import Image4 from './assets/cp1.jpg';
import Image5 from './assets/cp2.jpg';

// Import your components
import { ExampleWrapper } from './components/Appoinment';
import { Footer } from './components/footer';
import { CardDemo } from './components/backgroundOv';
import { Compare } from "./components/compare";
import { CurvedBackground } from './components/curvebackground';
import { useTranslation } from 'react-i18next';


const GalleryModal = ({ images, onClose }) => {

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);


  return (
    <motion.div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-white hover:text-blue-400">
        <IconX size={32} />
      </button>

      <div className="relative max-w-6xl w-full">
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 z-10"
        >
          <IconChevronLeft size={32} className="text-white" />
        </button>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          className="w-full h-[80vh] flex items-center justify-center"
        >
          <img
            src={images[currentIndex]}
            alt={`Case ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </motion.div>

        <div className="absolute bottom-4 left-0 right-0 text-center text-white">
          <p className="bg-black/50 px-4 py-2 rounded-full inline-block">
            {currentIndex + 1} / {images.length}
          </p>
        </div>

        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 z-10"
        >
          <IconChevronRight size={32} className="text-white" />
        </button>
      </div>
    </motion.div>
  );
};

const DentalProcedureModal = ({ onClose }) => {
  const { t } = useTranslation();
  const steps = [
    {
      icon: <IconCalendar className="w-8 h-8 text-blue-600" />,
      title: t("dental_step1_title"),
      content: t("dental_step1_content"),
      duration: t("dental_step1_duration")
    },
    {
      icon: <IconMedicalCross className="w-8 h-8 text-blue-600" />,
      title: t("dental_step2_title"),
      content: t("dental_step2_content"),
      duration: t("dental_step2_duration")
    },
    {
      icon: <IconDental className="w-8 h-8 text-blue-600" />,
      title: t("dental_step3_title"),
      content: t("dental_step3_content"),
      duration: t("dental_step3_duration")
    },
    {
      icon: <IconCheck className="w-8 h-8 text-blue-600" />,
      title: t("dental_step4_title"),
      content: t("dental_step4_content"),
      duration: t("dental_step4_duration")
    },
    {
      icon: <IconDentalOff className="w-8 h-8 text-blue-600" />,
      title: t("dental_step5_title"),
      content: t("dental_step5_content"),
      duration: t("dental_step5_duration")
    }
  ];

  const [activeStep, setActiveStep] = useState(0);

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white dark:bg-neutral-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 z-10"
        >
          <IconX size={24} />
        </button>

        <div className="p-8">
          <div className="flex items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t("dental_process_title")}</h2>
              <p className="text-blue-600 font-medium">{t("dental_process_subtitle")}</p>
            </div>
          </div>

          <div className="relative mb-12">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-neutral-700"></div>

            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative pl-16 pb-8 group cursor-pointer"
                onClick={() => setActiveStep(index)}
                whileHover={{ x: 5 }}
              >
                <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-4 ${activeStep === index ? 'border-blue-600 bg-white dark:bg-neutral-800' : 'border-gray-300 bg-gray-100 dark:bg-neutral-700'}`}>
                  {step.icon}
                </div>
                <motion.div
                  className={`p-6 rounded-xl ${activeStep === index ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-neutral-700'}`}
                  animate={{
                    borderLeftWidth: activeStep === index ? 4 : 0,
                    borderLeftColor: activeStep === index ? '#2563EB' : 'transparent'
                  }}
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">{step.content}</p>
                  <span className="inline-block bg-white dark:bg-neutral-800 text-blue-600 text-xs font-medium px-2 py-1 rounded">
                    {t("dental_duration_label")}: {step.duration}
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-neutral-700 rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{steps[activeStep].title}</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{t("dental_description_label")}</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {t(`dental_step${activeStep+1}_desc`)}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{t("dental_technologies_label")}</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  {t(`dental_step${activeStep+1}_tech1`) && (
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>{t(`dental_step${activeStep+1}_tech1`)}</span>
                    </li>
                  )}
                  {t(`dental_step${activeStep+1}_tech2`) && (
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>{t(`dental_step${activeStep+1}_tech2`)}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-6">
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">{t("dental_faq_title")}</h4>
            <div className="space-y-4">
              <div className="border-b border-gray-200 dark:border-neutral-700 pb-4">
                <h5 className="font-medium text-gray-800 dark:text-gray-200">{t("dental_faq1_q")}</h5>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{t("dental_faq1_a")}</p>
              </div>
              <div className="border-b border-gray-200 dark:border-neutral-700 pb-4">
                <h5 className="font-medium text-gray-800 dark:text-gray-200">{t("dental_faq2_q")}</h5>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{t("dental_faq2_a")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const LanguageSelector = () => (
    <div className="flex items-center space-x-2">
      {["en", "fr", "ar"].map((lng) => (
        <button
          key={lng}
          onClick={() => i18n.changeLanguage(lng)}
          className={`px-2 py-1 rounded ${i18n.language === lng ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== "http://localhost:3020") return;

      const { accessToken, refreshToken, user } = event.data;

      if (accessToken && refreshToken && user) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("insurance", user.insurance);
        localStorage.setItem("age", user.age);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showProcedure, setShowProcedure] = useState(false);
  const galleryImages = [Image, Image1, Image2, Image3, Image4, Image5];

  return (
    <>
      <div className="fixed top-2 right-2 z-[99999]">
        <LanguageSelector />
      </div>
      <CurvedBackground />
      <CardDemo />

      <div className="my-8 h-1 w-24 bg-gray-400 mx-auto rounded-full"></div>

      <div className="flex flex-col lg:flex-row items-center justify-between p-8 border rounded-3xl bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 mx-4 lg:mx-9 mb-16 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="w-full lg:w-1/2 pr-0 lg:pr-12 mb-8 lg:mb-0">
          <div className="flex items-center mb-4">
            <div className="w-8 h-1 bg-gray-500 mr-4"></div>
            <span className="text-sm font-monika text-gray-500 uppercase tracking-wider">{t("clinical_results_label")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-munika text-gray-900 dark:text-white mb-6 leading-tight">
            <span className="text-blue-600">{t("visible_transformations_title")}</span>
          </h2>
          <p className="text-lg text-gray-800 dark:text-gray-300 mb-6 leading-relaxed font-munika">
            {t("gallery_description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              onClick={() => setShowProcedure(true)}
              className="px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg font-munika flex items-center justify-center shadow-sm hover:shadow-md transition-all"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <IconMedicalCross className="w-5 h-5 mr-2" />
              {t("dental_process_button")}
            </motion.button>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative group">
            <Compare
              beforeImage={Image5}
              afterImage={Image4}
              className="h-[300px] w-[250px] md:h-[450px] md:w-[400px] lg:h-[500px] lg:w-[450px]"
              professionalMode={true}
            />

            <div className="absolute -bottom-4 -right-4 bg-white dark:bg-neutral-800 px-4 py-2 rounded-full shadow-lg flex items-center z-10 border border-blue-100 dark:border-neutral-700">
              <IconMicroscope className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("certified_results_label")}</span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showGallery && (
          <GalleryModal
            images={galleryImages}
            onClose={() => setShowGallery(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProcedure && (
          <DentalProcedureModal onClose={() => setShowProcedure(false)} />
        )}
      </AnimatePresence>
      <GallerySection></GallerySection>

      <Footer />
    </>
  );
};

export default Navbar;