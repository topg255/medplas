import React, { useState, useRef } from 'react';
import L from '../assets/carth.png'
import Z from '../assets/zitouna.png'

export const TestimonialsSection = () => {
  const [activeTestimonialType, setActiveTestimonialType] = useState('videos');
  const [testimonialType, setTestimonialType] = useState('video'); // 'video' ou 'text'
  const [activePartnerTab, setActivePartnerTab] = useState('cliniques');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    role: '',
    quote: '',
    beforeImage: null,
    afterImage: null,
    videoFile: null,
    videoPreview: null
  });

  // Références séparées pour chaque type de fichier
  const videoInputRef = useRef(null);
  const beforeImageInputRef = useRef(null);
  const afterImageInputRef = useRef(null);

  // Données des témoignages
  const [videoTestimonials, setVideoTestimonials] = useState([
    {
      id: 1,
      name: "Sophie D.",
      role: "Patient de rhinoplastie",
      quote: "Une transformation qui a changé ma vie. Le suivi post-opératoire était exceptionnel.",
      beforeImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
      afterImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
      videoThumbnail: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=225&q=80",
      videoUrl: "https://example.com/videos/sophie.mp4"
    }
  ]);

  const [textTestimonials, setTextTestimonials] = useState([
    {
      id: 1,
      name: "Élodie T.",
      role: "Patient de blépharoplastie",
      quote: "L'équipe médicale a été d'une grande écoute et professionnalisme. Les résultats sont parfaitement naturels.",
      rating: 5
    }
  ]);

  // Données des partenariats
  const clinics = [
    { id: 1, name: "Clinique Carthagene, Tunisie", logo: L, certification: "Certifiée HAS" },
    { id: 2, name: "Clinique Zitouna, Sousse", logo: Z, certification: "Certifiée HAS" }

  ];

  const brands = [
    { id: 1, name: "DermalFillers Co", logo: "https://via.placeholder.com/150x80?text=DermalFillers", partnership: "Partenaire officiel depuis 2018" }
  ];

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'video') {
      const previewUrl = URL.createObjectURL(file);
      setNewTestimonial({
        ...newTestimonial,
        videoFile: file,
        videoPreview: previewUrl
      });
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewTestimonial({
          ...newTestimonial,
          [type]: event.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (testimonialType === 'video' && (!newTestimonial.videoFile || !newTestimonial.beforeImage || !newTestimonial.afterImage)) {
      alert('Veuillez sélectionner une vidéo et des images avant/après');
      return;
    }

    if (testimonialType === 'text' && !newTestimonial.quote) {
      alert('Veuillez saisir votre témoignage');
      return;
    }

    setIsUploading(true);

    // Simulation d'upload avec progression
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 3000));

    clearInterval(interval);

    if (testimonialType === 'video') {
      // Ajouter le nouveau témoignage vidéo
      const newVideoTestimonial = {
        id: videoTestimonials.length + 1,
        name: newTestimonial.name || 'Anonyme',
        role: newTestimonial.role || 'Patient',
        quote: newTestimonial.quote || 'Très satisfait des résultats',
        beforeImage: newTestimonial.beforeImage,
        afterImage: newTestimonial.afterImage,
        videoThumbnail: newTestimonial.videoPreview,
        videoUrl: URL.createObjectURL(newTestimonial.videoFile)
      };
      setVideoTestimonials([...videoTestimonials, newVideoTestimonial]);
    } else {
      // Ajouter le nouveau témoignage texte
      const newTextTestimonial = {
        id: textTestimonials.length + 1,
        name: newTestimonial.name || 'Anonyme',
        role: newTestimonial.role || 'Patient',
        quote: newTestimonial.quote,
        rating: 5 // Vous pouvez ajouter un système de notation si besoin
      };
      setTextTestimonials([...textTestimonials, newTextTestimonial]);
    }

    setIsUploading(false);
    setUploadProgress(0);
    setShowUploadModal(false);
    setNewTestimonial({
      name: '',
      role: '',
      quote: '',
      beforeImage: null,
      afterImage: null,
      videoFile: null,
      videoPreview: null
    });
  };

  const triggerFileInput = (type) => {
    switch (type) {
      case 'video':
        videoInputRef.current.click();
        break;
      case 'beforeImage':
        beforeImageInputRef.current.click();
        break;
      case 'afterImage':
        afterImageInputRef.current.click();
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Témoignages */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-munika text-blue-800 sm:text-4xl flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Témoignages de Patients
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl font-munika text-gray-500 sm:mt-4">
              Découvrez les retours d'expérience de nos patients
            </p>
          </div>

          {/* Bouton d'ajout de témoignage */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center font-munika"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter mon témoignage
            </button>
          </div>

          {/* Navigation des types de témoignages */}
          <div className="flex justify-center mb-10">
            <nav className="flex space-x-4" aria-label="Tabs">
              <button
                onClick={() => setActiveTestimonialType('videos')}
                className={`px-4 py-2 text-sm font-munika rounded-md flex items-center ${activeTestimonialType === 'videos' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Témoignages vidéos
              </button>
              <button
                onClick={() => setActiveTestimonialType('text')}
                className={`px-4 py-2 text-sm font-munika rounded-md flex items-center ${activeTestimonialType === 'text' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Témoignages écrits
              </button>
            </nav>
          </div>

          {/* Contenu des témoignages */}
          <div className="mt-8">
            {activeTestimonialType === 'videos' && (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
                {videoTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-white overflow-hidden shadow-xl rounded-lg">
                    <div className="relative">
                      {testimonial.videoThumbnail ? (
                        <img className="w-full h-48 object-cover" src={testimonial.videoThumbnail} alt="" />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <button
                        onClick={() => setSelectedVideo(testimonial)}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="bg-white bg-opacity-75 hover:bg-opacity-90 rounded-full p-4">
                          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          </svg>
                        </div>
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                          {testimonial.beforeImage && (
                            <div className="relative group">
                              <img className="w-16 h-16 rounded-full object-cover" src={testimonial.beforeImage} alt="Avant" />
                              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs">Avant</span>
                              </div>
                            </div>
                          )}
                          {testimonial.afterImage && (
                            <div className="relative group">
                              <img className="w-16 h-16 rounded-full object-cover" src={testimonial.afterImage} alt="Après" />
                              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs">Après</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          Vidéo
                        </div>
                      </div>
                      {testimonial.quote && (
                        <blockquote className="mt-4">
                          <p className="text-base font-munika text-gray-600 italic">"{testimonial.quote}"</p>
                        </blockquote>
                      )}
                      <div className="mt-4">
                        <div className="flex items-center">
                          <div>
                            <p className="text-sm font-munika text-gray-900">{testimonial.name}</p>
                            {testimonial.role && <p className="text-sm text-gray- font-munika">{testimonial.role}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTestimonialType === 'text' && (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
                {textTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-white overflow-hidden shadow-xl rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <blockquote>
                          <p className="text-base font-munika text-gray-600 italic">"{testimonial.quote}"</p>
                        </blockquote>
                      </div>
                      <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        Texte
                      </div>
                    </div>
                    <div className="mt-6 flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-munika text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500 font-munika">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section Partenariats */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-munika text-blue-800 sm:text-4xl flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Nos Partenariats
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl font-munika text-gray-500 sm:mt-4">
              Collaborations avec des établissements de santé certifiés
            </p>
          </div>

          {/* Navigation des types de partenariats */}
          <div className="flex justify-center mb-10">
            <nav className="flex space-x-4" aria-label="Tabs">
              <button
                onClick={() => setActivePartnerTab('cliniques')}
                className={`px-4 py-2 text-sm font-munika rounded-md flex items-center ${activePartnerTab === 'cliniques' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Cliniques certifiées
              </button>
              <button
                onClick={() => setActivePartnerTab('marques')}
                className={`px-4 py-2 text-sm font-munika rounded-md flex items-center ${activePartnerTab === 'marques' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Marques partenaires
              </button>
            </nav>
          </div>

          {/* Contenu des partenariats */}
          <div className="mt-8">
            {activePartnerTab === 'cliniques' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {clinics.map((clinic) => (
                  <div key={clinic.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center font-munika">
                    <div className="flex-shrink-0 mb-4">
                      <img className="h-16" src={clinic.logo} alt={clinic.name} />
                    </div>
                    <h3 className="text-lg font-munika text-gray-900 mb-1">{clinic.name}</h3>
                    <div className="flex items-center text-sm text-blue-600 mt-2">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {clinic.certification}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activePartnerTab === 'marques' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {brands.map((brand) => (
                  <div key={brand.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col font-munika items-center text-center">
                    <div className="flex-shrink-0 mb-4">
                      <img className="h-16" src={brand.logo} alt={brand.name} />
                    </div>
                    <h3 className="text-lg font-munika text-gray-900 mb-1">{brand.name}</h3>
                    <p className="text-sm text-gray-500 mt-2">{brand.partnership}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal pour la vidéo */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-munika text-gray-900">Témoignage vidéo - {selectedVideo.name}</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                {selectedVideo.videoUrl ? (
                  <video controls className="w-full h-full">
                    <source src={selectedVideo.videoUrl} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture de vidéos.
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {selectedVideo.beforeImage && (
                  <div className="text-center">
                    <p className="text-sm font-munika text-gray-500">Avant</p>
                    <img className="mx-auto h-32 w-32 rounded-full object-cover mt-2" src={selectedVideo.beforeImage} alt="Avant" />
                  </div>
                )}
                {selectedVideo.afterImage && (
                  <div className="text-center">
                    <p className="text-sm font-munika text-gray-500">Après</p>
                    <img className="mx-auto h-32 w-32 rounded-full object-cover mt-2" src={selectedVideo.afterImage} alt="Après" />
                  </div>
                )}
              </div>
              {selectedVideo.quote && (
                <div className="mt-6">
                  <blockquote>
                    <p className="text-gray-600 italic font-munika">"{selectedVideo.quote}"</p>
                  </blockquote>
                  <div className="mt-4">
                    <p className="text-sm font-munika text-gray-900">{selectedVideo.name}</p>
                    {selectedVideo.role && <p className="text-sm font-munika text-gray-500">{selectedVideo.role}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal d'upload - MODIFIÉE */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl overflow-hidden mt-16 mb-8">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-munika text-gray-900">
                {testimonialType === 'video' ? 'Ajouter mon témoignage vidéo' : 'Ajouter mon témoignage écrit'}
              </h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setIsUploading(false);
                  setUploadProgress(0);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Onglets pour choisir le type de témoignage */}
            <div className="flex border-b">
              <button
                onClick={() => setTestimonialType('video')}
                className={`flex-1 py-3 font-munika ${testimonialType === 'video' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              >
                Témoignage Vidéo
              </button>
              <button
                onClick={() => setTestimonialType('text')}
                className={`flex-1 py-3 font-munika ${testimonialType === 'text' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              >
                Témoignage Écrit
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              <form onSubmit={handleUpload}>
                <div className="space-y-6">
                  {/* Champs communs */}
                  <div>
                    <label className="block text-sm font-munika text-gray-700 mb-1">Votre nom (optionnel)</label>
                    <input
                      type="text"
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Marie D."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-munika text-gray-700 mb-1">Type d'intervention (optionnel)</label>
                    <input
                      type="text"
                      value={newTestimonial.role}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                      className="w-full border font-munika border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Rhinoplastie"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-munika text-gray-700 mb-1">Votre témoignage {testimonialType === 'text' && '(obligatoire)'}</label>
                    <textarea
                      value={newTestimonial.quote}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Décrivez votre expérience..."
                      required={testimonialType === 'text'}
                    />
                  </div>

                  {/* Champs spécifiques au type de témoignage */}
                  {testimonialType === 'video' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-munika text-gray-700 mb-2">Vidéo de témoignage (obligatoire)</label>
                        <div
                          onClick={() => triggerFileInput('video')}
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                        >
                          {newTestimonial.videoPreview ? (
                            <div className="relative">
                              <video className="w-full h-48 object-cover rounded-md" src={newTestimonial.videoPreview} controls />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setNewTestimonial({ ...newTestimonial, videoFile: null, videoPreview: null });
                                }}
                                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                              >
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <>
                              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <p className="mt-2 text-sm font-munika text-gray-600">
                                <span className="font-munika text-blue-600">Cliquez pour uploader</span> ou glissez-déposez votre vidéo
                              </p>
                              <p className="text-xs text-gray-500 mt-1 font-munika">MP4, MOV, AVI (max. 100MB)</p>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-munika text-gray-700 mb-2">Photo avant (obligatoire)</label>
                          <div
                            onClick={() => triggerFileInput('beforeImage')}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors h-40 flex items-center justify-center"
                          >
                            {newTestimonial.beforeImage ? (
                              <div className="relative w-full h-full">
                                <img src={newTestimonial.beforeImage} alt="Avant" className="w-full h-full object-cover rounded-md" />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNewTestimonial({ ...newTestimonial, beforeImage: null });
                                  }}
                                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                                >
                                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <div>
                                <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="mt-1 text-sm font-munika text-gray-600">Ajouter une photo</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-munika text-gray-700 mb-2">Photo après (obligatoire)</label>
                          <div
                            onClick={() => triggerFileInput('afterImage')}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors h-40 flex items-center justify-center"
                          >
                            {newTestimonial.afterImage ? (
                              <div className="relative w-full h-full">
                                <img src={newTestimonial.afterImage} alt="Après" className="w-full h-full object-cover rounded-md" />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNewTestimonial({ ...newTestimonial, afterImage: null });
                                  }}
                                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                                >
                                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <div>
                                <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="mt-1 text-sm font-munika text-gray-600">Ajouter une photo</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm font-munika text-blue-800">
                        Votre témoignage écrit sera publié après modération par notre équipe.
                      </p>
                    </div>
                  )}

                  {isUploading ? (
                    <div className="pt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-munika text-gray-700">Envoi en cours...</span>
                        <span className="text-sm font-munika text-gray-700">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2 font-munika" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Publier mon témoignage
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Inputs file cachés */}
      <input
        type="file"
        ref={videoInputRef}
        onChange={(e) => handleFileChange(e, 'video')}
        className="hidden"
        accept="video/*"
      />
      <input
        type="file"
        ref={beforeImageInputRef}
        onChange={(e) => handleFileChange(e, 'beforeImage')}
        className="hidden"
        accept="image/*"
      />
      <input
        type="file"
        ref={afterImageInputRef}
        onChange={(e) => handleFileChange(e, 'afterImage')}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default TestimonialsSection;