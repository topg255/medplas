// PatientDashboard.jsx (version avec navigation)
import React from 'react';
import { useState, useEffect } from 'react';
import Sidebar from '../DashboardComponents/Sidebar';
import DashboardHeader from '../DashboardComponents/DashboardHeader';
import PatientProfile from '../DashboardComponents/PatientProfile';
import AppointmentStats from '../DashboardComponents/AppointmentStats';
import AppointmentsSection from '../DashboardComponents/AppointmentsSection';
import EditAppointmentModal from '../DashboardComponents/EditAppointmentModal';
import MedicalFilesModal from '../DashboardComponents/MedicalFilesModal';
import SuccessMessage from '../DashboardComponents/SuccessMessage';
import PendingAppointmentsAlert from '../DashboardComponents/PendingAppointmentsAlert';
import TelemedecinePage from '../DashboardComponents/TelemedecinePage';
import AppointmentPage from '../components/contact'
import DossiersMedicauxPage from '../DashboardComponents/DossierMedicauxPage';
import AjouterTemoignagePage from '../DashboardComponents/AjouterTemoignagePage';
import Recalamations from '../DashboardComponents/ReclamationPage';
import EstimationsPage from '../DashboardComponents/EstimationsPage'; // ← Importer le composant



import { 
  fetchAppointments, 
  fetchAllMedicalRecords, 
  uploadMedicalFile, 
  deleteMedicalFile, 
  updateAppointment 
} from '../services/api';
import { formatBirthDate } from '../utils/helpers';
import { Heart } from 'lucide-react';

