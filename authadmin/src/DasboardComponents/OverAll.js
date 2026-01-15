import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  IconUsers,
  IconStethoscope,
  IconHeart,
  IconBuildingHospital,
  IconCalendar,
  IconRefresh,
  IconAlertCircle,
  IconChevronDown
} from '@tabler/icons-react';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const OverallProgressDashboard = () => {
  const [data, setData] = useState({
    clinics: [],
    patients: [],
    pdoctors: [],
    refdoctors: [],
    appointments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('THIS WEEK');

  const COLORS = {
    clinics: '#3B82F6',      // Bleu
    patients: '#10B981',     // Vert
    pdoctors: '#F59E0B',     // Orange
    refdoctors: '#EC4899',   // Rose
    appointments: '#06B6D4'  // Cyan
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
        setError('Authentication required');
        generateDemoData();
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
        }).then(async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
      );

      const responses = await Promise.allSettled(requests);
      const successfulData = responses.map((result) => 
        result.status === 'fulfilled' ? result.value : null
      );

      setData({
        clinics: objectToArray(successfulData[0]),
        patients: objectToArray(successfulData[1]),
        pdoctors: objectToArray(successfulData[2]),
        refdoctors: objectToArray(successfulData[3]),
        appointments: objectToArray(successfulData[4])
      });

    } catch (error) {
      setError('Failed to fetch data');
      generateDemoData();
    } finally {
      setLoading(false);
    }
  };

  const generateDemoData = () => {
    const demoData = {
      clinics: Array.from({ length: 25 }, (_, i) => ({
        id: `clinic_${i}`,
        name: `Clinic ${i + 1}`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      })),
      patients: Array.from({ length: 150 }, (_, i) => ({
        id: `patient_${i}`,
        name: `Patient ${i + 1}`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      })),
      pdoctors: Array.from({ length: 45 }, (_, i) => ({
        id: `pdoctor_${i}`,
        name: `Doctor ${i + 1}`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      })),
      refdoctors: Array.from({ length: 30 }, (_, i) => ({
        id: `refdoctor_${i}`,
        name: `Ref Doctor ${i + 1}`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      })),
      appointments: Array.from({ length: 200 }, (_, i) => ({
        id: `appointment_${i}`,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }))
    };
    setData(demoData);
  };

  const getChartData = () => {
    // Determine the number of days before and after today
    let daysBefore = 15, daysAfter = 15;
    if (timeRange === 'THIS WEEK') {
      daysBefore = 3; daysAfter = 3;
    } else if (timeRange === 'THIS MONTH') {
      daysBefore = 15; daysAfter = 15;
    } else if (timeRange === 'THIS YEAR') {
      daysBefore = 180; daysAfter = 185;
    }
    const totalDays = daysBefore + daysAfter + 1;
    const chartData = [];

    for (let i = -daysBefore; i <= daysAfter; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      // Format date for display (MM-DD-YYYY)
      const dateStr = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

      // Count records up to and including this date (cumulative)
      const clinicsCount = data.clinics.filter(item =>
        new Date(item.createdAt) <= date
      ).length;

      const patientsCount = data.patients.filter(item =>
        new Date(item.createdAt) <= date
      ).length;

      const pdoctorsCount = data.pdoctors.filter(item =>
        new Date(item.createdAt) <= date
      ).length;

      const refdoctorsCount = data.refdoctors.filter(item =>
        new Date(item.createdAt) <= date
      ).length;

      const appointmentsCount = data.appointments.filter(item =>
        new Date(item.date || item.createdAt) <= date
      ).length;

      chartData.push({
        date: dateStr,
        clinics: clinicsCount,
        patients: patientsCount,
        pdoctors: pdoctorsCount,
        refdoctors: refdoctorsCount,
        appointments: appointmentsCount
      });
    }

    return chartData;
  };

  const getTotalCount = () => {
    const totals = {
      clinics: data.clinics.length,
      patients: data.patients.length,
      pdoctors: data.pdoctors.length,
      refdoctors: data.refdoctors.length,
      appointments: data.appointments.length
    };
    return Object.values(totals).reduce((sum, val) => sum + val, 0);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">{payload[0].payload.date}</p>
          {payload.reverse().map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-600 capitalize">{entry.name}:</span>
              </div>
              <span className="font-semibold text-gray-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
        />
      </div>
    );
  }

  const chartData = getChartData();
  const totalCount = getTotalCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Real-time medical system monitoring</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchAllData}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm border border-gray-200 flex items-center gap-2"
          >
            <IconRefresh size={18} />
            Refresh
          </motion.button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <IconAlertCircle className="text-amber-600" size={20} />
              <div>
                <p className="text-sm font-medium text-amber-800">Demo Mode</p>
                <p className="text-xs text-amber-600">Showing sample data. Connect to APIs for live data.</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Chart Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          {/* Chart Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Overall Progress</h2>
              <p className="text-sm text-gray-500">Status measuring</p>
            </div>
            
            <div className="relative">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option>THIS WEEK</option>
                <option>THIS MONTH</option>
                <option>THIS YEAR</option>
              </select>
              <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Total Count Display */}
          <div className="mb-6">
            <div className="text-5xl font-bold text-gray-800">{totalCount}</div>
            <p className="text-sm text-gray-500 mt-1">Total Records</p>
          </div>

          {/* Stacked Area Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.appointments} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS.appointments} stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.patients} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS.patients} stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorPdoctors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.pdoctors} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS.pdoctors} stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorRefdoctors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.refdoctors} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS.refdoctors} stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorClinics" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.clinics} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS.clinics} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Stacked Areas - Order matters for visual stacking */}
                <Area 
                  type="monotone" 
                  dataKey="clinics" 
                  stackId="1"
                  stroke={COLORS.clinics} 
                  fill="url(#colorClinics)"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="refdoctors" 
                  stackId="1"
                  stroke={COLORS.refdoctors} 
                  fill="url(#colorRefdoctors)"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="pdoctors" 
                  stackId="1"
                  stroke={COLORS.pdoctors} 
                  fill="url(#colorPdoctors)"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="patients" 
                  stackId="1"
                  stroke={COLORS.patients} 
                  fill="url(#colorPatients)"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="appointments" 
                  stackId="1"
                  stroke={COLORS.appointments} 
                  fill="url(#colorAppointments)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.clinics }} />
              <div>
                <p className="text-xs text-gray-500">Clinics</p>
                <p className="text-lg font-bold text-gray-800">{data.clinics.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.patients }} />
              <div>
                <p className="text-xs text-gray-500">Patients</p>
                <p className="text-lg font-bold text-gray-800">{data.patients.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.pdoctors }} />
              <div>
                <p className="text-xs text-gray-500">Doctors</p>
                <p className="text-lg font-bold text-gray-800">{data.pdoctors.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.refdoctors }} />
              <div>
                <p className="text-xs text-gray-500">Ref Doctors</p>
                <p className="text-lg font-bold text-gray-800">{data.refdoctors.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.appointments }} />
              <div>
                <p className="text-xs text-gray-500">Appointments</p>
                <p className="text-lg font-bold text-gray-800">{data.appointments.length}</p>
              </div>
            </div>
          </div>
        </motion.div>


      </div>
    </div>
  );
};

export default OverallProgressDashboard;