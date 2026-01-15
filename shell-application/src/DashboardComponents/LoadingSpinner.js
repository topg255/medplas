// components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ 
  message = "Chargement...", 
  icon = null,
  size = "medium" 
}) => {
  const sizes = {
    small: "w-8 h-8",
    medium: "w-12 h-12", 
    large: "w-16 h-16"
  };

  const iconSizes = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8"
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className={`${sizes[size]} border-t-2 border-blue-600 border-solid rounded-full animate-spin`}></div>
        {icon && (
          <div className={`${iconSizes[size]} text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
            {icon}
          </div>
        )}
      </div>
      <span className="mt-4 text-slate-600">{message}</span>
    </div>
  );
};

// Variantes spécialisées
export const AppointmentLoading = () => (
  <LoadingSpinner 
    icon={<Stethoscope className="w-6 h-6 text-blue-600" />}
    message="Chargement des rendez-vous..."
  />
);

export const FileUploadLoading = () => (
  <LoadingSpinner 
    icon={<Upload className="w-6 h-6 text-blue-600" />}
    message="Upload en cours..."
    size="small"
  />
);

export default LoadingSpinner;