"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  Shield,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Heart,
  Stethoscope,
  X,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Animation variants
const inputVariants = {
  focus: { scale: 1.02, borderColor: '#3B82F6', transition: { duration: 0.2 } },
  blur: { scale: 1, borderColor: '#E5E7EB', transition: { duration: 0.2 } },
};

const errorVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
};

const formStepVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

const popupVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.5,
      bounce: 0.3
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.3
    }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

// Email Already Exists Popup Component
const EmailExistsPopup = ({ isOpen, onClose, email }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          />

          {/* Popup */}
          <motion.div
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full pointer-events-auto relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close popup"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              {/* Icon */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Email Already in Use
                </h3>
                <p className="text-gray-600 mb-2">
                  The email address <strong className="text-gray-900">{email}</strong> is already registered with an existing account.
                </p>
                <p className="text-gray-600 mb-8">
                  Please try signing in instead, or use a different email address to create a new account.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      // Navigate to login page
                      alert('Navigating to login page...');
                    }}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Sign In Instead
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
                  >
                    Try Again
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SignIn = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    insurance: '',
    birthDate: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    specialChar: false,
    uppercase: false,
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showEmailExistsPopup, setShowEmailExistsPopup] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const navigate = useNavigate();

  // Medical tourism images with Tunisian theme
  const images = [
    {
      gradient: 'from-blue-600 to-indigo-700',
      icon: Heart,
      caption: 'World-Class Healthcare',
      description: "Access cutting-edge medical treatments in Tunisia's JCI-accredited facilities",
    },
    {
      gradient: 'from-emerald-600 to-teal-700',
      icon: Stethoscope,
      caption: 'Expert Medical Professionals',
      description: 'Board-certified specialists with international training and experience',
    },
    {
      gradient: 'from-purple-600 to-indigo-700',
      icon: Shield,
      caption: 'Premium Recovery Care',
      description: 'Recover in luxury with our comprehensive post-treatment care programs',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const length = password.length >= 8;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const uppercase = /[A-Z]/.test(password);
    setPasswordRequirements({ length, specialChar, uppercase });
    return length && specialChar && uppercase;
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    return age;
  };

  const validateBirthDate = (birthDate) => {
    if (!birthDate) return false;
    const age = calculateAge(birthDate);
    return age >= 18 && age <= 120;
  };

  // Auto-close dropdown when all requirements are met
  useEffect(() => {
    if (
      passwordRequirements.length &&
      passwordRequirements.specialChar &&
      passwordRequirements.uppercase
    ) {
      const timer = setTimeout(() => {
        setShowDropdown(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [passwordRequirements]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));

    if (name === 'password') {
      validatePassword(value);
      const allMet =
        passwordRequirements.length &&
        passwordRequirements.specialChar &&
        passwordRequirements.uppercase;
      setShowDropdown(value.length > 0 && !allMet);
    }
  };

  // Check email availability when user leaves email field
  const checkEmailAvailability = async (email) => {
    if (!validateEmail(email)) return;

    setIsCheckingEmail(true);
    try {
      const response = await fetch('http://localhost:3001/users/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const responseData = await response.json();

      // If email exists (409 or message indicates it exists)
     
    } catch (error) {
      console.log('Email check error:', error);
      // Don't show popup for network errors during email check
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleEmailBlur = (e) => {
    const email = e.target.value;
    if (email && validateEmail(email)) {
      checkEmailAvailability(email);
    }
  };

  const handleBlur = (e) => {
    if (e.target.name === 'password' && !formData.password) {
      setShowDropdown(false);
    } else if (e.target.name === 'email') {
      handleEmailBlur(e);
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required';
    } else if (!validateBirthDate(formData.birthDate)) {
      const age = calculateAge(formData.birthDate);
      if (age < 18) {
        newErrors.birthDate = 'You must be at least 18 years old to register';
      } else if (age > 120) {
        newErrors.birthDate = 'Please enter a valid birth date';
      } else {
        newErrors.birthDate = 'Please enter a valid birth date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must meet all requirements';
    }

    if (!formData.insurance.trim()) {
      newErrors.insurance = 'Insurance information is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(1);
  };

  const [emailExistsMessage, setEmailExistsMessage] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateEmail(formData.email)) {
    setErrors({ email: "Invalid email format" });
    return;
  }

  try {
    const response = await fetch('http://localhost:3001/users/patient/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      setErrors({ general: responseData.message || 'Registration failed' });
      return;
    }

    // ✅ Stocker l'email ET le birthDate dans le localStorage
    localStorage.setItem("userEmail", formData.email);
    localStorage.setItem("birthDate", formData.birthDate);
    
    // Naviguer vers la page OTP après inscription réussie
    navigate('/otp');
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    setErrors({ general: "An error occurred. Please try again." });
  }
};


  const goToHome = () => {
    window.location.href = 'http://localhost:3020/';
  };

  const goToLogin = () => {
    // In a real app, you would use react-router-dom navigate
    navigate('/login_patient');
  };

  const handleCloseEmailPopup = () => {
    setShowEmailExistsPopup(false);
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-4">
            Your account has been created successfully. Please check your email for verification instructions.
          </p>
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      {/* Email Already Exists Popup */}

      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100">

        {/* Visual Section */}
        <div className="lg:w-1/2 relative h-96 lg:h-auto">
          <div className="absolute inset-0 overflow-hidden">
            <AnimatePresence initial={false}>
              {images.map((img, index) => (
                index === activeImage && (
                  <motion.div
                    key={index}
                    className={`absolute inset-0 w-full h-full bg-gradient-to-br ${img.gradient}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, zIndex: 10 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-white">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-center"
                      >
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                          <img.icon className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold mb-4">{img.caption}</h3>
                        <p className="text-xl opacity-90 max-w-md">{img.description}</p>
                      </motion.div>
                    </div>
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(i)}
                          className={`h-2 rounded-full transition-all ${i === activeImage ? 'bg-white w-8' : 'bg-white/50 w-2'
                            }`}
                          aria-label={`View slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>

          {/* Branding */}
          <div className="absolute top-6 left-6 z-30">
            <motion.div
              className="flex items-center cursor-pointer"
              onClick={goToHome}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-white font-bold text-xl">Plasfora</span>
            </motion.div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:w-1/2 p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                START YOUR MEDICAL JOURNEY
              </h1>

              <p className="text-gray-600">
                Register to access premier healthcare services in Tunisia
              </p>
              <div className="flex justify-center mt-4">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                    1
                  </div>
                  <div className={`h-1 w-8 ${currentStep === 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                    2
                  </div>
                </div>
              </div>
            </div>

            {errors.general && (
              <motion.div
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
                role="alert"
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  {errors.general}
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Already Exists Error Message (affiché en haut du formulaire) */}
              {errors.email && (
                <motion.div
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
                  role="alert"
                >
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                    {errors.email}
                  </div>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    variants={formStepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="text-blue-600 text-sm" />
                        </div>
                        Personal Information
                      </h2>

                      {/* Name Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                          Full Name *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <motion.input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            variants={inputVariants}
                            whileFocus="focus"
                            className={`block w-full pl-10 pr-3 py-3 border rounded-xl transition-all bg-gray-50 focus:bg-white ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                              } focus:ring-2 focus:ring-opacity-50`}
                            placeholder="Enter your full name"
                            required
                          />
                          {errors.name && (
                            <motion.p
                              variants={errorVariants}
                              initial="hidden"
                              animate="visible"
                              className="text-red-500 text-xs mt-1"
                            >
                              {errors.name}
                            </motion.p>
                          )}
                        </div>
                      </div>

                      {/* Email Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                          Email Address *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <motion.input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variants={inputVariants}
                            whileFocus="focus"
                            className={`block w-full pl-10 pr-10 py-3 border rounded-xl transition-all bg-gray-50 focus:bg-white ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                              } focus:ring-2 focus:ring-opacity-50`}
                            placeholder="your.email@example.com"
                            required
                          />
                          {/* Email checking indicator */}
                          {isCheckingEmail && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                            </div>
                          )}
                          {errors.email && (
                            <motion.p
                              variants={errorVariants}
                              initial="hidden"
                              animate="visible"
                              className="text-red-500 text-xs mt-1"
                            >
                              {errors.email}
                            </motion.p>
                          )}
                        </div>
                      </div>

                      {/* Birth Date Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="birthDate">
                          Date of Birth *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <motion.input
                            type="date"
                            name="birthDate"
                            id="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            max={new Date().toISOString().split('T')[0]}
                            variants={inputVariants}
                            whileFocus="focus"
                            className={`block w-full pl-10 pr-3 py-3 border rounded-xl transition-all bg-gray-50 focus:bg-white ${errors.birthDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                              } focus:ring-2 focus:ring-opacity-50`}
                            required
                          />
                          {errors.birthDate && (
                            <motion.p
                              variants={errorVariants}
                              initial="hidden"
                              animate="visible"
                              className="text-red-500 text-xs mt-1"
                            >
                              {errors.birthDate}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      onClick={handleNext}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl"
                    >
                      <span>Continue</span>
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </motion.button>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    variants={formStepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <Lock className="text-blue-600 text-sm" />
                        </div>
                        Account Security
                      </h2>

                      {/* Password Field */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                          Password *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <motion.input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variants={inputVariants}
                            whileFocus="focus"
                            className={`block w-full pl-10 pr-10 py-3 border rounded-xl transition-all bg-gray-50 focus:bg-white ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                              } focus:ring-2 focus:ring-opacity-50`}
                            placeholder="Create a secure password"
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
                        {errors.password && (
                          <motion.p
                            variants={errorVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-red-500 text-xs mt-1"
                          >
                            {errors.password}
                          </motion.p>
                        )}
                        <AnimatePresence>
                          {showDropdown && (
                            <motion.div
                              variants={dropdownVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 space-y-2"
                            >
                              <div className="text-xs font-medium text-gray-700 mb-2">Password Requirements:</div>
                              <motion.div className="flex items-center text-sm">
                                <CheckCircle
                                  className={`mr-2 h-4 w-4 ${passwordRequirements.length ? 'text-green-500' : 'text-gray-300'
                                    }`}
                                />
                                <span className={
                                  passwordRequirements.length ? 'text-green-600' : 'text-gray-600'
                                }>
                                  At least 8 characters
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
                                  One special character
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
                                  One uppercase letter
                                </span>
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Insurance Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="insurance">
                          Insurance Provider *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Shield className="h-5 w-5 text-gray-400" />
                          </div>
                          <motion.input
                            type="text"
                            name="insurance"
                            id="insurance"
                            value={formData.insurance}
                            onChange={handleChange}
                            variants={inputVariants}
                            whileFocus="focus"
                            className={`block w-full pl-10 pr-3 py-3 border rounded-xl transition-all bg-gray-50 focus:bg-white ${errors.insurance ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                              } focus:ring-2 focus:ring-opacity-50`}
                            placeholder="Enter your insurance provider"
                            required
                          />
                          {errors.insurance && (
                            <motion.p
                              variants={errorVariants}
                              initial="hidden"
                              animate="visible"
                              className="text-red-500 text-xs mt-1"
                            >
                              {errors.insurance}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <motion.button
                        type="button"
                        onClick={handlePrevious}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-1/2 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg"
                      >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        <span>Previous</span>
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                        className={`w-1/2 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl ${isSubmitting
                          ? 'bg-blue-400 cursor-not-allowed text-white'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white'
                          }`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <svg
                              className="animate-spin h-5 w-5 text-white"
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
                            <span>Creating Account...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5" />
                            <span>Register Now</span>
                          </div>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <EmailExistsPopup
                isOpen={showEmailExistsPopup}
                onClose={() => setShowEmailExistsPopup(false)}
                email={formData.email}
                message={emailExistsMessage}
              />
            </form>


            <div className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={goToLogin}
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md px-2 py-1 transition-colors duration-200"
              >
                Sign in here
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                By registering, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;