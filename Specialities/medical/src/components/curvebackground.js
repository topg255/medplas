import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import V from '../assets/vz.mp4'
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

// Modifier ces valeurs pour chaque page
const PAGE_CONFIG = {
  id: "tourism",
  title: "Medical Tourism in Tunisia",
  description: "We are your dedicated partner for medical tourism in Tunisia, offering a range of services to ensure your healthcare journey is seamless and comfortable.",
  videoSrc: V,
  nextPage: "http://localhost:3028/",
  prevPage: "http://localhost:3029/"
};

export const CurvedBackground = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const goToHome = () => {
    window.location.href = "http://localhost:3020/"; 
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
          className="fixed left-0 top-1/2 z-40 border-rose-800 bg-rose-100/90 hover:bg-rose-200/95 transition-all duration-300 ease-out shadow-xl flex flex-col items-center justify-center h-36 w-12 rounded-r-xl border-r-4 border-t border-b"
          whileHover={{
           
            backgroundColor: "rgba(250, 177, 222)"
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{ transform: 'translateY(-50%)' }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="writing-vertical text-sm font-medium text-rose-600 tracking-wide"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              IVF
            </div>
          </div>
        </motion.a>
      )}

      {PAGE_CONFIG.nextPage && (
        <motion.a
          href={PAGE_CONFIG.nextPage}
          className="fixed right-0 top-1/2 z-40 bg-orange-100/90 hover:bg-orange-200/95 transition-all duration-300 ease-out shadow-xl flex flex-col items-center justify-center h-36 w-12 rounded-l-xl border-l-4 border-t border-b border-orange-700"
          whileHover={{
            
            backgroundColor: "rgba(252, 226, 184, 0.84)"
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{ transform: 'translateY(-50%)' }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="writing-vertical text-sm font-munika text-orange-600  tracking-wide"
              style={{ writingMode: 'vertical-rl' }}>
              Hair transplant
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
          className={`fixed top-0 left-0 w-[76rem] z-50 transition-all duration-500 ease-in-out ${showNavbar ? "top-0 opacity-100" : "-top-20 opacity-0"
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
                      className="flex items-center bg-green-600 text-white px-4 py-2 rounded-full font-munika"
                    >
                      <FiHome className="mr-2 text-lg" />
                      Home
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
              <FiActivity className="inline mr-3 text-green-400 mb-2" />
              We Offer The Best<br />{PAGE_CONFIG.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-white/90 mb-8 font-munika flex items-start"
            >
              <FiHeart className="flex-shrink-0 mr-2 mt-1 text-red-400" />
              {PAGE_CONFIG.description}
            </motion.p>
            <button className="text-white font-munika border border-white px-8 py-3 rounded-full transition-colors duration-300 hover:bg-[#1a1440] hover:text-white">
              Contact us
            </button>
          </div>
        </div>
      </div>

      {/* Barre en bas */}
      <div className="w-full bg-green-500 text-white py-6 text-center">
        <h2 className="text-xl font-bold font-munika">Explore AI innovation in PlasFora</h2>
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
            Learn more →
          </motion.span>
        </a>
      </div>
    </div>
  );
};

export default CurvedBackground;