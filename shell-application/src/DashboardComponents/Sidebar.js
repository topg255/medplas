// components/Sidebar.jsx
import React from 'react';
import {
  Home,
  Video,
  Calendar,
  FileText,
  User,
  LogOut,
  FolderOpen,
  MessageCircle,
  Clock,
  Calculator
} from 'lucide-react';

export const Sidebar = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'telemedecine', label: 'Télémédecine', icon: Video },
    { id: 'appointments', label: 'Make appointment', icon: Calendar },
    { id: 'dossiers', label: 'Dossiers Médicaux', icon: FolderOpen },
    { id: 'temoignages', label: 'Ajouter Témoignage', icon: MessageCircle },
    { id: 'mes-rendezvous', label: 'Reclamation', icon: Clock },
    { id: 'estimations', label: 'Estimations', icon: Calculator },
  ];
  const navigte = (url) => {
    window.location.href ="http://localhost:3021/#/login_patient";
  }
  const onLogout = () => {
    localStorage.clear();
    navigte();
    console.log('Déconnexion');
  }

  return (
    <div className="w-64 bg-white shadow-lg border-r border-slate-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Espace Patient</h1>
            <p className="text-xs text-slate-500">Plasfora</p>
          </div>
        </div>
      </div>

      {/* Menu de navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Déconnexion */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-800 rounded-lg transition-all duration-200"
        >
          <LogOut className="w-5 h-5 text-slate-400" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;