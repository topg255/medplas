import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import React, { useState } from "react";

export const ExampleWrapperr = () => {
  const [isOpen, setIsOpen] = useState(false);
  const DrawOutlineButton = ({ children, ...rest }) => {
    return (
      <button
        {...rest}
        className="group relative px-4 py-2 font-medium text-white transition-colors duration-[400ms] hover:text-[#FFFFFF] overflow-hidden"
      >
        <span>{children}</span>

        {/* Contour ovale animé */}
        <span className="absolute inset-0 rounded-full border-2 border-[#FFFFFF] border-opacity-40 scale-0 transition-transform duration-300 group-hover:scale-100"></span>

        {/* Version alternative avec animation plus élaborée */}
        <span className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <ellipse
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity="0.2"
              strokeWidth="1"
              strokeDasharray="283"
              strokeDashoffset="283"
              className="transition-all duration-700 group-hover:stroke-dashoffset-0"
            />
          </svg>
        </span>
      </button>
    );
  };




  return (
    <div className="px-4 py-64 grid place-content-center">
      <button
        onClick={() => setIsOpen(true)}

      >
        <div className="grid min-h-[800px] text-xl place-content-center font-munika bg-transparent p-4 ">
          <DrawOutlineButton>Make appointment</DrawOutlineButton>
        </div>
      </button>
      <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

const SpringModal = ({ isOpen, setIsOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-blue-400 to-indigo-400 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative z-10">
              <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-blue-600 grid place-items-center mx-auto">
                <FiAlertCircle />
              </div>
              <h3 className="text-3xl font-bold text-center mb-2">
                Medical appointment
              </h3>
              <p className="text-center mb-6">
                Make your consultation or treatment easy. Our team welcomes you in a professional setting, for tailor-made care tailored to your needs. Your well-being begins here.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                >
                  Go back
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                >
                  Make Appointment!
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExampleWrapperr;