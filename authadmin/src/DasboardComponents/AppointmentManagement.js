import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    IconSearch,
    IconFilter,
    IconCheck,
    IconX,
    IconEye,
    IconCalendar,
    IconClock,
    IconMapPin,
    IconUser,
    IconStethoscope,
    IconBuildingHospital,
    IconChevronDown,
    IconUserCheck,
    IconUserX,
    IconAlertCircle,
    IconRefresh,
    IconChevronLeft,
    IconChevronRight
} from '@tabler/icons-react';

const AppointmentManagement = () => {
    const [appointments, setAppointments] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeView, setActiveView] = useState('appointments-all');
    const [error, setError] = useState(null);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const filterRef = useRef(null);
    
    // États pour la pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedClinic, setSelectedClinic] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [filteredClinics, setFilteredClinics] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);

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

    // Fonction pour récupérer tous les rendez-vous
    const fetchAppointments = async (type) => {
        setLoading(true);
        setError(null);
        try {
            const endpoints = {
                'appointments-all': 'http://localhost:3001/appointment/all',
                'appointments-approved': 'http://localhost:3001/appointment/approved',
                'appointments-unapproved': 'http://localhost:3001/appointment/unapproved'
            };

            const endpoint = endpoints[type];
            console.log('Fetching appointments from:', endpoint);

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Raw API appointments response:', data);

            let appointmentsArray = [];
            if (Array.isArray(data)) {
                appointmentsArray = data;
            } else if (data && data.data && Array.isArray(data.data)) {
                appointmentsArray = data.data;
            } else if (data && data.appointments && Array.isArray(data.appointments)) {
                appointmentsArray = data.appointments;
            }

            // Récupérer les informations supplémentaires pour chaque rendez-vous
            const enrichedAppointments = await Promise.all(
                appointmentsArray.map(async (appointment) => {
                    let patientName = 'Patient inconnu';
                    let clinicName = 'Clinique non assignée';
                    let doctorName = 'Docteur non assigné';

                    // Récupérer le nom du patient
                    if (appointment.patientId) {
                        try {
                            const patientResponse = await fetch(`http://localhost:3001/users/patient/${appointment.patientId}`, {
                                method: 'GET',
                                headers: getAuthHeaders()
                            });
                            if (patientResponse.ok) {
                                const patientData = await patientResponse.json();
                                patientName = patientData.name || 'Patient inconnu';
                            }
                        } catch (error) {
                            console.error('Error fetching patient:', error);
                        }
                    }

                    // Récupérer le nom de la clinique
                    if (appointment.clinicId) {
                        const clinic = clinics.find(c => c.id === appointment.clinicId);
                        clinicName = clinic ? clinic.name : 'Clinique non assignée';
                    }

                    // Récupérer le nom du docteur
                    if (appointment.pdoctorId) {
                        const doctor = doctors.find(d => d.id === appointment.pdoctorId);
                        doctorName = doctor ? doctor.name : 'Docteur non assigné';
                    }

                    return {
                        id: appointment._id || appointment.id,
                        patientId: appointment.patientId,
                        patientName,
                        date: appointment.date,
                        operation: appointment.operation,
                        code: appointment.code,
                        approved: appointment.approved,
                        pdoctorId: appointment.pdoctorId,
                        clinicId: appointment.clinicId,
                        clinicName,
                        doctorName,
                        dossierId: appointment.dossierId,
                        status: appointment.Appointmentstatus || 'waiting',
                        location: appointment.location,
                        estimation: appointment.estimation,
                        reclamations: appointment.reclamations || []
                    };
                })
            );

            setAppointments(enrichedAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setError(`Erreur lors du chargement des rendez-vous: ${error.message}`);
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    // Récupérer les cliniques et docteurs disponibles
    const fetchClinicsAndDoctors = async () => {
        try {
            // Récupérer les cliniques approuvées
            const clinicsResponse = await fetch('http://localhost:3001/users/clinic/getApproved', {
                method: 'GET',
                headers: getAuthHeaders()
            });
            if (clinicsResponse.ok) {
                const clinicsData = await clinicsResponse.json();
                const clinicsArray = Array.isArray(clinicsData) ? clinicsData : 
                                   clinicsData.data || clinicsData.clinics || [];
                setClinics(clinicsArray.map(clinic => ({
                    id: clinic._id || clinic.id,
                    name: clinic.name,
                    availability: clinic.availability
                })));
            }

            // Récupérer les docteurs approuvés
            const doctorsResponse = await fetch('http://localhost:3001/users/pdoctor/getApproved', {
                method: 'GET',
                headers: getAuthHeaders()
            });
            if (doctorsResponse.ok) {
                const doctorsData = await doctorsResponse.json();
                const doctorsArray = Array.isArray(doctorsData) ? doctorsData : 
                                   doctorsData.data || doctorsData.doctors || [];
                setDoctors(doctorsArray.map(doctor => ({
                    id: doctor._id || doctor.id,
                    name: doctor.name,
                    speciality: doctor.Speciality || doctor.speciality,
                    availability: doctor.availability
                })));
            }
        } catch (error) {
            console.error('Error fetching clinics and doctors:', error);
        }
    };

    useEffect(() => {
        fetchClinicsAndDoctors();
        fetchAppointments(activeView);
    }, [activeView]);

    // Fonction pour approuver un rendez-vous
    const handleApprove = async (appointmentId, clinicId, doctorId) => {
        try {
            const response = await fetch(`http://localhost:3001/appointment/approve/${appointmentId}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    clinicId: clinicId,
                    pdoctorId: doctorId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to approve appointment');
            }

            const result = await response.json();
            console.log('Approve appointment response:', result);

            // Mettre à jour l'état local
            setAppointments(prev => prev.map(appointment =>
                appointment.id === appointmentId ? { ...appointment, approved: true, status: 'approved' } : appointment
            ));

            setShowAssignModal(false);
            setSelectedAppointment(null);
            setSelectedClinic('');
            setSelectedDoctor('');

            alert('Rendez-vous approuvé avec succès!');

        } catch (error) {
            console.error('Error approving appointment:', error);
            alert('Erreur lors de l\'approbation du rendez-vous');
        }
    };

    // Fonction pour annuler un rendez-vous
    const handleCancel = async (appointmentId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/appointment/cancelAppointment/${appointmentId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to cancel appointment');
            }

            const result = await response.json();
            console.log('Cancel appointment response:', result);

            // Mettre à jour l'état local
            setAppointments(prev => prev.filter(appointment => appointment.id !== appointmentId));

            alert('Rendez-vous annulé avec succès!');

        } catch (error) {
            console.error('Error canceling appointment:', error);
            alert('Erreur lors de l\'annulation du rendez-vous');
        }
    };

    // Ouvrir la modal d'assignation
    const openAssignModal = (appointment) => {
        setSelectedAppointment(appointment);
        setSelectedClinic('');
        setSelectedDoctor('');
        // Filtrer les cliniques et docteurs par disponibilité
        const avail = appointment.estimation || appointment.availability;
        setFilteredClinics(
            clinics.filter(clinic =>
                Array.isArray(clinic.availability)
                    ? clinic.availability.includes(avail)
                    : clinic.availability === avail
            )
        );
        setFilteredDoctors(
            doctors.filter(doctor =>
                Array.isArray(doctor.availability)
                    ? doctor.availability.includes(avail)
                    : doctor.availability === avail
            )
        );
        setShowAssignModal(true);
    };

    const filteredAppointments = appointments.filter(appointment =>
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (appointment.doctorName && appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (appointment.clinicName && appointment.clinicName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Logique de pagination
    const totalItems = filteredAppointments.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Calculer les éléments à afficher pour la page courante
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAppointments = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);

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

    const getStatusColor = (status, approved) => {
        if (approved) return 'bg-green-100 text-green-800';
        
        switch (status) {
            case 'waiting': return 'bg-orange-100 text-orange-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status, approved) => {
        if (approved) return <IconUserCheck size={16} className="text-green-600" />;
        
        switch (status) {
            case 'waiting': return <IconClock size={16} className="text-orange-600" />;
            case 'approved': return <IconUserCheck size={16} className="text-green-600" />;
            case 'cancelled': return <IconUserX size={16} className="text-red-600" />;
            case 'completed': return <IconCheck size={16} className="text-blue-600" />;
            default: return <IconAlertCircle size={16} className="text-gray-600" />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Date non définie';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getViewTitle = () => {
        switch (activeView) {
            case 'appointments-all': return 'Tous les Rendez-vous';
            case 'appointments-approved': return 'Rendez-vous Approuvés';
            case 'appointments-unapproved': return 'Rendez-vous en Attente';
            default: return 'Rendez-vous';
        }
    };

    const getViewDescription = () => {
        switch (activeView) {
            case 'appointments-all': return 'Gérez et surveillez tous les rendez-vous du système';
            case 'appointments-approved': return 'Liste des rendez-vous approuvés et confirmés';
            case 'appointments-unapproved': return 'Rendez-vous en attente d\'approbation';
            default: return 'Gérez les rendez-vous médicaux';
        }
    };

    const filterOptions = [
        {
            id: 'appointments-all',
            label: 'Tous les Rendez-vous',
            icon: <IconCalendar size={18} />,
            description: 'Voir tous les rendez-vous'
        },
        {
            id: 'appointments-approved',
            label: 'Rendez-vous Approuvés',
            icon: <IconUserCheck size={18} />,
            description: 'Rendez-vous confirmés et approuvés'
        },
        {
            id: 'appointments-unapproved',
            label: 'Rendez-vous en Attente',
            icon: <IconClock size={18} />,
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
                                Gestion des Rendez-vous
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
                                    placeholder="Rechercher un rendez-vous..."
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
                                onClick={() => fetchAppointments(activeView)}
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
                                <p className="text-sm font-medium text-gray-600">Total Rendez-vous</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{appointments.length}</p>
                            </div>
                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                                <IconCalendar className="text-blue-500" size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Approuvés</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">
                                    {appointments.filter(a => a.approved).length}
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
                                <p className="text-sm font-medium text-gray-600">En Attente</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">
                                    {appointments.filter(a => !a.approved).length}
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center">
                                <IconClock className="text-orange-500" size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Résultats Filtrés</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">
                                    {filteredAppointments.length}
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
                        <p className="font-semibold">Erreur de chargement des rendez-vous</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                )}

                {/* Appointments Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {currentAppointments.map((appointment, index) => (
                                    <motion.div
                                        key={appointment.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
                                    >
                                        {/* Appointment Header */}
                                        <div className="p-6 border-b border-gray-100">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-bold text-lg text-gray-800 flex-1">{appointment.operation}</h3>
                                                <div className="flex items-center space-x-1">
                                                    {getStatusIcon(appointment.status, appointment.approved)}
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status, appointment.approved)}`}>
                                                        {appointment.approved ? 'Approuvé' : 'En Attente'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                <div className="flex items-center space-x-1">
                                                    <IconUser size={14} />
                                                    <span>{appointment.patientName}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Appointment Info */}
                                        <div className="p-6">
                                            <div className="space-y-3 text-sm text-gray-600">
                                                <div className="flex items-center space-x-2">
                                                    <IconCalendar size={16} className="text-gray-400 flex-shrink-0" />
                                                    <span>{formatDate(appointment.date)}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <IconMapPin size={16} className="text-gray-400 flex-shrink-0" />
                                                    <span>{appointment.location}</span>
                                                </div>
                                                {appointment.clinicName && (
                                                    <div className="flex items-center space-x-2">
                                                        <IconBuildingHospital size={16} className="text-gray-400 flex-shrink-0" />
                                                        <span>{appointment.clinicName}</span>
                                                    </div>
                                                )}
                                                {appointment.doctorName && (
                                                    <div className="flex items-center space-x-2">
                                                        <IconStethoscope size={16} className="text-gray-400 flex-shrink-0" />
                                                        <span>{appointment.doctorName}</span>
                                                    </div>
                                                )}
                                                {appointment.code && (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">Code: {appointment.code}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">
                                                Statut: {appointment.status}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="px-6 pb-6">
                                            {!appointment.approved ? (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => openAssignModal(appointment)}
                                                        className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white py-2.5 rounded-xl hover:bg-green-600 transition-colors font-medium shadow-sm hover:shadow-md"
                                                    >
                                                        <IconCheck size={18} />
                                                        <span>Approuver</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancel(appointment.id)}
                                                        className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white py-2.5 rounded-xl hover:bg-red-600 transition-colors font-medium shadow-sm hover:shadow-md"
                                                    >
                                                        <IconX size={18} />
                                                        <span>Annuler</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleCancel(appointment.id)}
                                                        className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white py-2.5 rounded-xl hover:bg-red-600 transition-colors font-medium shadow-sm hover:shadow-md"
                                                    >
                                                        <IconX size={18} />
                                                        <span>Annuler</span>
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
                                    sur <span className="font-semibold">{totalItems}</span> rendez-vous
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
                {!loading && filteredAppointments.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100"
                    >
                        <IconCalendar size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun rendez-vous trouvé</h3>
                        <p className="text-gray-500">
                            {searchTerm ? 'Essayez d\'ajuster vos termes de recherche' : 'Aucun rendez-vous disponible pour cette vue'}
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Modal d'assignation */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-6 w-full max-w-md"
                    >
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            Assigner le rendez-vous
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sélectionner une clinique
                                </label>
                                <select
                                    value={selectedClinic}
                                    onChange={(e) => setSelectedClinic(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={filteredClinics.length === 0}
                                >
                                    <option value="">Choisir une clinique</option>
                                    {filteredClinics.map(clinic => (
                                        <option key={clinic.id} value={clinic.id}>
                                            {clinic.name}
                                        </option>
                                    ))}
                                </select>
                                {filteredClinics.length === 0 && (
                                    <div className="text-xs text-red-500 mt-1">
                                        Aucune clinique disponible pour cette disponibilité.
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sélectionner un docteur
                                </label>
                                <select
                                    value={selectedDoctor}
                                    onChange={(e) => setSelectedDoctor(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={filteredDoctors.length === 0}
                                >
                                    <option value="">Choisir un docteur</option>
                                    {filteredDoctors.map(doctor => (
                                        <option key={doctor.id} value={doctor.id}>
                                            {doctor.name} - {doctor.speciality}
                                        </option>
                                    ))}
                                </select>
                                {filteredDoctors.length === 0 && (
                                    <div className="text-xs text-red-500 mt-1">
                                        Aucun docteur disponible pour cette disponibilité.
                                    </div>
                                )}
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => {
                                        setShowAssignModal(false);
                                        setSelectedAppointment(null);
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => handleApprove(selectedAppointment.id, selectedClinic, selectedDoctor)}
                                    disabled={
                                        !selectedClinic ||
                                        !selectedDoctor ||
                                        filteredClinics.length === 0 ||
                                        filteredDoctors.length === 0
                                    }
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AppointmentManagement;