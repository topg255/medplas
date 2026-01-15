"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineArrowLeft } from 'react-icons/hi';
import { FaClinicMedical, FaHeartbeat } from 'react-icons/fa';
import { MdOutlineMedicalServices } from 'react-icons/md';
import { useNavigate } from "react-router-dom";
import medicalImage from '../../assets/bousid.jpg';
import { useDispatch } from 'react-redux';
import { setLoading, setError, setSuccessMessage, resetStatus } from '../../../redux/authslice';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading()); // Active le loading avant l'appel API

    try {
      // Simulation d'envoi de requête API pour la réinitialisation du mot de passe
      const response = await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset link');
      }

      const data = await response.json();
      dispatch(setSuccessMessage(data.message));  // Enregistrez le message de succès

    } catch (error) {
      dispatch(setError(error.message)); // Enregistrer l'erreur en cas de problème
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Background Image with Blur */}
      <div className="fixed inset-0 overflow-hidden z-0">
        <img
          src={medicalImage}
          alt="Medical Tourism"
          className="w-full h-full object-cover filter blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-800/60"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Visual Section */}
          <div className="md:w-1/2 p-8 md:p-12 lg:p-16">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="cursor-pointer mb-8"
              onClick={() => navigate(-1)}
            >
              <HiOutlineArrowLeft className="text-2xl text-white" />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-blue-800"
            >
              <h1 className="text-3xl md:text-4xl font-munika mb-4">TUNISIA MEDICAL GATEWAY</h1>
              <p className="text-base font-munika text-gray-600 md:text-base mb-8">
                Rediscover access to world-class healthcare services in Tunisia's premier medical facilities.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaClinicMedical className="text-blue-700 text-xl " />
                  <span className='font-munika'>Best services</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaHeartbeat className="text-blue-700 text-xl" />
                  <span className='font-munika'>International Specialists</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MdOutlineMedicalServices className="text-blue-700 text-xl" />
                  <span className='font-munika'>70% Cost Savings</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Form Section */}
          <div className="md:w-1/2 bg-white p-8 md:p-12 lg:p-16 flex items-center justify-center">
            <motion.div
              className="w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4"
                >
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </motion.div>

                <h2 className="text-2xl md:text-3xl font-munika text-blue-800 mb-2">
                  {success ? 'Check Your Email' : 'Reset Your Password'}
                </h2>
                <p className="text-gray-600 font-munika">
                  {success
                    ? 'We sent a password reset link to your email'
                    : 'Enter your email to receive a reset link'}
                </p>
              </div>

              {!success ? (
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
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
                        className="block w-full pl-10 font-munika pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center font-munika">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white font-munika" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        'Send Reset Link'
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <p className="text-gray-600 font-munika mb-6">
                    If you don't see the email, check your spam folder or try resending.
                  </p>

                  <button
                    onClick={() => setSuccess(false)}
                    className="text-blue-600 font-munika hover:text-blue-500 text-sm font-medium"
                  >
                    Resend Email
                  </button>
                </motion.div>
              )}

              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  onClick={() => navigate(-1)}
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center justify-center space-x-1 mx-auto"
                >
                  <HiOutlineArrowLeft className="h-4 w-4 font-munika" />
                  <span className='font-munika'>Back to login</span>
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;