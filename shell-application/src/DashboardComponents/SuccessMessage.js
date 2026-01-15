// components/SuccessMessage.jsx
import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessMessage = ({ message, duration = 3000, onHide }) => {
  useEffect(() => {
    if (message && duration > 0) {
      const timer = setTimeout(() => {
        if (onHide) onHide();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onHide]);

  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
      <CheckCircle className="w-5 h-5" />
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default SuccessMessage;