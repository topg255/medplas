import React from 'react';
import { FiPhone, FiAlertTriangle } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const EmergencyBanner = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative mt-16 ml-7 mr-5 overflow-hidden rounded-2xl shadow-lg"
    >
      {/* Fond avec dégradé et motif */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNwYXR0ZXJuKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')]"></div>
      </div>
      
      {/* Contenu */}
      <div className="relative z-10 px-8 py-8 md:py-10 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Partie gauche - Texte */}
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <FiAlertTriangle className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1">Assistance Médicale Urgente 24h/24</h3>
              <p className="text-red-100 max-w-2xl">
                Notre équipe médicale est disponible en permanence pour répondre à vos urgences.
                Appelez-nous à tout moment pour une assistance immédiate.
              </p>
            </div>
          </div>
          
          {/* Partie droite - Bouton d'appel */}
          <div className="flex-shrink-0">
            <a 
              href="https://wa.me/+21695064336" 
              className="flex items-center justify-center gap-3 bg-white text-red-600 hover:bg-gray-50 px-6 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
                <FiPhone className="relative w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500">Numéro d'urgence</div>
                <div className="text-xl font-bold tracking-tight">95 064 336</div>
              </div>
            </a>
          </div>
        </div>
      </div>
      
      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/20 rounded-full filter blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>
    </motion.div>
  );
};

export default EmergencyBanner;