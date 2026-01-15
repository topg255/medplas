import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  MapPin, 
  Stethoscope, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  MessageCircle,
  Plus,
  Eye,
  Filter,
  Search,
  Loader,
  User,
  FileText,
  Upload,
  Download,
  X
} from 'lucide-react';

export const Recalamations = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showReclamationModal, setShowReclamationModal] = useState(false);
  const [reclamationText, setReclamationText] = useState('');
  const [submittingReclamation, setSubmittingReclamation] = useState(false);
  const [showReclamationsModal, setShowReclamationsModal] = useState(false);
  const [appointmentReclamations, setAppointmentReclamations] = useState([]);
  const [loadingReclamations, setLoadingReclamations] = useState(false);
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [appointmentFiles, setAppointmentFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Charger tous les rendez-vous
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        const role = localStorage.getItem("role");

        if (!accessToken) {
          throw new Error("Utilisateur non authentifié");
        }

        const response = await fetch("http://localhost:3001/appointment/patient/appointments", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "x-user-role": role || ""
          }
        });

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err.message);
        console.error("Erreur chargement rendez-vous:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Filtrer les rendez-vous
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.operation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'confirmed' && (appointment.approved === true || appointment.Appointmentstatus === 'confirmed')) ||
                         (filterStatus === 'pending' && (appointment.approved === false || appointment.Appointmentstatus === 'waiting')) ||
                         (filterStatus === 'cancelled' && appointment.Appointmentstatus === 'cancelled');
    
    return matchesSearch && matchesStatus;
  });

  // Fonction pour obtenir le statut et la couleur
  const getAppointmentStatus = (appointment) => {
    if (appointment.Appointmentstatus === 'cancelled') {
      return { text: 'Annulé', color: 'bg-rose-100 text-rose-800 border-rose-200', icon: <XCircle className="w-4 h-4" /> };
    }
    
    if (appointment.approved === true || appointment.Appointmentstatus === 'confirmed') {
      return { text: 'Confirmé', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: <CheckCircle className="w-4 h-4" /> };
    }
    
    if (appointment.approved === false || appointment.Appointmentstatus === 'waiting') {
      return { text: 'En attente', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: <Clock className="w-4 h-4" /> };
    }
    
    return { text: 'Non défini', color: 'bg-slate-100 text-slate-800 border-slate-200', icon: <AlertCircle className="w-4 h-4" /> };
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Formater l'heure
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formater la date et heure complète
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Ouvrir le modal d'ajout de réclamation
  const handleOpenReclamationModal = (appointment) => {
    setSelectedAppointment(appointment);
    setReclamationText('');
    setShowReclamationModal(true);
  };

  // Soumettre une réclamation
  const handleSubmitReclamation = async () => {
    if (!reclamationText.trim()) {
      alert('Veuillez saisir votre réclamation');
      return;
    }

    try {
      setSubmittingReclamation(true);
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(`http://localhost:3001/appointment/ReclamationAppointment/${selectedAppointment.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          reclamation: reclamationText
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      // Mettre à jour l'appointment localement
      setAppointments(prev => prev.map(apt => 
        apt.id === selectedAppointment.id 
          ? { ...apt, hasReclamation: true }
          : apt
      ));

      setShowReclamationModal(false);
      setReclamationText('');
      alert('Réclamation envoyée avec succès !');
    } catch (err) {
      console.error('Erreur envoi réclamation:', err);
      alert('Erreur lors de l\'envoi de la réclamation');
    } finally {
      setSubmittingReclamation(false);
    }
  };

  // Voir les réclamations d'un rendez-vous
  const handleViewReclamations = async (appointment) => {
    try {
      setLoadingReclamations(true);
      setSelectedAppointment(appointment);
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(`http://localhost:3001/appointment/${appointment.id}/reclamations`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setAppointmentReclamations(data);
      setShowReclamationsModal(true);
    } catch (err) {
      console.error('Erreur chargement réclamations:', err);
      alert('Erreur lors du chargement des réclamations');
    } finally {
      setLoadingReclamations(false);
    }
  };

  // Voir les fichiers d'un rendez-vous
  const handleViewFiles = async (appointment) => {
    try {
      setSelectedAppointment(appointment);
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(`http://localhost:3001/appointment/${appointment.id}/files`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        // Si l'endpoint n'existe pas encore, on initialise avec un tableau vide
        if (response.status === 404) {
          setAppointmentFiles([]);
          setShowFilesModal(true);
          return;
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setAppointmentFiles(data);
      setShowFilesModal(true);
    } catch (err) {
      console.error('Erreur chargement fichiers:', err);
      // En cas d'erreur, on ouvre le modal avec une liste vide
      setAppointmentFiles([]);
      setShowFilesModal(true);
    }
  };

  // Télécharger un fichier
  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      
      const response = await fetch(`http://localhost:3001/appointment/files/${fileId}/download`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur téléchargement fichier:', err);
      alert('Erreur lors du téléchargement du fichier');
    }
  };

  // Gérer la sélection de fichiers
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  // Uploader des fichiers
  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0) {
      alert('Veuillez sélectionner au moins un fichier');
      return;
    }

    try {
      setUploadingFiles(true);
      const accessToken = localStorage.getItem("accessToken");
      const formData = new FormData();
      
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(`http://localhost:3001/appointment/${selectedAppointment.id}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Mettre à jour la liste des fichiers
      setAppointmentFiles(prev => [...prev, ...result.uploadedFiles]);
      setSelectedFiles([]);
      
      // Réinitialiser l'input file
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';
      
      alert('Fichiers uploadés avec succès !');
    } catch (err) {
      console.error('Erreur upload fichiers:', err);
      alert('Erreur lors de l\'upload des fichiers');
    } finally {
      setUploadingFiles(false);
    }
  };

  // Supprimer un fichier sélectionné
  const handleRemoveSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Composant pour afficher une réclamation individuelle
  const ReclamationItem = ({ reclamation }) => {
    return (
      <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        {/* En-tête de la réclamation */}
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">
                Réclamation #{reclamation.id || 'N/A'}
              </span>
            </div>
            <span className="text-xs text-slate-500">
              Créée le {formatDateTime(reclamation.createdAt)}
            </span>
          </div>
        </div>

        {/* Contenu de la réclamation */}
        <div className="p-4 bg-white">
          <div className="mb-3">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Votre message :</h4>
            <p className="text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200">
              {reclamation.reclamation}
            </p>
          </div>

          {/* Statut de la réclamation */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            reclamation.response 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-amber-50 border border-amber-200'
          }`}>
            {reclamation.response ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Répondu</span>
                {reclamation.respondedAt && (
                  <span className="text-xs text-green-600 ml-auto">
                    Le {formatDateTime(reclamation.respondedAt)}
                  </span>
                )}
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">En attente de réponse</span>
                <span className="text-xs text-amber-600 ml-auto">
                  En cours de traitement
                </span>
              </>
            )}
          </div>
        </div>

        {/* Réponse de l'administration */}
        {reclamation.response && (
          <div className="border-t border-slate-200">
            <div className="bg-green-50 px-4 py-2 border-b border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Réponse de l'administration</span>
              </div>
            </div>
            <div className="p-4 bg-white">
              <p className="text-slate-800 bg-green-50 p-3 rounded-lg border border-green-200">
                {reclamation.response}
              </p>
              {reclamation.respondedBy && (
                <p className="text-xs text-slate-500 mt-2">
                  Traité par : {reclamation.respondedBy}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
            <Clock className="w-8 h-8 text-blue-600 absolute top-4 left-4" />
          </div>
          <p className="mt-4 text-slate-600">Chargement de vos rendez-vous...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Mes Rendez-vous</h1>
              <p className="text-slate-600">Gérez et suivez tous vos rendez-vous médicaux</p>
            </div>
          </div>

          {/* Filtres et recherche */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Recherche */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher par opération ou lieu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Filtre par statut */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="confirmed">Confirmés</option>
                  <option value="pending">En attente</option>
                  <option value="cancelled">Annulés</option>
                </select>
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-800">{appointments.length}</div>
                <div className="text-blue-600">Total</div>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <div className="font-semibold text-emerald-800">
                  {appointments.filter(apt => apt.approved === true || apt.Appointmentstatus === 'confirmed').length}
                </div>
                <div className="text-emerald-600">Confirmés</div>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <div className="font-semibold text-amber-800">
                  {appointments.filter(apt => apt.approved === false || apt.Appointmentstatus === 'waiting').length}
                </div>
                <div className="text-amber-600">En attente</div>
              </div>
              <div className="text-center p-3 bg-rose-50 rounded-lg">
                <div className="font-semibold text-rose-800">
                  {appointments.filter(apt => apt.Appointmentstatus === 'cancelled').length}
                </div>
                <div className="text-rose-600">Annulés</div>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des rendez-vous */}
        {error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <p className="text-rose-700 font-medium mb-2">Erreur lors du chargement</p>
            <p className="text-rose-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Réessayer
            </button>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-200">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg mb-2">
              {appointments.length === 0 ? 'Aucun rendez-vous trouvé' : 'Aucun rendez-vous ne correspond aux critères'}
            </p>
            <p className="text-slate-500">
              {appointments.length === 0 
                ? 'Vos prochains rendez-vous apparaîtront ici'
                : 'Essayez de modifier vos critères de recherche'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAppointments.map((appointment) => {
              const status = getAppointmentStatus(appointment);
              
              return (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment}
                  status={status}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  onAddReclamation={handleOpenReclamationModal}
                  onViewReclamations={handleViewReclamations}
                  onViewFiles={handleViewFiles}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Modal d'ajout de réclamation */}
      {showReclamationModal && selectedAppointment && (
        <ReclamationModal
          appointment={selectedAppointment}
          reclamationText={reclamationText}
          onTextChange={setReclamationText}
          onSubmit={handleSubmitReclamation}
          onClose={() => setShowReclamationModal(false)}
          loading={submittingReclamation}
          formatDate={formatDate}
          formatTime={formatTime}
        />
      )}

      {/* Modal de visualisation des réclamations */}
      {showReclamationsModal && selectedAppointment && (
        <ReclamationsListModal
          appointment={selectedAppointment}
          reclamations={appointmentReclamations}
          loading={loadingReclamations}
          onClose={() => setShowReclamationsModal(false)}
          formatDate={formatDate}
          formatTime={formatTime}
          ReclamationItem={ReclamationItem}
        />
      )}

      {/* Modal de gestion des fichiers */}
      {showFilesModal && selectedAppointment && (
        <FilesModal
          appointment={selectedAppointment}
          files={appointmentFiles}
          selectedFiles={selectedFiles}
          onFileSelect={handleFileSelect}
          onUpload={handleUploadFiles}
          onDownload={handleDownloadFile}
          onRemoveSelectedFile={handleRemoveSelectedFile}
          onClose={() => setShowFilesModal(false)}
          uploading={uploadingFiles}
          formatDate={formatDate}
          formatTime={formatTime}
        />
      )}
    </div>
  );
};

// Composant Carte de Rendez-vous
const AppointmentCard = ({ 
  appointment, 
  status, 
  formatDate, 
  formatTime, 
  onAddReclamation, 
  onViewReclamations,
  onViewFiles
}) => {
  const hasReclamations = appointment.reclamations && appointment.reclamations.length > 0;
  const hasFiles = appointment.files && appointment.files.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 group">
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform">
              {appointment.operation?.charAt(0) || 'R'}
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{appointment.operation || 'Non spécifié'}</h3>
              <p className="text-sm text-slate-500">Consultation médicale</p>
            </div>
          </div>

          <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
            {status.icon}
            {status.text}
          </span>
        </div>

        {/* Informations du rendez-vous */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span>{formatDate(appointment.date)}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>{formatTime(appointment.date)}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <span className="flex-1">{appointment.location || 'Lieu non spécifié'}</span>
          </div>

          {appointment.code && (
            <div className="flex items-center gap-2 text-slate-600">
              <Stethoscope className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span>Code: {appointment.code}</span>
            </div>
          )}

          {/* Estimation si disponible */}
          {appointment.estimation && (
            <div className="flex items-center gap-2 text-slate-600">
              <User className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>Estimation: {appointment.estimation}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => onAddReclamation(appointment)}
            className="flex-1 flex items-center gap-2 bg-rose-50 text-rose-700 hover:bg-rose-100 py-2 px-3 rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Réclamation
          </button>
          <button
            onClick={() => onViewReclamations(appointment)}
            className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors text-sm font-medium ${
              hasReclamations 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
            title="Voir les réclamations"
          >
            <Eye className="w-4 h-4" />
            {hasReclamations && (
              <span className="bg-white text-blue-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {appointment.reclamations.length}
              </span>
            )}
          </button>
        </div>

        {/* Bouton pour voir les fichiers */}
       

        {/* Aperçu des fichiers (optionnel) */}
        {hasFiles && (
          <div className="mt-3 p-2 bg-slate-50 rounded-lg">
            <div className="text-xs text-slate-500 mb-1">Fichiers récents :</div>
            <div className="space-y-1">
              {appointment.files.slice(0, 2).map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-slate-700">
                  <FileText className="w-3 h-3 text-slate-400" />
                  <span className="truncate">{file.name || file.filename}</span>
                </div>
              ))}
              {appointment.files.length > 2 && (
                <div className="text-xs text-slate-500">
                  + {appointment.files.length - 2} autre(s) fichier(s)
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Modal d'ajout de réclamation
const ReclamationModal = ({ 
  appointment, 
  reclamationText, 
  onTextChange, 
  onSubmit, 
  onClose, 
  loading,
  formatDate,
  formatTime
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Ajouter une réclamation</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">{appointment.operation}</p>
            <p className="text-xs text-blue-600">
              {formatDate(appointment.date)} à {formatTime(appointment.date)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              ID: {appointment.id} • Lieu: {appointment.location}
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Votre réclamation *
            </label>
            <textarea
              value={reclamationText}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Décrivez votre problème, préoccupation ou suggestion..."
              rows={5}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              disabled={loading}
            />
            <p className="text-xs text-slate-500 mt-2">
              Soyez précis dans votre description pour nous aider à mieux vous aider.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              onClick={onSubmit}
              disabled={loading || !reclamationText.trim()}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4" />
                  Envoyer la réclamation
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de visualisation des réclamations
const ReclamationsListModal = ({ 
  appointment, 
  reclamations, 
  loading, 
  onClose, 
  formatDate, 
  formatTime,
  ReclamationItem
}) => {
  const respondedCount = reclamations.filter(r => r.response).length;
  const pendingCount = reclamations.filter(r => !r.response).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Réclamations du rendez-vous</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">{appointment.operation}</p>
            <p className="text-xs text-blue-600">
              {formatDate(appointment.date)} à {formatTime(appointment.date)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              ID: {appointment.id} • 
              Statut: <span className={`font-medium ${
                appointment.approved ? 'text-green-600' : 
                appointment.Appointmentstatus === 'cancelled' ? 'text-rose-600' : 'text-amber-600'
              }`}>
                {appointment.approved ? 'Confirmé' : 
                 appointment.Appointmentstatus === 'cancelled' ? 'Annulé' : 'En attente'}
              </span>
            </p>
          </div>
        </div>

        {/* Liste des réclamations */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 text-blue-600 animate-spin" />
              <span className="ml-2 text-slate-600">Chargement des réclamations...</span>
            </div>
          ) : reclamations.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">Aucune réclamation pour ce rendez-vous</p>
              <p className="text-sm text-slate-500">
                Vous pouvez ajouter une réclamation en cliquant sur le bouton "Réclamation"
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reclamations.map((reclamation, index) => (
                <ReclamationItem 
                  key={reclamation.id || index} 
                  reclamation={reclamation} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Statistiques des réclamations */}
        {reclamations.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <div className="flex items-center gap-4">
                <span className="font-medium">Résumé :</span>
                <span>Total: <strong>{reclamations.length}</strong> réclamation(s)</span>
                <span className="text-green-600">
                  Répondues: <strong>{respondedCount}</strong>
                </span>
                <span className="text-amber-600">
                  En attente: <strong>{pendingCount}</strong>
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Modal de gestion des fichiers
const FilesModal = ({
  appointment,
  files,
  selectedFiles,
  onFileSelect,
  onUpload,
  onDownload,
  onRemoveSelectedFile,
  onClose,
  uploading,
  formatDate,
  formatTime
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Fichiers médicaux du rendez-vous</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">{appointment.operation}</p>
            <p className="text-xs text-blue-600">
              {formatDate(appointment.date)} à {formatTime(appointment.date)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              ID: {appointment.id} • Lieu: {appointment.location}
            </p>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Section d'upload */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Ajouter des fichiers</h4>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={onFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-700 font-medium mb-2">
                  Cliquez pour sélectionner des fichiers
                </p>
                <p className="text-slate-500 text-sm">
                  Formats supportés: PDF, DOC, DOCX, JPG, JPEG, PNG, TXT
                </p>
              </label>
            </div>

            {/* Liste des fichiers sélectionnés */}
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-medium text-slate-700 mb-2">Fichiers sélectionnés :</h5>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm font-medium text-slate-800">{file.name}</p>
                          <p className="text-xs text-slate-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveSelectedFile(index)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={onUpload}
                  disabled={uploading}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Upload en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Uploader les fichiers ({selectedFiles.length})
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Liste des fichiers existants */}
          <div>
            <h4 className="text-lg font-semibold text-slate-800 mb-4">
              Fichiers disponibles ({files.length})
            </h4>
            {files.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">Aucun fichier disponible</p>
                <p className="text-sm text-slate-500">
                  Uploader des fichiers médicaux pour les consulter ici
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {files.map((file, index) => (
                  <div key={file.id || index} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {file.name || file.filename || `Fichier ${index + 1}`}
                        </p>
                        <p className="text-xs text-slate-500">
                          {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Taille inconnue'} • 
                          {file.uploadedAt ? ` Uploadé le ${formatDateTime(file.uploadedAt)}` : ' Date inconnue'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onDownload(file.id, file.name || file.filename)}
                      className="flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 py-2 px-3 rounded-lg transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div>
              <span className="font-medium">Espace de stockage :</span>
              <span className="ml-2">
                {files.reduce((total, file) => total + (file.size || 0), 0) / 1024 / 1024 > 0 
                  ? `${(files.reduce((total, file) => total + (file.size || 0), 0) / 1024 / 1024).toFixed(2)} MB utilisés`
                  : 'Aucun fichier stocké'
                }
              </span>
            </div>
            <div className="text-xs text-slate-500">
              Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recalamations;