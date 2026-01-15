import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/authslice';
import { useNavigate } from 'react-router-dom';

export const AuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  useEffect(() => {
    const processTokens = async () => {
      try {
        // 1. Extraction des tokens
        const params = new URLSearchParams(window.location.search);
        const tokenString = params.get('tokens');
        if (!tokenString) throw new Error("Aucun token reçu");

        // 2. Décodage et validation
        const tokens = JSON.parse(atob(decodeURIComponent(tokenString)));
        
        // 3. Validation côté serveur (important)
        const validation = await fetch("http://localhost:3000/auth/validate-tokens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
          }),
        });

        if (!validation.ok) throw new Error("Tokens invalides");

        // 4. Stockage local
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
        localStorage.setItem("userName", tokens.userName || "");

        // 5. Mise à jour de Redux
        dispatch(setUser({
          user: { 
            id: tokens.userId,
            name: tokens.userName 
          },
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }));

        // 6. Nettoyage de l'URL et redirection
        window.history.replaceState({}, "", window.location.pathname);
        navigate("/dashboard");

      } catch (error) {
        console.error("Échec du traitement des tokens:", error);
        navigate("/login");
      }
    };

    processTokens();
  }, [dispatch, navigate]);

  return <div>Chargement de votre session...</div>;
};

export default AuthCallback;