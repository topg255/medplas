"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import jsPDF from 'jspdf';
import Image from '../assets/Plasfora.png'
import User from '../assets/p1.jpg'
import { 
  IconMessage, 
  IconX, 
  IconSend, 
  IconPlus,
  IconTrash,
  IconBrandApple,
  IconSearch,
  IconClock,
  IconUser,
  IconStethoscope,
  IconHeartbeat,
  IconDownload,
  IconRecharging
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

// Types pour les messages
const MESSAGE_TYPES = {
  USER: 'user',
  BOT: 'bot'
};

// Example chat history data
const initialChatHistory = [
  {
    id: '1',
    title: 'Medical Consultation',
    date: '2024-01-15',
    preview: 'Hello, I would like to book an appointment...',
    messages: [
      { id: '1-1', type: MESSAGE_TYPES.USER, content: 'Hello, I would like to book an appointment for a consultation.', timestamp: '10:30' },
      { id: '1-2', type: MESSAGE_TYPES.BOT, content: 'Hello! I am here to help you. What type of consultation do you need?', timestamp: '10:31' }
    ]
  },
  {
    id: '2',
    title: 'Treatment Information',
    date: '2024-01-14',
    preview: 'What treatments are available...',
    messages: [
      { id: '2-1', type: MESSAGE_TYPES.USER, content: 'What treatments are available for aesthetic surgery?', timestamp: '14:20' },
      { id: '2-2', type: MESSAGE_TYPES.BOT, content: 'We offer several aesthetic surgery treatments. Can you tell me which area interests you?', timestamp: '14:21' }
    ]
  }
];

// Logo en base64 pour l'inclure dans le PDF
const LOGO_BASE64 = Image;
const LOGO_USER = User;

// Version simplifiée du logo pour les en-têtes
const SMALL_LOGO_BASE64 = Image;

// Fonction pour charger une image et la convertir en base64
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('../assets/Plasfora.png'));
    };
    img.onerror = reject;
    img.src = src;
  });
};

