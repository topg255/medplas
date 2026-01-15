// components/EditAppointmentModal.jsx
import React from 'react';
import { XCircle, CheckCircle } from 'lucide-react';
import { OPERATIONS_LIST } from '../utils/helpers';

const EditAppointmentModal = ({ appointment, onClose, onUpdate, loading }) => {
  const [editedAppointment, setEditedAppointment] = React.useState(appointment);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editedAppointment);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">
              Modifier le rendez-vous
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              disabled={loading}
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="edit-date" className="block text-sm font-medium text-slate-700 mb-2">
              Date et Heure
            </label>
            <input
              type="datetime-local"
              id="edit-date"
              value={editedAppointment.date}
              onChange={(e) => setEditedAppointment(prev => ({
                ...prev,
                date: e.target.value
              }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="edit-operation" className="block text-sm font-medium text-slate-700 mb-2">
              Type d'opération
            </label>
            <select
              id="edit-operation"
              value={editedAppointment.operation}
              onChange={(e) => setEditedAppointment(prev => ({
                ...prev,
                operation: e.target.value
              }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
              required
            >
              <option value="">Sélectionnez une opération</option>
              {OPERATIONS_LIST.map((operation) => (
                <option key={operation} value={operation}>
                  {operation}
                </option>
              ))}
            </select>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 min-w-[120px] justify-center"
              disabled={loading || !editedAppointment.date || !editedAppointment.operation}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Mise à jour...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Sauvegarder
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAppointmentModal;