"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaUserMd, FaPlus, FaTrash, FaSignOutAlt, FaSpinner, FaCalendarAlt, FaUserEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch } from "react-redux";
import { logout } from "../redux/authslice";
import 'react-toastify/dist/ReactToastify.css';

const localizer = momentLocalizer(moment);

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        onClick={onClose}
                    >
                        Annuler
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={onConfirm}
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
}

function DoctorDashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // États initiaux
    const [availability, setAvailability] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newSlot, setNewSlot] = useState({ startTime: '', endTime: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [formValid, setFormValid] = useState(false);
    const [activeTab, setActiveTab] = useState('availability');
    const [profile, setProfile] = useState({
        name: localStorage.getItem('userName') || '',
        email: localStorage.getItem('userEmail') || '',
        Hospital: localStorage.getItem('userHospital') || ''
    });
    const [formData, setFormData] = useState({ ...profile });
    const [profileFormValid, setProfileFormValid] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const doctorId = localStorage.getItem('userId');
    const [modal, setModal] = useState({ isOpen: false, type: '', data: null });

    const handleLogout = useCallback(() => {
        localStorage.clear();
        dispatch(logout());
        window.location.href = "http://localhost:3020/";
    }, [dispatch]);

    const getAuthHeaders = useCallback(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            handleLogout();
            throw new Error('No authentication token found');
        }
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }, [handleLogout]);

    const handleApiError = useCallback((error, message) => {
        console.error(message, error);
        if (error.message.includes('401')) {
            handleLogout();
            return;
        }
        toast.error(message, {
            role: 'alert',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: 'colored'
        });
    }, [handleLogout]);

    // Validation du formulaire de profil
    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        setProfileFormValid(
            formData.name.trim() !== '' &&
            emailRegex.test(formData.email) &&
            formData.Hospital.trim() !== '' &&
            !isLoading
        );
    }, [formData, isLoading]);

    // Validation du formulaire de disponibilité
    useEffect(() => {
        setFormValid(
            newSlot.startTime !== '' &&
            newSlot.endTime !== '' &&
            new Date(newSlot.startTime) < new Date(newSlot.endTime) &&
            !isLoading
        );
    }, [newSlot, isLoading]);

    // Mise à jour du profil
    const updateProfile = useCallback(async () => {
        if (!profileFormValid) {
            console.log('Profile form is invalid:', formData);
            toast.error('Veuillez remplir tous les champs correctement', {
                role: 'alert',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: 'colored'
            });
            return;
        }

        // Vérifier si le profil a changé
        if (
            formData.name === profile.name &&
            formData.email === profile.email &&
            formData.Hospital === profile.Hospital
        ) {
            toast.info('Aucun changement détecté', {
                role: 'alert',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: 'colored'
            });
            return;
        }

        try {
            setIsLoading(true);
            const body = {
                name: formData.name,
                email: formData.email,
                Hospital: formData.Hospital
            };

            const response = await fetch('http://localhost:3001/users/refdoctor/update', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erreur lors de la mise à jour (Status: ${response.status})`);
            }

            const updatedProfile = await response.json();
            const newProfile = {
                name: updatedProfile.name || formData.name,
                email: updatedProfile.email || formData.email,
                Hospital: updatedProfile.Hospital || formData.Hospital
            };

            setProfile(newProfile);
            localStorage.setItem('userName', newProfile.name);
            localStorage.setItem('userEmail', newProfile.email);
            localStorage.setItem('userHospital', newProfile.Hospital);

            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 3000);

            toast.success('Profil mis à jour avec succès', {
                role: 'alert',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                theme: 'colored'
            });

        } catch (error) {
            handleApiError(error, error.message || 'Échec de la mise à jour du profil');
        } finally {
            setIsLoading(false);
        }
    }, [formData, profileFormValid, profile, getAuthHeaders, handleApiError]);

    // ... (le reste de votre code reste inchangé)

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
            
            {/* ... (le reste de votre JSX reste inchangé jusqu'au formulaire de profil) */}

            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h2 className="text-lg font-bold mb-4">Mon Profil</h2>
                {isLoading && !profile.name ? (
                    <div className="text-center py-8">
                        <FaSpinner className="animate-spin text-blue-500 text-4xl mx-auto mb-4" />
                        <p className="text-gray-600">Chargement du profil...</p>
                    </div>
                ) : (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-1 font-medium text-gray-700">Nom</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={isLoading}
                                    placeholder="Entrez votre nom"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={isLoading}
                                    placeholder="Entrez votre email"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block mb-1 font-medium text-gray-700">Hôpital</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    value={formData.Hospital}
                                    onChange={(e) => setFormData({ ...formData, Hospital: e.target.value })}
                                    disabled={isLoading}
                                    placeholder="Entrez votre hôpital"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={updateProfile}
                                className={`px-4 py-2 rounded flex items-center ${
                                    profileFormValid ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                } transition-colors`}
                                disabled={!profileFormValid || isLoading}
                            >
                                {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaUserEdit className="mr-2" />}
                                Mettre à jour
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ... (le reste de votre JSX) */}
        </div>
    );
}

export default DoctorDashboard;