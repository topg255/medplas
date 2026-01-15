"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff, FiChevronRight, FiChevronLeft, FiCheck, FiX } from "react-icons/fi";
import {
  HiOutlineIdentification,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineAcademicCap,
  HiOutlineBriefcase
} from "react-icons/hi";
import {
  FaClinicMedical as FaHospital,
  FaFileUpload,
  FaRegCheckCircle,
  FaInfoCircle,
  FaLocationArrow,
  FaFileAlt,
  FaUserCircle,
  FaUserMd
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import doctorImage1 from "./assets/medical.jpg";
import doctorImage2 from "./assets/medical1.jpg";
import doctorImage3 from "./assets/medical3.jpg";
import { Hospital } from "lucide-react";

const AgentRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    AgencyType: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("fr");
  const [activeImage, setActiveImage] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const images = [
    { src: doctorImage1, alt: "Professional Doctors", caption: "Expert Medical Professionals", description: "Board-certified specialists with international training" },
    { src: doctorImage2, alt: "Medical Consultation", caption: "Quality Patient Care", description: "Personalized treatment plans for optimal results" },
    { src: doctorImage3, alt: "Surgical Team", caption: "Surgical Excellence", description: "Advanced surgical procedures with high success rates" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const medecinData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      location: formData.location.trim(),
      AgencyType: formData.AgencyType,
    };

    try {
      const response = await fetch('http://localhost:3001/users/travelAgency/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(medecinData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      console.log('Doctor registered successfully:', data);

      // Afficher la pop-up de succès
      setShowSuccessPopup(true);

      // Rediriger vers login après 3 secondes
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);

    } catch (error) {
      console.error('Error during doctor registration:', error.message);
      setError(error.message || (language === "fr"
        ? "Erreur lors de l'enregistrement"
        : "Registration error"));
    } finally {
      setIsLoading(false);
    }
  };

  const goToNextStep = () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.password ) {
        setError(language === "fr"
          ? "Veuillez remplir tous les champs obligatoires"
          : "Please fill all required fields");
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const goToHome = () => {
    window.location.href = "http://localhost:3000/";
  };

  const goToLogin = () => {
    navigate("/login");
  };

  const steps = [
    { id: 1, icon: <FaUserCircle />, label: language === "fr" ? "Informations" : "Information", description: language === "fr" ? "Détails personnels" : "Personal details" },
    { id: 2, icon: <FaUserMd />, label: language === "fr" ? "Professionnel" : "Professional", description: language === "fr" ? "Informations médicales" : "Medical information" },
    { id: 3, icon: <FaFileAlt />, label: language === "fr" ? "Documents" : "Documents", description: language === "fr" ? "Télécharger documents" : "Upload documents" }
  ];

  const specialties = [
    { value: "dermatology", label: "Dermatology" },
    { value: "plastic_surgery", label: "Plastic Surgery" },
    { value: "ophthalmology", label: "Ophthalmology" },
    { value: "cardiology", label: "Cardiology" },
    { value: "orthopedics", label: "Orthopedics" },
    { value: "neurology", label: "Neurology" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "dentistry", label: "Dentistry" },
    { value: "gynecology", label: "Gynecology" },
    { value: "radiology", label: "Radiology" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      {/* Pop-up de succès */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
          >
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>

              <div className="p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <FiCheck className="h-10 w-10 text-green-600" />
                  </motion.div>
                </div>

                <motion.h3
                  className="text-2xl font-bold text-gray-900 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {language === "fr" ? "Inscription réussie !" : "Registration Successful!"}
                </motion.h3>

                <motion.p
                  className="text-gray-600 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {language === "fr"
                    ? "Votre compte médecin a été créé avec succès. Vous serez redirigé vers la page de connexion."
                    : "Your doctor account has been successfully created. You will be redirected to the login page."}
                </motion.p>

                <motion.div
                  className="w-full bg-gray-100 rounded-full h-2 mb-6 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-sm text-gray-500">
                    {language === "fr"
                      ? "Notre équipe vérifiera vos informations sous 48h."
                      : "Our team will verify your information within 48h."}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100 transform transition-all hover:shadow-2xl">
        {/* Left Side - Visual Section */}
        <div className="lg:w-1/2 relative h-96 lg:h-auto">
          <div className="absolute inset-0 overflow-hidden">
            <AnimatePresence initial={false}>
              {images.map((img, index) => (
                index === activeImage && (
                  <motion.div
                    key={index}
                    className="absolute inset-0 w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      zIndex: 10
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover select-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/30 to-transparent flex flex-col justify-end p-8">
                      <motion.div
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        className="text-white"
                      >
                        <h3 className="text-2xl font-munika mb-2">{img.caption}</h3>
                        <p className="text-blue-100 text-lg font-munika">{img.description}</p>
                        <div className="mt-4 flex space-x-2">
                          {images.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveImage(i)}
                              className={`h-1 rounded-full transition-all ${i === activeImage ? 'bg-white w-6' : 'bg-white/50 w-3'}`}
                              aria-label={`View image ${i + 1}`}
                            />
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>

          {/* Branding Overlay */}
          <div className="absolute top-6 left-6 z-30">
            <motion.div
              className="flex items-center cursor-pointer"
              onClick={goToHome}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md hover:bg-white/30 transition duration-300">
                <FaLocationArrow className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-white font-munika text-xl">Plasfora</span>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="lg:w-1/2 p-8 md:p-12 lg:p-16">
          <motion.div
            className="w-full max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-munika text-blue-800 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                {language === "fr" ? "SUPERVISING DOCTOR REGISTER" : "DOCTOR REGISTRATION"}
              </h1>
              <p className="text-gray-600 text-base font-munika">
                {language === "fr"
                  ? "Complétez votre inscription en 3 étapes simples"
                  : "Complete your registration in 3 simple steps"}
              </p>

              {/* Step Indicator */}
              <div className="max-w-2xl mx-auto mb-16 mt-8">
                <div className="flex justify-between items-center relative">
                  <div className="absolute h-0.5 bg-gray-200 top-5 left-0 right-0 z-0"></div>
                  {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center relative z-10 w-1/3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {step.icon}
                      </div>
                      <div className="text-center mt-2">
                        <span className={`text-sm font-munika ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'}`}>
                          {step.label}
                        </span>
                        <p className="text-xs text-gray-500 mt-1 font-munika">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1 - Personal Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="space-y-4">
                    <h2 className="text-lg font-munika text-gray-800 flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <HiOutlineIdentification className="text-blue-600 text-lg" />
                      </div>
                      {language === "fr" ? "Informations personnelles" : "Personal Information"}
                    </h2>

                    <div>
                      <label className="block text-sm font-munika text-gray-700 mb-1">
                        {language === "fr" ? "Nom complet" : "Full Name"}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <HiOutlineIdentification className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="block w-full font-munika pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                          placeholder={language === "fr" ? "Prénom et nom" : "First and last name"}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-munika text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <HiOutlineMail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 font-munika rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Account Security */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-munika text-gray-800 flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <HiOutlineLockClosed className="text-blue-600 text-lg" />
                      </div>
                      {language === "fr" ? "Sécurité du compte" : "Account Security"}
                    </h2>

                    <div>
                      <label className="block text-sm font-munika text-gray-700 mb-1">
                        {language === "fr" ? "Mot de passe" : "Password"}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-10 font-munika py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                          placeholder={language === "fr" ? "Minimum 8 caractères" : "Minimum 8 characters"}
                          minLength="8"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <HiOutlineEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <HiOutlineEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2 - Professional Information */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-munika text-gray-800 flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <HiOutlineBriefcase className="text-blue-600 text-lg" />
                    </div>
                    {language === "fr" ? "Informations professionnelles" : "Professional Information"}
                  </h2>
                  <div>
                    <label className="block text-sm font-munika text-gray-700 mb-1">
                      {language === "fr" ? "Spécialité médicale" : "Medical Specialty"}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiOutlineAcademicCap className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        name="AgencyType"
                        value={formData.AgencyType}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 appearance-none"
                        required
                      >
                        <option value="">Select type</option>
                        <option value="general">General Clinic</option>
                        <option value="specialized">Specialized Clinic</option>
                        <option value="hospital">Hospital</option>
                        <option value="dental">Dental Clinic</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-munika text-gray-700 mb-1">
                      {language === "fr" ? "Hospital" : "Clinic Affiliation (optional)"}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLocationArrow className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                        placeholder={language === "fr" ? "Localisation" : "Clinic name"}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 gap-4">
                {/* Bouton Précédent */}
                {currentStep > 1 && (
                  <motion.button
                    type="button"
                    onClick={goToPreviousStep}
                    aria-label={language === "fr" ? "Étape précédente" : "Previous step"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 rounded-xl font-munika bg-white border border-gray-200 shadow-xs hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    <span className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                      <FiChevronLeft className="mr-2" />
                      {language === "fr" ? "Précédent" : "Previous"}
                    </span>
                  </motion.button>
                )}

                {/* Conteneur flexible pour le bouton Suivant/Soumettre */}
                <div className="flex-1 flex justify-end">
                  {currentStep < 3 ? (
                    <motion.button
                      type="button"
                      onClick={goToNextStep}
                      aria-label={language === "fr" ? "Étape suivante" : "Next step"}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 rounded-xl font-munika bg-gradient-to-r from-blue-600 to-blue-700 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white"
                    >
                      <span className="flex items-center justify-center">
                        {language === "fr" ? "Suivant" : "Next"}
                        <FiChevronRight className="ml-2" />
                      </span>
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      aria-label={language === "fr" ? "Soumettre le formulaire" : "Submit form"}
                      whileHover={!isLoading ? { scale: 1.02 } : {}}
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
                      className={`px-6 py-3 rounded-xl font-munika shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full md:w-auto ${isLoading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                        }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {language === "fr" ? "Enregistrement en cours..." : "Processing..."}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          {language === "fr" ? "Finaliser l'enregistrement" : "Complete Registration"}
                          <FiCheck className="ml-2" />
                        </span>
                      )}
                    </motion.button>
                  )}
                </div>
              </div>
            </form>
            <div className="mt-6 text-center font-munika text-sm text-gray-600">
              {language === "fr" ? "Déjà un compte ?" : "Already have an account?"}{' '}
              <button
                onClick={goToLogin}
                className="font-munika text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md px-1 transition-colors duration-200"
              >
                {language === "fr" ? "Connectez-vous ici" : "Sign in here"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AgentRegister;