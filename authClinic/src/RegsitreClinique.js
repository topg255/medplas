"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineIdentification,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineGlobeAlt,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineRefresh,
  HiOutlineArrowRight,
  HiOutlineClipboardList,
  HiOutlineLocationMarker,
  HiOutlineOfficeBuilding,
  HiOutlineClock,
  HiOutlineChevronDown,
  HiOutlineCheck
} from 'react-icons/hi';
import { FaClinicMedical as FaHospital } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import clinicImage1 from './assets/clinic.jpg';
import clinicImage2 from './assets/clinic2.jpg';
import clinicImage3 from './assets/clinic3.jpg';

const RegisterClinic = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    Matricule: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Available locations
  const locations = [
    { value: 'paris', label: 'Paris', icon: '🇫🇷' },
    { value: 'sousse', label: 'Sousse', icon: '🇹🇳' },
    { value: 'tunis', label: 'Tunis', icon: '🇹🇳' },
    { value: 'tripoli', label: 'Tripoli', icon: '🇱🇾' }
  ];

  const goToHome = () => {
    window.location.href = "http://localhost:3020/";
  };

  const images = [
    { src: clinicImage1, alt: "Modern Clinic Facility", caption: "State-of-the-Art Medical Facilities", description: "Equipped with the latest medical technology for optimal patient care" },
    { src: clinicImage2, alt: "Professional Medical Team", caption: "Expert Medical Professionals", description: "Our team of specialists provides world-class healthcare services" },
    { src: clinicImage3, alt: "Comfortable Recovery", caption: "Patient-Centered Care", description: "Comfortable environment designed for patient recovery and well-being" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (locationValue) => {
    setFormData(prev => ({ ...prev, location: locationValue }));
    setShowLocationDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLocationDropdown && !event.target.closest('.location-dropdown-container')) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLocationDropdown]);

  const selectedLocation = locations.find(loc => loc.value === formData.location);

  // Fonction handleSubmit modifiée pour stocker l'email dans le localStorage
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const clinicData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      location: formData.location.trim(),
      Matricule: formData.Matricule.trim(),
    };

    try {
      const response = await fetch('http://localhost:3001/users/clinic/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clinicData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      console.log('Clinic registered successfully:', data);

      // ✅ Stocker l'email dans le localStorage pour la page OTP
      localStorage.setItem("userEmail", clinicData.email);
      
      // Stocker les autres données temporairement si nécessaire
      localStorage.setItem("tempUserId", data.id || clinicData.email);
      localStorage.setItem("tempUserName", clinicData.name);
      localStorage.setItem("tempUserEmail", clinicData.email);
      localStorage.setItem("tempUserRole", "clinic");
      localStorage.setItem("tempUserLocation", clinicData.location);
      localStorage.setItem("tempUserMatricule", clinicData.Matricule);
      localStorage.setItem("userRole", "clinic");
      localStorage.setItem("userMatricule", clinicData.Matricule);
      localStorage.setItem("userLocation", clinicData.location);

      // Rediriger vers la page OTP
      setTimeout(() => {
        navigate('/otp?role=clinic', {
          replace: true,
          state: {
            email: clinicData.email,
            userId: data.id,
            fromRegistration: true,
            userType: 'clinic',
            userRole: 'clinic'
          }
        });
      }, 1000);

    } catch (error) {
      console.error('Error during clinic registration:', error.message);
      // Gestion des erreurs
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100 transform transition-all hover:shadow-3xl">

        {/* Left Side - Visual Gallery */}
        <div className="lg:w-1/2 relative h-96 lg:h-auto">
          <div className="absolute inset-0 overflow-hidden">
            <AnimatePresence initial={false}>
              {images.map((img, index) => (
                index === activeImage && (
                  <motion.div
                    key={index}
                    className="absolute inset-0 w-full h-full"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      zIndex: 10
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover select-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent flex flex-col justify-end p-8">
                      <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-white"
                      >
                        <h3 className="text-2xl font-munika mb-2 leading-tight">{img.caption}</h3>
                        <p className="text-blue-100 text-lg font-munika opacity-90">{img.description}</p>
                        <div className="mt-6 flex space-x-2">
                          {images.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveImage(i)}
                              className={`h-1.5 rounded-full transition-all duration-300 ${i === activeImage
                                  ? 'bg-white w-8 shadow-lg'
                                  : 'bg-white/50 w-4 hover:bg-white/70'
                                }`}
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
              className="flex items-center cursor-pointer group"
              onClick={goToHome}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg hover:bg-white/30 transition duration-300 group-hover:shadow-xl">
                <FaHospital className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-white font-munika text-xl tracking-wide">Plasfora</span>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-1/2 p-8 md:p-12 bg-gradient-to-br from-gray-50/50 to-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="text-center mb-10">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h1 className="text-4xl font-munika text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 mb-3">
                  CLINIC REGISTRATION
                </h1>
                <p className="text-gray-600 font-munika text-lg">Register your medical facility with our platform</p>
              </motion.div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Clinic Information */}
              <motion.div
                className="space-y-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h2 className="text-xl font-munika text-gray-800 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                    <HiOutlineOfficeBuilding className="text-white text-lg" />
                  </div>
                  Clinic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-munika text-gray-700 mb-2 font-medium">Clinic Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <HiOutlineIdentification className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full font-munika pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-300 shadow-sm focus:shadow-md"
                        placeholder="Enter clinic name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-munika text-gray-700 mb-2 font-medium">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <HiOutlineMail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full pl-12 pr-4 py-4 border border-gray-200 font-munika rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-300 shadow-sm focus:shadow-md"
                        placeholder="clinic@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Enhanced Location Dropdown */}
                  <div>
                    <label className="block text-sm font-munika text-gray-700 mb-2 font-medium">Location</label>
                    <div className="relative location-dropdown-container">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <HiOutlineLocationMarker className="h-5 w-5 text-gray-400" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                        className={`w-full pl-12 pr-4 py-4 border rounded-xl transition-all bg-white text-left flex items-center justify-between font-munika ${showLocationDropdown
                            ? 'border-blue-500 ring-2 ring-blue-500 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 shadow-sm focus:shadow-md'
                          }`}
                      >
                        <span className={selectedLocation ? 'text-gray-900' : 'text-gray-500'}>
                          {selectedLocation ? (
                            <span className="flex items-center">
                              <span className="mr-2 text-lg">{selectedLocation.icon}</span>
                              {selectedLocation.label}
                            </span>
                          ) : (
                            'Select your city'
                          )}
                        </span>
                        <HiOutlineChevronDown
                          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${showLocationDropdown ? 'rotate-180' : ''
                            }`}
                        />
                      </button>

                      <AnimatePresence>
                        {showLocationDropdown && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setShowLocationDropdown(false)}
                            />
                            <motion.div
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto"
                            >
                              {locations.map((location, index) => (
                                <motion.button
                                  key={location.value}
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleLocationSelect(location.value);
                                  }}
                                  className={`w-full px-4 py-4 text-left hover:bg-blue-50 active:bg-blue-100 transition-colors duration-150 flex items-center justify-between font-munika border-b border-gray-100 last:border-b-0 ${selectedLocation?.value === location.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-gray-900'
                                    }`}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05, duration: 0.2 }}
                                >
                                  <div className="flex items-center">
                                    <span className="mr-3 text-xl">{location.icon}</span>
                                    <span className="font-medium">{location.label}</span>
                                  </div>
                                  {selectedLocation?.value === location.value && (
                                    <HiOutlineCheck className="h-5 w-5 text-blue-600" />
                                  )}
                                </motion.button>
                              ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-munika text-gray-700 mb-2 font-medium">Clinic Matricule</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <HiOutlineOfficeBuilding className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="Matricule"
                        value={formData.Matricule}
                        onChange={handleChange}
                        className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-300 shadow-sm focus:shadow-md font-munika"
                        placeholder="Enter clinic matricule"
                        required
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Account Security */}
              <motion.div
                className="space-y-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h2 className="text-xl font-munika text-gray-800 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                    <HiOutlineLockClosed className="text-white text-lg" />
                  </div>
                  Account Security
                </h2>

                <div>
                  <label className="block text-sm font-munika text-gray-700 mb-2 font-medium">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HiOutlineLockClosed className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-12 font-munika py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-gray-300 shadow-sm focus:shadow-md"
                      placeholder="Minimum 8 characters"
                      minLength="8"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <HiOutlineEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      ) : (
                        <HiOutlineEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 font-munika">
                    Password must be at least 8 characters long
                  </div>
                </div>
              </motion.div>

              {/* Register Button */}
              <motion.div
                className="pt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-800 text-white rounded-xl font-munika font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 group border-0 text-lg tracking-wide"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-3">
                      <HiOutlineRefresh className="h-6 w-6 text-white animate-spin" />
                      <span>Registering your clinic...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <HiOutlineClipboardList className="h-6 w-6" />
                      <span>Register Clinic</span>
                      <HiOutlineArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  )}
                </button>
              </motion.div>
            </form>

            <motion.div
              className="mt-8 text-center font-munika text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <span className="text-sm">Already have an account?</span>{' '}
              <button
                onClick={() => navigate('/login_clinic')}
                className="font-munika text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg px-2 py-1 transition-colors duration-200 font-medium hover:underline"
              >
                Sign in here
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterClinic;