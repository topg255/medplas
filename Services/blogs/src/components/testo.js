import React, { useState } from 'react';
import { FaQuoteLeft, FaStar, FaChevronRight, FaTimes, FaChevronLeft, FaChevronRight as FaChevronRightSolid } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import patient1 from '../assets/tunisia1.jpg';
import patient2 from '../assets/tunisia2.jpg';
import patient3 from '../assets/tunisia3.jpg';

export const TestimonialsSection = () => {
    
    const [expandedTestimonials, setExpandedTestimonials] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

    const toggleExpand = (id) => {
        setExpandedTestimonials(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const testimonials = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Cosmetic Surgery Patient",
            content: "The care I received was exceptional from start to finish. The team made me feel completely at ease and the results have transformed my confidence.",
            fullContent: "The care I received was exceptional from start to finish. The team made me feel completely at ease and the results have transformed my confidence. Every step of the process was explained clearly, and the aftercare support was outstanding. I've recommended this clinic to all my friends because the experience was simply perfect in every way.",
            rating: 5,
            image: patient1,
            highlightColor: "from-amber-400 to-rose-500",
            date: "Liverpool, England"
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "Dental Tourism Patient",
            content: "Combining my dental procedure with a vacation was the best decision. The quality of care matched what I'd expect back home at half the cost.",
            fullContent: "Combining my dental procedure with a vacation was the best decision. The quality of care matched what I'd expect back home at half the cost. The clinic arranged everything from airport transfers to hotel stays, making the entire process seamless. The dentists spoke perfect English and used the latest technology. I saved over 60% compared to US prices while enjoying a beautiful vacation in Tunisia.",
            rating: 5,
            image: patient2,
            highlightColor: "from-emerald-400 to-teal-500",
            date: "Marseille, France"
        },
        {
            id: 3,
            name: "Amina Al-Farsi",
            role: "Fertility Treatment Patient",
            content: "After years of struggling, we finally have our miracle baby thanks to the incredible specialists. Their compassion and expertise were unmatched.",
            fullContent: "After years of struggling, we finally have our miracle baby thanks to the incredible specialists. Their compassion and expertise were unmatched. The emotional support we received throughout our IVF journey was as valuable as the medical expertise. The doctors took time to explain every option and never made us feel rushed. Today, holding our beautiful daughter, we know we made the right choice coming to this clinic.",
            rating: 5,
            image: patient3,
            highlightColor: "from-indigo-400 to-violet-500",
            date: "Ankara, Turkey"
        },
        // Additional testimonials for the modal
        {
            id: 4,
            name: "David Wilson",
            role: "Orthopedic Surgery Patient",
            content: "My knee replacement surgery was a complete success. I'm now pain-free and able to enjoy my daily walks again.",
            fullContent: "My knee replacement surgery was a complete success. I'm now pain-free and able to enjoy my daily walks again. The surgical team was incredibly professional and the rehabilitation program was tailored perfectly to my needs. Six months post-op, I feel like I've got a new lease on life. The facilities were top-notch and exceeded all my expectations.",
            rating: 5,
            image: patient1, // You would add actual images
            highlightColor: "from-blue-400 to-cyan-500",
            date: "Berlin, Germany"
        },
        {
            id: 5,
            name: "Emma Rodriguez",
            role: "Cardiac Care Patient",
            content: "The cardiac team saved my life with their quick response and expert care during my emergency.",
            fullContent: "The cardiac team saved my life with their quick response and expert care during my emergency. From the moment I arrived at the hospital, I knew I was in good hands. The doctors explained everything clearly and the nursing staff was exceptionally attentive. My recovery has been smooth thanks to their comprehensive aftercare program. I can't thank them enough for giving me a second chance at life.",
            rating: 5,
            image: patient2,
            highlightColor: "from-red-400 to-pink-500",
            date: "Madrid, Spain"
        }
    ];

    const openModal = () => setModalOpen(true);
    const closeModal = () => {
        setModalOpen(false);
        setCurrentTestimonialIndex(0); 
      };

    const nextTestimonial = () => {
        setCurrentTestimonialIndex((prev) =>
            prev === testimonials.length - 1 ? 0 : prev + 1
        );
    };

    const prevTestimonial = () => {
        setCurrentTestimonialIndex((prev) =>
            prev === 0 ? testimonials.length - 1 : prev - 1
        );
    };

    return (
        <section className="relative py-28 bg-gradient-to-br from-white via-blue-50 to-purple-50 overflow-hidden">
            {/* Cosmic Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden opacity-15">
                <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full filter blur-[100px] animate-float-slow"></div>
                <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-r from-amber-100 to-pink-100 rounded-full filter blur-[120px] animate-float-medium"></div>
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full filter blur-[80px] animate-float-fast"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Animated Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: 'spring' }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center max-w-4xl mx-auto mb-20"
                >
                    <motion.span
                        className="inline-block px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold mb-8 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="mr-2">✨</span> PATIENT TESTIMONIALS <span className="ml-2">✨</span>
                    </motion.span>

                    <motion.h2
                        className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight"
                        initial={{ letterSpacing: '0.5px' }}
                        whileInView={{ letterSpacing: '0px' }}
                        transition={{ duration: 1 }}
                    >
                        Voices of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-text-shimmer">Transformation</span>
                    </motion.h2>

                    <motion.p
                        className="text-xl text-gray-600 max-w-2xl mx-auto relative"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span className="absolute -left-6 top-1/2 transform -translate-y-1/2 text-gray-300">❝</span>
                        Where exceptional care meets life-changing results
                        <span className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-gray-300">❞</span>
                    </motion.p>
                </motion.div>

                {/* Luxury Square Testimonials Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {testimonials.slice(0, 3).map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 80, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                duration: 0.8,
                                delay: index * 0.15,
                                type: 'spring',
                                stiffness: 100
                            }}
                            viewport={{ once: true, margin: "-50px" }}
                            whileHover={{
                                y: -15,
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
                            }}
                            className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-opacity-10 border-white group transition-all duration-500 flex flex-col"
                            style={{ minHeight: '500px' }}
                        >
                            {/* Gradient Corner Accents */}
                            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${testimonial.highlightColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                            <div className={`absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tl ${testimonial.highlightColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                            {/* Main Content */}
                            <div className="p-8 relative z-10 flex-1">
                                <div className="flex items-center mb-6">
                                    <motion.div
                                        className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-xl mr-4 relative"
                                        whileHover={{ rotate: 5, scale: 1.05 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-30 rounded-full"></div>
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
                                        <p className="text-gray-500 text-sm">{testimonial.role}</p>
                                    </div>
                                </div>

                                <div className="relative mb-6">
                                    <FaQuoteLeft className="text-gray-200 text-3xl absolute -top-2 -left-2 opacity-60" />
                                    <p className="text-gray-700 pl-10 relative">
                                        {expandedTestimonials[testimonial.id] ? testimonial.fullContent : testimonial.content}
                                    </p>
                                </div>
                            </div>

                            {/* Ultra Premium Footer */}
                            <div className={`border-t border-gray-100 bg-gradient-to-b from-white to-gray-50 p-6 relative overflow-hidden`}>
                                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${testimonial.highlightColor} opacity-20`}></div>
                                <div className="absolute -top-4 left-4 w-8 h-8 rounded-full bg-white opacity-20 filter blur-sm"></div>
                                <div className="absolute -top-4 right-4 w-8 h-8 rounded-full bg-white opacity-20 filter blur-sm"></div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ scale: 1.2, rotate: 15 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FaStar
                                                    className={`text-sm ${i < testimonial.rating ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-200'}`}
                                                />
                                            </motion.div>
                                        ))}
                                        <span className="ml-2 text-sm text-gray-500">{testimonial.date}</span>
                                    </div>

                                    <motion.button
                                        onClick={() => toggleExpand(testimonial.id)}
                                        className={`flex items-center px-4 py-2 rounded-full text-sm font-medium ${expandedTestimonials[testimonial.id] ? 'bg-gray-100 text-gray-700' : 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600'}`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {expandedTestimonials[testimonial.id] ? 'Show Less' : 'Read More'}
                                        <motion.span
                                            animate={{ x: expandedTestimonials[testimonial.id] ? 4 : 2 }}
                                            transition={{ type: 'spring', stiffness: 500 }}
                                            className="ml-1"
                                        >
                                            <FaChevronRight className="text-xs" />
                                        </motion.span>
                                    </motion.button>
                                </div>

                                <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1 opacity-30">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="w-1 h-1 rounded-full bg-gray-400"></div>
                                    ))}
                                </div>
                            </div>

                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                <div className={`absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br ${testimonial.highlightColor} rounded-full filter blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-24 text-center relative"
                >
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-blue-400 rounded-full filter blur-[80px] opacity-20"></div>

                    <motion.button
                        onClick={openModal}
                        className="inline-flex items-center px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group relative overflow-hidden"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/30 to-white/10 opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-300"></span>

                        <span className="relative z-10 flex items-center">
                            View All Testimonials
                            <svg className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                        </span>
                    </motion.button>
                </motion.div>
            </div>

            {/* Premium Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-md"
                        onClick={closeModal} // Ferme la modale quand on clique à l'extérieur

                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                            onClick={(e) => e.stopPropagation()} // Empêche la fermeture quand on clique à l'intérieur
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-bold">Patient Testimonials</h3>
                                    <motion.button
                                        onClick={closeModal}
                                        className="absolute top-4 right-4 z-50 p-2 rounded-full  bg-opacity-80 hover:bg-opacity-100 shadow-md transition-all"
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        exit={{ 
                                            opacity: 0,
                                            transition: { duration: 0.2 }
                                          }}
                                          
                                    >
                                        <FaTimes className="text-white text-xl" />
                                    </motion.button>
                                </div>
                                <div className="mt-2 flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className="text-yellow-300 mr-1" />
                                    ))}
                                    <span className="ml-2 text-sm opacity-80">{testimonials.length} inspiring stories</span>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-8">
                                <div className="flex items-center mb-8">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl mr-6 relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-30 rounded-full"></div>
                                        <img
                                            src={testimonials[currentTestimonialIndex].image}
                                            alt={testimonials[currentTestimonialIndex].name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-900">{testimonials[currentTestimonialIndex].name}</h3>
                                        <p className="text-gray-500 text-lg">{testimonials[currentTestimonialIndex].role}</p>
                                        <p className="text-gray-400 mt-1">{testimonials[currentTestimonialIndex].date}</p>
                                    </div>
                                </div>

                                <div className="relative pl-12">
                                    <FaQuoteLeft className="text-gray-200 text-5xl absolute top-0 left-0 opacity-60" />
                                    <p className="text-gray-700 text-lg leading-relaxed">
                                        {testimonials[currentTestimonialIndex].fullContent}
                                    </p>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-between items-center">
                                <motion.button
                                    onClick={prevTestimonial}
                                    className="flex items-center px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                                    whileHover={{ x: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaChevronLeft className="mr-2" />
                                    Previous
                                </motion.button>

                                <div className="flex space-x-2">
                                    {testimonials.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentTestimonialIndex(index)}
                                            className={`w-3 h-3 rounded-full transition-all ${currentTestimonialIndex === index ? 'bg-blue-600 scale-125' : 'bg-gray-300'}`}
                                        />
                                    ))}
                                </div>

                                <motion.button
                                    onClick={nextTestimonial}
                                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition-all"
                                    whileHover={{ x: 3 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Next
                                    <FaChevronRightSolid className="ml-2" />
                                </motion.button>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full filter blur-[80px] opacity-10"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400 rounded-full filter blur-[80px] opacity-10"></div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default TestimonialsSection;