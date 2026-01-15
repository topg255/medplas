"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  IconArrowRight,
  IconX,
  IconShieldCheck,
  IconStethoscope,
  IconPhoneCall,
  IconCalendar,
  IconStarFilled,
  IconHeartbeat,
  IconDental,
  IconBone,
  IconDna2,
  IconMedicalCross,
  IconMapPin,
  IconClipboardList,
  IconBeach,
  IconVideo,
  IconHotelService,
  IconPlaneDeparture,
  IconLanguage,
  IconCurrencyDollar,
  Icon24Hours,
  IconCertificate,
} from "@tabler/icons-react";
import Image1 from "../assets/ksar.jpg";
import Image2 from "../assets/tozeur.jpg";
import Image3 from "../assets/sousse.jpg";
import Image4 from "../assets/bousid.jpg";
import Image5 from "../assets/desert.jpg";
import Image6 from "../assets/sidi.jpg";
import V from "../assets/vic.mp4";
import V1 from "../assets/pp.mp4";
import V2 from "../assets/ltt.mp4";
import V3 from "../assets/ht.mp4";

export const EliteMedicalTravelCard = () => {
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const containerRef = useRef(null);

  // Handle scroll when modals are open
  useEffect(() => {
    if (showModal || showImageModal || showHowItWorksModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal, showImageModal, showHowItWorksModal]);

  // 3D effect with Framer Motion
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [2, -2]);
  const rotateY = useTransform(x, [-100, 100], [-2, 2]);

  // Structured data
  const medicalProcess = [
    { 
      title: "Virtual Evaluation", 
      description: "Consultation with international specialists", 
      icon: <IconPhoneCall className="text-green-600" /> 
    },
    { 
      title: "Personalized Treatment Plan", 
      description: "Custom medical program", 
      icon: <IconStethoscope className="text-green-600" /> 
    },
    { 
      title: "Hassle-free Logistics", 
      description: "Travel and accommodation organization", 
      icon: <IconPlaneDeparture className="text-green-600" /> 
    },
    { 
      title: "Premium Care", 
      description: "Medical follow-up and luxury recovery", 
      icon: <IconShieldCheck className="text-green-600" /> 
    },
  ];

  const specialties = [
    { name: "Cardiology", icon: <IconHeartbeat />, description: "Advanced cardiac care" },
    { name: "Fertility", icon: <IconDna2 />, description: "Advanced reproduction solutions" },
    { name: "Orthopedics", icon: <IconBone />, description: "Joint and bone surgery" },
    { name: "Aesthetic Medicine", icon: <IconMedicalCross />, description: "Premium aesthetic treatments" },
    { name: "Dentistry", icon: <IconDental />, description: "High-end dental care" },
    { name: "Oncology", icon: <IconStethoscope />, description: "Innovative cancer treatments" },
  ];

  const medicalImages = [
    { id: 1, src: Image1, title: "El Jem Amphitheatre", location: "Al Jam" },
    { id: 2, src: Image2, title: "Traditional Hammem", location: "Tozeur" },
    { id: 3, src: Image3, title: "Boujaafer beach", location: "Sousse" },
    { id: 4, src: Image4, title: "Dolce Vita coffee", location: "Sidi Bou Said" },
    { id: 5, src: Image5, title: "Magnificent Desert", location: "Djerba" },
    { id: 6, src: Image6, title: "Street view", location: "Tunis" },
  ];

  const advantages = [
    { icon: <IconCurrencyDollar />, text: "Savings up to 70% compared to Europe" },
    { icon: <IconCertificate />, text: "International certifications (ISO)" },
    { icon: <Icon24Hours />, text: "24/7 assistance in French and English" },
    { icon: <IconHotelService />, text: "Luxury accommodation included" },
    { icon: <IconLanguage />, text: "French-speaking medical staff" },
    { icon: <IconMapPin />, text: "Proximity to tourist sites" },
  ];

  const timelineSteps = [
    {
      title: "Step 1: Initial Consultation",
      description: "Remote medical evaluation with our specialists via secure platform.",
      tourismLink: "Enjoy our advisory service to plan your tourist activities.",
      icon: <IconVideo className="w-6 h-6 text-white" />,
      tourismIcon: <IconMapPin className="w-5 h-5 text-amber-500" />,
      video: V
    },
    {
      title: "Step 2: Personalized Plan",
      description: "Detailed proposal including treatment, accommodation and tourist options.",
      tourismLink: "Discover our packages combining care and cultural visits.",
      icon: <IconClipboardList className="w-6 h-6 text-white" />,
      tourismIcon: <IconBeach className="w-5 h-5 text-green-500" />,
      video: V1
    },
    {
      title: "Step 3: Travel Organization",
      description: "Complete handling: flights, transfers, accommodation and interpretation.",
      tourismLink: "Customizable excursion options according to your medical program.",
      icon: <IconPlaneDeparture className="w-6 h-6 text-white" />,
      tourismIcon: <IconHotelService className="w-5 h-5 text-green-500" />,
      video: V2
    },
    {
      title: "Step 4: Medical & Tourist Stay",
      description: "Treatment in our certified partner centers and luxury convalescence period.",
      tourismLink: "Wellness programs and visits adapted to your health condition.",
      icon: <IconShieldCheck className="w-6 h-6 text-white" />,
      tourismIcon: <IconMedicalCross className="w-5 h-5 text-red-500" />,
      video: V3
    }
  ];

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 min-h-screen py-20 font-munika relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full"
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              repeatDelay: Math.random() * 5,
              ease: "easeInOut"
            }}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
          />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#f8fbff,transparent_70%)]"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6">
        <motion.div
          ref={containerRef}
          className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto"
          onMouseMove={handleMouseMove}
          style={{ rotateX, rotateY }}
        >
          {/* Image Gallery Section */}
          <div className="grid grid-cols-2 gap-4">
            {medicalImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="relative rounded-2xl overflow-hidden group border border-green-100 cursor-pointer shadow-md hover:shadow-xl transition-all"
                whileHover={{ scale: 1.03, zIndex: 10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent flex flex-col justify-end p-4"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-white font-munika">{image.title}</h3>
                  <p className="text-sm text-green-200 font-munika">{image.location}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Main Content Section */}
          <div className="space-y-8">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-semibold tracking-wider uppercase text-green-800 shadow-sm font-munika">
                <IconStarFilled className="w-4 h-4 text-amber-400" /> Medical-Tourism Excellence
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 font-munika">
                <span className="bg-gradient-to-r from-green-800 to-green-800 bg-clip-text text-transparent">
                  Premium Medical Care <br />in Tunisia
                </span>
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed font-munika">
                Combine high-tech medical treatments with an exceptional tourist stay in certified facilities at competitive prices.
              </p>
            </div>

            {/* Key advantages */}
            <div className="grid grid-cols-2 gap-4">
              {advantages.slice(0, 4).map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-white rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all font-munika"
                  whileHover={{ y: -2 }}
                >
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    {item.icon}
                  </div>
                  <p className="text-sm font-medium text-gray-700">{item.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Medical Process */}
            <div className="space-y-4">
              {medicalProcess.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-green-100 hover:bg-green-50 transition-colors shadow-sm font-munika"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex-shrink-0 p-3 bg-green-100 rounded-xl text-green-600">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Call to actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              
              <motion.button
                className="flex-1 px-6 py-3 bg-white text-green-600 border border-green-200 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 font-munika"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowHowItWorksModal(true)}
              >
                <IconClipboardList size={20} />
                Our Process
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Consultation Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative font-munika"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
              >
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close modal"
                >
                  <IconX size={24} className="text-gray-500" />
                </button>

                <div className="grid md:grid-cols-2 divide-x divide-gray-200">
                  <div className="p-8 space-y-6 bg-gradient-to-br from-green-700 to-green-800 text-white">
                    <h3 className="text-2xl font-bold font-munika">
                      Your Medical Project in Tunisia
                    </h3>
                    <p className="text-green-100 text-sm leading-relaxed font-munika">
                      Our medical advisors assist you in the complete organization of your stay, from diagnosis to return.
                    </p>
                    <div className="space-y-4 font-munika">
                      <div className="flex items-center gap-4">
                        <IconShieldCheck className="flex-shrink-0 text-green-200" />
                        <span className="text-sm">JCI and ISO certified facilities</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <IconPhoneCall className="flex-shrink-0 text-green-200" />
                        <span className="text-sm">24/7 assistance in French</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <IconCurrencyDollar className="flex-shrink-0 text-green-200" />
                        <span className="text-sm">Personalized quote with no obligation</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-green-600">
                      <h4 className="font-semibold mb-2 font-munika">Our Specialties</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {specialties.slice(0, 4).map((spec, i) => (
                          <div key={i} className="flex items-center gap-2 font-munika">
                            <span className="text-green-300">{spec.icon}</span>
                            <span className="text-xs">{spec.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 font-munika">Consultation Request</h3>
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 font-munika">Full Name</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-munika"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 font-munika">Email</label>
                          <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-munika"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 font-munika">Phone</label>
                        <input
                          type="tel"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-munika"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 font-munika">Medical Specialty</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0YjU1NjMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJtNiA5IDYgNiA2LTYiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_1rem] font-munika">
                          <option value="">Select a specialty</option>
                          {specialties.map((specialty, index) => (
                            <option key={index} value={specialty.name}>{specialty.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 font-munika">Your Message</label>
                        <textarea
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-munika"
                          placeholder="Describe your medical needs and tourist preferences"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all font-munika"
                      >
                        Send Request
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Our Process Modal */}
        <AnimatePresence>
          {showHowItWorksModal && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl font-munika"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
              >
                <button
                  onClick={() => setShowHowItWorksModal(false)}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close modal"
                >
                  <IconX size={24} className="text-gray-500" />
                </button>

                <div className="p-8 bg-gradient-to-br from-green-50 to-white">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2 font-munika">
                      <span className="bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
                        Your Medical-Touristic Journey
                      </span>
                    </h3>
                    <p className="text-gray-600 max-w-2xl mx-auto font-munika">
                      Discover how we combine medical excellence and tourist experience for an optimal stay in Tunisia.
                    </p>
                  </div>

                  {/* Enhanced timeline */}
                  <div className="relative space-y-8">
                    {timelineSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        className="flex flex-col md:flex-row gap-6 relative font-munika"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.15 }}
                      >
                        {/* Timeline line */}
                        {index < timelineSteps.length - 1 && (
                          <div className="absolute left-6 top-14 h-[calc(100%-40px)] w-0.5 bg-green-200 hidden md:block"></div>
                        )}

                        {/* Timeline point */}
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-full flex items-center justify-center shadow-md">
                          {step.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 bg-white p-6 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all">
                          <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-xl font-semibold text-gray-900">{step.title}</h4>
                              </div>
                              <p className="text-gray-700 mb-3">{step.description}</p>
                              <div className="flex items-start gap-2 bg-green-50 p-3 rounded-lg">
                                <span className="text-green-600 mt-0.5">{step.tourismIcon}</span>
                                <p className="text-sm text-green-700">{step.tourismLink}</p>
                              </div>
                            </div>
                            <div className="w-full lg:w-64 flex-shrink-0 rounded-lg overflow-hidden border border-green-200 shadow-sm">
                              <video
                                src={step.video}
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-12 text-center">
                    <motion.button
                      className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all font-munika"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowHowItWorksModal(false);
                        setShowModal(true);
                      }}
                    >
                      Start Your Project
                      <IconArrowRight className="ml-2" size={20} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};