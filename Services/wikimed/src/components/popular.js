import React, { useState, useRef } from 'react';
import { FaPlus, FaMinus, FaClinicMedical, FaMoneyBillWave, FaUserMd, FaShieldAlt, FaPlane, FaComments, FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUser, FaCalendarAlt, FaArrowRight, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';

// Composant 3D pour les éléments flottants
const FloatingIcon = ({ position, color }) => {
  const meshRef = useRef();
  useFrame(() => {
    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.01;
  });
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
};

export const FAQSection = () => {
  const [activeCategory, setActiveCategory] = useState('Toutes');
  const [expandedItems, setExpandedItems] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    procedure: '',
    preferredDate: ''
  });

  const faqItems = [
    {
      id: 1,
      question: "Comment choisir la bonne clinique pour mon traitement ?",
      answer: "Nous sélectionnons uniquement des cliniques certifiées JCI avec des taux de réussite vérifiés. Votre conseiller médical analysera votre dossier et vous recommandera 2-3 options optimales en fonction de votre condition, budget et préférences.",
      icon: <FaClinicMedical />,
      category: "Préparation"
    },
    {
      id: 2,
      question: "Quelles économies puis-je réaliser par rapport à mon pays ?",
      answer: "En moyenne, nos patients économisent 40-70% sur les coûts médicaux tout en bénéficiant d'équipements de pointe. Par exemple : une greffe de cheveux FUE coûte 2.500€ chez nous contre 8.000€ en France, avec des technologies souvent plus récentes.",
      icon: <FaMoneyBillWave />,
      category: "Finance",
      extraContent: (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="font-medium text-blue-800 mb-2">Exemples d'économies :</h4>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>Implants dentaires</span>
              <span className="font-medium text-green-600">Économie de 60-70%</span>
            </li>
            <li className="flex justify-between">
              <span>Chirurgie de la vue LASIK</span>
              <span className="font-medium text-green-600">Économie de 50-55%</span>
            </li>
            <li className="flex justify-between">
              <span>Prothèse de hanche</span>
              <span className="font-medium text-green-600">Économie de 65-75%</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 3,
      question: "Comment sont sélectionnés vos chirurgiens et médecins ?",
      answer: "Nos praticiens sont triés sur le volet : minimum 10 ans d'expérience, formation internationale (Europe/Amérique du Nord), publications scientifiques et taux de satisfaction patients >95%. Beaucoup sont membres de sociétés médicales internationales.",
      icon: <FaUserMd />,
      category: "Sécurité"
    },
    {
      id: 4,
      question: "Mes données médicales seront-elles confidentielles ?",
      answer: "Absolument. Nous utilisons des plateformes sécurisées HIPAA/RGPD pour le transfert de dossiers. Vos informations ne sont jamais partagées sans consentement et sont cryptées. Vous pouvez aussi opter pour un pseudonyme si souhaité.",
      icon: <FaShieldAlt />,
      category: "Confidentialité"
    },
    {
      id: 5,
      question: "Dois-je prévoir un accompagnateur pour mon voyage ?",
      answer: "Cela dépend du traitement. Pour les interventions lourdes (chirurgie esthétique, FIV), nous le recommandons. Nos forfaits incluent souvent l'hébergement de l'accompagnateur. Pour les soins légers (dentaire, check-up), notre conciergerie 24/7 suffit généralement.",
      icon: <FaPlane />,
      category: "Logistique"
    },
    {
      id: 6,
      question: "Que se passe-t-il en cas de complication post-opératoire ?",
      answer: "Toutes nos cliniques partenaires offrent une garantie de prise en charge des complications. Votre conseiller reste disponible 24/7 pour coordonner si besoin. Nous avons également un réseau de médecins francophones dans votre pays pour le suivi.",
      icon: <FaShieldAlt />,
      category: "Sécurité"
    }
  ];

  const categories = ['Toutes', ...new Set(faqItems.map(item => item.category))];

  const filteredItems = activeCategory === 'Toutes' 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory);

  const toggleItem = (id) => {
    setExpandedItems(prev =>
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique d'envoi du formulaire
    console.log('Form submitted:', formData);
    setShowContactModal(false);
    // Réinitialiser le formulaire
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      procedure: '',
      preferredDate: ''
    });
  };

  // Animation drag pour la modale
  const x = useMotionValue(0);
  const rotateY = useTransform(x, [-200, 200], [-15, 15]);
  const boxShadow = useTransform(
    x,
    [-100, 0, 100],
    [
      "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
      "0 15px 30px -10px rgba(0, 0, 0, 0.1)",
      "0 25px 50px -12px rgba(168, 85, 247, 0.25)"
    ]
  );

  return (
    <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-100 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* En-tête */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-6">
            INFORMATIONS CLÉS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Questions <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Fréquentes</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trouvez des réponses à vos interrogations sur le tourisme médical
          </p>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setExpandedItems([]);
              }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Liste FAQ */}
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <motion.button
                  className="w-full flex justify-between items-center p-6 text-left"
                  onClick={() => toggleItem(item.id)}
                  whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.5)' }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${expandedItems.includes(item.id) ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {React.cloneElement(item.icon, {
                        className: expandedItems.includes(item.id) ? 'text-blue-600' : 'text-gray-600'
                      })}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.question}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedItems.includes(item.id) ? 180 : 0 }}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
                  >
                    <FaPlus size={12} />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {expandedItems.includes(item.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: 1, 
                        height: 'auto',
                        transition: { 
                          opacity: { duration: 0.3, delay: 0.1 },
                          height: { type: 'spring', damping: 20, stiffness: 100 }
                        }
                      }}
                      exit={{ 
                        opacity: 0, 
                        height: 0,
                        transition: { 
                          opacity: { duration: 0.2 },
                          height: { duration: 0.3 }
                        }
                      }}
                      className="px-6 pb-6"
                    >
                      <div className="pl-14 text-gray-600 space-y-4">
                        <p>{item.answer}</p>
                        {item.extraContent && item.extraContent}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 mb-6">
            Vous ne trouvez pas réponse à votre question ?
          </p>
          <motion.button
            onClick={() => setShowContactModal(true)}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)' }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center justify-center space-x-2">
              <FaComments />
              <span>Contactez notre équipe</span>
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* Modale de Contact Ultra-Premium */}
      <AnimatePresence>
              {showContactModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
                  onClick={() => setShowContactModal(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header avec gradient */}
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">
                          Contact Expert
                        </h3>
                        <motion.button
                          onClick={() => setShowContactModal(false)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          whileHover={{ rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaTimes />
                        </motion.button>
                      </div>
      
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaUser className="text-gray-400" />
                            </div>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              required
                            />
                          </div>
                        </div>
      
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaEnvelope className="text-gray-400" />
                              </div>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                required
                              />
                            </div>
                          </div>
      
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaPhone className="text-gray-400" />
                              </div>
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                required
                              />
                            </div>
                          </div>
                        </div>
      
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Procédure</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FaClinicMedical className="text-gray-400" />
                            </div>
                            <select
                              name="procedure"
                              value={formData.procedure}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                              required
                            >
                              <option value="">Sélectionnez...</option>
                              <option value="Chirurgie esthétique">Chirurgie esthétique</option>
                              <option value="Traitement dentaire">Traitement dentaire</option>
                              <option value="FIV">FIV</option>
                              <option value="Greffe de cheveux">Greffe de cheveux</option>
                              <option value="Autre">Autre</option>
                            </select>
                          </div>
                        </div>
      
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Message</label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            required
                          ></textarea>
                        </div>
      
                        <div className="pt-2">
                          <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-sm flex items-center justify-center space-x-2"
                          >
                            <span>Envoyer la demande</span>
                            <FaArrowRight className="w-3 h-3" />
                          </motion.button>
                        </div>
      
                        <div className="flex items-center text-xs text-gray-500">
                          <FaCheck className="text-green-500 mr-1.5 flex-shrink-0" />
                          <span>Nous vous répondons sous 24h maximum</span>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
    </section>
  );
};

export default FAQSection;