import React, { useState, useEffect } from "react";
import { cn } from "../utils/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconBrandYoutubeFilled,
  IconX,
  IconArrowRight,
  IconLeaf,
  IconHeartHandshake,
  IconWorld,
  IconMapPin,
  IconSpray, // Placeholder for Hair Transplant
  IconDental, // Placeholder for Dentistry
  IconBabyBottle, // Placeholder for IVF
  IconSun, // Placeholder for Healthy Holiday
  IconScissors // Placeholder for Plastic Surgery
} from "@tabler/icons-react";
import A from '../assets/df.jpg';
import B from '../assets/aa.jpg';
import C from '../assets/rh.jpg';
import E from '../assets/rr.jpg';
import F from '../assets/jj.jpg';
import G from '../assets/he.jpg';
import { useTranslation } from "react-i18next";

// Animations améliorées
const featureVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
      delay: index * 0.15
    }
  })
};

const skeletonVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1]
    }
  },
  hover: {
    opacity: 0.95,
    scale: 1.05,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const curtainVariants = {
  hidden: { y: "-100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: {
    y: "-100%",
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

const treatmentItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.1 + 0.2,
      duration: 0.5
    }
  })
};

// Icônes correspondant à chaque feature
const featureIcons = [
  <IconLeaf className="text-emerald-500" size={28} />,
  <IconHeartHandshake className="text-blue-500" size={28} />,
  <IconWorld className="text-amber-500" size={28} />,
  <IconMapPin className="text-rose-500" size={28} />
];

// Données des traitements avec href
const treatments = [
  {
    title: "Hair Transplant",
    description: "Restore confidence with advanced FUE and DHI hair transplant techniques by expert surgeons.",
    icon: <IconSpray className="text-blue-500" size={32} />,
    href: "http://localhost:3007/"
  },
  {
    title: "Dentistry",
    description: "Achieve a radiant smile with cosmetic dentistry, implants, and whitening treatments.",
    icon: <IconDental className="text-blue-500" size={32} />,
    href: "http://localhost:3005/"
  },
  {
    title: "IVF",
    description: "Pursue your dream of parenthood with personalized fertility treatments and support.",
    icon: <IconBabyBottle className="text-blue-500" size={32} />,
    href: "http://localhost:3008/"
  },
  {
    title: "Healthy Holiday",
    description: "Rejuvenate with wellness programs in a serene Mediterranean setting.",
    icon: <IconSun className="text-blue-500" size={32} />,
    href: "http://localhost:3009/"
  },
  {
    title: "Plastic Surgery",
    description: "Enhance your appearance with safe, expert-led cosmetic procedures tailored to you.",
    icon: <IconScissors className="text-blue-500" size={32} />,
    href: "http://localhost:3006/"
  }
];

// Hook de parallax personnalisé
const useParallax = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
};

const FeatureModal = ({ feature, onClose }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Glass morphism backdrop with enhanced blur */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-xl"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Modal Content */}
      <motion.div
        className="relative w-full max-w-4xl z-[110] h-[95vh] flex flex-col rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl overflow-hidden border border-gray-700/50"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
      >
        {/* Header with gradient */}
        <div className="border-b border-gray-700/50 bg-gradient-to-r z-[120] from-blue-900/30 to-indigo-900/30 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 rounded-xl bg-blue-900/20 backdrop-blur-sm border border-blue-700/20">
                {feature.icon}
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold font-bump text-white">{feature.title}</h2>
                <p className="text-blue-300/80 text-xs font-bump md:text-sm">{t("tunisia_modal_premium_details")}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-white hover:bg-white hover:text-black transition-colors"
              aria-label={t("tunisia_modal_close")}
            >
              <IconX size={20} className="md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* Content with optimized scroll and hidden scrollbar */}
        <div className="flex-grow overflow-y-auto p-4 md:p-6 scrollbar-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Left column - Media */}
            <div className="relative h-64 lg:h-[calc(100%-2rem)] rounded-xl overflow-hidden">
              {feature.skeleton}
            </div>

            {/* Right column - Details */}
            <div className="space-y-4 md:space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-gray-700/30">
                <h3 className="text-base md:text-lg font-bold font-bump text-white mb-3">{t("tunisia_modal_highlights")}</h3>
                <p className="text-gray-300 leading-relaxe font-bump text-sm md:text-base">{feature.description}</p>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm p-4 md:p-6 rounded-xl border border-gray-700/30">
                <h3 className="text-base md:text-lg font-bold font-bump text-white mb-3">{t("tunisia_modal_key_benefits")}</h3>
                <ul className="space-y-3">
                  {[t("tunisia_benefit1"), t("tunisia_benefit2"), t("tunisia_benefit3"), t("tunisia_benefit4")].map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <div className="flex-shrink-0 mt-1 mr-3 text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <span className="text-gray-300 font-bump text-sm md:text-base">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {feature.stats.map((stat, i) => (
                  <div key={i} className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 p-3 md:p-4 rounded-lg border border-blue-700/20 text-center">
                    <div className="text-xl md:text-2xl font-bold font-bump text-white">{stat.value}</div>
                    <div className="text-xs text-blue-300 font-bump uppercase tracking-wider mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <style jsx global>{`
          .scrollbar-hidden {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hidden::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </motion.div>
    </motion.div>
  );
};

const TreatmentsModal = ({ onClose }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col bg-gradient-to-br from-gray-900 to-gray-800"
      variants={curtainVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Fond flouté */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Contenu du modal */}
      <div className="relative z-[110] flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-700/50">
          <h2 className="text-2xl md:text-3xl font-bold font-bump text-white">{t("tunisia_treatments_title")}</h2>
          <motion.button
            onClick={onClose}
            className="p-2 rounded-full text-white hover:bg-gray-700 transition-colors"
            aria-label={t("tunisia_modal_close")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IconX size={24} />
          </motion.button>
        </div>

        {/* Treatments List */}
        <div className="flex-grow overflow-y-auto p-4 md:p-8 scrollbar-hidden">
          <div className="max-w-4xl mx-auto space-y-6">
            {treatments.map((treatment, index) => (
              <motion.div
                key={treatment.title}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-blue-500/50 transition-colors"
                variants={treatmentItemVariants}
                custom={index}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)" }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-900/20">
                    {treatment.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-bump text-white">{t(treatment.title)}</h3>
                    <p className="text-gray-300 font-bump mt-1">{t(treatment.description)}</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => window.location.replace(treatment.href)}
                  className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-bump flex items-center"
                  whileHover={{ x: 4 }}
                >
                  {t("tunisia_learn_more")} <IconArrowRight size={16} className="ml-1" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  );
};

export function FeaturesSectionDemo() {
  const { t } = useTranslation();
  const scrollY = useParallax();
  const [activeFeature, setActiveFeature] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showTreatments, setShowTreatments] = useState(false);

  // Données des fonctionnalités enrichies
  const features = [
    {
      title: t("tunisia_feature1_title"),
      description: t("tunisia_feature1_desc"),
      skeleton: <SkeletonOne />,
      className: "col-span-1 lg:col-span-3",
      icon: featureIcons[0],
      stats: [
        { value: "70%", label: t("tunisia_feature1_stat1") },
        { value: "€2,500", label: t("tunisia_feature1_stat2") }
      ],
      details: {
        highlights: [
          "Dental implants from €800 (vs €2,500 in Europe)",
          "Hip replacement from €6,500 (vs €15,000 in Europe)",
          "LASIK eye surgery from €800 (vs €2,000 in Europe)"
        ],
        testimonials: [
          {
            name: "Sarah Johnson",
            quote: "Saved over €7,000 on my dental work with identical quality to what I would have received back home in Germany."
          }
        ]
      }
    },
    {
      title: t("tunisia_feature2_title"),
      description: t("tunisia_feature2_desc"),
      skeleton: <SkeletonTwo />,
      className: "col-span-1 lg:col-span-3",
      icon: featureIcons[1],
      stats: [
        { value: "98%", label: t("tunisia_feature2_stat1") }
      ],
      details: {
        highlights: [
          "Doctors trained at top European and American institutions",
          "State-of-the-art medical equipment",
          "Strict international hygiene and safety standards"
        ],
        testimonials: [
          {
            name: "Dr. Markus Weber",
            quote: "Our team includes specialists who have practiced at leading hospitals across Europe, bringing world-class expertise to Tunisia."
          }
        ]
      }
    },
    {
      title: t("tunisia_feature3_title"),
      description: t("tunisia_feature3_desc"),
      skeleton: <SkeletonThree />,
      className: "col-span-1 lg:col-span-3",
      icon: featureIcons[2],
      stats: [
        { value: "3000+", label: t("tunisia_feature3_stat1") },
        { value: "300+", label: t("tunisia_feature3_stat2") }
      ],
      details: {
        highlights: [
          "Private guided tours to UNESCO World Heritage sites",
          "Luxury recovery resorts with Mediterranean views",
          "Customized wellness programs combining treatment with relaxation"
        ],
        testimonials: [
          {
            name: "Emma Laurent",
            quote: "Recovering by the sea after my procedure was the perfect way to heal. The cultural experiences made it a true journey."
          }
        ]
      }
    },
    {
      title: t("tunisia_feature4_title"),
      description: t("tunisia_feature4_desc"),
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3",
      icon: featureIcons[3],
      stats: [
        { value: "24/7", label: t("tunisia_feature4_stat1") },
        { value: "100%", label: t("tunisia_feature4_stat2") }
      ],
      details: {
        highlights: [
          "Door-to-door service from your home country",
          "Personal medical coordinator fluent in your language",
          "Five-star recovery accommodations included"
        ],
        testimonials: [
          {
            name: "Thomas Müller",
            quote: "The concierge team handled everything - flights, transfers, hotel, even restaurant reservations. It was completely stress-free."
          }
        ]
      }
    },
  ];

  return (
    <div className="relative z-20 py-12 lg:py-20 max-w-7xl mx-auto">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-[200px] -right-[100px] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-100/30 to-blue-200/10 blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div
          className="absolute -bottom-[300px] -left-[200px] w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-white to-blue-100/10 blur-3xl"
          style={{ transform: `translateY(${scrollY * -0.05}px)` }}
        />
      </div>

      <div className="relative px-4 lg:px-6 text-center">
        {/* Section title with floating accents */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.7, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-blue-400/10 blur-3xl z-0"
          />

          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block text-blue-600 font-bump tracking-wider mb-2"
          >
            {t("tunisia_wellness_destination")}
          </motion.span>

          <motion.h4
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl lg:text-6xl font-bold font-bump bg-clip-text text-transparent bg-gradient-to-r from-blue-800 via-blue-800 to-blue-800 mb-6"
          >
            {t("tunisia_discover_title")}
          </motion.h4>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="relative h-[3px] w-40 mx-auto my-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent blur-sm" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-bump leading-relaxed"
          >
            {t("tunisia_discover_desc")}
          </motion.p>
        </div>

        {/* Featured stats ticker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-8 mt-12 text-center"
        >
          {[
            { value: "70%", label: t("tunisia_stat_cost_savings") },
            { value: "98%", label: t("tunisia_stat_patient_satisfaction") },
            { value: "24/7", label: t("tunisia_stat_vip_support") }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
              className="group"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-3xl md:text-4xl font-bold text-blue-700 group-hover:text-blue-600 transition-colors"
              >
                {stat.value}
              </motion.div>
              <div className="text-sm font-bump text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Feature cards with enhanced hover effects */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 lg:grid-cols-6 gap-6 mt-12 px-4 lg:px-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            variants={featureVariants}
            custom={index}
            className={cn(
              "group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300",
              "border border-blue-50 hover:border-blue-100",
              feature.className
            )}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            onHoverStart={() => setActiveFeature(index)}
            onHoverEnd={() => setActiveFeature(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
            <div className="p-6 lg:p-8 h-full flex flex-col z-10 relative">
              <div className="flex items-center mb-4">
                <div className="mr-3 p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl lg:text-2xl font-bold font-bump text-gray-800 group-hover:text-blue-800 transition-colors duration-300">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 font-bump mb-6 flex-grow leading-relaxed">
                {feature.description}
              </p>
              <div className="flex gap-4 mb-6">
                {feature.stats.map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-2xl font-bold text-blue-700">{stat.value}</span>
                    <span className="text-xs font-bump text-gray-500 uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>
              <div className="h-48 lg:h-64 w-full rounded-xl overflow-hidden relative">
                <AnimatePresence>
                  {activeFeature === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 border-2 border-blue-400/50 rounded-xl z-20 pointer-events-none"
                    />
                  )}
                </AnimatePresence>
                {feature.skeleton}
              </div>
              <div className="mt-4 flex items-center justify-end">
                <motion.button
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-blue-600 text-sm font-bump flex items-center group-hover:text-blue-800"
                  onClick={() => setSelectedFeature(feature)}
                  whileHover={{ x: 2 }}
                >
                  <span>{t("tunisia_learn_more")}</span>
                  <IconArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <PremiumCTA setShowTreatments={setShowTreatments} />
      <AnimatePresence>
        {selectedFeature && (
          <FeatureModal
            feature={selectedFeature}
            onClose={() => setSelectedFeature(null)}
          />
        )}
        {showTreatments && (
          <TreatmentsModal
            onClose={() => setShowTreatments(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const PremiumCTA = ({ setShowTreatments }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="flex flex-col items-center mt-12 px-4"
    >
      <div className="relative w-full max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-emerald-500/20 rounded-3xl blur-3xl"
        />
        <motion.div
          className="relative bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 md:p-12 border border-blue-100/50 overflow-hidden"
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)" }}
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-200/30 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-200/30 rounded-full blur-2xl" />
          <div className="relative z-10">
            <h4 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">{t("tunisia_cta_title")}</h4>
            <p className="text-gray-600 font-bump text-center mb-8 max-w-xl mx-auto">
              {t("tunisia_cta_desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => setShowTreatments(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 text-lg font-bump text-blue-700 bg-white border border-blue-200 rounded-full shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center"
              >
                <span>{t("tunisia_explore_treatments")}</span>
                <IconArrowRight className="ml-2" size={18} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

const SkeletonOne = () => {
  return (
    <motion.div
      className="relative h-full w-full overflow-hidden rounded-xl"
      variants={skeletonVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <motion.img
        src={F}
        alt="Affordable medical costs in Tunisia"
        className="h-full w-full object-cover"
        initial={{ scale: 1.1 }}
        animate={{
          scale: 1,
          transition: { duration: 10, ease: "easeInOut" }
        }}
        whileHover={{
          scale: 1.08,
          transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] }
        }}
      />
    </motion.div>
  );
};

const SkeletonTwo = () => {
  const images = [A, G, C, F, G];
  const imageSize = "h-28";

  return (
    <motion.div
      className="relative h-full w-full overflow-hidden rounded-xl"
      variants={skeletonVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-blue-50" />
      <motion.div
        className="absolute top-8 left-0 flex gap-4 items-center pr-4"
        animate={{
          x: ["0%", "-100%"],
          transition: { duration: 40, repeat: Infinity, ease: "linear" }
        }}
      >
        {[...images, ...images].map((image, idx) => (
          <motion.div
            key={`row1-${idx}`}
            className={`flex-shrink-0 ${imageSize} w-40 rounded-xl overflow-hidden shadow-lg border-2 border-white`}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: idx * 0.15, duration: 0.6 }
            }}
            whileHover={{
              scale: 1.12,
              zIndex: 20,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
            }}
          >
            <img
              src={image}
              alt="Medical facility"
              className="h-full w-full object-cover"
            />
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        className="absolute top-1/3 left-0 flex gap-4 items-center pr-4"
        animate={{
          x: ["-50%", "-150%"],
          transition: { duration: 30, repeat: Infinity, ease: "linear" }
        }}
      >
        {[...images].reverse().map((image, idx) => (
          <motion.div
            key={`row2-${idx}`}
            className={`flex-shrink-0 ${imageSize} w-44 rounded-xl overflow-hidden shadow-xl border-2 border-white`}
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: idx * 0.15 + 0.4, duration: 0.6 }
            }}
            whileHover={{
              scale: 1.15,
              zIndex: 20,
              boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.4)"
            }}
          >
            <img
              src={image}
              alt="Medical facility"
              className="h-full w-full object-cover"
            />
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        className="absolute bottom-8 left-0 flex gap-4 items-center pr-4"
        animate={{
          x: ["-30%", "-130%"],
          transition: { duration: 25, repeat: Infinity, ease: "linear" }
        }}
      >
        {[...images, ...images].map((image, idx) => (
          <motion.div
            key={`row3-${idx}`}
            className={`flex-shrink-0 ${imageSize} w-36 rounded-xl overflow-hidden shadow-md border-2 border-white/90`}
            initial={{ opacity: 0, y: 40 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: idx * 0.1 + 0.8, duration: 0.6 }
            }}
            whileHover={{
              scale: 1.08,
              zIndex: 20,
              boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.25)"
            }}
          >
            <img
              src={image}
              alt="Medical facility"
              className="h-full w-full object-cover"
            />
          </motion.div>
        ))}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent z-5" />
    </motion.div>
  );
};

const SkeletonThree = () => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.a
      href="https://youtu.be/OtJVufo3IrA"
      target="_blank"
      rel="noopener noreferrer"
      className="relative h-full w-full block rounded-xl overflow-hidden"
      variants={skeletonVariants}
      initial="hidden"
      animate="visible"
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      whileHover={{ filter: "brightness(1.1)", transition: { duration: 0.3 } }}
    >
      <motion.img
        src={E}
        alt="Discover Tunisia"
        className="h-full z- w-full object-cover"
        animate={{
          scale: isHovering ? 1.08 : 1,
          filter: isHovering ? "blur(0px)" : "blur(0px)",
          transition: {
            duration: isHovering ? 0.5 : 10,
            ease: isHovering ? [0.33, 1, 0.68, 1] : "easeInOut"
          }
        }}
      />
      <motion.div
        className="absolute inset-0 bg-black/40 flex items-center justify-center"
        animate={{
          backgroundColor: isHovering ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.4)",
          transition: { duration: 0.3 }
        }}
      >
        <motion.div
          className="text-center"
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{
            scale: isHovering ? 1.1 : 1,
            opacity: 1,
            transition: { delay: 0.1, duration: 0.4, ease: [0.33, 1, 0.68, 1] }
          }}
        >
          <motion.div
            className="bg-white/90 backdrop-blur-sm p-3 rounded-full"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <IconBrandYoutubeFilled className="h-10 w-10 text-red-600" />
          </motion.div>
          <AnimatePresence>
            {isHovering && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.3 }}
                className="text-white font-bump mt-2 text-sm"
              >
                Watch Tunisia Experience
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.a>
  );
};

const SkeletonFour = () => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      className="relative h-full w-full rounded-xl overflow-hidden"
      variants={skeletonVariants}
      initial="hidden"
      animate="visible"
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <motion.img
        src={B}
        alt="Travel assistance"
        className="h-full w-full object-cover"
        initial={{ scale: 1.05 }}
        animate={{
          scale: isHovering ? 1.1 : 1,
          transition: {
            duration: isHovering ? 0.7 : 10,
            ease: isHovering ? [0.33, 1, 0.68, 1] : "easeInOut"
          }
        }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
        animate={{
          opacity: isHovering ? 0.9 : 0.7,
          transition: { duration: 0.3 }
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 p-6 text-white w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.5, duration: 0.5 }
        }}
      />
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-bold shadow-lg"
      >
        VIP Service
      </motion.div>
    </motion.div>
  );
};