export const Dashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [patientInfo, setPatientInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showPendingAlert, setShowPendingAlert] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [appointmentFiles, setAppointmentFiles] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Charger les informations du patient
  useEffect(() => {
    const loadPatientInfo = () => {
      const userName = localStorage.getItem('userName') || 'Patient';
      const userEmail = localStorage.getItem('userEmail') || 'email@example.com';
      const insurance = localStorage.getItem('insurance') || 'Non renseigné';
      const rawBirthDate = localStorage.getItem('birthDate') || '01/01/1990';

      setPatientInfo({
        userName,
        userEmail,
        insurance,
        birthDate: formatBirthDate(rawBirthDate)
      });
    };

    loadPatientInfo();
  }, []);

  // Charger les rendez-vous et dossiers médicaux
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const appointmentsData = await fetchAppointments();
        setAppointments(appointmentsData);
        
        let medicalRecords = await fetchAllMedicalRecords();
        // Ensure medicalRecords is always an array
        if (Array.isArray(medicalRecords)) {
          setAppointmentFiles(medicalRecords);
        } else if (Array.isArray(medicalRecords?.data)) {
          setAppointmentFiles(medicalRecords.data);
        } else if (Array.isArray(medicalRecords?.medicalRecords)) {
          setAppointmentFiles(medicalRecords.medicalRecords);
        } else {
          setAppointmentFiles([]);
        }
      } catch (err) {
        setError(err.message);
        console.error("Erreur chargement données:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentView === 'dashboard' || currentView === 'appointments') {
      loadData();
    }
  }, [currentView]);

  // Filtrer les rendez-vous
  useEffect(() => {
    let filtered = appointments;

    if (filterStatus !== 'all') {
      filtered = appointments.filter(apt => {
        if (filterStatus === 'confirmed') return apt.status === 'confirmed' || apt.approved === true;
        if (filterStatus === 'pending') return apt.status === 'pending' || apt.approved === false;
        if (filterStatus === 'cancelled') return apt.status === 'cancelled';
        return false;
      });
    }

    setFilteredAppointments(filtered);
  }, [appointments, filterStatus]);
  const handleAppointmentsUpdate = (updatedAppointments) => {
  setAppointments(updatedAppointments);
};

  // Vérifier les rendez-vous en attente
  useEffect(() => {
    const pendingCount = appointments.filter(apt => apt.status === 'pending' || apt.approved === false).length;
    if (pendingCount > 0) {
      setShowPendingAlert(true);
      const timer = setTimeout(() => setShowPendingAlert(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [appointments]);

  // Gestionnaires d'événements
  const handleFileUpload = async (appointmentId, files) => {
    const fileArray = Array.isArray(files) ? files : [files];
    
    try {
      setUploadingFiles(prev => ({ ...prev, [appointmentId]: true }));
      setError('');
      
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        
        setUploadProgress(prev => ({
          ...prev,
          [appointmentId]: Math.round(((i + 1) / fileArray.length) * 100)
        }));

        await uploadMedicalFile(appointmentId, file);
      }

      let medicalRecords = await fetchAllMedicalRecords();
      // Ensure medicalRecords is always an array
      if (Array.isArray(medicalRecords)) {
        setAppointmentFiles(medicalRecords);
      } else if (Array.isArray(medicalRecords?.data)) {
        setAppointmentFiles(medicalRecords.data);
      } else if (Array.isArray(medicalRecords?.medicalRecords)) {
        setAppointmentFiles(medicalRecords.medicalRecords);
      } else {
        setAppointmentFiles([]);
      }
      
      setSuccessMessage(`${fileArray.length} fichier(s) uploadé(s) avec succès !`);
      
      setTimeout(() => {
        setShowUploadModal(false);
        setSelectedAppointment(null);
        setSuccessMessage('');
      }, 2000);

    } catch (error) {
      setError(error.message);
    } finally {
      setUploadingFiles(prev => ({ ...prev, [appointmentId]: false }));
      setUploadProgress(prev => ({ ...prev, [appointmentId]: 0 }));
    }
  };

  const handleDeleteFile = async (appointmentId, fileId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      return;
    }

    try {
      await deleteMedicalFile(fileId);
      
      let medicalRecords = await fetchAllMedicalRecords();
      // Ensure medicalRecords is always an array
      if (Array.isArray(medicalRecords)) {
        setAppointmentFiles(medicalRecords);
      } else if (Array.isArray(medicalRecords?.data)) {
        setAppointmentFiles(medicalRecords.data);
      } else if (Array.isArray(medicalRecords?.medicalRecords)) {
        setAppointmentFiles(medicalRecords.medicalRecords);
      } else {
        setAppointmentFiles([]);
      }
      
      setSuccessMessage('Fichier supprimé avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateAppointment = async (updatedAppointment) => {
    try {
      setUpdateLoading(true);
      
      await updateAppointment(updatedAppointment.id, {
        date: updatedAppointment.date,
        operation: updatedAppointment.operation
      });

      setAppointments(prev => prev.map(apt =>
        apt.id === updatedAppointment.id ? updatedAppointment : apt
      ));

      setEditingAppointment(null);
      setSuccessMessage('Rendez-vous mis à jour avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleOpenUploadModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowUploadModal(true);
    setError('');
    setSuccessMessage('');
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const getAppointmentStats = (appointments) => {
    const confirmed = appointments.filter(apt => apt.status === 'confirmed' || apt.approved === true).length;
    const pending = appointments.filter(apt => apt.status === 'pending' || apt.approved === false).length;
    const cancelled = appointments.filter(apt => apt.status === 'cancelled').length;

    return { confirmed, pending, cancelled, total: appointments.length };
  };

  if (!patientInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
            <Heart className="w-8 h-8 text-blue-600 absolute top-4 left-4" />
          </div>
          <p className="mt-4 text-slate-600">Chargement de votre espace patient...</p>
        </div>
      </div>
    );
  }

  // Rendu de la vue actuelle
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dossiers': 
      return <DossiersMedicauxPage />;
      case 'appointments':
        return <AppointmentPage></AppointmentPage>;
      case 'telemedecine':
        return <TelemedecinePage />;
         case 'temoignages': 
      return <AjouterTemoignagePage />;
      case 'mes-rendezvous': 
      return <Recalamations />;
       case 'estimations': // ← Nouveau cas
      return <EstimationsPage />;
      
      case 'dashboard':
      default:
        return (
          <div className="flex-1">
            <DashboardHeader patientInfo={patientInfo} />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <PendingAppointmentsAlert 
                show={showPendingAlert} 
                pendingCount={appointments.filter(apt => apt.status === 'pending' || apt.approved === false).length}
                onClose={() => setShowPendingAlert(false)}
              />

              {/* Titre principal */}
              <div className="mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
                  Bonjour, <span className="text-blue-600">{patientInfo.userName}</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Bienvenue dans votre espace patient. Gérez vos rendez-vous et consultez vos informations médicales.
                </p>
              </div>

              {/* Grille principale */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <PatientProfile patientInfo={patientInfo} />
                <AppointmentStats stats={getAppointmentStats(appointments)} />
              </div>

              {/* Section rendez-vous */}
              <AppointmentsSection
                appointments={filteredAppointments}
                loading={loading}
                error={error}
                filterStatus={filterStatus}
                onFilterChange={setFilterStatus}
                stats={getAppointmentStats(appointments)}
                appointmentFiles={appointmentFiles}
                onEditAppointment={setEditingAppointment}
                onOpenUploadModal={handleOpenUploadModal}
                uploadingFiles={uploadingFiles}
                onDeleteFile={handleDeleteFile}
                  onAppointmentsUpdate={handleAppointmentsUpdate} // ← Nouvelle prop

              />
            </div>

            {/* Modals */}
            {editingAppointment && (
              <EditAppointmentModal
                appointment={editingAppointment}
                onClose={() => setEditingAppointment(null)}
                onUpdate={handleUpdateAppointment}
                loading={updateLoading}
              />
            )}

            {showUploadModal && selectedAppointment && (
              <MedicalFilesModal
                appointment={selectedAppointment}
                appointmentFiles={appointmentFiles[selectedAppointment.id]}
                onClose={() => {
                  setShowUploadModal(false);
                  setSelectedAppointment(null);
                }}
                onFileUpload={(files) => handleFileUpload(selectedAppointment.id, files)}
                onDeleteFile={(fileId) => handleDeleteFile(selectedAppointment.id, fileId)}
                uploading={uploadingFiles[selectedAppointment.id]}
                uploadProgress={uploadProgress[selectedAppointment.id]}
                error={error}
                successMessage={successMessage}
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <SuccessMessage 
        message={successMessage} 
        onHide={() => setSuccessMessage('')}
      />
      
      {/* Sidebar */}
      <Sidebar 
        activeView={currentView}
        onViewChange={handleViewChange}
        onLogout={handleLogout}
      />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-h-screen">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default Dashboard;