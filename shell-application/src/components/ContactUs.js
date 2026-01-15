import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import {
    Send, Check, Mail, User, Phone,
    MessageSquare, Lock, MapPin,
    Clock, ArrowRight, Globe, ChevronDown,
    Sparkles, Heart, Shield, X
} from 'lucide-react';
import medical from '../assets/hv.jpg';
import { useTranslation } from "react-i18next";

// Animation pour simuler un effet de "typing" sur le numéro
const typeNumberVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
        opacity: 1,
        scale: 1,
        transition: {
            delay: i * 0.1,
            type: "spring",
            stiffness: 300,
            damping: 20
        }
    })
};

// Modale premium pour afficher le numéro
const HotlineModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const phoneNumber = "(+216) 95-064-336";
    const phoneDigits = phoneNumber.replace(/\s/g, '').split('');

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    role="dialog"
                    aria-labelledby="hotline-modal-title"
                    aria-modal="true"
                >
                    <motion.div
                        className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-blue-200/30 overflow-hidden"
                        initial={{ scale: 0.9, rotateY: 10, y: 30 }}
                        animate={{ scale: 1, rotateY: 0, y: 0 }}
                        exit={{ scale: 0.9, rotateY: -10, y: 30 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Bouton de fermeture */}
                        <motion.button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full text-blue-700 hover:bg-blue-100/50 transition-colors"
                            aria-label={t("contact_hotline_close")}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <X size={24} />
                        </motion.button>

                        {/* Titre */}
                        <motion.h2
                            id="hotline-modal-title"
                            className="text-base font-bump bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-purple-600 mb-6 text-center"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {t("contact_hotline_title")}
                        </motion.h2>

                        {/* Numéro avec effet de typing */}
                        <motion.div
                            className="flex justify-center gap-1 text-4xl font-bump text-blue-800 tracking-wider mb-8"
                            initial="hidden"
                            animate="visible"
                        >
                            {phoneDigits.map((digit, index) => (
                                <motion.span
                                    key={index}
                                    custom={index}
                                    variants={typeNumberVariants}
                                    className="relative group"
                                    whileHover={{
                                        scale: 1.2,
                                        color: "#3b82f6",
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    {digit}
                                    <motion.span
                                        className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500 opacity-0 group-hover:opacity-100"
                                        initial={{ scaleX: 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </motion.span>
                            ))}
                        </motion.div>

                        {/* Bouton Appeler maintenant */}
                        <motion.a
                            href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                            className="w-full flex items-center justify-center gap-3 px-8 py-4 text-base font-bump text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-blue-200/50 relative overflow-hidden group"
                            whileHover={{
                                scale: 1.03,
                                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)"
                            }}
                            whileTap={{ scale: 0.98 }}
                            aria-label={t("contact_hotline_call_now")}
                        >
                            <span className="relative z-10">{t("contact_hotline_call_now")}</span>
                            <Phone className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                            <motion.span
                                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
                                aria-hidden="true"
                            />
                        </motion.a>

                        {/* Particules décoratives dans la modale */}
                        {Array(10).fill().map((_, i) => (
                            <motion.div
                                key={`modal-particle-${i}`}
                                className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20"
                                style={{
                                    width: `${Math.random() * 6 + 2}px`,
                                    height: `${Math.random() * 6 + 2}px`,
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`
                                }}
                                animate={{
                                    y: [0, -20, 0],
                                    opacity: [0.2, 0.6, 0.2],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{
                                    duration: Math.random() * 5 + 3,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    delay: Math.random() * 2
                                }}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const ContactSection = () => {
    const [agreed, setAgreed] = useState(false);
    const [phone, setPhone] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isHotlineOpen, setIsHotlineOpen] = useState(false); // État pour la modale

    // For animations on scroll
    const controls = useAnimation();
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, threshold: 0.2 });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    // Dynamic time of day greeting and theme
    const [greeting, setGreeting] = useState('');
    const [timeTheme, setTimeTheme] = useState('day');

    const { t } = useTranslation();

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting(t("contact_greeting_morning"));
            setTimeTheme('morning');
        } else if (hour < 18) {
            setGreeting(t("contact_greeting_afternoon"));
            setTimeTheme('day');
        } else {
            setGreeting(t("contact_greeting_evening"));
            setTimeTheme('evening');
        }
    }, [t]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setPhone('');
            setAgreed(false);
        }, 3000);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.06, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 300, damping: 24 }
        }
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.9, rotateY: 10 },
        visible: {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: 0.4
            }
        }
    };

    // Particle animation for the background
    const particles = Array(30).fill().map((_, i) => ({
        size: Math.random() * 8 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 25 + 15,
        delay: Math.random() * 5
    }));

    // For floating 3D elements
    const floatingElements = [
        { icon: <Sparkles className="w-5 h-5 text-amber-400" />, delay: 0, duration: 8 },
        { icon: <Shield className="w-6 h-6 text-blue-400" />, delay: 2, duration: 10 },
        { icon: <Heart className="w-5 h-5 text-pink-400" />, delay: 4, duration: 9 }
    ];

    // Get time-based gradient
    const getTimeGradient = () => {
        switch (timeTheme) {
            case 'morning':
                return 'from-blue-200 via-blue-400 to-violet-400';
            case 'day':
                return 'from-blue-200 via-blue-400 to-purple-400';
            case 'evening':
                return 'from-purple-200 via-blue-400 to-blue-400';
            default:
                return 'from-blue-200 via-blue-400 to-purple-400';
        }
    };

    return (
        <div className="relative min-h-screen bg-white flex items-center pb-12 justify-center px-4 overflow-hidden">
            {/* Animated particles */}
            {particles.map((particle, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: `${particle.x}%`,
                        y: `${particle.y}%`,
                        opacity: 0.3
                    }}
                    animate={{
                        x: [`${particle.x}%`, `${(particle.x + 15) % 100}%`, `${particle.x}%`],
                        y: [`${particle.y}%`, `${(particle.y + 15) % 100}%`, `${particle.y}%`],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: particle.delay
                    }}
                    className="absolute rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10"
                    style={{ width: particle.size, height: particle.size }}
                />
            ))}

            {/* Floating gradient orbs */}
            <div className="absolute top-1/4 left-10 w-64 h-64 bg-gradient-to-r from-blue-300/20 to-purple-300/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-gradient-to-r from-purple-300/20 to-pink-300/10 rounded-full blur-3xl"></div>

            {/* Main content container */}
            <motion.div
                ref={ref}
                initial="hidden"
                animate={controls}
                variants={containerVariants}
                className="w-full max-w-7xl mx-auto relative z-10"
            >
                {/* Header section with dynamic greeting */}
                <motion.div
                    variants={itemVariants}
                    className="text-center mb-12"
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-100 rounded-full mb-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="text-sm font-bump bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
                            {greeting}, {t("contact_greeting_help")}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-200 animate-pulse"></span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-bump font-bold bg-gradient-to-r from-blue-800 via-blue-800 to-blue-800 bg-clip-text text-transparent mb-6">
                        {t("contact_title")}
                    </h2>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                        className="relative h-[3px] w-40 mx-auto my-8"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent blur-sm" />
                    </motion.div>

                    <p className="text-gray-600 max-w-2xl font-bump mx-auto text-base">
                        {t("contact_subtitle")}
                    </p>
                </motion.div>

                {/* Ultra premium card with image overlay */}
                <motion.div
                    className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-200/50"
                    variants={itemVariants}
                >
                    {/* Background gradient overlay */}
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-xl z-0"></div>

                    {/* Main content flex container */}
                    <div className="relative z-10 flex flex-col lg:flex-row">
                        {/* Left column - Form */}
                        <div className="w-full lg:w-1/2 p-6 md:p-12 relative z-10">
                            <motion.div
                                variants={containerVariants}
                                className="h-full"
                            >
                                <AnimatePresence mode="wait">
                                    {isSubmitted ? (
                                        <motion.div
                                            key="success-message"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.4 }}
                                            className="h-full flex flex-col items-center justify-center text-center p-8"
                                        >
                                            <div className="relative">
                                                <motion.div
                                                    className="w-24 h-24 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-200"
                                                    animate={{
                                                        scale: [1, 1.05, 1],
                                                    }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    <Check className="w-12 h-12 text-white" />
                                                </motion.div>

                                                {/* Success message animation */}
                                                <motion.div
                                                    className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-md"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: [0, 1.2, 1] }}
                                                    transition={{ delay: 0.3, duration: 0.6 }}
                                                >
                                                    <Sparkles className="w-4 h-4 text-white" />
                                                </motion.div>
                                            </div>

                                            <h3 className="text-2xl md:text-3xl font-bump bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent mb-4">{t("contact_form_thank_you")}</h3>
                                            <p className="text-gray-600 mb-8 max-w-md">{t("contact_form_received")}</p>

                                            <motion.div
                                                className="flex items-center gap-2 text-green-600 font-bump"
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                <span>{t("contact_form_return_home")}</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </motion.div>
                                        </motion.div>
                                    ) : (
                                        <motion.form
                                            onSubmit={handleSubmit}
                                            className="space-y-6"
                                            key="contact-form"
                                            variants={containerVariants}
                                        >
                                            <motion.div
                                                variants={itemVariants}
                                                className="mb-10"
                                            >
                                                <h3 className="text-2xl font-bump text-gray-800 mb-2">{t("contact_form_title")}</h3>
                                                <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full"></div>
                                            </motion.div>

                                            <div className="space-y-5">
                                                <motion.div
                                                    variants={itemVariants}
                                                    className={`relative transition-all duration-300 group ${activeField === 'name' ? 'scale-[1.01]' : ''}`}
                                                >
                                                    <div className={`absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors duration-300 ${activeField === 'name' ? 'text-blue-500' : 'text-gray-400'}`}>
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    <input
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        onFocus={() => setActiveField('name')}
                                                        onBlur={() => setActiveField(null)}
                                                        placeholder={t("contact_form_name")}
                                                        required
                                                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white/70 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm group-hover:border-blue-300"
                                                    />
                                                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
                                                </motion.div>

                                                <motion.div
                                                    variants={itemVariants}
                                                    className={`relative transition-all duration-300 group ${activeField === 'email' ? 'scale-[1.01]' : ''}`}
                                                >
                                                    <div className={`absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors duration-300 ${activeField === 'email' ? 'text-blue-500' : 'text-gray-400'}`}>
                                                        <Mail className="h-5 w-5" />
                                                    </div>
                                                    <input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        onFocus={() => setActiveField('email')}
                                                        onBlur={() => setActiveField(null)}
                                                        placeholder={t("contact_form_email")}
                                                        required
                                                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white/70 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm group-hover:border-blue-300"
                                                    />
                                                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
                                                </motion.div>

                                                <motion.div
                                                    variants={itemVariants}
                                                    className={`relative transition-all duration-300 group ${activeField === 'phone' ? 'scale-[1.01]' : ''}`}
                                                >
                                                    <div className={`absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors duration-300 ${activeField === 'phone' ? 'text-blue-500' : 'text-gray-400'}`}>
                                                        <Phone className="h-5 w-5" />
                                                    </div>
                                                    <input
                                                        id="phone"
                                                        name="phone"
                                                        type="tel"
                                                        placeholder={t("contact_form_phone")}
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        onFocus={() => setActiveField('phone')}
                                                        onBlur={() => setActiveField(null)}
                                                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white/70 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm group-hover:border-blue-300"
                                                    />
                                                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
                                                </motion.div>

                                                <motion.div
                                                    variants={itemVariants}
                                                    className={`relative transition-all duration-300 group ${activeField === 'subject' ? 'scale-[1.01]' : ''}`}
                                                >
                                                    <div className={`absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors duration-300 ${activeField === 'subject' ? 'text-blue-500' : 'text-gray-400'}`}>
                                                        <Globe className="h-5 w-5" />
                                                    </div>
                                                    <div className="relative">
                                                        <select
                                                            id="subject"
                                                            name="subject"
                                                            value={formData.subject}
                                                            onChange={handleChange}
                                                            onFocus={() => setActiveField('subject')}
                                                            onBlur={() => setActiveField(null)}
                                                            className="w-full pl-12 pr-10 py-4 rounded-xl border border-gray-200 bg-white/70 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm group-hover:border-blue-300 appearance-none"
                                                        >
                                                            <option value="">{t("contact_form_select_inquiry")}</option>
                                                            <option value="appointment">{t("contact_form_appointment")}</option>
                                                            <option value="consultation">{t("contact_form_consultation")}</option>
                                                            <option value="information">{t("contact_form_information")}</option>
                                                            <option value="feedback">{t("contact_form_feedback")}</option>
                                                        </select>
                                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                                            <ChevronDown className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                    </div>
                                                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
                                                </motion.div>

                                                <motion.div
                                                    variants={itemVariants}
                                                    className={`relative transition-all duration-300 group ${activeField === 'message' ? 'scale-[1.01]' : ''}`}
                                                >
                                                    <div className={`absolute top-4 left-4 flex items-start pointer-events-none transition-colors duration-300 ${activeField === 'message' ? 'text-blue-500' : 'text-gray-400'}`}>
                                                        <MessageSquare className="h-5 w-5" />
                                                    </div>
                                                    <textarea
                                                        id="message"
                                                        name="message"
                                                        rows={4}
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        onFocus={() => setActiveField('message')}
                                                        onBlur={() => setActiveField(null)}
                                                        placeholder={t("contact_form_message")}
                                                        required
                                                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white/70 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm group-hover:border-blue-300"
                                                    ></textarea>
                                                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
                                                </motion.div>
                                            </div>

                                            <motion.div
                                                variants={itemVariants}
                                                className="flex items-center gap-x-3 pl-1 mt-2"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => setAgreed(!agreed)}
                                                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${agreed ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-300'} flex items-center`}
                                                    aria-pressed={agreed}
                                                    aria-labelledby="privacy-label"
                                                >
                                                    <motion.span
                                                        className="inline-block h-5 w-5 transform rounded-full bg-white shadow-md ml-0.5"
                                                        animate={{
                                                            x: agreed ? 'calc(100% - 4px)' : '0%',
                                                            backgroundColor: agreed ? '#ffffff' : '#ffffff'
                                                        }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                    />
                                                </button>
                                                <label id="privacy-label" className="text-sm text-gray-700 flex items-center gap-2 cursor-pointer" onClick={() => setAgreed(!agreed)}>
                                                    <Lock className="h-4 w-4 text-gray-500" />
                                                    {t("contact_form_consent")} <a href="#" className="text-blue-600 hover:text-blue-800 font-bump hover:underline focus:outline-none">{t("contact_form_privacy_policy")}</a>
                                                </label>
                                            </motion.div>

                                            <motion.button
                                                type="submit"
                                                variants={itemVariants}
                                                className={`w-full bg-blue-500 text-white py-4 px-6 rounded-xl text-md font-bump shadow-lg hover:shadow-blue-200/50 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden`}
                                                whileHover={{
                                                    scale: 1.02,
                                                    boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.5)"
                                                }}
                                                whileTap={{ scale: 0.98 }}
                                                disabled={!agreed}
                                                aria-label={t("contact_form_send")}
                                            >
                                                <motion.span
                                                    className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                                                />
                                                <span className="relative flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-300">
                                                    {t("contact_form_send")}
                                                    <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            </motion.button>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>

                        {/* Right column - Ultra premium image overlay and info */}
                        <div className="w-full lg:w-1/2 relative overflow-hidden">
                            {/* 3D Floating elements */}
                            {floatingElements.map((element, index) => (
                                <motion.div
                                    key={`floating-element-${index}`}
                                    className="absolute z-20"
                                    style={{
                                        top: `${20 + (index * 25)}%`,
                                        right: `${10 + (index * 5)}%`,
                                    }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        y: [0, -10, 0],
                                        x: [0, 5, 0],
                                        rotateY: [0, 10, 0],
                                        rotateX: [0, 5, 0],
                                    }}
                                    transition={{
                                        delay: 0.8 + element.delay * 0.1,
                                        duration: element.duration,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                >
                                    <div className="p-3 bg-white backdrop-blur-md rounded-full shadow-lg">
                                        {element.icon}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Main image container with overlapping effect */}
                            <div className="relative h-full">
                                {/* Base rectangular image */}
                                <motion.div
                                    className="h-64 lg:h-full w-full overflow-hidden relative"
                                    variants={imageVariants}
                                >
                                    {/* Image gradient overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${getTimeGradient()} opacity-90 mix-blend-multiply z-10`}></div>

                                    {/* Main image */}
                                    <div className="absolute inset-0">
                                        <img
                                            alt="Medical team with advanced equipment"
                                            className="w-full h-full object-cover"
                                            src={medical}
                                        />
                                    </div>

                                    {/* Decorative circle overlay */}
                                    <motion.div
                                        className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-br from-purple-400/40 to-pink-400/40 backdrop-blur-md z-10"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.7, duration: 0.8 }}
                                    />

                                    {/* Decorative semi-transparent geometric shapes */}
                                    <motion.div
                                        className="absolute bottom-10 -left-10 w-40 h-40 rounded-2xl bg-white/10 backdrop-blur-sm rotate-12 z-10"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.9, duration: 0.8 }}
                                    />
                                </motion.div>

                                {/* Contact info overlay */}
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 p-8 z-30 bg-gradient-to-t from-blue-900/90 to-blue-900/0"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.6 }}
                                >
                                    <div className="space-y-6">
                                        <h3 className="text-xl md:text-2xl font-bump text-white">{t("contact_info_title")}</h3>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                                    <Phone className="h-4 w-4 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white/80 text-xs font-bump mb-1">{t("contact_info_phone_label")}</h4>
                                                    <p className="text-white text-sm font-bump">+1 (800) 123-4567</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                                    <Mail className="h-4 w-4 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white/80 text-xs font-bump mb-1">{t("contact_info_email_label")}</h4>
                                                    <p className="text-white text-sm font-bump">care@medicalteam.com</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                                    <MapPin className="h-4 w-4 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white/80 text-xs font-bump mb-1">{t("contact_info_address_label")}</h4>
                                                    <p className="text-white text-sm font-bump">123 Medical Center Blvd</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                                    <Clock className="h-4 w-4 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white/80 text-xs font-bump mb-1">{t("contact_info_hours_label")}</h4>
                                                    <p className="text-white text-sm font-bump">Mon-Fri: 8am-6pm</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Call to action section below the form */}
                <motion.div
                    className="mt-16 text-center"
                    variants={itemVariants}
                >
                    <motion.div
                        className="flex justify-center mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                    >
                        <div className="flex space-x-2">
                            {[0, 1, 2].map((index) => (
                                <motion.div
                                    key={`dot-${index}`}
                                    className="w-2 h-2 rounded-full bg-blue-400"
                                    initial={{ opacity: 0.3 }}
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: index * 0.3,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>

                    <h3 className="text-2xl font-bump text-gray-800 mb-4">{t("contact_cta_title")}</h3>
                    <p className="text-gray-600 font-bump max-w-2xl mx-auto mb-8">
                        {t("contact_cta_subtitle")}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        

                        <motion.button
                            onClick={() => setIsHotlineOpen(true)}
                            href="#schedule"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bump shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Clock className="w-5 h-5 text-blue-500" />
                            {t("contact_cta_hotline")}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Modale pour le numéro de hotline */}
                <HotlineModal
                    isOpen={isHotlineOpen}
                    onClose={() => setIsHotlineOpen(false)}
                />
            </motion.div>
        </div>
    );
};

export default ContactSection;