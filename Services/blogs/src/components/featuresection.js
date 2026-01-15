import React from 'react';
import { FaHandHoldingHeart, FaUserMd, FaGlobe, FaClinicMedical, FaCalendarCheck, FaHeadset } from 'react-icons/fa';
import { motion } from 'framer-motion';

export const EnhancingJourneySection = () => {
  const features = [
    {
      icon: <FaHandHoldingHeart className="text-4xl text-white" />,
      title: "Personalized Care",
      description: "Tailored treatment plans designed specifically for your unique health needs and goals.",
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-500/5"
    },
    {
      icon: <FaUserMd className="text-4xl text-white" />,
      title: "World-Class Specialists",
      description: "Access to internationally-renowned doctors with proven track records in their fields.",
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-500/5"
    },
    {
      icon: <FaGlobe className="text-4xl text-white" />,
      title: "Global Network",
      description: "Premium healthcare facilities across 20+ countries at your fingertips.",
      color: "from-teal-500 to-teal-600",
      bg: "bg-teal-500/5"
    },
    {
      icon: <FaClinicMedical className="text-4xl text-white" />,
      title: "Cutting-Edge Technology",
      description: "State-of-the-art medical equipment and innovative treatment methods.",
      color: "from-amber-500 to-amber-600",
      bg: "bg-amber-500/5"
    },
    {
      icon: <FaCalendarCheck className="text-4xl text-white" />,
      title: "Seamless Coordination",
      description: "End-to-end support from initial consultation to post-treatment care.",
      color: "from-green-500 to-green-600",
      bg: "bg-green-500/5"
    },
    {
      icon: <FaHeadset className="text-4xl text-white" />,
      title: "24/7 Support",
      description: "Dedicated multilingual patient coordinators available round the clock.",
      color: "from-red-500 to-red-600",
      bg: "bg-red-500/5"
    }
  ];

  return (
    <section className="relative py-28 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-100 rounded-full filter blur-[100px] opacity-20"
        />
        <motion.div 
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100 rounded-full filter blur-[120px] opacity-20"
        />
      </div>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 5 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute rounded-full bg-blue-400/20"
          style={{
            width: Math.random() * 10 + 5 + 'px',
            height: Math.random() * 10 + 5 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%'
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "backOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <motion.span 
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block px-6 py-2 bg-white text-blue-600 rounded-full text-sm font-medium mb-6 shadow-md"
          >
            <span className="relative flex h-3 w-3 float-left mr-2 mt-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
            </span>
            PATIENT-CENTERED APPROACH
          </motion.span>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Enhancing Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Medical Journey</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            We transform healthcare experiences through exceptional service, innovative solutions, and compassionate care.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "backOut"
              }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              className={`${feature.bg} backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:border-transparent transition-all duration-300 relative overflow-hidden`}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Icon container */}
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className={`w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}
              >
                {feature.icon}
              </motion.div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 relative z-10">{feature.title}</h3>
              <p className="text-gray-600 relative z-10">{feature.description}</p>
              
              {/* Animated border */}
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1.5, delay: index * 0.1 + 0.5 }}
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
              />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <motion.button 
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            className="relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
          >
            {/* Animated background */}
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            
            {/* Text and icon */}
            <span className="relative z-10 flex items-center">
              <span className="mr-3">Begin Your Journey</span>
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </span>
            
            {/* Glow effect */}
            <span className="absolute -inset-1 bg-blue-400/30 rounded-2xl filter blur-md group-hover:opacity-70 transition-opacity duration-300"></span>
          </motion.button>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-6 text-gray-500 text-sm"
          >
            Get matched with your ideal specialist in less than 24 hours
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancingJourneySection;