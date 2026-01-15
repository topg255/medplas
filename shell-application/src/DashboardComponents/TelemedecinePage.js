// components/TelemedecinePage.jsx
import React, { useState } from 'react';
import { 
  Video, 
  Phone, 
  Calendar, 
  Clock, 
  Users, 
  MessageCircle,
  Shield,
  Wifi,
  CheckCircle,
  FileText
} from 'lucide-react';

export const TelemedecinePage = () => {
  const [activeConsultation, setActiveConsultation] = useState(null);

  const upcomingConsultations = [
    {
      id: 1,
      doctor: 'Dr. Marie Martin',
      specialty: 'Cardiologie',
      date: '15 Déc 2024',
      time: '14:30',
      duration: '30 min',
      status: 'confirmé'
    },
    {
      id: 2,
      doctor: 'Dr. Pierre Durand',
      specialty: 'Dermatologie',
      date: '20 Déc 2024',
      time: '10:00',
      duration: '45 min',
      status: 'confirmé'
    }
  ];

  const pastConsultations = [
    {
      id: 3,
      doctor: 'Dr. Sophie Lambert',
      specialty: 'Généraliste',
      date: '10 Nov 2024',
      duration: '25 min',
      prescription: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Video className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Télémédecine</h1>
              <p className="text-slate-600">Consultations médicales à distance</p>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Consultations à venir</p>
                <p className="text-2xl font-bold text-slate-800">2</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Consultations passées</p>
                <p className="text-2xl font-bold text-slate-800">1</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Temps moyen</p>
                <p className="text-2xl font-bold text-slate-800">25min</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Disponibilité</p>
                <p className="text-2xl font-bold text-slate-800">Maintenant</p>
              </div>
              <Wifi className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Consultation en attente */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prochaines consultations */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-slate-800">Prochaines consultations</h2>
              </div>

              <div className="space-y-4">
                {upcomingConsultations.map((consultation) => (
                  <div key={consultation.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-800">{consultation.doctor}</h3>
                        <p className="text-sm text-slate-500">{consultation.specialty}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                        {consultation.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span>{consultation.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span>{consultation.time} ({consultation.duration})</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <Video className="w-4 h-4" />
                        Rejoindre l'appel
                      </button>
                      <button className="px-4 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consultations passées */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h2 className="text-xl font-semibold text-slate-800">Consultations passées</h2>
              </div>

              <div className="space-y-4">
                {pastConsultations.map((consultation) => (
                  <div key={consultation.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-800">{consultation.doctor}</h3>
                        <p className="text-sm text-slate-500">{consultation.specialty}</p>
                      </div>
                      <span className="text-sm text-slate-500">{consultation.date}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span>{consultation.duration}</span>
                        </div>
                        {consultation.prescription && (
                          <div className="flex items-center gap-2 text-green-600">
                            <FileText className="w-4 h-4" />
                            <span>Ordonnance disponible</span>
                          </div>
                        )}
                      </div>

                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Voir le compte-rendu
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar droite - Informations et aide */}
          <div className="space-y-6">
            {/* Guide de préparation */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Préparation de la consultation
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Vérifiez votre connexion internet
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Installez-vous dans un endroit calme
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Préparez vos documents médicaux
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Testez votre caméra et micro
                </li>
              </ul>
            </div>

            {/* Support technique */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-sm p-6 text-white">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Wifi className="w-5 h-5 text-blue-200" />
                Support technique
              </h3>
              <p className="text-blue-100 text-sm mb-4">
                Des problèmes techniques ? Notre équipe est là pour vous aider.
              </p>
              <div className="space-y-2">
                <button className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Contacter le support
                </button>
                <button className="w-full border border-blue-400 text-blue-100 py-2 px-4 rounded-lg font-medium hover:bg-blue-500 transition-colors">
                  Guide d'utilisation
                </button>
              </div>
            </div>

            {/* Statistiques de satisfaction */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-4">Votre satisfaction</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Consultations</span>
                <span className="text-sm font-semibold text-slate-800">100%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-full"></div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Toutes vos consultations se sont bien déroulées
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelemedecinePage;