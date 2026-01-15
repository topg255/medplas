import React, { useState, useEffect } from "react";
//import Da from "../assets/assistanr.mp4";
import { StaggeredDropDown } from "./Clip";
import { motion } from "framer-motion";
import {
  FiHome,
  FiArrowRight,
  FiPhoneCall,
  FiActivity,
  FiHeart,
  FiStar,
  FiUsers,
  FiShield
} from "react-icons/fi";

export const CurvedBackground = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setShowNavbar(true); // Show navbar when reaching top of page
      } else if (window.scrollY > lastScrollY) {
        setShowNavbar(true); // Hide navbar when scrolling down
      } else {
        setShowNavbar(false); // Show navbar when scrolling up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);


  return (
    <div className="relative w-full flex flex-col h-full ">
      {/* Background video */}
      <div className="relative w-full h-screen">
        <video
          //src={Da}
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
              We Offer The Best 
              Assistant Services
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
            <button className="text-white font-munika border border-white px-8 py-3 rounded-full transition-colors duration-300 hover:bg-[#1a1440] hover:text-white">
              Contact us
            </button>
          </div>
          {/*<div className="flex flex-1 justify-end">
            <button href="#" className="absolute w-64 h-10 flex items-center justify-center text-white rounded-full -top-16 ml-[10rem]">
              <ExampleWrapper />
            </button>
          </div>*/}
        </div>
      </div>

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
            whileHover={{ x: 8 }} // Moves the arrow 8px to the right
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