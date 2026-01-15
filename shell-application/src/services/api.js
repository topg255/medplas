// services/api.js
export const fetchAppointments = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    if (!accessToken) {
      throw new Error("Utilisateur non authentifié, token manquant");
    }

    const response = await fetch("http://localhost:3001/appointment/patient/appointments", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "x-user-role": role || ""
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();

    return data.map((apt) => ({
      id: apt.id,
      patientId: apt.patientId,
      operation: apt.operation,
      date: new Date(apt.date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: new Date(apt.date).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: apt.Appointmentstatus,
      location: apt.location,
      approved: apt.approved,
      code: apt.code,
      clinicId: apt.clinicId,
      pdoctorId: apt.pdoctorId,
      dossierId: apt.dossierId,
    }));
  } catch (error) {
    console.error("Erreur fetch appointments:", error);
    throw error;
  }
};

export const fetchAllMedicalRecords = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:3001/dossier-medical/appointments/getall`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (response.ok) {
      let medicalRecords = await response.json();
      // Ensure medicalRecords is always an array
      if (!Array.isArray(medicalRecords)) {
        if (Array.isArray(medicalRecords?.data)) {
          medicalRecords = medicalRecords.data;
        } else if (Array.isArray(medicalRecords?.medicalRecords)) {
          medicalRecords = medicalRecords.medicalRecords;
        } else {
          medicalRecords = [];
        }
      }

      const organizedFiles = {};
      medicalRecords.forEach(record => {
        const processedFiles = Array.isArray(record.files)
          ? record.files.map(file => ({
              id: file._id,
              name: file.fileUrl.split('/').pop(),
              url: `http://localhost:3001/${file.fileUrl}`,
              type: file.fileType,
              uploadedAt: file.uploadedAt,
              size: file.size || 'N/A'
            }))
          : [];

        organizedFiles[record.appointmentId] = {
          ...record,
          files: processedFiles
        };
      });

      return organizedFiles;
    } else if (response.status === 404) {
      return {};
    } else {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
  } catch (error) {
    console.error('Erreur lors du chargement de tous les dossiers médicaux:', error);
    throw error;
  }
};

export const uploadMedicalFile = async (appointmentId, file) => {
  const accessToken = localStorage.getItem("accessToken");
  
  // Validation du fichier
  if (file.size > 10 * 1024 * 1024) {
    throw new Error(`Le fichier ${file.name} est trop volumineux (max 10MB)`);
  }

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg'
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Type de fichier non autorisé pour ${file.name}`);
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`http://localhost:3001/dossier-medical/appointment/${appointmentId}`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${accessToken}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Erreur lors de l'upload de ${file.name}: ${errorData}`);
  }

  return await response.json();
};

export const deleteMedicalFile = async (fileId) => {
  const accessToken = localStorage.getItem("accessToken");
  
  const response = await fetch(`http://localhost:3001/dossier-medical/file/${fileId}`, {
    method: 'DELETE',
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la suppression');
  }

  return true;
};

export const updateAppointment = async (appointmentId, updates) => {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(
    `http://localhost:3001/appointment/appointment/update/${appointmentId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(updates)
    }
  );

  if (!response.ok) {
    throw new Error('Erreur lors de la mise à jour');
  }

  return await response.json();
};
export const fetchAllMedicalDossiers = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:3001/dossier-medical/appointments/getall`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (response.ok) {
      return await response.json();
    } else if (response.status === 404) {
      return [];
    } else {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
  } catch (error) {
    console.error('Erreur lors du chargement des dossiers médicaux:', error);
    throw error;
  }
};

export const addReclamation = async (appointmentId, reclamationText) => {
  const accessToken = localStorage.getItem("accessToken");
  
  const response = await fetch(`http://localhost:3001/appointment/ReclamationAppointment/${appointmentId}`, {
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

  return await response.json();
};

export const getAppointmentReclamations = async (appointmentId) => {
  const accessToken = localStorage.getItem("accessToken");
  
  const response = await fetch(`http://localhost:3001/appointment/${appointmentId}/reclamations`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }

  return await response.json();
};