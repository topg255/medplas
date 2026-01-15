import '../i18n.js';
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Footer } from "./components/footer";
import { CardDemo } from "./components/backgroundOv";
import { CurvedBackground } from "./components/curvebackground";
import { MedicalZoomSection } from "./components/zoom";
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


  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.origin !== "http://localhost:3020") return;

      const { accessToken, refreshToken, user } = event.data;

      if (accessToken && user) {
        console.log("✅ Token reçu de MF2 :", accessToken);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("insurance", user.insurance);
        localStorage.setItem("age", user.age);
      }
    });
  }, []);

  return (
    <div className="w-full h-full bg-[#f8fbff]">
      <div className="fixed top-2 right-2 z-[99999]">
        <LanguageSelector />
      </div>
      <CurvedBackground />
      <CardDemo />
      <MedicalZoomSection />
      <Footer />
    </div>
  );
};

export default Navbar;