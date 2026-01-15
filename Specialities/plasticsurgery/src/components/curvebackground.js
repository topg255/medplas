import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import URL from "url-parse";
import { 
  FiHome,
  FiArrowRight,
  FiArrowLeft,
  FiPhoneCall,
  FiActivity,
  FiHeart,
  FiStar,
  FiUsers,
  FiShield
} from "react-icons/fi";
import { StaggeredDropDown } from "./Clip";
import { useTranslation } from "react-i18next";

// Modifier ces valeurs pour chaque page
const PAGE_CONFIG = {
  id: "page-id", // Ex: "plastic-surgery", "hair-transplant", etc.
  title: "plastic surgery services", // Ex: "Plastic Surgery Services"
  description: "Our dedicated team delivers personalized, innovative healthcare with compassion. Combining cutting-edge technology with patient-centered care for your well-being.",
  videoSrc: URL('https://res.cloudinary.com/dk8b4jqbb/video/upload/v1766049343/6998180-hd_1920_1080_25fps_id7tjy.mp4  '), // Changer la vidéo pour chaque page
  nextPage: "http://localhost:3070/", // Lien vers la page suivante
};

export const CurvedBackground = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { t } = useTranslation();
  const goToHome = () => {
    window.location.href = "http://localhost:3020/"; // Lien vers la page d'accueil
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setShowNavbar(true);
      } else if (window.scrollY > lastScrollY) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="relative w-full flex flex-col h-full">
      {/* Barres latérales de navigation */}
      {PAGE_CONFIG.nextPage && (
        <motion.a
          href={PAGE_CONFIG.nextPage}
          className="fixed right-0 top-1/2 z-40 bg-blue-100/90 hover:bg-blue-200/95 transition-all duration-300 ease-out shadow-xl flex flex-col items-center justify-center h-36 w-12 rounded-l-xl border-l-4 border-t border-b border-blue-800"
          whileHover={{
            
            backgroundColor: "rgba(168, 218, 255, 0.84)"
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{ transform: 'translateY(-50%)' }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="writing-vertical text-sm font-munika text-blue-600  tracking-wide"
              style={{ writingMode: 'vertical-rl' }}>
                {t("next_page_label")}
              
            </div>
          </div>
        </motion.a>
      )}

      {/* Vidéo de fond */}
      <div className="relative w-full h-screen">
        <video
          src={PAGE_CONFIG.videoSrc}
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-white text-2xl pl-20 mt-5 font-munika absolute">PlasFora</div>
        </motion.div>

        {/* Navigation */}
        <header
          className={`fixed top-0 left-0 w-[76rem] z-50 transition-all duration-500 ease-in-out ${
            showNavbar ? "top-0 opacity-100" : "-top-20 opacity-0"
          }`}
        >
          <motion.header
            initial={{ y: -100 }}
            animate={{ y: showNavbar ? 0 : -100 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed top-0 w-full z-50"
          >
            <div className="container mx-auto px-4 py-4 flex justify-center">
              <nav className="bg-white/90 backdrop-blur-lg rounded-full px-6 py-2 shadow-lg">
                <ul className="flex space-x-6 items-center">
                  <li>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={goToHome}
                      className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded-full font-munika"
                    >
                      <FiHome className="mr-2 text-lg" />
                      {t("home")}
                    </motion.a>
                  </li>
                  <li>
                    <StaggeredDropDown />
                  </li>
                </ul>
              </nav>
            </div>
          </motion.header>
        </header>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 py-4 mt-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl font-bold font-munika leading-tight mb-6 mt-12"
            >
              <FiActivity className="inline mr-3 text-yellow-100 mb-2" />
              {t("offer_best")}<br />{t("page_title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-white/90 mb-8 font-munika flex items-start"
            >
              <FiHeart className="flex-shrink-0 mr-2 mt-1 text-red-400" />
              {t("page_description")}
            </motion.p>
            <button className="text-white font-munika border border-white px-8 py-3 rounded-full transition-colors duration-300 hover:bg-[#1a1440] hover:text-white">
              {t("contact_us")}
            </button>
          </div>
        </div>
      </div>

      {/* Barre en bas */}
      <div className="w-full bg-yellow-100 text-black py-6 text-center">
        <h2 className="text-xl font-bold font-munika">{t("explore_ai")}</h2>
        <a
          href="#"
          className="text-black font-munika underline mt-2 block hover:text-yellow-800 flex items-center justify-center gap-2"
        >
          <motion.span
            className="inline-block"
            initial={{ x: 0 }}
            whileHover={{ x: 8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {t("learn_more")}
          </motion.span>
        </a>
      </div>
    </div>
  );
};

export default CurvedBackground;