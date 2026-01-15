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
} from 'react-icons/hi';
import {
  FaClinicMedical as FaHospital
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import medicalHero from '../../assets/ksar.jpg';
import hospitalFacility from '../../assets/bouzid.png';
import recoveryResort from '../../assets/tozeur.jpg';
import medicalTeam from '../../assets/sousse.jpg';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [parrainage, setParrainage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const goToHome = () => {
    window.location.href = "http://localhost:3020/";
  };

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetectingCountry, setIsDetectingCountry] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const images = [
    { src: medicalHero, alt: "Tunisian Medical Tourism", caption: "World-Class Healthcare", description: "Access cutting-edge medical treatments in Tunisia's JCI-accredited facilities" },
    { src: hospitalFacility, alt: "Modern Hospital Facility", caption: "State-of-the-Art Facilities", description: "Our hospitals combine advanced technology with compassionate care" },
    { src: recoveryResort, alt: "Luxury Recovery Resort", caption: "Premium Recovery Destinations", description: "Recover in luxury at our 5-star medical recovery resorts" },
    { src: medicalTeam, alt: "International Medical Team", caption: "Expert Medical Professionals", description: "Board-certified specialists with international training" }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
    };

    try {
      const response = await fetch('http://localhost:3001/users/agentcommercial/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Une erreur est survenue');
      }

      const data = await response.json();
      // Affichage du message et du lien de parrainage
      setSuccessMessage(data.message || 'Inscription réussie');
      setParrainage(data.agent);

      // Stocker code et lien de parrainage dans localStorage
      if (data.agent?.code_parrainage) {
        localStorage.setItem('code_parrainage', data.agent.code_parrainage);
      }
      if (data.agent?.lien_parrainage) {
        localStorage.setItem('lien_parrainage', data.agent.lien_parrainage);
      }

      setTimeout(() => navigate('/login', { replace: true }), 6000);
    } catch (error) {
      setSuccessMessage('');
      setParrainage(null);
      console.error('Erreur lors de linscription', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100 transform transition-all hover:shadow-2xl">

        {/* Left Side - Visual Gallery */}
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
                <FaHospital className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-white font-munika text-xl">Plasfora</span>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-1/2 p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-munika text-blue-800 mb-2">WELCOME OUR ADMIN</h1>
              <p className="text-gray-600 font-munika">Register to take a look for explore what happen on your website</p>
            </div>

            {/* Affichage du message de succès et du lien de parrainage */}
            {successMessage && parrainage && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-center">
                <div className="font-bold mb-2">{successMessage}</div>
                <div className="mb-1">Votre code de parrainage : <span className="font-mono">{parrainage.code_parrainage}</span></div>
                <div>
                  Lien de parrainage :{" "}
                  <a
                    href={parrainage.lien_parrainage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 underline break-all"
                  >
                    {parrainage.lien_parrainage}
                  </a>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-munika text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <HiOutlineIdentification className="text-blue-600 text-lg" />
                  </div>
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-munika text-gray-700 mb-1">Full Name</label>
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
                        placeholder="User name"
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
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200  font-munika rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Security */}
              <div className="space-y-4">
                <h2 className="text-lg font-munika text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <HiOutlineLockClosed className="text-blue-600 text-lg" />
                  </div>
                  Account Security
                </h2>

                <div>
                  <label className="block text-sm font-munika text-gray-700 mb-1">Password</label>
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
                      placeholder="Minimum 8 characters"
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

              {/* Register Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg font-manuka transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-70 group border border-blue-700/20"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <HiOutlineRefresh className="h-5 w-5 text-white animate-spin" />
                      <span className="tracking-wide">Creating your account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <HiOutlineClipboardList className="h-5 w-5" />
                      <span className="tracking-wide">Register Now</span>
                      <HiOutlineArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center font-munika text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-munika text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md px-1 transition-colors duration-200"
              >
                Sign in here
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;