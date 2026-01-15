// components/PendingAppointmentsAlert.jsx
import React from 'react';
import { Clock, XCircle } from 'lucide-react';

const PendingAppointmentsAlert = ({ show, pendingCount, onClose }) => {
  if (!show || pendingCount === 0) return null;

  return (
    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
          <Clock className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="text-amber-800 font-medium">
            Vous avez {pendingCount} rendez-vous en attente de confirmation
          </p>
          <p className="text-amber-600 text-sm">
            Nos équipes traiteront votre demande dans les plus brefs délais.
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-amber-600 hover:text-amber-800 transition-colors"
      >
        <XCircle className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PendingAppointmentsAlert;