import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiAward,
  FiLogOut,
  FiFolder,
  FiFileText,
  FiClock,
  FiEye,
  FiDownload,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiCalendar,
  FiUsers,
  FiActivity,
  FiHome,
  FiBell,
  FiSettings,
  FiXCircle,
  FiCheck,
  FiAlertTriangle,
  FiShield
} from 'react-icons/fi';
import {
  FaUserMd,
  FaHospital,
  FaStethoscope,
  FaFileMedical,
  FaImage,
  FaFilePdf,
  FaFileAlt
} from 'react-icons/fa';

const DoctorDashboard = () => {
  const navigate = useNavigate();

  // États pour les informations du docteur
  const [doctorInfo, setDoctorInfo] = useState({
    userName: '',
    userEmail: '',
    userRole: '',
    userHospital: '',
    userSpeciality: '',
    approved: false,
    deployed: false,
    lastUpdated: null
  });

  // États pour les dossiers médicaux
  const [medicalFolders, setMedicalFolders] = useState([]);
  const [unapprovedFolders, setUnapprovedFolders] = useState([]); // NEW: cache unapproved
  const [approvedFolders, setApprovedFolders] = useState([]);     // NEW: cache approved
  const [allFolders, setAllFolders] = useState([]);               // NEW: cache all
  const [currentView, setCurrentView] = useState('unapproved');   // NEW: 'unapproved' | 'approved' | 'all'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [processingIds, setProcessingIds] = useState(new Set());
  const [lastStatusCheck, setLastStatusCheck] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  // Fonction pour récupérer le profil utilisateur le plus récent depuis le serveur
  const fetchUserProfile = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.warn("Aucun token d'accès trouvé");
        return null;
      }

      const response = await fetch("http://localhost:3001/users/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("Profil utilisateur récupéré:", userData);
        return userData;
      } else {
        console.error("Erreur lors de la récupération du profil:", response.status);
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
      return null;
    }
  }, []);

  // Fonction pour mettre à jour les informations utilisateur
  const updateUserInfo = useCallback((userData, fromServer = false) => {
    const updatedInfo = {
      userName: userData.name || localStorage.getItem('userName') || 'Dr. Utilisateur',
      userEmail: userData.email || localStorage.getItem('userEmail') || '',
      userRole: userData.role || localStorage.getItem('userRole') || 'RefDoctor',
      userHospital: userData.Hospital || localStorage.getItem('userHospital') || '',
      userSpeciality: userData.Speciality || localStorage.getItem('userSpeciality') || '',
      approved: userData.approved !== undefined ? userData.approved :
        (localStorage.getItem('userApproved') === 'true'),
      deployed: userData.deployed !== undefined ? userData.deployed :
        (localStorage.getItem('userDeployed') === 'true'),
      lastUpdated: fromServer ? new Date().toISOString() :
        (userData.lastUpdated || localStorage.getItem('userLastUpdated'))
    };

    // Mise à jour du state
    setDoctorInfo(updatedInfo);

    // Mise à jour du localStorage seulement si les données viennent du serveur
    if (fromServer) {
      localStorage.setItem('userName', updatedInfo.userName);
      localStorage.setItem('userEmail', updatedInfo.userEmail);
      localStorage.setItem('userRole', updatedInfo.userRole);
      localStorage.setItem('userHospital', updatedInfo.userHospital);
      localStorage.setItem('userSpeciality', updatedInfo.userSpeciality);
      localStorage.setItem('userApproved', updatedInfo.approved.toString());
      localStorage.setItem('userDeployed', updatedInfo.deployed.toString());
      localStorage.setItem('userLastUpdated', updatedInfo.lastUpdated);
      localStorage.setItem('userData', JSON.stringify(updatedInfo));
    }

    console.log("Informations utilisateur mises à jour:", updatedInfo);
  }, []);

  // Fonction pour vérifier les changements de statut
  const checkStatusChanges = useCallback(async (force = false) => {
    const now = Date.now();
    const fiveMinutes = 60 * 1000;

    if (!force && lastStatusCheck && (now - lastStatusCheck < fiveMinutes)) {
      return;
    }

    try {
      setLoading(true);
      const serverProfile = await fetchUserProfile();
      if (serverProfile) {
        const currentApproved = doctorInfo.approved;
        const serverApproved = serverProfile.approved;

        if (currentApproved !== serverApproved) {
          if (serverApproved && !currentApproved) {
            setNotification({
              type: 'success',
              message: '🎉 Votre compte a été approuvé!',
              timestamp: new Date()
            });
          } else if (!serverApproved && currentApproved) {
            setNotification({
              type: 'warning',
              message: '⚠️ Votre approbation a été révoquée',
              timestamp: new Date()
            });
          }
        }

        updateUserInfo(serverProfile, true);
        setLastStatusCheck(now);

        // Forcer la mise à jour visuelle
        setDoctorInfo(prev => ({ ...prev, lastUpdated: new Date().toISOString() }));
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du statut:", error);
      setNotification({
        type: 'error',
        message: 'Erreur lors de la vérification du statut',
        timestamp: new Date()
      });
    } finally {
      setLoading(false);

      // Effacer la notification après 5 secondes
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  }, [fetchUserProfile, updateUserInfo, doctorInfo.approved, lastStatusCheck]);

  // Fonction pour récupérer les dossiers "unapproved" (existante mais on met à jour le cache)
  const fetchMedicalFolders = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("Utilisateur non authentifié");
      }

      const response = await fetch("http://localhost:3001/dossier-medical/unapproved/getall", {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      const folders = Array.isArray(data) ? data : data.folders || [];
      setMedicalFolders(folders);
      setUnapprovedFolders(folders); // NEW: mettre à jour cache unapproved
    } catch (err) {
      setError(err.message);
      console.error("Erreur lors du chargement des dossiers médicaux (unapproved):", err);

      // Données de démonstration pour le développement
      const demo = [
        {
          _id: "68c0737bb6fe6a37ca868635",
          appointmentId: 20,
          patientId: "68c040b223be2287da2af2a3",
          speciality: "Pédiatrie",
          files: [
            {
              fileUrl: "appointments/20_Pédiatrie/1757442939736_Capture.jpg",
              fileType: "image/jpeg",
              uploadedAt: "2025-09-09T18:35:39.756Z",
              _id: "68c0737bb6fe6a37ca868636",
              presignedUrl: "http://example.com/file1.jpg"
            }
          ],
          approved: false,
          createdAt: "2025-09-09T18:35:39.770Z",
          updatedAt: "2025-09-09T18:35:39.770Z"
        },
        {
          _id: "68c0737bb6fe6a37ca868637",
          appointmentId: 21,
          patientId: "68c040b223be2287da2af2a4",
          speciality: "Cardiologie",
          files: [
            {
              fileUrl: "appointments/21_Cardiologie/1757442939737_ECG.pdf",
              fileType: "application/pdf",
              uploadedAt: "2025-09-10T10:15:20.123Z",
              _id: "68c0737bb6fe6a37ca868638",
              presignedUrl: "http://example.com/file2.pdf"
            }
          ],
          approved: false,
          createdAt: "2025-09-10T10:15:20.150Z",
          updatedAt: "2025-09-10T10:15:20.150Z"
        }
      ];
      setMedicalFolders(demo);
      setUnapprovedFolders(demo);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Fonction pour récupérer les dossiers approuvés
  const fetchApprovedFolders = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("Utilisateur non authentifié");
      }

      const response = await fetch("http://localhost:3001/dossier-medical/approved/getall", {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      const folders = Array.isArray(data) ? data : data.folders || [];
      setApprovedFolders(folders);
      if (currentView === 'approved') setMedicalFolders(folders);
    } catch (err) {
      console.error("Erreur lors du chargement des dossiers approuvés:", err);
      // fallback : vide ou données de démo minimale
      setApprovedFolders([]);
      if (currentView === 'approved') setMedicalFolders([]);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Fonction pour récupérer tous les dossiers médicaux
  const fetchAllMedicalFolders = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("Utilisateur non authentifié");
      }

      const response = await fetch("http://localhost:3001/dossier-medical/MedicalFolders/getall", {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      const folders = Array.isArray(data) ? data : data.folders || [];
      setAllFolders(folders);
      if (currentView === 'all') setMedicalFolders(folders);
    } catch (err) {
      console.error("Erreur lors du chargement de tous les dossiers médicaux:", err);
      setAllFolders([]);
      if (currentView === 'all') setMedicalFolders([]);
    } finally {
      setLoading(false);
    }
  };

  // NEW: handler pour changer la vue depuis la sidebar
  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view === 'unapproved') {
      if (unapprovedFolders.length) setMedicalFolders(unapprovedFolders);
      else fetchMedicalFolders();
    } else if (view === 'approved') {
      if (approvedFolders.length) setMedicalFolders(approvedFolders);
      else fetchApprovedFolders();
    } else if (view === 'all') {
      if (allFolders.length) setMedicalFolders(allFolders);
      else fetchAllMedicalFolders();
    }
  };

  // Charger les informations du docteur depuis localStorage et serveur
  useEffect(() => {
    const loadDoctorInfo = async () => {
      // D'abord charger depuis localStorage pour un affichage immédiat
      const localUserData = localStorage.getItem('userData');

      if (localUserData) {
        try {
          const parsedUserData = JSON.parse(localUserData);
          updateUserInfo(parsedUserData, false);
        } catch (error) {
          console.error('Erreur lors du parsing des données utilisateur:', error);
          // Fallback avec les données individuelles du localStorage
          const fallbackData = {
            name: localStorage.getItem('userName'),
            email: localStorage.getItem('userEmail'),
            role: localStorage.getItem('userRole'),
            Hospital: localStorage.getItem('userHospital'),
            Speciality: localStorage.getItem('userSpeciality'),
            approved: localStorage.getItem('userApproved') === 'true',
            deployed: localStorage.getItem('userDeployed') === 'true'
          };
          updateUserInfo(fallbackData, false);
        }
      }

      // Ensuite récupérer les données du serveur pour la synchronisation
      await checkStatusChanges(true);
    };

    loadDoctorInfo();
    // Charger toutes les listes pour avoir les compteurs dans la sidebar
    fetchMedicalFolders();        // unapproved
    fetchApprovedFolders();       // approved
    fetchAllMedicalFolders();     // all

    // Écouter les changements dans localStorage
    const handleStorageChange = () => {
      const updatedUserData = localStorage.getItem('userData');
      if (updatedUserData) {
        try {
          const parsedData = JSON.parse(updatedUserData);
          updateUserInfo(parsedData, false);
        } catch (error) {
          console.error('Erreur lors du parsing des nouvelles données:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Vérifier périodiquement les changements de statut
    const statusCheckInterval = setInterval(() => {
      checkStatusChanges(false);
    }, 60 * 1000); // Toutes les 5 minutes

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(statusCheckInterval);
    };
  }, [checkStatusChanges, fetchUserProfile, updateUserInfo]);

  const approveMedicalFolder = async (dossierId) => {
    try {
      setProcessingIds(prev => new Set([...prev, dossierId]));
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("Utilisateur non authentifié");
      }

      const response = await fetch(
        `http://localhost:3001/dossier-medical/approveDossierAppointment/${dossierId}`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Mise à jour locale
      setMedicalFolders((prev) =>
        prev.map((folder) =>
          folder._id === dossierId ? { ...folder, approved: true } : folder
        )
      );

      console.log(`Dossier ${dossierId} approuvé avec succès`);
    } catch (err) {
      setError(err.message);
      console.error("Erreur lors de l'approbation du dossier médical:", err);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(dossierId);
        return newSet;
      });
    }
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  // 3. Fonction pour confirmer la déconnexion
  const confirmLogout = () => {
    localStorage.clear();
    navigate('/login_RefDoctor');
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

  // Filtrer les dossiers
  const filteredFolders = medicalFolders.filter(folder => {
    const matchesSearch = folder.appointmentId.toString().includes(searchTerm) ||
      folder.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      folder.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = filterSpecialty === '' || folder.speciality === filterSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  // Obtenir les spécialités uniques
  const uniqueSpecialties = [...new Set(medicalFolders.map(folder => folder.speciality))];

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtenir l'icône du type de fichier
  const getFileIcon = (fileType, size = 16) => {
    if (fileType?.includes('image')) return <FaImage className="text-blue-500" size={size} />;
    if (fileType?.includes('pdf')) return <FaFilePdf className="text-red-500" size={size} />;
    return <FaFileAlt className="text-gray-500" size={size} />;
  };

  // Obtenir le nom du fichier à partir de l'URL
  const getFileName = (fileUrl) => {
    return fileUrl ? fileUrl.split('/').pop().replace(/^\d+_/, '') : 'Fichier sans nom';
  };

  // Calculer les statistiques (adapté pour utiliser les caches globaux)
  const stats = {
    total: allFolders.length || medicalFolders.length,
    pending: unapprovedFolders.length,
    today: (allFolders.length ? allFolders : medicalFolders).filter(f =>
      new Date(f.createdAt).toDateString() === new Date().toDateString()
    ).length
  };

  // Obtenir le badge de statut d'approbation
  const getApprovalStatusBadge = () => {
    if (doctorInfo.approved) {
      return (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center space-x-2 px-3 py-1 bg-green-100 border border-green-200 rounded-full"
        >
          <FiCheckCircle className="text-green-600" size={16} />
          <span className="text-sm font-medium text-green-800">Docteur Approuvé</span>
        </motion.div>
      );
    }
    // Dans la fonction getApprovalStatusBadge
    if (loading) {
      return (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center space-x-2 px-3 py-1 bg-gray-100 border border-gray-200 rounded-full"
        >
          <FiRefreshCw className="text-gray-600 animate-spin" size={16} />
          <span className="text-sm font-medium text-gray-800">Vérification...</span>
        </motion.div>
      );
    }
    else {
      return (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center space-x-2 px-3 py-1 bg-orange-100 border border-orange-200 rounded-full"
        >
          <FiAlertTriangle className="text-orange-600" size={16} />
          <span className="text-sm font-medium text-orange-800">Docteur Non Approuvé</span>
        </motion.div>
      );
    }
  };

  // Affichage d'alerte si le docteur n'est pas approuvé
  const ApprovalWarning = () => {
    if (doctorInfo.approved) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl"
      >
        <div className="flex items-start space-x-3">
          <FiAlertTriangle className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <h3 className="text-orange-800 font-semibold">Compte en attente d'approbation</h3>
            <p className="text-orange-700 text-sm mt-1">
              Votre compte n'est pas encore approuvé par l'administrateur. Certaines fonctionnalités peuvent être limitées
              jusqu'à l'approbation de votre compte.
            </p>
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-orange-600">Statut: En attente</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiShield className="text-orange-500" size={14} />
                <span className="text-xs text-orange-600">Accès limité</span>
              </div>
              <button
                onClick={() => checkStatusChanges(true)}
                className="flex items-center space-x-1 text-xs text-orange-600 hover:text-orange-800 underline"
              >
                <FiRefreshCw size={12} />
                <span>Vérifier le statut</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
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
                  <h1 className="text-xl font-bold text-gray-900">Dashboard Médecin Reférent</h1>
                  <p className="text-xs text-gray-500">Gestion des dossiers médicaux</p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Badge de statut d'approbation */}
              <div className="hidden md:block">
                {getApprovalStatusBadge()}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={fetchMedicalFolders}
                disabled={loading}
                title="Actualiser les dossiers"
              >
                <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative"
                title="Notifications"
              >
                <FiBell size={20} />
                {stats.pending > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                  >
                    {stats.pending}
                  </motion.span>
                )}
              </motion.button>

              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <motion.div
                  className="flex items-center space-x-3 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedFolder('profile')}
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${doctorInfo.approved
                    ? 'from-green-500 to-emerald-600'
                    : 'from-orange-500 to-red-600'
                    } rounded-full flex items-center justify-center text-white font-bold shadow-lg relative`}>
                    {getInitials(doctorInfo.userName)}
                    {!doctorInfo.approved && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 border-2 border-white rounded-full"
                      ></motion.div>
                    )}
                  </div>
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-semibold text-gray-900">{doctorInfo.userName}</p>
                    <p className="text-xs text-gray-500">{doctorInfo.userRole}</p>
                  </div>
                </motion.div>

                <motion.button
                  onClick={handleLogout} // Changé de handleLogout à () => setShowLogoutModal(true)
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
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className={`p-4 rounded-xl shadow-lg border ${notification.type === 'success'
              ? 'bg-green-100 border-green-200 text-green-800'
              : notification.type === 'warning'
                ? 'bg-orange-100 border-orange-200 text-orange-800'
                : 'bg-red-100 border-red-200 text-red-800'
              }`}>
              <div className="flex items-center space-x-2">
                {notification.type === 'success' && <FiCheckCircle size={20} />}
                {notification.type === 'warning' && <FiAlertTriangle size={20} />}
                {notification.type === 'error' && <FiAlertCircle size={20} />}
                <span className="font-medium">{notification.message}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerte d'approbation */}
        <ApprovalWarning />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profil du médecin */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <div className="text-center mb-6">
                <motion.div
                  className={`w-20 h-20 bg-gradient-to-br ${doctorInfo.approved
                    ? 'from-green-500 to-emerald-600'
                    : 'from-orange-500 to-red-600'
                    } rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg mx-auto mb-4 relative cursor-pointer`}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => checkStatusChanges(true)}
                  title="Cliquer pour vérifier le statut"
                >
                  {getInitials(doctorInfo.userName)}
                  {!doctorInfo.approved && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 border-2 border-white rounded-full"
                    ></motion.div>
                  )}
                </motion.div>
                <h2 className="text-xl font-bold text-gray-900">{doctorInfo.userName}</h2>
                <p className="text-sm text-blue-600 font-medium">{doctorInfo.userRole}</p>

                {/* Badge de statut mobile */}
                <div className="md:hidden mt-3 flex justify-center">
                  {getApprovalStatusBadge()}
                </div>

                {/* Dernière mise à jour */}
                {doctorInfo.lastUpdated && (
                  <p className="text-xs text-gray-400 mt-2">
                    Mis à jour le {formatDate(doctorInfo.lastUpdated)}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {[
                  { icon: FiMail, label: 'Email', value: doctorInfo.userEmail, color: 'blue' },
                  { icon: FaHospital, label: 'Hôpital', value: doctorInfo.userHospital, color: 'green' },
                  { icon: FaStethoscope, label: 'Spécialité', value: doctorInfo.userSpeciality, color: 'purple' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <item.icon className="text-blue-600" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm font-medium text-gray-900 truncate mt-1">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Section de statut d'approbation */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                    <FiShield className="mr-2 text-gray-600" size={16} />
                    Statut du Compte
                  </h4>

                </div>
                <div className="space-y-2">
                  <motion.div
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    whileHover={{ backgroundColor: '#f9fafb' }}
                  >
                    <span className="text-sm text-gray-600">Approbation</span>
                    <div className="flex items-center space-x-2">
                      {doctorInfo.approved ? (
                        <FiCheckCircle className="text-green-500" size={16} />
                      ) : (
                        <FiXCircle className="text-red-500" size={16} />
                      )}
                      <span className={`text-sm font-medium ${doctorInfo.approved ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {doctorInfo.approved ? 'Approuvé' : 'En attente'}
                      </span>
                    </div>
                  </motion.div>

                </div>
              </div>
            </motion.div>

            {/* Section Dossiers non approuvés */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
            >
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Dossiers non approuvés</h4>
              <button
                onClick={() => handleViewChange('unapproved')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left ${
                  currentView === 'unapproved' ? 'bg-orange-50 border border-orange-100' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FiClock className="text-orange-500" />
                  <span className="text-sm font-medium">Non approuvés</span>
                </div>
                <span className="text-sm text-gray-600">{unapprovedFolders.length}</span>
              </button>
            </motion.div>

            {/* NEW: Filtre par type de dossiers (Unapproved / Approved / All) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
            >
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Dossiers Médicaux</h4>
              <div className="space-y-2">
                <button
                  onClick={() => handleViewChange('unapproved')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left ${currentView === 'unapproved' ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                  <div className="flex items-center space-x-2">
                    <FiClock className="text-orange-500" />
                    <span className="text-sm font-medium">En attente</span>
                  </div>
                  <span className="text-sm text-gray-600">{unapprovedFolders.length}</span>
                </button>

                <button
                  onClick={() => handleViewChange('approved')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left ${currentView === 'approved' ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                  <div className="flex items-center space-x-2">
                    <FiCheckCircle className="text-green-500" />
                    <span className="text-sm font-medium">Approuvés</span>
                  </div>
                  <span className="text-sm text-gray-600">{approvedFolders.length}</span>
                </button>

                <button
                  onClick={() => handleViewChange('all')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left ${currentView === 'all' ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                  <div className="flex items-center space-x-2">
                    <FiFolder className="text-blue-500" />
                    <span className="text-sm font-medium">Tous</span>
                  </div>
                  <span className="text-sm text-gray-600">{allFolders.length}</span>
                </button>
              </div>
            </motion.div>

            {/* Statistiques */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiActivity className="mr-2 text-blue-500" />
                Statistiques
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Total dossiers', value: stats.total, icon: FiFolder, color: 'blue' },
                  { label: 'En attente', value: stats.pending, icon: FiClock, color: 'orange' },
                  { label: "Aujourd'hui", value: stats.today, icon: FiCalendar, color: 'green' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                        <stat.icon className={`text-${stat.color}-600`} size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                    </div>
                    <motion.span
                      className="text-lg font-bold text-gray-900"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                    >
                      {stat.value}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

           
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Barre de recherche et filtres */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Rechercher par ID rendez-vous, spécialité ou patient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex space-x-3">
                  <div className="relative">
                    <select
                      value={filterSpecialty}
                      onChange={(e) => setFilterSpecialty(e.target.value)}
                      className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Toutes les spécialités</option>
                      {uniqueSpecialties.map((specialty) => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </select>
                    <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                </div>
              </div>

              {/* Résultats de recherche */}
              {searchTerm && (
                <div className="mt-4 flex items-center space-x-2">
                  <FiSearch className="text-gray-400" size={16} />
                  <span className="text-sm text-gray-600">
                    {filteredFolders.length} résultat{filteredFolders.length > 1 ? 's' : ''} pour "{searchTerm}"
                  </span>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Effacer
                    </button>
                  )}
                </div>
              )}
            </motion.div>

            {/* Message d'erreur */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <div className="flex items-start space-x-3">
                  <FiAlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <h3 className="text-red-800 font-semibold">Erreur de chargement</h3>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                    <button
                      onClick={fetchMedicalFolders}
                      className="text-red-600 hover:text-red-800 text-sm underline mt-2"
                    >
                      Réessayer
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Liste des dossiers médicaux */}
            <div className="space-y-4">
              {loading ? (
                // Skeleton loading
                [...Array(3)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                  >
                    <div className="animate-pulse">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                          </div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded-full w-20"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : filteredFolders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiFolder className="text-gray-400" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun dossier trouvé</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || filterSpecialty
                      ? "Aucun dossier ne correspond aux critères de recherche."
                      : "Il n'y a actuellement aucun dossier médical en attente d'approbation."
                    }
                  </p>
                  {(searchTerm || filterSpecialty) && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterSpecialty('');
                      }}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiRefreshCw className="mr-2" size={16} />
                      Voir tous les dossiers
                    </button>
                  )}
                </motion.div>
              ) : (
                <AnimatePresence>
                  {filteredFolders.map((folder, index) => (
                    <motion.div
                      key={folder._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="p-6">
                        {/* Header du dossier */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <motion.div
                              className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                              whileHover={{ scale: 1.05, rotate: 5 }}
                            >
                              <FaFileMedical className="text-white text-lg" />
                            </motion.div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                Rendez-vous #{folder.appointmentId}
                              </h3>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-sm text-gray-500">
                                  Patient: {folder.patientId}
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {folder.speciality}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            {/* Badge de statut */}
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${folder.approved
                                ? 'bg-green-100 text-green-800'
                                : 'bg-orange-100 text-orange-800'
                                }`}
                            >
                              {folder.approved ? (
                                <>
                                  <FiCheckCircle className="mr-1" size={12} />
                                  Approuvé
                                </>
                              ) : (
                                <>
                                  <FiClock className="mr-1" size={12} />
                                  En attente
                                </>
                              )}
                            </motion.span>

                            {/* Bouton d'approbation */}
                            {!folder.approved && doctorInfo.approved && (
                              <motion.button
                                onClick={() => approveMedicalFolder(folder._id)}
                                disabled={processingIds.has(folder._id)}
                                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${processingIds.has(folder._id)
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
                                  }`}
                                whileHover={!processingIds.has(folder._id) ? { scale: 1.05 } : {}}
                                whileTap={!processingIds.has(folder._id) ? { scale: 0.95 } : {}}
                              >
                                {processingIds.has(folder._id) ? (
                                  <>
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                      className="mr-2"
                                    >
                                      <FiRefreshCw size={14} />
                                    </motion.div>
                                    Traitement...
                                  </>
                                ) : (
                                  <>
                                    <FiCheck className="mr-2" size={14} />
                                    Approuver
                                  </>
                                )}
                              </motion.button>
                            )}

                            {!doctorInfo.approved && (
                              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                Approbation requise
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Informations du dossier */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FiCalendar size={14} />
                            <span>Créé le {formatDate(folder.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FiFileText size={14} />
                            <span>{folder.files?.length || 0} fichier(s)</span>
                          </div>
                        </div>

                        {/* Liste des fichiers */}
                        {folder.files && folder.files.length > 0 && (
                          <div className="border-t border-gray-100 pt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Fichiers joints</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {folder.files.map((file, fileIndex) => (
                                <motion.div
                                  key={file._id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: fileIndex * 0.1 }}
                                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                                >
                                  <div className="flex-shrink-0">
                                    {getFileIcon(file.fileType, 20)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {getFileName(file.fileUrl)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {formatDate(file.uploadedAt)}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <motion.button
                                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      title="Visualiser"
                                      onClick={() => setSelectedFolder(folder)}
                                    >
                                      <FiEye size={16} />
                                    </motion.button>
                                    {file.presignedUrl && (
                                      <motion.a
                                        href={file.presignedUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        title="Télécharger"
                                      >
                                        <FiDownload size={16} />
                                      </motion.a>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de visualisation des fichiers */}
      <AnimatePresence>
        {selectedFolder && selectedFolder !== 'profile' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={() => setSelectedFolder(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header du modal */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Dossier Médical #{selectedFolder.appointmentId}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedFolder.speciality} • Patient: {selectedFolder.patientId}
                  </p>
                </div>
                <motion.button
                  onClick={() => setSelectedFolder(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiXCircle size={24} />
                </motion.button>
              </div>

              {/* Contenu du modal */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  {/* Informations générales */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-500">Date de création</span>
                      <p className="text-gray-900">{formatDate(selectedFolder.createdAt)}</p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-500">Dernière modification</span>
                      <p className="text-gray-900">{formatDate(selectedFolder.updatedAt)}</p>
                    </div>
                  </div>

                  {/* Fichiers */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Fichiers joints</h4>
                    <div className="space-y-3">
                      {selectedFolder.files?.map((file, index) => (
                        <motion.div
                          key={file._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                        >
                          <div className="flex items-center space-x-4">
                            {getFileIcon(file.fileType, 24)}
                            <div>
                              <p className="font-medium text-gray-900">
                                {getFileName(file.fileUrl)}
                              </p>
                              <p className="text-sm text-gray-500">
                                Uploadé le {formatDate(file.uploadedAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {file.fileType?.includes('image') && (
                              <motion.button
                                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Aperçu
                              </motion.button>
                            )}
                            {file.presignedUrl && (
                              <motion.a
                                href={file.presignedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Télécharger
                              </motion.a>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {!selectedFolder.approved && doctorInfo.approved && (
                    <div className="flex justify-end pt-4 border-t border-gray-100">
                      <motion.button
                        onClick={() => {
                          approveMedicalFolder(selectedFolder._id);
                          setSelectedFolder(null);
                        }}
                        disabled={processingIds.has(selectedFolder._id)}
                        className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {processingIds.has(selectedFolder._id) ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <FiRefreshCw size={16} />
                            </motion.div>
                            Traitement en cours...
                          </>
                        ) : (
                          <>
                            <FiCheck className="mr-2" size={16} />
                            Approuver ce dossier
                          </>
                        )}
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header de la modale */}
              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
                  >
                    <FiLogOut size={24} />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold">Déconnexion</h3>
                    <p className="text-red-100 text-sm">Confirmez votre action</p>
                  </div>
                </div>
              </div>

              {/* Contenu de la modale */}
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <FiAlertTriangle className="text-orange-600" size={20} />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Êtes-vous sûr de vouloir vous déconnecter ?
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Vous devrez vous reconnecter pour accéder à nouveau à votre tableau de bord.
                      </p>
                    </div>
                  </div>

                  {/* Informations utilisateur */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${doctorInfo.approved
                        ? 'from-green-500 to-emerald-600'
                        : 'from-orange-500 to-red-600'
                        } rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                        {getInitials(doctorInfo.userName)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doctorInfo.userName}</p>
                        <p className="text-sm text-gray-500">{doctorInfo.userEmail}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <motion.button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    onClick={confirmLogout}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all font-medium shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <FiLogOut size={16} />
                      <span>Se déconnecter</span>
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* Footer optionnel */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  Vos données toujours en sécurité avec nous.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Modale de déconnexion - Version Simple */}
     

    </div>
  );
};

export default DoctorDashboard;