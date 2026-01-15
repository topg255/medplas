"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import Case1 from '../assets/cas1.jpg';
import Case2 from '../assets/cas2.jpg';
import Case3 from '../assets/cas3.jpg';
import Case4 from '../assets/cas4.jpg';
import Case5 from '../assets/cas5.jpg';
import Case6 from '../assets/cas6.jpg';
import { 
  IconX, 
  IconChevronLeft, 
  IconChevronRight, 
  IconMicroscope,
  IconDental,
  IconMedicalCross,
  IconCalendar,
  IconCheck,
  IconGridDots,
  IconZoomIn,
  IconMenu2,
  IconArrowRight
} from "@tabler/icons-react";

// Gallery data
const galleryImages = [
  { 
    src: Case1, 
    altKey: 'gallery_case1_alt',
    categoryKey: 'gallery_implants',
    descriptionKey: 'gallery_case1_desc'
  },
  { 
    src: Case2, 
    altKey: 'gallery_case2_alt',
    categoryKey: 'gallery_whitening',
    descriptionKey: 'gallery_case2_desc'
  },
  { 
    src: Case3, 
    altKey: 'gallery_case3_alt',
    categoryKey: 'gallery_orthodontics',
    descriptionKey: 'gallery_case3_desc'
  },
  { 
    src: Case4, 
    altKey: 'gallery_case4_alt',
    categoryKey: 'gallery_implants',
    descriptionKey: 'gallery_case4_desc'
  },
  { 
    src: Case5, 
    altKey: 'gallery_case5_alt',
    categoryKey: 'gallery_whitening',
    descriptionKey: 'gallery_case5_desc'
  },
  { 
    src: Case6, 
    altKey: 'gallery_case6_alt',
    categoryKey: 'gallery_orthodontics',
    descriptionKey: 'gallery_case6_desc'
  },
];

export const GalleryModal = ({ images, initialIndex = 0, onClose }) => {
  const { t } = useTranslation();
  const [[currentIndex, direction], setCurrentIndex] = useState([initialIndex, 0]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const navigate = (newIndex) => {
    const direction = newIndex > currentIndex ? 1 : -1;
    setCurrentIndex([newIndex, direction]);
  };

  const nextImage = () => navigate((currentIndex + 1) % images.length);
  const prevImage = () => navigate((currentIndex - 1 + images.length) % images.length);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Blur overlay */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Main content */}
      <div className={`relative z-10 ${isFullscreen ? 'w-full h-full' : 'w-full max-w-7xl h-[90vh]'} flex flex-col bg-white dark:bg-neutral-900 rounded-xl overflow-hidden`}>
        {/* Top control bar */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <button 
            onClick={onClose}
            className="hover:text-blue-200 transition-colors p-1"
            aria-label="Close gallery"
          >
            <IconX size={28} />
          </button>
          
          <div className="flex items-center gap-4">
            <span className="font-medium bg-black/20 px-3 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </span>
            <button 
              onClick={toggleFullscreen}
              className="hover:text-blue-200 transition-colors p-1"
              aria-label={isFullscreen ? "Exit fullscreen mode" : "Fullscreen mode"}
            >
              <IconZoomIn size={24} />
            </button>
          </div>
        </div>

        {/* Image container with animations */}
        <div className="relative flex-1 overflow-hidden">
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-neutral-800"
          >
            <img
              src={images[currentIndex].src}
              alt={t(images[currentIndex].altKey)}
              className="max-w-full max-h-full object-contain"
              draggable="false"
            />
          </motion.div>
          
          {/* Navigation */}
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full z-20 transition-all shadow-lg"
            aria-label="Previous image"
          >
            <IconChevronLeft size={32} />
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full z-20 transition-all shadow-lg"
            aria-label="Next image"
          >
            <IconChevronRight size={32} />
          </button>
        </div>

        {/* Information panel */}
        <div className="bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-2 overflow-x-auto py-2 md:max-h-[120px]">
              {images.map((img, index) => (
                <motion.button
                  key={index}
                  onClick={() => navigate(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 ${currentIndex === index ? 'border-blue-500' : 'border-transparent'}`}
                >
                  <img 
                    src={img.src} 
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
            
            {/* Details */}
            <div className="flex-1">
              <h3 className="text-xl font-munika text-gray-900 dark:text-white mb-2">
                {t(images[currentIndex].altKey)}
              </h3>
              <div className="flex gap-2 mb-3">
                <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-xs font-munika">
                  {t(images[currentIndex].categoryKey)}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-munika">
                {t(images[currentIndex].descriptionKey)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const GallerySection = () => {
  const { t } = useTranslation();
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filter, setFilter] = useState('all');

  const filterKeys = [
    { key: 'all', label: t('gallery_filter_all') },
    { key: 'gallery_implants', label: t('gallery_implants') },
    { key: 'gallery_whitening', label: t('gallery_whitening') },
    { key: 'gallery_orthodontics', label: t('gallery_orthodontics') }
  ];

  const filteredImages = filter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.categoryKey === filter);

  const openGallery = (index) => {
    setCurrentImageIndex(index);
    setShowGallery(true);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-900" id="gallery">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-munika text-gray-900 dark:text-white mb-4"
          >
            <span className="text-blue-800 font-munika">{t('gallery_title')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl font-munika text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            {t('gallery_subtitle')}
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {filterKeys.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              className={`px-4 py-2 rounded-full capitalize font-medium transition-all ${
                filter === cat.key 
                  ? 'bg-blue-600 text-white font-munika shadow-md' 
                  : 'bg-gray-100 dark:bg-neutral-700 text-gray-800 dark:text-gray-200 hover:bg-blue-300 dark:hover:bg-neutral-600 font-munika'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Gallery grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700"
              layout
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={image.src}
                  alt={t(image.altKey)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6">
                  <span className="text-white font-munika">{t(image.altKey)}</span>
                  <span className="text-blue-300 text-sm font-munika">{t(image.categoryKey)}</span>
                </div>
                <button 
                  onClick={() => openGallery(filteredImages.findIndex(img => img.src === image.src))}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all hover:scale-110"
                  aria-label={t('gallery_zoom_label')}
                >
                  <IconZoomIn size={20} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-munika text-gray-900 dark:text-white">{t(image.altKey)}</h3>
                <p className="text-gray-600 font-munika dark:text-gray-300 text-sm mt-1 line-clamp-2">
                  {t(image.descriptionKey)}
                </p>
                <button
                  onClick={() => openGallery(filteredImages.findIndex(img => img.src === image.src))}
                  className="mt-3 text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 text-sm font-munika flex items-center"
                >
                  {t('gallery_view_details')} <IconArrowRight size={16} className="ml-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={() => {
              setCurrentImageIndex(0);
              setShowGallery(true);
            }}
            whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold flex items-center mx-auto shadow-lg transition-all"
          >
            <IconGridDots className="mr-2" />
            {t('gallery_explore_full')}
          </motion.button>
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {showGallery && (
            <GalleryModal 
              images={filteredImages} 
              initialIndex={currentImageIndex}
              onClose={() => setShowGallery(false)} 
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default GallerySection;