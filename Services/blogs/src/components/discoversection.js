import React, { useRef } from 'react';
import { FaLeaf, FaHeartbeat, FaSmile, FaClinicMedical, FaRunning, FaMedal } from 'react-icons/fa';
import { motion, useScroll, useTransform } from 'framer-motion';
import wellness1 from '../assets/tunisia1.jpg';
import wellness2 from '../assets/tunisia2.jpg';
import wellness3 from '../assets/tunisia3.jpg';
import wellness4 from '../assets/tunisia4.jpg';
import wellness5 from '../assets/tunisia5.jpg';
import wellness6 from '../assets/tunisia6.jpg';

export const DiscoverBestSelfSection = () => {
  const sectionRef = useRef();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);

  const benefits = [
    {
      icon: <FaLeaf className="text-4xl text-green-400" />,
      title: "Holistic Wellness",
      description: "Comprehensive care for your mind, body and spirit",
      image: wellness1
    },
    {
      icon: <FaHeartbeat className="text-4xl text-rose-400" />,
      title: "Precision Health",
      description: "Customized treatments based on advanced diagnostics",
      image: wellness2
    },
    {
      icon: <FaSmile className="text-4xl text-amber-400" />,
      title: "Confidence Renewed",
      description: "Procedures to help you feel your absolute best",
      image: wellness3
    },
    {
      icon: <FaClinicMedical className="text-4xl text-blue-400" />,
      title: "Cutting-Edge Care",
      description: "The latest medical innovations at your service",
      image: wellness4
    },
    {
      icon: <FaRunning className="text-4xl text-purple-400" />,
      title: "Vitality Restored",
      description: "Regain energy and passion for life",
      image: wellness5
    },
    {
      icon: <FaMedal className="text-4xl text-teal-600" />,
      title: "Exceptional Results",
      description: "Proven outcomes with highest safety standards",
      image: wellness6
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-28 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-200 rounded-full filter blur-[100px]"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-200 rounded-full filter blur-[120px]"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header - Reste inchangé */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto mb-24"
        >
          <motion.span 
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-block px-5 py-2 bg-white text-blue-600 rounded-full text-sm font-medium mb-6 shadow-sm"
          >
            PREMIUM WELLNESS EXPERIENCE
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Best Self</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Elevate your wellbeing with our transformative programs and luxury healthcare services.
          </motion.p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Benefits List - Reste inchangé */}
          <div className="lg:w-1/2 space-y-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:border-transparent transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start space-x-6">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center text-white shadow-lg`}>
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Nouvelle disposition d'images */}
          <div className="lg:w-1/2 relative hidden lg:block h-[800px]">
            {/* Grille d'images */}
            <div className="grid grid-cols-2 gap-6 h-full">
              {/* Grande image en haut à gauche */}
              <motion.div
                style={{ y: y1 }}
                className="relative col-span-2 row-span-2 rounded-3xl overflow-hidden shadow-2xl"
              >
                <img
                  src={benefits[0].image}
                  alt={benefits[0].title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${benefits[0].color} opacity-10`}></div>
              </motion.div>

              {/* Petite image en bas à gauche */}
              <motion.div
                style={{ y: y2 }}
                className="relative rounded-3xl overflow-hidden shadow-xl"
              >
                <img
                  src={benefits[1].image}
                  alt={benefits[1].title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${benefits[1].color} opacity-10`}></div>
              </motion.div>

              {/* Petite image en bas à droite */}
              <motion.div
                style={{ y: y3 }}
                className="relative rounded-3xl overflow-hidden shadow-xl"
              >
                <img
                  src={benefits[2].image}
                  alt={benefits[2].title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${benefits[2].color} opacity-10`}></div>
              </motion.div>


              

              <motion.div
                style={{ y: y1 }}
                className="relative col-span-2 row-span-2 rounded-3xl overflow-hidden shadow-2xl"
              >
                <img
                  src={benefits[4].image}
                  alt={benefits[4].title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${benefits[4].color} opacity-10`}></div>
              </motion.div>
              
            </div>

            {/* Floating Decorative Elements - Reste inchangé */}
            <div className="absolute -left-12 top-1/2 w-32 h-32 rounded-full bg-purple-100/30 filter blur-xl z-0"></div>
            <div className="absolute right-0 bottom-0 w-40 h-40 rounded-full bg-emerald-100/30 filter blur-xl z-0"></div>
          </div>
        </div>

        {/* Premium CTA - Reste inchangé */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-24 text-center"
        >
        
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-6 text-gray-500 text-sm underline"
          >
            Exclusive consultation with our wellness concierge
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default DiscoverBestSelfSection;