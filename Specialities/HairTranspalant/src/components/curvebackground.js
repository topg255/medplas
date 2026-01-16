import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import URL from 'url-parse';
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
  id: "hair-transplant",
  title: "hair_curve_title",
  description: "hair_curve_desc",
  videoSrc: URL('https://res.cloudinary.com/dk8b4jqbb/video/upload/v1766052697/hair_pljixl.mp4'),
  nextPage: "http://localhost:3031/",
  prevPage: "http://localhost:3030/"
};

export const CurvedBackground = () => {
  const { t } = useTranslation();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const goToHome = () => {
    window.location.href = "https://topg255-medplas-c73h.vercel.app/";
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
      {PAGE_CONFIG.prevPage && (
        <motion.a
          href={PAGE_CONFIG.prevPage}
          className="fixed left-0 top-1/2 z-40 border-green-800 bg-green-100/90 hover:bg-green-200/95 transition-all duration-300 ease-out shadow-xl flex flex-col items-center justify-center h-36 w-12 rounded-r-xl border-r-4 border-t border-b"
          whileHover={{
            backgroundColor: "rgba(157, 250, 182, 0.95)"
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{ transform: 'translateY(-50%)' }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="writing-vertical text-sm font-medium text-green-600 tracking-wide"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              {t("hair_curve_prev_label")}
            </div>
          </div>
        </motion.a>
      )}

      {PAGE_CONFIG.nextPage && (
        <motion.a
          href={PAGE_CONFIG.nextPage}
          className="fixed right-0 top-1/2 z-40 bg-yellow-100/90 hover:bg-yellow-200/95 transition-all duration-300 ease-out shadow-xl flex flex-col items-center justify-center h-36 w-12 rounded-l-xl border-l-4 border-t border-b border-yellow-600"
          whileHover={{
            backgroundColor: "rgba(248, 250, 157, 0.84)"
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{ transform: 'translateY(-50%)' }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="writing-vertical text-sm font-munika text-yellow-600  tracking-wide"
              style={{ writingMode: 'vertical-rl' }}>
              {t("hair_curve_next_label")}
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
                      className="flex items-center bg-orange-600 text-white px-4 py-2 rounded-full font-munika"
                    >
                      <FiHome className="mr-2 text-lg" />
                      {t("hair_curve_home_label")}
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
              <FiActivity className="inline mr-3 text-orange-400 mb-2" />
              {t("hair_curve_offer_best")}<br />{t(PAGE_CONFIG.title)}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-white/90 mb-8 font-munika flex items-start"
            >
              <FiHeart className="flex-shrink-0 mr-2 mt-1 text-red-400" />
              {t(PAGE_CONFIG.description)}
            </motion.p>
            <button className="text-white font-munika border border-white px-8 py-3 rounded-full transition-colors duration-300 hover:bg-[#1a1440] hover:text-white">
              {t("hair_curve_contact_us")}
            </button>
          </div>
        </div>
      </div>

      {/* Barre en bas */}
      <div className="w-full bg-orange-400 text-white py-6 text-center">
        <h2 className="text-xl font-bold font-munika">{t("hair_curve_explore_ai")}</h2>
        <a
          href="#"
          className="text-white font-munika underline mt-2 block hover:text-gray-300 flex items-center justify-center gap-2"
        >
          <motion.span
            className="inline-block"
            initial={{ x: 0 }}
            whileHover={{ x: 8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {t("hair_curve_learn_more")}
          </motion.span>
        </a>
      </div>
    </div>
  );
};

export default CurvedBackground;