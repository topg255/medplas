// utils/statusHelpers.js
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import React from 'react';

export const getStatusColor = (appointment) => {
  const isApproved = appointment.approved === true;
  const isPending = appointment.approved === false || appointment.status === 'pending';

  if (isApproved || appointment.status === 'confirmed') {
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  } else if (isPending) {
    return 'bg-amber-100 text-amber-800 border-amber-200';
  } else if (appointment.status === 'cancelled') {
    return 'bg-rose-100 text-rose-800 border-rose-200';
  }
  return 'bg-slate-100 text-slate-800 border-slate-200';
};

export const getStatusIcon = (appointment) => {
  const isApproved = appointment.approved === true;
  const isPending = appointment.approved === false || appointment.status === 'pending';

  if (isApproved || appointment.status === 'confirmed') {
    return <CheckCircle className="w-4 h-4" />;
  } else if (isPending) {
    return <Clock className="w-4 h-4" />;
  } else if (appointment.status === 'cancelled') {
    return <XCircle className="w-4 h-4" />;
  }
  return <AlertCircle className="w-4 h-4" />;
};

export const getStatusText = (appointment) => {
  const isApproved = appointment.approved === true;
  const isPending = appointment.approved === false || appointment.status === 'pending';

  if (isApproved || appointment.status === 'confirmed') {
    return 'Confirmé';
  } else if (isPending) {
    return 'En attente';
  } else if (appointment.status === 'cancelled') {
    return 'Annulé';
  }
  return 'Non défini';
};