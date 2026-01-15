import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    IconSearch,
    IconFilter,
    IconCheck,
    IconX,
    IconEye,
    IconBuildingHospital,
    IconMapPin,
    IconPhone,
    IconMail,
    IconClock,
    IconStar,
    IconChevronDown,
    IconUserX,
    IconUserCheck,
    IconCalendar,
    IconRefresh,
    IconChevronLeft,
    IconChevronRight
} from '@tabler/icons-react';

const ClinicsManagement = () => {
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeView, setActiveView] = useState('clinics-all');
    const [error, setError] = useState(null);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const filterRef = useRef(null);

    // États pour la pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [clinicsPerPage] = useState(6);
    const [currentAvailPage, setCurrentAvailPage] = useState(1);
    const [availPerPage] = useState(6);

    const [availabilities, setAvailabilities] = useState([]);
    const [availLoading, setAvailLoading] = useState(false);
    const [availError, setAvailError] = useState(null);
    const [groupedAvailabilities, setGroupedAvailabilities] = useState({});

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
        setCurrentAvailPage(1);
    }, [activeView, searchTerm]);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('accessToken');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    const formatClinicData = (clinic) => {
        return {
            id: clinic._id || clinic.id || Math.random().toString(36).substr(2, 9),
            name: clinic.name || clinic.username || 'Nom non disponible',
            address: clinic.location || clinic.address || 'Adresse non disponible',
            phone: clinic.Phone || clinic.phone || clinic.telephone || 'Non disponible',
            email: clinic.email || 'Email non disponible',
            status: clinic.approved ? 'approved' : 'pending',
            rating: clinic.rating || 4.5,
            doctorsCount: clinic.doctorsCount || clinic.doctors || 0,
            joinDate: clinic.createdAt || clinic.registrationDate || new Date().toISOString(),
            pack: clinic.pack || clinic.subscription || 'Basic',
            deployed: clinic.deployed || false,
            matricule: clinic.Matricule || clinic.matricule || null,
            userType: clinic.userType || 'ClinicUser'
        };
    };

    const fetchClinics = async (type) => {
        setLoading(true);
        setError(null);
        try {
            const endpoints = {
                'clinics-all': 'http://localhost:3001/users/clinic/getAll',
                'clinics-approved': 'http://localhost:3001/users/clinic/getApproved',
                'clinics-unapproved': 'http://localhost:3001/users/clinic/getNonApproved'
            };

            const endpoint = endpoints[type];
            console.log('Fetching from:', endpoint);

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Raw API response:', data);

            let clinicsArray = [];

            if (Array.isArray(data)) {
                clinicsArray = data;
            } else if (data && typeof data === 'object') {
                clinicsArray = [data];
            } else if (data && data.data && Array.isArray(data.data)) {
                clinicsArray = data.data;
            } else if (data && data.clinics && Array.isArray(data.clinics)) {
                clinicsArray = data.clinics;
            } else if (data && data.users && Array.isArray(data.users)) {
                clinicsArray = data.users;
            }

            console.log('Processed clinics array:', clinicsArray);

            const formattedData = clinicsArray.map(clinic => formatClinicData(clinic));
            setClinics(formattedData);

            return formattedData;
        } catch (error) {
            console.error('Error fetching clinics:', error);
            setError(`Erreur lors du chargement des cliniques: ${error.message}`);
            setClinics([]);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailabilities = async () => {
        setAvailLoading(true);
        setAvailError(null);
        try {
            const clinicsResponse = await fetch('http://localhost:3001/users/clinic/getAll', {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!clinicsResponse.ok) {
                throw new Error(`HTTP error! status: ${clinicsResponse.status}`);
            }

            const clinicsData = await clinicsResponse.json();
            console.log('Clinics data for mapping:', clinicsData);

            const clinicMap = {};
            const clinicDetailsMap = {};
            let clinicsArray = [];

            if (Array.isArray(clinicsData)) {
                clinicsArray = clinicsData;
            } else if (clinicsData && Array.isArray(clinicsData.data)) {
                clinicsArray = clinicsData.data;
            } else if (clinicsData && Array.isArray(clinicsData.clinics)) {
                clinicsArray = clinicsData.clinics;
            } else if (clinicsData && Array.isArray(clinicsData.users)) {
                clinicsArray = clinicsData.users;
            }

            clinicsArray.forEach(clinic => {
                const clinicId = clinic._id || clinic.id;
                const clinicName = clinic.name || clinic.username || 'Nom non disponible';
                if (clinicId) {
                    clinicMap[clinicId] = clinicName;
                    clinicMap[clinicId.toString()] = clinicName;
                    
                    clinicDetailsMap[clinicId] = {
                        id: clinicId,
                        name: clinicName,
                        email: clinic.email || 'Email non disponible',
                        phone: clinic.Phone || clinic.phone || 'Non disponible',
                        address: clinic.location || clinic.address || 'Adresse non disponible',
                        approved: clinic.approved || false
                    };
                    clinicDetailsMap[clinicId.toString()] = clinicDetailsMap[clinicId];
                }
            });

            console.log('Clinic ID to Name Map:', clinicMap);

            const response = await fetch('http://localhost:3001/appointment/clinics/allavailability', {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Raw availability response:', data);

            let availabilityArray = [];

            if (Array.isArray(data)) {
                availabilityArray = data;
            } else if (data && Array.isArray(data.clinicAvailabilities)) {
                availabilityArray = data.clinicAvailabilities;
            } else if (data && Array.isArray(data.availabilities)) {
                availabilityArray = data.availabilities;
            } else if (data && data.data && Array.isArray(data.data)) {
                availabilityArray = data.data;
            } else if (data && data.data && Array.isArray(data.data.clinicAvailabilities)) {
                availabilityArray = data.data.clinicAvailabilities;
            } else if (data && typeof data === 'object' && (data.clinicId || data.id)) {
                availabilityArray = [data];
            }

            console.log('Availability Array:', availabilityArray);

            const formatted = availabilityArray.map(item => {
                const clinicId = item.clinicId || item.clinic || (item.clinic?._id) || item.clinic_id || null;
                const startTime = item.startTime || item.from || item.start || null;
                const endTime = item.endTime || item.to || item.end || null;
                const available = typeof item.available !== 'undefined' ? item.available : !!item.isAvailable;

                let clinicName = 'Nom non disponible';
                
                if (clinicId) {
                    clinicName = clinicMap[clinicId];
                    
                    if (!clinicName || clinicName === 'Nom non disponible') {
                        clinicName = clinicMap[clinicId.toString()];
                    }
                    
                    if (!clinicName || clinicName === 'Nom non disponible') {
                        clinicName = `Clinique ${clinicId}`;
                        console.warn(`⚠️ Clinic name not found for ID: ${clinicId}`);
                    }
                }

                return {
                    id: item.id || item._id || `${clinicId}-${startTime}-${endTime}`,
                    clinicId,
                    clinicName,
                    clinicDetails: clinicDetailsMap[clinicId] || clinicDetailsMap[clinicId?.toString()] || null,
                    startTime,
                    endTime,
                    available: !!available
                };
            });

            console.log('Formatted availabilities with names:', formatted);
            
            const grouped = formatted.reduce((acc, avail) => {
                const clinicKey = avail.clinicId?.toString() || 'unknown';
                if (!acc[clinicKey]) {
                    acc[clinicKey] = {
                        clinicId: avail.clinicId,
                        clinicName: avail.clinicName,
                        clinicDetails: avail.clinicDetails,
                        availabilities: []
                    };
                }
                acc[clinicKey].availabilities.push({
                    id: avail.id,
                    startTime: avail.startTime,
                    endTime: avail.endTime,
                    available: avail.available
                });
                return acc;
            }, {});

            console.log('Grouped availabilities:', grouped);
            
            setAvailabilities(formatted);
            setGroupedAvailabilities(grouped);
            return formatted;
        } catch (err) {
            console.error('Error fetching availabilities:', err);
            setAvailError(`Erreur lors du chargement des disponibilités: ${err.message}`);
            setAvailabilities([]);
            setGroupedAvailabilities({});
            return [];
        } finally {
            setAvailLoading(false);
        }
    };

    useEffect(() => {
        if (activeView === 'clinics-availability') {
            fetchAvailabilities();
        } else {
            fetchClinics(activeView);
        }
    }, [activeView]);

    const handleApprove = async (clinicId) => {
        try {
            const response = await fetch(`http://localhost:3001/users/clinic/approve/${clinicId}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ approved: true })
            });

            if (!response.ok) {
                throw new Error('Failed to approve clinic');
            }

            const result = await response.json();
            console.log('Approve response:', result);

            setClinics(prev => prev.map(clinic =>
                clinic.id === clinicId ? { ...clinic, status: 'approved' } : clinic
            ));

            if (activeView === 'clinics-unapproved') {
                fetchClinics(activeView);
            }

            alert('Clinique approuvée avec succès!');

        } catch (error) {
            console.error('Error approving clinic:', error);
            alert('Erreur lors de l\'approbation de la clinique');
        }
    };

    const handleReject = async (clinicId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir rejeter cette clinique ? Cette action est irréversible.')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/users/clinic/delete/${clinicId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to delete clinic');
            }

            const result = await response.json();
            console.log('Delete response:', result);

            setClinics(prev => prev.filter(clinic => clinic.id !== clinicId));

            alert('Clinique rejetée avec succès!');

        } catch (error) {
            console.error('Error rejecting clinic:', error);
            alert('Erreur lors du rejet de la clinique');
        }
    };

    const filteredClinics = clinics.filter(clinic =>
        clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredGroupedAvailabilities = Object.entries(groupedAvailabilities).filter(([clinicKey, clinicData]) =>
        clinicData.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (clinicData.clinicDetails?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (clinicData.clinicDetails?.address || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Logique de pagination pour les cliniques
    const indexOfLastClinic = currentPage * clinicsPerPage;
    const indexOfFirstClinic = indexOfLastClinic - clinicsPerPage;
    const currentClinics = filteredClinics.slice(indexOfFirstClinic, indexOfLastClinic);
    const totalClinicPages = Math.ceil(filteredClinics.length / clinicsPerPage);

    // Logique de pagination pour les disponibilités
    const indexOfLastAvail = currentAvailPage * availPerPage;
    const indexOfFirstAvail = indexOfLastAvail - availPerPage;
    const currentAvailabilities = filteredGroupedAvailabilities.slice(indexOfFirstAvail, indexOfLastAvail);
    const totalAvailPages = Math.ceil(filteredGroupedAvailabilities.length / availPerPage);

    // Fonctions de navigation pour les cliniques
    const nextClinicPage = () => {
        if (currentPage < totalClinicPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevClinicPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToClinicPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Fonctions de navigation pour les disponibilités
    const nextAvailPage = () => {
        if (currentAvailPage < totalAvailPages) {
            setCurrentAvailPage(currentAvailPage + 1);
        }
    };

    const prevAvailPage = () => {
        if (currentAvailPage > 1) {
            setCurrentAvailPage(currentAvailPage - 1);
        }
    };

    const goToAvailPage = (pageNumber) => {
        setCurrentAvailPage(pageNumber);
    };

    // Fonction pour générer les numéros de page
    const getPageNumbers = (currentPage, totalPages) => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        
        return pageNumbers;
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

    const getViewTitle = () => {
        switch (activeView) {
            case 'clinics-all': return 'Toutes les Cliniques';
            case 'clinics-approved': return 'Cliniques Approuvées';
            case 'clinics-unapproved': return 'Cliniques Non Approuvées';
            case 'clinics-availability': return 'Disponibilités des Cliniques';
            default: return 'Cliniques';
        }
    };

    const getViewDescription = () => {
        switch (activeView) {
            case 'clinics-all': return 'Gérez et surveillez toutes les cliniques médicales du système';
            case 'clinics-approved': return 'Liste des cliniques approuvées et actives';
            case 'clinics-unapproved': return 'Cliniques en attente d\'approbation';
            case 'clinics-availability': return 'Voir toutes les plages de disponibilité groupées par clinique';
            default: return 'Gérez les cliniques médicales';
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'Date non disponible';
        const date = new Date(dateString);
        return date.toLocaleString('fr-FR', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filterOptions = [
        {
            id: 'clinics-all',
            label: 'Toutes les Cliniques',
            icon: <IconBuildingHospital size={18} />,
            description: 'Voir toutes les cliniques'
        },
        {
            id: 'clinics-approved',
            label: 'Cliniques Approuvées',
            icon: <IconUserCheck size={18} />,
            description: 'Cliniques actives et approuvées'
        },
        {
            id: 'clinics-unapproved',
            label: 'Cliniques Non Approuvées',
            icon: <IconUserX size={18} />,
            description: 'En attente d\'approbation'
        },
        {
            id: 'clinics-availability',
            label: 'Disponibilités Cliniques',
            icon: <IconClock size={18} />,
            description: 'Gérer les horaires'
        }
    ];

    const currentFilter = filterOptions.find(opt => opt.id === activeView);

    // Composant de pagination réutilisable
    const Pagination = ({ currentPage, totalPages, onPageChange, onPrev, onNext, itemsCount, totalItems, itemsPerPage, indexOfFirstItem }) => (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-sm text-gray-600">
                Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfFirstItem + itemsPerPage, totalItems)} sur {totalItems} éléments
            </div>
            
            <div className="flex items-center space-x-2">
                {/* Bouton Précédent */}
                <button
                    onClick={onPrev}
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
                    {getPageNumbers(currentPage, totalPages).map(pageNumber => (
                        <button
                            key={pageNumber}
                            onClick={() => onPageChange(pageNumber)}
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
                    onClick={onNext}
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
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header avec filtres */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Titre et description */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Gestion des Cliniques
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
                                    placeholder="Rechercher..."
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
                                onClick={() => {
                                    if (activeView === 'clinics-availability') fetchAvailabilities();
                                    else fetchClinics(activeView);
                                }}
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
                                <p className="text-sm font-medium text-gray-600">
                                    {activeView === 'clinics-availability' ? 'Cliniques avec Disponibilités' : 'Total des Cliniques'}
                                </p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">
                                    {activeView === 'clinics-availability' ? Object.keys(groupedAvailabilities).length : clinics.length}
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                                <IconBuildingHospital className="text-blue-500" size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    {activeView === 'clinics-availability' ? 'Total Disponibilités' : 'Approuvées'}
                                </p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">
                                    {activeView === 'clinics-availability' ? availabilities.length : clinics.filter(c => c.status === 'approved').length}
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center">
                                {activeView === 'clinics-availability' ? 
                                    <IconCalendar className="text-green-500" size={28} /> :
                                    <IconUserCheck className="text-green-500" size={28} />
                                }
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    {activeView === 'clinics-availability' ? 'Disponibles' : 'Non Approuvées'}
                                </p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">
                                    {activeView === 'clinics-availability' ? 
                                        availabilities.filter(a => a.available).length : 
                                        clinics.filter(c => c.status === 'pending').length
                                    }
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center">
                                {activeView === 'clinics-availability' ? 
                                    <IconClock className="text-orange-500" size={28} /> :
                                    <IconUserX className="text-orange-500" size={28} />
                                }
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Résultats Filtrés</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">
                                    {activeView === 'clinics-availability' ? filteredGroupedAvailabilities.length : filteredClinics.length}
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center">
                                <IconFilter className="text-purple-500" size={28} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Messages */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl shadow-sm">
                        <p className="font-semibold">Erreur de chargement des cliniques</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                )}

                {availError && activeView === 'clinics-availability' && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl shadow-sm">
                        <p className="font-semibold">Erreur de chargement des disponibilités</p>
                        <p className="text-sm mt-1">{availError}</p>
                    </div>
                )}

                {/* Content Area */}
                {activeView === 'clinics-availability' ? (
                    availLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                <AnimatePresence>
                                    {currentAvailabilities.map(([clinicKey, clinicData], idx) => (
                                        <motion.div
                                            key={clinicKey}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
                                        >
                                            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className="font-bold text-lg text-gray-800 flex-1">{clinicData.clinicName}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${clinicData.clinicDetails?.approved ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {clinicData.availabilities.length} disponibilité{clinicData.availabilities.length > 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                                
                                                {clinicData.clinicDetails && (
                                                    <div className="space-y-1 text-sm text-gray-600">
                                                        {clinicData.clinicDetails.email && (
                                                            <div className="flex items-center space-x-2">
                                                                <IconMail size={14} className="text-gray-400" />
                                                                <span className="truncate">{clinicData.clinicDetails.email}</span>
                                                            </div>
                                                        )}
                                                        {clinicData.clinicDetails.phone && (
                                                            <div className="flex items-center space-x-2">
                                                                <IconPhone size={14} className="text-gray-400" />
                                                                <span>{clinicData.clinicDetails.phone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-6">
                                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                                    {clinicData.availabilities.map((avail, index) => (
                                                        <div
                                                            key={avail.id || index}
                                                            className={`p-4 rounded-lg border-2 transition-all ${avail.available 
                                                                ? 'bg-green-50 border-green-200 hover:border-green-300' 
                                                                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                                            }`}
                                                        >
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div className="flex items-center space-x-2">
                                                                    <IconCalendar size={16} className={avail.available ? 'text-green-600' : 'text-gray-400'} />
                                                                    <span className={`text-xs font-semibold ${avail.available ? 'text-green-700' : 'text-gray-600'}`}>
                                                                        Créneau {index + 1}
                                                                    </span>
                                                                </div>
                                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${avail.available 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-gray-200 text-gray-700'
                                                                }`}>
                                                                    {avail.available ? '✓ Disponible' : '✗ Indisponible'}
                                                                </span>
                                                            </div>
                                                            
                                                            <div className="space-y-1.5 text-sm">
                                                                <div className="flex items-start space-x-2">
                                                                    <IconClock size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                                                    <div className="flex-1">
                                                                        <div className="text-gray-600">
                                                                            <span className="font-medium text-gray-700">Début:</span> {formatDateTime(avail.startTime)}
                                                                        </div>
                                                                        <div className="text-gray-600 mt-1">
                                                                            <span className="font-medium text-gray-700">Fin:</span> {formatDateTime(avail.endTime)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="px-6 pb-6">
                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="text-xs text-gray-600">
                                                        <span className="font-semibold text-gray-700">
                                                            {clinicData.availabilities.filter(a => a.available).length}
                                                        </span> disponible(s)
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        <span className="font-semibold text-gray-700">
                                                            {clinicData.availabilities.filter(a => !a.available).length}
                                                        </span> indisponible(s)
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Pagination pour les disponibilités */}
                            {totalAvailPages > 1 && (
                                <Pagination
                                    currentPage={currentAvailPage}
                                    totalPages={totalAvailPages}
                                    onPageChange={goToAvailPage}
                                    onPrev={prevAvailPage}
                                    onNext={nextAvailPage}
                                    itemsCount={currentAvailabilities.length}
                                    totalItems={filteredGroupedAvailabilities.length}
                                    itemsPerPage={availPerPage}
                                    indexOfFirstItem={indexOfFirstAvail}
                                />
                            )}
                        </>
                    )
                ) : (
                    loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                <AnimatePresence>
                                    {currentClinics.map((clinic, index) => (
                                        <motion.div
                                            key={clinic.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
                                        >
                                            <div className="p-6 border-b border-gray-100">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-bold text-lg text-gray-800 flex-1">{clinic.name}</h3>
                                                    <div className="flex items-center space-x-1">
                                                        {getStatusIcon(clinic.status)}
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(clinic.status)}`}>
                                                            {clinic.status === 'approved' ? 'Approuvée' : 'En Attente'}
                                                        </span>
                                                    </div>
                                                </div>
                                                {clinic.matricule && (
                                                    <div className="text-xs text-gray-500">
                                                        Matricule: {clinic.matricule}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-6">
                                                <div className="space-y-3 text-sm text-gray-600">
                                                    <div className="flex items-start space-x-2">
                                                        <IconMapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                                        <span className="flex-1">{clinic.address}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <IconPhone size={16} className="text-gray-400 flex-shrink-0" />
                                                        <span>{clinic.phone}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <IconMail size={16} className="text-gray-400 flex-shrink-0" />
                                                        <span className="truncate">{clinic.email}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                                    <div className="text-xs">
                                                        <span className="text-gray-500">Pack: </span>
                                                        <span className="font-medium text-gray-700">{clinic.pack}</span>
                                                    </div>
                                                    <div className="text-xs">
                                                        <span className="text-gray-500">Déployée: </span>
                                                        <span className={`font-medium ${clinic.deployed ? 'text-green-600' : 'text-gray-500'}`}>
                                                            {clinic.deployed ? 'Oui' : 'Non'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="px-6 pb-6">
                                                {clinic.status === 'pending' ? (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleApprove(clinic.id)}
                                                            className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white py-2.5 rounded-xl hover:bg-green-600 transition-colors font-medium shadow-sm hover:shadow-md"
                                                        >
                                                            <IconCheck size={18} />
                                                            <span>Approuver</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(clinic.id)}
                                                            className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white py-2.5 rounded-xl hover:bg-red-600 transition-colors font-medium shadow-sm hover:shadow-md"
                                                        >
                                                            <IconX size={18} />
                                                            <span>Rejeter</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleReject(clinic.id)}
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

                            {/* Pagination pour les cliniques */}
                            {totalClinicPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalClinicPages}
                                    onPageChange={goToClinicPage}
                                    onPrev={prevClinicPage}
                                    onNext={nextClinicPage}
                                    itemsCount={currentClinics.length}
                                    totalItems={filteredClinics.length}
                                    itemsPerPage={clinicsPerPage}
                                    indexOfFirstItem={indexOfFirstClinic}
                                />
                            )}
                        </>
                    )
                )}

                {/* Empty State for Clinics */}
                {!loading && activeView !== 'clinics-availability' && filteredClinics.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100"
                    >
                        <IconBuildingHospital size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucune clinique trouvée</h3>
                        <p className="text-gray-500">
                            {searchTerm ? 'Essayez d\'ajuster vos termes de recherche' : 'Aucune clinique disponible pour cette vue'}
                        </p>
                    </motion.div>
                )}

                {/* Empty State for Availabilities */}
                {!availLoading && activeView === 'clinics-availability' && filteredGroupedAvailabilities.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100"
                    >
                        <IconClock size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucune disponibilité trouvée</h3>
                        <p className="text-gray-500">
                            {searchTerm ? 'Essayez d\'ajuster vos termes de recherche' : 'Aucune disponibilité disponible'}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ClinicsManagement;