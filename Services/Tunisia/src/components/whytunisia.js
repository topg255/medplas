import React from 'react';
import { FiCheckCircle, FiDollarSign, FiStar, FiAward, FiGlobe, FiHeart } from 'react-icons/fi';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import T1 from '../assets/tunisia1.jpg';
import T2 from '../assets/tunisia2.jpg';
import T3 from '../assets/tozeur.jpg';
import T4 from '../assets/tunisia4.jpg';
import T5 from '../assets/tunisia5.jpg';
import T6 from '../assets/tunisia6.jpg';
//import V from '../assets/tourismh.mp4';
import DR from '../assets/drap.jpg';

export const WhyTunisia = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const features = [
    {
      icon: <FiAward className="text-3xl" />,
      title: "Expertise Médicale de Classe Mondiale",
      description: "Cliniques certifiées JCI avec des technologies de pointe et des médecins formés dans les meilleures universités",
      image: T1,
      color: "bg-blue-500"
    },
    {
      icon: <FiDollarSign className="text-3xl" />,
      title: "Économies Exceptionnelles",
      description: "Jusqu'à 70% d'économies par rapport à l'Europe et l'Amérique du Nord sans compromis sur la qualité",
      image: T3,
      color: "bg-emerald-500"
    },
    {
      icon: <FiGlobe className="text-3xl" />,
      title: "Destination Culturelle Unique",
      description: "Découvrez 3000 ans d'histoire entre sites antiques, médinas et paysages désertiques époustouflants",
      image: T2,
      color: "bg-amber-500"
    },
    {
      icon: <FiStar className="text-3xl" />,
      title: "Hospitalité Légendaire",
      description: "Un peuple accueillant et une infrastructure touristique haut de gamme pour votre confort",
      image: T5,
      color: "bg-purple-500"
    },
    {
      icon: <FiHeart className="text-3xl" />,
      title: "Suivi Médical Personnalisé",
      description: "Coordination complète de votre séjour avec un assistant dédié 24/7",
      image: T6,
      color: "bg-rose-500"
    },
    {
      icon: <FiCheckCircle className="text-3xl" />,
      title: "Logistique Simplifiée",
      description: "Visa médical facilité, transferts privés et interprètes professionnels inclus",
      image: T4,
      color: "bg-cyan-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <section className="relative overflow-hidden py-28 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 relative z-10">
        {/* Titre avec animation de texte dégradé */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="text-center mb-20"
        >
          <motion.h2
            variants={itemVariants}
            className="text-5xl font-bold mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-800">
              Pourquoi la Tunisie
            </span>
            <span className="text-blue-800"> est la destination idéale pour votre tourisme médical ?</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl font-munika text-gray-600 max-w-3xl mx-auto"
          >
            Alliez excellence médicale et expérience culturelle inoubliable dans un cadre sécurisé et enchanteur
          </motion.p>
        </motion.div>

        {/* Grille de fonctionnalités avec texte sous l'image */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Conteneur d'image avec effet de zoom */}
              <motion.div
                className="relative aspect-video overflow-hidden"
                variants={imageVariants}
                initial="hidden"
                animate={controls}
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {/* Overlay coloré */}
                <div className={`absolute inset-0 ${feature.color} opacity-20`} />
              </motion.div>

              {/* Contenu texte sous l'image */}
              <div className="p-6 bg-white">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${feature.color} text-white mr-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                </div>
                
                <p className="text-gray-600 mb-4">{feature.description}</p>
                
                {/* Ligne décorative animée */}
                <motion.div
                  className="h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                  viewport={{ once: true }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Statistiques impressionnantes */}
        <motion.div
          className="mt-20 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-12 text-white overflow-hidden"
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-8 text-center">La Tunisie en chiffres</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "15+", label: "Cliniques certifiées internationalement" },
                { number: "50k+", label: "Patients internationaux par an" },
                { number: "95%", label: "Taux de satisfaction des patients" },
                { number: "300+", label: "Médecins spécialistes bilingues" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
                    {stat.number}
                  </div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Témoignage vidéo */}
        <motion.div
          className="mt-24 bg-white rounded-3xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative aspect-video lg:aspect-auto">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                {/*<source src={V} type="video/mp4" />*/}
              </video>
            </div>

            <div className="p-12 flex flex-col justify-center">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-blue-100">
                  <img
                    src={DR}
                    alt="Patient"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-xl">Points forts de la Tunisie</h4>
                  <p className="text-blue-600">Your best destination ever</p>
                </div>
              </div>

              <ul className="list-disc pl-5 mb-6 text-gray-600 space-y-2">
                <li>Infrastructures médicales modernes et certifiées</li>
                <li>Médecins hautement qualifiés et multilingues</li>
                <li>Prix attractifs sans compromis sur la qualité</li>
                <li>Temps d'attente réduits</li>
                <li>Expérience culturelle et touristique enrichissante</li>
              </ul>

              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="text-yellow-400 text-xl" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyTunisia;