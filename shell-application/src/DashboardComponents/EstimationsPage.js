// components/EstimationsPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Calendar, 
  Download, 
  FileText, 
  MapPin, 
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Loader,
  User,
  DollarSign,
  FileDown
} from 'lucide-react';

// Ajoutez cette fonction utilitaire avant le composant EstimationsPage
function getFormattedEstimation(appointment) {
  // Si estimation est un nombre ou une chaîne numérique
  if (appointment.estimation !== undefined && appointment.estimation !== null) {
    let value = appointment.estimation;
    if (typeof value === 'number') {
      return { display: `${value} €` };
    }
    if (typeof value === 'string') {
      // Nettoyer la chaîne pour ne garder que les chiffres et la virgule/point
      const clean = value.replace(/[^\d.,]/g, '').replace(',', '.');
      const num = parseFloat(clean);
      if (!isNaN(num)) {
        return { display: `${num} €` };
      }
      // Si la chaîne contient déjà "€", l'afficher telle quelle
      if (value.includes('€')) {
        return { display: value };
      }
      // Sinon, afficher la chaîne brute
      return { display: value };
    }
  }
  // Si aucune estimation
  return { display: null };
}

export const EstimationsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterEstimation, setFilterEstimation] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [generatingPdf, setGeneratingPdf] = useState(null);

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
    
    const matchesEstimation = filterEstimation === 'all' || 
                             (filterEstimation === 'with' && appointment.estimation !== null) ||
                             (filterEstimation === 'without' && appointment.estimation === null);
    
    return matchesSearch && matchesEstimation;
  });

  // Fonction pour obtenir le statut
  const getAppointmentStatus = (appointment) => {
    if (appointment.Appointmentstatus === 'cancelled') {
      return { text: 'Annulé', color: 'bg-rose-100 text-rose-800 border-rose-200', icon: <AlertCircle className="w-4 h-4" /> };
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

  // Générer le PDF d'estimation
  const generateEstimationPDF = async (appointment) => {
    try {
      setGeneratingPdf(appointment.id);
      
      // Créer un document PDF avec jsPDF
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Couleurs
      const primaryColor = [59, 130, 246]; // blue-500
      const secondaryColor = [20, 184, 166]; // teal-500
      const textColor = [55, 65, 81]; // slate-700
      const lightColor = [248, 250, 252]; // slate-50

      // En-tête avec dégradé
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 60, 'F');
      
      // Logo et titre
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('PLASFORA', 105, 25, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255, 0.9);
      doc.setFont('helvetica', 'normal');
      doc.text('ESTIMATION MÉDICALE', 105, 35, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text('Votre santé, notre priorité', 105, 42, { align: 'center' });

      // Date du document
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255, 0.8);
      doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 180, 55, { align: 'right' });

      // Section informations patient
      doc.setFillColor(lightColor[0], lightColor[1], lightColor[2]);
      doc.rect(15, 70, 180, 30, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.rect(15, 70, 180, 30, 'S');

      doc.setFontSize(12);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('INFORMATIONS PATIENT', 25, 80);

      const patientName = localStorage.getItem('userName') || 'Patient';
      const patientEmail = localStorage.getItem('userEmail') || 'Non spécifié';

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Nom: ${patientName}`, 25, 88);
      doc.text(`Email: ${patientEmail}`, 25, 95);
      doc.text(`Date de naissance: ${localStorage.getItem('birthDate') || 'Non spécifié'}`, 25, 102);

      // Section détails de l'intervention
      doc.setFillColor(lightColor[0], lightColor[1], lightColor[2]);
      doc.rect(15, 110, 180, 40, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.rect(15, 110, 180, 40, 'S');

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('DÉTAILS DE L\'INTERVENTION', 25, 120);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Type d'opération: ${appointment.operation || 'Non spécifié'}`, 25, 128);
      doc.text(`Date prévue: ${formatDate(appointment.date)}`, 25, 135);
      doc.text(`Heure: ${formatTime(appointment.date)}`, 25, 142);
      doc.text(`Lieu: ${appointment.location || 'Non spécifié'}`, 120, 128);

      // Section estimation
      doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.rect(15, 160, 180, 60, 'F');
      doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.rect(15, 160, 180, 60, 'S');

      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('ESTIMATION DU COÛT', 105, 175, { align: 'center' });

      // Utiliser la fonction getFormattedEstimation pour obtenir l'affichage correct
      const estimationDisplay = getFormattedEstimation(appointment);
      if (estimationDisplay.display) {
        doc.setFontSize(24);
        // S'assurer que c'est une string
        doc.text(String(estimationDisplay.display), 105, 195, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255, 0.9);
        doc.text('Prix estimatif de l\'intervention', 105, 205, { align: 'center' });
      } else {
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255, 0.9);
        doc.text('Estimation non disponible', 105, 195, { align: 'center' });
        doc.setFontSize(10);
        doc.text('Contactez-nous pour obtenir un devis personnalisé', 105, 205, { align: 'center' });
      }

      // Section informations importantes
      doc.setFillColor(lightColor[0], lightColor[1], lightColor[2]);
      doc.rect(15, 230, 180, 40, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.rect(15, 230, 180, 40, 'S');

      doc.setFontSize(10);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('INFORMATIONS IMPORTANTES', 25, 240);

      doc.setFont('helvetica', 'normal');
      const importantNotes = [
        '• Cette estimation est indicative et peut varier',
        '• Le prix final dépendra des spécificités de l\'intervention',
        '• Les frais annexes ne sont pas inclus',
        '• Valable 30 jours à partir de la date d\'émission'
      ];

      importantNotes.forEach((note, index) => {
        doc.text(note, 25, 248 + (index * 5));
      });

      // Pied de page
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Plasfora Medical Center • contact@plasfora.com • +33 1 23 45 67 89', 105, 285, { align: 'center' });
      doc.text('Document confidentiel - Ne pas diffuser', 105, 290, { align: 'center' });

      // Sauvegarder le PDF
      const fileName = `estimation-${appointment.operation?.toLowerCase().replace(/\s+/g, '-') || 'rendezvous'}-${appointment.id}.pdf`;
      doc.save(fileName);

    } catch (err) {
      console.error('Erreur génération PDF:', err);
      alert('Erreur lors de la génération du PDF');
    } finally {
      setGeneratingPdf(null);
    }
  };

  // Statistiques
  const stats = {
  total: appointments.length,
  withEstimation: appointments.filter(apt => apt.estimation !== null && apt.estimation !== undefined).length,
  withoutEstimation: appointments.filter(apt => apt.estimation === null || apt.estimation === undefined).length,
  totalEstimationValue: appointments
    .filter(apt => apt.estimation && typeof apt.estimation === 'string')
    .reduce((total, apt) => {
      try {
        // Nettoyer la chaîne et convertir en nombre
        const cleanString = apt.estimation.replace(/[^\d.,]/g, '').replace(',', '.');
        const value = parseFloat(cleanString);
        return total + (isNaN(value) ? 0 : value);
      } catch (error) {
        console.warn(`Erreur conversion estimation: ${apt.estimation}`, error);
        return total;
      }
    }, 0)
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
            <Calculator className="w-8 h-8 text-blue-600 absolute top-4 left-4" />
          </div>
          <p className="mt-4 text-slate-600">Chargement des estimations...</p>
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
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Calculator className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Estimations des Coûts</h1>
              <p className="text-slate-600">Consultez et téléchargez vos estimations médicales</p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total rendez-vous</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Avec estimation</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.withEstimation}</p>
                </div>
                <FileText className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Sans estimation</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.withoutEstimation}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-amber-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Valeur totale</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats.totalEstimationValue > 0 ? `${stats.totalEstimationValue.toFixed(2)}€` : 'N/A'}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-500" />
              </div>
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

              {/* Filtre par estimation */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={filterEstimation}
                  onChange={(e) => setFilterEstimation(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Toutes les estimations</option>
                  <option value="with">Avec estimation</option>
                  <option value="without">Sans estimation</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des rendez-vous avec estimations */}
        {error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <p className="text-rose-700 font-medium mb-2">Erreur lors du chargement</p>
            <p className="text-rose-600">{error}</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-200">
            <Calculator className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg mb-2">
              {appointments.length === 0 ? 'Aucun rendez-vous trouvé' : 'Aucun rendez-vous ne correspond aux critères'}
            </p>
            <p className="text-slate-500">
              {appointments.length === 0 
                ? 'Vos rendez-vous avec estimations apparaîtront ici'
                : 'Essayez de modifier vos critères de recherche'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAppointments.map((appointment) => {
              const status = getAppointmentStatus(appointment);
              
              return (
                <EstimationCard 
                  key={appointment.id} 
                  appointment={appointment}
                  status={status}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  onGeneratePDF={generateEstimationPDF}
                  generatingPdf={generatingPdf === appointment.id}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Composant Carte d'Estimation
const EstimationCard = ({ 
  appointment, 
  status, 
  formatDate, 
  formatTime, 
  onGeneratePDF,
  generatingPdf
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 group">
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform">
              {appointment.operation?.charAt(0) || 'E'}
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{appointment.operation || 'Non spécifié'}</h3>
              <p className="text-sm text-slate-500">Estimation de coût</p>
            </div>
          </div>

          <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
            {status.icon}
            {status.text}
          </span>
        </div>

        {/* Informations du rendez-vous */}
        <div className="space-y-3 text-sm mb-4">
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
        </div>

        {/* Estimation */}
        <div className={`p-4 rounded-lg border ${
          appointment.estimation 
            ? 'bg-green-50 border-green-200' 
            : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                appointment.estimation ? 'text-green-800' : 'text-amber-800'
              }`}>
                {appointment.estimation ? 'Estimation disponible' : 'Estimation en attente'}
              </p>
              {appointment.estimation && (
                <p className="text-lg font-bold text-green-900 mt-1">{appointment.estimation}</p>
              )}
            </div>
            <div className={`p-2 rounded-lg ${
              appointment.estimation ? 'bg-green-100' : 'bg-amber-100'
            }`}>
              {appointment.estimation ? (
                <DollarSign className="w-5 h-5 text-green-600" />
              ) : (
                <Clock className="w-5 h-5 text-amber-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4">
        <button
          onClick={() => onGeneratePDF(appointment)}
          disabled={generatingPdf || !appointment.estimation}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-3 px-4 rounded-lg transition-colors font-medium"
        >
          {generatingPdf ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Génération...
            </>
          ) : (
            <>
              <FileDown className="w-5 h-5" />
              {appointment.estimation ? 'Télécharger PDF' : 'Estimation indisponible'}
            </>
          )}
        </button>
        
        {!appointment.estimation && (
          <p className="text-xs text-slate-500 text-center mt-2">
            Contactez-nous pour obtenir une estimation
          </p>
        )}
      </div>
    </div>
  );
};

export default EstimationsPage;