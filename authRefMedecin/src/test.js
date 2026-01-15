// MODIFICATION 1: Dans le useEffect principal (ligne ~120), modifiez comme suit :

useEffect(() => {
  const loadDoctorInfo = async () => {
    // D'abord charger depuis localStorage pour un affichage immédiat
    const localUserData = localStorage.getItem('userData');

    if (localUserData) {
      try {
        const parsedUserData = JSON.parse(localUserData);
        updateUserInfo(parsedUserData, false);
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
        // Fallback avec les données individuelles du localStorage
        const fallbackData = {
          name: localStorage.getItem('userName'),
          email: localStorage.getItem('userEmail'),
          role: localStorage.getItem('userRole'),
          Hospital: localStorage.getItem('userHospital'),
          Speciality: localStorage.getItem('userSpeciality'),
          approved: localStorage.getItem('userApproved') === 'true',
          deployed: localStorage.getItem('userDeployed') === 'true'
        };
        updateUserInfo(fallbackData, false);
      }
    }

    // *** MODIFICATION IMPORTANTE : Toujours vérifier le statut au chargement ***
    console.log("Vérification du statut RefDoctor au chargement de la page...");
    await checkStatusChanges(true); // Force la vérification
  };

  loadDoctorInfo();
  fetchMedicalFolders();

  // Écouter les changements dans localStorage
  const handleStorageChange = () => {
    console.log("Changement détecté dans localStorage, vérification du statut...");
    const updatedUserData = localStorage.getItem('userData');
    if (updatedUserData) {
      try {
        const parsedData = JSON.parse(updatedUserData);
        updateUserInfo(parsedData, false);
        // Vérifier aussi le statut depuis le serveur
        checkStatusChanges(true);
      } catch (error) {
        console.error('Erreur lors du parsing des nouvelles données:', error);
      }
    }
  };

  window.addEventListener('storage', handleStorageChange);

  // Vérifier périodiquement les changements de statut (réduit à 2 minutes)
  const statusCheckInterval = setInterval(() => {
    console.log("Vérification périodique du statut RefDoctor...");
    checkStatusChanges(false);
  }, 2 * 60 * 1000); // Toutes les 2 minutes au lieu de 5

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    clearInterval(statusCheckInterval);
  };
}, [checkStatusChanges, fetchUserProfile, updateUserInfo]);

// MODIFICATION 2: Améliorez la fonction checkStatusChanges (ligne ~90) :

const checkStatusChanges = useCallback(async (force = false) => {
  const now = Date.now();
  const twoMinutes = 2 * 60 * 1000; // Réduit de 5 à 2 minutes

  if (!force && lastStatusCheck && (now - lastStatusCheck < twoMinutes)) {
    console.log("Vérification du statut ignorée (trop récente)");
    return;
  }

  try {
    console.log("Début de la vérification du statut RefDoctor...", { force });
    setLoading(true);
    
    const serverProfile = await fetchUserProfile();
    if (serverProfile) {
      const currentApproved = doctorInfo.approved;
      const serverApproved = serverProfile.approved;

      console.log("Comparaison des statuts:", { 
        currentApproved, 
        serverApproved, 
        changed: currentApproved !== serverApproved 
      });

      // Vérifier les changements de statut
      if (currentApproved !== serverApproved) {
        if (serverApproved && !currentApproved) {
          console.log("✅ Compte approuvé !");
          setNotification({
            type: 'success',
            message: '🎉 Votre compte a été approuvé!',
            timestamp: new Date()
          });
        } else if (!serverApproved && currentApproved) {
          console.log("⚠️ Approbation révoquée !");
          setNotification({
            type: 'warning',
            message: '⚠️ Votre approbation a été révoquée',
            timestamp: new Date()
          });
        }
      } else {
        console.log("Aucun changement de statut détecté");
      }

      // Toujours mettre à jour les informations
      updateUserInfo(serverProfile, true);
      setLastStatusCheck(now);

      // Forcer la mise à jour visuelle
      setDoctorInfo(prev => ({ 
        ...prev, 
        lastUpdated: new Date().toISOString(),
        approved: serverProfile.approved // S'assurer que l'état local est synchronisé
      }));

      console.log("Statut RefDoctor mis à jour avec succès");
    } else {
      console.error("Impossible de récupérer le profil depuis le serveur");
      setNotification({
        type: 'error',
        message: 'Impossible de vérifier le statut du compte',
        timestamp: new Date()
      });
    }
  } catch (error) {
    console.error("Erreur lors de la vérification du statut:", error);
    setNotification({
      type: 'error',
      message: 'Erreur lors de la vérification du statut',
      timestamp: new Date()
    });
  } finally {
    setLoading(false);

    // Effacer la notification après 5 secondes
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }
}, [fetchUserProfile, updateUserInfo, doctorInfo.approved, lastStatusCheck]);

