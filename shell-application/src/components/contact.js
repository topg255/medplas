import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  User,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const OPERATIONS = [
  'Cardiologie',
  'Dermatologie', 
  'Neurologie',
  'Pédiatrie',
  'Chirurgie',
  'Oncologie',
  'Ophtalmologie',
  'Consultation générale',
  'hair',
  'dentaire'
];

const LOCATIONS = [
  'Paris',
  'Sousse',
  'Tunis',
  'Tripoli'
];

export const AppointmentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isFromDashboard = location.state?.fromDashboard || false;
  
  const [formData, setFormData] = useState({
    date: '',
    operation: 'Consultation générale',
    location: 'Paris'
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(3);

  // Effet pour gérer le countdown et la redirection
  useEffect(() => {
    let timer;
    if (success && countdown > 0 && !isFromDashboard) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }

    if (success && countdown === 0 && !isFromDashboard) {
      navigate("/dashboard");
    }

    return () => clearInterval(timer);
  }, [success, countdown, navigate, isFromDashboard]);

  // Auto-masquer le message de succès après 4 secondes si depuis dashboard
  useEffect(() => {
    let timer;
    if (success && isFromDashboard) {
      timer = setTimeout(() => {
        setSuccess(false);
        setFormData({ date: '', operation: 'Consultation générale', location: 'Paris' });
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [success, isFromDashboard]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (!formData.date) {
        setError('Veuillez sélectionner une date et heure');
        setLoading(false);
        return;
      }

      const appointmentData = {
        date: formatDateForAPI(formData.date),
        operation: formData.operation,
        location: formData.location
      };

      const token = localStorage?.getItem('accessToken');
      
      const response = await fetch('http://localhost:3001/appointment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(appointmentData)
      });

      if (response.ok) {
        setSuccess(true);
        setCountdown(3);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de la création du rendez-vous');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const getTodayDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Message de succès personnalisé selon la source
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden p-8 animate-in fade-in duration-300">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Rendez-vous Confirmé !
            </h2>
            
            <p className="text-gray-600 mb-6">
              Votre rendez-vous a été créé avec succès.
              {!isFromDashboard && ' Vous allez être redirigé vers votre dashboard.'}
            </p>

            {!isFromDashboard && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 text-sm font-medium">
                    Redirection en cours...
                  </span>
                  <span className="text-green-600 font-bold text-lg">{countdown}s</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {isFromDashboard && (
              <div className="bg-indigo-50 rounded-lg p-4 mb-6 border border-indigo-200">
                <p className="text-sm text-indigo-700">
                  Le formulaire se fermera automatiquement dans quelques secondes...
                </p>
              </div>
            )}

            <button
              onClick={() => {
                if (!isFromDashboard) {
                  navigate("/dashboard");
                } else {
                  setSuccess(false);
                  setFormData({ date: '', operation: 'Consultation générale', location: 'Paris' });
                }
              }}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105"
            >
              {isFromDashboard ? 'Fermer' : 'Aller au dashboard maintenant'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Affichage normal du formulaire
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-[600px]">
          {/* Formulaire à gauche */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Prendre Rendez-vous</h1>
                  <p className="text-gray-600 mt-1">Réservez votre consultation médicale</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center animate-in slide-in-from-top duration-300">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <span className="text-red-800">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date et Heure */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Clock className="w-4 h-4 mr-2 text-indigo-600" />
                  Date et Heure du rendez-vous
                </label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={getTodayDateTime()}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-gray-900 bg-white"
                  required
                />
              </div>

              {/* Opération */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Stethoscope className="w-4 h-4 mr-2 text-indigo-600" />
                  Type de consultation
                </label>
                <select
                  value={formData.operation}
                  onChange={(e) => handleInputChange('operation', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-gray-900 bg-white appearance-none cursor-pointer"
                  required
                >
                  {OPERATIONS.map((operation) => (
                    <option key={operation} value={operation}>
                      {operation}
                    </option>
                  ))}
                </select>
              </div>

              {/* Localisation */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <MapPin className="w-4 h-4 mr-2 text-indigo-600" />
                  Localisation
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-gray-900 bg-white appearance-none cursor-pointer"
                  required
                >
                  {LOCATIONS.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bouton Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Création en cours...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Confirmer le rendez-vous
                  </span>
                )}
              </button>
            </form>

            {/* Informations supplémentaires */}
            <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-sm text-indigo-700 flex items-start">
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  Vous recevrez une confirmation de votre rendez-vous par email. 
                  En cas d'empêchement, merci de nous prévenir au moins 24h à l'avance.
                </span>
              </p>
            </div>
          </div>

          {/* Image à droite */}
          <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center overflow-hidden">
            {/* Motif décoratif */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white"></div>
              <div className="absolute top-32 right-16 w-16 h-16 rounded-full bg-white"></div>
              <div className="absolute bottom-20 left-20 w-12 h-12 rounded-full bg-white"></div>
              <div className="absolute bottom-40 right-8 w-24 h-24 rounded-full bg-white"></div>
            </div>
            
            {/* Contenu principal */}
            <div className="relative z-10 text-center text-white p-8">
              <div className="w-32 h-32 mx-auto mb-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Votre Santé, Notre Priorité</h2>
              <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                Prenez rendez-vous avec nos spécialistes qualifiés pour un suivi médical personnalisé
              </p>
              <div className="grid grid-cols-1 gap-4 max-w-xs mx-auto">
                <div className="flex items-center text-blue-100">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                  <span>Consultations rapides</span>
                </div>
                <div className="flex items-center text-blue-100">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                  <span>Équipe médicale experte</span>
                </div>
                <div className="flex items-center text-blue-100">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                  <span>Suivi personnalisé</span>
                </div>
              </div>
            </div>

            {/* Éléments décoratifs flottants */}
            <div className="absolute top-1/4 left-8 w-6 h-6 bg-white bg-opacity-30 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 right-12 w-4 h-4 bg-white bg-opacity-40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/3 left-16 w-5 h-5 bg-white bg-opacity-25 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;