import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import Curved from './Head';

export const CurvedBackground = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Détection du type d'appareil
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  // Gestion du scroll optimisée pour mobile et desktop
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Comportement différent selon l'appareil
      if (isMobile) {
        // Sur mobile : masquer la navbar seulement lors du scroll vers le bas
        if (currentScrollY === 0) {
          setShowNavbar(true);
        } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }
      } else {
        // Sur desktop : comportement original
        if (currentScrollY === 0) setShowNavbar(true);
        else if (currentScrollY > lastScrollY) setShowNavbar(true);
        else setShowNavbar(false);
      }

      setLastScrollY(currentScrollY);
    };

    // Délai d'exécution pour améliorer les performances
    let ticking = false;
    const updateScroll = () => {
      handleScroll();
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [lastScrollY, isMobile]);

  // Ajout d'une classe CSS pour le body pendant le scroll
  useEffect(() => {
    if (showNavbar) {
      document.body.classList.remove('navbar-hidden');
      document.body.classList.add('navbar-visible');
    } else {
      document.body.classList.remove('navbar-visible');
      document.body.classList.add('navbar-hidden');
    }
  }, [showNavbar]);

  return (
    <div className="curved-background-container">
      {/* Styles responsives intégrés */}
      <style jsx>{`
        .curved-background-container {
          width: 100%;
          position: relative;
        }
        
        /* Optimisations pour le scroll sur mobile */
        @media (max-width: 1023px) {
          .curved-background-container {
            -webkit-overflow-scrolling: touch;
          }
        }
        
        /* Réduire les animations sur les appareils qui les préfèrent */
        @media (prefers-reduced-motion: reduce) {
          .curved-background-container * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
      
      <Curved />
    </div>
  );
};

// Version avec gestion avancée du viewport mobile
export const ResponsiveCurvedBackground = () => {
  const [viewportHeight, setViewportHeight] = useState('100vh');
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Détection iOS pour le viewport
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // Gestion de la hauteur du viewport sur mobile
    const setAppHeight = () => {
      if (window.innerWidth < 1024) {
        const doc = document.documentElement;
        doc.style.setProperty('--app-height', `${window.innerHeight}px`);
        setViewportHeight('var(--app-height)');
      } else {
        setViewportHeight('100vh');
      }
    };

    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    window.addEventListener('orientationchange', setAppHeight);

    return () => {
      window.removeEventListener('resize', setAppHeight);
      window.removeEventListener('orientationchange', setAppHeight);
    };
  }, []);

  return (
    <div 
      className="responsive-curved-background"
      style={{
        height: viewportHeight,
        // Correction spécifique iOS
        ...(isIOS && {
          WebkitTransform: 'translate3d(0,0,0)',
          transform: 'translate3d(0,0,0)'
        })
      }}
    >
      <CurvedBackground />
      
      {/* Meta viewport dynamique pour mobile */}
      <style jsx global>{`
        :root {
          --app-height: 100vh;
        }
        
        .responsive-curved-background {
          min-height: 100vh;
          min-height: var(--app-height);
          overflow-x: hidden;
        }
        
        /* Optimisations spécifiques pour mobile */
        @media (max-width: 1023px) {
          .responsive-curved-background {
            position: relative;
            -webkit-overflow-scrolling: touch;
          }
          
          /* Empêcher le zoom sur les inputs sur iOS */
          @media (max-width: 768px) {
            input, select, textarea {
              font-size: 16px !important;
            }
          }
        }
        
        /* Support des écrans très hauts */
        @media (min-height: 1000px) {
          .responsive-curved-background {
            min-height: 1000px;
          }
        }
      `}</style>
    </div>
  );
};

export default CurvedBackground;