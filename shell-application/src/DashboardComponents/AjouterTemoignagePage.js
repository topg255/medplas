// components/AjouterTemoignagePage.jsx
import React, { useState, useRef } from 'react';
import { 
  MessageCircle, 
  Video, 
  Camera, 
  StopCircle, 
  Upload, 
  Star, 
  Calendar,
  Stethoscope,
  FileText,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

export const AjouterTemoignagePage = () => {
  const [formData, setFormData] = useState({
    typeChirurgie: '',
    dateChirurgie: '',
    medecin: '',
    note: 5,
    titre: '',
    temoignage: '',
    video: null,
    consentement: false
  });
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  // Types de chirurgie disponibles
  const typesChirurgie = [
    'Chirurgie esthétique',
    'Chirurgie reconstructrice',
    'Chirurgie cardiaque',
    'Chirurgie orthopédique',
    'Chirurgie digestive',
    'Neurochirurgie',
    'Chirurgie ophtalmologique',
    'Chirurgie dentaire',
    'Autre'
  ];

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Démarrer l'enregistrement vidéo
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setVideoBlob(blob);
        setPreviewVideo(URL.createObjectURL(blob));
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Erreur accès caméra:', error);
      setErrorMessage('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
    }
  };

  // Arrêter l'enregistrement vidéo
  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      
      // Arrêter tous les tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  // Télécharger une vidéo existante
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB max
        setErrorMessage('La vidéo ne doit pas dépasser 100MB');
        return;
      }
      
      setUploadedVideo(file);
      setPreviewVideo(URL.createObjectURL(file));
      setVideoBlob(file);
    }
  };

  // Supprimer la vidéo
  const removeVideo = () => {
    setPreviewVideo(null);
    setVideoBlob(null);
    setUploadedVideo(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Soumettre le témoignage
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.consentement) {
      setErrorMessage('Vous devez accepter les conditions d\'utilisation');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Simuler l'envoi des données
      const formDataToSend = new FormData();
      formDataToSend.append('typeChirurgie', formData.typeChirurgie);
      formDataToSend.append('dateChirurgie', formData.dateChirurgie);
      formDataToSend.append('medecin', formData.medecin);
      formDataToSend.append('note', formData.note);
      formDataToSend.append('titre', formData.titre);
      formDataToSend.append('temoignage', formData.temoignage);
      formDataToSend.append('consentement', formData.consentement);

      if (videoBlob) {
        formDataToSend.append('video', videoBlob, 'temoignage-video.webm');
      }

      // Ici vous enverriez les données à votre API
      // const response = await fetch('http://localhost:3001/temoignages', {
      //   method: 'POST',
      //   body: formDataToSend
      // });

      // Simulation de succès
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSuccessMessage('Votre témoignage a été envoyé avec succès !');
      
      // Réinitialiser le formulaire
      setFormData({
        typeChirurgie: '',
        dateChirurgie: '',
        medecin: '',
        note: 5,
        titre: '',
        temoignage: '',
        video: null,
        consentement: false
      });
      removeVideo();

      // Redirection après succès
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);

    } catch (error) {
      setErrorMessage('Erreur lors de l\'envoi du témoignage. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Partager Votre Expérience</h1>
              <p className="text-slate-600">Votre témoignage peut aider d'autres patients</p>
            </div>
          </div>
        </div>

        {/* Messages de statut */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 flex-1">{successMessage}</p>
            <button onClick={() => setSuccessMessage('')}>
              <X className="w-4 h-4 text-green-600" />
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <p className="text-rose-800 flex-1">{errorMessage}</p>
            <button onClick={() => setErrorMessage('')}>
              <X className="w-4 h-4 text-rose-600" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations sur la chirurgie */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-blue-500" />
                  Informations sur l'intervention
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Type de chirurgie *
                    </label>
                    <select
                      name="typeChirurgie"
                      value={formData.typeChirurgie}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionnez un type</option>
                      {typesChirurgie.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date de l'intervention *
                    </label>
                    <input
                      type="date"
                      name="dateChirurgie"
                      value={formData.dateChirurgie}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Médecin / Chirurgien
                    </label>
                    <input
                      type="text"
                      name="medecin"
                      value={formData.medecin}
                      onChange={handleInputChange}
                      placeholder="Nom du médecin (optionnel)"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Note globale *
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, note: star }))}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= formData.note 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-slate-600">
                        {formData.note}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Témoignage écrit */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  Votre Témoignage
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Titre du témoignage *
                    </label>
                    <input
                      type="text"
                      name="titre"
                      value={formData.titre}
                      onChange={handleInputChange}
                      required
                      placeholder="Ex: Transformation incroyable après ma chirurgie..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Votre expérience détaillée *
                    </label>
                    <textarea
                      name="temoignage"
                      value={formData.temoignage}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="Décrivez votre parcours, vos attentes, le déroulement de l'intervention, les résultats, etc..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Témoignage vidéo */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple-500" />
                  Témoignage Vidéo (Optionnel)
                </h2>

                <div className="space-y-4">
                  {!previewVideo ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Enregistrement direct */}
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                        <Camera className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 font-medium mb-2">Enregistrer une vidéo</p>
                        <p className="text-sm text-slate-500 mb-4">
                          Enregistrez votre témoignage directement depuis votre caméra
                        </p>
                        <button
                          type="button"
                          onClick={startRecording}
                          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                        >
                          <Video className="w-4 h-4" />
                          Commencer l'enregistrement
                        </button>
                      </div>

                      {/* Upload de vidéo */}
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 font-medium mb-2">Télécharger une vidéo</p>
                        <p className="text-sm text-slate-500 mb-4">
                          Téléchargez une vidéo depuis votre appareil (max 100MB)
                        </p>
                        <input
                          type="file"
                          id="video-upload"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="video-upload"
                          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center gap-2 mx-auto cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          Choisir une vidéo
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Aperçu vidéo */}
                      <div className="relative">
                        <video
                          ref={videoRef}
                          src={previewVideo}
                          controls
                          className="w-full rounded-lg bg-black"
                        />
                        <button
                          onClick={removeVideo}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {recording && (
                        <div className="flex items-center justify-center gap-4">
                          <div className="flex items-center gap-2 text-rose-600">
                            <div className="w-3 h-3 bg-rose-600 rounded-full animate-pulse"></div>
                            <span className="font-medium">Enregistrement en cours...</span>
                          </div>
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <StopCircle className="w-4 h-4" />
                            Arrêter
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Consentement */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="consentement"
                    checked={formData.consentement}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      J'accepte que mon témoignage soit publié sur le site
                    </label>
                    <p className="text-sm text-slate-500 mt-1">
                      En cochant cette case, vous acceptez que votre témoignage (texte et/ou vidéo) 
                      soit publié sur notre site web et puisse être utilisé à des fins de promotion 
                      et d'information pour d'autres patients. Vos données personnelles ne seront 
                      pas partagées sans votre consentement explicite.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bouton de soumission */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.consentement}
                  className="bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-8 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5" />
                      Publier mon témoignage
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar d'information */}
          <div className="space-y-6">
            {/* Conseils pour un bon témoignage */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                Conseils pour votre témoignage
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Soyez authentique et honnête</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Décrivez votre parcours complet</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Parlez des résultats et de votre satisfaction</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Respectez la confidentialité médicale</span>
                </li>
              </ul>
            </div>

            {/* Informations importantes */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Informations importantes
              </h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Votre témoignage sera modéré avant publication</li>
                <li>• Les champs marqués d'un * sont obligatoires</li>
                <li>• La vidéo est optionnelle mais très appréciée</li>
                <li>• Vous pouvez rester anonyme si vous le souhaitez</li>
              </ul>
            </div>

            {/* Impact des témoignages */}
            <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-xl shadow-sm p-6 text-white">
              <h3 className="font-semibold mb-3">Votre expérience compte</h3>
              <p className="text-green-100 text-sm">
                Votre témoignage aide d'autres patients à prendre des décisions éclairées 
                et leur donne de l'espoir dans leur parcours médical.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AjouterTemoignagePage;