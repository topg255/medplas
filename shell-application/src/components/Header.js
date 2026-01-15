import React from 'react';

export function Header() {
  // On récupère le nom depuis le localStorage
  const userName = localStorage.getItem("userName");

  return (
    <header className="w-full bg-white shadow-lg px-6 py-4 flex justify-between items-center">
      {/* Logo ou lien à gauche */}
      <div className="flex items-center space-x-4">
       
        {/* D'autres éléments de navigation peuvent être ajoutés ici */}
      </div>

      {/* Nom de l'utilisateur aligné à droite */}
      <div className="flex items-center space-x-3">
        {userName ? (
          <>
            <span className="text-lg font-medium text-gray-800">Bienvenue,</span>
            {userName ? `Bienvenue, ${userName}` : "Bienvenue"}
            </>
        ) : (
          <span className="text-lg font-medium text-gray-600">Bienvenue</span>
        )}
      </div>
    </header>
  );
}
