// components/PatientProfile.jsx
import React from 'react';
import { User, Mail, Cake, Shield } from 'lucide-react';

const PatientProfile = ({ patientInfo }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 col-span-2">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-md">
          <User className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Profil Patient</h2>
          <p className="text-slate-500">Informations personnelles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard
          icon={<User className="w-5 h-5 text-blue-500" />}
          label="Nom complet"
          value={patientInfo.userName}
        />
        <InfoCard
          icon={<Mail className="w-5 h-5 text-green-500" />}
          label="Email"
          value={patientInfo.userEmail}
        />
        <InfoCard
          icon={<Cake className="w-5 h-5 text-purple-500" />}
          label="Date de naissance"
          value={patientInfo.birthDate}
        />
        <InfoCard
          icon={<Shield className="w-5 h-5 text-indigo-500" />}
          label="Assurance"
          value={patientInfo.insurance}
        />
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-slate-50 rounded-lg p-4">
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
    <p className="font-semibold text-slate-800">{value}</p>
  </div>
);

export default PatientProfile;