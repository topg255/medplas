// components/AppointmentCard.jsx
import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Eye,
  Upload,
  Loader,
  Download,
  Trash2,
  XCircle,
  AlertTriangle,
  Ban,
  CalendarX
} from 'lucide-react';
import { getStatusColor, getStatusIcon, getStatusText } from '../utils/StatusHelpers';

const AppointmentCard = ({
  appointment,
  appointmentFiles,
  onEdit,
  onUpload,
  uploading,
  onDeleteFile,
  onCancelAppointment,
  canceling = false
}) => {
  const files = appointmentFiles?.files || [];
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Vérifier si le rendez-vous est annulé
  const isCancelled = appointment.Appointmentstatus === 'cancelled';
  const canBeCancelled = () => {
    // Ne pas annuler les rendez-vous déjà annulés
    if (isCancelled) {
      console.log('Cannot cancel: already cancelled');
      return false;
    }

    // Vérifier si le rendez-vous est passé
    try {
      const appointmentDate = new Date(appointment.date);
      const now = new Date();

      // Si la date est invalide, permettre l'annulation par sécurité
      if (isNaN(appointmentDate.getTime())) {
        console.log('Invalid date, allowing cancellation');
        return true;
      }

      if (appointmentDate < now) {
        console.log('Cannot cancel: appointment in past');
        return false;
      }
    } catch (error) {
      console.error('Error parsing date:', error);
      // En cas d'erreur de date, permettre l'annulation
      return true;
    }

    // Permettre l'annulation pour tous les autres statuts
    console.log('Can cancel: valid conditions');
    return true;
  };
  const shouldShowCancelButton = canBeCancelled();


  // Fonction pour annuler le rendez-vous
  const handleCancelAppointment = async () => {
    try {
      await onCancelAppointment(appointment.id);
      setShowCancelModal(false);
    } catch (error) {
      console.error('Erreur annulation:', error);
    }
  };

  // DEBUG: Afficher les informations du rendez-vous pour le diagnostic
  console.log('Appointment debug:', {
    id: appointment.id,
    status: appointment.Appointmentstatus,
    approved: appointment.approved,
    date: appointment.date,
    isCancelled: isCancelled,
    canBeCancelled: canBeCancelled()
  });

  // Vérifier si le rendez-vous peut être annulé - LOGIQUE CORRIGÉE



  return (
    <>
      <div className={`border rounded-xl p-5 hover:shadow-md transition-all duration-200 group ${isCancelled
          ? 'border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 shadow-sm'
          : appointment.approved === false || appointment.status === 'pending'
            ? 'border-amber-200 bg-amber-50'
            : 'border-slate-200 bg-white'
        }`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm ${isCancelled
                ? 'bg-gradient-to-br from-rose-500 to-pink-500'
                : 'bg-gradient-to-br from-blue-500 to-teal-500'
              }`}>
              {isCancelled ? (
                <CalendarX className="w-6 h-6" />
              ) : (
                appointment.operation ? appointment.operation.charAt(0).toUpperCase() : "M"
              )}
            </div>
            <div>
              <h3 className={`font-semibold ${isCancelled ? 'text-rose-800' : 'text-slate-800'
                }`}>
                {appointment.operation || 'Consultation'}
              </h3>
              <p className={`text-sm ${isCancelled ? 'text-rose-600' : 'text-slate-500'
                }`}>
                {isCancelled ? 'Rendez-vous annulé' : 'Consultation médicale'}
              </p>
            </div>
          </div>

          <StatusBadge appointment={appointment} />
        </div>

        {/* Informations */}
        <div className="space-y-2 text-sm mb-4">
          <InfoItem
            icon={<Calendar className="w-4 h-4" />}
            text={appointment.date}
            isCancelled={isCancelled}
          />
          <InfoItem
            icon={<Clock className="w-4 h-4" />}
            text={appointment.time}
            isCancelled={isCancelled}
          />
          <InfoItem
            icon={<MapPin className="w-4 h-4" />}
            text={appointment.location || 'Non spécifié'}
            isCancelled={isCancelled}
          />
          <FileInfoItem
            filesCount={files.length}
            isPending={appointmentFiles?.approved === false}
            isCancelled={isCancelled}
          />
        </div>

        {/* Code du rendez-vous */}
        {appointment.code && (
          <div className={`mt-4 p-3 rounded-lg border ${isCancelled
              ? 'bg-rose-100 border-rose-200'
              : 'bg-blue-50 border-blue-100'
            }`}>
            <div className="flex items-center gap-2">
              <FileText className={`w-4 h-4 ${isCancelled ? 'text-rose-600' : 'text-blue-600'
                }`} />
              <p className={`text-xs ${isCancelled ? 'text-rose-800' : 'text-blue-800'
                }`}>
                Code: {appointment.code}
              </p>
            </div>
          </div>
        )}

        {/* Badge d'attente */}
        {(appointment.approved === false || appointment.status === 'pending') && !isCancelled && (
          <div className="mt-3 flex items-center gap-2 text-amber-700 bg-amber-100 rounded-lg p-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">Confirmation en cours...</span>
          </div>
        )}

        {/* Message d'annulation */}
        {isCancelled && (
          <div className="mt-3 flex items-center gap-2 text-rose-700 bg-rose-100 rounded-lg p-3 border border-rose-200">
            <Ban className="w-4 h-4" />
            <div>
              <span className="text-xs font-medium block">Rendez-vous annulé</span>
              <span className="text-xs text-rose-600">
                Ce rendez-vous n'est plus actif
              </span>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="mt-4 flex justify-between items-center gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(appointment)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              disabled={isCancelled}
            >
              <Eye className="w-4 h-4" />
              Modifier
            </button>

            {/* Bouton d'annulation - TOUJOURS AFFICHÉ SI LES CONDITIONS SONT REMPLIES */}
            {shouldShowCancelButton && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex items-center gap-1 text-rose-600 hover:text-rose-800 text-sm font-medium transition-colors"
                disabled={canceling}
              >
                {canceling ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                {canceling ? 'Annulation...' : 'Annuler'}
              </button>
            )}
          </div>

          <button
            onClick={() => onUpload(appointment)}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors"
            disabled={uploading || isCancelled}
          >
            {uploading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Upload...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Dossier
              </>
            )}
          </button>
        </div>

        {/* Message d'information si le bouton d'annulation n'est pas affiché */}
        {!shouldShowCancelButton && !isCancelled && (
          <div className="mt-2 text-xs text-slate-500 text-center">
            Ce rendez-vous ne peut pas être annulé
          </div>
        )}

        {/* Fichiers médicaux */}
        {files.length > 0 && (
          <MedicalFilesSection
            files={files}
            appointmentId={appointment.id}
            appointmentFiles={appointmentFiles}
            onDeleteFile={onDeleteFile}
            isCancelled={isCancelled}
          />
        )}
      </div>

      {/* Modal de confirmation d'annulation */}
      {showCancelModal && (
        <CancelAppointmentModal
          appointment={appointment}
          onConfirm={handleCancelAppointment}
          onCancel={() => setShowCancelModal(false)}
          loading={canceling}
        />
      )}
    </>
  );
};

// Les composants enfants restent identiques...
const StatusBadge = ({ appointment }) => {
  const isCancelled = appointment.Appointmentstatus === 'cancelled';

  return (
    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${isCancelled
        ? 'bg-rose-100 text-rose-800 border-rose-200'
        : getStatusColor(appointment)
      }`}>
      {isCancelled ? <Ban className="w-4 h-4" /> : getStatusIcon(appointment)}
      {isCancelled ? 'Annulé' : getStatusText(appointment)}
    </span>
  );
};

const InfoItem = ({ icon, text, isCancelled = false }) => (
  <div className="flex items-center gap-2">
    {React.cloneElement(icon, {
      className: `w-4 h-4 ${isCancelled ? 'text-rose-500' : 'text-slate-500'}`
    })}
    <span className={isCancelled ? 'text-rose-700' : 'text-slate-600'}>
      {text}
    </span>
  </div>
);

const FileInfoItem = ({ filesCount, isPending, isCancelled = false }) => (
  <div className="flex items-center gap-2">
    <FileText className={`w-4 h-4 ${isCancelled ? 'text-rose-500' : 'text-indigo-500'}`} />
    <span className={`text-xs ${isCancelled ? 'text-rose-700' : 'text-slate-600'}`}>
      {filesCount} fichier(s) médical(aux)
    </span>
    {isPending && !isCancelled && (
      <span className="ml-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
        En attente
      </span>
    )}
  </div>
);

const MedicalFilesSection = ({ files, appointmentId, appointmentFiles, onDeleteFile, isCancelled = false }) => (
  <div className={`mt-3 p-3 rounded-lg border ${isCancelled
      ? 'bg-rose-50 border-rose-200'
      : 'bg-slate-50 border-slate-200'
    }`}>
    <div className="flex items-center justify-between mb-2">
      <h4 className={`text-xs font-medium flex items-center gap-1 ${isCancelled ? 'text-rose-700' : 'text-slate-700'
        }`}>
        <FileText className="w-3 h-3" />
        Dossiers médicaux ({files.length})
      </h4>
      {appointmentFiles?.approved === false && !isCancelled && (
        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
          En attente d'approbation
        </span>
      )}
    </div>
    <div className="space-y-2 max-h-32 overflow-y-auto">
      {files.map((file, index) => (
        <FileItem
          key={file.id || index}
          file={file}
          appointmentId={appointmentId}
          onDelete={onDeleteFile}
          isCancelled={isCancelled}
        />
      ))}
    </div>
    {appointmentFiles?.createdAt && (
      <div className={`mt-2 text-xs flex items-center gap-1 ${isCancelled ? 'text-rose-500' : 'text-slate-500'
        }`}>
        <Calendar className="w-3 h-3" />
        Créé le: {new Date(appointmentFiles.createdAt).toLocaleDateString('fr-FR')}
      </div>
    )}
  </div>
);

