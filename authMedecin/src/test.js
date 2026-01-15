import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    User,
    LogOut,
    Edit,
    Save,
    X,
    Plus,
    Phone,
    Mail,
    Loader,
} from 'lucide-react';

const LOCATIONS = [
    'paris',
    'sousse',
    'tunis',
    'tripoli',
];

const DoctorDashboard = () => {
    const [doctor, setDoctor] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
    });

    const [showDropdown, setShowDropdown] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);

    const [updateData, setUpdateData] = useState({ name: '', email: '', Phone: '', location: '' });
    const [availabilityData, setAvailabilityData] = useState({ startTime: '', endTime: '', location: LOCATIONS[0] });
    const [availabilities, setAvailabilities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingAvailabilities, setLoadingAvailabilities] = useState(true);

    const navigate = useNavigate();

    // Charger les données utilisateur au montage
    useEffect(() => {
        const loadUserData = () => {
            const name = localStorage.getItem('userName') || '';
            const email = localStorage.getItem('userEmail') || '';
            const phone = localStorage.getItem('userPhone') || '';
            const location = localStorage.getItem('userLocation') || LOCATIONS[0];
            const userData = { name, email, phone, location };
            setDoctor(userData);
            setUpdateData({ name, email, Phone: phone, location });
        };

        loadUserData();
        loadMyAvailabilities();
    }, []);

    // Charger les disponibilités du docteur depuis l'API
    const loadMyAvailabilities = async () => {
        try {
            setLoadingAvailabilities(true);
            const response = await fetch('http://localhost:3001/appointment/doctor/myavailabilities', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                // Assurez-vous que data est un tableau
                setAvailabilities(Array.isArray(data) ? data : data.availabilities || []);
            } else {
                console.error('Erreur lors du chargement des disponibilités');
                // En cas d'erreur, initialiser avec un tableau vide
                setAvailabilities([]);
            }
        } catch (error) {
            console.error('Erreur:', error);
            setAvailabilities([]);
        } finally {
            setLoadingAvailabilities(false);
        }
    };

    // Obtenir les initiales du nom
    const getInitials = (name) => {
        if (!name) return 'DR';
        return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Mettre à jour le localStorage
    const updateLocalStorage = (newData) => {
        localStorage.setItem('userName', newData.name);
        localStorage.setItem('userEmail', newData.email);
        localStorage.setItem('userPhone', newData.Phone);
        localStorage.setItem('userLocation', newData.location);
    };

    // Ouvrir le formulaire de mise à jour
    const openUpdateForm = () => {
        setUpdateData({ name: doctor.name, email: doctor.email, Phone: doctor.phone });
        setShowUpdateForm(true);
        setShowDropdown(false);
    };

    // Gérer la mise à jour du profil
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const phoneNumber = updateData.Phone.replace(/\D/g, '');
            if (!phoneNumber || phoneNumber.length < 8) {
                alert('Veuillez entrer un numéro de téléphone valide');
                setLoading(false);
                return;
            }

            const dataToSend = {
                name: updateData.name.trim(),
                email: updateData.email.trim(),
                Phone: parseInt(phoneNumber),
            };

            const response = await fetch('http://localhost:3001/users/pdoctor/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                const newDoctorData = {
                    name: updateData.name,
                    email: updateData.email,
                    phone: updateData.Phone,
                };
                setDoctor(newDoctorData);
                updateLocalStorage(updateData);
                setShowUpdateForm(false);
                alert('Profil mis à jour avec succès !');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Erreur lors de la mise à jour du profil');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    // Ajouter une disponibilité
    const handleAddAvailability = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/appointment/manage/doctor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify(availabilityData),
            });

            if (response.ok) {
                // Recharger les disponibilités après ajout
                await loadMyAvailabilities();
                setAvailabilityData({ startTime: '', endTime: '', location: LOCATIONS[0] });
                setShowAvailabilityForm(false);
                alert('Disponibilité ajoutée avec succès !');
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Erreur lors de l'ajout de la disponibilité");
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    // Déconnexion
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userPhone');
        navigate('/login');
    }; // Rediriger vers la page de connexion};

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 font-sans">
            {/* Header */}
            <header className="bg-white shadow-lg border-b border-indigo-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-extrabold text-indigo-900">Tableau de bord</h1>
                        </div>

                        {/* Avatar & Dropdown */}
                        <div className="relative" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center space-x-3 focus:outline-none"
                            >
                                <span className="hidden md:inline text-sm font-medium text-gray-700">{doctor.name || 'Docteur'}</span>
                                <motion.div
                                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:shadow-md transition-shadow"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {getInitials(doctor.name)}
                                </motion.div>
                            </button>

                            {/* Dropdown menu */}
                            <AnimatePresence>
                                {showDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 z-50 border border-indigo-100 overflow-hidden backdrop-blur-sm"
                                    >
                                        <motion.button
                                            onClick={openUpdateForm}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                            whileHover={{ paddingLeft: '1.25rem', backgroundColor: '#f3f4f6' }}
                                        >
                                            <Edit className="w-4 h-4 mr-2 text-indigo-600" />
                                            Mettre à jour
                                        </motion.button>
                                        <motion.button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            whileHover={{ paddingLeft: '1.25rem', backgroundColor: '#fef2f2' }}
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Se déconnecter
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Informations du Profil */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white overflow-hidden shadow-xl rounded-2xl mb-8 backdrop-blur-sm bg-opacity-90"
                    >
                        <div className="px-6 py-6 sm:p-8">
                            <h3 className="text-lg leading-6 font-bold text-gray-900 mb-6">Informations du Profil</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex items-center p-4 bg-indigo-50 rounded-xl">
                                    <User className="w-5 h-5 text-indigo-600 mr-3" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Nom</p>
                                        <p className="text-sm text-gray-900 font-semibold">{doctor.name || 'Non renseigné'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-4 bg-indigo-50 rounded-xl">
                                    <Mail className="w-5 h-5 text-indigo-600 mr-3" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
                                        <p className="text-sm text-gray-900 font-semibold">{doctor.email || 'Non renseigné'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-4 bg-indigo-50 rounded-xl">
                                    <Phone className="w-5 h-5 text-indigo-600 mr-3" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Téléphone</p>
                                        <p className="text-sm text-gray-900 font-semibold">{doctor.phone || 'Non renseigné'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Section Disponibilités */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white overflow-hidden shadow-xl rounded-2xl backdrop-blur-sm bg-opacity-90"
                    >
                        <div className="px-6 py-6 sm:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Mes Disponibilités</h3>
                                <motion.button
                                    onClick={() => setShowAvailabilityForm(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Ajouter une disponibilité
                                </motion.button>
                            </div>

                            {/* Affichage du loader pendant le chargement */}
                            {loadingAvailabilities ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12"
                                >
                                    <Loader className="w-8 h-8 text-indigo-500 mx-auto mb-4 animate-spin" />
                                    <p className="text-gray-500 text-lg">Chargement des disponibilités...</p>
                                </motion.div>
                            ) : availabilities.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12 border-2 border-dashed border-indigo-200 rounded-xl"
                                >
                                    <Calendar className="w-16 h-16 text-indigo-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">Aucune disponibilité ajoutée</p>
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {availabilities.map((availability, index) => (
                                        <motion.div
                                            key={availability.id || index}
                                            className="border border-indigo-100 rounded-xl p-4 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        >
                                            <div className="flex items-center mb-3">
                                                <Clock className="w-4 h-4 text-indigo-600 mr-2" />
                                                <span className="text-sm font-medium">Créneau</span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                De :{' '}
                                                {new Date(availability.startTime).toLocaleString('fr-FR', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                À :{' '}
                                                {new Date(availability.endTime).toLocaleString('fr-FR', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Localisation : <span className="font-semibold">{availability.location}</span>
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.section>
                </div>
            </main>

            {/* Modal pour mettre à jour le profil */}
            <AnimatePresence>
                {showUpdateForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-gray-900">Mettre à jour le profil</h3>
                                    <motion.button
                                        onClick={() => setShowUpdateForm(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                        whileHover={{ rotate: 90 }}
                                    >
                                        <X className="w-6 h-6" />
                                    </motion.button>
                                </div>
                                <form onSubmit={handleUpdateProfile}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                                            <input
                                                type="text"
                                                value={updateData.name}
                                                onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                                                className="mt-1 block w-full px-4 py-2 border border-indigo-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                value={updateData.email}
                                                onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                                                className="mt-1 block w-full px-4 py-2 border border-indigo-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                                            <input
                                                type="tel"
                                                value={updateData.Phone}
                                                onChange={(e) => setUpdateData({ ...updateData, Phone: e.target.value })}
                                                placeholder="Ex: 0612345678"
                                                className="mt-1 block w-full px-4 py-2 border border-indigo-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                                required
                                            />
                                        </div>

                                    </div>
                                    <div className="mt-6 flex justify-end space-x-3">
                                        <motion.button
                                            type="button"
                                            onClick={() => setShowUpdateForm(false)}
                                            disabled={loading}
                                            className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors"
                                            whileHover={{ backgroundColor: '#bfdbfe' }}
                                        >
                                            Annuler
                                        </motion.button>
                                        <motion.button
                                            type="submit"
                                            disabled={loading}
                                            className={`px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                                }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {loading ? (
                                                <span className="flex items-center">
                                                    <Save className="w-4 h-4 mr-2 animate-spin" /> Enregistrement...
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <Save className="w-4 h-4 mr-2" /> Mettre à jour
                                                </span>
                                            )}
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal pour ajouter une disponibilité */}
            <AnimatePresence>
                {showAvailabilityForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-gray-900">Ajouter une disponibilité</h3>
                                    <motion.button
                                        onClick={() => setShowAvailabilityForm(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                        whileHover={{ rotate: 90 }}
                                    >
                                        <X className="w-6 h-6" />
                                    </motion.button>
                                </div>
                                <form onSubmit={handleAddAvailability}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Heure de début</label>
                                            <input
                                                type="datetime-local"
                                                value={availabilityData.startTime}
                                                onChange={(e) =>
                                                    setAvailabilityData({ ...availabilityData, startTime: e.target.value })
                                                }
                                                className="mt-1 block w-full px-4 py-2 border border-indigo-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Heure de fin</label>
                                            <input
                                                type="datetime-local"
                                                value={availabilityData.endTime}
                                                onChange={(e) =>
                                                    setAvailabilityData({ ...availabilityData, endTime: e.target.value })
                                                }
                                                className="mt-1 block w-full px-4 py-2 border border-indigo-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Localisation</label>
                                            <select
                                                value={availabilityData.location}
                                                onChange={(e) =>
                                                    setAvailabilityData({ ...availabilityData, location: e.target.value })
                                                }
                                                className="mt-1 block w-full px-4 py-2 border border-indigo-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                                required
                                            >
                                                {LOCATIONS.map((loc) => (
                                                    <option key={loc} value={loc}>{loc}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end space-x-3">
                                        <motion.button
                                            type="button"
                                            onClick={() => setShowAvailabilityForm(false)}
                                            disabled={loading}
                                            className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors"
                                            whileHover={{ backgroundColor: '#bfdbfe' }}
                                        >
                                            Annuler
                                        </motion.button>
                                        <motion.button
                                            type="submit"
                                            disabled={loading}
                                            className={`px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                                }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {loading ? (
                                                <span className="flex items-center">
                                                    <Plus className="w-4 h-4 mr-2 animate-spin" /> En cours...
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <Plus className="w-4 h-4 mr-2" /> Ajouter
                                                </span>
                                            )}
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DoctorDashboard;