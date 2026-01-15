import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const AboutUsSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative bg-gradient-to-b from-slate-50 to-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* En-tête avec animation douce */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-slate-800 mb-4 tracking-tight">
            {t("about_title")}{" "}
            <span className="font-medium text-blue-600">
              {t("about_subtitle")}
            </span>
          </h2>
          <div className="w-20 h-1 bg-blue-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t("about_description")}
          </p>
        </motion.div>

        {/* Cartes Mission & Valeurs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-medium text-slate-800 mb-3">
              {t("about_mission_title")}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {t("about_mission_desc")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-medium text-slate-800 mb-3">
              {t("about_values_title")}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {t("about_values_desc")}
            </p>
          </motion.div>
        </div>

        {/* Bandeau informatif professionnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-8 border border-blue-100 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <svg
              className="w-5 h-5 text-blue-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-blue-900 uppercase tracking-wide">
              {t("about_professional_advice")}
            </span>
          </div>
          <p className="text-slate-700 leading-relaxed max-w-2xl mx-auto">
            {t("about_professional_desc")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUsSection;