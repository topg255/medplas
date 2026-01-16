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
import { IVF3DCard } from "./components/3dCard";
import { MedicalTestimonialsCarousel } from "./components/testo";
import { CurvedBackground } from './components/curvebackground'
import { IVFJourney } from './components/cars';
import { useTranslation } from 'react-i18next';



export const Navbar = () => {
    const { t, i18n } = useTranslation();
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


    return (

        <>
            {/* Top Navbar */}
            <div className="w-full h-full bg-white">
                <div className="fixed top-2 right-2 z-[99999]">
                    <LanguageSelector />
                </div>

                <CurvedBackground></CurvedBackground>

                <IVF3DCard></IVF3DCard>

                <IVFJourney />

                < MedicalTestimonialsCarousel />

                <Footer></Footer>

            </div>

        </>

    );
};

export default Navbar;