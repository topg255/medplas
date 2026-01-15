import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    IconSearch,
    IconFilter,
    IconCheck,
    IconX,
    IconEye,
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
    IconHeart,
    IconRefresh,
    IconChevronLeft,
    IconChevronRight
} from '@tabler/icons-react';

const ReferentDoctorManagement = () => {
    const [RefDoctors, setRefDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeView, setActiveView] = useState('referents-all');
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

    // Fonction pour formater les données des docteurs référents
    const formatDoctorData = (doctor) => {
        return {
            id: doctor._id || doctor.id || Math.random().toString(36).substr(2, 9),
            name: doctor.name || 'Nom non disponible',
            email: doctor.email || 'Email non disponible',
            speciality: doctor.Speciality || doctor.speciality || 'Spécialité non spécifiée',
            hospital: doctor.Hospital || doctor.hospital || 'Hôpital non spécifié',
            phone: doctor.Phone || doctor.phone || 'Non disponible',
            medicalLicense: doctor.MedicalLicense || doctor.medicalLicense || 'N/A',
            status: doctor.approved ? 'approved' : 'pending',
            rating: doctor.rating || 4.5,
            experience: doctor.experience || '0 ans',
            joinDate: doctor.createdAt || doctor.registrationDate || new Date().toISOString(),
            role: doctor.role || 'RefDoctor',
            consultations: doctor.consultations || 0,
            availability: doctor.availability || 'Disponible'
        };
    };

    // Fonction pour récupérer les docteurs référents selon le type
    const fetchRefDoctors = async (type) => {
        setLoading(true);
        setError(null);
        try {
            const endpoints = {
                'referents-all': 'http://localhost:3001/users/refdoctor/getAll',
                'referents-approved': 'http://localhost:3001/users/refdoctor/getApproved',
                'referents-unapproved': 'http://localhost:3001/users/refdoctor/getNonApproved'
            };

            const endpoint = endpoints[type];
            console.log('Fetching referent RefDoctors from:', endpoint);

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Raw API referent RefDoctors response:', data);

            // Gérer différents formats de réponse
            let RefDoctorsArray = [];

            if (Array.isArray(data)) {
                RefDoctorsArray = data;
            } else if (data && typeof data === 'object') {
                RefDoctorsArray = [data];
            } else if (data && data.data && Array.isArray(data.data)) {
                RefDoctorsArray = data.data;
            } else if (data && data.RefDoctors && Array.isArray(data.RefDoctors)) {
                RefDoctorsArray = data.RefDoctors;
            } else if (data && data.users && Array.isArray(data.users)) {
                RefDoctorsArray = data.users;
            }

            console.log('Processed referent RefDoctors array:', RefDoctorsArray);

            // Formater les données pour l'affichage
            const formattedData = RefDoctorsArray.map(doctor => formatDoctorData(doctor));

            setRefDoctors(formattedData);
        } catch (error) {
            console.error('Error fetching referent RefDoctors:', error);
            setError(`Erreur lors du chargement des docteurs référents: ${error.message}`);
            setRefDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRefDoctors(activeView);
    }, [activeView]);

    // Fonction pour approuver un docteur référent
    const handleApprove = async (doctorId) => {
        try {
            const response = await fetch(`http://localhost:3001/users/refdoctor/approve/${doctorId}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ approved: true })
            });

            if (!response.ok) {
                throw new Error('Failed to approve referent doctor');
            }

            const result = await response.json();
            console.log('Approve referent doctor response:', result);

            // Mettre à jour l'état local
            setRefDoctors(prev => prev.map(doctor =>
                doctor.id === doctorId ? { ...doctor, status: 'approved' } : doctor
            ));

            // Rafraîchir la liste si on est dans la vue "unapproved"
            if (activeView === 'referents-unapproved') {
                fetchRefDoctors(activeView);
            }

            alert('Docteur référent approuvé avec succès!');

        } catch (error) {
            console.error('Error approving referent doctor:', error);
            alert('Erreur lors de l\'approbation du docteur référent');
        }
    };

    // Fonction pour supprimer un docteur référent
    const handleDelete = async (doctorId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce docteur référent ? Cette action est irréversible.')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/users/refdoctor/delete/${doctorId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to delete referent doctor');
            }

            const result = await response.json();
            console.log('Delete referent doctor response:', result);

            // Mettre à jour l'état local
            setRefDoctors(prev => prev.filter(doctor => doctor.id !== doctorId));

            alert('Docteur référent supprimé avec succès!');

        } catch (error) {
            console.error('Error deleting referent doctor:', error);
            alert('Erreur lors de la suppression du docteur référent');
        }
    };

    const filteredRefDoctors = RefDoctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.medicalLicense.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Logique de pagination
    const totalItems = filteredRefDoctors.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Calculer les éléments à afficher pour la page courante
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDoctors = filteredRefDoctors.slice(indexOfFirstItem, indexOfLastItem);

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
            case 'referents-all': return 'Tous les Docteurs Référents';
            case 'referents-approved': return 'Docteurs Référents Approuvés';
            case 'referents-unapproved': return 'Docteurs Référents Non Approuvés';
            default: return 'Docteurs Référents';
        }
    };

    const getViewDescription = () => {
        switch (activeView) {
            case 'referents-all': return 'Gérez et surveillez tous les docteurs référents du système';
            case 'referents-approved': return 'Liste des docteurs référents approuvés et actifs';
            case 'referents-unapproved': return 'Docteurs référents en attente d\'approbation';
            default: return 'Gérez les docteurs référents';
        }
    };

    const filterOptions = [
        {
            id: 'referents-all',
            label: 'Tous les Docteurs Référents',
            icon: <IconHeart size={18} />,
            description: 'Voir tous les docteurs référents'
        },
        {
            id: 'referents-approved',
            label: 'Docteurs Référents Approuvés',
            icon: <IconUserCheck size={18} />,
            description: 'Docteurs référents actifs et approuvés'
        },
        {
            id: 'referents-unapproved',
            label: 'Docteurs Référents Non Approuvés',
            icon: <IconUserX size={18} />,
            description: 'En attente d\'approbation'
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
                                Gestion des Docteurs Référents
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
                                    placeholder="Rechercher un docteur référent..."
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
                                onClick={() => fetchRefDoctors(activeView)}
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
                                <p className="text-sm font-medium text-gray-600">Total Docteurs Référents</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{RefDoctors.length}</p>
                            </div>
                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                                <IconHeart className="text-blue-500" size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Approuvés</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">
                                    {RefDoctors.filter(d => d.status === 'approved').length}
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
                                    {RefDoctors.filter(d => d.status === 'pending').length}
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
                                    {filteredRefDoctors.length}
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
                        <p className="font-semibold">Erreur de chargement des docteurs référents</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                )}

                {/* RefDoctors Grid */}
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
                                                <div className="flex items-center space-x-1 bg-amber-50 px-2 py-1 rounded-lg">
                                                    <IconStar size={14} className="text-amber-500 fill-amber-500" />
                                                    <span className="text-xs font-medium text-amber-700">{doctor.rating}</span>
                                                </div>
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
                                                    <span>Hôpital: {doctor.hospital}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                                <div className="text-xs">
                                                    <span className="text-gray-500">Expérience: </span>
                                                    <span className="font-medium text-gray-700">{doctor.experience}</span>
                                                </div>
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

                        {/* Pagination - Seulement si plus de 6 éléments */}
                        {totalItems > 6 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                                {/* Informations sur la pagination */}
                                <div className="text-sm text-gray-600">
                                    Affichage de <span className="font-semibold">{indexOfFirstItem + 1}</span> à{' '}
                                    <span className="font-semibold">
                                        {Math.min(indexOfLastItem, totalItems)}
                                    </span>{' '}
                                    sur <span className="font-semibold">{totalItems}</span> docteurs référents
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
                {!loading && filteredRefDoctors.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100"
                    >
                        <IconHeart size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun docteur référent trouvé</h3>
                        <p className="text-gray-500">
                            {searchTerm ? 'Essayez d\'ajuster vos termes de recherche' : 'Aucun docteur référent disponible pour cette vue'}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ReferentDoctorManagement;