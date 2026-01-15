import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiX, FiChevronRight, FiStar, FiShield, FiHeart, FiCalendar, FiDollarSign } from 'react-icons/fi';

export const RelatedServices = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [duration, setDuration] = useState(3);
  const [additionalOption, setAdditionalOption] = useState('Aucune');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const packages = [
    {
      id: 1,
      title: "IVF Premium Package",
      description: "FIV complète avec hôtel 5 étoiles et transfert VIP",
      price: 8500,
      features: ["Consultation spécialisée", "Hôtel 5*", "Transport privé", "Assistance visa"],
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      badge: "Most Popular",
      icon: <FiHeart className="text-pink-500" />
    },
    {
      id: 2,
      title: "Hair Transplant Elite",
      description: "Greffe capillaire avec séjour de luxe",
      price: 4500,
      features: ["Greffe FUE", "Hôtel 4*", "Chauffeur privé", "Suivi post-op"],
      image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      badge: "Limited Offer",
      icon: <FiStar className="text-amber-400" />
    },
    {
      id: 3,
      title: "Dental Care Luxury",
      description: "Soins dentaires avec package complet",
      price: 3200,
      features: ["Blanchiment", "Hôtel 3*", "Transfert aéroport", "Assistance 24/7"],
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      badge: "Best Value",
      icon: <FiShield className="text-emerald-400" />
    },
  ];

  const additionalOptions = {
    "Aucune": 0,
    "Assistance Visa (+200€)": 200,
    "Transport VIP (+500€)": 500,
    "Suite Executive (+800€)": 800,
    "Conciergerie Médicale (+300€)": 300
  };

  const calculateCost = (basePrice, duration, option) => {
    const hotelRate = 150;
    const transport = 200;
    const optionPrice = additionalOptions[option] || 0;
    return basePrice + (hotelRate * duration) + transport + optionPrice;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-indigo-600 mb-4">
                Services Connexes Exclusifs
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Découvrez nos packages premium conçus pour allier excellence médicale et confort ultime.
              </p>
            </motion.div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {packages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -10 }}
                  className="relative bg-white rounded-2xl overflow-hidden shadow-2xl hover:shadow-xl transition-all duration-500"
                >
                  {pkg.badge && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                      {pkg.badge}
                    </div>
                  )}
                  
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="mr-2">{pkg.icon}</span>
                      <h3 className="text-xl font-bold text-gray-800">{pkg.title}</h3>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <FiCheckCircle className="text-emerald-500 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-gray-500">À partir de</p>
                        <p className="text-2xl font-bold text-indigo-600">
                          {formatPrice(pkg.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedPackage(pkg)}
                        className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-all duration-300 group"
                      >
                        <span>Personnaliser</span>
                        <FiChevronRight className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Custom Quote Modal */}
            <AnimatePresence>
              {selectedPackage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={() => setSelectedPackage(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 50 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative">
                      <img
                        src={selectedPackage.image}
                        alt={selectedPackage.title}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() => setSelectedPackage(null)}
                        className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition-all duration-300"
                      >
                        <FiX />
                      </button>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {selectedPackage.title}
                      </h3>
                      <p className="text-gray-600 mb-6">{selectedPackage.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FiCalendar className="inline mr-2" />
                            Durée du séjour (nuits)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <FiStar className="inline mr-2" />
                            Options supplémentaires
                          </label>
                          <select
                            value={additionalOption}
                            onChange={(e) => setAdditionalOption(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            {Object.keys(additionalOptions).map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="bg-indigo-50 rounded-xl p-5 mb-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">Coût total estimé</p>
                            <p className="text-3xl font-bold text-indigo-600">
                              {formatPrice(calculateCost(selectedPackage.price, duration, additionalOption))}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500 text-right">
                            <p>Base: {formatPrice(selectedPackage.price)}</p>
                            <p>Séjour: {duration} nuits</p>
                            {additionalOption !== 'Aucune' && (
                              <p>Option: {additionalOption.split('(+')[0]}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => setSelectedPackage(null)}
                          className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-300"
                        >
                          Retour
                        </button>
                        <button
                          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
                        >
                          <FiDollarSign className="mr-2" />
                          Confirmer la réservation
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Visa Assistance Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-blue-800 to-indigo-700 rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-12">
                  <h3 className="text-2xl font-bold text-white mb-3">Assistance Visa Médical Premium</h3>
                  <p className="text-blue-100 mb-6">
                    Notre service exclusif vous accompagne dans toutes les démarches administratives pour un séjour médical sans tracas.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-blue-100">
                      <FiCheckCircle className="text-emerald-300 mr-2" />
                      <span>Accompagnement personnalisé</span>
                    </li>
                    <li className="flex items-center text-blue-100">
                      <FiCheckCircle className="text-emerald-300 mr-2" />
                      <span>Taux de réussite de 98%</span>
                    </li>
                    <li className="flex items-center text-blue-100">
                      <FiCheckCircle className="text-emerald-300 mr-2" />
                      <span>Délais accélérés</span>
                    </li>
                  </ul>
                  <button className="bg-white text-indigo-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-all duration-300 inline-flex items-center">
                    <span>Découvrir notre service visa</span>
                    <FiChevronRight className="ml-2" />
                  </button>
                </div>
                <div className="hidden lg:block bg-[url('https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center" />
              </div>
            </motion.div>

            {/* Testimonials */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-20 text-center"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-12">Ils nous ont fait confiance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    quote: "Un accompagnement exceptionnel de A à Z. Tout était parfaitement organisé.",
                    author: "Sophie D., Paris",
                    rating: 5
                  },
                  {
                    quote: "Le service VIP vaut vraiment l'investissement. Aucune attente, tout était fluide.",
                    author: "Marc L., Bruxelles",
                    rating: 5
                  },
                  {
                    quote: "Résultat médical au-delà de nos attentes et séjour très confortable.",
                    author: "Emma et Pierre T., Genève",
                    rating: 4
                  }
                ].map((testimonial, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} mx-0.5`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                    <p className="text-gray-800 font-medium">{testimonial.author}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RelatedServices;