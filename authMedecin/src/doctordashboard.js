import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLogOut,
  FiEdit3,
  FiSave,
  FiX,
  FiCalendar,
  FiClock,
  FiPlus,
  FiTrash2,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiSettings
} from 'react-icons/fi';
import {
  FaUserMd,
  FaHospital,
  FaStethoscope,
  FaCalendarPlus
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  // États pour les informations du docteur
  const [doctorInfo, setDoctorInfo] = useState({
    userName: '',
    userEmail: '',
    userHospital: '',
    userPhone: '',
    userSpeciality: ''
  });

  // États pour l'édition du profil
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);

  // États pour les disponibilités
  const [availabilities, setAvailabilities] = useState([]);
  const [showAddAvailability, setShowAddAvailability] = useState(false);
  const [newAvailability, setNewAvailability] = useState({
    startDate: '',
    endDate: '',
    startTime: '08:00',
    endTime: '17:00',
    location: 'paris'
  });
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [loadingAvailabilities, setLoadingAvailabilities] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // États pour la modification des disponibilités
  const [editingAvailability, setEditingAvailability] = useState(null);
  const [editAvailabilityData, setEditAvailabilityData] = useState({
    startDate: '',
    endDate: '',
    startTime: '08:00',
    endTime: '17:00',
    location: 'paris'
  });
  const [editLoading, setEditLoading] = useState(false);

  // Nouveaux états pour les rendez-vous
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  // États pour la gestion des devis
  const [showDevisInput, setShowDevisInput] = useState({});
  const [devisValues, setDevisValues] = useState({});
  const [devisLoading, setDevisLoading] = useState({});

  // Locations prédéfinies
  const predefinedLocations = [
    { value: 'paris', label: 'Paris' },
    { value: 'sousse', label: 'Sousse' },
    { value: 'tunis', label: 'Tunis' },
    { value: 'tripoli', label: 'Tripoli' }
  ];

  // Charger les informations du docteur depuis localStorage
  useEffect(() => {
    const loadDoctorInfo = () => {
      const info = {
        userName: localStorage.getItem('userName') || 'Dr. Sophie Martin',
        userEmail: localStorage.getItem('userEmail') || 'sophie.martin@hospital.fr',
        userHospital: localStorage.getItem('userHospital') || 'CHU La Pitié',
        userPhone: localStorage.getItem('userPhone') || '+33 1 42 34 56 78',
        userSpeciality: localStorage.getItem('userSpeciality') || 'Cardiologie'
      };
      setDoctorInfo(info);
      setEditedInfo(info);
    };

    loadDoctorInfo();

    // Écouter les changements dans localStorage
    window.addEventListener('storage', loadDoctorInfo);
    return () => window.removeEventListener('storage', loadDoctorInfo);
  }, []);

  // Charger les disponibilités au montage du composant
  useEffect(() => {
    fetchAvailabilities();
    fetchDoctorAppointments();
  }, []);

  // Fonction pour formater le numéro de téléphone
  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4)}`;
    } else if (cleaned.length <= 8) {
      return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6)}`;
    } else {
      return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
    }
  };

  // Fonction pour mettre à jour le profil via l'API
  const updateDoctorProfile = async (profileData) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Utilisateur non authentifié. Veuillez vous reconnecter.');
      }

      const updateData = {
        name: profileData.userName.trim(),
        email: profileData.userEmail.trim().toLowerCase(),
        Phone: parseInt(profileData.userPhone.replace(/\D/g, ''), 10)
      };

      if (isNaN(updateData.Phone)) {
        throw new Error('Numéro de téléphone invalide');
      }

      const response = await fetch('http://localhost:3001/users/pdoctor/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const responseData = await response.json();
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(responseData.message || 'Données invalides');
        } else if (response.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        } else if (response.status === 409) {
          throw new Error('Cet email est déjà utilisé');
        } else {
          throw new Error(responseData.message || `Erreur serveur (${response.status})`);
        }
      }

      return responseData;
    } catch (error) {
      console.error('Erreur détaillée:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion.');
      }
      throw error;
    }
  };

  // Fonction pour récupérer toutes les disponibilités
  const fetchAvailabilities = async () => {
    setLoadingAvailabilities(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Utilisateur non authentifié');
      }

      const response = await fetch('http://localhost:3001/appointment/doctor/myavailabilities', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      const transformedAvailabilities = data.map(availability => ({
        id: availability.id || availability._id || Date.now() + Math.random(),
        startTime: availability.startTime,
        endTime: availability.endTime,
        location: availability.location,
        startDate: new Date(availability.startTime).toISOString().split('T')[0],
        endDate: new Date(availability.endTime).toISOString().split('T')[0],
        startTimeFormatted: new Date(availability.startTime).toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        endTimeFormatted: new Date(availability.endTime).toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }));

      setAvailabilities(transformedAvailabilities);
    } catch (err) {
      console.error('Erreur lors du chargement des disponibilités:', err);
      setError(`Erreur lors du chargement des disponibilités: ${err.message}`);
    } finally {
      setLoadingAvailabilities(false);
    }
  };

  // Fonction pour actualiser les disponibilités
  const handleRefreshAvailabilities = () => {
    fetchAvailabilities();
  };

  // Fonction pour démarrer la modification
  const startEditAvailability = (availability) => {
    const startDate = new Date(availability.startTime).toISOString().split('T')[0];
    const endDate = new Date(availability.endTime).toISOString().split('T')[0];
    const startTime = new Date(availability.startTime).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const endTime = new Date(availability.endTime).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    setEditingAvailability(availability.id);
    setEditAvailabilityData({
      startDate,
      endDate,
      startTime,
      endTime,
      location: availability.location
    });
  };

  // Fonction pour modifier une disponibilité via l'API
  const handleEditAvailability = async (availabilityId, availabilityData) => {
    setEditLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Utilisateur non authentifié');
      }

      const startDateTime = formatDateTimeForAPI(availabilityData.startDate, availabilityData.startTime);
      const endDateTime = formatDateTimeForAPI(availabilityData.endDate, availabilityData.endTime);

      const updateData = {
        startTime: startDateTime,
        endTime: endDateTime,
        location: availabilityData.location
      };

      const response = await fetch(`http://localhost:3001/appointment/doctor/availability/modify/${availabilityId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      setAvailabilities(prev => prev.map(avail =>
        avail.id === availabilityId ? {
          ...avail,
          startTime: startDateTime,
          endTime: endDateTime,
          location: availabilityData.location,
          startDate: availabilityData.startDate,
          endDate: availabilityData.endDate,
          startTimeFormatted: new Date(startDateTime).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          endTimeFormatted: new Date(endDateTime).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })
        } : avail
      ));

      setEditingAvailability(null);
      setEditAvailabilityData({
        startDate: '',
        endDate: '',
        startTime: '08:00',
        endTime: '17:00',
        location: 'paris'
      });

      setSuccess('Disponibilité modifiée avec succès');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Erreur lors de la modification: ${err.message}`);
    } finally {
      setEditLoading(false);
    }
  };

  // Fonction pour annuler la modification
  const cancelEditAvailability = () => {
    setEditingAvailability(null);
    setEditAvailabilityData({
      startDate: '',
      endDate: '',
      startTime: '08:00',
      endTime: '17:00',
      location: 'paris'
    });
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.clear();
      navigate('/login_medecin');
    }
  };

  // Générer les initiales pour l'avatar
  const getInitials = (name) => {
    if (!name) return 'DR';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Gestionnaire de changement pour les inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'userPhone') {
      const formattedPhone = formatPhoneNumber(value);
      setEditedInfo(prev => ({
        ...prev,
        [name]: formattedPhone
      }));
    } else {
      setEditedInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Sauvegarder les modifications du profil
  const handleSaveProfile = async () => {
    setProfileLoading(true);
    setError(null);

    try {
      if (!editedInfo.userName.trim()) {
        throw new Error('Le nom est requis');
      }
      if (!editedInfo.userEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedInfo.userEmail)) {
        throw new Error('Veuillez entrer un email valide');
      }
      if (!editedInfo.userPhone.trim()) {
        throw new Error('Le numéro de téléphone est requis');
      }

      const result = await updateDoctorProfile(editedInfo);
      Object.keys(editedInfo).forEach(key => {
        localStorage.setItem(key, editedInfo[key]);
      });

      setDoctorInfo(editedInfo);
      setIsEditingProfile(false);
      setSuccess('Profil mis à jour avec succès');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setProfileLoading(false);
    }
  };

  // Annuler les modifications du profil
  const handleCancelEdit = () => {
    setEditedInfo(doctorInfo);
    setIsEditingProfile(false);
  };

  // Formater la date pour l'API
  const formatDateTimeForAPI = (date, time) => {
    const dateObj = new Date(`${date}T${time}:00`);
    return dateObj.toISOString();
  };

  // Ajouter une disponibilité
  const handleAddAvailability = async () => {
    if (!newAvailability.startDate || !newAvailability.endDate) {
      setError('Veuillez sélectionner les dates de début et de fin');
      return;
    }

    const startDateTime = formatDateTimeForAPI(newAvailability.startDate, newAvailability.startTime);
    const endDateTime = formatDateTimeForAPI(newAvailability.endDate, newAvailability.endTime);

    const availabilityData = {
      startTime: startDateTime,
      endTime: endDateTime,
      location: newAvailability.location
    };

    setAvailabilityLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Utilisateur non authentifié');
      }

      const response = await fetch('http://localhost:3001/appointment/manage/doctor', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(availabilityData)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      setNewAvailability({
        startDate: '',
        endDate: '',
        startTime: '08:00',
        endTime: '17:00',
        location: 'paris'
      });

      setShowAddAvailability(false);
      setSuccess('Disponibilité ajoutée avec succès');
      await fetchAvailabilities();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Erreur lors de l'ajout de la disponibilité: ${err.message}`);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  // Supprimer une disponibilité
  const handleRemoveAvailability = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette disponibilité ?')) {
      setError(null);
      setAvailabilityLoading(true);

      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Utilisateur non authentifié');
        }

        const response = await fetch(`http://localhost:3001/appointment/doctor/availability/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const responseData = await response.json();
          if (response.status === 401) {
            throw new Error('Session expirée. Veuillez vous reconnecter.');
          } else if (response.status === 404) {
            throw new Error('Disponibilité non trouvée');
          } else {
            throw new Error(responseData.message || `Erreur HTTP: ${response.status}`);
          }
        }

        // Mettre à jour la liste locale après suppression réussie
        setAvailabilities(prev => prev.filter(avail => avail.id !== id));
        setSuccess('Disponibilité supprimée avec succès');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(`Erreur lors de la suppression: ${err.message}`);
      } finally {
        setAvailabilityLoading(false);
      }
    }
  };

  // Formater la date d'affichage
  const formatDisplayDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Charger les rendez-vous du médecin
  const fetchDoctorAppointments = async () => {
    setLoadingAppointments(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('Utilisateur non authentifié');
      const response = await fetch('http://localhost:3001/appointment/doctor/appointments', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error('Session expirée. Veuillez vous reconnecter.');
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`Erreur lors du chargement des rendez-vous: ${err.message}`);
    } finally {
      setLoadingAppointments(false);
    }
  };

  // Helper pour formater la date/heure d'un rendez-vous
  const formatAppointmentDate = (dateString) => {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  // Ajouter un devis à un rendez-vous
  const handleAddDevis = async (appointmentId) => {
    const estimation = devisValues[appointmentId];
    if (!estimation || isNaN(estimation) || estimation <= 0) {
      setError("Veuillez entrer une estimation valide.");
      return;
    }
    setDevisLoading(prev => ({ ...prev, [appointmentId]: true }));
    setError(null);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('Utilisateur non authentifié');
      const response = await fetch(`http://localhost:3001/appointment/DevisAppointment/${appointmentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estimation: Number(estimation) })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }
      setSuccess("Devis ajouté avec succès.");
      setShowDevisInput(prev => ({ ...prev, [appointmentId]: false }));
      setDevisValues(prev => ({ ...prev, [appointmentId]: '' }));
      // Optionnel: recharger les rendez-vous pour afficher le devis
      fetchDoctorAppointments();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || "Erreur lors de l'ajout du devis.");
    } finally {
      setDevisLoading(prev => ({ ...prev, [appointmentId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <motion.div
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <FaUserMd className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Mon Dashboard</h1>
                  <p className="text-xs text-gray-500">Gestion du profil et disponibilités</p>
                </div>
              </motion.div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <motion.div
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {getInitials(doctorInfo.userName)}
                  </div>
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-semibold text-gray-900">{doctorInfo.userName}</p>
                    <p className="text-xs text-gray-500">{doctorInfo.userSpeciality}</p>
                  </div>
                </motion.div>
                <motion.button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Déconnexion"
                >
                  <FiLogOut size={18} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Messages de notification */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4"
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
              <FiAlertCircle className="text-red-500 flex-shrink-0" />
              <p className="text-red-800">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <FiX size={16} />
              </button>
            </div>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4"
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
              <FiCheckCircle className="text-green-500 flex-shrink-0" />
              <p className="text-green-800">{success}</p>
              <button
                onClick={() => setSuccess(null)}
                className="ml-auto text-green-500 hover:text-green-700"
              >
                <FiX size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section Profil */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <FiUser className="mr-2 text-blue-500" />
                  Mon Profil
                </h2>
                {!isEditingProfile && (
                  <motion.button
                    onClick={() => setIsEditingProfile(true)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiEdit3 size={16} />
                  </motion.button>
                )}
              </div>
              <div className="text-center mb-6">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg mx-auto mb-4"
                  whileHover={{ scale: 1.05 }}
                >
                  {getInitials(doctorInfo.userName)}
                </motion.div>
                {!isEditingProfile ? (
                  <>
                    <h3 className="text-xl font-bold text-gray-900">{doctorInfo.userName}</h3>
                    <p className="text-sm text-blue-600 font-medium">{doctorInfo.userSpeciality}</p>
                  </>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editedInfo.userName}
                      onChange={(e) => setEditedInfo({ ...editedInfo, userName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-bold"
                      placeholder="Nom complet"
                    />
                    <input
                      type="text"
                      value={editedInfo.userSpeciality}
                      onChange={(e) => setEditedInfo({ ...editedInfo, userSpeciality: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-sm"
                      placeholder="Spécialité"
                      readOnly
                    />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {[
                  {
                    icon: FiMail,
                    label: 'Email',
                    value: isEditingProfile ? editedInfo.userEmail : doctorInfo.userEmail,
                    key: 'userEmail',
                    color: 'blue',
                    readOnly: false
                  },
                  {
                    icon: FiPhone,
                    label: 'Téléphone',
                    value: isEditingProfile ? editedInfo.userPhone : doctorInfo.userPhone,
                    key: 'userPhone',
                    color: 'green',
                    readOnly: false
                  },
                  {
                    icon: FaHospital,
                    label: 'Hôpital',
                    value: doctorInfo.userHospital,
                    key: 'userHospital',
                    color: 'purple',
                    readOnly: true
                  },
                  {
                    icon: FaStethoscope,
                    label: 'Spécialité',
                    value: doctorInfo.userSpeciality,
                    key: 'userSpeciality',
                    color: 'teal',
                    readOnly: true
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <div className={`p-2 bg-${item.color}-100 rounded-lg flex-shrink-0`}>
                      <item.icon className={`text-${item.color}-600`} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{item.label}</p>
                      {isEditingProfile && !item.readOnly ? (
                        <input
                          type={item.key === 'userEmail' ? 'email' : 'text'}
                          value={item.value}
                          onChange={(e) => {
                            if (item.key === 'userPhone') {
                              const cleanedValue = e.target.value.replace(/[^0-9+\s]/g, '');
                              setEditedInfo({ ...editedInfo, [item.key]: cleanedValue });
                            } else {
                              setEditedInfo({ ...editedInfo, [item.key]: e.target.value });
                            }
                          }}
                          className="w-full mt-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder={item.key === 'userPhone' ? '+33 1 23 45 67 89' : ''}
                          maxLength={item.key === 'userPhone' ? '20' : undefined}
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900 truncate mt-1">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              {isEditingProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex space-x-3 mt-6"
                >
                  <motion.button
                    onClick={handleSaveProfile}
                    disabled={profileLoading}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    whileHover={{ scale: profileLoading ? 1 : 1.02 }}
                    whileTap={{ scale: profileLoading ? 1 : 0.98 }}
                  >
                    {profileLoading ? (
                      <>
                        <FiRefreshCw className="animate-spin" size={16} />
                        <span>Mise à jour...</span>
                      </>
                    ) : (
                      <>
                        <FiSave size={16} />
                        <span>Sauvegarder</span>
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiX size={16} />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Section Disponibilités */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <FaCalendarPlus className="mr-3 text-blue-500" />
                    Mes Disponibilités
                    {loadingAvailabilities && (
                      <FiRefreshCw className="ml-3 text-blue-500 animate-spin" size={16} />
                    )}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={handleRefreshAvailabilities}
                      disabled={loadingAvailabilities}
                      className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      title="Actualiser"
                    >
                      <FiRefreshCw className={loadingAvailabilities ? 'animate-spin' : ''} size={16} />
                    </motion.button>
                    <motion.button
                      onClick={() => setShowAddAvailability(!showAddAvailability)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiPlus size={16} />
                      <span>Ajouter</span>
                    </motion.button>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {showAddAvailability && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-b border-gray-100 bg-gray-50"
                  >
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouvelle Disponibilité</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date de début
                          </label>
                          <input
                            type="date"
                            value={newAvailability.startDate}
                            onChange={(e) => setNewAvailability({ ...newAvailability, startDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date de fin
                          </label>
                          <input
                            type="date"
                            value={newAvailability.endDate}
                            onChange={(e) => setNewAvailability({ ...newAvailability, endDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Heure de début
                          </label>
                          <input
                            type="time"
                            value={newAvailability.startTime}
                            onChange={(e) => setNewAvailability({ ...newAvailability, startTime: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Heure de fin
                          </label>
                          <input
                            type="time"
                            value={newAvailability.endTime}
                            onChange={(e) => setNewAvailability({ ...newAvailability, endTime: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Localisation
                          </label>
                          <select
                            value={newAvailability.location}
                            onChange={(e) => setNewAvailability({ ...newAvailability, location: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {predefinedLocations.map(location => (
                              <option key={location.value} value={location.value}>
                                {location.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex space-x-3 mt-6">
                        <motion.button
                          onClick={handleAddAvailability}
                          disabled={availabilityLoading}
                          className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {availabilityLoading ? (
                            <FiRefreshCw className="animate-spin" size={16} />
                          ) : (
                            <FiCheckCircle size={16} />
                          )}
                          <span>Confirmer</span>
                        </motion.button>
                        <motion.button
                          onClick={() => setShowAddAvailability(false)}
                          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Annuler
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="p-6">
                {loadingAvailabilities ? (
                  <div className="text-center py-12">
                    <FiRefreshCw className="text-blue-500 text-4xl mx-auto mb-4 animate-spin" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Chargement des disponibilités...</h3>
                    <p className="text-gray-500">Veuillez patienter</p>
                  </div>
                ) : availabilities.length === 0 ? (
                  <div className="text-center py-12">
                    <FiCalendar className="text-gray-300 text-4xl mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune disponibilité</h3>
                    <p className="text-gray-500">Commencez par ajouter vos créneaux de disponibilité</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availabilities.map((availability, index) => (
                      <motion.div
                        key={availability.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors"
                      >
                        {editingAvailability === availability.id ? (
                          <div className="space-y-4">
                            <h4 className="font-medium text-gray-900 mb-2">Modifier la disponibilité</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Date de début
                                </label>
                                <input
                                  type="date"
                                  value={editAvailabilityData.startDate}
                                  onChange={(e) => setEditAvailabilityData({
                                    ...editAvailabilityData,
                                    startDate: e.target.value
                                  })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Date de fin
                                </label>
                                <input
                                  type="date"
                                  value={editAvailabilityData.endDate}
                                  onChange={(e) => setEditAvailabilityData({
                                    ...editAvailabilityData,
                                    endDate: e.target.value
                                  })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Heure de début
                                </label>
                                <input
                                  type="time"
                                  value={editAvailabilityData.startTime}
                                  onChange={(e) => setEditAvailabilityData({
                                    ...editAvailabilityData,
                                    startTime: e.target.value
                                  })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Heure de fin
                                </label>
                                <input
                                  type="time"
                                  value={editAvailabilityData.endTime}
                                  onChange={(e) => setEditAvailabilityData({
                                    ...editAvailabilityData,
                                    endTime: e.target.value
                                  })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Localisation
                                </label>
                                <select
                                  value={editAvailabilityData.location}
                                  onChange={(e) => setEditAvailabilityData({
                                    ...editAvailabilityData,
                                    location: e.target.value
                                  })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  {predefinedLocations.map(location => (
                                    <option key={location.value} value={location.value}>
                                      {location.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <motion.button
                                onClick={() => handleEditAvailability(availability.id, editAvailabilityData)}
                                disabled={editLoading}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {editLoading ? (
                                  <FiRefreshCw className="animate-spin" size={16} />
                                ) : (
                                  <FiCheckCircle size={16} />
                                )}
                                <span>Sauvegarder</span>
                              </motion.button>
                              <motion.button
                                onClick={cancelEditAvailability}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                Annuler
                              </motion.button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">
                                {formatDisplayDate(availability.startDate)} - {formatDisplayDate(availability.endDate)}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <motion.button
                                  onClick={() => startEditAvailability(availability)}
                                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  title="Modifier cette disponibilité"
                                >
                                  <FiEdit3 size={16} />
                                </motion.button>
                                <motion.button
                                  onClick={() => handleRemoveAvailability(availability.id)}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  title="Supprimer cette disponibilité"
                                >
                                  <FiTrash2 size={16} />
                                </motion.button>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 mb-2">
                              <div className="flex items-center space-x-2">
                                <FiClock className="text-green-500" size={16} />
                                <span className="text-sm text-gray-600">
                                  {availability.startTimeFormatted || availability.startTime} - {availability.endTimeFormatted || availability.endTime}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FiMapPin className="text-purple-500" size={16} />
                              <span className="text-sm text-gray-600 capitalize">
                                {predefinedLocations.find(loc => loc.value === availability.location)?.label || availability.location}
                              </span>
                            </div>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Section Rendez-vous du médecin */}
        <div className="lg:col-span-3 mb-8 mt-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FiCalendar className="mr-2 text-blue-500" />
                Mes Rendez-vous
              </h2>
              <button
                onClick={fetchDoctorAppointments}
                disabled={loadingAppointments}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                title="Actualiser"
              >
                <FiRefreshCw className={loadingAppointments ? 'animate-spin' : ''} size={16} />
                <span>Rafraîchir</span>
              </button>
            </div>
            {loadingAppointments ? (
              <div className="text-center py-8">
                <FiRefreshCw className="text-blue-500 text-4xl mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chargement des rendez-vous...</h3>
                <p className="text-gray-500">Veuillez patienter</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-8">
                <FiCalendar className="text-gray-300 text-4xl mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun rendez-vous</h3>
                <p className="text-gray-500">Aucun rendez-vous trouvé pour ce médecin</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Opération</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Devis</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map((appt) => (
                      <tr key={appt.id || appt._id}>
                        <td className="px-4 py-2 text-sm text-gray-700">{appt.id || appt._id}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{appt.patientName || appt.patientId || 'N/A'}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{formatAppointmentDate(appt.date)}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{appt.operation || 'N/A'}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {appt.Appointmentstatus || appt.status || (appt.approved === true ? 'Approuvé' : appt.approved === false ? 'En attente' : 'N/A')}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {/* Affichage du devis ou bouton pour l'ajouter */}
                          {appt.devis || appt.estimation ? (
                            <span className="text-green-700 font-semibold">{appt.devis || appt.estimation} €</span>
                          ) : showDevisInput[appt.id || appt._id] ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                min="1"
                                className="w-20 px-2 py-1 border border-gray-300 rounded"
                                placeholder="€"
                                value={devisValues[appt.id || appt._id] || ''}
                                onChange={e =>
                                  setDevisValues(prev => ({
                                    ...prev,
                                    [appt.id || appt._id]: e.target.value
                                  }))
                                }
                                disabled={devisLoading[appt.id || appt._id]}
                              />
                              <button
                                onClick={() => handleAddDevis(appt.id || appt._id)}
                                disabled={devisLoading[appt.id || appt._id]}
                                className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                              >
                                {devisLoading[appt.id || appt._id] ? (
                                  <FiRefreshCw className="animate-spin" size={16} />
                                ) : (
                                  <FiCheckCircle size={16} />
                                )}
                              </button>
                              <button
                                onClick={() =>
                                  setShowDevisInput(prev => ({
                                    ...prev,
                                    [appt.id || appt._id]: false
                                  }))
                                }
                                className="px-2 py-1 text-gray-500 hover:text-red-600"
                                disabled={devisLoading[appt.id || appt._id]}
                              >
                                <FiX size={16} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                setShowDevisInput(prev => ({
                                  ...prev,
                                  [appt.id || appt._id]: true
                                }))
                              }
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Ajouter un devis
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;