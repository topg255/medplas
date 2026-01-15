// src/components/AuthCallback.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifie simplement que l'utilisateur est authentifié
    // Les cookies sont déjà stockés par le navigateur
    const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
    
    if (token) {
      navigate('/');
    } else {
      window.location.href = 'http://localhost:3001/login';
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default AuthCallback;