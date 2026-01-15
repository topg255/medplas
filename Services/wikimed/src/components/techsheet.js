import React, { useState, useEffect } from 'react';
import { FiUsers, FiScissors, FiActivity, FiClock, FiStar, FiHeart, FiCheck, FiChevronDown, FiAlertCircle, FiDroplet, FiSmile, FiInfo, FiAward, FiBookmark } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import A from '../assets/approche.jpg'

const proceduresData = {
  "dentisterie": {
    id: 3,
    title: "Dentisterie Esthétique",
    description: "Solutions complètes pour un sourire parfait avec technologies de pointe",
    icon: <FiSmile className="text-emerald-500" />,
    color: "from-emerald-600 to-emerald-400",
    stats: [
      { icon: <FiUsers />, label: "Patients/an", value: "2,500+", color: "text-emerald-500" },
      { icon: <FiStar />, label: "Satisfaction", value: "97%", color: "text-yellow-500" },
      { icon: <FiClock />, label: "Durée", value: "1-3 visites", color: "text-purple-500" },
      { icon: <FiActivity />, label: "Garantie", value: "10 ans", color: "text-green-500" }
    ],
    tabs: {
      overview: {
        title: "Vue d'ensemble",
        content: [
          {
            title: "Notre approche",
            icon: <FiInfo className="text-emerald-500" />,
            content: "Notre approche de dentisterie esthétique combine technologies avancées et savoir-faire artisanal pour des résultats naturels et durables. Chaque traitement est personnalisé selon vos besoins spécifiques et l'anatomie unique de votre sourire.",
            image: A,
            highlights: [
              { value: "15+", label: "Technologies exclusives" },
              { value: "10 ans", label: "Garantie procédures" }
            ]
          },
          {
            title: "Traitements proposés",
            icon: <FiAward className="text-yellow-500" />,
            content: [
              { text: "Facettes en céramique", details: "Finesse et transparence naturelle" },
              { text: "Implants dentaires", details: "Système All-on-4 dernière génération" },
              { text: "Couronnes zircone", details: "Résistance et esthétique supérieures" },
              { text: "Blanchiment professionnel", details: "Technique LED avancée sans sensibilité" }
            ]
          }
        ]
      }
    }
  },
  "greffe-capillaire": {
    id: 1,
    title: "Greffe Capillaire FUE",
    description: "Technique avancée de micro-extraction folliculaire sans cicatrice visible",
    icon: <FiScissors className="text-blue-500" />,
    color: "from-blue-600 to-blue-500",
    stats: [
      { icon: <FiUsers />, label: "Patients/an", value: "1,200+", color: "text-blue-500" },
      { icon: <FiStar />, label: "Taux de réussite", value: "98%", color: "text-yellow-500" },
      { icon: <FiClock />, label: "Durée", value: "4-6h", color: "text-purple-500" },
      { icon: <FiActivity />, label: "Récupération", value: "7-10j", color: "text-green-500" }
    ],
    priceComparison: {
      tunisia: "2,500€",
      france: "8,000€",
      usa: "12,000€",
      savings: "70%"
    },
    tabs: {
      overview: {
        title: "Vue d'ensemble",
        content: [
          {
            title: "Description",
            icon: <FiInfo className="text-blue-500" />,
            content: "La technique FUE (Follicular Unit Extraction) permet de prélever des greffons un par un sans laisser de cicatrice linéaire, avec des résultats naturels et une récupération rapide.",
            image: "/api/placeholder/600/300",
            highlights: [
              { value: "10,000+", label: "Procédures réalisées" },
              { value: "98.7%", label: "Satisfaction client" }
            ]
          },
          {
            title: "Avantages",
            icon: <FiAward className="text-yellow-500" />,
            content: [
              { text: "Aucune cicatrice visible", icon: <FiCheck className="text-green-500" /> },
              { text: "Récupération accélérée", icon: <FiClock className="text-purple-500" /> },
              { text: "Densité optimale", icon: <FiActivity className="text-blue-500" /> },
              { text: "Adapté aux zones donneuses limitées", icon: <FiBookmark className="text-red-500" /> }
            ]
          }
        ]
      },
      procedure: {
        title: "Déroulement",
        content: [
          {
            title: "Consultation",
            icon: <FiUsers className="text-indigo-500" />,
            content: [
              { text: "Analyse capillaire 3D", details: "Cartographie précise de la densité capillaire" },
              { text: "Planification personnalisée", details: "Conception sur mesure de la ligne frontale" },
              { text: "Tests pré-opératoires", details: "Évaluation complète de compatibilité" }
            ]
          },
          {
            title: "Intervention",
            icon: <FiScissors className="text-red-500" />,
            content: [
              { text: "Micro-extraction des greffons", details: "Prélèvement précis et indolore" },
              { text: "Préparation sous microscope", details: "Conservation optimale des follicules" },
              { text: "Implantation précise", details: "Angulation naturelle et densité optimisée" },
              { text: "Protocole post-op immédiat", details: "Traitement anti-inflammatoire avancé" }
            ]
          }
        ]
      }
    }
  },
  "fiv": {
    id: 2,
    title: "Fécondation In Vitro",
    description: "Programme complet de procréation médicalement assistée avec taux de réussite élevés",
    icon: <FiHeart className="text-pink-500" />,
    color: "from-pink-600 to-pink-400",
    stats: [
      { icon: <FiUsers />, label: "Cycles/an", value: "800+", color: "text-pink-500" },
      { icon: <FiStar />, label: "Taux de réussite", value: "65%", color: "text-yellow-500" },
      { icon: <FiClock />, label: "Durée", value: "2-3 semaines", color: "text-purple-500" },
      { icon: <FiActivity />, label: "Suivi", value: "12 mois", color: "text-green-500" }
    ],
    tabs: {
      overview: {
        title: "Protocoles",
        content: [
          {
            title: "Options disponibles",
            icon: <FiBookmark className="text-pink-500" />,
            content: [
              { text: "FIV classique", details: "Méthode standard de fécondation in vitro" },
              { text: "ICSI pour infertilité masculine", details: "Injection intracytoplasmique de spermatozoïde" },
              { text: "Dons de gamètes", details: "Options pour donneuses et donneurs anonymes" },
              { text: "Vitrification ovocytaire", details: "Conservation optimale des ovocytes" }
            ],
            image: "/api/placeholder/600/300",
            highlights: [
              { value: "65%", label: "Taux de succès" },
              { value: "24/7", label: "Suivi personnalisé" }
            ]
          }
        ]
      }
    }
  },
  "chirurgie-esthetique": {
    id: 4,
    title: "Chirurgie Esthétique",
    description: "Transformations harmonieuses réalisées par des chirurgiens experts",
    icon: <FiDroplet className="text-rose-500" />,
    color: "from-rose-600 to-rose-400",
    stats: [
      { icon: <FiUsers />, label: "Interventions/an", value: "1,500+", color: "text-rose-500" },
      { icon: <FiStar />, label: "Satisfaction", value: "96%", color: "text-yellow-500" },
      { icon: <FiClock />, label: "Hospitalisation", value: "1-2 jours", color: "text-purple-500" },
      { icon: <FiActivity />, label: "Résultats", value: "Définitifs", color: "text-green-500" }
    ],
    tabs: {
      overview: {
        title: "Vue d'ensemble",
        content: [
          {
            title: "Notre philosophie",
            icon: <FiInfo className="text-rose-500" />,
            content: "Nous privilégions une approche naturelle de la beauté, en respectant les proportions et l'harmonie du corps. Nos chirurgiens combinent expertise technique et sensibilité esthétique pour des résultats élégants et durables.",
            image: "/api/placeholder/600/300",
            highlights: [
              { value: "20+", label: "Années d'expérience" },
              { value: "96%", label: "Satisfaction client" }
            ]
          },
          {
            title: "Interventions populaires",
            icon: <FiAward className="text-yellow-500" />,
            content: [
              { text: "Rhinoplastie", details: "Résultats naturels et harmonieux" },
              { text: "Liposculpture HD", details: "Définition musculaire avancée" },
              { text: "Augmentation mammaire", details: "Techniques mini-invasives" },
              { text: "Lifting facial", details: "Rajeunissement sans aspect artificiel" }
            ]
          }
        ]
      }
    }
  }
};

