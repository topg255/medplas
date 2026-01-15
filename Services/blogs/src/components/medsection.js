import React, { useState } from 'react';
import { FaClinicMedical, FaTooth, FaProcedures, FaBaby, FaHeartbeat, FaEye, FaArrowRight, FaTimes, FaDownload, FaCalendarAlt } from 'react-icons/fa';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import CosmeticSurgeryImg from '../assets/cosmetic.jpg';
import DentalTourismImg from '../assets/dentsur.jpg';
import FertilityImg from '../assets/fertility.jpg';
import CardiacImg from '../assets/C1.jpg';
import VisionImg from '../assets/b1.jpg';
import OrthopedicImg from '../assets/ortho.jpg';

export const MedicalTreatmentsSection = () => {
    const sectionRef = useRef();
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const [activeTreatment, setActiveTreatment] = useState(1);
    const [hoveredTreatment, setHoveredTreatment] = useState(null);
    const [selectedTreatment, setSelectedTreatment] = useState(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        message: ''
    });

    const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
    const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
    const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

    const treatments = [
        {
            id: 1,
            title: "Cosmetic Surgery",
            icon: <FaProcedures className="text-3xl text-purple-500" />,
            description: "Discover the latest advancements in cosmetic procedures from top clinics worldwide.",
            longDescription: "Our cosmetic surgery treatments are performed by board-certified surgeons using the most advanced techniques. From facelifts to body contouring, we offer a full range of procedures to help you achieve your aesthetic goals. Our clinics maintain the highest safety standards and use cutting-edge technology to ensure natural-looking results with minimal downtime.",
            stats: "1.2M+ Procedures Yearly",
            image: CosmeticSurgeryImg,
            overlayText: {
                title: "Transform Your Look",
                description: "Safe and effective cosmetic procedures with natural results"
            },
            benefits: [
                "Board-certified surgeons",
                "Minimal downtime procedures",
                "Natural-looking results",
                "Personalized treatment plans",
                "International accreditation",
                "Comprehensive aftercare"
            ],
            procedureDetails: {
                time: "1-3 hours",
                recovery: "2-4 weeks",
                results: "Permanent to 10+ years",
                anesthesia: "General or Local"
            },
            zIndex: 30,
            rotation: -3,
            position: "right-20 top-40"
        },
        {
            id: 2,
            title: "Dental Tourism",
            icon: <FaTooth className="text-3xl text-cyan-500" />,
            description: "High-quality dental care at affordable prices with vacation opportunities.",
            longDescription: "Combine your dental treatment with a relaxing vacation in world-class destinations. Our dental tourism packages include everything from dental implants to smile makeovers, performed by internationally-trained dentists using premium materials. Enjoy significant cost savings without compromising on quality, while experiencing the culture and beauty of our partner locations.",
            stats: "60% Cost Savings",
            image: DentalTourismImg,
            overlayText: {
                title: "Perfect Smile Getaway",
                description: "Combine dental care with a relaxing vacation"
            },
            benefits: [
                "60-70% cost savings",
                "Vacation packages included",
                "Premium dental materials",
                "English-speaking staff",
                "Airport transfers",
                "Luxury accommodations"
            ],
            procedureDetails: {
                time: "Varies by treatment",
                recovery: "Minimal to none",
                results: "5-15 years",
                anesthesia: "Local"
            },
            zIndex: 20,
            rotation: 0,
            position: "right-10 top-20"
        },
        {
            id: 3,
            title: "Fertility Treatments",
            icon: <FaBaby className="text-3xl text-indigo-500" />,
            description: "World-class IVF and reproductive technologies with high success rates.",
            longDescription: "Our fertility clinics offer cutting-edge reproductive technologies with some of the highest success rates globally. From IVF to egg freezing and genetic screening, we provide comprehensive fertility solutions tailored to your needs. Our team of reproductive endocrinologists and embryologists will guide you through every step of your journey with compassion and expertise.",
            stats: "75% Success Rate",
            image: FertilityImg,
            overlayText: {
                title: "Start Your Family Journey",
                description: "Advanced fertility treatments with personalized care"
            },
            benefits: [
                "High success rates",
                "Genetic screening",
                "Egg freezing",
                "Donor programs",
                "Comprehensive testing",
                "Personalized protocols"
            ],
            procedureDetails: {
                time: "2-3 weeks per cycle",
                recovery: "1-2 days",
                results: "Varies",
                anesthesia: "Sedation"
            },
            zIndex: 10,
            rotation: 3,
            position: "right-0 top-0"
        }
    ];

    const featuredTreatments = [
        {
            id: 4,
            title: "Cardiac Surgery",
            icon: <FaHeartbeat className="text-3xl text-red-500" />,
            description: "Advanced heart procedures performed by internationally-trained specialists.",
            stats: "98% Patient Satisfaction",
            image: CardiacImg,
            color: "from-red-500 to-transparent"
        },
        {
            id: 5,
            title: "Vision Correction",
            icon: <FaEye className="text-3xl text-green-500" />,
            description: "LASIK, PRK and other vision procedures with cutting-edge technology.",
            stats: "30min Procedures",
            image: VisionImg,
            color: "from-green-500 to-transparent"
        },
        {
            id: 6,
            title: "Orthopedic Care",
            icon: <FaClinicMedical className="text-3xl text-amber-500" />,
            description: "Joint replacements and sports medicine from world-renowned surgeons.",
            stats: "10k+ Joint Replacements",
            image: OrthopedicImg,
            color: "from-amber-500 to-transparent"
        }
    ];

    const currentTreatment = treatments.find(t => t.id === activeTreatment) || treatments[0];

    const handleDownloadBrochure = () => {
        // Simulation de téléchargement
        console.log(`Downloading brochure for ${selectedTreatment.title}`);
        // En production, remplacez par un lien réel vers votre PDF
        const link = document.createElement('a');
        link.href = '#';
        link.download = `${selectedTreatment.title.replace(/\s+/g, '_')}_brochure.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Ajoutez ici un suivi analytique si nécessaire
        // trackDownload(selectedTreatment.id);
    };

    const handleBookConsultation = () => {
        setShowBookingForm(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Ici vous ajouteriez votre logique d'envoi au backend
        alert(`Thank you, ${formData.name}! Your consultation request for ${selectedTreatment.title} has been received. We'll contact you shortly.`);
        setShowBookingForm(false);
        setFormData({
            name: '',
            email: '',
            phone: '',
            date: '',
            message: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const closeTreatmentDetail = () => {
        setSelectedTreatment(null);
        setShowBookingForm(false);
    };

    return (
        <>
            <section ref={sectionRef} className="relative py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white z-0"></div>

                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-100 rounded-full filter blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mb-20">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-6"
                        >
                            GLOBAL MEDICAL EXCELLENCE
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                        >
                            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">World-Class</span> Medical Treatments
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-xl text-gray-600"
                        >
                            Premium healthcare solutions combining cutting-edge technology with internationally-accredited specialists
                        </motion.p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Left Column - Treatment Cards */}
                        <div className="lg:w-1/2 space-y-8">
                            {treatments.map((treatment) => (
                                <motion.div
                                    key={treatment.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 ${activeTreatment === treatment.id ? 'ring-2 ring-blue-500 scale-[1.02]' : ''}`}
                                    onClick={() => setActiveTreatment(treatment.id)}
                                    onMouseEnter={() => setHoveredTreatment(treatment.id)}
                                    onMouseLeave={() => setHoveredTreatment(null)}
                                >
                                    <div className="p-8 flex flex-col md:flex-row items-start cursor-pointer">
                                        <div className={`w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-r ${treatment.color} text-white mb-6 md:mb-0 md:mr-6`}>
                                            {treatment.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{treatment.title}</h3>
                                            <p className="text-gray-600 mb-4">{treatment.description}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                                    {treatment.stats}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedTreatment(treatment);
                                                    }}
                                                    className="text-blue-600 font-medium flex items-center group"
                                                >
                                                    Read more
                                                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Right Column - Stacked Images with Smart Interaction */}
                        <div className="lg:w-1/2 relative hidden lg:block h-[500px]">
                            {treatments.map((treatment) => {
                                const isActive = activeTreatment === treatment.id;
                                const isHovered = hoveredTreatment === treatment.id;
                                const isBehind = !isActive && !isHovered;

                                return (
                                    <motion.div
                                        key={treatment.id}
                                        style={{
                                            y: isActive ? 0 : isHovered ? -10 : 0,
                                            zIndex: isActive ? 40 : isHovered ? 35 : treatment.zIndex,
                                            rotate: isActive ? 0 : treatment.rotation
                                        }}
                                        animate={{
                                            x: isActive ? '0%' : isHovered ? '5%' : '0%',
                                            scale: isActive ? 1 : isHovered ? 1.05 : 0.95,
                                            opacity: isBehind ? 0.7 : 1
                                        }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        className={`absolute ${treatment.position} w-4/5 rounded-2xl overflow-hidden shadow-2xl cursor-pointer transition-all duration-300 ${isActive ? 'ring-4 ring-blue-400' : ''}`}
                                        onClick={() => setActiveTreatment(treatment.id)}
                                        onMouseEnter={() => setHoveredTreatment(treatment.id)}
                                        onMouseLeave={() => setHoveredTreatment(null)}
                                    >
                                        <div className="aspect-w-16 aspect-h-9">
                                            <img
                                                src={treatment.image}
                                                alt={treatment.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className={`absolute inset-0 bg-gradient-to-t ${treatment.color} opacity-10`}></div>
                                            <div className="absolute bottom-0 left-0 p-6 text-white">
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Featured Treatments Grid */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {featuredTreatments.map((treatment) => (
                            <motion.div
                                key={treatment.id}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 group"
                            >
                                <div className="relative overflow-hidden h-64">
                                    <img
                                        src={treatment.image}
                                        alt={treatment.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-t ${treatment.color} opacity-40`}></div>
                                    <div className="absolute top-4 left-4">
                                        <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-white text-${treatment.color.split(' ')[1]}`}>
                                            {treatment.icon}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 p-6 text-white">
                                        <h3 className="text-xl font-bold mb-2">{treatment.title}</h3>
                                        <p className="text-sm">{treatment.description}</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                            {treatment.stats}
                                        </span>
                                        <button
                                            onClick={() => setSelectedTreatment(treatment)}
                                            className="text-blue-600 font-medium flex items-center group"
                                        >
                                            Explore
                                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA */}
                    
                </div>
            </section>

            {/* Treatment Detail Modal */}
            {selectedTreatment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                        onClick={closeTreatmentDetail}
                    ></div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header avec image */}
                        <div className="relative h-48">
                            <img
                                src={selectedTreatment.image}
                                alt={selectedTreatment.title}
                                className="w-full h-full object-cover"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-r ${selectedTreatment.color} opacity-60`}></div>

                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={closeTreatmentDetail}
                                    className="p-2 rounded-full bg-white text-gray-800 hover:bg-gray-100 transition-all"
                                >
                                    <FaTimes className="text-xl" />
                                </button>
                            </div>

                            <div className="absolute bottom-0 left-0 p-6">
                                <h2 className="text-3xl font-bold text-white">{selectedTreatment.title}</h2>
                                <p className="text-white opacity-90">{selectedTreatment.overlayText?.description}</p>
                            </div>
                        </div>

                        {/* Contenu scrollable */}
                        <div className="overflow-y-auto flex-1">
                            {showBookingForm ? (
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Book a Consultation for {selectedTreatment.title}</h3>
                                    <form onSubmit={handleFormSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email Address *
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Preferred Date *
                                                </label>
                                                <input
                                                    type="date"
                                                    id="date"
                                                    name="date"
                                                    value={formData.date}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-6">
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                                Additional Information
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                rows="4"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Any specific requests or medical conditions we should know about?"
                                            ></textarea>
                                        </div>
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowBookingForm(false)}
                                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                Back to Details
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center"
                                            >
                                                <FaCalendarAlt className="mr-2" />
                                                Submit Request
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="p-6 md:p-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Colonne principale */}
                                        <div className="lg:col-span-2">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">About the Treatment</h3>
                                            <p className="text-gray-700 mb-6">
                                                {selectedTreatment.longDescription}
                                            </p>

                                            <div className="mb-8">
                                                <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Benefits</h4>
                                                <ul className="space-y-3">
                                                    {selectedTreatment.benefits?.map((benefit, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <span className="flex-shrink-0 h-5 w-5 text-blue-500 mr-3 mt-0.5">
                                                                <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                            </span>
                                                            <span className="text-gray-700">{benefit}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="bg-blue-50 rounded-xl p-6">
                                                <h4 className="text-xl font-semibold text-gray-900 mb-4">Why Choose Our {selectedTreatment.title} Services?</h4>
                                                <p className="text-gray-700 mb-4">
                                                    Our clinic specializes in this procedure with a team of internationally recognized experts. We combine the latest technology with personalized care to deliver exceptional results.
                                                </p>
                                                <div className="flex flex-wrap gap-4">
                                                    <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-blue-600">
                                                        {selectedTreatment.stats}
                                                    </span>
                                                    <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-blue-600">
                                                        98% Satisfaction Rate
                                                    </span>
                                                    <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-blue-600">
                                                        Accredited Facilities
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sidebar */}
                                        <div className="lg:col-span-1">
                                            <div className="bg-gray-50 rounded-xl p-6 sticky top-0">
                                                <h4 className="text-xl font-semibold text-gray-900 mb-4">Treatment Details</h4>

                                                <div className="space-y-4">
                                                    <div>
                                                        <h5 className="text-sm font-medium text-gray-500">Procedure Time</h5>
                                                        <p className="text-gray-900 font-medium">{selectedTreatment.procedureDetails.time}</p>
                                                    </div>

                                                    <div>
                                                        <h5 className="text-sm font-medium text-gray-500">Recovery Time</h5>
                                                        <p className="text-gray-900 font-medium">{selectedTreatment.procedureDetails.recovery}</p>
                                                    </div>

                                                    <div>
                                                        <h5 className="text-sm font-medium text-gray-500">Results Duration</h5>
                                                        <p className="text-gray-900 font-medium">{selectedTreatment.procedureDetails.results}</p>
                                                    </div>

                                                    <div>
                                                        <h5 className="text-sm font-medium text-gray-500">Anesthesia</h5>
                                                        <p className="text-gray-900 font-medium">{selectedTreatment.procedureDetails.anesthesia}</p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={handleBookConsultation}
                                                    className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center justify-center"
                                                >
                                                    <FaCalendarAlt className="mr-2" />
                                                    Book a Consultation
                                                </button>

                                                <button
                                                    onClick={handleDownloadBrochure}
                                                    className="mt-4 w-full border border-blue-600 text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
                                                >
                                                    <FaDownload className="mr-2" />
                                                    Download Brochure
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer - Seulement visible quand on n'est pas dans le formulaire */}
                        {!showBookingForm && (
                            <div className="border-t border-gray-200 p-4 bg-gray-50">
                                <div className="flex justify-center">
                                    <span className="text-sm text-gray-500">
                                        {selectedTreatment.stats} • 98% Patient Satisfaction • Internationally Accredited
                                    </span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </>
    );
};

export default MedicalTreatmentsSection;