// Fonction pour générer le PDF avec design élégant et logo image
const generateElegantPDF = async (chat) => {
  if (!chat || chat.messages.length === 0) return;

  const doc = new jsPDF();
  
  // Couleurs du thème
  const primaryColor = [79, 174, 159]; // Teal doux
  const secondaryColor = [147, 197, 253]; // Bleu doux
  const accentColor = [253, 186, 116]; // Orange doux
  const textColor = [55, 65, 81]; // Gris foncé
  const lightGray = [243, 244, 246]; // Gris très clair

  // Fonction pour ajouter le watermark avec logo
  const addWatermark = () => {
    // Sauvegarder l'état actuel
    const currentTextColor = doc.getTextColor();
    const currentFontSize = doc.getFontSize();
    const currentFont = doc.getFont();
    
    try {
      
      // Texte watermark en transparence
      doc.setTextColor(200, 200, 200, 0.1);
      doc.setFontSize(40);
      doc.setFont("helvetica", "bold");
      doc.text('', 105, 150, { align: 'center', angle: 45 });
      
    } catch (error) {
      console.log('Watermark logo non chargé, utilisation du texte uniquement');
      // Fallback: texte watermark seulement
      doc.setTextColor(200, 200, 200, 0.05);
      doc.setFontSize(60);
      doc.setFont("helvetica", "bold");
      doc.text('PLASFORA', 105, 150, { align: 'center', angle: 45 });
    }
    
    // Restaurer l'état précédent
    doc.setTextColor(currentTextColor);
    doc.setFontSize(currentFontSize);
    doc.setFont(currentFont[0], currentFont[1]);
  };

  // Fonction pour ajouter l'en-tête avec logo
  const addHeader = (pageTitle = 'Medical Conversation Report') => {
    // Fond d'en-tête
    doc.setFillColor(...primaryColor);
    doc.rect(15, 15, 180, 25, 'F');
    
    try {
      // Logo dans l'en-tête
      doc.addImage(SMALL_LOGO_BASE64, 'PNG', 20, 17, 20, 20, '', 'FAST');
    } catch (error) {
      console.log('Logo en-tête non chargé');
      // Fallback: cercle simple
      doc.setFillColor(255, 255, 255);
      doc.circle(30, 27, 8, 'F');
    }
    
    // Titre principal
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text('Plasfora Medical Report', 105, 27, { align: 'center' });
    
    // Sous-titre
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text('AI-Powered Medical Assistant - Tunisia Medical Tourism', 105, 33, { align: 'center' });
  };

  // Fonction pour ajouter le pied de page
  const addFooter = (pageNum, totalPages) => {
    doc.setDrawColor(...lightGray);
    doc.line(15, 275, 195, 275);
    
    doc.setTextColor(...textColor);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    
    // Footer info
    doc.text(`Page ${pageNum} of ${totalPages}`, 105, 282, { align: 'center' });
    doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, 105, 285, { align: 'center' });
    
    // Credit
    doc.text('© 2024 Plasfora Medical Tourism - Confidential Medical Document', 105, 288, { align: 'center' });
  };

  // Page 1 - Page de garde avec grand logo
  addWatermark();
  
  // En-tête page de garde
  doc.setFillColor(...primaryColor);
  doc.rect(15, 40, 180, 60, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text('MEDICAL CONVERSATION', 105, 60, { align: 'center' });
  doc.text('SUMMARY REPORT', 105, 75, { align: 'center' });
  
  // Grand logo central
  try {
    doc.addImage(LOGO_BASE64, 'PNG', 60, 100, 90, 90, '', 'FAST');
  } catch (error) {
    console.log('Logo central non chargé, utilisation du fallback');
    // Fallback: cercle avec symbole médical
    doc.setFillColor(255, 255, 255, 0.3);
    doc.circle(105, 145, 40, 'F');
    doc.setFillColor(255, 255, 255);
    doc.circle(105, 145, 30, 'F');
    doc.setFillColor(...primaryColor);
    doc.circle(105, 145, 20, 'F');
  }
  
  // Informations de la conversation
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text('Conversation Details:', 105, 200, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Title: ${chat.title}`, 105, 210, { align: 'center' });
  doc.text(`Date: ${new Date(chat.date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, 105, 217, { align: 'center' });
  doc.text(`Total Messages: ${chat.messages.length}`, 105, 224, { align: 'center' });
  
  // Cadre d'information
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.rect(25, 230, 160, 40);
  
  doc.setTextColor(...primaryColor);
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  
  const disclaimerLines = [
    'This document contains the complete conversation between',
    'the patient and the Plasfora AI Medical Assistant.',
    'All medical information is treated with strict confidentiality.'
  ];
  
  disclaimerLines.forEach((line, index) => {
    doc.text(line, 105, 240 + (index * 4), { align: 'center' });
  });
  
  addFooter(1, Math.ceil(chat.messages.length / 6) + 1);

  // Pages suivantes - Messages
  let currentPage = 2;
  let yPosition = 40;
  const messagesPerPage = 6;

  chat.messages.forEach((message, index) => {
    // Vérifier si on doit créer une nouvelle page
    if (index > 0 && index % messagesPerPage === 0) {
      doc.addPage();
      currentPage++;
      yPosition = 40;
      addWatermark();
      addHeader();
    }

    // Si c'est le premier message de la page, ajouter l'en-tête
    if (index % messagesPerPage === 0) {
      addWatermark();
      addHeader();
    }

    const isUser = message.type === MESSAGE_TYPES.USER;
    
    // Couleurs basées sur le type de message
    const bubbleColor = isUser ? secondaryColor : primaryColor;
    const textHeaderColor = isUser ? [37, 99, 235] : [13, 148, 136];
    
    // Background du message
    doc.setFillColor(
      isUser ? 239 : 240,
      isUser ? 246 : 253,
      isUser ? 255 : 250
    );
    doc.rect(20, yPosition, 170, 35, 'F');
    
    // Bordure du message
    doc.setDrawColor(...bubbleColor);
    doc.setLineWidth(0.5);
    doc.rect(20, yPosition, 170, 35);
    
    // Avatar avec petit logo
    try {
      const avatarSize = 12;
      doc.addImage(LOGO_USER, 'PNG', 25, yPosition + 12, avatarSize, avatarSize, '', 'FAST');
    } catch (error) {
      // Fallback: cercle coloré
      doc.setFillColor(...bubbleColor);
      doc.circle(31, yPosition + 17, 6, 'F');
    }
    
    // En-tête du message
    doc.setTextColor(...textHeaderColor);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(isUser ? 'Patient' : 'Medical Assistant', 45, yPosition + 10);
    
    // Timestamp
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text(message.timestamp, 175, yPosition + 10, { align: 'right' });
    
    // Contenu du message
    doc.setTextColor(...textColor);
    doc.setFontSize(9);
    
    // Diviser le texte pour qu'il tienne dans la largeur
    const maxWidth = 150;
    const lines = doc.splitTextToSize(message.content, maxWidth);
    
    // Ajuster la hauteur en fonction du nombre de lignes
    const lineHeight = 4;
    const textHeight = lines.length * lineHeight;
    const bubbleHeight = Math.max(35, textHeight + 15);
    
    // Redessiner le bubble si nécessaire
    if (bubbleHeight > 35) {
      doc.setFillColor(
        isUser ? 239 : 240,
        isUser ? 246 : 253,
        isUser ? 255 : 250
      );
      doc.rect(20, yPosition, 170, bubbleHeight, 'F');
      doc.setDrawColor(...bubbleColor);
      doc.rect(20, yPosition, 170, bubbleHeight);
    }
    
    // Afficher le texte
    doc.text(lines, 45, yPosition + 20);
    
    // Ajuster la position Y pour le prochain message
    yPosition += bubbleHeight + 10;
  });

  // Ajouter le pied de page sur la dernière page
  addFooter(currentPage, currentPage);

  // Téléchargement
  const fileName = `plasfora-medical-report-${chat.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${new Date().getTime()}.pdf`;
  doc.save(fileName);
};

// Composant Message Bubble
const MessageBubble = ({ message, isUser }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-500 ml-2' : 'bg-teal-500 mr-2'
        }`}>
          {isUser ? (
            <IconUser size={16} className="text-white" />
          ) : (
            <IconStethoscope size={16} className="text-white" />
          )}
        </div>
        
        {/* Message */}
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-blue-500 text-white rounded-br-none' 
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}>
          <p className="text-sm leading-relaxed">{message.content}</p>
          <span className={`text-xs mt-1 block ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {message.timestamp}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Composant Chat History Item
const ChatHistoryItem = ({ chat, isActive, onClick, onDelete }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-3 rounded-lg cursor-pointer transition-all ${
        isActive 
          ? 'bg-blue-50 border border-blue-200' 
          : 'hover:bg-gray-50 border border-transparent'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-semibold text-sm text-gray-800 truncate flex-1">
          {chat.title}
        </h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(chat.id);
          }}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <IconTrash size={14} />
        </button>
      </div>
      <p className="text-xs text-gray-600 truncate mb-1">
        {chat.preview}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <IconClock size={12} />
          {new Date(chat.date).toLocaleDateString('en-US')}
        </span>
        <span className="text-xs text-gray-400">
          {chat.messages.length} messages
        </span>
      </div>
    </motion.div>
  );
};

