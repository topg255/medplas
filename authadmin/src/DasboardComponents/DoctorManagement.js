import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    IconSearch,
    IconCheck,
    IconX,
    IconStethoscope,
    IconMapPin,
    IconPhone,
    IconMail,
    IconClock,
    IconStar,
    IconChevronDown,
    IconUserX,
    IconUserCheck,
    IconBadge,
    IconBuildingHospital,
    IconRefresh,
    IconFilter,
    IconChevronLeft,
    IconChevronRight
} from '@tabler/icons-react';

const DoctorManagement = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeView, setActiveView] = useState('doctors-all');
    const [error, setError] = useState(null);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const filterRef = useRef(null);
    
    // États pour la pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [doctorsPerPage] = useState(6);

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

    // Fonction pour formater les données des docteurs
    const formatDoctorData = (doctor) => {
        return {
            id: doctor._id || doctor.id || Math.random().toString(36).substr(2, 9),
            name: doctor.name || 'Nom non disponible',
            email: doctor.email || 'Email non disponible',
            speciality: doctor.Speciality || doctor.speciality || 'Spécialité non spécifiée',
            clinicAffiliation: doctor.ClinicAffiliation || doctor.clinicAffiliation || 'Non affilié',
            phone: doctor.Phone || doctor.phone || 'Non disponible',
            medicalLicense: doctor.MedicalLicense || doctor.medicalLicense || 'N/A',
            status: doctor.approved ? 'approved' : 'pending',
            joinDate: doctor.createdAt || doctor.registrationDate || new Date().toISOString(),
            userType: doctor.userType || 'PDoctorUser',
            consultations: doctor.consultations || 0,
            availability: doctor.availability || 'Disponible'
        };
    };

    // Fonction pour récupérer les docteurs selon le type
    const fetchDoctors = async (type) => {
        setLoading(true);
        setError(null);
        try {
            const endpoints = {
                'doctors-all': 'http://localhost:3001/users/pdoctor/getAll',
                'doctors-approved': 'http://localhost:3001/users/pdoctor/getApproved',
                'doctors-unapproved': 'http://localhost:3001/users/pdoctor/getNonApproved'
            };

            const endpoint = endpoints[type];
            console.log('Fetching doctors from:', endpoint);

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Raw API doctors response:', data);

            // Gérer différents formats de réponse
            let doctorsArray = [];

            if (Array.isArray(data)) {
                doctorsArray = data;
            } else if (data && typeof data === 'object') {
                doctorsArray = [data];
            } else if (data && data.data && Array.isArray(data.data)) {
                doctorsArray = data.data;
            } else if (data && data.doctors && Array.isArray(data.doctors)) {
                doctorsArray = data.doctors;
            } else if (data && data.users && Array.isArray(data.users)) {
                doctorsArray = data.users;
            }

            console.log('Processed doctors array:', doctorsArray);

            // Formater les données pour l'affichage
            const formattedData = doctorsArray.map(doctor => formatDoctorData(doctor));

            setDoctors(formattedData);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setError(`Erreur lors du chargement des docteurs: ${error.message}`);
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors(activeView);
    }, [activeView]);

    // Fonction pour approuver un docteur
    const handleApprove = async (doctorId) => {
        try {
            const response = await fetch(`http://localhost:3001/users/pdoctor/approve/${doctorId}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ approved: true })
            });

            if (!response.ok) {
                throw new Error('Failed to approve doctor');
            }

            const result = await response.json();
            console.log('Approve doctor response:', result);

            // Mettre à jour l'état local
            setDoctors(prev => prev.map(doctor =>
                doctor.id === doctorId ? { ...doctor, status: 'approved' } : doctor
            ));

            // Rafraîchir la liste si on est dans la vue "unapproved"
            if (activeView === 'doctors-unapproved') {
                fetchDoctors(activeView);
            }

            alert('Docteur approuvé avec succès!');

        } catch (error) {
            console.error('Error approving doctor:', error);
            alert('Erreur lors de l\'approbation du docteur');
        }
    };

    // Fonction pour supprimer un docteur
    const handleDelete = async (doctorId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce docteur ? Cette action est irréversible.')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/users/pdoctor/delete/${doctorId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to delete doctor');
            }

            const result = await response.json();
            console.log('Delete doctor response:', result);

            // Mettre à jour l'état local
            setDoctors(prev => prev.filter(doctor => doctor.id !== doctorId));

            alert('Docteur supprimé avec succès!');

        } catch (error) {
            console.error('Error deleting doctor:', error);
            alert('Erreur lors de la suppression du docteur');
        }
    };

    const filteredDoctors = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.medicalLicense.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Logique de pagination
    const indexOfLastDoctor = currentPage * doctorsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
    const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
    const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

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
            case 'approved': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <IconUserCheck size={16} className="text-green-600" />;
            case 'pending': return <IconClock size={16} className="text-orange-600" />;
            default: return <IconUserX size={16} className="text-gray-600" />;
        }
    };

    const getSpecialityColor = (speciality) => {
        const colors = {
            'dermatologie': 'bg-purple-100 text-purple-800',
            'cardiologie': 'bg-red-100 text-red-800',
            'pediatrie': 'bg-blue-100 text-blue-800',
            'chirurgie': 'bg-orange-100 text-orange-800',
            'neurologie': 'bg-indigo-100 text-indigo-800',
            'default': 'bg-gray-100 text-gray-800'
        };
        
        const key = speciality?.toLowerCase() || 'default';
        return colors[key] || colors['default'];
    };

    const getViewTitle = () => {
        switch (activeView) {
            case 'doctors-all': return 'Tous les Docteurs';
            case 'doctors-approved': return 'Docteurs Approuvés';
            case 'doctors-unapproved': return 'Docteurs Non Approuvés';
            default: return 'Docteurs';
        }
    };

    const getViewDescription = () => {
        switch (activeView) {
            case 'doctors-all': return 'Gérez et surveillez tous les docteurs praticiens du système';
            case 'doctors-approved': return 'Liste des docteurs approuvés et actifs';
            case 'doctors-unapproved': return 'Docteurs en attente d\'approbation';
            default: return 'Gérez les docteurs praticiens';
        }
    };

    const filterOptions = [
        {
            id: 'doctors-all',
            label: 'Tous les Docteurs',
            icon: <IconStethoscope size={18} />,
            description: 'Voir tous les docteurs'
        },
        {
            id: 'doctors-approved',
            label: 'Docteurs Approuvés',
            icon: <IconUserCheck size={18} />,
            description: 'Docteurs actifs et approuvés'
        },
        {
            id: 'doctors-unapproved',
            label: 'Docteurs Non Approuvés',
            icon: <IconUserX size={18} />,
            description: 'En attente d\'approbation'
        }
    ];

    const currentFilter = filterOptions.find(opt => opt.id === activeView);

    // Fonction pour générer les numéros de page à afficher
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // Ajuster le début si on est près de la fin
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        
        return pageNumbers;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header avec filtres */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Titre et description */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Gestion des Docteurs
                            </h1>
                            <p className="text-gray-600">
                                {getViewDescription()}
                            </p>
                        </div>

                        {/* Contrôles */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            {/* Recherche */}
                            <div className="relative flex-1 sm:flex-initial">
                                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Rechercher un docteur..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 transition-all"
                                />
                            </div>

                            {/* Dropdown de filtres */}
                            <div className="relative" ref={filterRef}>
                                <button
                                    onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                                    className="flex items-center justify-between space-x-3 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-md hover:shadow-lg w-full sm:w-auto min-w-[240px]"
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
                                            className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
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
                                                            <IconCheck size={18} className="text-blue-600 mt-0.5" />
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
                                onClick={() => fetchDoctors(activeView)}
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
                                <p className="text-sm font-medium text-gray-600">Total Docteurs</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{doctors.length}</p>
                            </div>
                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                                <IconStethoscope className="text-blue-500" size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Approuvés</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">
                                    {doctors.filter(d => d.status === 'approved').length}
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center">
                                <IconUserCheck className="text-green-500" size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Non Approuvés</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">
                                    {doctors.filter(d => d.status === 'pending').length}
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center">
                                <IconUserX className="text-orange-500" size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Résultats Filtrés</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">
                                    {filteredDoctors.length}
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center">
                                <IconFilter className="text-purple-500" size={28} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl shadow-sm">
                        <p className="font-semibold">Erreur de chargement des docteurs</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                )}

                {/* Doctors Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {currentDoctors.map((doctor, index) => (
                                    <motion.div
                                        key={doctor.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
                                    >
                                        {/* Doctor Header avec statut */}
                                        <div className="p-6 border-b border-gray-100">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-bold text-lg text-gray-800 flex-1">{doctor.name}</h3>
                                                <div className="flex items-center space-x-1">
                                                    {getStatusIcon(doctor.status)}
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doctor.status)}`}>
                                                        {doctor.status === 'approved' ? 'Approuvé' : 'En Attente'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSpecialityColor(doctor.speciality)}`}>
                                                    {doctor.speciality}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Doctor Info */}
                                        <div className="p-6">
                                            <div className="space-y-3 text-sm text-gray-600">
                                                <div className="flex items-center space-x-2">
                                                    <IconMail size={16} className="text-gray-400 flex-shrink-0" />
                                                    <span className="truncate">{doctor.email}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <IconPhone size={16} className="text-gray-400 flex-shrink-0" />
                                                    <span>{doctor.phone}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <IconBadge size={16} className="text-gray-400 flex-shrink-0" />
                                                    <span>License: {doctor.medicalLicense}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <IconBuildingHospital size={16} className="text-gray-400 flex-shrink-0" />
                                                    <span className="truncate">Clinique: {doctor.clinicAffiliation}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                                <div className="text-xs">
                                                    <span className="text-gray-500">Disponibilité: </span>
                                                    <span className={`font-medium ${doctor.availability === 'Disponible' ? 'text-green-600' : 'text-gray-500'}`}>
                                                        {doctor.availability}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="px-6 pb-6">
                                            {doctor.status === 'pending' ? (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleApprove(doctor.id)}
                                                        className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white py-2.5 rounded-xl hover:bg-green-600 transition-colors font-medium shadow-sm hover:shadow-md"
                                                    >
                                                        <IconCheck size={18} />
                                                        <span>Approuver</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(doctor.id)}
                                                        className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white py-2.5 rounded-xl hover:bg-red-600 transition-colors font-medium shadow-sm hover:shadow-md"
                                                    >
                                                        <IconX size={18} />
                                                        <span>Rejeter</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleDelete(doctor.id)}
                                                        className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white py-2.5 rounded-xl hover:bg-red-600 transition-colors font-medium shadow-sm hover:shadow-md"
                                                    >
                                                        <IconX size={18} />
                                                        <span>Supprimer</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="text-sm text-gray-600">
                                    Affichage de {indexOfFirstDoctor + 1} à {Math.min(indexOfLastDoctor, filteredDoctors.length)} sur {filteredDoctors.length} docteurs
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    {/* Bouton Précédent */}
                                    <button
                                        onClick={prevPage}
                                        disabled={currentPage === 1}
                                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all ${
                                            currentPage === 1
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <IconChevronLeft size={16} />
                                        <span>Précédent</span>
                                    </button>

                                    {/* Numéros de page */}
                                    <div className="flex items-center space-x-1">
                                        {getPageNumbers().map(pageNumber => (
                                            <button
                                                key={pageNumber}
                                                onClick={() => goToPage(pageNumber)}
                                                className={`w-10 h-10 rounded-lg transition-all ${
                                                    currentPage === pageNumber
                                                        ? 'bg-blue-500 text-white shadow-md'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Bouton Suivant */}
                                    <button
                                        onClick={nextPage}
                                        disabled={currentPage === totalPages}
                                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all ${
                                            currentPage === totalPages
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
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
                {!loading && filteredDoctors.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100"
                    >
                        <IconStethoscope size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun docteur trouvé</h3>
                        <p className="text-gray-500">
                            {searchTerm ? 'Essayez d\'ajuster vos termes de recherche' : 'Aucun docteur disponible pour cette vue'}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default DoctorManagement;