const FileItem = ({ file, appointmentId, onDelete, isCancelled = false }) => (
  <div className={`flex items-center justify-between text-xs p-2 rounded border ${isCancelled
      ? 'bg-rose-100 border-rose-200 text-rose-700'
      : 'bg-white border-slate-200 text-slate-600'
    }`}>
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isCancelled ? 'bg-rose-500' : 'bg-blue-500'
        }`}></div>
      <span className="truncate font-medium">{file.name}</span>
      <span className={`flex-shrink-0 ${isCancelled ? 'text-rose-400' : 'text-slate-400'
        }`}>
        ({file.type?.split('/')[1]?.toUpperCase() || 'FILE'})
      </span>
    </div>
    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
      <button
        onClick={() => window.open(file.url, '_blank')}
        className={`p-1 rounded transition-colors ${isCancelled
            ? 'text-rose-600 hover:text-rose-800 hover:bg-rose-200'
            : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
          }`}
        title="Télécharger"
      >
        <Download className="w-3 h-3" />
      </button>
      {!isCancelled && (
        <button
          onClick={() => onDelete(appointmentId, file.id)}
          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
          title="Supprimer"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  </div>
);

// Modal de confirmation d'annulation (inchangé)
const CancelAppointmentModal = ({ appointment, onConfirm, onCancel, loading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Annuler le rendez-vous</h3>
              <p className="text-slate-600">Confirmez-vous l'annulation ?</p>
            </div>
          </div>
        </div>

        {/* Détails du rendez-vous */}
        <div className="p-6 border-b border-slate-200">
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Opération:</span>
              <span className="text-sm text-slate-800">{appointment.operation}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Date:</span>
              <span className="text-sm text-slate-800">{appointment.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Heure:</span>
              <span className="text-sm text-slate-800">{appointment.time}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">Lieu:</span>
              <span className="text-sm text-slate-800">{appointment.location}</span>
            </div>
            {appointment.code && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">Code:</span>
                <span className="text-sm text-slate-800">{appointment.code}</span>
              </div>
            )}
          </div>

          {/* Avertissement */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">Attention</p>
                <p className="text-xs text-amber-700 mt-1">
                  Cette action est irréversible. Vous devrez prendre un nouveau rendez-vous si vous souhaitez consulter à nouveau.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="p-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            Retour
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Annulation...
              </>
            ) : (
              <>
                <Ban className="w-4 h-4" />
                Confirmer l'annulation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;