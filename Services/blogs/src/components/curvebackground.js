import React, { useState, useEffect } from "react";
import Da from '../assets/blogs.mp4'
import D from '../assets/wikimed.mp4'
import { StaggeredDropDown } from "./Clip";
import { motion } from "framer-motion";
import {
  FiHome,
  FiArrowRight,
  FiActivity,
  FiHeart,
  FiUsers,
  FiShield,
  FiX,
} from "react-icons/fi";

export const CurvedBackground = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="relative w-full flex flex-col h-full">
      {/* Background video */}
      <div className="relative w-full h-screen">
        <video
          src={Da}
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
                      href="http://localhost:3000/"
                      className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-full font-munika"
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
          {/* Left text */}
          <div className="md:w-1/2 text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl font-bold font-munika leading-tight mb-6 mt-12"
            >
              <FiActivity className="inline mr-3 text-blue-400 mb-2" />
              Welcome To Our 
              Medical Blogs
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-white/90 mb-8 font-munika flex items-start"
            >
              <FiHeart className="flex-shrink-0 mr-2 mt-1 text-red-400" />
              Our dedicated team delivers personalized, innovative healthcare with compassion.
              Combining cutting-edge technology with patient-centered care for your well-being.
            </motion.p>
            <div className="flex space-x-4 items-center">
              <button className="text-white font-munika border border-white px-8 py-3 rounded-full transition-colors duration-300 hover:bg-[#1a1440] hover:text-white">
                Contact us
              </button>
             
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg overflow-hidden w-full max-w-3xl max-h-[90vh] flex flex-col"
          >
            {/* Close button */}
            <div className="flex justify-end p-2">
              <button
                onClick={toggleModal}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1">
              {/* Video */}
              <div className="w-full bg-black">
                <video
                  src={D}
                  autoPlay
                  controls
                  className="w-full h-auto max-h-[400px] object-contain"
                />
              </div>

              {/* Description */}
              <div className="p-6">
                <h3 className="text-2xl font-bold font-munika mb-4 text-gray-800">
                  About TUNISIA
                </h3>
                <p className="text-gray-600 mb-4">
                  Discover the beauty, culture, and hospitality of Tunisia — a Mediterranean gem offering world-class medical tourism, rich history, and unforgettable experiences. From ancient ruins to modern clinics, Tunisia blends tradition and innovation seamlessly.

                </p>
                <p className="text-gray-600 mb-4">
                  Key features include:
                </p>
                <ul className="list-disc pl-5 mb-6 text-gray-600 space-y-2">
                  <li>Renowned destinations for medical and wellness tourism</li>
                  <li>Warm, welcoming environment and Mediterranean lifestyle                  </li>
                  <li>Affordable healthcare with internationally trained specialists                  </li>
                  <li>Multi-language communication and cultural diversity                  </li>
                  <li>24/7 assistance for travelers and patients</li>
                </ul>
                <div className="flex items-center text-blue-600">
                  <FiArrowRight className="mr-2" />
                  <span className="font-medium">Learn more about our features</span>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-100 px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <div className="flex space-x-4">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FiUsers size={20} />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800">
                      <FiShield size={20} />
                    </button>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors whitespace-nowrap">
                    Get Started Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Bar displayed directly below the video */}
      <div className="w-full bg-[#1a1440] text-white py-6 text-center">
        <h2 className="text-xl font-bold font-munika">Explore AI innovation in PlasFora</h2>
        <a
          href="#"
          className="text-white font-munika underline mt-2 block hover:text-gray-300 items-center justify-center gap-2"
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