export const ProcedureTechSheet = () => {
  const [activeProcedure, setActiveProcedure] = useState("dentisterie");
  const [activeTab, setActiveTab] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});

  // Cette fonction réinitialise les sections expandées et définit la première section
  // de chaque catégorie comme ouverte automatiquement
  const initializeExpandedSections = (procedure) => {
    const newExpandedSections = {};
    const tabs = proceduresData[procedure].tabs;
    
    // Pour chaque onglet dans la procédure active
    Object.keys(tabs).forEach((tabKey, tabIndex) => {
      // Pour chaque section dans l'onglet, définir la première section comme ouverte
      tabs[tabKey].content.forEach((_, sectionIndex) => {
        // Si c'est la première section de l'onglet, l'ouvrir
        if (sectionIndex === 0) {
          newExpandedSections[`${tabKey}-${sectionIndex}`] = true;
        } else {
          newExpandedSections[`${tabKey}-${sectionIndex}`] = false;
        }
      });
    });

    return newExpandedSections;
  };

  // Réinitialiser les sections expandées lorsque la procédure change
  useEffect(() => {
    setExpandedSections(initializeExpandedSections(activeProcedure));
    setActiveTab(0); // Réinitialiser à l'onglet par défaut lors du changement de procédure
  }, [activeProcedure]);

  const toggleSection = (tab, index) => {
    setExpandedSections(prev => ({
      ...prev,
      [`${tab}-${index}`]: !prev[`${tab}-${index}`]
    }));
  };

  const currentProcedure = proceduresData[activeProcedure];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Arrière-plan décoratif */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Sélecteur de procédures */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {["dentisterie", "greffe-capillaire", "fiv", "chirurgie-esthetique"].map((key) => (
            <motion.button
              key={key}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveProcedure(key)}
              className={`px-6 py-3 rounded-full font-munika flex items-center transition-all ${
                activeProcedure === key 
                  ? `bg-gradient-to-r ${proceduresData[key].color} text-white shadow-lg`
                  : 'bg-white text-gray-700 shadow-md hover:shadow-lg'
              }`}
            >
              <span className="mr-3">{proceduresData[key].icon}</span>
              {proceduresData[key].title.split(' ')[0]}
            </motion.button>
          ))}
        </div>

        {/* Carte de procédure */}
        <motion.div 
          key={activeProcedure}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* En-tête avec dégradé dynamique */}
          <div className={`bg-gradient-to-r ${currentProcedure.color} p-10 text-white`}>
            <div className="flex items-start">
              <div className="text-4xl mr-6 mt-1">
                {currentProcedure.icon}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-munika mb-2">{currentProcedure.title}</h1>
                <p className="text-xl opacity-90 font-munika">{currentProcedure.description}</p>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="grid lg:grid-cols-3 divide-x divide-gray-100">
            {/* Colonne de contenu */}
            <div className="lg:col-span-2 p-10">
              <Tabs 
                className="flex flex-col h-full"
                selectedIndex={activeTab}
                onSelect={index => setActiveTab(index)}
              >
                <TabList className="flex border-b border-gray-200 space-x-1">
                  {Object.entries(currentProcedure.tabs || {}).map(([key, tab], index) => (
                    <Tab
                      key={key}
                      selectedClassName="text-blue-600 border-b-2 border-blue-500"
                      className="px-6 py-3 font-munika text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      {tab.title}
                    </Tab>
                  ))}
                </TabList>

                <div className="py-6 flex-1">
                  {Object.entries(currentProcedure.tabs || {}).map(([key, tab], tabIndex) => (
                    <TabPanel key={key}>
                      <div className="space-y-12">
                        {tab.content.map((section, index) => (
                          <div key={index} className="group">
                            <button
                              onClick={() => toggleSection(key, index)}
                              className="flex justify-between items-center w-full text-left mb-6"
                            >
                              <div className="flex items-center">
                                <div className={`p-2 rounded-lg mr-3 ${section.icon ? 'bg-gray-100' : ''}`}>
                                  {section.icon}
                                </div>
                                <h3 className="text-2xl font-munika text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {section.title}
                                </h3>
                              </div>
                              <FiChevronDown className={`text-gray-400 transition-transform ${
                                expandedSections[`${key}-${index}`] ? 'rotate-180' : ''
                              }`} />
                            </button>
                            
                            <AnimatePresence>
                              {expandedSections[`${key}-${index}`] && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: "easeInOut" }}
                                  className="overflow-hidden"
                                >
                                  {/* Description avec image et statistiques */}
                                  {typeof section.content === 'string' && (
                                    <div className="mb-8">
                                      <div className="grid md:grid-cols-5 gap-6">
                                        <div className="md:col-span-3">
                                          <p className="text-gray-600 text-lg  font-munika leading-relaxed">{section.content}</p>
                                          
                                          {section.highlights && (
                                            <div className="flex gap-6 mt-6">
                                              {section.highlights.map((highlight, i) => (
                                                <div key={i} className="text-center">
                                                  <div className="text-2xl font-munika text-blue-600">{highlight.value}</div>
                                                  <div className="text-gray-500 text-sm font-munika">{highlight.label}</div>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                        {section.image && (
                                          <div className="md:col-span-2">
                                            <div className="rounded-xl overflow-hidden shadow-lg">
                                              <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Liste améliorée avec icônes et détails */}
                                  {Array.isArray(section.content) && (
                                    <div className="mb-8">
                                      <div className="grid md:grid-cols-2 gap-6">
                                        <div className={`${section.image ? 'md:col-span-1' : 'md:col-span-2'}`}>
                                          <ul className="space-y-6">
                                            {section.content.map((item, i) => (
                                              <motion.li 
                                                key={i}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="relative bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow transition-shadow"
                                              >
                                                <div className="flex items-start">
                                                  {item.icon ? (
                                                    <div className="mr-4 p-2 bg-white rounded-full shadow-sm">
                                                      {item.icon}
                                                    </div>
                                                  ) : (
                                                    <div className="mr-4 p-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-full shadow-sm flex items-center justify-center h-8 w-8">
                                                      <span className="text-xs font-munika">{i + 1}</span>
                                                    </div>
                                                  )}
                                                  <div>
                                                    <div className="font-munika text-gray-900">
                                                      {item.text || item}
                                                    </div>
                                                    {item.details && (
                                                      <div className="text-sm font-munika text-gray-500 mt-1">
                                                        {item.details}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </motion.li>
                                            ))}
                                          </ul>
                                        </div>
                                        {section.image && (
                                          <div className="md:col-span-1">
                                            <div className="rounded-xl overflow-hidden shadow-lg h-full">
                                              <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
                                              
                                              {section.highlights && (
                                                <div className="flex justify-around py-4 bg-white">
                                                  {section.highlights.map((highlight, i) => (
                                                    <div key={i} className="text-center">
                                                      <div className="text-2xl font-munika text-blue-600">{highlight.value}</div>
                                                      <div className="text-gray-500 text-sm font-munika">{highlight.label}</div>
                                                    </div>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </TabPanel>
                  ))}
                </div>
              </Tabs>
            </div>

            {/* Colonne des statistiques */}
            <div className="lg:col-span-1 p-10 bg-gray-50">
              <div className="sticky top-10 space-y-8">
                {/* Statistiques */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-munika text-xl mb-6 flex items-center">
                    <FiActivity className="mr-3 text-blue-500 font-munika" />
                    Chiffres Clés
                  </h3>
                  <div className="space-y-5">
                    {currentProcedure.stats.map((stat, index) => (
                      <div key={index} className="flex items-center">
                        <div className={`mr-4 p-3 rounded-lg ${stat.color.replace('text', 'bg')}/10`}>
                          {React.cloneElement(stat.icon, { className: `text-xl ${stat.color}` })}
                        </div>
                        <div>
                          <div className="text-gray-500 font-munika text-sm">{stat.label}</div>
                          <div className={`font-munika text-2xl ${stat.color}`}>{stat.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comparaison de prix */}
                {currentProcedure.priceComparison && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-munika text-xl mb-6 flex items-center">
                      <FiStar className="mr-3 text-yellow-500" />
                      Économies
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tunisie</span>
                        <span className="font-munika text-blue-600 text-lg">
                          {currentProcedure.priceComparison.tunisia}
                        </span>
                      </div>
                      <div className="flex justify-between font-munika items-center text-gray-400">
                        <span>Europe</span>
                        <span className="line-through">{currentProcedure.priceComparison.france}</span>
                      </div>
                      <div className="flex justify-between font-munika items-center text-gray-400">
                        <span>Amérique du Nord</span>
                        <span className="line-through">{currentProcedure.priceComparison.usa}</span>
                      </div>
                      <div className="mt-4 p-3 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg text-center text-white font-munika">
                        Économisez {currentProcedure.priceComparison.savings}
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="space-y-4">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-munika py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center">
                    <FiCheck className="mr-3" />
                    Demander un devis personnalisé
                  </button>
                  <button className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-munika py-4 px-6 rounded-xl transition-all flex items-center justify-center">
                    <FiUsers className="mr-3" />
                    Parler à un ancien patient
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcedureTechSheet;