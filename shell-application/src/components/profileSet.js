import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Calendar, Save, X, CheckCircle, AlertCircle, Settings, Lock, Shield } from "lucide-react";

export const ProfileSettings = ({
  userName,
  userEmail,
  birthDate,
  onUpdate = () => {},
  onCancel = () => {
    window.location.href = "http://localhost:3020/";
  },
}) => {
  // Helper pour calculer l'âge à partir de birthDate
  const calculateAge = (birthDateStr) => {
    if (!birthDateStr) return "";
    const today = new Date();
    const birthDate = new Date(birthDateStr);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Helper pour calculer birthDate à partir de l'âge
  const calculateBirthDateFromAge = (age) => {
    const today = new Date();
    const birthYear = today.getFullYear() - Number(age);
    // On garde le même mois/jour que aujourd'hui pour simplifier
    const birthDate = new Date(birthYear, today.getMonth(), today.getDate());
    return birthDate.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    name: userName || "",
    email: userEmail || "",
    birthDate: birthDate || "",
    age: birthDate ? calculateAge(birthDate) : "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  useEffect(() => {
    const storedName = localStorage.getItem("userName") || "";
    const storedEmail = localStorage.getItem("userEmail") || "";
    const storedBirthDate = localStorage.getItem("birthDate") || "";
    // Calculer l'âge à partir du birthDate stocké
    const calculatedAge = storedBirthDate ? calculateAge(storedBirthDate) : "";
    // Stocker l'âge dans localStorage pour usage ailleurs si besoin
    localStorage.setItem("age", calculatedAge);
    setFormData({
      name: storedName,
      email: storedEmail,
      birthDate: storedBirthDate,
      age: calculatedAge,
    });
  }, [successMessage]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.birthDate || isNaN(Date.parse(formData.birthDate)))
      newErrors.birthDate = "Valid birth date is required";
    if (
      formData.age === "" ||
      isNaN(formData.age) ||
      formData.age < 0 ||
      formData.age > 150
    )
      newErrors.age = "Valid age is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Quand birthDate change, recalculez l'âge
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      age: prev.birthDate ? calculateAge(prev.birthDate) : "",
    }));
  }, [formData.birthDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "age") {
      // Quand l'utilisateur modifie l'âge, recalculer birthDate
      const newBirthDate = calculateBirthDateFromAge(value);
      setFormData({ ...formData, age: value, birthDate: newBirthDate });
    } else if (name === "birthDate") {
      setFormData({ ...formData, birthDate: value, age: calculateAge(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:3001/users/patient/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          birthDate: formData.birthDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedData = await response.json();
      localStorage.setItem("userName", formData.name);
      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("birthDate", formData.birthDate);
      onUpdate({
        userName: formData.name,
        userEmail: formData.email,
        birthDate: formData.birthDate,
      });

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        onCancel();
        window.location.href = "http://localhost:3020/";
      }, 1000);
    } catch (error) {
      setErrorMessage(error.message || "An error occurred while updating your profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {/* Left Side - Animated Illustration */}
        <motion.div 
          className="w-full md:w-2/5 bg-gradient-to-br from-indigo-600 to-purple-600 p-8 flex flex-col justify-center items-center text-white relative overflow-hidden"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Floating animated elements */}
          <motion.div
            className="absolute top-20 left-10 w-16 h-16 rounded-full bg-white/10"
            animate={{
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-white/10"
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
                <User className="w-16 h-16 text-white" />
              </div>
            </motion.div>
            
            <motion.h2 
              className="text-3xl font-bold mb-4"
              variants={itemVariants}
            >
              Personalize Your Profile
            </motion.h2>
            
            <motion.p 
              className="text-white/90 mb-8 max-w-md"
              variants={itemVariants}
            >
              Update your information to keep your account secure and personalized.
            </motion.p>
            
            <motion.div 
              className="flex flex-col space-y-3 w-full max-w-xs"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <Shield className="text-white" />
                <span>End-to-end encryption</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <Lock className="text-white" />
                <span>Secure data storage</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div 
          className="w-full md:w-3/5 p-8 md:p-12"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Settings className="w-6 h-6 mr-2 text-indigo-600" />
              Account Settings
            </h2>
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button 
                className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'profile' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600'}`}
              >
                Profile
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence>
                  {successMessage && (
                    <motion.div
                      className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      <span className="text-green-800">{successMessage}</span>
                    </motion.div>
                  )}
                  {errorMessage && (
                    <motion.div
                      className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                      <span className="text-red-800">{errorMessage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <motion.div
                    className="space-y-1"
                    variants={itemVariants}
                  >
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                  </motion.div>

                  {/* Email */}
                  <motion.div
                    className="space-y-1"
                    variants={itemVariants}
                  >
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                        placeholder="your@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email}</p>
                    )}
                  </motion.div>

                  {/* Birth Date */}
                  <motion.div
                    className="space-y-1"
                    variants={itemVariants}
                  >
                    <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-3 border ${errors.birthDate ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                        placeholder="YYYY-MM-DD"
                      />
                    </div>
                    {errors.birthDate && (
                      <p className="text-sm text-red-600">{errors.birthDate}</p>
                    )}
                  </motion.div>
                  {/* Age */}
                  <motion.div
                    className="space-y-1"
                    variants={itemVariants}
                  >
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min="0"
                        max="150"
                        className={`block w-full pl-3 pr-3 py-3 border ${errors.age ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                        placeholder="Age"
                      />
                    </div>
                    {errors.age && (
                      <p className="text-sm text-red-600">{errors.age}</p>
                    )}
                  </motion.div>

                  <motion.div 
                    className="flex space-x-4 pt-4"
                    variants={itemVariants}
                  >
                    <button
                      type="button"
                      onClick={onCancel}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:text-white font-medium hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 flex items-center justify-center"
                    >
                      <X className="w-5 h-5 mr-2" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`flex-1 px-6 py-3 rounded-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 flex items-center justify-center ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </motion.div>
                </form>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-indigo-600" />
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="••••••••"
                      />
                    </div>
                    <button className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <button className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200">
                    Enable 2FA
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfileSettings;