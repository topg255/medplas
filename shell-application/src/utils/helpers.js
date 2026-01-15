// utils/helpers.js
export const formatBirthDate = (dateString) => {
  if (!dateString) return '01/01/1990';

  if (dateString.includes('T') || dateString.includes(' ')) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erreur formatage date:', error);
      return dateString.split('T')[0];
    }
  }

  return dateString;
};

export const getAppointmentStats = (appointments) => {
  const confirmed = appointments.filter(apt => apt.status === 'confirmed' || apt.approved === true).length;
  const pending = appointments.filter(apt => apt.status === 'pending' || apt.approved === false).length;
  const cancelled = appointments.filter(apt => apt.status === 'cancelled').length;

  return { confirmed, pending, cancelled, total: appointments.length };
};

export const formatFileSize = (bytes) => {
  if (bytes === 0 || bytes === 'N/A') return 'N/A';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export const getFileIcon = (fileType) => {
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('word') || fileType.includes('document')) return '📝';
  if (fileType.includes('image')) return '🖼️';
  return '📎';
};

export const validateFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg'
  ];

  if (file.size > maxSize) {
    return { isValid: false, error: `Le fichier ${file.name} dépasse la taille maximale de 10MB` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: `Type de fichier non autorisé pour ${file.name}` };
  }

  return { isValid: true };
};

export const OPERATIONS_LIST = [
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