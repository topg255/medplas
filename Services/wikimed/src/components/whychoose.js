import React, { useEffect, useRef, useState } from 'react';
import { FaClinicMedical, FaMoneyBillWave, FaShieldAlt, FaPlane, FaStar, FaUserMd, FaTimes, FaArrowRight, FaCheck, FaCalendarAlt, FaEnvelope, FaPhone, FaIdCard, FaHospital, FaCommentMedical, FaUserCircle } from 'react-icons/fa';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';

export const WhyChooseUs = () => {
    const [selectedAdvantage, setSelectedAdvantage] = useState(null);
    const [showQuoteForm, setShowQuoteForm] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        service: '',
        message: '',
        preferredDate: '',
        preferredClinic: ''
    });
    const [selectedServices, setSelectedServices] = useState([]);
    const [formStep, setFormStep] = useState(1);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const advantages = [
        {
            icon: <FaClinicMedical className="w-10 h-10" />,
            title: "Infrastructures Médicales de Classe Mondiale",
            description: "Cliniques certifiées JCI avec des technologies de pointe comparables aux meilleurs centres occidentaux",
            stats: "100+ cliniques accréditées",
            details: {
                headline: "Des établissements d'excellence internationale",
                description: "Nos cliniques partenaires sont équipées des technologies médicales les plus récentes et suivent des protocoles rigoureux alignés sur les standards occidentaux.",
                features: [
                    "Certification JCI (Joint Commission International)",
                    "Équipements médicaux de dernière génération",
                    "Blocs opératoires ultramodernes",
                    "Suites privées avec connexion WiFi haut débit",
                    "Laboratoires d'analyses médicales avancés"
                ],
                testimonial: {
                    quote: "Le niveau technologique des équipements était équivalent, voire supérieur à ce que j'ai pu voir dans ma clinique habituelle à Bruxelles.",
                    author: "Dr. Philippe Vernet, Chirurgien"
                },
            }
        },
        {
            icon: <FaMoneyBillWave className="w-10 h-10" />,
            title: "Économies Substantielles",
            description: "Coûts 50-70% inférieurs à ceux de l'Europe/Nord-Amérique pour des soins de qualité équivalente",
            stats: "À partir de 60% d'économies",
            details: {
                headline: "Des tarifs transparents et avantageux",
                description: "Grâce à un coût de vie moins élevé et une optimisation des structures médicales, nous offrons des soins de qualité internationale à une fraction du prix pratiqué en Occident.",
                features: [
                    "Économies moyennes de 60-70% sur les actes chirurgicaux",
                    "Packages tout compris sans frais cachés",
                    "Options de financement flexibles",
                    "Remboursement partiel possible par certaines assurances",
                    "Consultation pré-opératoire gratuite"
                ],
                comparison: [
                    { procedure: "Chirurgie cardiaque", west: "85 000 €", our: "32 000 €" },
                    { procedure: "Pose de prothèse de hanche", west: "45 000 €", our: "15 000 €" },
                    { procedure: "FIV complète", west: "12 000 €", our: "4 500 €" },
                    { procedure: "Chirurgie esthétique faciale", west: "18 000 €", our: "6 500 €" }
                ],
                testimonial: {
                    quote: "L'économie réalisée sur mon opération m'a permis de prolonger mon séjour de deux semaines dans un resort 5 étoiles, tout en restant largement sous le budget prévu initialement.",
                    author: "Martine L., 58 ans, Paris"
                }
            }
        },
        {
            icon: <FaUserMd className="w-10 h-10" />,
            title: "Médecins Experts Internationaux",
            description: "Professionnels formés dans les meilleures universités (États-Unis, Allemagne, France) avec expérience internationale",
            stats: "85% parlent anglais/français",
            details: {
                headline: "Une équipe médicale d'élite internationale",
                description: "Nos médecins combinent formation dans les institutions les plus prestigieuses du monde et pratique internationale pour vous offrir une expertise médicale inégalée.",
                features: [
                    "Formation dans les universités du Top 50 mondial",
                    "Double certification (locale et internationale)",
                    "Publication régulière dans des revues scientifiques",
                    "Maîtrise de plusieurs langues européennes",
                    "Mise à jour constante via formations continues"
                ],
                specialties: [
                    "Chirurgie orthopédique", "Cardiologie interventionnelle",
                    "Procréation médicalement assistée", "Oncologie",
                    "Chirurgie plastique", "Neurochirurgie"
                ],
                testimonial: {
                    quote: "J'ai été impressionné par le niveau d'expertise de mon chirurgien qui avait exercé pendant 15 ans à Londres avant de revenir dans son pays natal.",
                    author: "Stefan B., Hambourg, Allemagne"
                }
            }
        },
        {
            icon: <FaShieldAlt className="w-10 h-10" />,
            title: "Sécurité et Confidentialité",
            description: "Protocoles stricts de protection des données médicales et environnement sécurisé pour les patients",
            stats: "Certification HIPAA",
            details: {
                headline: "Protection totale de votre confidentialité",
                description: "Votre sécurité physique et la confidentialité de vos données médicales sont nos priorités absolues, avec des protocoles alignés sur les standards internationaux.",
                features: [
                    "Protection des données conforme RGPD et HIPAA",
                    "Transfert sécurisé des dossiers médicaux",
                    "Hébergement dans des quartiers surveillés",
                    "Transport privé sécurisé",
                    "Assurance internationale incluse dans les forfaits"
                ],
                certifications: [
                    "ISO 27001 - Sécurité de l'information",
                    "SOC 2 Type II - Contrôles organisationnels",
                    "HITRUST CSF - Protection des données de santé"
                ],
                testimonial: {
                    quote: "La discrétion et le professionnalisme avec lesquels mon dossier a été traité m'ont pleinement rassuré sur la confidentialité de ma démarche médicale.",
                    author: "Anonyme, Cadre supérieur"
                }
            }
        },
        {
            icon: <FaPlane className="w-10 h-10" />,
            title: "Accessibilité Touristique",
            description: "Vols directs depuis les principales villes mondiales avec services VIP aéroportuaires inclus",
            stats: "25 aéroports internationaux",
            details: {
                headline: "Un voyage médical sans contraintes",
                description: "Notre destination est desservie par les principales compagnies aériennes avec des services VIP pour transformer votre parcours médical en expérience agréable.",
                features: [
                    "Vols directs depuis 120+ villes internationales",
                    "Fast-track immigration et douanes",
                    "Assistance VIP à l'aéroport",
                    "Transport privé climatisé",
                    "Coordination médicale pré-arrivée"
                ],
                flights: [
                    { from: "Paris", duration: "5h20", frequency: "12 vols hebdomadaires" },
                    { from: "Londres", duration: "6h10", frequency: "15 vols hebdomadaires" },
                    { from: "Bruxelles", duration: "5h45", frequency: "8 vols hebdomadaires" },
                    { from: "Genève", duration: "5h30", frequency: "6 vols hebdomadaires" }
                ],
                testimonial: {
                    quote: "De l'atterrissage à la clinique, tout s'est déroulé sans accroc. Un chauffeur nous attendait à la sortie de l'avion et a pris en charge tous les aspects logistiques.",
                    author: "Famille Dupont, Lyon"
                }
            }
        },
        {
            icon: <FaStar className="w-10 h-10" />,
            title: "Expérience Patient Premium",
            description: "Conciergerie médicale 24/7, transferts privés et hébergement 5* adapté aux besoins post-opératoires",
            stats: "98% de satisfaction",
            details: {
                headline: "Service d'excellence pour chaque patient",
                description: "Nous associons expertise médicale et hospitalité de luxe pour une expérience qui dépasse le simple cadre médical et vous offre une récupération optimale.",
                features: [
                    "Coordinateur personnel dédié 24/7",
                    "Hébergement 5 étoiles adapté aux besoins médicaux",
                    "Menu gastronomique personnalisé",
                    "Services de bien-être et récupération",
                    "Programmes de visites touristiques adaptés"
                ],
                accommodations: [
                    "Suites médicalisées de luxe",
                    "Villas privées avec personnel soignant",
                    "Résidences-services pour séjours prolongés",
                    "Hôtels 5* avec service médical"
                ],
                testimonial: {
                    quote: "Mon séjour s'est transformé en véritable parenthèse de bien-être. Je suis venue pour une intervention et j'ai vécu une expérience incroyable.",
                    author: "Catherine M., Marseille"
                }
            }
        }
    ];

    const medicalServices = [
        { id: 'cardio', name: 'Cardiologie', icon: '❤️' },
        { id: 'ortho', name: 'Orthopédie', icon: '🦴' },
        { id: 'plastic', name: 'Chirurgie Plastique', icon: '✨' },
        { id: 'fertility', name: 'Fertilité & FIV', icon: '👶' },
        { id: 'dental', name: 'Soins Dentaires', icon: '🦷' },
        { id: 'ophtalmo', name: 'Ophtalmologie', icon: '👁️' },
        { id: 'neuro', name: 'Neurologie', icon: '🧠' },
        { id: 'wellness', name: 'Bien-être & Spa Médical', icon: '💆' }
    ];

    const clinics = [
        { id: 'clinic1', name: 'Centre Médical International - Monaco' },
        { id: 'clinic2', name: 'Clinique Royale - Paris' },
        { id: 'clinic3', name: 'Swiss Medical Center - Genève' },
        { id: 'clinic4', name: 'Golden Coast Hospital - Cannes' },
        { id: 'clinic5', name: 'Premium Care Clinic - Barcelona' }
    ];

    const statsRef = useRef(null);
    const isInView = useInView(statsRef, { once: true, margin: "0px 0px -100px 0px" });
    const statsControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            statsControls.start("visible");
        }
    }, [isInView, statsControls]);

    // Animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.7,
                ease: "easeOut"
            }
        }
    };

    const statVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: i => ({
            opacity: 1,
            scale: 1,
            transition: {
                delay: i * 0.1,
                duration: 0.8,
                ease: "easeOut"
            }
        })
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300
            }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            transition: {
                duration: 0.3
            }
        }
    };

    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.3
            }
        }
    };

    const openModal = (advantage) => {
        setSelectedAdvantage(advantage);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedAdvantage(null);
        document.body.style.overflow = 'auto';
    };

    const openQuoteForm = () => {
        closeModal();
        setShowQuoteForm(true);
        document.body.style.overflow = 'hidden';
        // Initialize form data if previously open advantage information is relevant
        if (selectedAdvantage) {
            if (selectedAdvantage.title.includes('Médecins')) {
                setSelectedServices(['cardio']);
            } else if (selectedAdvantage.title.includes('Infrastructures')) {
                setFormData({...formData, preferredClinic: 'clinic1'});
            }
        }
    };

    const closeQuoteForm = () => {
        setShowQuoteForm(false);
        document.body.style.overflow = 'auto';
        // Reset form
        setFormStep(1);
        setFormSubmitted(false);
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            service: '',
            message: '',
            preferredDate: '',
            preferredClinic: ''
        });
        setSelectedServices([]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const toggleService = (serviceId) => {
        if (selectedServices.includes(serviceId)) {
            setSelectedServices(selectedServices.filter(id => id !== serviceId));
        } else {
            setSelectedServices([...selectedServices, serviceId]);
        }
    };

    const nextStep = () => {
        if (formStep < 3) {
            setFormStep(formStep + 1);
        }
    };

    const prevStep = () => {
        if (formStep > 1) {
            setFormStep(formStep - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the form data to your backend
        console.log("Form submitted:", { ...formData, services: selectedServices });
        // Show success message
        setFormSubmitted(true);
        // Reset form after 3 seconds and close modal
        setTimeout(() => {
            closeQuoteForm();
        }, 5000);
    };

    return (
        <section className="relative py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            {/* Éléments décoratifs premium */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50 to-transparent opacity-60"></div>
                <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-blue-100 filter blur-3xl opacity-30"></div>
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full bg-blue-100 filter blur-3xl opacity-30"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* En-tête élégant */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-center font-munika mb-28 max-w-3xl mx-auto"
                >
                    <span className="inline-block px-5 py-2 bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-100 text-blue-700 rounded-full text-sm font-munika tracking-wider mb-8 shadow-sm">
                        EXCELLENCE MÉDICALE INTERNATIONALE
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-munika mb-8 leading-tight">
                         <span className="text-transparent font-munika bg-clip-text bg-gradient-to-r from-blue-800 to-blue-800">Pourquoi Choisir Notre Destination</span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-500 mx-auto mb-8 rounded-full"></div>
                    <p className="text-base font-munika text-gray-600 leading-relaxed">
                        La combinaison parfaite entre expertise médicale de pointe, coûts avantageux et
                        expérience touristique inoubliable pour votre parcours de soins médicaux.
                    </p>
                </motion.div>

                {/* Grille d'avantages premium */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {advantages.map((advantage, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden backdrop-filter backdrop-blur-sm border border-gray-100 hover:border-blue-100 transition-all duration-500 cursor-pointer"
                            onClick={() => openModal(advantage)}
                        >
                            <div className="p-10 h-full flex flex-col">
                                <div className="mb-8">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-800 rounded-xl opacity-10 transform -rotate-3"></div>
                                        <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-50 rounded-xl text-blue-600 shadow-sm border border-blue-100 relative z-10">
                                            {advantage.icon}
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-munika text-gray-900 mb-4">{advantage.title}</h3>
                                <p className="text-gray-600 font-munika mb-8 flex-grow leading-relaxed">{advantage.description}</p>
                                <div className="flex flex-col space-y-4">
                                    <div className="flex items-center text-sm font-munika text-blue-700 bg-blue-50 rounded-full py-2 px-4 self-start">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                        {advantage.stats}
                                    </div>
                                    <div className="flex items-center justify-center w-full">
                                        <button className="group relative overflow-hidden px-6 py-2.5 bg-gradient-to-r from-blue-50 to-blue-50 hover:from-blue-100 hover:to-blue-100 rounded-full shadow-sm border border-blue-100 transition-all duration-300 hover:shadow-md">
                                            <span className="absolute inset-0 w-0 bg-gradient-to-r from-blue-500/10 to-blue-500/10 transition-all duration-500 ease-out group-hover:w-full"></span>
                                            <span className="flex items-center justify-center text-blue-700 font-munika text-sm relative z-10">
                                                En savoir plus
                                                <span className="ml-2 w-6 h-6 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 rounded-full text-white transition-transform duration-300 group-hover:translate-x-1">
                                                    <FaArrowRight className="w-3 h-3" />
                                                </span>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Modal pour les détails d'avantage */}
                <AnimatePresence>
                    {selectedAdvantage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
                            onClick={closeModal}
                        >
                            <motion.div
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header gradient */}
                                <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-3xl"></div>

                                <div className="relative p-8">
                                    <button
                                        onClick={closeModal}
                                        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                    >
                                        <FaTimes />
                                    </button>

                                    <div className="flex items-center mb-8">
                                        <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white mr-6">
                                            {selectedAdvantage.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-munika text-gray-900">{selectedAdvantage.title}</h3>
                                            <p className="text-blue-600 font-munika">{selectedAdvantage.stats}</p>
                                        </div>
                                    </div>

                                    <div className="mb-12">
                                        <h4 className="text-2xl font-munika mb-4 text-gray-900">{selectedAdvantage.details.headline}</h4>
                                        <p className="text-gray-700 mb-8 font-munika text-lg leading-relaxed">{selectedAdvantage.details.description}</p>

                                        {/* Features */}
                                        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                                            <h5 className="font-munika text-gray-900 mb-4">Caractéristiques principales</h5>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {selectedAdvantage.details.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-start">
                                                        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-green-100 rounded-full text-green-600 mt-0.5 mr-3">
                                                            <FaCheck className="w-3 h-3" />
                                                        </div>
                                                        <p className="text-gray-700 font-munika">{feature}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Dynamic content based on advantage type */}
                                        {selectedAdvantage.details.comparison && (
                                            <div className="mb-8">
                                                <h5 className="font-munika text-gray-900 mb-4">Comparatif de prix</h5>
                                                <div className="overflow-hidden rounded-xl border border-gray-200">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="px-6 py-4 text-left text-sm font-munika text-gray-500 uppercase tracking-wider">Procédure</th>
                                                                <th className="px-6 py-4 text-left text-sm font-munika text-gray-500 uppercase tracking-wider">Prix en Europe</th>
                                                                <th className="px-6 py-4 text-left text-sm font-munika text-gray-500 uppercase tracking-wider">Nos prix</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {selectedAdvantage.details.comparison.map((item, idx) => (
                                                                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                    <td className="px-6 py-4 text-sm font-munika text-gray-900">{item.procedure}</td>
                                                                    <td className="px-6 py-4 text-sm font-munika text-gray-900">{item.west}</td>
                                                                    <td className="px-6 py-4 text-sm text-green-600 font-munika">{item.our}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        {selectedAdvantage.details.specialties && (
                                            <div className="mb-8">
                                                <h5 className="font-munika text-gray-900 mb-4">Nos spécialités médicales</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedAdvantage.details.specialties.map((specialty, idx) => (
                                                        <span key={idx} className="inline-block bg-blue-50 text-blue-700 rounded-full px-4 py-2 text-sm font-munika">
                                                            {specialty}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {selectedAdvantage.details.certifications && (
                                            <div className="mb-8">
                                                <h5 className="font-munika text-gray-900 mb-4">Certifications internationales</h5>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {selectedAdvantage.details.certifications.map((cert, idx) => (
                                                        <div key={idx} className="bg-gray-50 rounded-lg p-4 text-center">
                                                            <p className="font-munika text-gray-900">{cert}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {selectedAdvantage.details.flights && (
                                            <div className="mb-8">
                                                <h5 className="font-munika text-gray-900 mb-4">Accessibilité aérienne</h5>
                                                <div className="overflow-hidden rounded-xl border border-gray-200">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="px-6 py-4 text-left text-sm font-munika text-gray-500 uppercase tracking-wider">Ville</th>
                                                                <th className="px-6 py-4 text-left text-sm font-munika text-gray-500 uppercase tracking-wider">Durée de vol</th>
                                                                <th className="px-6 py-4 text-left text-sm font-munika text-gray-500 uppercase tracking-wider">Fréquence</th>
</tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {selectedAdvantage.details.flights.map((flight, idx) => (
                                                                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                    <td className="px-6 py-4 text-sm font-munika text-gray-900">{flight.from}</td>
                                                                    <td className="px-6 py-4 text-sm font-munika text-gray-900">{flight.duration}</td>
                                                                    <td className="px-6 py-4 text-sm font-munika text-gray-900">{flight.frequency}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        {selectedAdvantage.details.accommodations && (
                                            <div className="mb-8">
                                                <h5 className="font-munika text-gray-900 mb-4">Options d'hébergement</h5>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {selectedAdvantage.details.accommodations.map((accommodation, idx) => (
                                                        <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                            <p className="font-munika text-gray-900">{accommodation}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Testimonial */}
                                        {selectedAdvantage.details.testimonial && (
                                            <div className="bg-blue-50 rounded-2xl p-8 mb-8 border border-blue-100">
                                                <div className="flex items-start">
                                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-5">
                                                        <FaUserCircle className="w-6 h-6 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="italic text-gray-700 font-munika mb-4">"{selectedAdvantage.details.testimonial.quote}"</p>
                                                        <p className="text-sm font-munika text-blue-700">— {selectedAdvantage.details.testimonial.author}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Call-to-action */}
                                    <div className="flex flex-wrap justify-center space-x-4">
                                        <button
                                            onClick={openQuoteForm}
                                            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-munika hover:shadow-lg transform transition duration-300 hover:-translate-y-1"
                                        >
                                            Obtenir un devis personnalisé
                                        </button>
                                        <button
                                            onClick={closeModal}
                                            className="px-8 py-3 bg-white border border-gray-200 text-gray-600 rounded-full font-munika hover:bg-gray-50 transition duration-300"
                                        >
                                            Revenir aux avantages
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Formulaire de demande de devis */}
                <AnimatePresence>
                    {showQuoteForm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4"
                            onClick={closeQuoteForm}
                        >
                            <motion.div
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header gradient */}
                                <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-3xl"></div>

                                <div className="relative p-8">
                                    <button
                                        onClick={closeQuoteForm}
                                        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                    >
                                        <FaTimes />
                                    </button>

                                    <div className="flex items-center mb-8">
                                        <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white mr-6">
                                            <FaCommentMedical className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-munika text-gray-900">Demande de devis personnalisé</h3>
                                            <p className="text-blue-600 font-munika">Recevez une proposition détaillée sous 48h</p>
                                        </div>
                                    </div>

                                    {formSubmitted ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.5 }}
                                            className="text-center py-12"
                                        >
                                            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                                                <FaCheck className="w-10 h-10" />
                                            </div>
                                            <h4 className="text-2xl font-munika text-gray-900 mb-4">Demande envoyée avec succès!</h4>
                                            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                                                Notre équipe médicale analysera votre demande et vous contactera dans les 48 heures avec une proposition détaillée adaptée à vos besoins.
                                            </p>
                                            <button
                                                onClick={closeQuoteForm}
                                                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-munika hover:shadow-lg"
                                            >
                                                Fermer
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit}>
                                            {/* Steps indicator */}
                                            <div className="flex items-center justify-between mb-12 px-4">
                                                {[1, 2, 3].map((step) => (
                                                    <div key={step} className="flex flex-col items-center relative">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-munika ${formStep >= step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                            {step}
                                                        </div>
                                                        <p className={`text-sm mt-2 font-munika ${formStep >= step ? 'text-blue-600' : 'text-gray-500'}`}>
                                                            {step === 1 ? 'Informations' : step === 2 ? 'Services' : 'Message'}
                                                        </p>
                                                        {step < 3 && (
                                                            <div className={`absolute top-5 left-full w-full h-0.5 -ml-5 ${formStep > step ? 'bg-blue-500' : 'bg-gray-200'}`} style={{ width: 'calc(100% - 2.5rem)' }}></div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Form steps */}
                                            <AnimatePresence mode="wait">
                                                {formStep === 1 && (
                                                    <motion.div
                                                        key="step-1"
                                                        variants={formVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        className="mb-8"
                                                    >
                                                        <h4 className="text-xl font-munika text-gray-900 mb-6">Vos informations personnelles</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div>
                                                                <label className="block text-sm font-munika text-gray-700 mb-2" htmlFor="fullName">
                                                                    <FaUserCircle className="inline-block mr-2 text-gray-500" />
                                                                    Nom complet
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="fullName"
                                                                    name="fullName"
                                                                    value={formData.fullName}
                                                                    onChange={handleInputChange}
                                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-munika text-gray-700 mb-2" htmlFor="email">
                                                                    <FaEnvelope className="inline-block mr-2 text-gray-500" />
                                                                    Email
                                                                </label>
                                                                <input
                                                                    type="email"
                                                                    id="email"
                                                                    name="email"
                                                                    value={formData.email}
                                                                    onChange={handleInputChange}
                                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-munika text-gray-700 mb-2" htmlFor="phone">
                                                                    <FaPhone className="inline-block mr-2 text-gray-500" />
                                                                    Téléphone
                                                                </label>
                                                                <input
                                                                    type="tel"
                                                                    id="phone"
                                                                    name="phone"
                                                                    value={formData.phone}
                                                                    onChange={handleInputChange}
                                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-munika text-gray-700 mb-2" htmlFor="preferredDate">
                                                                    <FaCalendarAlt className="inline-block mr-2 text-gray-500" />
                                                                    Date souhaitée (approximative)
                                                                </label>
                                                                <input
                                                                    type="date"
                                                                    id="preferredDate"
                                                                    name="preferredDate"
                                                                    value={formData.preferredDate}
                                                                    onChange={handleInputChange}
                                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                                />
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {formStep === 2 && (
                                                    <motion.div
                                                        key="step-2"
                                                        variants={formVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        className="mb-8"
                                                    >
                                                        <h4 className="text-xl font-munika text-gray-900 mb-6">Services médicaux souhaités</h4>
                                                        <div className="mb-8">
                                                            <p className="text-sm font-munika text-gray-600 mb-4">Sélectionnez un ou plusieurs services qui vous intéressent :</p>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                {medicalServices.map((service) => (
                                                                    <div
                                                                        key={service.id}
                                                                        className={`cursor-pointer rounded-xl p-4 border-2 flex flex-col items-center justify-center transition-all ${
                                                                            selectedServices.includes(service.id)
                                                                                ? 'border-blue-500 bg-blue-50'
                                                                                : 'border-gray-200 hover:border-blue-200'
                                                                        }`}
                                                                        onClick={() => toggleService(service.id)}
                                                                    >
                                                                        <div className="text-3xl mb-2">{service.icon}</div>
                                                                        <p className="text-sm font-munika text-center">{service.name}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-munika text-gray-700 mb-2" htmlFor="preferredClinic">
                                                                <FaHospital className="inline-block mr-2 text-gray-500" />
                                                                Clinique préférée (optionnel)
                                                            </label>
                                                            <select
                                                                id="preferredClinic"
                                                                name="preferredClinic"
                                                                value={formData.preferredClinic}
                                                                onChange={handleInputChange}
                                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                            >
                                                                <option value="">Sélectionnez une clinique (optionnel)</option>
                                                                {clinics.map((clinic) => (
                                                                    <option key={clinic.id} value={clinic.id}>
                                                                        {clinic.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {formStep === 3 && (
                                                    <motion.div
                                                        key="step-3"
                                                        variants={formVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        className="mb-8"
                                                    >
                                                        <h4 className="text-xl font-munika text-gray-900 mb-6">Informations complémentaires</h4>
                                                        <div className="mb-6">
                                                            <label className="block text-sm font-munika text-gray-700 mb-2" htmlFor="message">
                                                                <FaCommentMedical className="inline-block mr-2 text-gray-500" />
                                                                Message (détails médicaux, questions, besoins spécifiques)
                                                            </label>
                                                            <textarea
                                                                id="message"
                                                                name="message"
                                                                value={formData.message}
                                                                onChange={handleInputChange}
                                                                rows="6"
                                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                                placeholder="Veuillez préciser vos besoins médicaux, questions ou toute information utile pour préparer votre devis personnalisé..."
                                                            ></textarea>
                                                        </div>

                                                        <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-100">
                                                            <h5 className="font-munika text-gray-900 mb-4 flex items-center">
                                                                <FaShieldAlt className="mr-2 text-blue-500" />
                                                                Confidentialité garantie
                                                            </h5>
                                                            <p className="text-sm font-munika text-gray-600">
                                                                Toutes les informations médicales que vous nous communiquez sont traitées avec la plus stricte confidentialité, conformément aux normes RGPD et HIPAA. Vos données ne seront jamais partagées avec des tiers non autorisés.
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Navigation buttons */}
                                            <div className="flex justify-between mt-12">
                                                {formStep > 1 ? (
                                                    <button
                                                        type="button"
                                                        onClick={prevStep}
                                                        className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-full font-munika hover:bg-gray-50 transition-colors flex items-center"
                                                    >
                                                        <span className="transform rotate-180 mr-2">
                                                            <FaArrowRight className="w-4 h-4" />
                                                        </span>
                                                        Précédent
                                                    </button>
                                                ) : (
                                                    <div></div>
                                                )}

                                                {formStep < 3 ? (
                                                    <button
                                                        type="button"
                                                        onClick={nextStep}
                                                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-munika hover:shadow-md transition-shadow flex items-center"
                                                    >
                                                        Suivant
                                                        <FaArrowRight className="ml-2 w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="submit"
                                                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-munika hover:shadow-lg transform transition duration-300 hover:-translate-y-1"
                                                    >
                                                        Envoyer ma demande
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Section de statistiques */}
                <motion.div 
                    ref={statsRef}
                    variants={containerVariants}
                    initial="hidden"
                    animate={statsControls}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-28 mb-16"
                >
                    {[
                        { number: "15+", label: "années d'expérience", delay: 0 },
                        { number: "98%", label: "taux de satisfaction", delay: 1 },
                        { number: "65K+", label: "patients internationaux", delay: 2 },
                        { number: "45%", label: "d'économie moyenne", delay: 3 }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            custom={stat.delay}
                            variants={statVariants}
                            className="bg-white rounded-2xl p-8 text-center shadow-xl border border-gray-100"
                        >
                            <h3 className="text-3xl md:text-4xl font-munika font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500 mb-2">{stat.number}</h3>
                            <p className="text-gray-600 font-munika">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Call-to-action */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <h3 className="text-2xl md:text-3xl font-munika text-gray-900 mb-6">Prêt à transformer votre parcours médical en expérience exceptionnelle ?</h3>
                    <button
                        onClick={() => setShowQuoteForm(true)}
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-munika hover:shadow-xl transform transition duration-300 hover:-translate-y-1 text-lg"
                    >
                        Obtenir un devis personnalisé
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default WhyChooseUs;