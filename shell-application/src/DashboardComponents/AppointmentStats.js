// components/AppointmentStats.jsx
import React from 'react';
import { Calendar, Clock, Activity, XCircle, TrendingDown,CheckCircleIcon,ScatterChart } from 'lucide-react';

const AppointmentStats = ({ stats }) => {
  // Calculer le pourcentage d'annulation
  const cancellationRate = stats.total > 0 
    ? Math.round((stats.cancelled / stats.total) * 100) 
    : 0;

  return (
    <div className="space-y-4">
      {/* Carte principale - Total des rendez-vous */}
      <StatCard
        title={stats.total}
        subtitle="Total des rendez-vous"
        icon={<Calendar className="w-10 h-10 text-blue-200" />}
        gradient="from-blue-600 to-blue-700"
        trend={stats.total > 0 ? "Tous vos rendez-vous" : "Aucun rendez-vous"}
      />
      
      {/* Carte des rendez-vous en attente */}
      {stats.pending > 0 && (
        <StatCard
          title={stats.pending}
          subtitle="En attente"
          icon={<Clock className="w-10 h-10 text-amber-200" />}
          gradient="from-amber-500 to-amber-600"
        />
      )}

      {/* Carte des rendez-vous annulés */}
      {stats.cancelled > 0 && (
        <StatCard
          title={stats.cancelled}
          subtitle="Rendez-vous annulés"
          icon={<XCircle className="w-10 h-10 text-rose-200" />}
          gradient="from-rose-500 to-pink-600"
          additionalText={`${cancellationRate}% du total`}
          trend={cancellationRate > 10 ? "Taux d'annulation élevé" : "Taux d'annulation normal"}
          isCancelled={true}
        />
      )}

      {/* Carte des rendez-vous confirmés */}
      {stats.confirmed > 0 && (
        <StatCard
          title={stats.confirmed}
          subtitle="Rendez-vous confirmés"
          icon={<CheckCircleIcon className="w-10 h-10 text-emerald-200" />}
          gradient="from-emerald-500 to-green-600"
        />
      )}

      {/* Statistiques détaillées */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <ScatterChart className="w-5 h-5 text-blue-500" />
          <h4 className="font-semibold text-slate-800">Statut des rendez-vous</h4>
        </div>

        <div className="space-y-3">
          <StatItem 
            color="bg-emerald-500" 
            label="Confirmés" 
            value={stats.confirmed} 
            percentage={stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0}
          />
          <StatItem 
            color="bg-amber-500" 
            label="En attente" 
            value={stats.pending} 
            percentage={stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}
            pulse 
          />
          <StatItem 
            color="bg-rose-500" 
            label="Annulés" 
            value={stats.cancelled} 
            percentage={stats.total > 0 ? Math.round((stats.cancelled / stats.total) * 100) : 0}
            isCancelled={true}
          />
        </div>

        {/* Barre de progression globale */}
        {stats.total > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex justify-between text-xs text-slate-600 mb-2">
              <span>Répartition des rendez-vous</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 flex overflow-hidden">
              {stats.confirmed > 0 && (
                <div 
                  className="bg-emerald-500 h-2 transition-all duration-500"
                  style={{ width: `${(stats.confirmed / stats.total) * 100}%` }}
                  title={`Confirmés: ${stats.confirmed}`}
                ></div>
              )}
              {stats.pending > 0 && (
                <div 
                  className="bg-amber-500 h-2 transition-all duration-500"
                  style={{ width: `${(stats.pending / stats.total) * 100}%` }}
                  title={`En attente: ${stats.pending}`}
                ></div>
              )}
              {stats.cancelled > 0 && (
                <div 
                  className="bg-rose-500 h-2 transition-all duration-500"
                  style={{ width: `${(stats.cancelled / stats.total) * 100}%` }}
                  title={`Annulés: ${stats.cancelled}`}
                ></div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant de carte de statistique amélioré
const StatCard = ({ title, subtitle, icon, gradient, additionalText, trend, isCancelled = false }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-xl shadow-sm p-6 text-white relative overflow-hidden group hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]`}>
    {/* Effet de brillance au survol */}
    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
    
    <div className="flex items-center justify-between relative z-10">
      <div className="flex-1">
        <h3 className="text-2xl font-bold mb-1">{title}</h3>
        <p className="text-white text-opacity-90 text-sm font-medium">{subtitle}</p>
        
        {/* Texte additionnel */}
        {additionalText && (
          <div className={`mt-2 text-xs font-medium ${
            isCancelled ? 'text-rose-100' : 'text-white text-opacity-80'
          }`}>
            {additionalText}
          </div>
        )}
        
        {/* Trend/Information */}
        {trend && (
          <div className="mt-1 text-xs text-white text-opacity-70">
            {trend}
          </div>
        )}
      </div>
      
      {/* Icône avec animation */}
      <div className="transform group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
    </div>

    {/* Indicateur visuel pour les annulations */}
    {isCancelled && (
      <div className="absolute bottom-2 right-2">
        <div className="w-3 h-3 bg-white bg-opacity-30 rounded-full animate-pulse"></div>
      </div>
    )}
  </div>
);

// Composant d'élément de statistique amélioré
const StatItem = ({ color, label, value, percentage, pulse = false, isCancelled = false }) => (
  <div className="flex items-center justify-between group hover:bg-slate-50 p-2 rounded-lg transition-colors duration-200">
    <div className="flex items-center gap-3 flex-1">
      <div className={`w-3 h-3 ${color} rounded-full ${pulse ? 'animate-pulse' : ''} group-hover:scale-125 transition-transform duration-200`}></div>
      <span className={`text-sm font-medium ${isCancelled ? 'text-rose-700' : 'text-slate-700'}`}>
        {label}
      </span>
    </div>
    
    <div className="flex items-center gap-3">
      {/* Pourcentage */}
      {percentage > 0 && (
        <span className={`text-xs font-medium ${
          isCancelled ? 'text-rose-600' : 'text-slate-500'
        }`}>
          {percentage}%
        </span>
      )}
      
      {/* Valeur */}
      <span className={`font-semibold min-w-8 text-right ${
        isCancelled ? 'text-rose-700' : 
        label === 'En attente' ? 'text-amber-600' : 
        label === 'Confirmés' ? 'text-emerald-700' : 'text-slate-800'
      }`}>
        {value}
      </span>
    </div>
  </div>
);

export default AppointmentStats;