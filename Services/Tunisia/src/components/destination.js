import React, { useState } from 'react';
import { FiMapPin, FiArrowRight, FiStar, FiCamera, FiUmbrella, FiCompass, FiX, FiClock, FiUsers, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import T1 from '../assets/tunisia2.jpg';
import T2 from '../assets/sousse1.jpg';
import T3 from '../assets/ham.jpg';
import T4 from '../assets/DJERBA.jpg';

export const MedicalDestinations = () => {
  const [activeCity, setActiveCity] = useState(0);
  const [showCircuitModal, setShowCircuitModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  const cities = [
    {
      id: 0,
      name: "Tunis",
      img: T1,
      desc: "Capitale vibrante alliant histoire et modernité",
      attractions: ["Médina classée UNESCO", "Musée du Bardo", "Sidi Bou Saïd"],
      highlights: [
        { icon: <FiCamera className="text-blue-400" />, text: "Sites historiques incontournables" },
        { icon: <FiUmbrella className="text-green-400" />, text: "Marchés artisanaux animés" },
        { icon: <FiCompass className="text-orange-400" />, text: "Vie nocturne dynamique" }
      ]
    },
    {
      id: 1,
      name: "Sousse",
      img: T2,
      desc: "Perle du Sahel aux plages de sable doré",
      attractions: ["Ribat de Sousse", "Port El Kantaoui", "Plage Boujaafar"],
      highlights: [
        { icon: <FiCamera className="text-blue-400" />, text: "Mélange unique d'histoire et de détente" },
        { icon: <FiUmbrella className="text-green-400" />, text: "Complexes hôteliers luxueux" },
        { icon: <FiCompass className="text-orange-400" />, text: "Golf 18 trous en bord de mer" }
      ]
    },
    {
      id: 2,
      name: "Hammamet",
      img: T3,
      desc: "Station balnéaire au charme méditerranéen",
      attractions: ["Vieille ville fortifiée", "Parc Carthage Land", "Jardins de Sébastien"],
      highlights: [
        { icon: <FiCamera className="text-blue-400" />, text: "Architecture traditionnelle préservée" },
        { icon: <FiUmbrella className="text-green-400" />, text: "Plages familiales sécurisées" },
        { icon: <FiCompass className="text-orange-400" />, text: "Centre de thalassothérapie réputé" }
      ]
    },
    {
      id: 3,
      name: "Djerba",
      img: T4,
      desc: "Île paradisiaque aux maisons blanches et palmiers",
      attractions: ["Houmt Souk", "Synagogue de la Ghriba", "Plage de Sidi Mahrez"],
      highlights: [
        { icon: <FiCamera className="text-blue-400" />, text: "Culture insulaire unique" },
        { icon: <FiUmbrella className="text-green-400" />, text: "Climat ensoleillé toute l'année" },
        { icon: <FiCompass className="text-orange-400" />, text: "Désert et mer réunis" }
      ]
    }
  ];

  const mapEmbedUrls = [
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1279816.274012211!2d10.1653181!3d36.8064948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12e2cb7454c6ed51%3A0x683b7ab5567e7c52!2sTunis!5e0!3m2!1sen!2stn!4v1620000000000!5m2!1sen!2stn",
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1279816.274012211!2d10.634583!3d35.8287989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x130275759ac9d10d%3A0x3e4b466e2a5f3b1e!2sSousse!5e0!3m2!1sen!2stn!4v1620000000000!5m2!1sen!2stn",
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1279816.274012211!2d10.616733!3d36.4006839!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12e2cb1ef92e6c49%3A0x5a3b3a3b3a3b3a3b!2sHammamet!5e0!3m2!1sen!2stn!4v1620000000000!5m2!1sen!2stn",
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1279816.274012211!2d10.859641!3d33.8080759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1252f9240a4b5e5d%3A0x5a3b3a3b3a3b3a3b!2sDjerba!5e0!3m2!1sen!2stn!4v1620000000000!5m2!1sen!2stn"
  ];

  const cityCircuits = {
    Tunis: [
      {
        title: "Découverte Culturelle de Tunis",
        duration: "2 jours",
        price: "À partir de 250€",
        description: "Explorez les trésors historiques de la capitale tunisienne",
        highlights: [
          "Visite guidée de la Médina",
          "Découverte du Musée du Bardo",
          "Balade à Sidi Bou Saïd",
          "Dîner typique dans un restaurant local"
        ],
        image: T1
      },
      {
        title: "Tunis Insolite",
        duration: "1 jour",
        price: "À partir de 120€",
        description: "Circuit hors des sentiers battus",
        highlights: [
          "Marché central et street food",
          "Street art et galeries contemporaines",
          "Atelier de poterie traditionnelle",
          "Café littéraire"
        ],
        image: T1
      }
    ],
    Sousse: [
      {
        title: "Sousse Historique et Balnéaire",
        duration: "3 jours",
        price: "À partir de 350€",
        description: "Combine découverte culturelle et détente au bord de la mer",
        highlights: [
          "Visite du Ribat et de la Médina",
          "Journée à Port El Kantaoui",
          "Dégustation de fruits de mer",
          "Soirée dans un café maure"
        ],
        image: T2
      }
    ],
    Hammamet: [
      {
        title: "Détente à Hammamet",
        duration: "2 jours",
        price: "À partir de 300€",
        description: "Séjour bien-être dans la station balnéaire la plus réputée",
        highlights: [
          "Journée thalassothérapie",
          "Visite des jardins de Sébastien",
          "Dîner avec vue sur la mer",
          "Promenade dans la vieille ville"
        ],
        image: T3
      }
    ],
    Djerba: [
      {
        title: "Découverte de Djerba",
        duration: "4 jours",
        price: "À partir de 450€",
        description: "Immersion dans l'île aux mille couleurs",
        highlights: [
          "Visite de Houmt Souk",
          "Découverte de la synagogue de la Ghriba",
          "Journée dans le désert",
          "Dîner chez l'habitant"
        ],
        image: T4
      }
    ]
  };

  const handleShowCircuits = (cityName) => {
    setSelectedCity(cityName);
    setShowCircuitModal(true);
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 font-semibold mb-2 inline-block">
            Découvrez la Tunisie
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos <span className="text-blue-600">destinations phares</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Entre mer, désert et villes historiques, la Tunisie vous réserve des expériences uniques
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Cities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {cities.map((city, index) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => setActiveCity(city.id)}
                className={`relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-all duration-300 ${activeCity === city.id ? 'ring-4 ring-blue-400' : 'hover:shadow-xl'}`}
              >
                <div className="relative h-64">
                  <img 
                    src={city.img} 
                    alt={city.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{city.name}</h3>
                    <p className="text-sm opacity-90 mb-3">{city.desc}</p>
                    <div className="flex items-center text-sm">
                      <FiMapPin className="mr-1" />
                      <span>Destination incontournable</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Map and Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden h-full"
          >
            {/* Map */}
            <div className="h-80 w-full relative">
              <iframe
                src={mapEmbedUrls[activeCity]}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md text-sm font-medium flex items-center">
                <FiMapPin className="text-blue-500 mr-1" />
                {cities[activeCity].name}
              </div>
            </div>

            {/* City Details */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                À découvrir à {cities[activeCity].name}
              </h3>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">Attractions principales :</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  {cities[activeCity].attractions.map((attraction, i) => (
                    <li key={i}>{attraction}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 mb-6">
                {cities[activeCity].highlights.map((highlight, i) => (
                  <div key={i} className="flex items-start">
                    <span className="mr-3 mt-1">{highlight.icon}</span>
                    <p className="text-gray-700">{highlight.text}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleShowCircuits(cities[activeCity].name)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
              >
                Voir les circuits à {cities[activeCity].name}
                <FiArrowRight className="ml-2" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* CTA Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white text-center"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Prêt à vivre l'aventure tunisienne ?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Nos experts en voyage créent des itinéraires sur mesure combinant culture, détente et aventure
            </p>
            
          </div>
        </motion.div>
      </div>

      {/* Modal des Circuits */}
      {showCircuitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold">Circuits touristiques à {selectedCity}</h3>
              <button 
                onClick={() => setShowCircuitModal(false)}
                className="text-white hover:text-gray-200 p-2"
              >
                <FiX size={24} />
              </button>
            </div>
            
            {/* Content */}
            <div className="overflow-y-auto p-6">
              {cityCircuits[selectedCity]?.map((circuit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="mb-8 last:mb-0 border border-gray-200 rounded-xl overflow-hidden shadow-md"
                >
                  <div className="grid md:grid-cols-3">
                    <div className="md:col-span-1">
                      <img 
                        src={circuit.image} 
                        alt={circuit.title}
                        className="w-full h-full object-cover min-h-48"
                      />
                    </div>
                    <div className="md:col-span-2 p-6">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">{circuit.title}</h4>
                      <p className="text-gray-600 mb-4">{circuit.description}</p>
                      
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-700">
                          <FiClock className="mr-2 text-blue-500" />
                          {circuit.duration}
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <FiUsers className="mr-2 text-blue-500" />
                          Groupe 2-8 personnes
                        </div>
                        <div className="flex items-center text-sm font-semibold text-blue-600">
                          <FiDollarSign className="mr-2" />
                          {circuit.price}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-700 mb-2">Points forts :</h5>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                          {circuit.highlights.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 flex items-center">
                        Réserver ce circuit
                        <FiArrowRight className="ml-2" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 p-4 border-t border-gray-200 text-center">
              <p className="text-gray-600 mb-2">Vous ne trouvez pas votre bonheur ?</p>
              <button className="text-blue-600 font-medium hover:text-blue-800 flex items-center justify-center mx-auto">
                Demander un circuit personnalisé
                <FiCalendar className="ml-2" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default MedicalDestinations;