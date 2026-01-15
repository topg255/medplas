"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  Check,
  Lock,
  CheckCircle,
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Building,
  UserCheck,
  FileText,
  Hospital,
  Upload,
  Info,
  AlertCircle
} from "lucide-react";
import Image from "../dist/images/src/assets/medical1.jpg";
import Image1 from "../dist/images/src/assets/medical3.jpg";
import Image2 from "../dist/images/src/assets/medical4.jpg";
import { useNavigate } from "react-router-dom";

// Mock images - replace with your actual image imports
const doctorImage1 = Image;
const doctorImage2 = Image1;
const doctorImage3 = Image2;

const DoctorRegister = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    specialChar: false,
    uppercase: false,
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    Speciality: '',
    ClinicAffiliation: '',
    Phone: '',
    MedicalLicense: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [language, setLanguage] = useState("fr");
  const [activeImage, setActiveImage] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // API Configuration
  const API_BASE_URL = 'http://localhost:3001';
  const REGISTER_ENDPOINT = '/users/pdoctor/register';

  // Animation variants
  const inputVariants = {
    focus: { scale: 1.02, borderColor: '#3B82F6', transition: { duration: 0.2 } },
    blur: { scale: 1, borderColor: '#E5E7EB', transition: { duration: 0.2 } },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  // Liste des spécialités autorisées
  const ALLOWED_SPECIALITIES = [
    'Cardiologie',
    'Dermatologie',
    'Neurologie',
    'Pédiatrie',
    'Chirurgie',
    'Oncologie',
    'Ophtalmologie',
    'Consultation générale',
    'hair',
    'dentaire'
  ];

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

  // Validation functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhoneNumber = (phone) => /^[0-9]{8,15}$/.test(phone);
  const validateMedicalLicense = (license) => license.length >= 5;

  const handleBlur = (e) => {
    if (e.target.name === "password" && !formData.password) {
      setShowDropdown(false);
    }
    if (e.target.name === "email" && formData.email && !validateEmail(formData.email)) {
      setError(language === "fr"
        ? "Veuillez entrer un email valide"
        : "Please enter a valid email");
    } else {
      setError("");
    }
  };

  const validatePassword = (password) => {
    const length = password.length >= 8;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const uppercase = /[A-Z]/.test(password);
    setPasswordRequirements({ length, specialChar, uppercase });
    return length && specialChar && uppercase;
  };

  useEffect(() => {
    if (formData.password) {
      validatePassword(formData.password);
    }
  }, [formData.password]);

  useEffect(() => {
    if (
      passwordRequirements.length &&
      passwordRequirements.specialChar &&
      passwordRequirements.uppercase
    ) {
      const timer = setTimeout(() => {
        setShowDropdown(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [passwordRequirements]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    setSuccess("");
  };

  // API call function
  const registerDoctor = async (doctorData) => {
    try {
      const response = await fetch(`${API_BASE_URL}${REGISTER_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Handle different error responses
        if (response.status === 400) {
          throw new Error(responseData.message || 'Données invalides');
        } else if (response.status === 409) {
          throw new Error('Un compte avec cet email existe déjà');
        } else if (response.status === 500) {
          throw new Error('Erreur du serveur. Veuillez réessayer plus tard.');
        } else {
          throw new Error(responseData.message || 'Erreur lors de l\'enregistrement');
        }
      }

      return responseData;
    } catch (error) {
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion.');
      }
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Final validation before submission
      if (!formData.name.trim()) {
        throw new Error(language === "fr" ? "Le nom est requis" : "Name is required");
      }

      if (!validateEmail(formData.email)) {
        throw new Error(language === "fr" ? "Email invalide" : "Invalid email");
      }

      if (!validatePassword(formData.password)) {
        throw new Error(language === "fr" ? "Le mot de passe ne respecte pas les critères" : "Password doesn't meet requirements");
      }

      if (!formData.Phone || !validatePhoneNumber(formData.Phone)) {
        throw new Error(language === "fr" ? "Numéro de téléphone invalide" : "Invalid phone number");
      }

      if (!formData.MedicalLicense || !validateMedicalLicense(formData.MedicalLicense)) {
        throw new Error(language === "fr" ? "Numéro de licence médicale invalide" : "Invalid medical license number");
      }

      if (!ALLOWED_SPECIALITIES.includes(formData.Speciality)) {
        throw new Error(language === "fr" ? "Veuillez sélectionner une spécialité valide" : "Please select a valid specialty");
      }

      // Prepare data for API
      const doctorData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        Speciality: formData.Speciality,
        ClinicAffiliation: formData.ClinicAffiliation.trim() || "",
        Phone: parseInt(formData.Phone, 10),
        MedicalLicense: formData.MedicalLicense.trim()
      };

      // Make API call
      const result = await registerDoctor(doctorData);

      console.log('Doctor registered successfully:', result);
      setSuccess(language === "fr" ? "Inscription réussie!" : "Registration successful!");
      setRegistrationComplete(true);

      localStorage.setItem('userName', formData.name.trim());
      localStorage.setItem('userEmail', formData.email.trim().toLowerCase());
      localStorage.setItem('userRole', "pdoctor"); // Utiliser "pdoctor" pour correspondre à l'endpoint API
      localStorage.setItem('userHospital', formData.ClinicAffiliation.trim() || (language === "fr" ? "Non spécifié" : "Not specified"));
      localStorage.setItem('userSpeciality', formData.Speciality);

      // Sauvegarder le token si disponible dans la réponse
      if (result.token) {
        localStorage.setItem('accessToken', result.token);
      } else if (result.accessToken) {
        localStorage.setItem('accessToken', result.accessToken);
      }

      // Log pour vérification
      console.log('Doctor information saved to localStorage');

      // Redirection après succès
      setTimeout(() => {
        navigate('/otp', {
          state: {
            message: language === "fr"
              ? "Inscription réussie! Vous pouvez maintenant vous connecter."
              : "Registration successful! You can now log in.",
            email: formData.email,
            autoFill: true
          }
        });
      }, 3000);

    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const goToNextStep = () => {
    setError("");

    if (currentStep === 1) {
      // Validate step 1 fields
      if (!formData.name.trim()) {
        setError(language === "fr" ? "Le nom est requis" : "Name is required");
        return;
      }
      if (!formData.email.trim()) {
        setError(language === "fr" ? "L'email est requis" : "Email is required");
        return;
      }
      if (!validateEmail(formData.email)) {
        setError(language === "fr" ? "Veuillez entrer une adresse e-mail valide" : "Please enter a valid email address");
        return;
      }
      if (!formData.password) {
        setError(language === "fr" ? "Le mot de passe est requis" : "Password is required");
        return;
      }
      if (!validatePassword(formData.password)) {
        setError(language === "fr" ? "Le mot de passe ne respecte pas les critères requis" : "Password doesn't meet the requirements");
        return;
      }
      if (!formData.Phone.trim()) {
        setError(language === "fr" ? "Le numéro de téléphone est requis" : "Phone number is required");
        return;
      }
      if (!validatePhoneNumber(formData.Phone)) {
        setError(language === "fr" ? "Veuillez entrer un numéro de téléphone valide (8 à 15 chiffres)" : "Please enter a valid phone number (8 to 15 digits)");
        return;
      }
    } else if (currentStep === 2) {
      // Validate step 2 fields
      if (!formData.MedicalLicense.trim()) {
        setError(language === "fr" ? "Le numéro de licence médicale est requis" : "Medical license number is required");
        return;
      }
      if (!validateMedicalLicense(formData.MedicalLicense)) {
        setError(language === "fr" ? "Le numéro de licence doit contenir au moins 5 caractères" : "License number must be at least 5 characters long");
        return;
      }
      if (!formData.Speciality) {
        setError(language === "fr" ? "Veuillez sélectionner une spécialité" : "Please select a specialty");
        return;
      }
      if (!ALLOWED_SPECIALITIES.includes(formData.Speciality)) {
        setError(language === "fr" ? "Veuillez sélectionner une spécialité valide" : "Please select a valid specialty");
        return;
      }
    }

    setCurrentStep(currentStep + 1);
  };

  const goToPreviousStep = () => {
    setError("");
    setCurrentStep(currentStep - 1);
  };

  const goToHome = () => {
    window.location.href = 'http://localhost:3020/';
  };

  const goToLogin = () => {
    navigate('/login_medecin');
  };

  const steps = [
    { id: 1, icon: <User className="w-5 h-5" />, label: language === "fr" ? "Informations" : "Information", description: language === "fr" ? "Détails personnels" : "Personal details" },
    { id: 2, icon: <UserCheck className="w-5 h-5" />, label: language === "fr" ? "Professionnel" : "Professional", description: language === "fr" ? "Informations médicales" : "Medical information" },
    { id: 3, icon: <FileText className="w-5 h-5" />, label: language === "fr" ? "Finalisation" : "Finalization", description: language === "fr" ? "Confirmer et valider" : "Review and submit" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
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
                        <h3 className="text-2xl font-bold mb-2">{img.caption}</h3>
                        <p className="text-blue-100 text-lg">{img.description}</p>
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
                <Hospital className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-white font-bold text-xl">Plasfora</span>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="lg:w-1/2 p-8 md:p-12 lg:p-16">
          {!registrationComplete ? (
            <motion.div
              className="w-full max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-blue-800 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                  {language === "fr" ? "ENREGISTREMENT MÉDECIN" : "DOCTOR REGISTRATION"}
                </h1>
                <p className="text-gray-600 text-base">
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
                          <span className={`text-sm font-medium ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'}`}>
                            {step.label}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={errorVariants}
                  className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Erreur</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* Success Alert */}
              {success && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={errorVariants}
                  className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Succès</p>
                    <p className="text-sm mt-1">{success}</p>
                  </div>
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
                      <h2 className="text-lg font-medium text-gray-800 flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="text-blue-600 w-4 h-4" />
                        </div>
                        {language === "fr" ? "Informations personnelles" : "Personal Information"}
                      </h2>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === "fr" ? "Nom complet" : "Full Name"} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                            placeholder={language === "fr" ? "Dr. Prénom Nom" : "Dr. First Last"}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                            placeholder="doctor@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === "fr" ? "Téléphone" : "Phone"} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            name="Phone"
                            value={formData.Phone}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                            placeholder={language === "fr" ? "12345678" : "12345678"}
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {language === "fr" ? "8 à 15 chiffres" : "8 to 15 digits"}
                        </p>
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                        {language === "fr" ? "Mot de passe" : "Password"} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <motion.input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          onFocus={() => setShowDropdown(true)}
                          id="password"
                          value={formData.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          variants={inputVariants}
                          whileFocus="focus"
                          className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl transition-all bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50"
                          placeholder={language === "fr" ? "Créez un mot de passe sécurisé" : "Create a secure password"}
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                      <AnimatePresence>
                        {showDropdown && (
                          <motion.div
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 space-y-2"
                          >
                            <div className="text-xs font-medium text-gray-700 mb-2">
                              {language === "fr" ? "Exigences du mot de passe :" : "Password Requirements:"}
                            </div>
                            <motion.div className="flex items-center text-sm">
                              <CheckCircle
                                className={`mr-2 h-4 w-4 ${passwordRequirements.length ? 'text-green-500' : 'text-gray-300'
                                  }`}
                              />
                              <span className={
                                passwordRequirements.length ? 'text-green-600' : 'text-gray-600'
                              }>
                                {language === "fr" ? "Au moins 8 caractères" : "At least 8 characters"}
                              </span>
                            </motion.div>
                            <motion.div className="flex items-center text-sm">
                              <CheckCircle
                                className={`mr-2 h-4 w-4 ${passwordRequirements.specialChar ? 'text-green-500' : 'text-gray-300'
                                  }`}
                              />
                              <span className={
                                passwordRequirements.specialChar ? 'text-green-600' : 'text-gray-600'
                              }>
                                {language === "fr" ? "Un caractère spécial" : "One special character"}
                              </span>
                            </motion.div>
                            <motion.div className="flex items-center text-sm">
                              <CheckCircle
                                className={`mr-2 h-4 w-4 ${passwordRequirements.uppercase ? 'text-green-500' : 'text-gray-300'
                                  }`}
                              />
                              <span className={
                                passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-600'
                              }>
                                {language === "fr" ? "Une lettre majuscule" : "One uppercase letter"}
                              </span>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
                    <h2 className="text-lg font-medium text-gray-800 flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Briefcase className="text-blue-600 w-4 h-4" />
                      </div>
                      {language === "fr" ? "Informations professionnelles" : "Professional Information"}
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === "fr" ? "Numéro de licence médicale" : "Medical License Number"} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserCheck className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="MedicalLicense"
                          value={formData.MedicalLicense}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                          placeholder={language === "fr" ? "Ex: ML123456789" : "Ex: ML123456789"}
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {language === "fr" ? "Au moins 5 caractères" : "At least 5 characters"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === "fr" ? "Spécialité médicale" : "Medical Specialty"} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                          <GraduationCap className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          name="Speciality"
                          value={formData.Speciality}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 appearance-none cursor-pointer"
                          required
                        >
                          <option value="">
                            {language === "fr" ? "Sélectionnez une spécialité" : "Select a specialty"}
                          </option>
                          {ALLOWED_SPECIALITIES.map((speciality) => (
                            <option key={speciality} value={speciality}>
                              {speciality}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <ChevronRight className="h-4 w-4 text-gray-400 rotate-90" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {language === "fr" ? "Affiliation clinique" : "Clinic Affiliation"}
                        <span className="text-gray-400 text-xs ml-1">({language === "fr" ? "optionnel" : "optional"})</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="ClinicAffiliation"
                          value={formData.ClinicAffiliation}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                          placeholder={language === "fr" ? "Nom de la clinique ou hôpital" : "Clinic or hospital name"}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3 - Review and Submit */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-lg font-medium text-gray-800 flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <FileText className="text-blue-600 w-4 h-4" />
                      </div>
                      {language === "fr" ? "Vérification des informations" : "Review Information"}
                    </h2>

                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            {language === "fr" ? "Nom complet" : "Full Name"}
                          </label>
                          <p className="text-gray-900 font-medium">{formData.name}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="text-gray-900 font-medium">{formData.email}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            {language === "fr" ? "Téléphone" : "Phone"}
                          </label>
                          <p className="text-gray-900 font-medium">{formData.Phone}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            {language === "fr" ? "Licence médicale" : "Medical License"}
                          </label>
                          <p className="text-gray-900 font-medium">{formData.MedicalLicense}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            {language === "fr" ? "Spécialité" : "Specialty"}
                          </label>
                          <p className="text-gray-900 font-medium">{formData.Speciality}</p>
                        </div>

                        {formData.ClinicAffiliation && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              {language === "fr" ? "Affiliation clinique" : "Clinic Affiliation"}
                            </label>
                            <p className="text-gray-900 font-medium">{formData.ClinicAffiliation}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-blue-800">
                            {language === "fr" ? "Informations importantes" : "Important Information"}
                          </h4>
                          <ul className="mt-2 text-sm text-blue-700 space-y-1">
                            <li>• {language === "fr"
                              ? "Votre compte sera vérifié par notre équipe"
                              : "Your account will be verified by our team"}</li>
                            <li>• {language === "fr"
                              ? "Vous recevrez un email de confirmation"
                              : "You will receive a confirmation email"}</li>
                            <li>• {language === "fr"
                              ? "L'activation peut prendre 1-2 jours ouvrables"
                              : "Activation may take 1-2 business days"}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 gap-4">
                  {currentStep > 1 && (
                    <motion.button
                      type="button"
                      onClick={goToPreviousStep}
                      disabled={isLoading}
                      aria-label={language === "fr" ? "Étape précédente" : "Previous step"}
                      whileHover={!isLoading ? { scale: 1.02 } : {}}
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
                      className="px-6 py-3 rounded-xl bg-white border border-gray-200 shadow-xs hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                        <ChevronLeft className="mr-2 w-4 h-4" />
                        {language === "fr" ? "Précédent" : "Previous"}
                      </span>
                    </motion.button>
                  )}

                  <div className="flex-1 flex justify-end">
                    {currentStep < 3 ? (
                      <motion.button
                        type="button"
                        onClick={goToNextStep}
                        disabled={isLoading}
                        aria-label={language === "fr" ? "Étape suivante" : "Next step"}
                        whileHover={!isLoading ? { scale: 1.02 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="flex items-center justify-center">
                          {language === "fr" ? "Suivant" : "Next"}
                          <ChevronRight className="ml-2 w-4 h-4" />
                        </span>
                      </motion.button>
                    ) : (
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        aria-label={language === "fr" ? "Soumettre le formulaire" : "Submit form"}
                        whileHover={!isLoading ? { scale: 1.02 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                        className={`px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full md:w-auto ${isLoading
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
                            <Check className="ml-2 w-4 h-4" />
                          </span>
                        )}
                      </motion.button>
                    )}
                  </div>
                </div>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                {language === "fr" ? "Déjà un compte ?" : "Already have an account?"}{' '}
                <button
                  onClick={goToLogin}
                  className="text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md px-1 transition-colors duration-200"
                >
                  {language === "fr" ? "Connectez-vous ici" : "Sign in here"}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {language === "fr" ? "Enregistrement Réussi!" : "Registration Successful!"}
              </h2>
              <p className="text-gray-600 mb-6">
                {language === "fr"
                  ? "Votre compte médecin a été créé avec succès."
                  : "Your doctor account has been successfully created."}
              </p>

              <div className="bg-blue-50 rounded-xl p-6 text-left mb-8">
                <h3 className="font-semibold text-blue-800 mb-3">
                  {language === "fr" ? "Prochaines étapes" : "Next Steps"}
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">1</span>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700">
                      {language === "fr"
                        ? "Vérification de votre licence médicale"
                        : "Verification of your medical license"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">2</span>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700">
                      {language === "fr"
                        ? "Email de confirmation dans votre boîte de réception"
                        : "Confirmation email in your inbox"}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">3</span>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700">
                      {language === "fr"
                        ? "Accès à votre tableau de bord médecin"
                        : "Access to your doctor dashboard"}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 justify-center">
                <motion.button
                  onClick={goToLogin}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {language === "fr" ? "Aller à la connexion" : "Go to Login"}
                </motion.button>
                <motion.button
                  onClick={goToHome}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  {language === "fr" ? "Retour à l'accueil" : "Back to Home"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorRegister;