
export const microfrontendOrigins = [
  "http://localhost:3001",
  "http://localhost:3007",
  "http://localhost:3018",
  "http://localhost:3020",
];

const logoutAll = () => {
  // Supprimer localStorage
  localStorage.clear();

  // Notifier tous les microfronts
  microfrontendOrigins.forEach((origin) => {
    if (origin !== window.location.origin) {
      window.postMessage("FORCE_LOGOUT", origin);
    }
  });

  // Recharger l'interface locale
  window.location.reload();
};

export const tokenService = {
  logoutAll,
};
