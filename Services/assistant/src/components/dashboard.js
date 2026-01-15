import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiClock, FiUser, FiCalendar, FiMapPin, FiSettings } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const TravelDashboard = ({ currentStep }) => {
  const [progress, setProgress] = useState(0);
  
  // Simuler la progression du processus
  useEffect(() => {
    const timer = setTimeout(() => {
      const newProgress = Math.min(currentStep * 33.33, 100);
      setProgress(newProgress);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const steps = [
    { id: 1, title: "Informations Personnelles", icon: <FiUser />, status: currentStep > 1 ? "completed" : currentStep === 1 ? "active" : "pending" },
    { id: 2, title: "Détails du Voyage", icon: <FiMapPin />, status: currentStep > 2 ? "completed" : currentStep === 2 ? "active" : "pending" },
    { id: 3, title: "Confirmation", icon: <FiCheckCircle />, status: currentStep > 3 ? "completed" : currentStep === 3 ? "active" : "pending" }
  ];

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Votre Progression</h3>
        <span className="text-blue-300 text-sm font-medium">
          Étape {currentStep} sur 3
        </span>
      </div>

      {/* Barre de progression animée */}
      <div className="relative h-2 bg-white bg-opacity-10 rounded-full mb-8 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
        />
      </div>

      {/* Étapes du processus */}
      <div className="space-y-6">
        {steps.map((step) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: step.id * 0.1 }}
            className={`flex items-center p-4 rounded-xl transition-all duration-300 ${
              step.status === "active" 
                ? "bg-white bg-opacity-10 border border-blue-400 border-opacity-30" 
                : "bg-white bg-opacity-5 hover:bg-opacity-10"
            }`}
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              step.status === "completed" 
                ? "bg-green-500 text-white" 
                : step.status === "active" 
                  ? "bg-blue-500 text-white" 
                  : "bg-white bg-opacity-10 text-blue-200"
            }`}>
              {step.status === "completed" ? <FiCheckCircle size={18} /> : step.icon}
            </div>
            <div className="ml-4">
              <h4 className={`text-sm font-medium ${
                step.status === "active" 
                  ? "text-white" 
                  : step.status === "completed" 
                    ? "text-green-300" 
                    : "text-blue-200"
              }`}>
                {step.title}
              </h4>
              <p className="text-xs text-blue-300 mt-1">
                {step.status === "completed" 
                  ? "Terminé" 
                  : step.status === "active" 
                    ? "En cours..." 
                    : "À venir"}
              </p>
            </div>
            {step.status === "active" && (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="ml-auto"
              >
                <FiClock className="text-blue-400" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Détails supplémentaires */}
      <div className="mt-8 pt-6 border-t border-white border-opacity-10">
        <div className="flex items-center justify-between text-blue-200 text-sm">
          <div className="flex items-center">
            <FiSettings className="mr-2" />
            <span>Progression du dossier</span>
          </div>
          <span className="font-medium text-white">{progress.toFixed(0)}%</span>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-5 p-3 rounded-lg">
            <p className="text-xs text-blue-300">Prochaine étape</p>
            <p className="text-sm font-medium text-white mt-1">
              {currentStep < 3 ? steps[currentStep].title : "Finalisation"}
            </p>
          </div>
          <div className="bg-white bg-opacity-5 p-3 rounded-lg">
            <p className="text-xs text-blue-300">Temps estimé</p>
            <p className="text-sm font-medium text-white mt-1">
              {currentStep === 1 ? "2-3 min" : currentStep === 2 ? "1-2 min" : "Terminé"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelDashboard;