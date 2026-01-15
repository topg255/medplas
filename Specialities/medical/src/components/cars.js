"use client";
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconX,
  IconMicroscope,
  IconEgg,
  IconDna2,
  IconFlask,
  IconChartLine,
  IconArrowRight,
  IconHeartbeat,
  IconMapPin,
  IconStar,
  IconCertificate,
  IconCurrencyDollar,
  IconPlaneDeparture,
  IconPhoneCall,
  IconUser,
  IconMail,
  IconCalendar,
  IconMedicalCross ,
  IconClipboard,
  IconHotel
} from '@tabler/icons-react';

// Assets
import MedicalTeam from '../assets/expertise.jpg';
import HospitalFacility from '../assets/tech.jpg';
import PatientCare from '../assets/luxe.jpg';
import TunisiaLandscape from '../assets/med.jpg';
import HospitalVideo from '../assets/tourismh.mp4';

const ADVANTAGES = [
  {
    title: "International Medical Expertise",
    description: "Specialists trained in global best practices",
    image: MedicalTeam,
    details: "Tunisia has over 5000 specialist doctors trained in top European and North American universities. Our professionals maintain among the highest success rates worldwide in various medical specialties.",
    icon: <IconCertificate className="w-6 h-6 text-green-500" />,
    stats: [
      { label: "Specialists", value: "5000+" }
    ],
    benefits: [
      "Mandatory continuing education",
      "French and English speaking doctors",
      "International medical protocols",
      "Collaborations with European centers"
    ]
  },
  {
    title: "Cutting-edge Medical Technologies",
    description: "State-of-the-art equipment in modern facilities",
    image: HospitalFacility,
    details: "Our medical centers are equipped with the most advanced technologies: robotic surgery, 3D imaging, diagnostic AI. The facilities rival the best European centers at much more affordable costs.",
    icon: <IconMicroscope className="w-6 h-6 text-green-500" />,
    stats: [
      { label: "Technology", value: "100%" },
      { label: "Equipment age", value: "<3 years" }
    ],
    benefits: [
      "High-tech operating rooms",
      "Advanced sterilization systems",
      "CAP certified laboratories",
      "Individual recovery rooms"
    ]
  },
  {
    title: "Comprehensive Care",
    description: "Personalized support from A to Z",
    image: PatientCare,
    details: "From initial consultation to post-operative follow-up, we offer complete services including medical coordination, interpretation, luxury accommodation and cultural activities. Our patient satisfaction rate exceeds 98%.",
    icon: <IconStar className="w-6 h-6 text-green-500" />,
    stats: [
      { label: "Satisfaction", value: "98%" },
      { label: "Languages", value: "8+" }
    ],
    benefits: [
      "Dedicated patient coordinators",
      "All-inclusive packages",
      "Reduced waiting times",
      "Remote post-treatment follow-up"
    ]
  },
  {
    title: "Ideal Recovery Destination",
    description: "Convalescence in an exceptional Mediterranean setting",
    highlight: "UNESCO Sites",
    image: TunisiaLandscape,
    details: "Combine your medical treatment with recovery in our seaside resorts or historical sites. Benefit from the Mediterranean climate, thalassotherapy centers and UNESCO cultural sites while under medical supervision.",
    icon: <IconMapPin className="w-6 h-6 text-green-500" />,
    stats: [
      { label: "Coastline", value: "2,290 km" },
      { label: "Cultural sites", value: "9 UNESCO" }
    ],
    benefits: [
      "High-end rehabilitation centers",
      "Partner spa-hotels",
      "Custom wellness programs",
      "Adapted cultural excursions"
    ]
  }
];

export const MedicalTourism = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false); // Nouvel état pour la modale de devis

  const currentItem = ADVANTAGES[currentStage];

  const goToStage = useCallback((index) => {
    setCurrentStage(index);
  }, []);

  const toggleModal = useCallback(() => {
    setIsModalOpen(prev => !prev);
  }, []);

  const toggleQuoteModal = useCallback(() => {
    setIsQuoteModalOpen(prev => !prev);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white py-20 font-munika">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-100/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-100/20 rounded-full filter blur-3xl"></div>
      </div>

      {/* Professional Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={toggleModal}
            />

            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <motion.div
                className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-100"
                layoutId={`modal-${currentStage}`}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-green-800 to-green-700 p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <motion.h2
                        className="text-2xl md:text-3xl font-bold font-munika"
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {currentItem.title}
                      </motion.h2>
                      <p className="text-green-100 font-munika">{currentItem.description}</p>
                    </div>
                    <button
                      onClick={toggleModal}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      aria-label="Close"
                    >
                      <IconX className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="overflow-y-auto flex-1">
                  <div className="grid md:grid-cols-2 gap-8 p-8">
                    {/* Left Column - Visual */}
                    <div className="space-y-6">
                      <motion.div
                        className="relative h-64 rounded-xl overflow-hidden shadow-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <img
                          src={currentItem.image}
                          alt={currentItem.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </motion.div>

                      {/* Presentation video */}
                      <div className="rounded-xl overflow-hidden shadow-lg">
                        <video
                          src={HospitalVideo}
                          className="w-full h-auto"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      </div>
                    </div>

                    {/* Right Column - Content */}
                    <div className="space-y-6">
                      {/* Statistics */}
                      <motion.div
                        className="grid grid-cols-2 gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        {currentItem.stats.map((stat, i) => (
                          <div key={i} className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <p className="text-xs text-green-600 uppercase font-semibold font-munika">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-800 font-munika">{stat.value}</p>
                          </div>
                        ))}
                      </motion.div>

                      {/* Detailed description */}
                      <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <h3 className="text-xl font-bold text-gray-800 font-munika">Key Advantages</h3>
                        <p className="text-gray-600 leading-relaxed font-munika">{currentItem.details}</p>

                        {/* Benefits list */}
                        <div className="mt-6 space-y-3">
                          <ul className="space-y-3">
                            {currentItem.benefits.map((benefit, i) => (
                              <li key={i} className="flex items-start font-munika">
                                <div className="flex-shrink-0 mt-1 mr-3 text-green-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <span className="text-gray-700">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t p-4 bg-white">
                  <div className="flex justify-between items-center max-w-4xl mx-auto">
                    <p className="text-sm text-gray-500 font-munika">
                      Advantage #{currentStage + 1} - {currentItem.title}
                    </p>
                    <button
                      onClick={toggleModal}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2 font-munika"
                    >
                      Close
                      <IconX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl lg:text-5xl font-bold text-green-800 mb-4 font-munika"
          >
            WHY CHOOSE TUNISIA?
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent w-1/3 mx-auto mb-8"
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto font-munika"
          >
            Tunisia boasts advanced medical facilities, competitive pricing, and a beautiful cultural backdrop, making it an attractive destination for medical treatments and recovery.
          </motion.p>
        </div>

        {/* Advantages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ADVANTAGES.map((advantage, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Advantage Card */}
              <motion.div
                className={`h-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 ${currentStage === index ? 'ring-2 ring-green-500' : 'hover:shadow-lg'}`}
                whileHover={{ y: -5 }}
                onClick={() => goToStage(index)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={advantage.image}
                    alt={advantage.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                    <div className="flex items-center gap-2">
                      {advantage.icon}
                      <h3 className="text-lg font-bold text-white font-munika">{advantage.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4 font-munika">{advantage.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {advantage.stats.map((stat, i) => (
                      <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium font-munika">
                        {stat.label}: {stat.value}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Selected Advantage Details */}
        <motion.div
          className="mt-16 bg-white rounded-xl shadow-xl overflow-hidden max-w-6xl mx-auto border border-gray-100"
          key={currentStage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="relative h-64 lg:h-full">
              <img
                src={currentItem.image}
                alt={currentItem.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="p-8">
              <div className="flex flex-wrap gap-4 mb-6">
                {currentItem.stats.map((stat, i) => (
                  <div key={i} className="bg-green-50 p-3 rounded-lg flex-1 min-w-[120px] border border-green-100">
                    <p className="text-xs text-green-600 uppercase font-medium font-munika">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-800 font-munika">{stat.value}</p>
                  </div>
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed font-munika">{currentItem.details}</p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={toggleModal}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition-all flex items-center gap-2 font-medium font-munika"
                >
                  <span>Learn more</span>
                  <IconArrowRight className="w-5 h-5" />
                </button>
                <button className="px-6 py-3 bg-white text-green-600 border border-green-200 hover:bg-green-50 rounded-lg shadow transition-all flex items-center gap-2 font-medium font-munika">
                  <IconPhoneCall className="w-5 h-5" />
                  <span>Contact us</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Statistics */}
        <div className="mt-20 grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center hover:shadow-lg transition-all">
            <div className="text-4xl font-bold text-green-600 mb-3 font-munika">70%</div>
            <p className="text-gray-700 uppercase text-sm font-medium font-munika">Savings</p>
            <p className="text-gray-500 text-xs mt-1 font-munika">compared to Europe</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center hover:shadow-lg transition-all">
            <div className="text-4xl font-bold text-green-600 mb-3 font-munika">98%</div>
            <p className="text-gray-700 uppercase text-sm font-medium font-munika">Satisfaction</p>
            <p className="text-gray-500 text-xs mt-1 font-munika">patient rate</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center hover:shadow-lg transition-all">
            <div className="text-4xl font-bold text-green-600 mb-3 font-munika">5000+</div>
            <p className="text-gray-700 uppercase text-sm font-medium font-munika">Specialists</p>
            <p className="text-gray-500 text-xs mt-1 font-munika">internationally trained</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center hover:shadow-lg transition-all">
            <div className="text-4xl font-bold text-green-600 mb-3 font-munika">0</div>
            <p className="text-gray-700 uppercase text-sm font-medium font-munika">Waiting list</p>
            <p className="text-gray-500 text-xs mt-1 font-munika">for most treatments</p>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-20 bg-gradient-to-r from-green-800 to-green-700 rounded-xl p-8 text-white max-w-4xl mx-auto shadow-lg">
          <div className="flex items-start gap-4">
            <div className="text-5xl font-serif leading-none">"</div>
            <div>
              <p className="text-lg italic mb-4 font-munika">
                After exploring options across Europe, I chose Tunisia for my dental implants. The quality of care was exceptional, the facilities modern, and I saved over €8000 while recovering by the Mediterranean.
              </p>
              <div className="font-medium font-munika">
                <p>Sophie Martin</p>
                <p className="text-green-200 text-sm">Patient from France</p>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isQuoteModalOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onClick={toggleQuoteModal}
              />

              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <motion.div
                  className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100"
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  exit={{ y: 50 }}
                >
                  {/* En-tête */}
                  <div className="bg-gradient-to-r from-green-800 to-green-700 p-6 text-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold font-munika">Personalized Medical Quote</h2>
                        <p className="text-green-100 font-munika">Receive a tailored treatment plan within 24 hours</p>
                      </div>
                      <button
                        onClick={toggleQuoteModal}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Close"
                      >
                        <IconX className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-8">
                    <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 font-munika">Full Name</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <IconUser className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-munika"
                              placeholder="John Doe"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 font-munika">Email Address</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <IconMail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-munika"
                              placeholder="john@example.com"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 font-munika">Phone Number</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <IconPhoneCall className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="tel"
                              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-munika"
                              placeholder="+216 12 345 678"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 font-munika">Treatment Date</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <IconCalendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="date"
                              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-munika"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 font-munika">Medical Specialty</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IconMedicalCross className="h-5 w-5 text-gray-400" />
                          </div>
                          <select className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM0YjU1NjMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJtNiA5IDYgNiA2LTYiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_1rem] font-munika">
                            <option value="">Select treatment type</option>
                            <option value="cardiology">Cardiology</option>
                            <option value="dentistry">Dentistry</option>
                            <option value="orthopedics">Orthopedics</option>
                            <option value="fertility">Fertility</option>
                            <option value="aesthetics">Aesthetic Surgery</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 font-munika">Medical Details</label>
                        <div className="relative">
                          <div className="absolute top-3 left-3">
                            <IconClipboard className="h-5 w-5 text-gray-400" />
                          </div>
                          <textarea
                            rows={4}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-munika"
                            placeholder="Describe your medical condition and any specific requirements..."
                          ></textarea>
                        </div>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Final CTA */}
       
      </div>
    </div>
  );
};

export default MedicalTourism;