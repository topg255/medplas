// components/DashboardHeader.jsx
import React, { useState, useEffect } from 'react';
import { Bell, Eye, EyeOff, Calendar, FileText, X, CheckCircle, RefreshCw } from 'lucide-react';
import Logo from '../assets/Plasfora.png';

export const DashboardHeader = ({ patientInfo }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  // Charger les notifications lues depuis le localStorage
  const getReadNotifications = () => {
    try {
      const read = localStorage.getItem('readNotifications');
      return read ? JSON.parse(read) : [];
    } catch {
      return [];
    }
  };

  // Sauvegarder les notifications lues dans le localStorage
  const saveReadNotifications = (readIds) => {
    try {
      localStorage.setItem('readNotifications', JSON.stringify(readIds));
    } catch (error) {
      console.error('Erreur sauvegarde notifications:', error);
    }
  };

  // Marquer une notification comme lue
  const markAsRead = (notificationId) => {
    const readNotifications = getReadNotifications();
    const newReadNotifications = [...readNotifications, notificationId];
    
    saveReadNotifications(newReadNotifications);
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    const allNotificationIds = notifications.map(notif => notif.id);
    saveReadNotifications(allNotificationIds);
    setUnreadCount(0);
  };

  // Charger les notifications depuis l'API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      
      const response = await fetch('http://localhost:3001/notification/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des notifications');
      }

      const data = await response.json();
      
      // Récupérer les IDs des notifications déjà lues
      const readNotifications = getReadNotifications();
      
      // Préparer les notifications avec statut de lecture
      const notificationsWithReadStatus = data.map(notification => ({
        ...notification,
        id: notification._id || Math.random().toString(36).substr(2, 9), // ID unique
        read: readNotifications.includes(notification._id || notification.id)
      }));

      setNotifications(notificationsWithReadStatus);
      
      // Calculer le nombre de notifications non lues
      const unread = notificationsWithReadStatus.filter(notif => !notif.read).length;
      setUnreadCount(unread);
      
      setLastUpdate(new Date());
      
    } catch (error) {
      console.error('Erreur notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Recharger les notifications
  const refreshNotifications = () => {
    fetchNotifications();
  };

  // Charger initialement les notifications
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Vérifier les nouvelles notifications périodiquement (toutes les 30 secondes)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, []);

  // Obtenir l'icône selon le type de notification
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment_cancelled':
        return <X className="w-5 h-5 text-rose-500" />;
      case 'new_appointment':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'file_uploaded':
        return <FileText className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formater la durée depuis la dernière mise à jour
  const formatLastUpdate = () => {
    if (!lastUpdate) return '';
    
    const now = new Date();
    const diff = Math.floor((now - lastUpdate) / 1000); // différence en secondes
    
    if (diff < 60) return 'à l\'instant';
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
    return `il y a ${Math.floor(diff / 3600)} h`;
  };

  return (
    <div className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center mr-8">
              <img
                onClick={handleGoHome}
                src={Logo}
                className="h-20 w-34 w-auto cursor-pointer"
                alt="Logo"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Bouton Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors group"
              >
                <Bell className="w-6 h-6" />
                
                {/* Badge de compteur */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown des notifications */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-96 overflow-hidden">
                  {/* Header du dropdown */}
                  <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-800">Notifications</h3>
                        <p className="text-sm text-slate-600">
                          {unreadCount} non lu{unreadCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Bouton rafraîchir */}
                        <button
                          onClick={refreshNotifications}
                          disabled={loading}
                          className="p-1 text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded transition-colors"
                          title="Rafraîchir"
                        >
                          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Tout lire
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Dernière mise à jour */}
                    {lastUpdate && (
                      <p className="text-xs text-slate-500">
                        Dernière mise à jour: {formatLastUpdate()}
                      </p>
                    )}
                  </div>

                  {/* Liste des notifications */}
                  <div className="max-h-80 overflow-y-auto">
                    {loading ? (
                      <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-slate-600 mt-2">Chargement...</p>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-600">Aucune notification</p>
                        <p className="text-sm text-slate-500">Vous serez alerté des nouvelles activités</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-200">
                        {notifications.map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={markAsRead}
                            getNotificationIcon={getNotificationIcon}
                            formatDate={formatDate}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer du dropdown */}
                  <div className="p-3 border-t border-slate-200 bg-slate-50">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-500">
                        {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                      </p>
                      <button
                        onClick={refreshNotifications}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Actualiser
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profil utilisateur */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                {patientInfo.userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-800">{patientInfo.userName}</p>
                <p className="text-xs text-slate-500">Patient</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay pour fermer les notifications en cliquant à l'extérieur */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};

// Composant d'élément de notification
const NotificationItem = ({ 
  notification, 
  onMarkAsRead, 
  getNotificationIcon, 
  formatDate 
}) => {
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div 
      className={`p-4 transition-all duration-200 hover:bg-slate-50 cursor-pointer ${
        !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        {/* Icône */}
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notification.type)}
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${!notification.read ? 'text-blue-900 font-medium' : 'text-slate-700'}`}>
            {notification.content}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-500">
              {formatDate(notification.createdAt)}
            </span>
            
            {/* Badge de type et statut */}
            <div className="flex items-center gap-2">
              {/* Badge de type */}
              <span className={`text-xs px-2 py-1 rounded-full ${
                notification.type === 'appointment_cancelled' ? 'bg-rose-100 text-rose-800' :
                notification.type === 'new_appointment' ? 'bg-blue-100 text-blue-800' :
                notification.type === 'file_uploaded' ? 'bg-green-100 text-green-800' :
                'bg-slate-100 text-slate-800'
              }`}>
                {notification.type === 'appointment_cancelled' ? 'Annulation' :
                 notification.type === 'new_appointment' ? 'Nouveau RDV' :
                 notification.type === 'file_uploaded' ? 'Fichier' : 'Notification'}
              </span>
              
              {/* Indicateur non lu */}
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;