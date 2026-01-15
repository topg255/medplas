import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

import MedicalTeam from '../assets/ur.jpg';
import Consultation from '../assets/to.jpg';
import Surgery from '../assets/ur.jpg';
import Technology from '../assets/tz.jpg';
import Research from '../assets/ui.jpg';
import PatientCare from '../assets/Te.jpg';

export const Hero = () => {
    const [scrolled, setScrolled] = useState(false);
    const [hoveredImage, setHoveredImage] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { t } = useTranslation();

    // Function to check login state
    const checkLoginState = () => {
        const token = localStorage.getItem("accessToken");
        setIsLoggedIn(!!token);
    };

    // Check login state on mount and listen for storage changes
    useEffect(() => {
        checkLoginState();

        const handleStorageChange = () => {
            checkLoginState();
        };

        window.addEventListener("storage", handleStorageChange);

        const interval = setInterval(() => {
            checkLoginState();
        }, 1000);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [scrolled]);

    return (
        <div className="relative bg-gradient-to-b from-white to-blue-50 min-h-screen flex items-center overflow-hidden">
            <div className="absolute inset-0 bg-medical-pattern opacity-[0.02]"></div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-20 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Content Column - Professional and Elegant */}
                    <div className="relative z-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="max-w-2xl"
                        >

                            {/* Main heading - Professional Typography */}
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 leading-tight tracking-tight"
                            >
                                <span className="block font-semibold text-blue-900 mb-4">
                                    {t('PLASFORA')}
                                </span>
                                <span className="block text-3xl md:text-4xl lg:text-5xl text-slate-700 font-light leading-relaxed">
                                    {t("hero_main")}
                                    <span className="block text-blue-800 font-normal">{t("hero_main_highlight")}</span>
                                </span>
                            </motion.h1>

                            {/* Elegant Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                viewport={{ once: true }}
                                className="mt-8 text-lg lg:text-xl text-slate-600 leading-relaxed font-light border-l-4 border-blue-300 pl-6 py-2"
                            >
                                {t("hero_desc")}
                                <span className="block mt-2 text-slate-700 font-normal">
                                    {t("hero_desc_extra")}
                                </span>
                            </motion.p>
                            
                            {/* Content CTA */}
                            <div className="mt-6">
                                <span className="text-base text-blue-900 font-medium bg-blue-50 rounded px-4 py-2 inline-block shadow-sm">
                                    {t("about_professional_desc")}
                                </span>
                            </div>

                            {/* Elegant CTA Button */}
                            <AnimatePresence>
                                {!isLoggedIn && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.5, delay: 0.8 }}
                                        className="mt-10 flex gap-4"
                                    >

                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Right Image Grid - Professional and Clean Design */}
                    <div className="relative lg:h-[36rem]">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                            className="relative h-full w-full"
                        >
                            {/* Image grid with professional overlay */}
                            <div className="grid grid-cols-2 gap-6 h-full">
                                {/* Left column */}
                                <div className="flex flex-col gap-6 pt-12">
                                    <motion.div
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="relative overflow-hidden rounded-2xl shadow-2xl shadow-blue-900/10 h-80 bg-white group"
                                        onMouseEnter={() => setHoveredImage("img1")}
                                        onMouseLeave={() => setHoveredImage(null)}
                                    >
                                        <img
                                            src={MedicalTeam}
                                            alt={t("hero_img1_alt")}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: hoveredImage === "img1" ? 1 : 0, y: hoveredImage === "img1" ? 0 : 20 }}
                                            className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent flex items-end p-6"
                                        >
                                            <div>
                                                <p className="text-white text-lg font-semibold">{t("hero_img1_title")}</p>
                                                <p className="text-blue-200 text-sm mt-2">{t("hero_img1_desc")}</p>
                                            </div>
                                        </motion.div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                                        className="relative overflow-hidden rounded-2xl shadow-2xl shadow-blue-900/10 h-64 bg-white group"
                                        onMouseEnter={() => setHoveredImage("img2")}
                                        onMouseLeave={() => setHoveredImage(null)}
                                    >
                                        <img
                                            src={Technology}
                                            alt={t("hero_img2_alt")}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: hoveredImage === "img2" ? 1 : 0, y: hoveredImage === "img2" ? 0 : 20 }}
                                            className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex items-end p-6"
                                        >
                                            <div>
                                                <p className="text-white text-lg font-semibold">{t("hero_img2_title")}</p>
                                                <p className="text-slate-300 text-sm mt-2">{t("hero_img2_desc")}</p>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </div>

                                {/* Right column */}
                                <div className="flex flex-col gap-6">
                                    <motion.div
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                                        className="relative overflow-hidden rounded-2xl shadow-2xl shadow-blue-900/10 h-64 bg-white group"
                                        onMouseEnter={() => setHoveredImage("img3")}
                                        onMouseLeave={() => setHoveredImage(null)}
                                    >
                                        <img
                                            src={Consultation}
                                            alt={t("hero_img3_alt")}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: hoveredImage === "img3" ? 1 : 0, y: hoveredImage === "img3" ? 0 : 20 }}
                                            className="absolute inset-0 bg-gradient-to-t from-blue-800/90 via-blue-800/40 to-transparent flex items-end p-6"
                                        >
                                            <div>
                                                <p className="text-white text-lg font-semibold">{t("hero_img3_title")}</p>
                                                <p className="text-blue-200 text-sm mt-2">{t("hero_img3_desc")}</p>
                                            </div>
                                        </motion.div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
                                        className="relative overflow-hidden rounded-2xl shadow-2xl shadow-blue-900/10 h-80 bg-white group"
                                        onMouseEnter={() => setHoveredImage("img4")}
                                        onMouseLeave={() => setHoveredImage(null)}
                                    >
                                        <img
                                            src={Research}
                                            alt={t("hero_img4_alt")}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: hoveredImage === "img4" ? 1 : 0, y: hoveredImage === "img4" ? 0 : 20 }}
                                            className="absolute inset-0 bg-gradient-to-t from-slate-800/90 via-slate-800/40 to-transparent flex items-end p-6"
                                        >
                                            <div>
                                                <p className="text-white text-lg font-semibold">{t("hero_img4_title")}</p>
                                                <p className="text-slate-300 text-sm mt-2">{t("hero_img4_desc")}</p>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Floating decorative element */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, delay: 1 }}
                                className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 flex items-center justify-center"
                            >
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-900">4+</div>
                                    <div className="text-xs text-slate-600 font-medium">{t("hero_specialists")}</div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* CSS styles for medical pattern */}
            <style jsx>{`
                .bg-medical-pattern {
                    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50 L70 30 L80 40 L60 60 Z M30 30 L50 50 L40 60 L20 40 Z' fill='%23007acc' fill-opacity='0.03'/%3E%3C/svg%3E");
                }
            `}</style>
        </div>
    );
};

export default Hero;