import './i18n.js';
import React, { useRef, useState, useEffect } from "react";
import Image from '../src/assets/pl1.jpg';
import Image1 from '../src/assets/pl2.jpg';
import Image2 from '../src/assets/pl3.jpg';
import Image3 from './assets/pl4.jpg';
import BR from './assets/br1.jpg';
import C1 from './assets/C1.jpg';
import FT1 from './assets/Ft1.jpg';
import O1 from './assets/o1.jpg';
import { motion } from "framer-motion";
import { Footer } from './components/footer';
import { Medical3DCard } from "./components/3dCard";
import { MedicalTestimonialsCarousel } from "./components/testo";
import { CurvedBackground } from './components/curvebackground'
import { PlasticSurgeryJourney } from './components/cars';
import { useTranslation } from 'react-i18next';


export const Navbar = () => {
    const { t, i18n } = useTranslation();

    const testimonials = [
        {
            quote:
                "Osteotomy is a surgical procedure that involves cutting and reshaping bones in the face. This procedure is often used to correct facial deformities, improve bite alignment, and enhance facial aesthetics.",
            name: "Osteotomy",
            src: O1,
        },
        {
            quote:
                "Our maxillofacial surgeons are highly skilled in treating facial trauma, including fractures, lacerations, and other injuries. We are dedicated to restoring facial function and aesthetics after an injury.",
            name: "Facial Trauma",
            src: FT1,
        },
        {
            quote:
                "Cranioplasty involves repairing or reconstructing the skull. This procedure is often performed to treat defects caused by trauma, surgery, or congenital conditions.",
            name: "Cranioplasty",
            src: C1,
        },
        {
            quote:
                "We provide comprehensive care for burn injuries, including reconstruction, wound care, and scar management. Our skilled surgeons work to restore function and minimize scarring.",
            name: "Burns",
            src: BR,
        },
    ];
    const LanguageSelector = () => (
        <div className="flex items-center space-x-2">
            {["en", "fr", "ar"].map((lng) => (
                <button
                    key={lng}
                    onClick={() => i18n.changeLanguage(lng)}
                    className={`px-2 py-1 rounded ${i18n.language === lng ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}
                >
                    {lng.toUpperCase()}
                </button>
            ))}
        </div>
    );


    return (

        <>

            {/* Top Navbar */}
            <div className="w-full h-full"
            >
                <div className="fixed top-2 right-2 z-[99999]">
                    <LanguageSelector />
                </div>

                <CurvedBackground></CurvedBackground>

                <Medical3DCard></Medical3DCard>

                {/* ImageCarousel avec moins de marge */}
                <div className="relative overflow-hidden w-full h-full py-10"
                    style={{ background: 'rgb(254,245,231)' }}>
                    <div className="px-6 lg:px-8 text-center">
                        <motion.h4
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-3xl lg:text-5xl font-bold font-munika text-[#88570b] mb-6"
                        >
                            {t("explore_procedures_title")}
                        </motion.h4>

                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="h-[2px] bg-gradient-to-r from-transparent via-[#88570b] to-transparent w-3/4 mx-auto mb-7"
                        />

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-lg text-gray-600 max-w-3xl mx-auto font-munika mb-10"
                        >
                            {t("explore_procedures_desc")}
                        </motion.p>
                    </div>

                </div>

                <PlasticSurgeryJourney />


                {/* AnimatedTestimonials plus proche de ImageCarousel */}
                <div className="relative overflow-hidden w-full h-full py-10 mb-10">

                    <MedicalTestimonialsCarousel />
                </div>
                <Footer></Footer>
            </div>
        </>

    );
};

export default Navbar;