// Composant principal Chatbot
const MedicalChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState(initialChatHistory);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEscapeHint, setShowEscapeHint] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { t } = useTranslation();

  // Gestion de la touche Échap
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
      
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setShowEscapeHint(true);
        setTimeout(() => setShowEscapeHint(false), 2000);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus sur l'input quand le chat s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 500);
    }
  }, [isOpen, currentChat]);

  // Filtrer l'historique par recherche
  const filteredHistory = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Créer un nouveau chat
  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Conversation',
      date: new Date().toISOString().split('T')[0],
      preview: 'Start a new conversation...',
      messages: []
    };
    setChatHistory(prev => [newChat, ...prev]);
    setCurrentChat(newChat);
    setMessage('');
    
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Supprimer un chat
  const deleteChat = (chatId) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChat?.id === chatId) {
      setCurrentChat(null);
    }
  };

  // Télécharger la conversation en PDF avec design élégant
  const downloadElegantPDF = async () => {
    if (!currentChat || currentChat.messages.length === 0) {
      alert("No conversation to download");
      return;
    }

    setIsGeneratingPDF(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await generateElegantPDF(currentChat);
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Envoyer un message
  const sendMessage = () => {
    if (!message.trim() || !currentChat) return;

    const newUserMessage = {
      id: `${currentChat.id}-${Date.now()}`,
      type: MESSAGE_TYPES.USER,
      content: message,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, newUserMessage],
      preview: message.length > 30 ? message.substring(0, 30) + '...' : message,
      title: currentChat.messages.length === 0 ? message.substring(0, 20) + (message.length > 20 ? '...' : '') : currentChat.title
    };

    setChatHistory(prev => 
      prev.map(chat => chat.id === currentChat.id ? updatedChat : chat)
    );
    setCurrentChat(updatedChat);
    setMessage('');

    setTimeout(() => {
      const botResponse = {
        id: `${currentChat.id}-${Date.now()}-bot`,
        type: MESSAGE_TYPES.BOT,
        content: getBotResponse(message),
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, botResponse]
      };

      setChatHistory(prev => 
        prev.map(chat => chat.id === currentChat.id ? finalChat : chat)
      );
      setCurrentChat(finalChat);
    }, 1000);
  };

  // Bot auto-responses with i18n support
  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return t("chatbot_greeting");
    }
    if (lowerMessage.includes('appointment') || lowerMessage.includes('consultation')) {
      return t("chatbot_appointment");
    }
    if (lowerMessage.includes('treatment') || lowerMessage.includes('care')) {
      return t("chatbot_treatment");
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return t("chatbot_price");
    }
    if (lowerMessage.includes('emergency')) {
      return t("chatbot_emergency");
    }
    if (lowerMessage.includes('pdf') || lowerMessage.includes('download')) {
      return t("chatbot_pdf");
    }
    return t("chatbot_default");
  };

  // Scroll vers le bas des messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  // Animation style MacBook
  const macBookAnimation = {
    initial: { 
      scale: 0.8, 
      opacity: 0,
      y: 20
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <>
      {/* Bubble de chat */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-28 right-7 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center z-50 group"
          >
            <IconMessage size={28} className="text-white" />
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {t("chatbot_open_tooltip")}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Interface principale du chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[80vh] flex overflow-hidden"
              variants={macBookAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sidebar */}
              <div className="w-80 border-r border-gray-200 flex flex-col pt-10">
                {/* Bouton Nouveau Message */}
                <div className="p-4 border-b border-gray-200">
                  <button
                    onClick={createNewChat}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg py-3 px-4 font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                  >
                    <IconPlus size={20} />
                    {t("chatbot_new_message")}
                  </button>
                </div>

                {/* Barre de recherche */}
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <IconSearch size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Historique des conversations */}
                <div className="flex-1 overflow-y-auto p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <IconClock size={16} />
                    {t("chatbot_history")}
                  </h3>
                  <div className="space-y-2">
                    {filteredHistory.map(chat => (
                      <ChatHistoryItem
                        key={chat.id}
                        chat={chat}
                        isActive={currentChat?.id === chat.id}
                        onClick={() => setCurrentChat(chat)}
                        onDelete={deleteChat}
                      />
                    ))}
                    {filteredHistory.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        {t("chatbot_no_conversation")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Zone de chat principale */}
              <div className="flex-1 flex flex-col pt-10">
                {currentChat ? (
                  <>
                    {/* En-tête de conversation avec bouton télécharger */}
                    <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                      <div>
                        <h2 className="font-semibold text-gray-800">{currentChat.title}</h2>
                        <p className="text-sm text-gray-500">
                          {t("chatbot_conversation_from")} {new Date(currentChat.date).toLocaleDateString('en-US')}
                        </p>
                      </div>
                      
                      {/* Bouton télécharger PDF */}
                      {currentChat.messages.length > 0 && (
                        <motion.button
                          onClick={downloadElegantPDF}
                          disabled={isGeneratingPDF}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          title={t("chatbot_download_pdf_tooltip")}
                        >
                          {isGeneratingPDF ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <IconRecharging size={16} />
                            </motion.div>
                          ) : (
                            <IconDownload size={16} />
                          )}
                          <span className="hidden sm:inline">
                            {isGeneratingPDF ? t("chatbot_generating") : t("chatbot_pdf_report")}
                          </span>
                        </motion.button>
                      )}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                      <div className="max-w-4xl mx-auto">
                        {currentChat.messages.length === 0 ? (
                          <div className="text-center py-8">
                            <IconHeartbeat size={48} className="text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                              {t("chatbot_start_conversation")}
                            </h3>
                            <p className="text-gray-500">
                              {t("chatbot_ask_medical_questions")}
                            </p>
                          </div>
                        ) : (
                          currentChat.messages.map(msg => (
                            <MessageBubble
                              key={msg.id}
                              message={msg}
                              isUser={msg.type === MESSAGE_TYPES.USER}
                            />
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </div>

                    {/* Input message */}
                    <div className="border-t border-gray-200 p-4">
                      <div className="flex gap-2">
                        <input
                          ref={inputRef}
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                            if (e.key === 'Escape') {
                              e.preventDefault();
                              setIsOpen(false);
                            }
                          }}
                          placeholder={t("chatbot_input_placeholder")}
                          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <button
                          onClick={sendMessage}
                          disabled={!message.trim()}
                          className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg px-6 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          <IconSend size={18} />
                          {t("chatbot_send")}
                        </button>
                      </div>
                      
                    </div>
                  </>
                ) : (
                  // Écran de bienvenue
                  <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50">
                    <div className="text-center max-w-md">
                      <IconStethoscope size={64} className="text-teal-500 mx-auto mb-6" />
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {t("chatbot_title")}
                      </h2>
                      <p className="text-gray-600 mb-6">
                        {t("chatbot_welcome")}
                      </p>
                      <div className="space-y-3">
                        <button
                          onClick={createNewChat}
                          className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg py-3 px-6 font-semibold hover:shadow-lg transition-all flex items-center gap-2 justify-center"
                        >
                          <IconPlus size={20} />
                          {t("chatbot_start_conversation_btn")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton fermer */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-4 text-white hover:text-gray-700 transition-colors group"
                title={t("chatbot_close")}
              >
                <IconX size={20} />
                {/* Tooltip */}
                <div className="absolute -bottom-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {t("chatbot_close_tooltip")}
                </div>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MedicalChatbot;