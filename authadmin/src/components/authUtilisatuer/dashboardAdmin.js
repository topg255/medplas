import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import OverallProgressDashboard from '../../DasboardComponents/OverAll'
import {
  IconBuildingHospital,
  IconStethoscope,
  IconUser,
  IconCalendar,
  IconMenu2,
  IconChevronDown,
  IconLogout,
  IconDashboard,
  IconHeart, 
  IconMail,
  IconChartBar,
  IconUsers,
  IconClipboardList
} from '@tabler/icons-react';
import ClinicsManagement from '../../DasboardComponents/ClinicsManagement';
import DoctorManagement from '../../DasboardComponents/DoctorManagement';
import ReferentDoctorManagement from '../../DasboardComponents/ReferentDoctorManagement';
import PatientManagement from '../../DasboardComponents/PatientManagement';
import AppointmentManagement from '../../DasboardComponents/AppointmentManagement';
import DashboardAnalytics from '../../DasboardComponents/AnalyticsDashboard';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [stats, setStats] = useState({
    clinics: 0,
    doctors: 0,
    referentDoctors: 0,
    patients: 0,
    appointments: 0,
    pendingApprovals: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const userDropdownRef = useRef(null);

  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    role: '',
    initials: ''
  });

  // Récupérer les informations utilisateur depuis localStorage
  useEffect(() => {
    const userName = localStorage.getItem('userName') || 'Admin User';
    const userEmail = localStorage.getItem('userEmail') || 'admin@example.com';
    const userRole = localStorage.getItem('userRole') || 'Administrator';

    // Générer les initiales à partir du nom
    const getInitials = (name) => {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    setUserInfo({
      name: userName,
      email: userEmail,
      role: userRole,
      initials: getInitials(userName)
    });
  }, []);

  // Fonction pour obtenir les headers d'authentification
  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fonction pour récupérer les statistiques
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const endpoints = [
        { key: 'clinics', url: 'http://localhost:3001/users/clinic/getAll' },
        { key: 'doctors', url: 'http://localhost:3001/users/pdoctor/getAll' },
        { key: 'referentDoctors', url: 'http://localhost:3001/users/refdoctor/getAll' },
        { key: 'patients', url: 'http://localhost:3001/users/patient/getAll' },
        { key: 'appointments', url: 'http://localhost:3001/appointment/all' },
        { key: 'unapprovedClinics', url: 'http://localhost:3001/users/clinic/getNonApproved' },
        { key: 'unapprovedDoctors', url: 'http://localhost:3001/users/pdoctor/getNonApproved' }
      ];

      const results = {};

      // Exécuter toutes les requêtes en parallèle
      const promises = endpoints.map(async (endpoint) => {
        try {
          const response = await fetch(endpoint.url, {
            method: 'GET',
            headers: getAuthHeaders()
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          // Extraire le tableau de données selon la structure de réponse
          let dataArray = [];
          if (Array.isArray(data)) {
            dataArray = data;
          } else if (data && Array.isArray(data.data)) {
            dataArray = data.data;
          } else if (data && Array.isArray(data.users)) {
            dataArray = data.users;
          } else if (data && Array.isArray(data.appointments)) {
            dataArray = data.appointments;
          } else if (data && Array.isArray(data.doctors)) {
            dataArray = data.doctors;
          } else if (data && Array.isArray(data.clinics)) {
            dataArray = data.clinics;
          } else if (data && typeof data === 'object') {
            dataArray = [data];
          }

          results[endpoint.key] = dataArray.length;
        } catch (error) {
          console.error(`Error fetching ${endpoint.key}:`, error);
          results[endpoint.key] = 0;
        }
      });

      await Promise.all(promises);

      // Calculer les approbations en attente
      const pendingApprovals = (results.unapprovedClinics || 0) + (results.unapprovedDoctors || 0);

      setStats({
        clinics: results.clinics || 0,
        doctors: results.doctors || 0,
        referentDoctors: results.referentDoctors || 0,
        patients: results.patients || 0,
        appointments: results.appointments || 0,
        pendingApprovals: pendingApprovals
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Charger les statistiques au montage du composant
  useEffect(() => {
    fetchStats();
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: IconDashboard },
    { id: 'clinics', label: 'Clinics', icon: IconBuildingHospital },
    { id: 'doctors', label: 'Practical Doctors', icon: IconStethoscope },
    { id: 'referents', label: 'Referent Doctors', icon: IconHeart },
    { id: 'patients', label: 'Patients', icon: IconUser },
    { id: 'appointments', label: 'Appointments', icon: IconCalendar },
    { id: 'analytics', label: 'Analytics', icon: IconChartBar }
  ];

  const statsCards = [
    { 
      label: 'Total Clinics', 
      value: stats.clinics, 
      color: 'blue',
      icon: IconBuildingHospital,
      description: 'Medical facilities'
    },
    { 
      label: 'Practical Doctors', 
      value: stats.doctors, 
      color: 'green',
      icon: IconStethoscope,
      description: 'Active practitioners'
    },
    { 
      label: 'Referent Doctors', 
      value: stats.referentDoctors, 
      color: 'pink',
      icon: IconHeart,
      description: 'Specialists'
    },
    { 
      label: 'Patients', 
      value: stats.patients, 
      color: 'purple',
      icon: IconUsers,
      description: 'Registered patients'
    },
    { 
      label: 'Appointments', 
      value: stats.appointments, 
      color: 'indigo',
      icon: IconCalendar,
      description: 'Total bookings'
    }
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // Obtenir une couleur de fond basée sur le rôle
  const getRoleColor = (role) => {
    const roleColors = {
      'admin': 'from-blue-500 to-blue-600',
      'administrator': 'from-blue-500 to-blue-600',
      'doctor': 'from-green-500 to-green-600',
      'clinic': 'from-purple-500 to-purple-600',
      'default': 'from-gray-500 to-gray-600'
    };
    return roleColors[role?.toLowerCase()] || roleColors['default'];
  };

  const baseTab = activeTab.split('-')[0];

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  // Exemple de recherche globale (filtrage sur stats et menuItems)
  const handleGlobalSearch = (value) => {
    const query = value.trim().toLowerCase();
    if (!query) {
      setSearchResults([]);
      return;
    }
    // Recherche dans stats et menuItems
    const statResults = statsCards.filter(stat =>
      stat.label.toLowerCase().includes(query) ||
      stat.description.toLowerCase().includes(query) ||
      stat.value.toString().includes(query)
    );
    const menuResults = menuItems.filter(item =>
      item.label.toLowerCase().includes(query)
    );
    setSearchResults([
      ...statResults.map(stat => ({ type: 'stat', ...stat })),
      ...menuResults.map(item => ({ type: 'menu', ...item }))
    ]);
  };

  // Fonction pour gérer le clic sur les items de menu
  const handleMenuClick = (item) => {
    // Pour tous les items - définir directement l'onglet actif
    if (item.id === 'clinics') {
      setActiveTab('clinics-all-clinics');
    } else if (item.id === 'doctors') {
      setActiveTab('doctors-all-doctors');
    } else if (item.id === 'referents') {
      setActiveTab('referents-all-referent-doctors');
    } else if (item.id === 'appointments') {
      setActiveTab('appointments-all-appointments');
    } else {
      setActiveTab(item.id);
    }
  };

  // Fonction pour formater les grands nombres
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div
        className={`bg-white shadow-xl ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`}
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 80 }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <IconBuildingHospital className="text-white" size={24} />
            </div>
            {sidebarOpen && (
              <motion.h1
                className="text-xl font-bold text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                MedAdmin
              </motion.h1>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => handleMenuClick(item)}
                className={`
                  group w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200
                  ${activeTab.startsWith(item.id) ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 font-semibold shadow border-l-4 border-blue-500' : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700'}
                  focus:outline-none focus:ring-2 focus:ring-blue-200
                  hover:shadow-md
                  active:scale-[0.98]
                `}
                style={{ minHeight: 48 }}
              >
                <div className="flex items-center space-x-3">
                  <item.icon 
                    size={22} 
                    className={
                      activeTab.startsWith(item.id) ? 'text-blue-600' : 
                      'text-gray-400 group-hover:text-blue-600'
                    } 
                  />
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`font-medium truncate transition-colors duration-200 ${
                        activeTab.startsWith(item.id) ? 'text-blue-700' : 'group-hover:text-blue-700'
                      }`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </div>
              </button>
            </div>
          ))}
        </nav>

        {/* User Section - Sidebar */}
        <div className="p-4 border-t border-gray-100">
          <a
            className="w-full flex items-center justify-center space-x-2 p-3 text-gray-600"
          >
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-sm"
              >
                © 2025 Plasfora. All rights reserved.
              </motion.span>
            )}
          </a>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <IconMenu2 size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 capitalize">
                  {activeTab.replace(/-/g, ' ')}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Welcome back, {userInfo.name}
                </p>
              </div>
            </div>
            {/* Search Bar */}
            <div className="flex-1 flex justify-center px-6">
              <form
                className="w-full max-w-md"
                onSubmit={e => {
                  e.preventDefault();
                  handleGlobalSearch(searchValue);
                }}
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search in dashboard..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-gray-700"
                    value={searchValue}
                    onChange={e => {
                      setSearchValue(e.target.value);
                      handleGlobalSearch(e.target.value);
                    }}
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                  {/* Résultats de recherche */}
                  {searchValue && searchResults.length > 0 && (
                    <div className="absolute left-0 right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-auto">
                      {searchResults.map((result, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors flex items-center gap-2"
                          onClick={() => {
                            if (result.type === 'menu') {
                              if (result.id === 'clinics') {
                                setActiveTab('clinics-all-clinics');
                              } else if (result.id === 'doctors') {
                                setActiveTab('doctors-all-doctors');
                              } else if (result.id === 'referents') {
                                setActiveTab('referents-all-referent-doctors');
                              } else if (result.id === 'appointments') {
                                setActiveTab('appointments-all-appointments');
                              } else {
                                setActiveTab(result.id);
                              }
                            }
                            setSearchValue('');
                            setSearchResults([]);
                          }}
                        >
                          {result.type === 'menu' && (
                            <>
                              <result.icon size={18} className="text-blue-500" />
                              <span className="font-medium">{result.label}</span>
                              <span className="ml-auto text-xs text-gray-400">Section</span>
                            </>
                          )}
                          {result.type === 'stat' && (
                            <>
                              <result.icon size={18} className="text-gray-400" />
                              <span className="font-medium">{result.label}</span>
                              <span className="ml-auto text-xs text-gray-400">{result.value}</span>
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  {searchValue && searchResults.length === 0 && (
                    <div className="absolute left-0 right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-50 px-4 py-3 text-gray-400 text-sm">
                      No results found.
                    </div>
                  )}
                </div>
              </form>
            </div>
            {/* User Info Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen((v) => !v)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none group"
                aria-haspopup="true"
                aria-expanded={userDropdownOpen}
              >
                <div className={`w-10 h-10 bg-gradient-to-r ${getRoleColor(userInfo.role)} rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white group-hover:scale-105 transition-transform`}>
                  {userInfo.initials}
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-800">{userInfo.name}</span>
                  <span className="text-xs text-gray-400">{userInfo.role}</span>
                </div>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {userDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                  style={{ minWidth: 280 }}
                >
                  {/* Top gradient bar */}
                  <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-400" />
                  <div className="p-6 flex flex-col items-center text-center bg-gradient-to-br from-white via-blue-50 to-purple-50">
                    <div className={`w-20 h-20 bg-gradient-to-r ${getRoleColor(userInfo.role)} rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-3 border-4 border-white`}>
                      {userInfo.initials}
                    </div>
                    <div className="font-bold text-gray-800 text-lg">{userInfo.name}</div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                      <IconMail size={16} /> <span className="truncate">{userInfo.email}</span>
                    </div>
                    <span className="inline-block mt-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">{userInfo.role}</span>
                  </div>
                  <div className="px-6 py-4 bg-white">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                          <IconUser size={20} className="text-blue-400" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-xs text-gray-500">Username</div>
                          <div className="text-sm font-medium text-gray-800">{userInfo.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                          <IconMail size={20} className="text-purple-400" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-xs text-gray-500">Email</div>
                          <div className="text-sm font-medium text-gray-800">{userInfo.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                          <IconDashboard size={20} className="text-green-400" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-xs text-gray-500">Role</div>
                          <div className="text-sm font-medium text-gray-800 capitalize">{userInfo.role}</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-100 to-red-50 text-red-600 rounded-lg font-medium hover:bg-red-500 transition-colors shadow border border-red-100"
                      >
                        <IconLogout size={18} /> Logout
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 text-center py-2 bg-gray-50 border-t border-gray-100">
                    Last login: <span className="font-medium text-gray-600">Today</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              {/* Dashboard Content */}
              {baseTab === 'clinics' && <ClinicsManagement activeView={activeTab} />}
              {baseTab === 'doctors' && <DoctorManagement activeView={activeTab} />}
              {baseTab === 'referents' && <ReferentDoctorManagement activeView={activeTab} />}
              {baseTab === 'patients' && <PatientManagement />}
              {baseTab === 'appointments' && <AppointmentManagement activeView={activeTab} />}
              {baseTab === 'analytics' && <DashboardAnalytics />}

              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {statsCards.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:scale-[1.02]"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              {stat.label}
                            </p>
                            <div className="flex items-baseline space-x-2 mt-1">
                              {statsLoading ? (
                                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                              ) : (
                                <p className="text-2xl font-bold text-gray-800">
                                  {formatNumber(stat.value)}
                                </p>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {stat.description}
                            </p>
                          </div>
                          <div className={`w-12 h-12 bg-${stat.color}-50 rounded-xl flex items-center justify-center`}>
                            <stat.icon className={`text-${stat.color}-500`} size={24} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <OverallProgressDashboard />
                </div>
              )}

              {/* Autres onglets */}
              {baseTab !== 'clinics' && baseTab !== 'doctors' && baseTab !== 'referents' && baseTab !== 'patients' && baseTab !== 'appointments' && activeTab !== 'dashboard' && baseTab !== 'analytics' && (
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                  <IconBuildingHospital size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
                  </h3>
                  <p className="text-gray-600">
                    This section is under development. Content will be available soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;