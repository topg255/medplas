import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  LineElement, 
  CategoryScale, 
  LinearScale, 
  PointElement,
  Filler,
  BarElement
} from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import {
  FaUsers, FaChartLine, FaSyncAlt, FaUserMd, FaShieldAlt, FaProcedures,
  FaHospital, FaPlane, FaChartPie, FaChevronDown, FaSearch, 
  FaSort, FaSortUp, FaSortDown, FaBars, FaChartBar, FaTable, 
  FaSignOutAlt, FaHome, FaCog, FaBell, FaUserCircle, FaBookmark,
  FaTimes, FaChevronRight, FaChevronLeft, FaFilter, FaGlobe
} from 'react-icons/fa';
import { FiAward, FiActivity, FiDatabase, FiPieChart } from 'react-icons/fi';
import { AiOutlineRocket } from 'react-icons/ai';import moment from 'moment';
import logo from '../../assets/logoo.png';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

// Configuration avancée de ChartJS
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  LineElement, 
  CategoryScale, 
  LinearScale, 
  PointElement,
  Filler,
  BarElement
);

// Thème sombre néon futuriste
const neonColors = {
  blue: '#00f2ff',
  purple: '#b400ff',
  green: '#00ff88',
  orange: '#ff8a00',
  pink: '#ff00e4',
  gray: '#a0aec0'
};

// Fonction de gradient améliorée avec effets néon
const createNeonGradient = (ctx, color, direction = 'vertical') => {
  const gradient = direction === 'vertical' 
    ? ctx.createLinearGradient(0, 0, 0, 300)
    : ctx.createLinearGradient(0, 0, 300, 0);
  
  gradient.addColorStop(0, `${color}FF`);
  gradient.addColorStop(0.5, `${color}AA`);
  gradient.addColorStop(1, `${color}33`);
  return gradient;
};

// Tooltip personnalisé avec effet glow
const neonTooltip = {
  backgroundColor: 'rgba(15, 23, 42, 0.95)',
  titleFont: { 
    size: 14, 
    weight: 'bold', 
    family: "'Inter', sans-serif" 
  },
  bodyFont: { 
    size: 12, 
    family: "'Inter', sans-serif",
    weight: '500'
  },
  padding: 12,
  cornerRadius: 8,
  displayColors: false,
  borderColor: 'rgba(255, 255, 255, 0.2)',
  borderWidth: 1,
  boxShadow: '0 0 15px rgba(0, 242, 255, 0.3)',
  callbacks: {
    label: (context) => {
      const label = context.dataset.label || '';
      const value = context.raw;
      return `${label}: ${value}`;
    },
    title: (items) => {
      return items[0].label || '';
    }
  }
};

// Légende avec effet futuriste
const neonLegend = {
  position: 'top',
  labels: {
    boxWidth: 12,
    padding: 20,
    font: { 
      size: 12, 
      family: "'Inter', sans-serif",
      weight: '600'
    },
    color: neonColors.gray,
    usePointStyle: true,
    pointStyle: 'circle',
    generateLabels: (chart) => {
      const data = chart.data;
      return data.labels.map((label, i) => ({
        text: label,
        fillStyle: data.datasets[0].backgroundColor[i],
        strokeStyle: neonColors.blue,
        lineWidth: 1,
        pointStyle: 'rectRot',
        fontColor: '#CBD5E0'
      }));
    }
  }
};

// Échelles avec thème sombre
const neonScales = {
  x: {
    grid: { 
      color: 'rgba(74, 85, 104, 0.5)',
      drawBorder: false,
      lineWidth: 0.5
    },
    ticks: { 
      color: '#A0AEC0',
      font: { size: 11, weight: '500' }
    }
  },
  y: {
    grid: { 
      color: 'rgba(74, 85, 104, 0.5)',
      drawBorder: false,
      lineWidth: 0.5
    },
    ticks: { 
      color: '#A0AEC0',
      font: { size: 11, weight: '500' },
      padding: 10
    },
    beginAtZero: true
  }
};

// Composant de section avec design futuriste
const NeonCategorySection = ({ 
  title, 
  data, 
  icon: Icon, 
  color, 
  donutKey, 
  donutLabel, 
  stats,
  tableColumns,
  isExpanded,
  setIsExpanded,
  sectionId
}) => {
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [activeChart, setActiveChart] = useState('trend');
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef(null);

  // Effet de parallaxe pour la section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Données pour le graphique de tendance avec effet néon
  const getTrendData = () => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: title,
          data: [],
          borderColor: color,
          backgroundColor: 'transparent',
          borderWidth: 3,
          tension: 0.4,
          fill: false
        }]
      };
    }

    const sortedData = [...data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const dateCounts = {};
    
    sortedData.forEach(item => {
      const date = moment(item.createdAt).format('MMM D, YYYY');
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });

    const dates = Object.keys(dateCounts).sort((a, b) => moment(a, 'MMM D, YYYY') - moment(b, 'MMM D, YYYY'));
    const cumulativeCounts = [];
    let cumulative = 0;

    dates.forEach(date => {
      cumulative += dateCounts[date];
      cumulativeCounts.push(cumulative);
    });

    return {
      labels: dates,
      datasets: [{
        label: title,
        data: cumulativeCounts,
        borderColor: color,
        backgroundColor: (ctx) => createNeonGradient(ctx.chart.ctx, color),
        borderWidth: 3,
        pointBackgroundColor: color,
        pointBorderColor: '#0F172A',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true
      }]
    };
  };

  // Données pour le graphique à barres avec effet néon
  const getBarData = () => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: title,
          data: [],
          backgroundColor: 'transparent',
          borderColor: color,
          borderWidth: 1
        }]
      };
    }

    const monthlyData = {};
    data.forEach(item => {
      const month = moment(item.createdAt).format('MMM YYYY');
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    const months = Object.keys(monthlyData).sort((a, b) => moment(a, 'MMM YYYY') - moment(b, 'MMM YYYY'));

    return {
      labels: months,
      datasets: [{
        label: title,
        data: months.map(month => monthlyData[month]),
        backgroundColor: (ctx) => createNeonGradient(ctx.chart.ctx, color, 'horizontal'),
        borderColor: color,
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: `${color}FF`
      }]
    };
  };

  // Données pour le graphique en donut avec palette néon
  const getDonutData = () => {
    if (!data || data.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          data: [1],
          backgroundColor: ['#2D3748'],
          borderWidth: 0
        }]
      };
    }

    const grouped = data.reduce((acc, item) => {
      const key = item[donutKey] || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(grouped);
    const values = Object.values(grouped);
    
    // Palette de couleurs néon dynamique
    const generateNeonPalette = (baseColor, count) => {
      const palette = [];
      const hueStep = 360 / count;
      
      for (let i = 0; i < count; i++) {
        const hue = (parseInt(baseColor.slice(1, 3), 16) + (i * hueStep) % 360);
        const saturation = 100;
        const lightness = 50 + (i % 3) * 10;
        palette.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
      }
      
      return palette.length > 0 ? palette : [baseColor];
    };

    return {
      labels,
      datasets: [{
        data: values,
        backgroundColor: generateNeonPalette(color, labels.length),
        borderWidth: 0,
        hoverOffset: 15,
        hoverBorderColor: '#FFF'
      }]
    };
  };

  // Fonction de tri
  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filtrage et tri des données
  const filteredData = [...data]
    .filter(item => {
      const searchLower = searchQuery.toLowerCase();
      return Object.values(item).some(
        val => val && val.toString().toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === 'boolean') {
        aValue = aValue ? 1 : 0;
        bValue = bValue ? 1 : 0;
      } else if (!isNaN(aValue)) {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else {
        aValue = aValue?.toString().toLowerCase() || '';
        bValue = bValue?.toString().toLowerCase() || '';
      }

      return sortConfig.direction === 'asc' 
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });

  const displayData = showAll ? filteredData : filteredData.slice(0, 10);

  return (
    <motion.div 
      ref={sectionRef}
      className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 mb-12 border border-gray-700/50"
      style={{ y }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      id={sectionId}
    >
      {/* Effet de bordure néon */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          boxShadow: isHovered ? `0 0 25px ${color}80` : 'none',
          transition: 'box-shadow 0.5s ease'
        }}
      />
      
      {/* En-tête de section avec effet de verre */}
      <motion.div
        className="flex items-center justify-between p-6 cursor-pointer bg-gradient-to-r from-gray-800/70 to-gray-900/70 hover:from-gray-700/70 backdrop-blur-xl border-b border-gray-700/50"
        onClick={() => setIsExpanded(!isExpanded)}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ background: `linear-gradient(to right, ${color}20, ${color}10)` }}
      >
        <div className="flex items-center space-x-4">
          <motion.div 
            className={`p-3 rounded-xl bg-${color}/20 text-${color} shadow-lg shadow-${color}/30`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Icon className="text-2xl" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
              {title}
            </h2>
            <p className="text-sm text-gray-400 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              {data.length} {data.length === 1 ? 'entrée' : 'entrées'} • Dernière mise à jour: {moment().format('HH:mm')}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown className="text-gray-400 text-xl hover:text-white transition-colors" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-gray-900/80 backdrop-blur-md">
              {/* Sélecteur de graphique avec effet néon */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex bg-gray-800/70 rounded-xl p-1 shadow-inner shadow-gray-900/50 border border-gray-700/50">
                  {['trend', 'bar', 'donut'].map((type) => (
                    <motion.button
                      key={type}
                      onClick={() => setActiveChart(type)}
                      className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                        activeChart === type 
                          ? `bg-gradient-to-r from-${color}/40 to-${color}/20 text-white shadow-lg shadow-${color}/30`
                          : 'text-gray-400 hover:text-white bg-gray-800/30'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {type === 'trend' && <FaChartLine className="mr-2" />}
                      {type === 'bar' && <FaChartBar className="mr-2" />}
                      {type === 'donut' && <FaChartPie className="mr-2" />}
                      {type === 'trend' ? 'Tendance' : type === 'bar' ? 'Mensuel' : 'Répartition'}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Grille de visualisation */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Graphique principal */}
                <div className={`lg:col-span-2 bg-gray-800/70 rounded-2xl shadow-2xl p-5 border border-gray-700/50 ${
                  activeChart !== 'trend' ? 'hidden' : ''
                }`}>
                  <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <FaChartLine className={`text-${color} mr-2`} />
                    Évolution dans le temps
                  </h3>
                  <div className="h-80 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-800/30 to-transparent rounded-xl pointer-events-none"></div>
                    <Line
                      data={getTrendData()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: neonLegend,
                          tooltip: neonTooltip
                        },
                        scales: neonScales,
                        interaction: {
                          intersect: false,
                          mode: 'index'
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Graphique à barres */}
                <div className={`lg:col-span-2 bg-gray-800/70 rounded-2xl shadow-2xl p-5 border border-gray-700/50 ${
                  activeChart !== 'bar' ? 'hidden' : ''
                }`}>
                  <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <FaChartBar className={`text-${color} mr-2`} />
                    Distribution mensuelle
                  </h3>
                  <div className="h-80 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-800/30 to-transparent rounded-xl pointer-events-none"></div>
                    <Bar
                      data={getBarData()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: neonLegend,
                          tooltip: neonTooltip
                        },
                        scales: neonScales
                      }}
                    />
                  </div>
                </div>

                {/* Graphique en donut */}
                <div className={`bg-gray-800/70 rounded-2xl shadow-2xl p-5 border border-gray-700/50 ${
                  activeChart !== 'donut' ? 'hidden' : ''
                }`}>
                  <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <FaChartPie className={`text-${color} mr-2`} />
                    {donutLabel}
                  </h3>
                  <div className="h-80 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Pie
                        data={getDonutData()}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              ...neonLegend,
                              position: 'right',
                              labels: {
                                ...neonLegend.labels,
                                padding: 15,
                                usePointStyle: true,
                                pointStyle: 'circle'
                              }
                            },
                            tooltip: neonTooltip
                          },
                          cutout: '65%',
                          layout: {
                            padding: 20
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Cartes de statistiques */}
                <div className="bg-gray-800/70 rounded-2xl shadow-2xl p-5 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <FiAward className={`text-${color} mr-2`} />
                    Statistiques clés
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <motion.div 
                        key={index}
                        whileHover={{ 
                          y: -5, 
                          scale: 1.03,
                          boxShadow: `0 10px 25px -5px ${color}40`
                        }}
                        className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-4 rounded-xl border border-gray-700/50 shadow-inner shadow-gray-900/50"
                      >
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-white mt-1">
                          {stat.value}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tableau de données avec effet de verre */}
              <div className="bg-gray-800/70 rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
                <div className="p-4 border-b border-gray-700/50 flex justify-between items-center bg-gradient-to-r from-gray-800/70 to-gray-900/70">
                  <h3 className="text-lg font-semibold text-gray-200 flex items-center">
                    <FaTable className={`text-${color} mr-2`} />
                    Données détaillées
                  </h3>
                  <div className="relative w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-700/50 rounded-lg bg-gray-900/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm text-gray-200 placeholder-gray-500 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-900/50 border-b border-gray-700/50">
                      <tr>
                        {tableColumns.map((column) => (
                          <th 
                            key={column.key}
                            scope="col"
                            className="px-6 py-3 font-medium cursor-pointer hover:bg-gray-700/50 transition-colors"
                            onClick={() => sortData(column.key)}
                          >
                            <div className="flex items-center">
                              {column.label}
                              {sortConfig.key === column.key ? (
                                sortConfig.direction === 'asc' ? (
                                  <FaSortUp className="ml-1" />
                                ) : (
                                  <FaSortDown className="ml-1" />
                                )
                              ) : (
                                <FaSort className="ml-1 opacity-30 hover:opacity-100" />
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {displayData.length > 0 ? (
                        displayData.map((item, index) => (
                          <motion.tr 
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ 
                              opacity: 1,
                              transition: { delay: index * 0.02 }
                            }}
                            className="hover:bg-gray-800/50 transition-colors"
                          >
                            {tableColumns.map((column) => (
                              <td 
                                key={`${index}-${column.key}`} 
                                className="px-6 py-4 whitespace-nowrap text-gray-300"
                              >
                                {column.render ? column.render(item) : item[column.key]}
                              </td>
                            ))}
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td 
                            colSpan={tableColumns.length} 
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            Aucun résultat trouvé
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {filteredData.length > 10 && (
                  <div className="p-4 border-t border-gray-700/50 text-center">
                    <motion.button
                      onClick={() => setShowAll(!showAll)}
                      className="inline-flex items-center px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: `0 0 15px ${color}40`
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {showAll ? 'Afficher moins' : `Afficher plus (${filteredData.length - 10})`}
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Composant pour les tendances combinées
const NeonCombinedTrends = ({ data }) => {
  const categories = [
    { key: 'patients', label: 'Patients', color: neonColors.blue },
    { key: 'refdoctors', label: 'Médecins Référents', color: neonColors.purple },
    { key: 'pdoctors', label: 'Médecins Praticiens', color: neonColors.orange },
    { key: 'clinics', label: 'Cliniques', color: neonColors.green },
    { key: 'travelagencies', label: 'Agences de Voyage', color: neonColors.pink },
  ];

  const getCombinedTrendData = () => {
    const allDates = new Set();
    Object.values(data).forEach(categoryData => {
      categoryData.forEach(item => {
        const date = moment(item.createdAt).format('MMM D, YYYY');
        allDates.add(date);
      });
    });

    const dates = Array.from(allDates).sort((a, b) => moment(a, 'MMM D, YYYY') - moment(b, 'MMM D, YYYY'));

    const datasets = categories.map(category => {
      const dateCounts = {};
      dates.forEach(date => (dateCounts[date] = 0));

      data[category.key].forEach(item => {
        const date = moment(item.createdAt).format('MMM D, YYYY');
        dateCounts[date] = (dateCounts[date] || 0) + 1;
      });

      const cumulativeCounts = [];
      let cumulative = 0;
      dates.forEach(date => {
        cumulative += dateCounts[date] || 0;
        cumulativeCounts.push(cumulative);
      });

      return {
        label: category.label,
        data: cumulativeCounts,
        borderColor: category.color,
        backgroundColor: 'transparent',
        borderWidth: 3,
        pointBackgroundColor: category.color,
        pointBorderColor: '#0F172A',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
        tension: 0.3,
        fill: false
      };
    });

    return {
      labels: dates,
      datasets: datasets.filter(dataset => dataset.data.some(count => count > 0))
    };
  };

  return (
    <motion.div 
      className="bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-12 border border-gray-700/50"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-8 flex items-center">
        <FaChartLine className="text-indigo-400 mr-4" />
        Vue d'ensemble des tendances
      </h2>
      <div className="h-96 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800/30 to-transparent rounded-xl pointer-events-none"></div>
        <Line
          data={getCombinedTrendData()}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                ...neonLegend,
                position: 'top',
                labels: {
                  ...neonLegend.labels,
                  padding: 20,
                  usePointStyle: true,
                  pointStyle: 'circle'
                }
              },
              tooltip: {
                ...neonTooltip,
                mode: 'index',
                intersect: false
              }
            },
            scales: neonScales,
            interaction: {
              mode: 'nearest',
              axis: 'x',
              intersect: false
            }
          }}
        />
      </div>
    </motion.div>
  );
};

// Composant principal du dashboard
const FuturisticAnalyticsDashboard = () => {
  const [data, setData] = useState({
    patients: [],
    refdoctors: [],
    pdoctors: [],
    clinics: [],
    travelagencies: [],
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedCount: 0,
    activeToday: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    'combined-trends': true,
    'patients-section': false,
    'refdoctors-section': false,
    'pdoctors-section': false,
    'clinics-section': false,
    'travelagencies-section': false
  });
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);

  // En-têtes d'authentification
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    return { 
      Authorization: `Bearer ${token}`, 
      'Content-Type': 'application/json' 
    };
  }, []);

  // Récupération des données
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const endpoints = [
        { url: 'http://localhost:3001/users/patient/getAll', key: 'patients' },
        { url: 'http://localhost:3001/users/refdoctor/getAll', key: 'refdoctors' },
        { url: 'http://localhost:3001/users/pdoctor/getAll', key: 'pdoctors' },
        { url: 'http://localhost:3001/users/clinic/getAll', key: 'clinics' },
        { url: 'http://localhost:3001/users/travelagency/getAll', key: 'travelagencies' },
      ];

      const responses = await Promise.all(
        endpoints.map(({ url }) => axios.get(url, { headers: getAuthHeaders() }))
      );

      const newData = {};
      let totalUsers = 0;
      let verifiedCount = 0;
      let activeToday = 0;

      responses.forEach((response, index) => {
        const key = endpoints[index].key;
        const items = response.data || [];
        newData[key] = items.map(item => ({
          id: item._id || 'N/A',
          name: item.name || 'Inconnu',
          email: item.email || 'N/A',
          specialty: item.specialty || item.Speciality || 'N/A',
          address: item.address || item.location || 'N/A',
          phone: item.phone || item.Phone || 'N/A',
          approved: item.approved !== undefined ? item.approved : false,
          insurance: item.insurance || 'N/A',
          age: parseInt(item.age) || 0,
          createdAt: item.createdAt || moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          updatedAt: item.updatedAt || moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
        }));
        
        totalUsers += items.length;
        verifiedCount += items.filter(item => item.approved).length;
        activeToday += items.filter(item => 
          moment(item.updatedAt).isSame(moment(), 'day')).length;
      });

      setData(newData);
      setStats({
        totalUsers,
        verifiedCount,
        activeToday
      });

      toast.success('Données actualisées', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        icon: '🔄'
      });
    } catch (error) {
      toast.error(`Votre session est expiré`, {
        position: 'top-right',
        autoClose: 3000
      });
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchData();
    
    // Actualisation automatique toutes les 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Colonnes communes pour les tableaux
  const commonTableColumns = [
    { 
      key: 'id', 
      label: 'ID', 
      render: (item) => (
        <span className="font-mono text-xs bg-gray-800/50 px-2 py-1 rounded">
          {item.id.substring(0, 8)}...
        </span>
      ) 
    },
    { key: 'name', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { 
      key: 'createdAt', 
      label: 'Date création', 
      render: (item) => (
        <span className="text-gray-400">
          {moment(item.createdAt).format('DD/MM/YY HH:mm')}
        </span>
      ) 
    },
    { 
      key: 'approved', 
      label: 'Statut', 
      render: (item) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.approved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
        }`}>
          {item.approved ? 'Vérifié' : 'En attente'}
        </span>
      )
    }
  ];

  // Éléments de la sidebar
  const sidebarItems = [
    { 
      label: 'Vue d’ensemble', 
      icon: FiActivity, 
      color: neonColors.blue,
      sectionId: 'combined-trends'
    },
    { 
      label: 'Patients', 
      icon: FaProcedures, 
      color: neonColors.blue,
      sectionId: 'patients-section',
      subItems: [
        { label: 'Tous', badge: 0 },
        { label: 'Vérifiés', badge: 0 }
      ]
    },
    { 
      label: 'Médecins Référents', 
      icon: FiAward, 
      color: neonColors.purple,
      sectionId: 'refdoctors-section',
      subItems: [
        { label: 'Tous', badge: 0 },
        { label: 'Vérifiés', badge: 0 }
      ]
    },
    { 
      label: 'Médecins Praticiens', 
      icon: FaUserMd, 
      color: neonColors.orange,
      sectionId: 'pdoctors-section',
      subItems: [
        { label: 'Tous', badge: 0 },
        { label: 'Vérifiés', badge: 0 }
      ]
    },
    { 
      label: 'Cliniques', 
      icon: FaHospital, 
      color: neonColors.green,
      sectionId: 'clinics-section',
      subItems: [
        { label: 'Toutes', badge: 0 },
        { label: 'Vérifiées', badge: 0 }
      ]
    },
    { 
      label: 'Agences de Voyage', 
      icon: FaPlane, 
      color: neonColors.pink,
      sectionId: 'travelagencies-section',
      subItems: [
        { label: 'Toutes', badge: 0 },
        { label: 'Vérifiées', badge: 0 }
      ]
    },
  ];

  // Fonction pour faire défiler jusqu'à une section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsSidebarOpen(false);
      if (sectionId !== 'combined-trends') {
        const newExpandedSections = {};
        Object.keys(expandedSections).forEach(key => {
          newExpandedSections[key] = key === sectionId;
        });
        setExpandedSections(newExpandedSections);
      }
    }
  };

  // Mise à jour des badges dans la sidebar
  useEffect(() => {
    sidebarItems.forEach(item => {
      if (item.sectionId === 'patients-section') {
        item.subItems[0].badge = data.patients.length;
        item.subItems[1].badge = data.patients.filter(p => p.approved).length;
      } else if (item.sectionId === 'refdoctors-section') {
        item.subItems[0].badge = data.refdoctors.length;
        item.subItems[1].badge = data.refdoctors.filter(d => d.approved).length;
      } else if (item.sectionId === 'pdoctors-section') {
        item.subItems[0].badge = data.pdoctors.length;
        item.subItems[1].badge = data.pdoctors.filter(d => d.approved).length;
      } else if (item.sectionId === 'clinics-section') {
        item.subItems[0].badge = data.clinics.length;
        item.subItems[1].badge = data.clinics.filter(c => c.approved).length;
      } else if (item.sectionId === 'travelagencies-section') {
        item.subItems[0].badge = data.travelagencies.length;
        item.subItems[1].badge = data.travelagencies.filter(t => t.approved).length;
      }
    });
  }, [data]);

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 font-sans text-gray-200 overflow-x-hidden"
      ref={containerRef}
    >
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      {/* Effets de fond futuristes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/10"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(60px)'
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
        ))}
      </div>

      {/* Sidebar futuriste */}
      <motion.nav
        className="fixed top-0 left-0 h-full bg-gray-900/95 backdrop-blur-3xl shadow-2xl z-50 border-r border-gray-800/50 overflow-hidden"
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="h-full flex flex-col p-6">
          {/* Logo et bouton de fermeture */}
          <div className="flex items-center justify-between mb-8">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src={logo} 
                alt="Logo" 
                className="h-10 w-auto mr-3 rounded-lg shadow-lg shadow-indigo-500/30" 
              />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                ANALYTICS
              </span>
            </motion.div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Barre de recherche */}
          <motion.div
            className="relative mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </motion.div>

          {/* Menu principal */}
          <div className="flex-1 overflow-y-auto">
            {sidebarItems.map((item, index) => (
              <div key={index} className="mb-2">
                <motion.button
                  onClick={() => {
                    scrollToSection(item.sectionId);
                    setActiveMenu(activeMenu === index ? null : index);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    expandedSections[item.sectionId] 
                      ? `bg-gradient-to-r from-${item.color}/20 to-transparent text-white`
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                  whileHover={{ 
                    backgroundColor: `rgba(${parseInt(item.color.slice(1, 3), 16)}, ${parseInt(item.color.slice(3, 5), 16)}, ${parseInt(item.color.slice(5, 7), 16)}, 0.1)`,
                    scale: 1.02
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon 
                      className={`text-${item.color} text-xl`} 
                      style={{ color: item.color }}
                    />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.subItems && (
                    <motion.div 
                      animate={{ rotate: activeMenu === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaChevronDown className="text-gray-500 text-xs" />
                    </motion.div>
                  )}
                </motion.button>

                {/* Sous-menu */}
                {item.subItems && (
                  <AnimatePresence>
                    {activeMenu === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden pl-12 pt-1"
                      >
                        {item.subItems.map((sub, subIndex) => (
                          <motion.button
                            key={subIndex}
                            onClick={() => scrollToSection(item.sectionId)}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-400 hover:text-white rounded-lg transition-all"
                            whileHover={{ 
                              x: 5,
                              backgroundColor: `rgba(${parseInt(item.color.slice(1, 3), 16)}, ${parseInt(item.color.slice(3, 5), 16)}, ${parseInt(item.color.slice(5, 7), 16)}, 0.05)`
                            }}
                          >
                            <span>{sub.label}</span>
                            {sub.badge > 0 && (
                              <span className="bg-red-500/80 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {sub.badge}
                              </span>
                            )}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* Boutons du bas */}
          <div className="space-y-3 pt-4 border-t border-gray-800/50">
            <motion.button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaHome />
              <span>Tableau de bord</span>
            </motion.button>
            <motion.button
              onClick={() => {
                localStorage.removeItem('accessToken');
                navigate('/login');
              }}
              className="w-full flex items-center justify-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 px-4 py-3 rounded-xl border border-gray-700/50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaSignOutAlt />
              <span>Déconnexion</span>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Contenu principal */}
      <main 
        className={`min-h-screen transition-all duration-500 ${isSidebarOpen ? 'ml-0 md:ml-72' : 'ml-0'}`}
      >
        {/* Barre de navigation supérieure */}
        <header className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-xl shadow-sm border-b border-gray-800/50">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-400 hover:text-white focus:outline-none"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaBars className="text-xl" />
              </motion.button>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Tableau Analytique
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button 
                className="relative text-gray-400 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaBell className="text-xl" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </motion.button>
              
              <motion.div
                className="flex items-center space-x-2 cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  <FaUserCircle className="text-2xl text-gray-400" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-gray-900"></span>
                </div>
                <span className="hidden md:inline text-sm font-medium">Administrateur</span>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Contenu du dashboard */}
        <div className="p-6">
          {/* En-tête avec statistiques */}
          <motion.section 
            className="bg-gradient-to-br from-gray-900/80 to-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-12 border border-gray-800/50 relative overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Effet de particules */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-blue-500/20"
                  style={{
                    width: Math.random() * 10 + 2,
                    height: Math.random() * 10 + 2,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    x: [0, Math.random() * 100 - 50],
                    y: [0, Math.random() * 100 - 50],
                  }}
                  transition={{
                    duration: Math.random() * 10 + 5,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                  <motion.h1 
                    className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    Tableau de Bord Analytique
                  </motion.h1>
                  <motion.p 
                    className="text-gray-400 flex items-center text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                    Données en temps réel • Mis à jour: {moment().format('HH:mm:ss')}
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex space-x-3"
                >
                  <motion.button
                    onClick={fetchData}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600/30 to-blue-700/30 hover:from-blue-700/30 hover:to-blue-800/30 text-white px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20 transition-all border border-blue-500/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <FaSyncAlt className="animate-spin" />
                    ) : (
                      <FaSyncAlt />
                    )}
                    <span>Actualiser</span>
                  </motion.button>
                </motion.div>
              </div>

              {/* Cartes de statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                  className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-6 rounded-2xl border border-blue-500/30 shadow-lg shadow-blue-500/20 relative overflow-hidden"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-sm font-medium text-blue-300">Total Utilisateurs</p>
                      <p className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 shadow-inner shadow-blue-500/30">
                      <FaUsers className="text-2xl" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-br from-green-900/30 to-green-800/20 p-6 rounded-2xl border border-green-500/30 shadow-lg shadow-green-500/20 relative overflow-hidden"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-sm font-medium text-green-300">Entités Vérifiées</p>
                      <p className="text-3xl font-bold text-white mt-1">{stats.verifiedCount}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-green-500/20 text-green-400 shadow-inner shadow-green-500/30">
                      <FaShieldAlt className="text-2xl" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 p-6 rounded-2xl border border-purple-500/30 shadow-lg shadow-purple-500/20 relative overflow-hidden"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-sm font-medium text-purple-300">Activité aujourd'hui</p>
                      <p className="text-3xl font-bold text-white mt-1">{stats.activeToday}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 shadow-inner shadow-purple-500/30">
                      <FaChartLine className="text-2xl" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400">Chargement des données...</p>
              </motion.div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Tendance combinée */}
              <NeonCombinedTrends data={data} />

              {/* Sections par catégorie */}
              <NeonCategorySection
                title="Patients"
                data={data.patients}
                icon={FaProcedures}
                color={neonColors.blue}
                donutKey="insurance"
                donutLabel="Répartition par assurance"
                stats={[
                  { label: 'Total', value: data.patients.length },
                  { label: 'Âge moyen', value: data.patients.length ? (data.patients.reduce((sum, p) => sum + p.age, 0) / data.patients.length).toFixed(1) : 0 },
                  { label: 'Vérifiés', value: data.patients.filter(p => p.approved).length },
                  { label: 'Aujourd\'hui', value: data.patients.filter(p => moment(p.createdAt).isSame(moment(), 'day')).length }
                ]}
                tableColumns={[
                  ...commonTableColumns,
                  { key: 'age', label: 'Âge' },
                  { key: 'insurance', label: 'Assurance' }
                ]}
                isExpanded={expandedSections['patients-section']}
                setIsExpanded={(value) => setExpandedSections(prev => ({ ...prev, 'patients-section': value }))}
                sectionId="patients-section"
              />

              <NeonCategorySection
                title="Médecins Référents"
                data={data.refdoctors}
                icon={FiAward}
                color={neonColors.purple}
                donutKey="specialty"
                donutLabel="Répartition par spécialité"
                stats={[
                  { label: 'Total', value: data.refdoctors.length },
                  { label: 'Spécialités', value: new Set(data.refdoctors.map(d => d.specialty)).size },
                  { label: 'Vérifiés', value: data.refdoctors.filter(d => d.approved).length },
                  { label: 'Aujourd\'hui', value: data.refdoctors.filter(d => moment(d.createdAt).isSame(moment(), 'day')).length }
                ]}
                tableColumns={[
                  ...commonTableColumns,
                  { key: 'specialty', label: 'Spécialité' }
                ]}
                isExpanded={expandedSections['refdoctors-section']}
                setIsExpanded={(value) => setExpandedSections(prev => ({ ...prev, 'refdoctors-section': value }))}
                sectionId="refdoctors-section"
              />

              <NeonCategorySection
                title="Médecins Praticiens"
                data={data.pdoctors}
                icon={FaUserMd}
                color={neonColors.orange}
                donutKey="specialty"
                donutLabel="Répartition par spécialité"
                stats={[
                  { label: 'Total', value: data.pdoctors.length },
                  { label: 'Spécialités', value: new Set(data.pdoctors.map(d => d.specialty)).size },
                  { label: 'Vérifiés', value: data.pdoctors.filter(d => d.approved).length },
                  { label: 'Aujourd\'hui', value: data.pdoctors.filter(d => moment(d.createdAt).isSame(moment(), 'day')).length }
                ]}
                tableColumns={[
                  ...commonTableColumns,
                  { key: 'specialty', label: 'Spécialité' }
                ]}
                isExpanded={expandedSections['pdoctors-section']}
                setIsExpanded={(value) => setExpandedSections(prev => ({ ...prev, 'pdoctors-section': value }))}
                sectionId="pdoctors-section"
              />

              <NeonCategorySection
                title="Cliniques"
                data={data.clinics}
                icon={FaHospital}
                color={neonColors.green}
                donutKey="address"
                donutLabel="Répartition par localisation"
                stats={[
                  { label: 'Total', value: data.clinics.length },
                  { label: 'Localisations', value: new Set(data.clinics.map(c => c.address)).size },
                  { label: 'Vérifiées', value: data.clinics.filter(c => c.approved).length },
                  { label: 'Aujourd\'hui', value: data.clinics.filter(c => moment(c.createdAt).isSame(moment(), 'day')).length }
                ]}
                tableColumns={[
                  ...commonTableColumns,
                  { key: 'address', label: 'Adresse' }
                ]}
                isExpanded={expandedSections['clinics-section']}
                setIsExpanded={(value) => setExpandedSections(prev => ({ ...prev, 'clinics-section': value }))}
                sectionId="clinics-section"
              />

              <NeonCategorySection
                title="Agences de Voyage"
                data={data.travelagencies}
                icon={FaPlane}
                color={neonColors.pink}
                donutKey="address"
                donutLabel="Répartition par localisation"
                stats={[
                  { label: 'Total', value: data.travelagencies.length },
                  { label: 'Localisations', value: new Set(data.travelagencies.map(t => t.address)).size },
                  { label: 'Vérifiées', value: data.travelagencies.filter(t => t.approved).length },
                  { label: 'Aujourd\'hui', value: data.travelagencies.filter(t => moment(t.createdAt).isSame(moment(), 'day')).length }
                ]}
                tableColumns={commonTableColumns}
                isExpanded={expandedSections['travelagencies-section']}
                setIsExpanded={(value) => setExpandedSections(prev => ({ ...prev, 'travelagencies-section': value }))}
                sectionId="travelagencies-section"
              />
            </div>
          )}
        </div>
      </main>

      {/* Overlay pour la sidebar mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FuturisticAnalyticsDashboard;