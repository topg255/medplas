import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

export const ScrollToTopButton = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");

  useEffect(() => {
    let lastScrollTop = window.scrollY;
    let timeout;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / scrollHeight) * 100;

      setScrollProgress(progress);
      setIsVisible(scrollTop > 400);

      if (scrollTop > lastScrollTop + 10) {
        setScrollDirection("down");
      } else if (scrollTop < lastScrollTop - 10) {
        setScrollDirection("up");
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

      // Clear timeout on scroll
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setScrollDirection("up"); // Reset to up after inactivity
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 w-12 h-12 rounded-xl shadow-xl overflow-hidden transition-all duration-300 z-30 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        background: `conic-gradient(from 0deg, #224288 ${scrollProgress}%, transparent ${scrollProgress}%)`
      }}
    >
      <div className="absolute inset-1 bg-blue-600 rounded-xl flex items-center justify-center">
        <motion.div
          animate={{
            y: scrollDirection === "down" ? [0, -5, 0] : [0, 5, 0]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <ArrowUp size={24} className="text-white" />
        </motion.div>
      </div>
    </motion.button>
  );
};