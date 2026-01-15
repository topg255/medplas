"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useTransform, animate } from "framer-motion";
import {
  IconArrowRight,
  IconMicroscope,
  IconHeartbeat,
  IconEgg,
  IconX,
  IconCalendarEvent,
  IconPhoneCall,
  IconMapPin,
  IconCheck,
  IconBabyCarriage,
  IconDna2,
  IconFlask
} from "@tabler/icons-react";
import Image4 from "../assets/ivf.jpg"; // Replace with IVF lab image
import { useTranslation } from "react-i18next";

export const IVF3DCard = () => {
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

  // IVF process steps
  const procedures = [
    {
      title: t("ivf_step1_title"),
      description: t("ivf_step1_desc"),
      icon: <IconMicroscope className="w-6 h-6 text-rose-600" />
    },
    {
      title: t("ivf_step2_title"),
      description: t("ivf_step2_desc"),
      icon: <IconHeartbeat className="w-6 h-6 text-rose-600" />
    },
    {
      title: t("ivf_step3_title"),
      description: t("ivf_step3_desc"),
      icon: <IconFlask className="w-6 h-6 text-rose-600" />
    },
    {
      title: t("ivf_step4_title"),
      description: t("ivf_step4_desc"),
      icon: <IconDna2 className="w-6 h-6 text-rose-600" />
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
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="relative bg-gradient-to-br from-rose-50/90 to-rose-50/90 py-20 overflow-hidden">
      {/* Floating IVF elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(90)].map((_, i) => (
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
                alt="High-tech IVF laboratory"
                className="w-full h-[600px] object-cover"
                loading="lazy"
                initial={{ scale: 1 }}
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              {/* Overlay with stats */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0.8 }}
              >
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">85%</div>
                    <div className="text-sm opacity-80">{t("ivf_stat_success")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">2000+</div>
                    <div className="text-sm opacity-80">{t("ivf_stat_babies")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-sm opacity-80">{t("ivf_stat_monitoring")}</div>
                  </div>
                </div>
              </motion.div>
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
              <span className="bg-gradient-to-r from-rose-800 to-rose-800 bg-clip-text text-transparent font-munika">
                {t("ivf_title")}
              </span>
            </motion.h2>

            <motion.div className="space-y-6">
              {[t("ivf_desc1"), t("ivf_desc2"), t("ivf_desc3")].map((text, i) => (
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
                className="relative px-10 py-5 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-xl font-semibold flex items-center gap-3 mx-auto lg:mx-0 shadow-xl hover:shadow-2xl transition-all group overflow-hidden"
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 15px 30px -5px rgba(59, 130, 246, 0.4)",
                  background: "linear-gradient(to right, #faaadb, #faaadb)"
                }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.span
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10"
                  initial={{ x: -100 }}
                  whileHover={{
                    x: 200,
                    transition: { duration: 0.8, ease: "easeInOut" }
                  }}
                />

                <motion.div
                  className="relative z-10"
                  initial={{ rotate: 0 }}
                  whileHover={{
                    rotate: [0, 10, -10, 0],
                    transition: { duration: 0.6 }
                  }}
                >
                  <IconMicroscope
                    className="w-6 h-6 text-white transition-all group-hover:text-white"
                    strokeWidth={2.5}
                  />
                </motion.div>

                

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
                    className="w-5 h-5 text-rose-200 transition-all group-hover:text-white"
                    strokeWidth={2.5}
                  />
                </motion.div>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* IVF Consultation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={closeModal}
            />

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
                aria-label="Close"
              >
                <IconX size={24} />
              </button>

              <div className="p-8 md:p-12">
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-munika text-gray-900 dark:text-white mb-4">
                    <span className="text-rose-600">{t("ivf_modal_title")}</span> 
                  </h2>
                  <p className="text-xl font-munika text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    {t("ivf_modal_desc")}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* IVF Process Steps */}
                  <div className="space-y-8">
                    <h3 className="text-2xl font-munika text-gray-900 dark:text-white flex items-center gap-2">
                      <IconCheck className="text-rose-500" />
                      <span>{t("ivf_process_title")}</span>
                    </h3>

                    <div className="space-y-6">
                      {procedures.map((procedure, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center">
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

                    <div className="bg-rose-50 dark:bg-rose-900/10 p-6 rounded-xl border border-rose-100 dark:border-rose-900/20">
                      <h4 className="font-munika text-gray-900 dark:text-white mb-3">
                        {t("ivf_advanced_tech")}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-700 font-munika dark:text-gray-300">
                          <IconDna2 className="w-5 h-5 text-rose-600" />
                          <span>{t("ivf_tech_icsi")}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-munika">
                          <IconEgg className="w-5 h-5 text-rose-600" />
                          <span>{t("ivf_tech_vitrification")}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-munika">
                          <IconFlask className="w-5 h-5 text-rose-600" />
                          <span>{t("ivf_tech_embryoscope")}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* IVF Consultation Form */}
                  <div>
                    <form className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-munika text-gray-700 dark:text-gray-300 mb-1">
                          {t("ivf_form_name")}
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-neutral-800 dark:text-white transition-all"
                          placeholder={t("ivf_form_name_placeholder")}
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-munika text-gray-700 dark:text-gray-300 mb-1">
                          {t("ivf_form_email")}
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-neutral-800 dark:text-white transition-all"
                          placeholder={t("ivf_form_email_placeholder")}
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-munika text-gray-700 dark:text-gray-300 mb-1">
                          {t("ivf_form_phone")}
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-neutral-800 dark:text-white transition-all"
                          placeholder={t("ivf_form_phone_placeholder")}
                        />
                      </div>

                      <div>
                        <label htmlFor="history" className="block text-sm font-munika text-gray-700 dark:text-gray-300 mb-1">
                          {t("ivf_form_history")}
                        </label>
                        <select
                          id="history"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-neutral-800 dark:text-white transition-all font-munika"
                        >
                          <option value="">{t("ivf_form_select_option")}</option>
                          <option value="infertility-primary">{t("ivf_form_history_primary")}</option>
                          <option value="infertility-secondary">{t("ivf_form_history_secondary")}</option>
                          <option value="pcos">{t("ivf_form_history_pcos")}</option>
                          <option value="endometriosis">{t("ivf_form_history_endo")}</option>
                          <option value="other">{t("ivf_form_history_other")}</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-munika text-gray-700 dark:text-gray-300 mb-1">
                          {t("ivf_form_message")}
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-neutral-800 dark:text-white transition-all"
                          placeholder={t("ivf_form_message_placeholder")}
                        ></textarea>
                      </div>

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

export default IVF3DCard;