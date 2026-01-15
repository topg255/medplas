import React, { useState } from 'react';
import { FaClinicMedical, FaTooth, FaProcedures, FaBaby, FaHeartbeat, FaEye, FaArrowRight, FaTimes } from 'react-icons/fa';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const MedicalTreatmentsSection = () => {
  // ... (conservez tout le code existant jusqu'à la partie render)

  return (
    <>
      <section ref={sectionRef} className="relative py-32 overflow-hidden">
        {/* ... (conservez tout le contenu existant de la section principale) */}
      </section>

      {/* Nouveau design de modal plus compact */}
      {selectedTreatment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeTreatmentDetail}
          ></div>
          
          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header avec image */}
            <div className="relative h-48">
              <img 
                src={selectedTreatment.image} 
                alt={selectedTreatment.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${selectedTreatment.color} opacity-60`}></div>
              
              <div className="absolute top-4 right-4">
                <button 
                  onClick={closeTreatmentDetail}
                  className="p-2 rounded-full bg-white text-gray-800 hover:bg-gray-100 transition-all"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              <div className="absolute bottom-0 left-0 p-6">
                <h2 className="text-3xl font-bold text-white">{selectedTreatment.title}</h2>
                <p className="text-white opacity-90">{selectedTreatment.overlayText?.description}</p>
              </div>
            </div>

            {/* Contenu scrollable */}
            <div className="overflow-y-auto flex-1">
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Colonne principale */}
                  <div className="lg:col-span-2">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">About the Treatment</h3>
                    <p className="text-gray-700 mb-6">
                      {selectedTreatment.longDescription}
                    </p>

                    <div className="mb-8">
                      <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Benefits</h4>
                      <ul className="space-y-3">
                        {selectedTreatment.benefits?.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 h-5 w-5 text-blue-500 mr-3 mt-0.5">
                              <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </span>
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-xl p-6 sticky top-0">
                      <h4 className="text-xl font-semibold text-gray-900 mb-4">Treatment Details</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-500">Procedure Time</h5>
                          <p className="text-gray-900 font-medium">{selectedTreatment.procedureDetails.time}</p>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium text-gray-500">Recovery Time</h5>
                          <p className="text-gray-900 font-medium">{selectedTreatment.procedureDetails.recovery}</p>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium text-gray-500">Results Duration</h5>
                          <p className="text-gray-900 font-medium">{selectedTreatment.procedureDetails.results}</p>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium text-gray-500">Anesthesia</h5>
                          <p className="text-gray-900 font-medium">{selectedTreatment.procedureDetails.anesthesia}</p>
                        </div>
                      </div>

                      <button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors">
                        Book a Consultation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {selectedTreatment.stats} • 98% Patient Satisfaction
                </span>
                <button className="text-blue-600 font-medium text-sm inline-flex items-center">
                  Download Brochure
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default MedicalTreatmentsSection;