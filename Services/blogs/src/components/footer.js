import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import React from "react";
import { Link } from "react-router-dom";
import Logo from '../assets/logoo.png';
import { FaPaperPlane, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { motion } from "framer-motion";

export const Footer = () => {
    const socialLinks = [
        {
            icon: <FaLinkedinIn className="w-4 h-4" />,
            bg: "bg-[#0077B5]",
            href: "https://www.linkedin.com/company/pura-solutions/"
        },
        {
            icon: <FaFacebookF className="w-4 h-4" />,
            bg: "bg-[#1877F2]",
            href: "https://www.facebook.com/PURAsolutions?locale=fr_FR"
        },
        {
            icon: <FaInstagram className="w-4 h-4" />,
            bg: "bg-gradient-to-r from-[#FCAF45] via-[#E4405F] to-[#833AB4]",
            href: "https://www.instagram.com/pura.solutions/"
        }
    ];

    // Tableau des spécialités avec leurs liens correspondants
     const specialties = [
        { name: "Plastic Surgery", path: "http://localhost:3031/" },
        { name: "Dentistry", path: "http://localhost:3070/" },
        { name: "Hair Transplant", path: "http://localhost:3028/" },
        { name: "IVF", path: "http://localhost:3029/" },
        { name: "Healthy Holiday", path: "http://localhost:3030/" },
    ];

    // Tableau des services avec leurs liens
    const services = [
        { name: "Medical Booking", path: "http://localhost:3010/" },
        { name: "Travel Assistance", path: "http://localhost:3011/" },
        { name: "Additional Services", path: "http://localhost:3012/" }
    ];

    return (
        <footer className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-t-3xl py-12 px-6 shadow-lg">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12">
                    {/* Logo Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center lg:items-start"
                    >
                        <img src={Logo} alt="PlasFora Logo" className="w-40 mb-4" />
                        <p className="text-gray-600 font-munika text-center lg:text-left text-lg leading-relaxed max-w-xs">
                            Plasfora: Your Guide to a Confident Medical Journey in Tunisia
                        </p>
                    </motion.div>

                    {/* Links Sections */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center lg:text-left"
                    >
                        {/* Specialties */}
                        <div>
                            <h3 className="text-xl font-semibold font-munika text-blue-800 mb-4">Specialities</h3>
                            <ul className="space-y-3">
                                {specialties.map((item, index) => (
                                    <motion.li 
                                        key={index}
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Link 
                                            to={item.path} 
                                            className="text-gray-600 hover:text-blue-600 font-munika transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h3 className="text-xl font-semibold font-munika text-blue-800 mb-4">Services</h3>
                            <ul className="space-y-3">
                                {services.map((item, index) => (
                                    <motion.li 
                                        key={index}
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Link 
                                            to={item.path} 
                                            className="text-gray-600 hover:text-blue-600 font-munika transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="text-xl font-semibold font-munika text-blue-800 mb-4">Contact</h3>
                            <ul className="space-y-4">
                                <motion.li 
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="flex items-start space-x-3"
                                >
                                    <FaPaperPlane className="text-blue-600 mt-1" />
                                    <a href="mailto:contact@plasfora.com" className="font-munika text-gray-600 hover:text-blue-600">
                                        contact@plasfora.com
                                    </a>
                                </motion.li>
                                <motion.li 
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="flex items-start space-x-3"
                                >
                                    <FaMapMarkerAlt className="text-red-500 mt-1" />
                                    <span className="font-munika text-gray-600">Sousse, center ville, 4000</span>
                                </motion.li>
                                <motion.li 
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="flex items-start space-x-3"
                                >
                                    <FaPhone className="text-green-600 mt-1" />
                                    <a href="tel:+21652408822" className="font-munika text-gray-600 hover:text-blue-600">
                                        +216 52-408-822
                                    </a>
                                </motion.li>
                            </ul>
                        </div>
                    </motion.div>
                </div>

                {/* Copyright Section */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-inner"
                >
                    <p className="text-gray-600 text-sm font-munika">
                        &copy; {new Date().getFullYear()} PlasFora. All rights reserved.
                    </p>
                    
                    <div className="flex space-x-4">
                        {socialLinks.map((social, index) => (
                            <motion.a
                                key={index}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex justify-center p-3 rounded-full text-white ${social.bg} shadow-md hover:shadow-lg transition-all`}
                                whileHover={{ y: -5, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {social.icon}
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};