// MODIFICATION 3: Ajoutez un listener pour la visibilité de la page (optionnel mais recommandé) :

useEffect(() => {
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      // La page est devenue visible, vérifier le statut
      console.log("Page visible, vérification du statut...");
      checkStatusChanges(true);
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, [checkStatusChanges]);

// MODIFICATION 4: Ajoutez un bouton de rafraîchissement manuel dans l'interface (optionnel) :

// Dans la section du header, vous pouvez ajouter ce bouton :
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
  onClick={() => {
    console.log("Rafraîchissement manuel du statut...");
    checkStatusChanges(true);
  }}
  disabled={loading}
  title="Vérifier le statut maintenant"
>
  <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} size={20} />
</motion.button>h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Dossiers en attente d'approbation · {filteredFolders.length} résultat{filteredFolders.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Filtres */}
              <div className="p-6 bg-gray-50 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher par ID, spécialité ou patient..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="sm:w-64">
                    <select
                      value={filterSpecialty}
                      onChange={(e) => setFilterSpecialty(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Toutes les spécialités</option>
                      {uniqueSpecialties.map(specialty => (
                        <option key={specialty} value={specialty}>{specialty}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center space-x-3"
                  >
                    <FiAlertCircle className="text-orange-500 flex-shrink-0" />
                    <div>
                      <p className="text-orange-800 font-medium">Attention</p>
                      <p className="text-orange-700 text-sm">{error}</p>
                      <p className="text-orange-600 text-xs mt-1">Affichage des données de démonstration</p>
                    </div>
                  </motion.div>
                )}

                {loading ? (
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <FiRefreshCw className="text-blue-500 text-4xl mx-auto mb-4" />
                    </motion.div>
                    <p className="text-gray-500 text-lg">Chargement des dossiers...</p>
                  </div>
                ) : filteredFolders.length === 0 ? (
                  <div className="text-center py-12">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <FiFolder className="text-gray-300 text-6xl mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun dossier trouvé</h3>
                      <p className="text-gray-500">
                        {searchTerm || filterSpecialty ?
                          'Aucun dossier ne correspond à vos critères.' :
                          'Aucun dossier médical en attente.'
                        }
                      </p>
                    </motion.div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <AnimatePresence>
                      {filteredFolders.map((folder) => (
                        <motion.div
                          key={folder._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                            folder.approved 
                              ? "bg-green-50 border-green-200 shadow-green-100" 
                              : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg"
                          }`}
                        >
                          {/* Status Badge */}
                          <div className="absolute top-4 right-4 z-10">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                                folder.approved
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : "bg-orange-100 text-orange-800 border border-orange-200"
                              }`}
                            >
                              {folder.approved ? (
                                <FiCheckCircle size={16} />
                              ) : (
                                <FiClock size={16} />
                              )}
                              <span>{folder.approved ? "Approuvé" : "En attente"}</span>
                            </motion.div>
                          </div>

                          <div className="p-6">
                            {/* En-tête du dossier */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <FaStethoscope className="text-blue-600 text-xl" />
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-bold text-gray-900">{folder.speciality}</h3>
                                    <p className="text-sm text-gray-500">Dossier médical #{folder.appointmentId}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Informations du dossier */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                  <FiUser className="text-blue-500" size={16} />
                                  <span className="text-sm font-medium text-gray-700">Patient</span>
                                </div>
                                <p className="text-sm text-gray-900 font-mono">
                                  {folder.patientId.substring(0, 8)}...
                                </p>
                              </div>

                              <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                  <FiCalendar className="text-green-500" size={16} />
                                  <span className="text-sm font-medium text-gray-700">Créé le</span>
                                </div>
                                <p className="text-sm text-gray-900">
                                  {formatDate(folder.createdAt)}
                                </p>
                              </div>

                              <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                  <FiFolder className="text-purple-500" size={16} />
                                  <span className="text-sm font-medium text-gray-700">Fichiers</span>
                                </div>
                                <p className="text-sm text-gray-900 font-semibold">
                                  {folder.files?.length || 0} document{(folder.files?.length || 0) > 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>

                            {/* Liste des fichiers */}
                            {folder.files && folder.files.length > 0 && (
                              <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                  <FiFileText className="mr-2 text-blue-500" />
                                  Documents joints
                                </h4>
                                <div className="space-y-2">
                                  {folder.files.map((file, index) => (
                                    <motion.div
                                      key={file._id}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                                    >
                                      <div className="flex items-center space-x-3 flex-1">
                                        <div className="flex-shrink-0">
                                          {getFileIcon(file.fileType, 20)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-gray-900 truncate">
                                            {getFileName(file.fileUrl)}
                                          </p>
                                          <div className="flex items-center space-x-2 mt-1">
                                            <p className="text-xs text-gray-500">
                                              {file.fileType}
                                            </p>
                                            <span className="text-gray-300">•</span>
                                            <p className="text-xs text-gray-500">
                                              {formatDate(file.uploadedAt)}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <motion.a
                                          href={file.presignedUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.95 }}
                                          title="Voir le fichier"
                                        >
                                          <FiEye size={16} />
                                        </motion.a>
                                        <motion.a
                                          href={file.presignedUrl}
                                          download
                                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.95 }}
                                          title="Télécharger"
                                        >
                                          <FiDownload size={16} />
                                        </motion.a>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <FiClock size={14} />
                                <span>Dernière mise à jour: {formatDate(folder.updatedAt)}</span>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                {!folder.approved && (
                                  <motion.button
                                    onClick={() => approveMedicalFolder(folder._id)}
                                    disabled={processingIds.has(folder._id) || !doctorInfo.approved}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                                      processingIds.has(folder._id) || !doctorInfo.approved
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
                                    }`}
                                    whileHover={!processingIds.has(folder._id) && doctorInfo.approved ? { scale: 1.02 } : {}}
                                    whileTap={!processingIds.has(folder._id) && doctorInfo.approved ? { scale: 0.98 } : {}}
                                    title={!doctorInfo.approved ? "Votre compte doit être approuvé pour effectuer cette action" : ""}
                                  >
                                    {processingIds.has(folder._id) ? (
                                      <FiRefreshCw className="animate-spin" size={16} />
                                    ) : (
                                      <FiCheck size={16} />
                                    )}
                                    <span>
                                      {processingIds.has(folder._id) ? "Traitement..." : "Approuver le dossier"}
                                    </span>
                                  </motion.button>
                                )}

                                <motion.button
                                  onClick={() => setSelectedFolder(selectedFolder === folder._id ? null : folder._id)}
                                  className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-medium transition-colors"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <FiEye size={16} />
                                  <span>
                                    {selectedFolder === folder._id ? "Masquer détails" : "Voir détails"}
                                  </span>
                                </motion.button>
                              </div>
                            </div>

                            {/* Détails étendus */}
                            <AnimatePresence>
                              {selectedFolder === folder._id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-4 pt-4 border-t border-gray-100"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-blue-50 rounded-xl p-4">
                                      <h5 className="font-semibold text-blue-900 mb-2 flex items-center">
                                        <FiUser className="mr-2" size={16} />
                                        Informations Patient
                                      </h5>
                                      <div className="space-y-2 text-sm">
                                        <div>
                                          <span className="font-medium text-blue-800">ID Patient:</span>
                                          <span className="ml-2 text-blue-700 font-mono">{folder.patientId}</span>
                                        </div>
                                        <div>
                                          <span className="font-medium text-blue-800">Rendez-vous:</span>
                                          <span className="ml-2 text-blue-700">#{folder.appointmentId}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="bg-purple-50 rounded-xl p-4">
                                      <h5 className="font-semibold text-purple-900 mb-2 flex items-center">
                                        <FiActivity className="mr-2" size={16} />
                                        Informations Techniques
                                      </h5>
                                      <div className="space-y-2 text-sm">
                                        <div>
                                          <span className="font-medium text-purple-800">Docteur prescripteur:</span>
                                          <span className="ml-2 text-purple-700">
                                            {folder.pDoctorId ? folder.pDoctorId : "Non spécifié"}
                                          </span>
                                        </div>
                                        <div>
                                          <span className="font-medium text-purple-800">Clinique:</span>
                                          <span className="ml-2 text-purple-700">
                                            {folder.clinicId ? folder.clinicId : "Non spécifiée"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Chronologie */}
                                  <div className="mt-4 bg-gray-50 rounded-xl p-4">
                                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                                      <FiClock className="mr-2 text-gray-600" size={16} />
                                      Chronologie du dossier
                                    </h5>
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-3 text-sm">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-gray-600">Créé le</span>
                                        <span className="font-medium text-gray-900">{formatDate(folder.createdAt)}</span>
                                      </div>
                                      <div className="flex items-center space-x-3 text-sm">
                                        <div className={`w-2 h-2 rounded-full ${folder.approved ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`}></div>
                                        <span className="text-gray-600">Statut</span>
                                        <span className={`font-medium ${folder.approved ? 'text-green-700' : 'text-orange-700'}`}>
                                          {folder.approved ? 'Approuvé' : 'En attente de validation'}
                                        </span>
                                      </div>
                                      {folder.updatedAt !== folder.createdAt && (
                                        <div className="flex items-center space-x-3 text-sm">
                                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                          <span className="text-gray-600">Dernière modification</span>
                                          <span className="font-medium text-gray-900">{formatDate(folder.updatedAt)}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <item.icon className="text-blue-600" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm font-medium text-gray-900 truncate mt-1">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Section de statut d'approbation */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                  <FiShield className="mr-2 text-gray-600" size={16} />
                  Statut du Compte
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Approbation</span>
                    <div className="flex items-center space-x-2">
                      {doctorInfo.approved ? (
                        <>
                          <FiCheckCircle className="text-green-500" size={16} />
                          <span className="text-sm font-medium text-green-600">Approuvé</span>
                        </>
                      ) : (
                        <>
                          <FiClock className="text-orange-500 animate-pulse" size={16} />
                          <span className="text-sm font-medium text-orange-600">En attente</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Déploiement</span>
                    <div className="flex items-center space-x-2">
                      {doctorInfo.deployed ? (
                        <FiCheckCircle className="text-green-500" size={16} />
                      ) : (
                        <FiXCircle className="text-gray-400" size={16} />
                      )}
                      <span className={`text-sm font-medium ${
                        doctorInfo.deployed ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {doctorInfo.deployed ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Dernière synchronisation */}
                {doctorInfo.lastUpdated && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600">Dernière sync</span>
                      <span className="text-xs text-blue-800 font-medium">
                        {formatDate(doctorInfo.lastUpdated)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Statistiques */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiActivity className="mr-2 text-blue-500" />
                Statistiques
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Total dossiers', value: stats.total, icon: FiFolder, color: 'blue' },
                  { label: 'En attente', value: stats.pending, icon: FiClock, color: 'orange' },
                  { label: "Aujourd'hui", value: stats.today, icon: FiCalendar, color: 'green' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}