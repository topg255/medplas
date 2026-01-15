import React, { useState, useEffect } from 'react';
import {
    FolderOpen,
    FileText,
    Download,
    Eye,
    Calendar,
    User,
    Stethoscope,
    CheckCircle,
    Clock,
    Search,
    Filter,
    DockIcon,
    ImagesIcon,
    LucidePanelLeftDashed

} from 'lucide-react';

export const DossiersMedicauxPage = () => {
    const [dossiers, setDossiers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpeciality, setFilterSpeciality] = useState('all');

    // Charger tous les dossiers médicaux
    useEffect(() => {
        const fetchDossiers = async () => {
            try {
                setLoading(true);
                const accessToken = localStorage.getItem("accessToken");

                const response = await fetch('http://localhost:3001/dossier-medical/appointments/getall', {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                // Ensure we get an array
                let medicalRecordsArray = Array.isArray(data)
                    ? data
                    : Array.isArray(data.medicalRecords)
                        ? data.medicalRecords
                        : Array.isArray(data.data)
                            ? data.data
                            : [];
                setDossiers(medicalRecordsArray);
            } catch (err) {
                setError(err.message);
                console.error('Erreur chargement dossiers:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDossiers();
    }, []);

    // Filtrer les dossiers
    const filteredDossiers = Array.isArray(dossiers) ? dossiers.filter(dossier => {
        const matchesSearch = dossier.speciality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dossier.appointmentId?.toString().includes(searchTerm);

        const matchesSpeciality = filterSpeciality === 'all' ||
            dossier.speciality === filterSpeciality;

        return matchesSearch && matchesSpeciality;
    }) : [];

    // Extraire les spécialités uniques pour le filtre
    const specialities = [...new Set(dossiers.map(d => d.speciality).filter(Boolean))];

    const getFileIcon = (fileType) => {
        if (fileType.includes('pdf')) return (<LucidePanelLeftDashed />);
        if (fileType.includes('image')) return  (<ImagesIcon />);
        if (fileType.includes('word') || fileType.includes('document')) return (<DockIcon />);
        return '📎';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
                        <FolderOpen className="w-8 h-8 text-blue-600 absolute top-4 left-4" />
                    </div>
                    <p className="mt-4 text-slate-600">Chargement des dossiers médicaux...</p>
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
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <FolderOpen className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">Dossiers Médicaux</h1>
                            <p className="text-slate-600">Consultez l'ensemble de vos documents médicaux</p>
                        </div>
                    </div>

                    {/* Statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">Total des dossiers</p>
                                    <p className="text-2xl font-bold text-slate-800">{dossiers.length}</p>
                                </div>
                                <FolderOpen className="w-8 h-8 text-blue-500" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">Documents</p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        {dossiers.reduce((total, dossier) => total + (dossier.files?.length || 0), 0)}
                                    </p>
                                </div>
                                <FileText className="w-8 h-8 text-green-500" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">Approuvés</p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        {dossiers.filter(d => d.approved).length}
                                    </p>
                                </div>
                                <CheckCircle className="w-8 h-8 text-emerald-500" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">En attente</p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        {dossiers.filter(d => !d.approved).length}
                                    </p>
                                </div>
                                <Clock className="w-8 h-8 text-amber-500" />
                            </div>
                        </div>
                    </div>

                    {/* Filtres et recherche */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher par spécialité ou ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-slate-400" />
                                    <select
                                        value={filterSpeciality}
                                        onChange={(e) => setFilterSpeciality(e.target.value)}
                                        className="bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">Toutes les spécialités</option>
                                        {specialities.map(speciality => (
                                            <option key={speciality} value={speciality}>
                                                {speciality}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Liste des dossiers */}
                {error ? (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center">
                        <p className="text-rose-700 font-medium">Erreur lors du chargement des dossiers</p>
                        <p className="text-rose-600 text-sm mt-2">{error}</p>
                    </div>
                ) : filteredDossiers.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-200">
                        <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600 text-lg mb-2">
                            {dossiers.length === 0 ? 'Aucun dossier médical trouvé' : 'Aucun dossier ne correspond aux critères'}
                        </p>
                        <p className="text-slate-500">
                            {dossiers.length === 0
                                ? 'Vos dossiers médicaux apparaîtront ici après vos consultations'
                                : 'Essayez de modifier vos critères de recherche'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredDossiers.map((dossier) => (
                            <DossierCard
                                key={dossier._id || dossier.appointmentId}
                                dossier={dossier}
                                getFileIcon={getFileIcon}
                                formatDate={formatDate}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Composant Carte de Dossier
const DossierCard = ({ dossier, getFileIcon, formatDate }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
            {/* Header de la carte */}
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {dossier.speciality?.charAt(0) || 'D'}
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">{dossier.speciality || 'Non spécifié'}</h3>
                            <p className="text-sm text-slate-500">Consultation</p>
                        </div>
                    </div>

                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${dossier.approved
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                        {dossier.approved ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        {dossier.approved ? 'Approuvé' : 'En attente'}
                    </div>
                </div>

                {/* Informations du dossier */}
                <div className="space-y-3 text-sm">
                  
                    <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4 text-green-500" />
                        <span>Créé le: {formatDate(dossier.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                        <FileText className="w-4 h-4 text-purple-500" />
                        <span>{dossier.files?.length || 0} document(s)</span>
                    </div>
                </div>
            </div>

            {/* Liste des fichiers */}
            <div className="p-6">
                <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Documents associés
                </h4>

                {dossier.files && dossier.files.length > 0 ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {dossier.files.map((file, index) => (
                            <div key={file._id || index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className="text-lg">{getFileIcon(file.fileType)}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-800 truncate">
                                            {file.fileUrl.split('/').pop()}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {file.fileType?.split('/')[1]?.toUpperCase() || 'FICHIER'} •
                                            {formatDate(file.uploadedAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <button
                                        onClick={() => window.open(`http://localhost:3001/${file.fileUrl}`, '_blank')}
                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Voir le document"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => window.open(`http://localhost:3001/${file.fileUrl}`, '_blank', 'download')}
                                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Télécharger"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-slate-500 text-sm">Aucun document associé</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DossiersMedicauxPage;