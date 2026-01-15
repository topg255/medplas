import React,{useState} from "react";
import K from '../assets/kantawi.png'
import R from '../assets/riathh.png'
import A from '../assets/ahlemm.png'
import D from '../assets/doctorr.png'
import T from '../assets/taha.png'
import Di from '../assets/dima.png'
import M from '../assets/mouradi.png'
import O from '../assets/ooredoo.png'
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
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
export const LogoShowcase = () => {
      const { t, i18n } = useTranslation();


    const logos = [
      // First row
      { id: 1, name: 'Carrefour', src: K, alt: 'Carrefour logo' },
      { id: 2, name: 'Microsoft', src: R, alt: 'Microsoft logo' },
      { id: 3, name: 'Body & Soul', src: A, alt: 'Body & Soul logo' },
      { id: 4, name: 'Tunisie Telecom', src: D, alt: 'Tunisie Telecom logo' },
      
      // Second row
      { id: 6, name: 'Island Haze', src: Di , alt: 'Island Haze logo' },
      { id: 7, name: 'Ministère de l\'Enseignement', src: M, alt: 'Ministère de l\'Enseignement logo' },
      { id: 8, name: 'Ministère des Affaires', src: T, alt: 'Ministère des Affaires logo' },
      { id: 9, name: 'GAT Assurances', src: O, alt: 'GAT Assurances logo' },
      
      
      // Third row
      
    ];
  
    return (
      <div className="bg-white py-16 px-8 w-full max-w-7xl mx-auto">
        <h2 className="text-5xl font-bump text-center text-blue-800 mb-20"> {t('trust_us')}</h2>
        
        <div className="flex flex-col space-y-16">
          {/* First row - 5 logos */}
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-8">
            {logos.slice(0, 5).map((logo) => (
              <LogoItem key={logo.id} logo={logo} />
            ))}
          </div>
          
          {/* Second row - 4 logos */}
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-8">
            {logos.slice(5, 9).map((logo) => (
              <LogoItem key={logo.id} logo={logo} />
            ))}
          </div>
          
          {/* Third row - 5 logos */}
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-8">
            {logos.slice(9).map((logo) => (
              <LogoItem key={logo.id} logo={logo} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  function LogoItem({ logo }) {
    return (
      <div className="w-40 h-24 flex items-center justify-center">
        <img 
          src={logo.src} 
          alt={logo.alt}
          className="max-h-full max-w-full object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
        />
      </div>
    );
  }