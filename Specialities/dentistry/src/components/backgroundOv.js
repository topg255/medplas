"use client";
//import { cn } from "../utils";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import backgroundImage from '../assets/dt2.jpg';
import hoverImage from '../assets/dt.gif';
import Image from '../assets/dent1.jpg'
import { useTranslation } from "react-i18next";
//import Image from '../assets/htz.jpg'


export const CardDemo = () => {
    const { t } = useTranslation();
    const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
    const [isVideoExpanded, setIsVideoExpanded] = useState(false);


    return (
        <>
            <div className="flex flex-col lg:flex-row items-center justify-center mt-20 mb-20 lg:mt-32 gap-12 lg:gap-24 px-6 max-w-7xl mx-auto">
                {/* Carte médicale avec avant/après */}
                <motion.div
                    className="w-full lg:w-[45%] z-10"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="group relative w-full aspect-square max-w-[500px] mx-auto rounded-xl shadow-lg overflow-hidden border border-gray-100 bg-white">
                        {/* Image statique avant traitement */}
                        <motion.div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${backgroundImage})` }}
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.6 }}
                        />

                        {/* Image animée après traitement */}
                        <motion.div
                            className="absolute inset-0 bg-cover bg-center opacity-0"
                            style={{ backgroundImage: `url(${hoverImage})` }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                        />

                        {/* Overlay médical */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">

                        </div>

                        {/* Badge de certification */}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium shadow-sm z-10 flex items-center">
                            <svg className="w-3 h-3 mr-1 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {t("dentistry_certified_results")}
                        </div>
                    </div>
                </motion.div>

                {/* Contenu informatif */}
                <motion.div
                    className="w-full lg:w-[55%] space-y-6"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    <motion.h1
                        className="text-3xl md:text-4xl lg:text-5xl font-munika text-gray-900 leading-tight"
                        whileHover={{ scale: 1.01 }}
                    >
                        <span className="text-blue-800 font-munika">{t("dentistry_in_tunisia")}</span>
                    </motion.h1>

                    <div className="space-y-5">
                        <motion.div
                            className="p-5 bg-blue-50/30 rounded-lg border border-blue-100"
                            whileHover={{ x: 3 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <h3 className="font-semibold text-blue-700 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                </svg>
                                {t("dentistry_expertise_title")}
                            </h3>
                            <p className="mt-2 text-gray-700 font-munika">
                                {t("dentistry_expertise_desc")}
                            </p>
                        </motion.div>

                        <motion.div
                            className="p-5 bg-blue-50/30 rounded-lg border border-blue-100"
                            whileHover={{ x: 3 }}
                            transition={{ type: "spring", stiffness: 400, delay: 0.1 }}
                        >
                            <h3 className="font-munika text-blue-700 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                </svg>
                                {t("dentistry_technology_title")}
                            </h3>
                            <p className="mt-2 text-gray-700 font-munika">
                                {t("dentistry_technology_desc")}
                            </p>
                        </motion.div>

                        <motion.div
                            className="p-5 bg-blue-50/30 rounded-lg border border-blue-100"
                            whileHover={{ x: 3 }}
                            transition={{ type: "spring", stiffness: 400, delay: 0.2 }}
                        >
                            <h3 className="font-munika text-blue-700 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                {t("dentistry_support_title")}
                            </h3>
                            <p className="mt-2 text-gray-700 font-munika">
                                {t("dentistry_support_desc")}
                            </p>
                        </motion.div>
                    </div>

                    {/* Bouton CTA professionnel */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 mt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <motion.button
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-munika shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                            whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                const accessToken = localStorage.getItem("accessToken");
                                const refreshToken = localStorage.getItem("refreshToken");
                                const user = {
                                    name: localStorage.getItem("userName"),
                                    email: localStorage.getItem("userEmail"),
                                    insurance: localStorage.getItem("insurance"),
                                    age: localStorage.getItem("age"),
                                };

                                const targetWindow = window.open("http://localhost:3018", "_blank");

                                // Attendre que la page cible soit prête
                                const interval = setInterval(() => {
                                    targetWindow?.postMessage(
                                        { accessToken, refreshToken, user },
                                        "http://localhost:3018"
                                    );
                                }, 500);

                                // Stopper après quelques secondes
                                setTimeout(() => clearInterval(interval), 4000);
                            }}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {t("dentistry_cta_appointment")}
                        </motion.button>
                        <motion.button
                            className="px-8 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg font-munika shadow-sm hover:shadow-md transition-all flex items-center justify-center"
                            whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsResultsModalOpen(true)}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {t("dentistry_cta_how")}
                        </motion.button>

                    </motion.div>
                </motion.div>
            </div>

            {/* Modale des résultats */}
            <AnimatePresence>
                {isResultsModalOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25 }}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-munika text-gray-900">{t("dentistry_modal_title")}</h3>
                                    <button
                                        onClick={() => setIsResultsModalOpen(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        {/* Image Before Treatment */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6 }}
                                            className="space-y-2"
                                        >
                                            <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                                <img
                                                    src={backgroundImage}
                                                    alt="Before hair transplant"
                                                    className="w-full h-auto"
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                                    <span className="text-white text-sm font-medium">{t("dentistry_before_treatment")}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm font-munika px-2">
                                                {t("dentistry_before_desc")}
                                            </p>
                                        </motion.div>

                                        {/* Image After Treatment */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.2 }}
                                            className="space-y-2"
                                        >
                                            <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                                <img
                                                    src={Image}
                                                    alt="After hair transplant"
                                                    className="w-full h-auto"
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                                    <span className="text-white text-sm font-medium">{t("dentistry_after_treatment")}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm font-munika px-2">
                                                {t("dentistry_after_desc")}
                                            </p>
                                        </motion.div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                                            <img
                                                autoPlay
                                                loop
                                                muted
                                                src={hoverImage}
                                                alt="Démonstration de greffe capillaire"
                                                className="w-full h-auto cursor-pointer"
                                                onClick={() => setIsVideoExpanded(true)}
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                                <span className="text-white text-sm font-medium">{t("dentistry_process_label")}</span>
                                            </div>

                                            {/* Bouton d'agrandissement amélioré */}
                                            <button
                                                onClick={() => setIsVideoExpanded(true)}
                                                className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                aria-label="Agrandir la vidéo"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Modal améliorée avec backdrop flouté */}
                                        {isVideoExpanded && (
                                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                                {/* Overlay avec flou */}
                                                <div
                                                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                                                    onClick={() => setIsVideoExpanded(false)}
                                                />

                                                {/* Contenu de la modal - Cadre rectangulaire net */}
                                                <div className="relative w-full max-w-4xl bg-white rounded-xl overflow-hidden shadow-2xl z-10">
                                                    {/* Bouton de fermeture */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setIsVideoExpanded(false);
                                                        }}
                                                        className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full p-2 z-20 transition-colors duration-200"
                                                        aria-label="Fermer"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>

                                                    {/* Vidéo agrandie */}
                                                    <video
                                                        autoPlay
                                                        loop
                                                        muted
                                                        controls
                                                        src={hoverImage}
                                                        alt="Démonstration détaillée de greffe capillaire"
                                                        className="w-full h-auto max-h-[80vh] object-contain"
                                                    />

                                                    {/* Légende */}
                                                    <div className="p-4 bg-white border-t border-gray-100">
                                                        <p className="text-gray-700 font-medium text-center">
                                                            {t("dentistry_process_caption")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <p className="text-gray-600 text-sm font-munika">
                                            {t("dentistry_video_desc")}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 bg-blue-50/50 p-6 rounded-lg">
                                    <h4 className="font-munika text-blue-700 mb-3 flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {t("dentistry_info_title")}
                                    </h4>
                                    <blockquote className="text-gray-700 font-munika">
                                        {t("dentistry_info_desc")}
                                    </blockquote>
                                    <motion.a
                                        href="https://en.wikipedia.org/wiki/Tooth_whitening"
                                        className="mt-2 text-blue-600 text-sm font-munika hover:text-blue-800 transition-colors duration-200 underline underline-offset-4 decoration-blue-300 hover:decoration-blue-600 cursor-pointer inline-flex items-center"
                                        whileHover={{ x: 2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {t("dentistry_info_link")}
                                        <svg
                                            className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </motion.a>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={() => setIsResultsModalOpen(false)}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-munika shadow hover:bg-blue-700 transition-colors"
                                    >
                                        {t("close")}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}