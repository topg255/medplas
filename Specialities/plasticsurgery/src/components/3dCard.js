"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useTransform, animate } from "framer-motion";
import {
  IconArrowRight,
  IconStethoscope,
  IconStarFilled,
  IconCertificate,
  IconX,
  IconCalendarEvent,
  IconPhoneCall,
  IconMapPin,
  IconCheck
} from "@tabler/icons-react";
import Image4 from "../assets/nb.jpg";
import { useTranslation } from "react-i18next";

export const Medical3DCard = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const cardRef = useRef(null);
  const { t } = useTranslation();

  // Motion values for 3D effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  const shadowX = useTransform(x, [-100, 100], [-15, 15]);
  const shadowY = useTransform(y, [-100, 100], [-15, 15]);
  const shadowSpread = useTransform(useMotionValue(0), [0, 100], [0, 30]);
  const boxShadow = useMotionTemplate`${shadowX}px ${shadowY}px ${shadowSpread}px rgba(0, 0, 0, 0.2)`;

  // Medical procedures data
  const procedures = [
    {
      title: t("initial_consultation"),
      description: t("initial_consultation_desc"),
      icon: <IconStethoscope className="w-6 h-6 text-yellow-600" />
    },
    {
      title: t("treatment_plan"),
      description: t("treatment_plan_desc"),
      icon: <IconCertificate className="w-6 h-6 text-yellow-600" />
    },
    {
      title: t("scheduling"),
      description: t("scheduling_desc"),
      icon: <IconCalendarEvent className="w-6 h-6 text-yellow-600" />
    }
  ];

  const handleHoverStart = () => {
    setIsHovered(true);
    setIsAnimating(true);
    animate(shadowSpread, 30, { duration: 0.3 });
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    animate(shadowSpread, 0, { duration: 0.3 }).then(() => setIsAnimating(false));
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const openModal = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden'; // Disable scrolling
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto'; // Enable scrolling
  };

  return (
    <div className="relative bg-gradient-to-br from-white to-white py-20 overflow-hidden">
      {/* Floating medical elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(90)].map((_, i) => (
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

            <IconStethoscope />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          ref={cardRef}
          className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleHoverStart}
          onMouseLeave={handleHoverEnd}
        >
          {/* 3D Image Card */}
          <motion.div
            className="w-full max-w-[550px] relative"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div className="overflow-hidden rounded-3xl border-2 border-white/20 shadow-2xl relative">
              <motion.img
                src={Image4}
                alt="Medical transformation results"
                className="w-full h-[600px] object-cover"
                loading="lazy"
                initial={{ scale: 1 }}
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div className="max-w-xl space-y-8 text-center lg:text-left">
            <motion.h2
              className="text-5xl font-bold text-gray-900 leading-tight"
              initial={{ y: 30, opacity: 0 }}
              animate={{
                y: isHovered ? -5 : 0,
                opacity: 1,
                color: isHovered ? "#1e40af" : "#111827"
              }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <span className="bg-clip-text text-transparent font-munika"
                style={{
                  background: 'linear-gradient(to right, rgb(136, 87, 11), rgb(136, 87, 11))',
                  WebkitBackgroundClip: 'text',
                }}>
                {t("medical_excellence_tunisia")}
              </span>
            </motion.h2>

            <motion.div className="space-y-6">
              {[t("experience_1"), t("experience_2"), t("experience_3")].map((text, i) => (
                <motion.p
                  key={i}
                  className="text-xl text-gray-700 leading-relaxed font-munika"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: isHovered ? -3 : 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  {text}
                </motion.p>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              <motion.button
                onClick={openModal}
                className="relative px-10 py-5 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-xl font-semibold flex items-center gap-3 mx-auto lg:mx-0 shadow-xl hover:shadow-2xl transition-all group overflow-hidden"
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 15px 30px -5px rgba(254,245,231, 0.4)",
                  background: "linear-gradient(to right, #f0e390, #f0e390)"
                }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Shine effect on hover */}
                <motion.span
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10"
                  initial={{ x: -100 }}
                  whileHover={{
                    x: 200,
                    transition: { duration: 0.8, ease: "easeInOut" }
                  }}
                />

                {/* Medical icon with animation */}
                <motion.div
                  className="relative z-10"
                  initial={{ rotate: 0 }}
                  whileHover={{
                    rotate: [0, 10, -10, 0],
                    transition: { duration: 0.6 }
                  }}
                >
                  <IconStethoscope
                    className="w-6 h-6 text-white transition-all group-hover:text-white"
                    strokeWidth={2.5}
                  />
                </motion.div>

                {/* Text with sliding underline */}
                <div className="relative z-10">
                  <span className="block font-munika text-white">
                    {t("make_appointment")}
                  </span>
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>

                {/* Animated arrow */}
                <motion.div
                  className="relative z-10"
                  initial={{ x: 0 }}
                  whileHover={{
                    x: 5,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 10
                    }
                  }}
                >
                  <IconArrowRight
                    className="w-5 h-5 text-white transition-all group-hover:text-white"
                    strokeWidth={2.5}
                  />
                </motion.div>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Professional Medical Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* Modal Content */}
            <motion.div
              className="relative z-10 bg-white dark:bg-neutral-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Fermer"
              >
                <IconX size={24} />
              </button>

              <div className="p-8 md:p-12">
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-munika text-gray-900 dark:text-white mb-4">
                    <span className="text-yellow-600">{t("book_with_specialists")}</span>
                  </h2>
                  <p className="text-xl font-munika text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    {t("fill_form_contact")}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Procedure Steps */}
                  <div className="space-y-8">
                    <h3 className="text-2xl font-munika text-gray-900 dark:text-white flex items-center gap-2">
                      <IconCheck className="text-yellow-500" />
                      <span>{t("our_process")}</span>
                    </h3>

                    <div className="space-y-6">
                      {procedures.map((procedure, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-10 h-10 rounded-full bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center">
                              {procedure.icon}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-lg font-munika text-gray-900 dark:text-white">
                              {procedure.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 font-munika">
                              {procedure.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-xl border border-yellow-100 dark:border-yellow-900/20">
                      <h4 className="font-munika text-gray-900 dark:text-white mb-3">
                        {t("contact_information")}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-700 font-munika dark:text-gray-300">
                          <IconPhoneCall className="w-5 h-5 text-yellow-600" />
                          <span>+216 12 345 678</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-munika">
                          <IconMapPin className="w-5 h-5 text-yellow-600" />
                          <span>{t("clinic_address")}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Form */}
                  <div>
                    <form className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-munika text-gray-700 dark:text-gray-300 mb-1">
                          {t("full_name")}
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-neutral-800 dark:text-white transition-all"
                          placeholder={t("your_name")}
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-munika text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-neutral-800 dark:text-white transition-all"
                          placeholder={t("your_email")}
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-munika text-gray-700 dark:text-gray-300 mb-1">
                          {t("phone")}
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-neutral-800 dark:text-white transition-all"
                          placeholder="+216"
                        />
                      </div>

                      <div>
                        <label htmlFor="procedure" className="block text-sm font-munika text-gray-700 dark:text-gray-300 mb-1">
                          {t("procedure_interest")}
                        </label>
                        <select
                          id="procedure"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-neutral-800 dark:text-white transition-all font-munika"
                        >
                          <option value="">{t("select_option")}</option>
                          <option value="rhinoplasty">{t("rhinoplasty")}</option>
                          <option value="liposuction">{t("liposuction")}</option>
                          <option value="breast-augmentation">{t("breast_augmentation")}</option>
                          <option value="other">{t("other")}</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-munika text-gray-700 dark:text-gray-300 mb-1">
                          {t("message")}
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-neutral-800 dark:text-white transition-all"
                          placeholder={t("describe_request")}
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full px-6 py-4 bg-gradient-to-r from-yellow-600 to-yellow-600 text-white font-munika rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        {t("send_request")}
                        <IconArrowRight className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Medical3DCard;