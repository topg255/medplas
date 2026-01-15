import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    IconSearch,
    IconFilter,
    IconX,
    IconEye,
    IconUser,
    IconMapPin,
    IconPhone,
    IconMail,
    IconCalendar,
    IconChevronDown,
    IconUserX,
    IconId,
    IconBuildingHospital,
    IconRefresh,
    IconChevronLeft,
    IconChevronRight
} from '@tabler/icons-react';

const PatientManagement = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeView, setActiveView] = useState('patients-all');
    const [error, setError] = useState(null);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const filterRef = useRef(null);

    // États pour la pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    // Fermer le dropdown quand on clique à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setFilterDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Réinitialiser la pagination quand la vue ou la recherche change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeView, searchTerm]);

    // Fonction pour obtenir les headers d'authentification
    const getAuthHeaders = () => {
        const token = localStorage.getItem('accessToken');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    // Fonction pour formater les données des patients
    const formatPatientData = (patient) => {
        return {
            id: patient._id || patient.id || Math.random().toString(36).substr(2, 9),
            name: patient.name || 'Nom non disponible',
            email: patient.email || 'Email non disponible',
            insurance: patient.insurance || 'Non assuré',
            birthDate: patient.birthDate || 'Date non disponible',
            phone: patient.phone || patient.Phone || 'Non disponible',
            address: patient.address || patient.location || 'Adresse non disponible',
            role: patient.role || 'patient',
            joinDate: patient.createdAt || patient.registrationDate || new Date().toISOString(),
            status: patient.status || 'active',
            gender: patient.gender || 'Non spécifié',
            emergencyContact: patient.emergencyContact || 'Non disponible'
        };
    };

    // Fonction pour récupérer les patients
    const fetchPatients = async () => {
        setLoading(true);
        setError(null);
        try {
            const endpoint = 'http://localhost:3001/users/patient/getAll';
            console.log('Fetching patients from:', endpoint);

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Raw API patients response:', data);

            // Gérer différents formats de réponse
            let patientsArray = [];

            if (Array.isArray(data)) {
                patientsArray = data;
            } else if (data && typeof data === 'object') {
                patientsArray = [data];
            } else if (data && data.data && Array.isArray(data.data)) {
                patientsArray = data.data;
            } else if (data && data.patients && Array.isArray(data.patients)) {
                patientsArray = data.patients;
            } else if (data && data.users && Array.isArray(data.users)) {
                patientsArray = data.users;
            }

            console.log('Processed patients array:', patientsArray);

            // Formater les données pour l'affichage
            const formattedData = patientsArray.map(patient => formatPatientData(patient));

            setPatients(formattedData);
        } catch (error) {
            console.error('Error fetching patients:', error);
            setError(`Erreur lors du chargement des patients: ${error.message}`);
            setPatients([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    // Fonction pour calculer l'âge à partir de la date de naissance
    const calculateAge = (birthDate) => {
        if (!birthDate) return 'N/A';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    // Fonction pour formater la date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Fonction pour supprimer un patient
    const handleDelete = async (patientId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ? Cette action est irréversible.')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/users/patient/delete/${patientId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to delete patient');
            }

            const result = await response.json();
            console.log('Delete patient response:', result);

            // Mettre à jour l'état local
            setPatients(prev => prev.filter(patient => patient.id !== patientId));

            alert('Patient supprimé avec succès!');

        } catch (error) {
            console.error('Error deleting patient:', error);
            alert('Erreur lors de la suppression du patient');
        }
    };

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.insurance.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (patient.phone && patient.phone.toString().includes(searchTerm))
    );

    // Logique de pagination
    const totalItems = filteredPatients.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Calculer les éléments à afficher pour la page courante
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPatients = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);

    // Fonctions de navigation de pagination
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-gray-100 text-gray-800';
            case 'pending': return 'bg-orange-100 text-orange-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    const getGenderColor = (gender) => {
        switch (gender?.toLowerCase()) {
            case 'male': return 'bg-blue-100 text-blue-800';
            case 'female': return 'bg-pink-100 text-pink-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filterOptions = [
        {
            id: 'patients-all',
            label: 'Tous les Patients',
            icon: <IconUser size={18} />,
            description: 'Voir tous les patients'
        },
        {
            id: 'patients-active',
            label: 'Patients Actifs',
            icon: <IconUser size={18} />,
            description: 'Patients actifs dans le système'
        },
        {
            id: 'patients-insured',
            label: 'Patients Assurés',
            icon: <IconId size={18} />,
            description: 'Patients avec assurance'
        }
    ];

    const currentFilter = filterOptions.find(opt => opt.id === activeView);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header avec filtres */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Titre et description */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Gestion des Patients
                            </h1>
                            <p className="text-gray-600">
                                Gérez et surveillez tous les patients du système
                            </p>
                        </div>

                        {/* Contrôles */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            {/* Recherche */}
                            <div className="relative flex-1 sm:flex-initial">
                                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Rechercher un patient..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 transition-all"
                                />
                            </div>

                            {/* Dropdown de filtres */}
                            <div className="relative" ref={filterRef}>
                                <button
                                    onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                                    className="flex items-center justify-between space-x-3 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-md hover:shadow-lg w-full sm:w-auto min-w-[200px]"
                                >
                                    <div className="flex items-center space-x-3">
                                        {currentFilter?.icon}
                                        <span className="font-medium">{currentFilter?.label}</span>
                                    </div>
                                    <motion.div
                                        animate={{ rotate: filterDropdownOpen ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <IconChevronDown size={18} />
                                    </motion.div>
                                </button>

                                <AnimatePresence>
                                    {filterDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                                        >
                                            <div className="p-2">
                                                {filterOptions.map((option) => (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => {
                                                            setActiveView(option.id);
                                                            setFilterDropdownOpen(false);
                                                        }}
                                                        className={`w-full flex items-start space-x-3 p-3 rounded-lg transition-all ${
                                                            activeView === option.id
                                                                ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                                                                : 'hover:bg-gray-50 text-gray-700 border-2 border-transparent'
                                                        }`}
                                                    >
                                                        <div className={`mt-0.5 ${activeView === option.id ? 'text-blue-600' : 'text-gray-500'}`}>
                                                            {option.icon}
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                            <div className="font-medium">{option.label}</div>
                                                            <div className={`text-xs mt-0.5 ${activeView === option.id ? 'text-blue-600' : 'text-gray-500'}`}>
                                                                {option.description}
                                                            </div>
                                                        </div>
                                                        {activeView === option.id && (
                                                            <IconChevronDown size={18} className="text-blue-600 mt-0.5 rotate-180" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Bouton Actualiser */}
                            <button
                                onClick={fetchPatients}
                                className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
                            >
                                <IconRefresh size={18} />
                                <span className="hidden sm:inline">Actualiser</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{patients.length}</p>
                            </div>
                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                                <IconUser className="text-blue-500" size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Patients Actifs</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">
                                    {patients.filter(p => p.status === 'active').length}
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center">
                                <IconUser className="text-green-500" size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Assurés</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">
                                    {patients.filter(p => p.insurance && p.insurance !== 'Non assuré').length}
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center">
                                <IconId className="text-purple-500" size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Résultats Filtrés</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">
                                    {filteredPatients.length}
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center">
                                <IconFilter className="text-orange-500" size={28} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl shadow-sm">
                        <p className="font-semibold">Erreur de chargement des patients</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                )}

                {/* Patients Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {currentPatients.map((patient, index) => (
                                    <motion.div
                                        key={patient.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
                                    >
                                        {/* Patient Header */}
                                        <div className="p-6 border-b border-gray-100">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-bold text-lg text-gray-800 flex-1">{patient.name}</h3>
                                                <div className="flex items-center space-x-1">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                                                        {patient.status === 'active' ? 'Actif' : patient.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGenderColor(patient.gender)}`}>
                                                    {patient.gender}
                                                </span>
                                                <div className="text-xs text-gray-500 font-medium">
                                                    {calculateAge(patient.birthDate)} ans
                                                </div>
                                            </div>
                                        </div>

                                        {/* Patient Info */}
                                        <div className="p-6">
                                            <div className="space-y-3 text-sm text-gray-600">
                                                <div className="flex items-center space-x-2">
                                                    <IconMail size={16} className="text-gray-400 flex-shrink-0" />
                                                    <span className="truncate">{patient.email}</span>
                                                </div>
                                                {patient.phone && (
                                                    <div className="flex items-center space-x-2">
                                                        <IconPhone size={16} className="text-gray-400 flex-shrink-0" />
                                                        <span>{patient.phone}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center space-x-2">
                                                    <IconId size={16} className="text-gray-400 flex-shrink-0" />
                                                    <span>Assurance: {patient.insurance}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <IconCalendar size={16} className="text-gray-400 flex-shrink-0" />
                                                    <span>Né le: {formatDate(patient.birthDate)}</span>
                                                </div>
                                                {patient.address && (
                                                    <div className="flex items-center space-x-2">
                                                        <IconMapPin size={16} className="text-gray-400 flex-shrink-0" />
                                                        <span className="truncate">{patient.address}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="px-6 pb-6">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleDelete(patient.id)}
                                                    className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white py-2.5 rounded-xl hover:bg-red-600 transition-colors font-medium shadow-sm hover:shadow-md"
                                                >
                                                    <IconX size={18} />
                                                    <span>Supprimer</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Pagination - Seulement si plus de 6 éléments */}
                        {totalItems > 6 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                                {/* Informations sur la pagination */}
                                <div className="text-sm text-gray-600">
                                    Affichage de <span className="font-semibold">{indexOfFirstItem + 1}</span> à{' '}
                                    <span className="font-semibold">
                                        {Math.min(indexOfLastItem, totalItems)}
                                    </span>{' '}
                                    sur <span className="font-semibold">{totalItems}</span> patients
                                </div>

                                {/* Contrôles de pagination */}
                                <div className="flex items-center space-x-2">
                                    {/* Bouton Précédent */}
                                    <button
                                        onClick={prevPage}
                                        disabled={currentPage === 1}
                                        className="flex items-center space-x-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <IconChevronLeft size={16} />
                                        <span>Précédent</span>
                                    </button>

                                    {/* Numéros de page */}
                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            // Logique pour afficher les pages autour de la page courante
                                            let pageNumber;
                                            if (totalPages <= 5) {
                                                pageNumber = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNumber = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNumber = totalPages - 4 + i;
                                            } else {
                                                pageNumber = currentPage - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={pageNumber}
                                                    onClick={() => goToPage(pageNumber)}
                                                    className={`w-10 h-10 rounded-lg transition-colors ${
                                                        currentPage === pageNumber
                                                            ? 'bg-blue-500 text-white shadow-md'
                                                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Bouton Suivant */}
                                    <button
                                        onClick={nextPage}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center space-x-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span>Suivant</span>
                                        <IconChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Empty State */}
                {!loading && filteredPatients.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100"
                    >
                        <IconUser size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun patient trouvé</h3>
                        <p className="text-gray-500">
                            {searchTerm ? 'Essayez d\'ajuster vos termes de recherche' : 'Aucun patient disponible'}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default PatientManagement;