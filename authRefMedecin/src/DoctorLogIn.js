"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUser,
  FaClinicMedical,
  FaHeartbeat,
  FaEye,
  FaEyeSlash,
  FaLanguage,
  FaTooth,
  FaClinicMedical as FaHospital
} from 'react-icons/fa';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { MdOutlineMedicalServices, MdOutlineBeachAccess } from 'react-icons/md';
import { useNavigate, Link } from 'react-router-dom';
import medicalHero from './assets/medical.jpg';
import hospitalFacility from './assets/medical1.jpg';
import recoveryResort from './assets/medical3.jpg';
import medicalTeam from './assets/medical4.jpg'
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/authslice'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('patient');
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  // Fonction pour récupérer les informations utilisateur les plus récentes
  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await fetch("http://localhost:3001/users/profile", {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json" 
        },
      });

      if (response.ok) {
        const userData = await response.json();
        return userData;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const resp = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.message || "Échec de connexion");
      }

      const data = await resp.json();
      const { accessToken, refreshToken, user } = data;

      // Récupérer les informations utilisateur les plus récentes depuis le serveur
      const updatedUserData = await fetchUserProfile(accessToken);
      const finalUserData = updatedUserData || user;

      // Stockage des tokens et des données utilisateur
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userName", finalUserData.name);
      localStorage.setItem("userEmail", finalUserData.email);
      localStorage.setItem("userId", finalUserData.id || finalUserData._id);
      localStorage.setItem("userRole", finalUserData.role);
      localStorage.setItem("userHospital", finalUserData.Hospital || '');
      localStorage.setItem("userSpeciality", finalUserData.Speciality || '');
      localStorage.setItem("userPhone", finalUserData.Phone?.toString() || '');
      localStorage.setItem("userMedicalLicense", finalUserData.MedicalLicense || '');
      
      // Stockage du statut d'approbation et de déploiement
      localStorage.setItem("userApproved", finalUserData.approved?.toString() || 'false');
      localStorage.setItem("userDeployed", finalUserData.deployed?.toString() || 'false');

      // Stocker l'objet utilisateur complet pour référence future
      const userDataToStore = {
        ...finalUserData,
        approved: finalUserData.approved || false,
        deployed: finalUserData.deployed || false,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem("userData", JSON.stringify(userDataToStore));

      // Sauvegarde en Redux avec les données les plus récentes
      dispatch(setUser(userDataToStore));

      console.log("Connexion réussie. Statut d'approbation:", finalUserData.approved);
      
      // Navigation vers le dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError(err.message || "Erreur lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const goToHome = () => {
    window.location.href = "http://localhost:3020/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100 transform transition-all hover:shadow-2xl">

        {/* Hero Section - Left Side */}
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
            <div className="flex items-center cursor-pointer" onClick={goToHome}>
              <div className="w-10 h-10 bg-transparent rounded-lg flex items-center justify-center shadow-md hover:bg-gray-700 transition duration-300">
                <FaHospital className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-white font-munika text-xl">Plasfora</span>
            </div>
          </div>
        </div>

        {/* Login Form - Right Side */}
        <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-16">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-munika text-blue-800">BEGIN YOUR MEDICAL JOURNEY</h2>
              <p className="text-gray-600 font-munika mt-2">
                Sign in to manage your doctor account
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-munika text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="block font-munika w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="block text-sm font-munika text-gray-700">
                    Password
                  </label>
                  <Link to="/forgotpassword" className="text-sm font-munika text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="block w-full font-munika pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 font-munika focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-munika text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:shadow-md active:scale-[0.98]"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center font-munika text-sm text-gray-600">
              Pas de compte ?{' '}
              <Link
                to="/"
                className="font-munika text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md px-1 transition-colors duration-200"
              >
                Inscrivez-vous ici
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Login;