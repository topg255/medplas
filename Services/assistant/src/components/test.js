import React, { useState } from 'react';
import { FiStar, FiMapPin, FiHeart, FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export const RecommendedAccommodations = () => {
  // ... (conserve les mêmes données et états initiaux)

  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Images supplémentaires pour la galerie (exemple)
  const galleryImages = {
    1: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      "https://images.unsplash.com/photo-1582719471387-9c060a971c3a",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"
    ],
    // ... ajoutez pour les autres hébergements
  };

  const openDetails = (accommodation) => {
    setSelectedAccommodation(accommodation);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden'; // Bloque le scroll
  };

  const closeDetails = () => {
    setSelectedAccommodation(null);
    document.body.style.overflow = 'auto'; // Rétablit le scroll
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => 
      (prev + 1) % (galleryImages[selectedAccommodation.id]?.length || 1)
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => 
      (prev - 1 + (galleryImages[selectedAccommodation.id]?.length || 1)) % 
      (galleryImages[selectedAccommodation.id]?.length || 1))
  };

  // ... (conserve les mêmes fonctions de filtrage/tri)

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mt-16">
      {/* ... (conserve le même code jusqu'au bouton Voir détails) */}
      
      <button 
        onClick={() => openDetails(accommodation)}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition hover:from-blue-600 hover:to-blue-700"
      >
        Voir détails
      </button>

      {/* Modale Premium */}
      <AnimatePresence>
        {selectedAccommodation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-60"
              onClick={closeDetails}
            />

            {/* Contenu de la modale */}
            <div className="flex items-center justify-center min-h-screen p-4">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: 'spring', damping: 25 }}
                className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Bouton fermer */}
                <button
                  onClick={closeDetails}
                  className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
                >
                  <FiX className="w-6 h-6 text-gray-700" />
                </button>

                {/* Galerie d'images */}
                <div className="relative h-96 bg-gray-100 overflow-hidden">
                  <img
                    src={galleryImages[selectedAccommodation.id]?.[currentImageIndex] || selectedAccommodation.image}
                    alt={selectedAccommodation.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation galerie */}
                  {galleryImages[selectedAccommodation.id]?.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
                      >
                        <FiChevronLeft className="w-6 h-6 text-gray-700" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
                      >
                        <FiChevronRight className="w-6 h-6 text-gray-700" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {galleryImages[selectedAccommodation.id].map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition ${
                              index === currentImageIndex ? 'bg-white w-4' : 'bg-white bg-opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Contenu détaillé */}
                <div className="p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Colonne principale */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-3xl font-bold text-gray-900">
                          {selectedAccommodation.name}
                        </h2>
                        <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-full">
                          <FiStar className="text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="font-medium">{selectedAccommodation.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600 mb-6">
                        <FiMapPin className="mr-2 text-blue-500" />
                        <span>{selectedAccommodation.location}</span>
                      </div>

                      <div className="prose prose-sm text-gray-600 mb-8">
                        <p>
                          {selectedAccommodation.type === 'hotel' && 
                            "Établissement hôtelier médicalisé de haut standing offrant des services de santé intégrés."}
                          {selectedAccommodation.type === 'clinic' && 
                            "Centre médical partenaire disposant d'équipements de pointe et d'un personnel qualifié."}
                          {/* ... autres descriptions */}
                        </p>
                      </div>

                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Équipements & Services</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedAccommodation.features.map((feature, index) => (
                            <div key={index} className="flex items-start">
                              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Colonne secondaire (CTA) */}
                    <div className="md:w-80 flex-shrink-0">
                      <div className="bg-gray-50 rounded-xl p-6 sticky top-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Réservation</h3>
                        
                        {selectedAccommodation.price ? (
                          <div className="mb-6">
                            <div className="text-3xl font-bold text-blue-600 mb-1">
                              {selectedAccommodation.price}€
                              <span className="text-sm font-normal text-gray-500 ml-1">/nuit</span>
                            </div>
                            <p className="text-sm text-gray-500">Taxes et frais inclus</p>
                          </div>
                        ) : (
                          <div className="mb-6">
                            <div className="text-xl font-bold text-gray-900 mb-1">
                              Tarification médicale
                            </div>
                            <p className="text-sm text-gray-500">Contactez-nous pour un devis personnalisé</p>
                          </div>
                        )}

                        <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-medium hover:shadow-md transition mb-4">
                          Contacter l'établissement
                        </button>

                        <button className="w-full border border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-medium hover:bg-blue-50 transition flex items-center justify-center">
                          <FiHeart className="mr-2" />
                          Ajouter aux favoris
                        </button>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-2">Disponibilité</h4>
                          <p className="text-sm text-gray-600 mb-4">
                            {selectedAccommodation.partnerSince <= 2017 
                              ? "Partenaire historique - Disponibilité garantie" 
                              : "Disponible sous 48h"}
                          </p>
                          <button className="text-sm text-blue-600 hover:underline">
                            Voir les disponibilités en temps réel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};