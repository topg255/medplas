"use client";
import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { cn } from "../../public/utils";
import {
  IconStethoscope,
  IconMicroscope,
  IconHeartbeat,
  IconBrain,
  IconBone,
  IconEye,
  IconDental,
  IconCalendar,
  IconStar,
  IconChevronRight,
  IconArrowRight,
  IconCheck,
  IconX,
  IconClock,
  IconAward,
  IconUsers,
  IconShieldCheck
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

// Modal de détails médical épuré
const MedicalDetailsModal = ({ isOpen, onClose, content }) => {
  if (!isOpen || !content) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Fond semi-transparent */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Contenu du modal */}
          <motion.div
            className="relative w-full max-w-4xl  rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25 }}
          >
            {/* En-tête */}
            <div className="p-6 bg-gradient-to-r from-blue-500 to-teal-500 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-white/20">
                    {content.icon || <IconStethoscope className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{content.title}</h2>
                    <p className="text-blue-100 text-sm">Détails du service médical</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <IconX className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Description</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {content.description}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Avantages</h3>
                    <ul className="space-y-2">
                      {content.benefits?.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <IconCheck className="w-4 h-4 text-green-600" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Spécifications</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span>Durée :</span>
                        <span className="font-semibold">2-4 heures</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Récupération :</span>
                        <span className="font-semibold">2-4 semaines</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * StickyScroll - Design épuré sans cadre avec ligne animée
 */
export const StickyScroll = ({
  content,
  contentClassName,
  textClassName,
  imageClassName,
  enableParallax = true,
  onSectionChange
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const imageContainerRef = useRef(null);

  // Icônes médicales
  const medicalIcons = [
    IconStethoscope,
    IconMicroscope,
    IconHeartbeat,
    IconBrain,
    IconBone,
    IconEye,
    IconDental,
    IconCalendar
  ];

  const renderMedicalIcon = (index) => {
    const IconComponent = medicalIcons[index % medicalIcons.length];
    return (
      <motion.div
        className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 shadow-lg"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ duration: 0.3 }}
      >
        <IconComponent className="h-6 w-6 text-white" />
      </motion.div>
    );
  };

  // Gestion du modal
  const handleDetailsClick = (item) => {
    setSelectedContent(item);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
  };

  // Détection de défilement avec progression
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isAutoScrolling) return;

      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - containerHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      
      setScrollProgress(progress);

      const scrollPosition = scrollTop + (containerHeight * 0.4);

      let newActiveCard = activeCard;
      let minDistance = Infinity;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        const cardTop = card.offsetTop;
        const cardHeight = card.clientHeight;
        const cardCenter = cardTop + (cardHeight / 2);
        const distance = Math.abs(scrollPosition - cardCenter);

        if (distance < minDistance) {
          minDistance = distance;
          newActiveCard = index;
        }
      });

      if (newActiveCard !== activeCard) {
        setActiveCard(newActiveCard);
        onSectionChange?.(newActiveCard);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeCard, isAutoScrolling, onSectionChange]);

  // Défilement fluide vers une section
  const scrollToSection = (index) => {
    const container = containerRef.current;
    if (!container || !cardRefs.current[index]) return;

    setIsAutoScrolling(true);
    setActiveCard(index);

    container.scrollTo({
      top: cardRefs.current[index].offsetTop - 100,
      behavior: 'smooth'
    });

    setTimeout(() => setIsAutoScrolling(false), 800);
  };

  // Animation de la ligne entre les images
  const lineVariants = {
    hidden: { scaleY: 0 },
    visible: (progress) => ({
      scaleY: progress,
      transition: { duration: 0.3 }
    })
  };

  const { t } = useTranslation();

  return (
    <div className="relative w-full overflow-hidden">
      {/* En-tête minimaliste */}
      <motion.div
        className="px-4 sm:px-6 lg:px-8 text-center mb-12 pt-8 bg-gradient-to-b from-white to-white"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
        >
          {t("sticky_title")}{" "}
          <span className="bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
            {t("sticky_title_highlight")}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-lg text-gray-600 max-w-3xl mx-auto"
        >
          {t("sticky_subtitle")}
        </motion.p>
      </motion.div>

      {/* Conteneur principal sans cadre */}
      <div className="relative w-full">
        <motion.div
          ref={containerRef}
          className={cn(
            "h-screen overflow-y-auto flex flex-col lg:flex-row gap-0",
            "scrollbar-hidden", // Cache la barre de scroll
            contentClassName
          )}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Colonne de contenu à gauche - Sans bordure */}
          <div className="lg:w-1/2 lg:pr-8 relative">
            {/* Ligne animée colorée entre les sections */}
         

            {/* Sections de contenu */}
            {content.map((item, index) => (
              <motion.div
                key={`section-${index}`}
                ref={el => cardRefs.current[index] = el}
                className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-8 lg:px-12 relative"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                {/* Point sur la ligne */}
                <motion.div
                  className={`absolute left-8 w-3 h-3 rounded-full z-10 ${
                    activeCard === index 
                      ? 'scale-150 bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg' 
                      : 'bg-gray-400'
                  }`}
                  whileHover={{ scale: 1.5 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Contenu */}
                <div className="ml-16 max-w-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    {renderMedicalIcon(index)}
                    <motion.h2
                      className={cn(
                        "text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900",
                        textClassName
                      )}
                      whileHover={{ x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.title}
                    </motion.h2>
                  </div>

                  <motion.p
                    className={cn(
                      "text-lg text-gray-700 leading-relaxed mb-6",
                      textClassName
                    )}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    {item.description}
                  </motion.p>

                  {/* Points clés */}
                  {item.features && (
                    <motion.div
                      className="space-y-3 mb-8"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      viewport={{ once: true }}
                    >
                      {item.features.map((feature, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center gap-3"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Bouton détails */}
                  <motion.button
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group"
                    whileHover={{ x: 5 }}
                    onClick={() => handleDetailsClick(item)}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t("sticky_details_btn")}
                    <IconChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Colonne visuelle à droite - Sans cadre */}
          <div className={cn(
            "lg:w-1/2 lg:sticky lg:top-0 h-screen flex items-center justify-center px-4 sm:px-8",
            imageClassName
          )}>
            <div 
              ref={imageContainerRef}
              className="w-full h-4/5 rounded-2xl overflow-hidden relative"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`image-${activeCard}`}
                  className="w-full h-full relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {/* Contenu visuel */}
                  {content[activeCard]?.content ?? (
                    <motion.div 
                      className="w-full h-full bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-center p-8">
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <IconStethoscope className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                        </motion.div>
                        <p className="text-gray-600 text-lg">Service médical spécialisé</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Overlay d'informations flottant */}
                  <motion.div
                    className="absolute bottom-6 left-6 right-6"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {content[activeCard]?.title}
                      </h3>
                                
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal de détails */}
      <MedicalDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModal}
        content={selectedContent}
      />

      {/* Styles CSS */}
      <style jsx global>{`
        .scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        
        /* Animation fluide pour le scroll */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};