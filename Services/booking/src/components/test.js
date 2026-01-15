import React, { useState, useRef } from 'react';

export const TestimonialsSection = () => {
  const [activeTestimonialType, setActiveTestimonialType] = useState('videos');
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

  const textTestimonials = [
    {
      id: 1,
      name: "Élodie T.",
      role: "Patient de blépharoplastie",
      quote: "L'équipe médicale a été d'une grande écoute et professionnalisme. Les résultats sont parfaitement naturels.",
      rating: 5
    }
  ];

  // Données des partenariats
  const clinics = [
    { id: 1, name: "Clinique Esthétique Paris", logo: "https://via.placeholder.com/150x80?text=Clinique+Paris", certification: "Certifiée HAS" }
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
    if (!newTestimonial.videoFile || !newTestimonial.beforeImage || !newTestimonial.afterImage) {
      alert('Veuillez sélectionner une vidéo et des images avant/après');
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

    // Ajouter le nouveau témoignage
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
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl flex items-center justify-center">
              <svg className="w-10 h-10 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Témoignages de Patients
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Découvrez les retours d'expérience de nos patients
            </p>
          </div>

          {/* Bouton d'ajout de témoignage */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter mon témoignage
            </button>
          </div>

          {/* Contenu des témoignages */}
          <div className="mt-8">
            {activeTestimonialType === 'videos' && (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
                {videoTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-white overflow-hidden shadow-xl rounded-lg">
                    <div className="flex justify-center mb-10">
                      <nav className="flex space-x-4" aria-label="Tabs">
                        <button
                          onClick={() => setActiveTestimonialType('videos')}
                          className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${activeTestimonialType === 'videos' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Témoignages vidéos
                        </button>
                        <button
                          onClick={() => setActiveTestimonialType('text')}
                          className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${activeTestimonialType === 'text' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          Témoignages écrits
                        </button>
                      </nav>
                    </div>                  </div>
                ))}
              </div>
            )}

            {activeTestimonialType === 'text' && (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
                {textTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-white overflow-hidden shadow-xl rounded-lg p-6">
                    {/* ... (contenu des témoignages textuels inchangé) ... */}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section Partenariats */}
        <div className="mt-20">
          {/* ... (contenu des partenariats inchangé) ... */}
        </div>
      </div>

      {/* Modal pour la vidéo */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl overflow-hidden">
            {/* ... (contenu de la modal vidéo inchangé) ... */}
          </div>
        </div>
      )}

      {/* Modal d'upload - MODIFIÉE */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl overflow-hidden mt-16 mb-8">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Ajouter mon témoignage vidéo</h3>
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
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              <form onSubmit={handleUpload}>
                <div className="space-y-6">
                  {/* ... (champs de formulaire inchangés) ... */}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vidéo de témoignage</label>
                      <div
                        onClick={() => triggerFileInput('video')}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-colors"
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
                            <p className="mt-2 text-sm text-gray-600">
                              <span className="font-medium text-purple-600">Cliquez pour uploader</span> ou glissez-déposez votre vidéo
                            </p>
                            <p className="text-xs text-gray-500 mt-1">MP4, MOV, AVI (max. 100MB)</p>
                          </>
                        )}
                        <input
                          type="file"
                          ref={videoInputRef}
                          onChange={(e) => handleFileChange(e, 'video')}
                          className="hidden"
                          accept="video/*"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Photo avant</label>
                        <div
                          onClick={() => triggerFileInput('beforeImage')}
                          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500 transition-colors h-40 flex items-center justify-center"
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
                              <p className="mt-1 text-sm text-gray-600">Ajouter une photo</p>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          ref={beforeImageInputRef}
                          onChange={(e) => handleFileChange(e, 'beforeImage')}
                          className="hidden"
                          accept="image/*"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Photo après</label>
                        <div
                          onClick={() => triggerFileInput('afterImage')}
                          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500 transition-colors h-40 flex items-center justify-center"
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
                              <p className="mt-1 text-sm text-gray-600">Ajouter une photo</p>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          ref={afterImageInputRef}
                          onChange={(e) => handleFileChange(e, 'afterImage')}
                          className="hidden"
                          accept="image/*"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ... (bouton de soumission inchangé) ... */}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsSection;