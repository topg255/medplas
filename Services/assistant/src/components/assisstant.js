import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiPlus, FiMinus, FiArrowRight, FiArrowLeft, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Images (à remplacer par vos propres images)
import medicalImage1 from '../assets/expertise.jpg';
import medicalImage2 from '../assets/assis1.jpg';
import medicalImage3 from '../assets/assis3.jpg';

const PremiumModal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 transition text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-5 h-5" />
          </button>
          
          <div className="p-8">
            <h3 className="text-2xl font-quicksand text-gray-900 mb-6">{title}</h3>
            {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const MedicalTravelAssistantForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    treatment: '',
    destination: '',
    arrivalDate: '',
    departureDate: '',
    companions: 0,
    specialRequests: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [modalState, setModalState] = useState({
    assurance: false,
    conciergerie: false,
    partenaires: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompanionChange = (type) => {
    setFormData(prev => ({
      ...prev,
      companions: type === 'increase' ? prev.companions + 1 : Math.max(0, prev.companions - 1)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1500);
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      treatment: '',
      destination: '',
      arrivalDate: '',
      departureDate: '',
      companions: 0,
      specialRequests: ''
    });
    setCurrentStep(1);
    setSubmitSuccess(false);
  };

  const openModal = (modal) => setModalState(prev => ({ ...prev, [modal]: true }));
  const closeModal = (modal) => setModalState(prev => ({ ...prev, [modal]: false }));

  const stepImages = [medicalImage1, medicalImage2, medicalImage3];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white border-opacity-20 flex flex-col lg:flex-row"
        >
          {/* Image Gallery Section - Left Side */}
          <div className="lg:w-2/5 relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-indigo-900/40 z-10 rounded-l-3xl"></div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="h-full w-full"
              >
                <img 
                  src={stepImages[currentStep - 1]} 
                  alt={`Medical travel step ${currentStep}`}
                  className="w-full h-full object-cover rounded-l-3xl"
                />
              </motion.div>
            </AnimatePresence>
            
            <div className="absolute bottom-8 left-8 z-20">
              <div className="flex space-x-2">
                {[1, 2, 3].map((step) => (
                  <div 
                    key={step}
                    onClick={() => setCurrentStep(step)}
                    className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${currentStep === step ? 'bg-white scale-125' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="absolute bottom-12 left-0 right-0 px-8 z-20">
              <motion.div
                key={`text-${currentStep}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white"
              >
                <h3 className="text-2xl font-quicksand mb-2 drop-shadow-md">
                  {currentStep === 1 && "Votre santé, notre priorité"}
                  {currentStep === 2 && "Un voyage médical sur mesure"}
                  {currentStep === 3 && "Accompagnement personnalisé"}
                </h3>
                <p className="text-blue-100 drop-shadow-sm">
                  {currentStep === 1 && "Commencez votre parcours médical à l'étranger avec confiance."}
                  {currentStep === 2 && "Nous organisons chaque détail pour votre tranquillité d'esprit."}
                  {currentStep === 3 && "Vos besoins spécifiques sont notre engagement."}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Form Section - Right Side */}
          <div className="lg:w-3/5">
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-8 px-8 sm:px-12 text-white">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 left-0  w-48 h-48 bg-indigo-400 rounded-full filter blur-3xl"></div>
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl font-quicksand tracking-tight mb-1">Conciergerie Médicale Exclusive</h2>
                <p className="text-blue-100 max-w-lg font-quicksand">Notre équipe dédiée vous accompagne à chaque étape de votre voyage médical</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white bg-opacity-20">
                <motion.div 
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep - 1) * 33.33}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="p-8 sm:p-12">
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-12"
                >
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-emerald-200"
                  >
                    <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-quicksand text-gray-800 mb-3">Votre demande est confirmée!</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">Un conseiller dédié vous contactera dans les prochaines heures pour personnaliser votre expérience.</p>
                  <button
                    onClick={resetForm}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-quicksand rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-blue-200"
                  >
                    Nouvelle demande
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="flex justify-center mb-10">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center">
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${currentStep === step ? 'border-blue-600 bg-blue-600 text-white scale-110' : currentStep > step ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-400'} font-quicksand`}
                        >
                          {step}
                        </div>
                        {step < 3 && (
                          <div className={`w-16 h-1 mx-2 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'} transition-all duration-500`}></div>
                        )}
                      </div>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div>
                          <label className="block text-sm font-quicksand text-gray-700 mb-3 uppercase tracking-wider font-quicksand text-blue-800">Informations Personnelles</label>
                          <div className="space-y-6">
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <FiUser className="text-blue-500" />
                              </div>
                              <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 bg-gray-50 placeholder-gray-400 font-quicksand"
                                placeholder="Nom Complet"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <FiMail className="text-blue-500" />
                                </div>
                                <input
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 bg-gray-50 placeholder-gray-400 font-quicksand"
                                  placeholder="Email"
                                  required
                                />
                              </div>

                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <FiPhone className="text-blue-500" />
                                </div>
                                <input
                                  type="tel"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleChange}
                                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 bg-gray-50 placeholder-gray-400 font-quicksand"
                                  placeholder="Téléphone"
                                  required
                                />
                              </div>
                            </div>

                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                </svg>
                              </div>
                              <input
                                type="text"
                                name="treatment"
                                value={formData.treatment}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 bg-gray-50 placeholder-gray-400 font-quicksand"
                                placeholder="Traitement recherché (ex: chirurgie orthopédique)"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-4">
                          <button
                            type="button"
                            onClick={nextStep}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-quicksand rounded-lg hover:shadow-lg transition-all duration-300 flex items-center group shadow-md hover:shadow-blue-200"
                          >
                            Suivant
                            <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div>
                          <label className="block text-sm font-quicksand text-gray-700 mb-3 uppercase tracking-wider font-quicksand text-blue-800">Détails du Voyage</label>
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <FiMapPin className="text-blue-500" />
                                </div>
                                <input
                                  type="text"
                                  name="destination"
                                  value={formData.destination}
                                  onChange={handleChange}
                                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 bg-gray-50 placeholder-gray-400 font-quicksand"
                                  placeholder="Destination (Pays/Ville)"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm text-gray-600 mb-2 font-quicksand">Nombre d'accompagnants</label>
                                <div className="flex items-center">
                                  <button
                                    type="button"
                                    onClick={() => handleCompanionChange('decrease')}
                                    className="p-3 bg-gray-100 rounded-l-lg hover:bg-gray-200 transition text-gray-600 hover:text-blue-600"
                                  >
                                    <FiMinus />
                                  </button>
                                  <div className="px-6 py-2 bg-gray-50 text-center text-gray-800 font-quicksand border-t border-b border-gray-200">
                                    {formData.companions}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleCompanionChange('increase')}
                                    className="p-3 bg-gray-100 rounded-r-lg hover:bg-gray-200 transition text-gray-600 hover:text-blue-600"
                                  >
                                    <FiPlus />
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <FiCalendar className="text-blue-500" />
                                </div>
                                <input
                                  type="date"
                                  name="arrivalDate"
                                  value={formData.arrivalDate}
                                  onChange={handleChange}
                                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 bg-gray-50 placeholder-gray-400 font-quicksand"
                                  required
                                />
                              </div>

                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <FiCalendar className="text-blue-500" />
                                </div>
                                <input
                                  type="date"
                                  name="departureDate"
                                  value={formData.departureDate}
                                  onChange={handleChange}
                                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 bg-gray-50 placeholder-gray-400 font-quicksand"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between pt-4">
                          <button
                            type="button"
                            onClick={prevStep}
                            className="px-6 py-3 bg-gray-100 text-gray-700 font-quicksand rounded-lg hover:bg-gray-200 transition flex items-center group border border-gray-200"
                          >
                            <FiArrowLeft className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                            Précédent
                          </button>
                          <button
                            type="button"
                            onClick={nextStep}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-quicksand rounded-lg hover:shadow-lg transition-all duration-300 flex items-center group shadow-md hover:shadow-blue-200"
                          >
                            Suivant
                            <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div>
                          <label className="block text-sm font-quicksand text-gray-700 mb-3 uppercase tracking-wider font-quicksand text-blue-800">Demandes Spéciales</label>
                          <div className="space-y-6">
                            <textarea
                              name="specialRequests"
                              value={formData.specialRequests}
                              onChange={handleChange}
                              rows="5"
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 bg-gray-50 placeholder-gray-400 font-quicksand"
                              placeholder="Besoins particuliers, préférences d'hébergement, exigences médicales, etc."
                            ></textarea>

                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="privacy-policy"
                                  type="checkbox"
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  required
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="privacy-policy" className="text-gray-600 font-quicksand">
                                  J'accepte que mes informations soient utilisées pour organiser mon voyage médical et je comprends la{' '}
                                  <a href="#" className="text-blue-600 hover:underline font-quicksand">politique de confidentialité</a>.
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between pt-4">
                          <button
                            type="button"
                            onClick={prevStep}
                            className="px-6 py-3 bg-gray-100 text-gray-700 font-quicksand rounded-lg hover:bg-gray-200 transition flex items-center group border border-gray-200"
                          >
                            <FiArrowLeft className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                            Précédent
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-quicksand rounded-lg hover:shadow-lg transition-all duration-300 flex items-center disabled:opacity-75 group shadow-md hover:shadow-blue-200"
                          >
                            {isSubmitting ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Envoi en cours...
                              </>
                            ) : (
                              <>
                                Finaliser la demande
                                <svg className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                                </svg>
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              )}
            </div>

            <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500 font-quicksand">
                Service client disponible 24/7 • <a href="#" className="text-blue-600 hover:underline font-quicksand">Questions fréquentes</a>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Premium Trust Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {/* Assurance Premium */}
            <div className="p-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-quicksand text-gray-900 mb-3">Assurance Médicale Inclusive</h3>
              <p className="text-gray-600 font-quicksand mb-4">
                Couverture tous risques incluse dans tous nos forfaits, avec protection annulation et extension possible.
              </p>
              <button 
                onClick={() => openModal('assurance')}
                className="text-blue-600 hover:text-blue-800 text-sm font-quicksand inline-flex items-center group"
              >
                En savoir plus
                <FiArrowRight className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Accompagnement VIP */}
            <div className="p-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-quicksand text-gray-900 mb-3">Service Conciergerie VIP</h3>
              <p className="text-gray-600 font-quicksand mb-4">
                Un assistant dédié gère tous vos aspects logistiques : transferts, hôtels, restauration et visites.
              </p>
              <button 
                onClick={() => openModal('conciergerie')}
                className="text-blue-600 hover:text-blue-800 text-sm font-quicksand inline-flex items-center group"
              >
                Découvrir l'expérience
                <FiArrowRight className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Partenariats */}
            <div className="p-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-quicksand text-gray-900 mb-3">Partenariats d'Excellence</h3>
              <p className="text-gray-600 font-quicksand mb-4">
                Accès privilégié aux meilleures cliniques internationales certifiées JCI et ISO 9001.
              </p>
              <button 
                onClick={() => openModal('partenaires')}
                className="text-blue-600 hover:text-blue-800 text-sm font-quicksand inline-flex items-center group"
              >
                Voir nos partenaires
                <FiArrowRight className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Testimonials Slider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-12 text-center text-white">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <svg className="w-10 h-10 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <h3 className="text-2xl font-quicksand mb-8">Ils nous ont fait confiance</h3>
              
              <div className="glide">
                <div className="glide__track" data-glide-el="track">
                  <div className="glide__slides">
                    <div className="glide__slide">
                      <blockquote className="max-w-2xl mx-auto">
                        <p className="text-lg font-quicksand italic mb-6">
                          "L'accompagnement personnalisé a transformé mon expérience médicale à l'étranger. Tout était parfaitement organisé, je n'ai eu qu'à me concentrer sur ma guérison."
                        </p>
                        <footer className="flex items-center justify-center">
                          <img className="w-12 h-12 rounded-full border-2 border-blue-300 mr-4" src="https://randomuser.me/api/portraits/women/43.jpg" alt="Sophie D." />
                          <div className="text-left">
                            <div className="font-quicksand">Sophie D.</div>
                            <div className="text-blue-200 text-sm">Chirurgie orthopédique, Suisse</div>
                          </div>
                        </footer>
                      </blockquote>
                    </div>
                    
                    <div className="glide__slide">
                      <blockquote className="max-w-2xl mx-auto">
                        <p className="text-lg font-quicksand italic mb-6">
                          "Le service conciergerie a anticipé tous mes besoins, même ceux auxquels je n'avais pas pensé. Une véritable bouffée d'oxygène dans un moment difficile."
                        </p>
                        <footer className="flex items-center justify-center">
                          <img className="w-12 h-12 rounded-full border-2 border-blue-300 mr-4" src="https://randomuser.me/api/portraits/men/32.jpg" alt="Pierre L." />
                          <div className="text-left">
                            <div className="font-quicksand">Pierre L.</div>
                            <div className="text-blue-200 text-sm">Traitement cardiaque, Allemagne</div>
                          </div>
                        </footer>
                      </blockquote>
                    </div>
                  </div>
                </div>
                
                <div className="glide__bullets mt-8" data-glide-el="controls[nav]">
                  <button className="glide__bullet w-3 h-3 bg-white bg-opacity-30 rounded-full mx-1 focus:outline-none" data-glide-dir="=0"></button>
                  <button className="glide__bullet w-3 h-3 bg-white bg-opacity-30 rounded-full mx-1 focus:outline-none" data-glide-dir="=1"></button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Certification Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          {/*<div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-center text-xl font-quicksand text-gray-800 mb-8">Nos accréditations internationales</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <img src="https://via.placeholder.com/120x60?text=JCI" alt="JCI Accreditation" className="h-12 opacity-80 hover:opacity-100 transition" />
              <img src="https://via.placeholder.com/120x60?text=ISO9001" alt="ISO 9001" className="h-12 opacity-80 hover:opacity-100 transition" />
              <img src="https://via.placeholder.com/120x60?text=Medical+Travel" alt="Medical Travel Association" className="h-12 opacity-80 hover:opacity-100 transition" />
              <img src="https://via.placeholder.com/120x60?text=WTO" alt="World Tourism Organization" className="h-12 opacity-80 hover:opacity-100 transition" />
            </div>
          </div>*/}
        </motion.div>
      </div>

      {/* Modale Assurance */}
      <PremiumModal 
        isOpen={modalState.assurance} 
        onClose={() => closeModal('assurance')}
        title="Assurance Médicale Inclusive"
      >
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <h4 className="font-quicksand text-blue-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Protection Complète
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Couverture jusqu'à 2M€ pour les complications médicales</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Remboursement à 100% des frais d'annulation</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Assistance rapatriement médicalisé</span>
              </li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-quicksand text-gray-800 mb-3">Options Premium</h4>
              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <div className="flex items-start mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-quicksand text-gray-900">Extension Familiale</h5>
                    <p className="text-gray-600 text-sm">Couverture pour vos accompagnants sans supplément</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-quicksand text-gray-900">Garantie Prix</h5>
                    <p className="text-gray-600 text-sm">Aucun frais supplémentaire en cas de complication</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-quicksand text-gray-800 mb-3">Documentation</h4>
              <div className="space-y-4">
                <a href="#" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">Brochure des garanties (PDF)</span>
                </a>
                <a href="#" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Vidéo explicative</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </PremiumModal>

      {/* Modale Conciergerie */}
      <PremiumModal 
        isOpen={modalState.conciergerie} 
        onClose={() => closeModal('conciergerie')}
        title="Service Conciergerie VIP"
      >
        <div className="space-y-8">
          <div className="relative rounded-xl overflow-hidden h-64 bg-gradient-to-r from-amber-500 to-amber-600">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative z-10 h-full flex items-center justify-center text-white">
              <div className="text-center px-6">
                <h4 className="text-2xl font-quicksand mb-3">Expérience Sans Compromis</h4>
                <p className="max-w-lg mx-auto">Votre assistant dédié disponible 24h/24 pour répondre à tous vos besoins</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-quicksand text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Services Immédiats
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span>Réservation de transports privés avec chauffeur</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span>Accès à des suites hospitalières premium</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span>Service de traduction médicale en temps réel</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-quicksand text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Avantages Exclusifs
              </h4>
              <div className="bg-amber-50 rounded-lg p-5 border border-amber-100">
                <div className="flex mb-3">
                  <div className="bg-amber-100 text-amber-800 text-xs font-quicksand px-2.5 py-0.5 rounded mr-3">NOUVEAU</div>
                  <span className="text-sm text-amber-800">Programme fidélité Diamant</span>
                </div>
                <p className="text-gray-700 text-sm">Accumulez des points à chaque voyage et bénéficiez d'avantages supplémentaires comme des nuits d'hôtel offertes ou des upgrades VIP.</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-quicksand text-gray-800 mb-4">Témoignage Client</h4>
            <blockquote className="italic text-gray-700 border-l-4 border-amber-500 pl-4 py-2">
              "Mon assistant a organisé une visite privée du Louvre après mon traitement, une attention qui a transformé mon séjour en une expérience inoubliable."
            </blockquote>
            <div className="mt-4 flex items-center">
              <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Client" className="w-10 h-10 rounded-full mr-3" />
              <div>
                <div className="font-quicksand">Élodie R.</div>
                <div className="text-sm text-gray-500">Chirurgie esthétique, 2023</div>
              </div>
            </div>
          </div>
        </div>
      </PremiumModal>

      {/* Modale Partenaires */}
      <PremiumModal 
        isOpen={modalState.partenaires} 
        onClose={() => closeModal('partenaires')}
        title="Nos Partenaires d'Excellence"
      >
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl p-6 text-white">
            <h4 className="font-quicksand text-xl mb-2">Réseau Médical International</h4>
            <p className="opacity-90">Accès privilégié à plus de 150 établissements certifiés dans 35 pays</p>
          </div>

          <div>
            <h4 className="font-quicksand text-gray-800 mb-4">Cliniques Partenaires</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Hôpital Universitaire de Genève",
                "Clinique La Prairie (Suisse)",
                "Cleveland Clinic (USA)",
                "Bumrungrad International (Thaïlande)",
                "Anadolu Medical Center (Turquie)",
                "Quironsalud Madrid (Espagne)"
              ].map((clinic, index) => (
                <div key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{clinic}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-quicksand text-gray-800 mb-4">Certifications</h4>
            <div className="flex flex-wrap gap-4">
              {['JCI', 'ISO 9001', 'TEMOS', 'MTQUA', 'EFQM'].map((cert, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center shadow-sm">
                  <div className="bg-emerald-100 text-emerald-800 w-10 h-10 rounded-full flex items-center justify-center mr-3 font-quicksand">
                    {cert.charAt(0)}
                  </div>
                  <div>
                    <div className="font-quicksand">{cert}</div>
                    <div className="text-xs text-gray-500">Certification</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-quicksand text-gray-800 mb-3">Devenir Partenaire</h4>
            <p className="text-gray-700 mb-4">Nos établissements partenaires bénéficient d'un flux de patients qualifiés et d'une visibilité internationale.</p>
            <button className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-quicksand hover:shadow-md transition">
              Proposer un partenariat
            </button>
          </div>
        </div>
      </PremiumModal>
    </div>
  );
};

export default MedicalTravelAssistantForm;