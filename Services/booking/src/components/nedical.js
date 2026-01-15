import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import logo from '../assets/logoc.jpg';
import watermark from '../assets/logob.png';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCheck, FiArrowRight, FiX, FiUpload, FiTrash2, FiCalendar, 
  FiClock, FiUser, FiMail, FiPhone, FiGlobe, FiChevronRight,
  FiPlus, FiMinus, FiEdit2, FiDownload, FiPrinter,FiCheckCircle
} from 'react-icons/fi';
import { 
  FaMedal, FaUserMd, FaFileMedical, FaTags, FaCheckCircle,
  FaTooth, FaClinicMedical, FaProcedures, FaHospitalUser
} from 'react-icons/fa';
import { GiHealthNormal, GiStethoscope } from 'react-icons/gi';
import { IoMdPricetags } from 'react-icons/io';
import 'jspdf-autotable';

// Sample images
import image1 from '../assets/grok1.jpg';
import image2 from '../assets/grok2.jpg';
import image3 from '../assets/grok1.jpg';

export const MedicalBookingForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    specialty: '',
    doctor: '',
    date: '',
    time: '',
    duration: 1,
    documents: [],
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      country: '',
      birthDate: '',
      gender: '',
      medicalHistory: '',
    },
    selectedPackage: null,
    additionalServices: []
  });

  const [isDragging, setIsDragging] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
  const [showPackagesModal, setShowPackagesModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const confirmationRef = useRef();
  const fileInputRef = useRef(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  // Specialties data
  const specialties = [
    {
      id: 'hair',
      name: 'Greffe de cheveux FUE',
      icon: <GiHealthNormal className="text-blue-500" />,
      description: 'Technique moderne de greffe capillaire sans cicatrice visible, avec des résultats naturels et permanents.',
      videoUrl: 'https://www.youtube.com/embed/example-hair',
      procedureSteps: [
        'Consultation et diagnostic personnalisé',
        'Préparation de la zone donneuse',
        'Prélèvement des greffons (1 à 2 heures)',
        'Préparation des micro-canaux',
        'Implantation des greffons (3 à 6 heures)',
        'Soins post-opératoires et suivi'
      ],
      benefits: [
        'Aucune cicatrice linéaire visible',
        'Récupération rapide (5-7 jours)',
        'Résultats naturels et permanents',
        'Technique réalisée sous anesthésie locale'
      ],
      duration: '4-8 heures',
      recovery: '5-7 jours',
      successRate: '95%',
      packages: [
        {
          id: 'hair-basic',
          name: 'Pack Essentiel',
          price: 2500,
          includes: [
            '1500 greffons',
            'Anesthésie locale',
            '1 nuit d\'hospitalisation',
            'Kit post-opératoire'
          ],
          bestValue: false
        },
        {
          id: 'hair-standard',
          name: 'Pack Confort',
          price: 3500,
          includes: [
            '2500 greffons',
            'Anesthésie locale',
            '2 nuits d\'hospitalisation',
            'Kit post-opératoire premium',
            '2 séances de PRP incluses'
          ],
          bestValue: true
        },
        {
          id: 'hair-premium',
          name: 'Pack Excellence',
          price: 5000,
          includes: [
            '3500+ greffons',
            'Anesthésie locale',
            '3 nuits en suite privée',
            'Kit post-opératoire complet',
            '4 séances de PRP incluses',
            'Suivi à 1 an'
          ],
          bestValue: false
        }
      ],
      additionalServices: [
        { id: 'hair-transport', name: 'Transport VIP', price: 200 },
        { id: 'hair-prp', name: 'Séance PRP supplémentaire', price: 150 },
        { id: 'hair-hotel', name: 'Nuit d\'hôtel supplémentaire', price: 120 }
      ]
    },
    {
      id: 'ivf',
      name: 'Fécondation In Vitro',
      icon: <FaProcedures className="text-pink-500" />,
      description: 'Traitement de procréation assistée avec des taux de réussite élevés et un suivi personnalisé à chaque étape.',
      videoUrl: 'https://www.youtube.com/embed/example-ivf',
      procedureSteps: [
        'Stimulation ovarienne (10-12 jours)',
        'Suivi par échographie et prise de sang',
        'Prélèvement des ovocytes (20-30 minutes)',
        'Fécondation en laboratoire',
        'Culture des embryons (3-5 jours)',
        'Transfert embryonnaire'
      ],
      benefits: [
        'Taux de réussite élevés',
        'Possibilité de dépistage génétique',
        'Adapté à divers problèmes de fertilité',
        'Suivi personnalisé à chaque étape'
      ],
      duration: '4-6 semaines',
      recovery: '1-2 jours',
      successRate: '65-70%',
      packages: [
        {
          id: 'ivf-standard',
          name: 'Pack Standard',
          price: 4000,
          includes: [
            'Stimulation ovarienne',
            'Prélèvement des ovocytes',
            'Fécondation en laboratoire',
            'Transfert d\'1 embryon'
          ],
          bestValue: false
        },
        {
          id: 'ivf-gold',
          name: 'Pack Gold',
          price: 6000,
          includes: [
            'Stimulation ovarienne',
            'Prélèvement des ovocytes',
            'Fécondation ICSI',
            'Culture jusqu\'au stade blastocyste',
            'Transfert de 2 embryons',
            '1 congélation embryonnaire'
          ],
          bestValue: true
        }
      ],
      additionalServices: [
        { id: 'ivf-genetic', name: 'Dépistage génétique', price: 1000 },
        { id: 'ivf-freeze', name: 'Congélation embryonnaire', price: 500 },
        { id: 'ivf-hotel', name: 'Hébergement VIP', price: 300 }
      ]
    },
    {
      id: 'dental',
      name: 'Dentisterie Esthétique',
      icon: <FaTooth className="text-blue-400" />,
      description: 'Solutions complètes pour un sourire parfait avec les dernières technologies numériques et matériaux premium.',
      videoUrl: 'https://www.youtube.com/embed/example-dental',
      procedureSteps: [
        'Consultation et diagnostic 3D',
        'Plan de traitement personnalisé',
        'Préparation dentaire',
        'Pose des implants ou appareils',
        'Ajustements et finitions',
        'Suivi post-opératoire'
      ],
      benefits: [
        'Technologies numériques de précision',
        'Matériaux de haute qualité',
        'Résultats naturels et durables',
        'Douleur minimale grâce aux techniques avancées'
      ],
      duration: '1-3 séances',
      recovery: '1-3 jours',
      successRate: '98%',
      packages: [
        {
          id: 'dental-smile',
          name: 'Pack Sourire',
          price: 1800,
          includes: [
            'Blanchiment dentaire complet',
            'Consultation spécialisée',
            'Kit d\'entretien à domicile',
            '1 contrôle post-traitement'
          ],
          bestValue: false
        },
        {
          id: 'dental-implant',
          name: 'Pack Implant Elite',
          price: 3200,
          includes: [
            'Implant dentaire en zircone',
            'Couronne céramique',
            'Scanner 3D inclus',
            'Garantie 5 ans',
            '3 contrôles post-opératoires'
          ],
          bestValue: true
        },
        {
          id: 'dental-transform',
          name: 'Pack Transformation',
          price: 4500,
          includes: [
            'Alignement dentaire (Invisalign)',
            'Blanchiment professionnel',
            'Facettes en céramique (6 dents)',
            'Suivi à 1 an',
            'Garantie 7 ans'
          ],
          bestValue: false
        }
      ],
      additionalServices: [
        { id: 'dental-whiten', name: 'Blanchiment supplémentaire', price: 200 },
        { id: 'dental-veneers', name: 'Facettes supplémentaires', price: 350 },
        { id: 'dental-anesthesia', name: 'Anesthésie consciente', price: 150 }
      ]
    },
    {
      id: 'plasticsurgery',
      name: 'Chirurgie Plastique',
      icon: <FaClinicMedical className="text-purple-500" />,
      description: 'Interventions esthétiques et reconstructives pour sculpter votre apparence avec des résultats naturels et harmonieux.',
      videoUrl: 'https://www.youtube.com/embed/example-plastic',
      procedureSteps: [
        'Consultation avec simulation 3D',
        'Préparation pré-opératoire',
        'Intervention sous anesthésie',
        'Suivi immédiat post-opératoire',
        'Ablation des sutures',
        'Contrôles réguliers'
      ],
      benefits: [
        'Techniques micro-invasives',
        'Résultats naturels et personnalisés',
        'Équipe multidisciplinaire',
        'Suivi post-opératoire complet'
      ],
      duration: '1-4 heures',
      recovery: '7-15 jours',
      successRate: '92%',
      packages: [
        {
          id: 'plastic-rhinoplasty',
          name: 'Pack Rhinoplastie',
          price: 3800,
          includes: [
            'Rhinoplastie complète',
            'Anesthésie générale',
            '2 nuits d\'hospitalisation',
            'Suivi à 3 mois'
          ],
          bestValue: false
        },
        {
          id: 'plastic-breast',
          name: 'Pack Mammaire',
          price: 5200,
          includes: [
            'Augmentation/réduction mammaire',
            'Implants premium',
            '3 nuits en clinique',
            'Suivi à 6 mois',
            '1 séance de laser post-op'
          ],
          bestValue: true
        },
        {
          id: 'plastic-rejuvenation',
          name: 'Pack Rajeunissement',
          price: 6800,
          includes: [
            'Lifting facial complet',
            'Blepharoplastie (paupières)',
            '5 nuits en suite privée',
            'Programme de soins post-op',
            'Suivi à 1 an'
          ],
          bestValue: false
        }
      ],
      additionalServices: [
        { id: 'plastic-laser', name: 'Séance laser post-op', price: 250 },
        { id: 'plastic-private', name: 'Suite privée supplémentaire', price: 300 },
        { id: 'plastic-care', name: 'Conciergerie médicale', price: 200 }
      ]
    }
  ];

  // Handle file upload
  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).map((file) => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...newFiles]
    }));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('personalInfo.')) {
      const fieldName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, [fieldName]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle package selection
  const handleSelectPackage = (pkg) => {
    setFormData(prev => ({
      ...prev,
      selectedPackage: pkg,
      additionalServices: [] // Reset additional services when package changes
    }));
    setShowPackagesModal(false);
  };

  // Handle additional service toggle
  const handleToggleService = (service) => {
    setFormData(prev => {
      const existingIndex = prev.additionalServices.findIndex(s => s.id === service.id);
      if (existingIndex >= 0) {
        // Remove service
        const newServices = [...prev.additionalServices];
        newServices.splice(existingIndex, 1);
        return { ...prev, additionalServices: newServices };
      } else {
        // Add service
        return { ...prev, additionalServices: [...prev.additionalServices, service] };
      }
    });
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    let total = formData.selectedPackage?.price || 0;
    formData.additionalServices.forEach(service => {
      total += service.price;
    });
    return total;
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  // Generate PDF
  const generatePDF = async () => {
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 40;
    let yPosition = margin;

    // Add watermark
    if (watermark) {
      pdf.addImage(watermark, 'PNG', pageWidth / 2 - 100, pageHeight / 2 - 100, 200, 200, undefined, 'NONE', 0.1);
    }

    // Header
    pdf.addImage(logo, 'PNG', margin, yPosition, 80, 80);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    pdf.setTextColor(33, 37, 41);
    pdf.text('CONFIRMATION DE RENDEZ-VOUS', margin + 100, yPosition + 40);

    // Subheader
    pdf.setFontSize(12);
    pdf.setTextColor(108, 117, 125);
    pdf.text('Vos informations médicales et de rendez-vous', margin + 100, yPosition + 60);

    // Divider
    yPosition += 100;
    pdf.setLineWidth(1);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);

    // Patient Information
    yPosition += 30;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(33, 37, 41);
    pdf.text('INFORMATIONS PATIENT', margin, yPosition);

    yPosition += 25;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(66, 66, 66);
    pdf.text(`Nom complet: ${formData.personalInfo.name}`, margin, yPosition);
    yPosition += 20;
    pdf.text(`Email: ${formData.personalInfo.email}`, margin, yPosition);
    yPosition += 20;
    pdf.text(`Téléphone: ${formData.personalInfo.phone}`, margin, yPosition);
    yPosition += 20;
    pdf.text(`Pays: ${formData.personalInfo.country}`, margin, yPosition);
    yPosition += 20;
    pdf.text(`Date de naissance: ${formData.personalInfo.birthDate || 'Non spécifié'}`, margin, yPosition);
    yPosition += 20;
    pdf.text(`Genre: ${formData.personalInfo.gender || 'Non spécifié'}`, margin, yPosition);

    // Divider
    yPosition += 30;
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);

    // Appointment Details
    yPosition += 30;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(33, 37, 41);
    pdf.text('DÉTAILS DU RENDEZ-VOUS', margin, yPosition);

    yPosition += 25;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(66, 66, 66);
    const specialty = specialties.find(s => s.id === formData.specialty);
    pdf.text(`Spécialité: ${specialty?.name || 'Non spécifié'}`, margin, yPosition);
    yPosition += 20;
    pdf.text(`Date: ${formData.date || 'Non spécifié'}`, margin, yPosition);
    yPosition += 20;
    pdf.text(`Heure: ${formData.time || 'Non spécifié'}`, margin, yPosition);

    // Package Details
    if (formData.selectedPackage) {
      yPosition += 30;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(33, 37, 41);
      pdf.text('PACKAGE SÉLECTIONNÉ', margin, yPosition);

      yPosition += 25;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${formData.selectedPackage.name} - ${formatPrice(formData.selectedPackage.price)}`, margin, yPosition);
      
      yPosition += 20;
      pdf.setFont('helvetica', 'normal');
      formData.selectedPackage.includes.forEach((item, index) => {
        if (yPosition > pageHeight - 100) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(`✓ ${item}`, margin + 20, yPosition);
        yPosition += 20;
      });

      // Additional Services
      if (formData.additionalServices.length > 0) {
        yPosition += 20;
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('SERVICES SUPPLÉMENTAIRES', margin, yPosition);

        yPosition += 20;
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        formData.additionalServices.forEach(service => {
          if (yPosition > pageHeight - 100) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(`+ ${service.name} - ${formatPrice(service.price)}`, margin + 20, yPosition);
          yPosition += 20;
        });
      }

      // Total Price
      yPosition += 20;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`TOTAL: ${formatPrice(calculateTotalPrice())}`, margin, yPosition);
    }

    // Documents
    if (formData.documents.length > 0) {
      yPosition += 40;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(33, 37, 41);
      pdf.text('DOCUMENTS JOINTS', margin, yPosition);

      yPosition += 25;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      formData.documents.forEach((doc, index) => {
        if (yPosition > pageHeight - 100) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(`- ${doc.name} (${(doc.size / 1024).toFixed(1)} KB)`, margin, yPosition);
        yPosition += 20;
      });
    }

    // Footer
    pdf.setFontSize(10);
    pdf.setTextColor(108, 117, 125);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Centre Médical d\'Excellence | Contact: +123-456-7890 | Email: contact@medical-excellence.com', margin, pageHeight - 30);
    pdf.text(`Document généré le ${new Date().toLocaleDateString()}`, pageWidth - margin - 150, pageHeight - 30);

    // Border
    pdf.setDrawColor(33, 37, 41);
    pdf.setLineWidth(1);
    pdf.rect(20, 20, pageWidth - 40, pageHeight - 40, 'S');

    return pdf;
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    const pdf = await generatePDF();
    pdf.save(`Reservation_Medicale_${formData.personalInfo.name.replace(' ', '_')}.pdf`);
  };

  // Handle print
  const handlePrint = useReactToPrint({
    content: () => confirmationRef.current,
    pageStyle: `
      @page { size: auto; margin: 10mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
      }
    `
  });

  // Step 1: Personal Information
  if (step === 1) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side - Visuals */}
          <div className="w-full lg:w-1/2 relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-800/30 to-transparant z-10"></div>
            <img 
              src={image1} 
              alt="Medical Consultation" 
              className="w-full h-full object-cover absolute inset-0"
            />
            <div className="relative z-20 p-8 h-full flex flex-col justify-between">
              <div>
                <h2 className="text-4xl font-munika text-white mb-4">Votre Santé, Notre Priorité</h2>
                <p className="text-blue-100 max-w-md font-munika">
                  Commencez votre parcours médical avec des experts de renommée mondiale dans un environnement d'exception.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <FiUser className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-white font-munika">Étape 1 sur 3</p>
                  <p className="text-blue-200 text-sm font-munika">Informations personnelles</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-1/2 bg-white backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/10"
          >
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-munika text-blue-800">Informations Personnelles</h1>
                <div className="text-white bg-blue-500 px-3 py-1 rounded-full text-sm font-munika">
                  Obligatoire
                </div>
              </div>
              <p className="text-gray-600 font-munika">
                Veuillez remplir vos coordonnées pour commencer le processus de réservation.
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-black mb-2">Nom complet<span className='text-red-800'>*</span></label>
                <div className="relative">
                  <input
                    type="text"
                    name="personalInfo.name"
                    value={formData.personalInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-12 bg-white border border-blue-800 rounded-xl text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="Jean Dupont"
                    required
                  />
                  <FiUser className="absolute left-4 top-3.5 text-blue-800" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-black mb-2">Email<span className='text-red-800'>*</span></label>
                <div className="relative">
                  <input
                    type="email"
                    name="personalInfo.email"
                    value={formData.personalInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-12 bg-white border border-blue-800 rounded-xl text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="jean.dupont@example.com"
                    required
                  />
                  <FiMail className="absolute left-4 top-3.5 text-blue-800" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-black mb-2">Téléphone<span className='text-red-800'>*</span></label>
                <div className="relative">
                  <input
                    type="tel"
                    name="personalInfo.phone"
                    value={formData.personalInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-12 bg-white border border-blue-800 rounded-xl text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="+33 6 12 34 56 78"
                    required
                  />
                  <FiPhone className="absolute left-4 top-3.5 text-blue-800" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-black mb-2">Pays<span className='text-red-800'>*</span></label>
                <div className="relative">
                  <input
                    type="text"
                    name="personalInfo.country"
                    value={formData.personalInfo.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-12 bg-white border border-blue-800 rounded-xl text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="France"
                    required
                  />
                  <FiGlobe className="absolute left-4 top-3.5 text-blue-800" />
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-black mb-2">Date de naissance</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="personalInfo.birthDate"
                      value={formData.personalInfo.birthDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pl-12 bg-white border border-blue-800 rounded-xl text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      />
                    <FiCalendar className="absolute left-4 top-3.5 text-blue-800" />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-munika text-black mb-2">Genre</label>
                  <select
                    name="personalInfo.gender"
                    value={formData.personalInfo.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-12 bg-white border border-blue-800 rounded-xl text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all font-munika"
                  >
                    <option value="" className='font-munika'>Sélectionner...</option>
                    <option value="male" className='font-munika'>Masculin</option>
                    <option value="female" className='font-munika'>Féminin</option>
                    <option value="other" className='font-munika'>Autre</option>
                    <option value="prefer-not-to-say "className='font-munika'>Préfère ne pas dire</option>
                  </select>
                  
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 flex justify-end"
            >
              <button
                onClick={() => setStep(2)}
                disabled={!formData.personalInfo.name || !formData.personalInfo.email || !formData.personalInfo.phone || !formData.personalInfo.country}
                className={`px-8 py-3 rounded-xl font-medium transition-all flex items-center ${
                  !formData.personalInfo.name || !formData.personalInfo.email || !formData.personalInfo.phone || !formData.personalInfo.country
                    ? 'bg-blue-800 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-blue-500 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                }`}
              >
                Continuer <FiArrowRight className="ml-2" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Step 2: Specialty Selection
  if (step === 2) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side - Visuals */}
          <div className="w-full lg:w-1/2 relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-800/30 to-transparant z-10"></div>
          <img 
              src={image2} 
              alt="Medical Specialties" 
              className="w-full h-full object-cover absolute inset-0"
            />
            <div className="relative z-20 p-8 h-full flex flex-col justify-between">
              <div>
                <h2 className="text-4xl font-munika text-white mb-4">Expertise Médicale d'Excellence</h2>
                <p className="text-blue-100 max-w-md font-munika">
                  Choisissez parmi nos spécialités médicales de pointe, réalisées par des experts reconnus.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <GiStethoscope className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-white font-medium">Étape 2 sur 3</p>
                  <p className="text-blue-200 text-sm">Sélection de la spécialité</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Specialty Selection */}
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-1/2 bg-white backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/10"
          >
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-munika text-blue-800">Sélection de la Spécialité</h1>
                <div className="text-white bg-blue-500 px-3 py-1 rounded-full text-sm font-munika">
                  Obligatoire
                </div>
              </div>
              <p className="text-gray-600 font-munika">
                Choisissez le domaine médical correspondant à vos besoins parmi nos spécialités d'excellence.
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {specialties.map((spec) => (
                <motion.div
                  key={spec.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedSpecialty(spec);
                    setFormData(prev => ({ ...prev, specialty: spec.id }));
                    setShowSpecialtyModal(true);
                  }}
                  className={`border rounded-2xl p-6 transition-all cursor-pointer group ${
                    formData.specialty === spec.id
                      ? 'border-blue-400 bg-blue-500/10 shadow-md'
                      : 'border-white/20 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-start">
                    <div
                      className={`p-3 rounded-xl mr-4 transition-all ${
                        formData.specialty === spec.id
                          ? 'bg-blue-500/20 text-blue-800'
                          : 'bg-white/10 group-hover:bg-blue-500/20 text-blue-800'
                      }`}
                    >
                      {spec.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-blue-700">{spec.name}</h3>
                      <p className="text-gray-600 mt-2 line-clamp-2">{spec.description}</p>
                      <button
                        className="mt-4 text-blue-800 hover:text-blue-900 flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSpecialty(spec);
                          setShowSpecialtyModal(true);
                        }}
                      >
                        Voir détails <FiChevronRight className="ml-1" />
                      </button>
                    </div>
                  </div>

                  {formData.specialty === spec.id && (
                    <div className="mt-4 flex items-center text-blue-800">
                      <FiCheck className="mr-2" />
                      <span className="text-sm">Sélectionné</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 flex justify-between"
            >
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all flex items-center"
                >
                <FiArrowRight className="transform rotate-180 mr-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all" /> Retour
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.specialty}
                className={`px-8 py-3 rounded-xl font-medium transition-all flex items-center ${
                  !formData.specialty
                    ? 'bg-blue-600 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-600 text-white hover:from-blue-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
                }`}
              >
                Continuer <FiArrowRight className="ml-2" />
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Specialty Detail Modal */}
        <AnimatePresence>
          {showSpecialtyModal && selectedSpecialty && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                        <span className="mr-3">{selectedSpecialty.icon}</span>
                        {selectedSpecialty.name}
                      </h2>
                      <p className="text-gray-600 mt-2">{selectedSpecialty.description}</p>
                    </div>
                    <button
                      onClick={() => setShowSpecialtyModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-all p-2"
                    >
                      <FiX className="text-2xl" />
                    </button>
                  </div>

                  {/* Video Embed */}
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-xl overflow-hidden mb-8">
                    <iframe
                      src={selectedSpecialty.videoUrl}
                      className="w-full h-96"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Déroulement de la Procédure</h3>
                      <ol className="space-y-4">
                        {selectedSpecialty.procedureSteps.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-gray-600">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <div className="bg-blue-50 rounded-xl p-6 mb-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Avantages Clés</h3>
                        <ul className="space-y-3">
                          {selectedSpecialty.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <FiCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                              <span className="text-gray-600">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Informations Pratiques</h3>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-lg mr-4">
                              <FiClock className="text-blue-500" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-700">Durée</h4>
                              <p className="text-gray-600">{selectedSpecialty.duration}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-lg mr-4">
                              <FaFileMedical className="text-blue-500" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-700">Récupération</h4>
                              <p className="text-gray-600">{selectedSpecialty.recovery}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-lg mr-4">
                              <FaCheckCircle className="text-blue-500" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-700">Taux de Réussite</h4>
                              <p className="text-gray-600">{selectedSpecialty.successRate}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button
                      onClick={() => setShowSpecialtyModal(false)}
                      className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all flex items-center"
                    >
                      <FiArrowRight className="transform rotate-180 mr-2" />
                      Retour aux spécialités
                    </button>

                    <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => setShowPackagesModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg transition-all flex items-center group"
                      >
                        <IoMdPricetags className="mr-2" />
                        <span>Voir les packs et prix</span>
                      </button>

                      <button
                        onClick={() => {
                          setFormData(prev => ({ ...prev, specialty: selectedSpecialty.id }));
                          setShowSpecialtyModal(false);
                        }}
                        className={`px-6 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center ${
                          formData.specialty === selectedSpecialty.id
                            ? 'bg-green-50 text-green-700 border-2 border-green-300'
                            : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600'
                        }`}
                      >
                        {formData.specialty === selectedSpecialty.id ? (
                          <>
                            <FiCheck className="mr-2 text-green-500 animate-pulse" />
                            <span>Sélection confirmée</span>
                          </>
                        ) : (
                          <>
                            <span>Choisir cette spécialité</span>
                            <FiCheck className="ml-2" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Packages Modal */}
        {showPackagesModal && selectedSpecialty && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <IoMdPricetags className="text-purple-500 mr-2" />
                    Packs et Tarifs - {selectedSpecialty.name}
                  </h2>
                  <button
                    onClick={() => setShowPackagesModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-all p-2"
                  >
                    <FiX className="text-2xl" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  {selectedSpecialty.packages.map((pkg, index) => (
                    <div
                      key={pkg.id}
                      className={`border rounded-xl p-6 transition-all relative overflow-hidden ${
                        pkg.bestValue
                          ? 'border-purple-500 shadow-lg transform scale-105 z-10 bg-purple-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {pkg.bestValue && (
                        <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                          MEILLEUR RAPPORT QUALITÉ/PRIX
                        </div>
                      )}
                      <h3 className={`text-xl font-bold mb-4 ${pkg.bestValue ? 'text-purple-600' : 'text-gray-800'}`}>
                        {pkg.name}
                      </h3>
                      <div className="mb-6">
                        <span className="text-3xl font-bold text-gray-900">{formatPrice(pkg.price)}</span>
                      </div>
                      <ul className="space-y-3">
                        {pkg.includes.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <FiCheck
                              className={`mt-1 mr-2 ${pkg.bestValue ? 'text-purple-500' : 'text-blue-500'}`}
                            />
                            <span className="text-gray-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleSelectPackage(pkg)}
                        className={`mt-6 w-full py-3 rounded-lg font-medium transition-all ${
                          pkg.bestValue
                            ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white'
                            : formData.selectedPackage?.id === pkg.id
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                      >
                        {formData.selectedPackage?.id === pkg.id ? (
                          <span className="flex items-center justify-center">
                            <FiCheck className="mr-2" /> Sélectionné
                          </span>
                        ) : (
                          'Choisir ce pack'
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Additional Services */}
                {formData.selectedPackage && (
                  <div className="mt-12">
                    <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Services Supplémentaires</h3>
                    <div className="space-y-3">
                      {selectedSpecialty.additionalServices.map((service) => (
                        <div
                          key={service.id}
                          className={`p-4 border rounded-lg flex justify-between items-center cursor-pointer transition-all ${
                            formData.additionalServices.some(s => s.id === service.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => handleToggleService(service)}
                        >
                          <div>
                            <h4 className="font-medium text-gray-800">{service.name}</h4>
                            <p className="text-sm text-gray-600">{formatPrice(service.price)}</p>
                          </div>
                          {formData.additionalServices.some(s => s.id === service.id) ? (
                            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
                              <FiMinus className="text-xs" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border border-gray-300 text-gray-400 flex items-center justify-center">
                              <FiPlus className="text-xs" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiCheckCircle className="text-yellow-500 mt-1 mr-3" />
                    </div>
                    <div>
                      <p className="text-sm text-yellow-700">
                        Nos packs sont tout compris (hors billet d'avion). Pour un devis personnalisé,
                        contactez notre service client.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setShowPackagesModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all flex items-center"
                  >
                    <FiArrowRight className="transform rotate-180 mr-2" /> Retour aux détails
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Step 3: Appointment Details
  if (step === 3) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side - Visuals */}
          <div className="w-full lg:w-1/2 relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-800/30 to-transparant z-10"></div>
            <img 
              src={image3} 
              alt="Appointment Booking" 
              className="w-full h-full object-cover absolute inset-0"
            />
            <div className="relative z-20 p-8 h-full flex flex-col justify-between">
              <div>
                <h2 className="text-4xl font-munika text-white mb-4">Dernière Étape</h2>
                <p className="text-blue-100 max-w-md font-munika">
                  Complétez les détails de votre rendez-vous et téléchargez vos documents médicaux si nécessaire.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <FaHospitalUser className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-white font-munika">Étape 3 sur 3</p>
                  <p className="text-blue-200 text-sm font-munika">Détails du rendez-vous</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-1/2 bg-white backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/10"
          >
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-blue-800">Détails du Rendez-vous</h1>
                <div className="text-white bg-blue-600 px-3 py-1 rounded-full text-sm">
                  Obligatoire
                </div>
              </div>
              <p className="text-gray-400 font-munika">
                Complétez les informations nécessaires pour finaliser votre réservation.
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Selected Package */}
              {formData.selectedPackage && (
                <motion.div variants={itemVariants}>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    <IoMdPricetags className="text-blue-400 mr-3" />
                    <span>Package Sélectionné</span>
                  </h2>
                  <div className="bg-blue-900/20 border border-blue-400/30 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-white">{formData.selectedPackage.name}</h3>
                        <p className="text-blue-300">{formatPrice(formData.selectedPackage.price)}</p>
                      </div>
                      <button
                        onClick={() => setShowPackagesModal(true)}
                        className="text-blue-400 hover:text-blue-300 flex items-center text-sm"
                      >
                        <FiEdit2 className="mr-1" /> Modifier
                      </button>
                    </div>

                    {/* Additional Services */}
                    {formData.additionalServices.length > 0 && (
                      <div className="mt-4 border-t border-blue-400/20 pt-4">
                        <h4 className="text-sm font-medium text-blue-300 mb-2">Services Supplémentaires:</h4>
                        <ul className="space-y-2">
                          {formData.additionalServices.map((service, index) => (
                            <li key={index} className="flex justify-between text-sm">
                              <span className="text-blue-200">+ {service.name}</span>
                              <span className="text-blue-300">{formatPrice(service.price)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Total Price */}
                    <div className="mt-4 pt-4 border-t border-blue-400/20 flex justify-between items-center">
                      <span className="font-medium text-white">Total:</span>
                      <span className="text-xl font-bold text-white">{formatPrice(calculateTotalPrice())}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Date and Time */}
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
                  <FiCalendar className="text-blue-700 mr-3" />
                  <span>Date et Heure</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Date<span className='text-red-600'>*</span></label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 pl-12 bg-white border border-blue-800 rounded-xl text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">Heure<span className='text-red-600'>*</span></label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pl-12 bg-white border border-blue-800 rounded-xl text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
              </motion.div>

              {/* Documents */}
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-bold text-bkue-700 mb-4 flex items-center">
                  <FaFileMedical className="text-blue-700 mr-3" />
                  <span>Documents Médicaux</span>
                </h2>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    isDragging ? 'border-blue-400 bg-blue-500/10' : 'border-white/20'
                  }`}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files.length) handleFileUpload(e.dataTransfer.files);
                  }}
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    ref={fileInputRef}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="mb-4 text-blue-400">
                      <FiUpload className="text-3xl mx-auto" />
                    </div>
                    <h3 className="font-medium text-white">Glissez-déposez vos fichiers ici</h3>
                    <p className="text-blue-300 mt-2">
                      ou <span className="text-blue-400 font-medium">parcourir</span> vos fichiers
                    </p>
                    <p className="text-xs text-blue-400/70 mt-3">
                      Formats acceptés: PDF, JPG, PNG (max 10MB par fichier)
                    </p>
                  </label>
                </div>

                {formData.documents.length > 0 && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-blue-300">
                        {formData.documents.length} fichier{formData.documents.length > 1 ? 's' : ''} sélectionné
                        {formData.documents.length > 1 ? 's' : ''}
                      </h4>
                      <button
                        onClick={() => {
                          formData.documents.forEach(doc => {
                            if (doc.preview) URL.revokeObjectURL(doc.preview);
                          });
                          setFormData(prev => ({ ...prev, documents: [] }));
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-red-400 hover:text-red-300 text-sm flex items-center"
                      >
                        <FiTrash2 className="mr-1" /> Tout supprimer
                      </button>
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {formData.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center">
                            {doc.preview ? (
                              <div className="relative mr-3">
                                <img
                                  src={doc.preview}
                                  alt={doc.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                                <a
                                  href={doc.preview}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all rounded flex items-center justify-center"
                                >
                                  <FiCheck className="text-white opacity-0 hover:opacity-100 text-xs" />
                                </a>
                              </div>
                            ) : (
                              <FaFileMedical className="text-blue-400 text-xl mr-3" />
                            )}
                            <div>
                              <p className="text-white text-sm truncate max-w-xs">{doc.name}</p>
                              <p className="text-xs text-blue-400/70">
                                {(doc.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (doc.preview) URL.revokeObjectURL(doc.preview);
                              setFormData(prev => {
                                const newDocs = [...prev.documents];
                                newDocs.splice(index, 1);
                                return { ...prev, documents: newDocs };
                              });
                            }}
                            className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-red-500/10 transition-all"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 flex justify-between"
            >
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all flex items-center"
              >
                <FiArrowRight className="transform rotate-180 mr-2" /> Retour
              </button>
              <button
                onClick={() => setShowConfirmation(true)}
                disabled={!formData.date || !formData.time || !formData.selectedPackage}
                className={`px-8 py-3 rounded-xl font-medium transition-all flex items-center ${
                  !formData.date || !formData.time || !formData.selectedPackage
                    ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                }`}
              >
                Confirmer <FiCheck className="ml-2" />
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
              ref={confirmationRef}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                {success ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiCheck className="text-green-500 text-4xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Réservation Confirmée!</h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Votre rendez-vous a été confirmé avec succès. Un email de confirmation avec tous les détails vous a été envoyé.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button
                        onClick={handleDownloadPDF}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 shadow-lg transition-all flex items-center justify-center"
                      >
                        <FiDownload className="mr-2" /> Télécharger PDF
                      </button>
                      <button
                        onClick={handlePrint}
                        className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center"
                      >
                        <FiPrinter className="mr-2" /> Imprimer
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Confirmation de Rendez-vous</h2>
                      <button
                        onClick={() => setShowConfirmation(false)}
                        className="text-gray-400 hover:text-gray-600 transition-all p-2"
                      >
                        <FiX className="text-2xl" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 flex items-center">
                          <FiUser className="text-blue-500 mr-2" />
                          Informations Patient
                        </h3>
                        <div className="space-y-3">
                          <p>
                            <span className="font-medium">Nom:</span> {formData.personalInfo.name}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span> {formData.personalInfo.email}
                          </p>
                          <p>
                            <span className="font-medium">Téléphone:</span> {formData.personalInfo.phone}
                          </p>
                          <p>
                            <span className="font-medium">Pays:</span> {formData.personalInfo.country}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 flex items-center">
                          <FiCalendar className="text-blue-800 mr-2" />
                          Détails du Rendez-vous
                        </h3>
                        <div className="space-y-3">
                          <p>
                            <span className="font-medium">Spécialité:</span> {specialties.find(s => s.id === formData.specialty)?.name}
                          </p>
                          <p>
                            <span className="font-medium">Date:</span> {formData.date} à {formData.time}
                          </p>
                          {formData.selectedPackage && (
                            <p>
                              <span className="font-medium">Package:</span> {formData.selectedPackage.name} ({formatPrice(formData.selectedPackage.price)})
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Package Details */}
                    {formData.selectedPackage && (
                      <div className="mt-8 bg-blue-50 rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 flex items-center">
                          <IoMdPricetags className="text-blue-500 mr-2" />
                          Détails du Package
                        </h3>
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-800">{formData.selectedPackage.name} - {formatPrice(formData.selectedPackage.price)}</h4>
                          <ul className="mt-2 space-y-2">
                            {formData.selectedPackage.includes.map((item, index) => (
                              <li key={index} className="flex items-start">
                                <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                                <span className="text-gray-600">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Additional Services */}
                        {formData.additionalServices.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-blue-200">
                            <h4 className="font-medium text-gray-800 mb-2">Services Supplémentaires:</h4>
                            <ul className="space-y-2">
                              {formData.additionalServices.map((service, index) => (
                                <li key={index} className="flex justify-between">
                                  <span className="text-gray-600">+ {service.name}</span>
                                  <span className="text-gray-700">{formatPrice(service.price)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Total */}
                        <div className="mt-4 pt-4 border-t border-blue-200 flex justify-between items-center">
                          <span className="font-bold text-gray-800">Total:</span>
                          <span className="text-xl font-bold text-blue-600">{formatPrice(calculateTotalPrice())}</span>
                        </div>
                      </div>
                    )}

                    {/* Documents */}
                    {formData.documents.length > 0 && (
                      <div className="mt-8 bg-gray-50 rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 flex items-center">
                          <FiUpload className="text-blue-500 mr-2" />
                          Documents Joints
                        </h3>
                        <div className="space-y-3">
                          {formData.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                              <div className="flex items-center">
                                {doc.preview ? (
                                  <img
                                    src={doc.preview}
                                    alt={doc.name}
                                    className="w-10 h-10 object-cover rounded mr-3"
                                  />
                                ) : (
                                  <FaFileMedical className="text-blue-400 text-xl mr-3" />
                                )}
                                <span className="text-gray-700">{doc.name}</span>
                              </div>
                              <span className="text-sm text-gray-500">{(doc.size / 1024).toFixed(1)} KB</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-8 flex flex-wrap justify-end gap-4">
                      <button
                        onClick={() => setShowConfirmation(false)}
                        className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleDownloadPDF}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 shadow-lg transition-all flex items-center"
                      >
                        <FiDownload className="mr-2" /> Télécharger PDF
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-700 hover:to-green-600 shadow-lg transition-all flex items-center ${
                          isLoading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Traitement...
                          </>
                        ) : (
                          <>
                            <FiCheck className="mr-2" /> Confirmer Définitivement
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default MedicalBookingForm;