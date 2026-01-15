import React, { useState } from 'react';
import { FiStar, FiMapPin, FiHeart, FiFilter,FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export const RecommendedAccommodations = () => {
  // Types de filtres disponibles
  const accommodationTypes = [
    { id: 'all', label: 'Tous' },
    { id: 'hotel', label: 'Hôtels Médicalisés' },
    { id: 'clinic', label: 'Cliniques Partenaires' },
    { id: 'residence', label: 'Résidences Médicales' },
    { id: 'vip', label: 'Services VIP' }
  ];

  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


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
      (prev + 1) % (galleryImages[selectedAccommodation.id]?.length || 1))
  };

  const prevImage = () => {
    setCurrentImageIndex(prev =>
      (prev - 1 + (galleryImages[selectedAccommodation.id]?.length || 1)) %
      (galleryImages[selectedAccommodation.id]?.length || 1))
  };

  // Données des hébergements (à remplacer par vos données réelles)
  const accommodationsData = [
    {
      id: 1,
      name: "Hôtel Médical Le Renaissance",
      type: "hotel",
      location: "Paris, France",
      rating: 4.8,
      price: 220,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      features: ["Chambres adaptées", "Service infirmier 24/7", "Restaurant diététique"],
      isFavorite: false,
      partnerSince: 2018
    },
    {
      id: 2,
      name: "Clinique La Sérénité",
      type: "clinic",
      location: "Lyon, France",
      rating: 4.9,
      price: null,
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      features: ["Suites hospitalières", "Bloc opératoire high-tech", "Équipe multilingue"],
      isFavorite: true,
      partnerSince: 2016
    },
    {
      id: 3,
      name: "Résidence Les Thermes",
      type: "residence",
      location: "Bordeaux, France",
      rating: 4.5,
      price: 180,
      image: "https://images.unsplash.com/photo-1582719471387-9c060a971c3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      features: ["Appartements thérapeutiques", "Espace détente", "Accompagnants inclus"],
      isFavorite: false,
      partnerSince: 2020
    },
    {
      id: 4,
      name: "Hôtel Spa Médical",
      type: "hotel",
      location: "Nice, France",
      rating: 4.7,
      price: 290,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      features: ["Spa thérapeutique", "Suites VIP", "Transferts médicaux"],
      isFavorite: false,
      partnerSince: 2019
    },
    {
      id: 5,
      name: "Conciergerie VIP Santé",
      type: "vip",
      location: "Monaco",
      rating: 5.0,
      price: 650,
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      features: ["Service sur mesure", "Assistance 24/7", "Accès cliniques privées"],
      isFavorite: true,
      partnerSince: 2015
    },
    {
      id: 6,
      name: "Hôpital International",
      type: "clinic",
      location: "Marseille, France",
      rating: 4.6,
      price: null,
      image: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      features: ["Centre d'excellence", "Technologie de pointe", "Traducteurs médicaux"],
      isFavorite: false,
      partnerSince: 2017
    }
  ];

  const [activeFilter, setActiveFilter] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  // Fonction pour filtrer les hébergements
  const filteredAccommodations = accommodationsData.filter(acc => {
    const matchesFilter = activeFilter === 'all' || acc.type === activeFilter;
    const matchesFavorites = !favoritesOnly || acc.isFavorite;
    return matchesFilter && matchesFavorites;
  });

  // Fonction pour trier les hébergements
  const sortedAccommodations = [...filteredAccommodations].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price' && a.price && b.price) return a.price - b.price;
    if (sortBy === 'partnerSince') return b.partnerSince - a.partnerSince;
    return 0;
  });

  // Fonction pour basculer les favoris
  const toggleFavorite = (id) => {
    // Dans une vraie application, vous mettriez à jour l'état global ou une API ici
    console.log(`Toggle favorite for accommodation ${id}`);
  };

  return (
    <div className="bg-white ml-7 mr-5 rounded-3xl shadow-xl overflow-hidden border border-gray-100 mt-16">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Nos hébergements recommandés</h2>
        <p className="text-gray-600 mb-8">Découvrez nos partenaires privilégiés pour votre séjour médical</p>

        {/* Barre de filtres */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          {/* Filtres par type */}
          <div className="flex flex-wrap gap-2">
            {accommodationTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setActiveFilter(type.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center ${activeFilter === type.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Filtres avancés */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${favoritesOnly
                ? 'bg-amber-100 text-amber-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <FiHeart className={`${favoritesOnly ? 'fill-amber-500 text-amber-500' : 'text-gray-400'}`} />
              Favoris seulement
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-gray-100 border-0 rounded-lg pl-4 pr-8 py-2 text-sm text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="rating">Trier par note</option>
                <option value="price">Trier par prix</option>
                <option value="partnerSince">Trier par ancienneté</option>
              </select>
              <FiFilter className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Galerie d'hébergements */}
        {sortedAccommodations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {sortedAccommodations.map(accommodation => (
                <motion.div
                  key={accommodation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Image avec badge */}
                  <div className="relative">
                    <img
                      src={accommodation.image}
                      alt={accommodation.name}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(accommodation.id)}
                      className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
                    >
                      <FiHeart
                        className={`w-5 h-5 ${accommodation.isFavorite
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-300 hover:text-red-400'
                          }`}
                      />
                    </button>
                    {accommodation.partnerSince <= 2017 && (
                      <div className="absolute bottom-4 left-4 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                        Partenaire historique
                      </div>
                    )}
                  </div>

                  {/* Contenu de la carte */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{accommodation.name}</h3>
                      <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                        <FiStar className="text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{accommodation.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600 mb-4">
                      <FiMapPin className="mr-1.5" />
                      <span className="text-sm">{accommodation.location}</span>
                    </div>

                    {/* Liste des caractéristiques */}
                    <ul className="space-y-2 mb-4">
                      {accommodation.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      {accommodation.price ? (
                        <div>
                          <p className="text-xs text-gray-500">À partir de</p>
                          <p className="text-xl font-bold text-blue-600">{accommodation.price}€ <span className="text-sm font-normal text-gray-500">/nuit</span></p>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Tarification médicale</div>
                      )}
                      <button
                        onClick={() => openDetails(accommodation)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition hover:from-blue-600 hover:to-blue-700"
                      >
                        Voir détails
                      </button>
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
                              className="fixed inset-0 bg-black  bg-opacity-20"
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
                                            className={`w-2 h-2 rounded-full transition ${index === currentImageIndex ? 'bg-white w-4' : 'bg-white bg-opacity-50'
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
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mt-4">Aucun hébergement trouvé</h3>
            <p className="text-gray-500 mt-2">Essayez de modifier vos critères de recherche</p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setFavoritesOnly(false);
              }}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedAccommodations;