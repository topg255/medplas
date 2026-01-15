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
  X,
  DockIcon,
  Image,
  WholeWord,
  TextSelect
} from 'lucide-react';

export const MesRendezVousPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [appointmentFiles, setAppointmentFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [allMedicalFiles, setAllMedicalFiles] = useState([]);
  const [loadingAllFiles, setLoadingAllFiles] = useState(false);

  // Charger tous les rendez-vous ET tous les fichiers médicaux
  useEffect(() => {
    const fetchAppointmentsAndFiles = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        const role = localStorage.getItem("role");

        if (!accessToken) {
          throw new Error("Utilisateur non authentifié");
        }

        // Charger les rendez-vous
        const appointmentsResponse = await fetch("http://localhost:3001/appointment/patient/appointments", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "x-user-role": role || ""
          }
        });

        if (!appointmentsResponse.ok) {
          throw new Error(`Erreur ${appointmentsResponse.status}: ${appointmentsResponse.statusText}`);
        }

        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);

        // Charger tous les fichiers médicaux
        await fetchAllMedicalFiles(accessToken, appointmentsData);

      } catch (err) {
        setError(err.message);
        console.error("Erreur chargement rendez-vous:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentsAndFiles();
  }, []);

  // Fonction pour récupérer tous les fichiers médicaux
  const fetchAllMedicalFiles = async (accessToken, appointmentsList) => {
    try {
      setLoadingAllFiles(true);
      
      const response = await fetch("http://localhost:3001/dossier-medical/appointments/getall", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log("Endpoint fichiers médicaux non disponible");
          setAllMedicalFiles([]);
          return;
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const filesData = await response.json();
      console.log("Tous les fichiers médicaux:", filesData);
      
      let processedFiles = [];
      
      if (Array.isArray(filesData)) {
        processedFiles = filesData;
      } else if (filesData.files) {
        processedFiles = filesData.files;
      } else if (filesData.data) {
        processedFiles = filesData.data;
      } else if (filesData.dossiersMedicaux) {
        processedFiles = filesData.dossiersMedicaux;
      }
      
      setAllMedicalFiles(processedFiles);
      updateAppointmentsWithFiles(appointmentsList, processedFiles);
      
    } catch (err) {
      console.error("Erreur chargement fichiers médicaux:", err);
      setAllMedicalFiles([]);
    } finally {
      setLoadingAllFiles(false);
    }
  };

  // Fonction utilitaire pour extraire le nom du fichier de l'URL
  const extractFileName = (fileUrl) => {
    if (!fileUrl) return 'Fichier sans nom';
    const parts = fileUrl.split('/');
    let fileName = parts[parts.length - 1];
    // Supprimer le timestamp au début du nom de fichier
    fileName = fileName.replace(/^\d+_/, '');
    return fileName || 'Fichier sans nom';
  };

  // Associer les fichiers aux rendez-vous correspondants
  const updateAppointmentsWithFiles = (appointmentsList, medicalFiles) => {
    const updatedAppointments = appointmentsList.map(appointment => {
      // Trouver le dossier médical qui correspond à ce rendez-vous
      const medicalRecord = medicalFiles.find(record => 
        record._id === appointment.id || 
        record.appointmentId === appointment.id
      );
      
      // Transformer les fichiers pour avoir un format cohérent
      const transformedFiles = medicalRecord?.files?.map(file => ({
        id: file._id,
        name: extractFileName(file.fileUrl),
        filename: extractFileName(file.fileUrl),
        fileUrl: file.fileUrl,
        fileType: file.fileType,
        size: 0,
        uploadedAt: file.uploadedAt,
        speciality: medicalRecord.speciality,
        appointmentId: medicalRecord._id
      })) || [];
      
      return {
        ...appointment,
        files: transformedFiles,
        hasFiles: transformedFiles.length > 0,
        medicalRecord: medicalRecord
      };
    });
    
    setAppointments(updatedAppointments);
  };

  // Recharger les fichiers après un upload réussi
  const reloadMedicalFiles = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await fetchAllMedicalFiles(accessToken, appointments);
    } catch (err) {
      console.error("Erreur rechargement fichiers:", err);
    }
  };

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
  

  // Soumettre une réclamation
 

  // Voir les réclamations d'un rendez-vous
  

  // Voir les fichiers d'un rendez-vous
  const handleViewFiles = async (appointment) => {
    try {
      setSelectedAppointment(appointment);
      
      // Utiliser les fichiers déjà chargés depuis l'endpoint getall
      let filesForAppointment = [];
      
      if (appointment.medicalRecord && appointment.medicalRecord.files) {
        // Transformer les fichiers pour l'affichage
        filesForAppointment = appointment.medicalRecord.files.map(file => ({
          id: file._id,
          name: extractFileName(file.fileUrl),
          filename: extractFileName(file.fileUrl),
          fileUrl: file.fileUrl,
          fileType: file.fileType,
          uploadedAt: file.uploadedAt,
          speciality: appointment.medicalRecord.speciality,
          size: 0
        }));
      } else if (appointment.files && appointment.files.length > 0) {
        filesForAppointment = appointment.files;
      } else {
        // Fallback: essayer de récupérer les fichiers spécifiques à ce rendez-vous
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch(`http://localhost:3001/dossier-medical/appointment/${appointment.id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.files) {
            filesForAppointment = data.files.map(file => ({
              id: file._id,
              name: extractFileName(file.fileUrl),
              filename: extractFileName(file.fileUrl),
              fileUrl: file.fileUrl,
              fileType: file.fileType,
              uploadedAt: file.uploadedAt
            }));
          } else {
            filesForAppointment = [];
          }
        } else {
          filesForAppointment = [];
        }
      }
      
      setAppointmentFiles(filesForAppointment);
      setShowFilesModal(true);
    } catch (err) {
      console.error('Erreur chargement fichiers:', err);
      setAppointmentFiles([]);
      setShowFilesModal(true);
    }
  };

  // Télécharger un fichier
  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      // Utiliser l'URL complète du fichier depuis votre API
      const file = appointmentFiles.find(f => f.id === fileId);
      if (file && file.fileUrl) {
        // Construire l'URL complète de téléchargement
        const downloadUrl = `http://localhost:3001/${file.fileUrl}`;
        
        const response = await fetch(downloadUrl, {
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
        link.download = fileName || file.name || 'fichier';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('URL du fichier non disponible');
      }
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

  // Uploader des fichiers avec rechargement automatique
  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0) {
      alert('Veuillez sélectionner au moins un fichier');
      return;
    }

    try {
      setUploadingFiles(true);
      const accessToken = localStorage.getItem("accessToken");

      const maxSize = 10 * 1024 * 1024;
      const oversizedFiles = selectedFiles.filter(file => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        alert(`Certains fichiers dépassent la taille limite de 10MB: ${oversizedFiles.map(f => f.name).join(', ')}`);
        return;
      }

      const uploadPromises = selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`http://localhost:3001/dossier-medical/appointment/${selectedAppointment.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          body: formData
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur ${response.status}: ${file.name} - ${errorText}`);
        }
        
        return response.json();
      });

      const results = await Promise.all(uploadPromises);
      console.log('Tous les uploads terminés:', results);

      await reloadMedicalFiles();
      
      setSelectedFiles([]);

      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';

      alert(`✅ ${selectedFiles.length} fichier(s) uploadé(s) avec succès !`);

    } catch (err) {
      console.error('Erreur détaillée upload fichiers:', err);

      if (err.message.includes('404')) {
        alert('❌ Endpoint non trouvé. Vérifiez que le serveur supporte cet endpoint.');
      } else if (err.message.includes('413')) {
        alert('❌ Fichiers trop volumineux. Taille maximale: 10MB par fichier.');
      } else if (err.message.includes('401')) {
        alert('❌ Authentification requise. Veuillez vous reconnecter.');
      } else {
        alert(`❌ Erreur lors de l'upload: ${err.message}`);
      }
    } finally {
      setUploadingFiles(false);
    }
  };

  // Supprimer un fichier sélectionné
  const handleRemoveSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Composant pour afficher une réclamation individuelle
 

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
            <Clock className="w-8 h-8 text-blue-600 absolute top-4 left-4" />
          </div>
          <p className="mt-4 text-slate-600">Chargement de vos rendez-vous et fichiers médicaux...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
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

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
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
                  onViewFiles={handleViewFiles}
                />
              );
            })}
          </div>
        )}
      </div>


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
          formatDateTime={formatDateTime}
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
  onViewFiles
}) => {
  const hasFiles = appointment.files && appointment.files.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 group">
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

          {appointment.estimation && (
            <div className="flex items-center gap-2 text-slate-600">
              <User className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>Estimation: {appointment.estimation}</span>
            </div>
          )}

          {/* Informations du dossier médical */}
          {appointment.medicalRecord?.speciality && (
            <div className="flex items-center gap-2 text-slate-600">
              <Stethoscope className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span className="text-indigo-600 font-medium">
                {appointment.medicalRecord.speciality}
              </span>
              {appointment.medicalRecord.approved !== undefined && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  appointment.medicalRecord.approved 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {appointment.medicalRecord.approved ? '✓ Approuvé' : '⏳ En attente'}
                </span>
              )}
            </div>
          )}

          {hasFiles && (
            <div className="flex items-center gap-2 text-slate-600">
              <FileText className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className="text-emerald-600 font-medium">
                {appointment.files.length} fichier(s) médical(aux)
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
     

        <button
          onClick={() => onViewFiles(appointment)}
          className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors text-sm font-medium ${hasFiles
            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
        >
          <FileText className="w-4 h-4" />
          {hasFiles ? `Voir les fichiers (${appointment.files.length})` : 'Gérer les fichiers'}
        </button>

        {hasFiles && (
          <div className="mt-3 p-2 bg-slate-50 rounded-lg">
            <div className="text-xs text-slate-500 mb-1">Fichiers récents :</div>
            <div className="space-y-1">
              {appointment.files.slice(0, 2).map((file, index) => (
                <div key={file.id || index} className="flex items-center gap-2 text-xs text-slate-700">
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


// Modal de visualisation des réclamations


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
  formatTime,
  formatDateTime
}) => {
  
  // Fonction pour obtenir l'icône selon le type de fichier
  const getFileIcon = (fileType) => {
    if (fileType?.includes('image')) {
      return (<Image></Image>);
    } else if (fileType?.includes('pdf')) {
      return (<DockIcon></DockIcon>);
    } else if (fileType?.includes('word') || fileType?.includes('document')) {
      return (<WholeWord></WholeWord>);
    } else if (fileType?.includes('text')) {
      return (<TextSelect></TextSelect>);
    } else {
      return '📎';
    }
  };

  // Fonction pour formater le type de fichier
  const formatFileType = (fileType) => {
    if (fileType?.includes('image/jpeg')) return 'JPEG Image';
    if (fileType?.includes('image/png')) return 'PNG Image';
    if (fileType?.includes('pdf')) return 'PDF Document';
    if (fileType?.includes('word')) return 'Word Document';
    if (fileType?.includes('text')) return 'Text File';
    return fileType || 'Type inconnu';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header avec informations du dossier médical */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Dossier Médical</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-blue-800 font-medium">{appointment.operation}</p>
                <p className="text-xs text-blue-600">
                  {formatDate(appointment.date)} à {formatTime(appointment.date)}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                 Lieu: {appointment.location}
                </p>
              </div>
              {appointment.medicalRecord?.speciality && (
                <div className="bg-white px-3 py-1 rounded-full border border-blue-200">
                  <span className="text-xs font-medium text-blue-700">
                    {appointment.medicalRecord.speciality}
                  </span>
                </div>
              )}
            </div>
            
            {/* Informations supplémentaires du dossier médical */}
            {appointment.medicalRecord && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-blue-700 font-medium">Statut: </span>
                    <span className={`font-medium ${
                      appointment.medicalRecord.approved 
                        ? 'text-green-600' 
                        : 'text-amber-600'
                    }`}>
                      {appointment.medicalRecord.approved ? 'Approuvé' : 'En attente'}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Créé le: </span>
                    <span className="text-blue-600">
                      {formatDateTime(appointment.medicalRecord.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Section d'upload */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Ajouter des fichiers au dossier</h4>
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
                            {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
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
              Fichiers du dossier ({files.length})
            </h4>
            {files.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">Aucun fichier dans le dossier médical</p>
                <p className="text-sm text-slate-500">
                  Ajoutez des fichiers pour constituer le dossier médical
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {files.map((file, index) => (
                  <div key={file.id || index} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl">
                        {getFileIcon(file.fileType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {file.name || file.filename || `Fichier ${index + 1}`}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            {formatFileType(file.fileType)}
                          </span>
                          {file.uploadedAt && (
                            <span className="text-xs text-slate-500">
                              Ajouté le {formatDateTime(file.uploadedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onDownload(file.id, file.name || file.filename)}
                      className="flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 py-2 px-3 rounded-lg transition-colors text-sm ml-4"
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

        {/* Footer avec statistiques */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div>
              <span className="font-medium">Résumé du dossier: </span>
              <span className="ml-2">
                {files.length} fichier(s) • 
                {files.filter(f => f.fileType?.includes('image')).length} image(s) • 
                {files.filter(f => f.fileType?.includes('pdf')).length} PDF(s) • 
                {files.filter(f => f.fileType?.includes('word') || f.fileType?.includes('document')).length} document(s)
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

export default MesRendezVousPage;