import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconUsers,
  IconStethoscope,
  IconHeart,
  IconBuildingHospital,
  IconCalendar,
  IconTrendingUp,
  IconChartBar,
  IconChartPie,
  IconAlertCircle,
  IconRefresh,
  IconActivity,
  IconClock
} from '@tabler/icons-react';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

const DashboardAnalytics = () => {
  const [data, setData] = useState({
    clinics: [],
    patients: [],
    pdoctors: [],
    refdoctors: [],
    appointments: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [activeChart, setActiveChart] = useState('all');
  const [error, setError] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);

  const COLORS = {
    primary: '#0EA5E9',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    purple: '#8B5CF6',
    blue: '#3B82F6',
    teal: '#14B8A6',
    indigo: '#6366F1'
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem('accessToken') || 
           localStorage.getItem('token') || 
           localStorage.getItem('authToken') || 
           localStorage.getItem('userToken');
  };

  const getAuthHeaders = () => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  };

  const objectToArray = (obj) => {
    if (!obj) return [];
    if (Array.isArray(obj)) return obj;
    
    if (typeof obj === 'object') {
      return Object.entries(obj).map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          return { ...value, id: key };
        }
        return { 
          id: key, 
          name: value,
          createdAt: new Date().toISOString()
        };
      });
    }
    
    return [];
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();

      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      const endpoints = [
        'http://localhost:3001/users/clinic/getAll',
        'http://localhost:3001/users/patient/getAll',
        'http://localhost:3001/users/pdoctor/getAll',
        'http://localhost:3001/users/refdoctor/getAll',
        'http://localhost:3001/appointment/all'
      ];

      const requests = endpoints.map(url => 
        fetch(url, {
          method: 'GET',
          headers: getAuthHeaders()
        })
        .then(async (response) => {
          if (!response.ok) {
            const errorText = await response.text();
            if (response.status === 401) {
              throw new Error('Authentication failed - Invalid token');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
      );

      const responses = await Promise.allSettled(requests);

      const successfulData = responses.map((result) => {
        if (result.status === 'fulfilled') {
          return result.value;
        }
        return null;
      });

      setData({
        clinics: objectToArray(successfulData[0]),
        patients: objectToArray(successfulData[1]),
        pdoctors: objectToArray(successfulData[2]),
        refdoctors: objectToArray(successfulData[3]),
        appointments: objectToArray(successfulData[4])
      });

      const authErrors = responses.filter((result) => 
        result.status === 'rejected' && 
        result.reason.message.includes('Authentication')
      );
      
      if (authErrors.length > 0) {
        setError('Authentication failed. Please check your login credentials.');
      }

    } catch (error) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Génère une plage de dates (passé + futur) selon le timeRange
  const getDateRange = () => {
    let before = 15, after = 15;
    if (timeRange === 'day') { before = 3; after = 3; }
    else if (timeRange === 'week') { before = 14; after = 14; }
    else if (timeRange === 'month') { before = 90; after = 90; }
    else if (timeRange === 'year') { before = 180; after = 185; }
    const dates = [];
    for (let i = -before; i <= after; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d.toLocaleDateString());
    }
    return dates;
  };

  // Regroupe les données par date sur la plage fournie
  const groupByDateRange = (data, dateField = 'createdAt', dateRange = []) => {
    if (!Array.isArray(data)) return [];
    const grouped = {};
    data.forEach(item => {
      if (!item) return;
      let date;
      if (item[dateField]) {
        try {
          date = new Date(item[dateField]).toLocaleDateString();
        } catch (error) {
          date = new Date().toLocaleDateString();
        }
      } else {
        date = new Date().toLocaleDateString();
      }
      if (!grouped[date]) grouped[date] = 0;
      grouped[date]++;
    });
    return dateRange.map(date => ({
      date,
      count: grouped[date] || 0
    }));
  };

  // Modifie getCombinedChartData pour utiliser la nouvelle plage de dates
  const getCombinedChartData = () => {
    const dateRange = getDateRange();
    const clinicsByDate = groupByDateRange(data.clinics, 'createdAt', dateRange);
    const patientsByDate = groupByDateRange(data.patients, 'createdAt', dateRange);
    const pdoctorsByDate = groupByDateRange(data.pdoctors, 'createdAt', dateRange);
    const refdoctorsByDate = groupByDateRange(data.refdoctors, 'createdAt', dateRange);
    const appointmentsByDate = groupByDateRange(data.appointments, 'date', dateRange);

    return dateRange.map(date => ({
      date,
      clinics: clinicsByDate.find(d => d.date === date)?.count || 0,
      patients: patientsByDate.find(d => d.date === date)?.count || 0,
      pdoctors: pdoctorsByDate.find(d => d.date === date)?.count || 0,
      refdoctors: refdoctorsByDate.find(d => d.date === date)?.count || 0,
      appointments: appointmentsByDate.find(d => d.date === date)?.count || 0
    }));
  };

  const getPieChartData = () => [
    { name: 'Clinics', value: data.clinics.length, color: COLORS.blue },
    { name: 'Patients', value: data.patients.length, color: COLORS.success },
    { name: 'Practical Doctors', value: data.pdoctors.length, color: COLORS.warning },
    { name: 'Referent Doctors', value: data.refdoctors.length, color: COLORS.danger },
    { name: 'Appointments', value: data.appointments.length, color: COLORS.purple }
  ];

  const getStats = () => [
    {
      label: 'Total Clinics',
      value: data.clinics.length,
      icon: IconBuildingHospital,
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      change: '+12%',
      items: data.clinics
    },
    {
      label: 'Total Patients',
      value: data.patients.length,
      icon: IconUsers,
      gradient: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      change: '+8%',
      items: data.patients
    },
    {
      label: 'Practical Doctors',
      value: data.pdoctors.length,
      icon: IconStethoscope,
      gradient: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      change: '+5%',
      items: data.pdoctors
    },
    {
      label: 'Referent Doctors',
      value: data.refdoctors.length,
      icon: IconHeart,
      gradient: 'from-rose-500 to-rose-600',
      bg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      change: '+3%',
      items: data.refdoctors
    },
    {
      label: 'Appointments',
      value: data.appointments.length,
      icon: IconCalendar,
      gradient: 'from-violet-500 to-violet-600',
      bg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      change: '+15%',
      items: data.appointments
    }
  ];

  const chartConfigs = {
    all: {
      title: 'Overall Growth Trends',
      icon: IconTrendingUp,
      data: getCombinedChartData(),
      chartType: 'area'
    },
    patients: {
      title: 'Patient Registrations',
      icon: IconUsers,
      data: groupByDateRange(data.patients, 'createdAt', getDateRange()),
      chartType: 'bar'
    },
    pdoctors: {
      title: 'Practical Doctors',
      icon: IconStethoscope,
      data: groupByDateRange(data.pdoctors, 'createdAt', getDateRange()),
      chartType: 'bar'
    },
    refdoctors: {
      title: 'Referent Doctors',
      icon: IconHeart,
      data: groupByDateRange(data.refdoctors, 'createdAt', getDateRange()),
      chartType: 'bar'
    },
    clinics: {
      title: 'Clinic Registrations',
      icon: IconBuildingHospital,
      data: groupByDateRange(data.clinics, 'createdAt', getDateRange()),
      chartType: 'bar'
    },
    appointments: {
      title: 'Appointment Schedule',
      icon: IconCalendar,
      data: groupByDateRange(data.appointments, 'date', getDateRange()),
      chartType: 'area'
    }
  };

  const handleReauthenticate = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const getDemoData = () => {
    const dates = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString());
    }

    return dates.map(date => ({
      date,
      clinics: Math.floor(Math.random() * 10),
      patients: Math.floor(Math.random() * 50),
      pdoctors: Math.floor(Math.random() * 15),
      refdoctors: Math.floor(Math.random() * 8),
      appointments: Math.floor(Math.random() * 30)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
        />
      </div>
    );
  }

  const hasData = data.clinics.length > 0 || data.patients.length > 0 || 
                  data.pdoctors.length > 0 || data.refdoctors.length > 0 || 
                  data.appointments.length > 0;

  const displayData = hasData ? chartConfigs[activeChart].data : getDemoData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <IconActivity className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  Medical Analytics
                </h1>
                
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-5 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all"
              >
                <option value="day">Last 7 Days</option>
                <option value="week">Last 4 Weeks</option>
                <option value="month">Last 6 Months</option>
                <option value="year">Last Year</option>
              </select>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={fetchAllData}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <IconRefresh size={18} />
                Refresh
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 border-l-4 border-red-500 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <IconAlertCircle className="text-red-600" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-1">Authentication Error</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <button
                  onClick={handleReauthenticate}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Re-login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Demo Mode Alert */}
        {!hasData && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-amber-50 border-l-4 border-amber-500 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <IconAlertCircle className="text-amber-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">Demo Mode Active</h3>
                <p className="text-amber-700 text-sm">
                  Displaying sample data. Connect to localhost:3001 for live data.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {getStats().map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              onHoverStart={() => setHoveredStat(index)}
              onHoverEnd={() => setHoveredStat(null)}
              className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <stat.icon className={stat.iconColor} size={24} />
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    stat.change.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                
                <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.label}</h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">vs. last period</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
        >
          {/* Chart Type Selector */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <IconChartBar className="text-blue-600" size={24} />
              Data Visualization
            </h2>
            
            <div className="flex flex-wrap gap-3">
              {Object.keys(chartConfigs).map((chartKey) => {
                const config = chartConfigs[chartKey];
                const Icon = config.icon;
                return (
                  <motion.button
                    key={chartKey}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveChart(chartKey)}
                    className={`px-5 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                      activeChart === chartKey
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Icon size={18} />
                    {config.title}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Chart Display */}
          <div className="h-96 bg-gray-50 rounded-2xl p-6">
            <ResponsiveContainer width="100%" height="100%">
              {chartConfigs[activeChart].chartType === 'area' ? (
                <AreaChart data={displayData}>
                  <defs>
                    <linearGradient id="colorClinics" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={COLORS.success} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPdoctors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.warning} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={COLORS.warning} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRefdoctors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.danger} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={COLORS.danger} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      padding: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  {activeChart === 'all' ? (
                    <>
                      <Area 
                        type="monotone" 
                        dataKey="clinics" 
                        name="Clinics"
                        stroke={COLORS.blue} 
                        fillOpacity={1} 
                        fill="url(#colorClinics)" 
                        strokeWidth={2.5} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="patients" 
                        name="Patients"
                        stroke={COLORS.success} 
                        fillOpacity={1} 
                        fill="url(#colorPatients)" 
                        strokeWidth={2.5} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="pdoctors" 
                        name="Practical Doctors"
                        stroke={COLORS.warning} 
                        fillOpacity={1} 
                        fill="url(#colorPdoctors)" 
                        strokeWidth={2.5} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="refdoctors" 
                        name="Referent Doctors"
                        stroke={COLORS.danger} 
                        fillOpacity={1} 
                        fill="url(#colorRefdoctors)" 
                        strokeWidth={2.5} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="appointments" 
                        name="Appointments"
                        stroke={COLORS.purple} 
                        fillOpacity={1} 
                        fill="url(#colorAppointments)" 
                        strokeWidth={2.5} 
                      />
                    </>
                  ) : (
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke={activeChart === 'patients' ? COLORS.success : 
                             activeChart === 'pdoctors' ? COLORS.warning :
                             activeChart === 'refdoctors' ? COLORS.danger :
                             activeChart === 'clinics' ? COLORS.blue : COLORS.purple} 
                      fillOpacity={1}
                      fill={`url(#color${activeChart === 'patients' ? 'Patients' : 
                            activeChart === 'pdoctors' ? 'Pdoctors' :
                            activeChart === 'refdoctors' ? 'Refdoctors' :
                            activeChart === 'clinics' ? 'Clinics' : 'Appointments'})`}
                      strokeWidth={2.5}
                    />
                  )}
                </AreaChart>
              ) : (
                <BarChart data={displayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      padding: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar 
                    dataKey="count" 
                    fill={activeChart === 'patients' ? COLORS.success : 
                         activeChart === 'pdoctors' ? COLORS.warning :
                         activeChart === 'refdoctors' ? COLORS.danger : COLORS.blue} 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Data Lists and Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Clinics List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <IconBuildingHospital className="text-blue-600" size={20} />
                Clinics
              </h3>
              <span className="text-2xl font-bold text-blue-600">{data.clinics.length}</span>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {data.clinics.length > 0 ? (
                data.clinics.slice(0, 10).map((clinic, index) => (
                  <motion.div
                    key={clinic.id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconBuildingHospital className="text-blue-600" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{clinic.name || 'Unnamed Clinic'}</p>
                      <p className="text-xs text-gray-500">
                        {clinic.createdAt ? new Date(clinic.createdAt).toLocaleDateString() : 'No date'}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <IconBuildingHospital className="mx-auto text-gray-300 mb-2" size={40} />
                  <p className="text-gray-500 text-sm">No clinics found</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Patients List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <IconUsers className="text-emerald-600" size={20} />
                Patients
              </h3>
              <span className="text-2xl font-bold text-emerald-600">{data.patients.length}</span>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {data.patients.length > 0 ? (
                data.patients.slice(0, 10).map((patient, index) => (
                  <motion.div
                    key={patient.id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconUsers className="text-emerald-600" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{patient.name || patient.email || 'Unnamed Patient'}</p>
                      <p className="text-xs text-gray-500">
                        {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'No date'}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <IconUsers className="mx-auto text-gray-300 mb-2" size={40} />
                  <p className="text-gray-500 text-sm">No patients found</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <IconChartPie className="text-violet-600" size={20} />
                Distribution
              </h3>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getPieChartData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {getPieChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      padding: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-4">
              {getPieChartData().map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Doctors Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Practical Doctors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <IconStethoscope className="text-amber-600" size={20} />
                Practical Doctors
              </h3>
              <span className="text-2xl font-bold text-amber-600">{data.pdoctors.length}</span>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {data.pdoctors.length > 0 ? (
                data.pdoctors.slice(0, 8).map((doctor, index) => (
                  <motion.div
                    key={doctor.id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconStethoscope className="text-amber-600" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{doctor.name || doctor.email || 'Unnamed Doctor'}</p>
                      <p className="text-xs text-gray-500">
                        {doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString() : 'No date'}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <IconStethoscope className="mx-auto text-gray-300 mb-2" size={40} />
                  <p className="text-gray-500 text-sm">No practical doctors found</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Referent Doctors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <IconHeart className="text-rose-600" size={20} />
                Referent Doctors
              </h3>
              <span className="text-2xl font-bold text-rose-600">{data.refdoctors.length}</span>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {data.refdoctors.length > 0 ? (
                data.refdoctors.slice(0, 8).map((doctor, index) => (
                  <motion.div
                    key={doctor.id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconHeart className="text-rose-600" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{doctor.name || doctor.email || 'Unnamed Doctor'}</p>
                      <p className="text-xs text-gray-500">
                        {doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString() : 'No date'}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <IconHeart className="mx-auto text-gray-300 mb-2" size={40} />
                  <p className="text-gray-500 text-sm">No referent doctors found</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Appointments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <IconCalendar className="text-violet-600" size={20} />
              Recent Appointments
            </h3>
            <span className="text-2xl font-bold text-violet-600">{data.appointments.length}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto custom-scrollbar">
            {data.appointments.length > 0 ? (
              data.appointments.slice(0, 12).map((appointment, index) => (
                <motion.div
                  key={appointment.id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="p-4 bg-violet-50 rounded-xl hover:bg-violet-100 transition-colors border border-violet-100"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconCalendar className="text-violet-600" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {appointment.patientName || 'Patient'}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'No date'}
                      </p>
                     
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <IconCalendar className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">No appointments scheduled</p>
              </div>
            )}
          </div>
        </motion.div>

      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F3F4F6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }
      `}</style>
    </div>
  );
};

export default DashboardAnalytics;