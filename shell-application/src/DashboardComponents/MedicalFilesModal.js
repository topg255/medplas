// components/MedicalFilesModal.jsx
import React, { useRef } from 'react';
import { XCircle, Upload, File, Download, Trash2, Loader, CheckCircle, AlertCircle, Calendar, FileText, Clock } from 'lucide-react';

const MedicalFilesModal = ({
  appointment,
  appointmentFiles,
  onClose,
  onFileUpload,
  onDeleteFile,
  uploading,
  uploadProgress,
  error,
  successMessage
}) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFileUpload(files);
    }
  };

  const files = appointmentFiles?.files || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">
              Gestionnaire de dossiers médicaux
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-2 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800 font-medium">
              {appointment.operation}
            </p>
            <p className="text-xs text-blue-600">
              {appointment.date} à {appointment.time}
            </p>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-4">
          {/* Messages */}
          {error && <ErrorMessage error={error} />}
          {successMessage && <SuccessMessage message={successMessage} />}

          {/* Zone d'upload */}
          <UploadZone
            fileInputRef={fileInputRef}
            onFileSelect={handleFileSelect}
            uploading={uploading}
            uploadProgress={uploadProgress}
          />

          {/* Fichiers existants */}
          {files.length > 0 && (
            <ExistingFiles
              files={files}
              appointmentFiles={appointmentFiles}
              onDeleteFile={onDeleteFile}
            />
          )}

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium"
              disabled={uploading}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UploadZone = ({ fileInputRef, onFileSelect, uploading, uploadProgress }) => (
  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
    <input
      ref={fileInputRef}
      type="file"
      className="hidden"
      multiple
      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
      onChange={onFileSelect}
      disabled={uploading}
    />
    <label 
      htmlFor="file-upload" 
      className="cursor-pointer block"
      onClick={() => !uploading && fileInputRef.current?.click()}
    >
      {uploading ? (
        <>
          <Loader className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-blue-600 font-medium mb-2">Upload en cours...</p>
          {uploadProgress > 0 && (
            <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </>
      ) : (
        <>
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 font-medium mb-2">
            Cliquez pour sélectionner des fichiers
          </p>
          <p className="text-sm text-slate-500 mb-3">
            ou glissez-déposez vos fichiers ici
          </p>
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
            <File className="w-3 h-3" />
            PDF, DOC, DOCX, JPG, PNG (Max 10MB chacun)
          </div>
        </>
      )}
    </label>
  </div>
);

const ExistingFiles = ({ files, appointmentFiles, onDeleteFile }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <h4 className="font-medium text-slate-700 text-sm flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Fichiers existants ({files.length})
      </h4>
      {appointmentFiles?.approved === false && (
        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" />
          En attente d'approbation
        </span>
      )}
    </div>
    
    <div className="max-h-64 overflow-y-auto space-y-2">
      {files.map((file, index) => (
        <FileItem 
          key={file.id || index} 
          file={file} 
          onDelete={onDeleteFile}
        />
      ))}
    </div>

    {/* Informations du dossier */}
    <div className="p-3 bg-slate-50 rounded-lg border-l-4 border-blue-500">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-slate-600">Spécialité:</span>
          <p className="font-medium text-slate-800">
            {appointmentFiles?.speciality || 'Non spécifié'}
          </p>
        </div>
        <div>
          <span className="text-slate-600">Statut:</span>
          <p className={`font-medium ${appointmentFiles?.approved ? 'text-green-700' : 'text-amber-700'}`}>
            {appointmentFiles?.approved ? 'Approuvé' : 'En attente'}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const FileItem = ({ file, onDelete }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <File className="w-4 h-4 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">
          {file.name}
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{file.type?.split('/')[1]?.toUpperCase() || 'FILE'}</span>
          {file.uploadedAt && (
            <>
              <span>•</span>
              <span>{new Date(file.uploadedAt).toLocaleDateString('fr-FR')}</span>
            </>
          )}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-1 flex-shrink-0">
      <button
        onClick={() => window.open(file.url, '_blank')}
        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
        title="Télécharger"
      >
        <Download className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(file.id)}
        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
        title="Supprimer"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const ErrorMessage = ({ error }) => (
  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
    <div className="flex items-center gap-2">
      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
      <p className="text-red-800 text-sm flex-1">{error}</p>
    </div>
  </div>
);

const SuccessMessage = ({ message }) => (
  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
    <div className="flex items-center gap-2">
      <CheckCircle className="w-4 h-4 text-green-600" />
      <p className="text-green-800 text-sm">{message}</p>
    </div>
  </div>
);

export default MedicalFilesModal;