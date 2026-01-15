import React, { useState } from 'react';
import { FiCalendar, FiMapPin, FiHeart,FiArrowRight, FiClock, FiUsers, FiPlus, FiMinus, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';


export const InteractiveTimeline = () => {
    const [expandedDay, setExpandedDay] = useState(null);

    const itinerary = [
        {
            day: "Jour 1",
            title: "Arrivée & Installation",
            activities: [
                "Accueil personnalisé à l'aéroport",
                "Transfert privé vers l'hôtel 5*",
                "Rencontre avec votre coordinateur médical",
                "Dîner de bienvenue avec spécialités locales"
            ],
            medical: "Consultation pré-opératoire",
            icon: <FiCalendar className="text-blue-500" />
        },
        {
            day: "Jour 2",
            title: "Intervention Médicale",
            activities: [
                "Prise en charge à l'hôtel",
                "Transfert vers la clinique partenaire",
                "Procédure médicale (3-4 heures)",
                "Repos en suite privée sous surveillance"
            ],
            medical: "Greffe capillaire/FIV/Chirurgie",
            icon: <FiHeart className="text-red-500" />
        },
        {
            day: "Jour 3",
            title: "Convalescence & Détente",
            activities: [
                "Petit-déjeuner adapté servi en chambre",
                "Visite de contrôle par le chirurgien",
                "Massage thérapeutique à l'hôtel",
                "Balade légère dans les jardins de l'hôtel"
            ],
            medical: "Premier suivi post-opératoire",
            icon: <FiClock className="text-amber-500" />
        },
        {
            day: "Jour 4",
            title: "Découverte Culturelle",
            activities: [
                "Excursion à Sidi Bou Saïd (½ journée)",
                "Déjeuner dans un restaurant typique",
                "Visite du Musée du Bardo avec guide privé",
                "Retour à l'hôtel pour repos"
            ],
            medical: "Soins de suivi",
            icon: <FiMapPin className="text-green-500" />
        },
        {
            day: "Jour 5",
            title: "Dernier Contrôle & Départ",
            activities: [
                "Examen final avec le médecin",
                "Remise du dossier médical complet",
                "Temps libre pour derniers achats",
                "Transfert à l'aéroport avec assistance"
            ],
            medical: "Bilan final et recommandations",
            icon: <FiCheck className="text-purple-500" />
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Fond décoratif */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full opacity-5"
                ></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Titre section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-munika text-gray-900 mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-800">
                            ITINERAIRE TYPE
                        </span>
                    </h2>
                    <p className="text-base font-munika text-gray-600 max-w-3xl mx-auto">
                        Découvrez comment nous combinons excellence médicale et expérience culturelle pour votre séjour en Tunisie
                    </p>
                </motion.div>

                {/* Timeline interactive */}
                <div className="max-w-4xl mx-auto">
                    {itinerary.map((day, index) => (
                        <motion.div
                            key={day.day}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative font-munika pl-12 pb-10 ${index !== itinerary.length - 1 ? 'border-l-2 border-blue-200' : ''}`}
                        >
                            {/* Point de timeline */}
                            <div className="absolute left-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-white transform -translate-x-1/2 -translate-y-1">
                                {day.icon}
                            </div>

                            {/* Carte de jour */}
                            <motion.div
                                whileHover={{ y: -5 }}
                                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${expandedDay === index ? 'ring-4 ring-blue-300' : 'hover:shadow-xl'}`}
                            >
                                <button
                                    onClick={() => setExpandedDay(expandedDay === index ? null : index)}
                                    className="w-full text-left"
                                >
                                    <div className="p-6 flex justify-between items-center">
                                        <div>
                                            <div className="flex items-center mb-1">
                                                <h3 className="text-xl font-munika text-gray-900 mr-3">{day.day} - {day.title}</h3>
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-munika">
                                                    {day.medical}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 font-munika text-sm flex items-center">
                                                <FiClock className="mr-2 font-munika" /> Environ 6-8 heures d'activités
                                            </p>
                                        </div>
                                        {expandedDay === index ? (
                                            <FiMinus className="text-gray-400" />
                                        ) : (
                                            <FiPlus className="text-gray-400" />
                                        )}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {expandedDay === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6">
                                                <h4 className="font-munika text-gray-700 mb-3 flex items-center">
                                                    <FiUsers className="mr-2 text-blue-500" /> Programme détaillé
                                                </h4>
                                                <ul className="space-y-3">
                                                    {day.activities.map((activity, i) => (
                                                        <li key={i} className="flex items-start">
                                                            <div className="flex-shrink-0 mt-1">
                                                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                                                                    <FiCheck className="text-blue-500 text-xs" />
                                                                </div>
                                                            </div>
                                                            <span className="ml-3 text-gray-600">{activity}</span>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                                                    <div className="flex items-center">
                                                        <FiHeart className="text-red-400 mr-3 flex-shrink-0" />
                                                        <div>
                                                            <h5 className="font-munika text-gray-800">Suivi Médical</h5>
                                                            <p className="text-sm text-gray-600">{day.medical}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <h3 className="text-2xl font-munika text-gray-900 mb-4">Prêt à personnaliser votre itinéraire ?</h3>
                    <p className="text-xl font-munika text-gray-600 mb-6 max-w-3xl mx-auto">
                        Nos conseillers créent un programme sur mesure adapté à votre intervention et centres d'intérêt
                    </p>
                    
                </motion.div>
            </div>
        </section>
    );
};

export default InteractiveTimeline;