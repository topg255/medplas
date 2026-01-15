"use client";
import React from "react";
import { motion } from "framer-motion";
import { Beams } from "./Beams";
import { Rays } from "./Rays";
import { Lens } from "./Loupe";
import Image5 from '../assets/ht6.jpg';
import { useTranslation } from "react-i18next";

export const MedicalZoomSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-20 overflow-hidden"
    style={{background:'rgb(254, 244, 230)'
    }}>
      {/* Arrière-plan décoratif */}


      <div className="relative max-w-7xl mx-auto px-6 z-10">
        {/* Section texte au-dessus */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-munika text-gray-900 mb-4">
            <span className="text-orange-800 font-munika">{t("zoom_micro_accuracy_title")}</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-munika">
            {t("zoom_micro_accuracy_desc")}
          </p>
        </motion.div>

        {/* Conteneur de la loupe avec légende */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-munika text-gray-800 mb-4">
              {t("zoom_exclusive_technique_title")}
            </h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-munika">{t("zoom_precise_extraction")}</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-munika">{t("zoom_sorting_preservation")}</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-munika">{t("zoom_angular_placement")}</span>
              </li>
            </ul>
          </div>

          {/* Composant Loupe avec contenu médical */}
          <Lens
            zoomFactor={2}
            lensSize={220}
            className="rounded-xl border border-gray-200 shadow-lg"
          >
            <div className="w-full h-full bg-gray-50 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="relative inline-block">
                  <img
                    src={Image5}
                    alt={t("zoom_img_alt")}
                    className="rounded-lg w-full max-w-md"
                  />
                </div>
                <p className="mt-4 text-sm text-gray-500 font-munika">
                  {t("zoom_hover_label")}
                </p>
              </div>
            </div>
          </Lens>
        </div>

        {/* Légende technique */}
        <div className="mt-12 bg-orange-50/50 p-6 rounded-lg border border-orange-100 max-w-4xl mx-auto">
          <h4 className="font-munika text-orange-800 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
            {t("zoom_quality_commitment_title")}

          </h4>
          <p className="text-gray-700 font-munika">
            {t("zoom_quality_commitment_desc")}
          </p>
        </div>
      </div>
    </section>
  );
};