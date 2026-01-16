import React, { useState, useEffect } from "react";
//import { useSelector } from 'react-redux';
import Da from "../assets/vidoe.mp4";
import { motion, AnimatePresence } from "framer-motion";
import Logo from '../assets/Plasfora white.png'
import { useNavigate } from "react-router-dom";


import {
    FiHome,
    FiArrowRight,
    FiPhoneCall,
    FiActivity,
    FiHeart,
    FiCalendar, FiClock, FiUserCheck,
    FiStar,
    FiUsers,
    FiShield,
    FiChevronDown,
    FiChevronUp,
    FiUser,
    FiLogOut,
    FiSettings,
    FiMail,
    FiUserPlus,
    FiLogIn,
    FiMenu,
    FiX,
    FiSearch
} from "react-icons/fi";
import {
    FaPlane,
    FaTooth,
    FaBaby,
    FaClinicMedical,
    FaCut,
    FaCalendarAlt,
    FaPlus,
    FaGlobeAfrica,
    FaBookMedical,
    FaBlog,
    FaUserMd,
    FaHospital,
    FaUserTie,
    FaHeartbeat
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import '../i18n';




// Composant de recherche
const SearchComponent = ({ isOpen, setIsOpen }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setSearchQuery("");
            setSearchResults([]);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSearch = (query) => {
        setSearchQuery(query);

        if (query.trim() === "") {
            setSearchResults([]);
            return;
        }

        // Recherche dans toutes les options de menu
        const allOptions = menuItems.flatMap(item =>
            item.options.map(option => ({
                ...option,
                category: item.label
            }))
        );

        const filtered = allOptions.filter(option =>
            option.label.toLowerCase().includes(query.toLowerCase())
        );

        setSearchResults(filtered);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-[9998]"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Search Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-[9999] overflow-hidden"
                    >
                        {/* Search Header */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <FiSearch className="text-blue-600 flex-shrink-0" size={24} />
                                <input
                                    type="text"
                                    placeholder="Search for specialties, services, or resources..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="flex-1 bg-white px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none font-munika text-gray-700 placeholder-gray-400"
                                    autoFocus
                                />
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-lg hover:bg-white transition-colors flex-shrink-0"
                                    aria-label="Close search"
                                >
                                    <FiX size={24} className="text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Search Results */}
                        <div className="max-h-[60vh] overflow-y-auto p-4">
                            {searchQuery === "" ? (
                                <div className="text-center py-12">
                                    <FiSearch className="mx-auto text-gray-300 mb-4" size={48} />
                                    <p className="text-gray-500 font-munika">
                                        Start typing to search for specialties, services, or resources
                                    </p>
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 font-munika">
                                        No results found for "<span className="font-semibold">{searchQuery}</span>"
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500 font-munika mb-3">
                                        Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                                    </p>
                                    {searchResults.map((result, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            {result.onClick ? (
                                                <button
                                                    onClick={() => {
                                                        result.onClick();
                                                        setIsOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-4 p-4 bg-white hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all group"
                                                >
                                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors flex-shrink-0">
                                                        {result.icon}
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <div className="font-semibold text-gray-900 font-munika">
                                                            {result.label}
                                                        </div>
                                                        <div className="text-sm text-gray-500 font-munika">
                                                            {result.category}
                                                        </div>
                                                    </div>
                                                    <FiArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" size={20} />
                                                </button>
                                            ) : (
                                                <a
                                                    href={result.path}
                                                    onClick={() => setIsOpen(false)}
                                                    className="w-full flex items-center gap-4 p-4 bg-white hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all group"
                                                >
                                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors flex-shrink-0">
                                                        {result.icon}
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <div className="font-semibold text-gray-900 font-munika">
                                                            {result.label}
                                                        </div>
                                                        <div className="text-sm text-gray-500 font-munika">
                                                            {result.category}
                                                        </div>
                                                    </div>
                                                    <FiArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" size={20} />
                                                </a>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Links */}
                        {searchQuery === "" && (
                            <div className="bg-gray-50 p-4 border-t border-gray-200">
                                <p className="text-xs text-gray-500 font-munika mb-3">Popular searches:</p>
                                <div className="flex flex-wrap gap-2">
                                    {["Plastic surgery", "Dentistry", "Hair transplant", "Medical booking"].map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => handleSearch(tag)}
                                            className="px-3 py-1.5 bg-white text-gray-700 rounded-full text-sm font-munika hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-200"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// Composant Mobile Menu
const MobileMenu = ({ isOpen, setIsOpen, openDropdown, setOpenDropdown, isAuthenticated, userName, userEmail, handleLogout, navigate }) => {
    const { t } = useTranslation();
    const signupOptions = [
        {
            label: t("Sign up as Patient"),
            path: "https://medplas.vercel.app/#/signup",
            icon: <FiUser className="text-blue-500" />,
            description: "For patients seeking care"
        },
        {
            label: t("Sign up as Doctor"),
            path: "https://topg255-medplas-wehp.vercel.app/#/signup",
            icon: <FaUserMd className="text-green-500" />,
            description: "For medical professionals"
        },
        {
            label: t("Sign up as Clinic"),
            path: "https://topg255-medplas-h4kr.vercel.app/#/signup",
            icon: <FaHospital className="text-purple-500" />,
            description: "For medical facilities"
        },
        {
            label: t("Sign up as Ref Doctor"),
            path: "https://topg255-medplas-s6dy.vercel.app/",
            icon: <FaUserTie className="text-orange-500" />,
            description: "For referring physicians"
        }
    ];

    const loginOptions = [
        {
            label: t("Login as Patient"),
            path: "https://medplas.vercel.app/#/login_patient",
            icon: <FiUser className="text-blue-500" />,
            description: "Access patient portal"
        },
        {
            label: t("Login as Doctor"),
            path: "https://topg255-medplas-wehp.vercel.app/",
            icon: <FaUserMd className="text-green-500" />,
            description: "Access medical dashboard"
        },
        {
            label: t("Login as Clinic"),
            path: "https://topg255-medplas-h4kr.vercel.app/",
            icon: <FaHospital className="text-purple-500" />,
            description: "Manage clinic operations"
        },
        {
            label: t("Login as Ref Doctor"),
            path: "https://topg255-medplas-s6dy.vercel.app/#/login_RefDoctor",
            icon: <FaUserTie className="text-orange-500" />,
            description: "Referral management"
        }
    ];


    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-[9998] md:hidden"
                        onClick={() => setIsOpen(false)}
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-[85vw] sm:w-96 max-w-md h-screen bg-white shadow-2xl z-[9999] md:hidden flex flex-col overflow-hidden"
                    >
                        <div className="flex-shrink-0 bg-white z-10 p-4 border-b border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-blue-600 font-bump">PlasFora</span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    aria-label="Close menu"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 pb-6">
                            <nav className="space-y-1.5">
                                <a
                                    href="http://localhost:3020/"
                                    className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg font-bump text-sm sm:text-base hover:bg-blue-700 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <FiHome size={18} />
                                    {t('Home')}
                                </a>

                                {menuItems.map((item) => (
                                    <div key={item.id} className="border-b border-gray-100 pb-1.5">
                                        <button
                                            className="flex items-center justify-between w-full px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 hover:bg-blue-50 rounded-lg font-munika text-sm sm:text-base transition-colors"
                                            onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                                        >
                                            <span className="font-medium">{item.label}</span>
                                            <FiChevronDown
                                                className={`transform transition-transform flex-shrink-0 ${openDropdown === item.id ? "rotate-180" : ""}`}
                                                size={18}
                                            />
                                        </button>

                                        <AnimatePresence>
                                            {openDropdown === item.id && item.options && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="ml-2 sm:ml-4 mt-1 space-y-0.5"
                                                >
                                                    {item.options.map((option) => (
                                                        <div key={option.label}>
                                                            {option.onClick ? (
                                                                <button
                                                                    onClick={() => {
                                                                        option.onClick();
                                                                        setIsOpen(false);
                                                                        setOpenDropdown(null);
                                                                    }}
                                                                    className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                >
                                                                    <span className="flex-shrink-0">{option.icon}</span>
                                                                    <span className="text-left">{option.label}</span>
                                                                </button>
                                                            ) : (
                                                                <a
                                                                    href={option.path}
                                                                    className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    onClick={() => setIsOpen(false)}
                                                                >
                                                                    <span className="flex-shrink-0">{option.icon}</span>
                                                                    <span className="text-left">{option.label}</span>
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </nav>

                            <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                                {isAuthenticated ? (
                                    <div className="space-y-3">
                                        <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                            <div className="flex items-center gap-2 sm:gap-3 mb-3">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                                                    {userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase() : "U"}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">{userName}</div>
                                                    <div className="text-xs sm:text-sm text-gray-600 truncate">{userEmail}</div>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <button
                                                    onClick={() => {
                                                        navigate("/dashboard");
                                                        setIsOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2 text-gray-700 hover:bg-white rounded-lg text-xs sm:text-sm transition-colors"
                                                >
                                                    <FiUser className="text-blue-600 flex-shrink-0" size={16} />
                                                    <span>My Dashboard</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigate("/appointments");
                                                        setIsOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2 text-gray-700 hover:bg-white rounded-lg text-xs sm:text-sm transition-colors"
                                                >
                                                    <FiCalendar className="text-blue-600 flex-shrink-0" size={16} />
                                                    <span>Make Appointment</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        navigate("/profile");
                                                        setIsOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2 text-gray-700 hover:bg-white rounded-lg text-xs sm:text-sm transition-colors"
                                                >
                                                    <FiSettings className="text-gray-600 flex-shrink-0" size={16} />
                                                    <span>Settings</span>
                                                </button>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-xs sm:text-sm transition-colors mt-2"
                                                >
                                                    <FiLogOut className="text-red-600 flex-shrink-0" size={16} />
                                                    <span>Sign out</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2.5">
                                        <div className="grid grid-cols-2 gap-2">
                                            {loginOptions.map((option) => (
                                                <a
                                                    key={option.label}
                                                    href={option.path}
                                                    className="flex flex-col items-center p-2.5 sm:p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors min-h-[70px]"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <span className="mb-1">{option.icon}</span>
                                                    <span className="text-[10px] sm:text-xs text-center font-medium leading-tight">
                                                        {option.label.replace('Login as ', '')}
                                                    </span>
                                                </a>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                                            {signupOptions.map((option) => (
                                                <a
                                                    key={option.label}
                                                    href={option.path}
                                                    className="flex flex-col items-center p-2.5 sm:p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors min-h-[70px]"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <span className="mb-1">{option.icon}</span>
                                                    <span className="text-[10px] sm:text-xs text-center font-medium leading-tight">
                                                        {option.label.replace('Sign up as ', '')}
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const DropdownMenu = ({ id, label, openDropdown, setOpenDropdown, options }) => {
    const isOpen = openDropdown === id;
    const { t } = useTranslation();
     // Ajoutez cette ligne


    return (
        <div
            className="relative"
            onMouseEnter={() => setOpenDropdown(id)}
            onMouseLeave={() => setOpenDropdown(null)}
        >
            <motion.button
                className={`flex items-center gap-1 px-4 py-2 rounded-md font-munika transition-all text-sm ${isOpen
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/50"
                    }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span>{label}</span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="text-blue-500"
                >
                    {isOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                </motion.span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-white shadow-xl rounded-lg border border-blue-100 z-50"
                    >
                        <div className="p-2">
                            {options.map((option) => (
                                <div key={option.label} className="mb-1 last:mb-0">
                                    {option.onClick ? (
                                        <button
                                            onClick={() => {
                                                option.onClick();
                                                setOpenDropdown(null);
                                            }}
                                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md transition-colors"
                                        >
                                            {option.icon}
                                            <span className="font-medium">{option.label}</span>
                                        </button>
                                    ) : (
                                        <a
                                            href={option.path}
                                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md transition-colors"
                                            onClick={() => setOpenDropdown(null)}
                                        >
                                            {option.icon}
                                            <span className="font-medium">{option.label}</span>
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const LoginDropdown = ({ openDropdown, setOpenDropdown }) => {
    const isOpen = openDropdown === "login";
    const { t } = useTranslation();
     const signupOptions = [
        {
            label: t("Sign up as Patient"),
            path: "http://localhost:3021/patient",
            icon: <FiUser className="text-blue-500" />,
            description: "For patients seeking care"
        },
        {
            label: t("Sign up as Doctor"),
            path: "http://localhost:3023/?type=doctor",
            icon: <FaUserMd className="text-green-500" />,
            description: "For medical professionals"
        },
        {
            label: t("Sign up as Clinic"),
            path: "http://localhost:3022/?type=clinic",
            icon: <FaHospital className="text-purple-500" />,
            description: "For medical facilities"
        },
        {
            label: t("Sign up as Ref Doctor"),
            path: "http://localhost:3024/?type=ref_doctor",
            icon: <FaUserTie className="text-orange-500" />,
            description: "For referring physicians"
        }
    ];

    const loginOptions = [
        {
            label: t("Login as Patient"),
            path: "http://localhost:3021/#/login_patient",
            icon: <FiUser className="text-blue-500" />,
            description: "Access patient portal"
        },
        {
            label: t("Login as Doctor"),
            path: "http://localhost:3023/#/login_medecin",
            icon: <FaUserMd className="text-green-500" />,
            description: "Access medical dashboard"
        },
        {
            label: t("Login as Clinic"),
            path: "http://localhost:3022/#/login_clinic",
            icon: <FaHospital className="text-purple-500" />,
            description: "Manage clinic operations"
        },
        {
            label: t("Login as Ref Doctor"),
            path: "http://localhost:3024/#/login_RefDoctor",
            icon: <FaUserTie className="text-orange-500" />,
            description: "Referral management"
        }
    ];

    return (
        <div
            className="relative"
            onMouseEnter={() => setOpenDropdown("login")}
            onMouseLeave={() => setOpenDropdown(null)}
        >
            <motion.button
                className={`flex items-center gap-2 text-sm font-semibold px-3 py-2 lg:px-4 lg:py-2 rounded-lg transition-all ${isOpen
                    ? "text-blue-600 bg-white/20 shadow-lg backdrop-blur-md"
                    : "text-white hover:text-blue-200 hover:bg-white/10"
                    }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <FiLogIn size={16} />
                <span className="hidden sm:inline">{t("Log in")}</span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="text-current"
                >
                    <FiChevronDown size={14} />
                </motion.span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        exit={{ scaleY: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-2 right-0 w-72 bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100 z-50"
                        style={{ originY: 0 }}
                    >
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900 font-munika text-base flex items-center gap-2">
                                <FiLogIn className="text-blue-600" />
                                {t("Login Options")}
                            </h3>
                            <p className="text-sm text-gray-600 font-munika mt-1">
                                {t("Select your account type to continue")}
                            </p>
                        </div>

                        <div className="p-2">
                            {loginOptions.map((option) => (
                                <motion.button
                                    key={option.label}
                                    whileHover={{ x: 4 }}
                                    className="w-full flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-blue-50 rounded-lg text-sm font-munika transition-all group"
                                    onClick={() => {
                                        window.location.href = option.path;
                                        setOpenDropdown(null);
                                    }}
                                >
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors shadow-sm">
                                        {option.icon}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="font-medium text-gray-900">{option.label}</div>
                                        <div className="text-xs text-gray-500">{option.description}</div>
                                    </div>
                                    <FiArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors" size={16} />
                                </motion.button>
                            ))}
                        </div>

                        <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
                            <p className="text-xs text-gray-500 font-munika">
                                {t('Join with us')},{" "}
                                <a className="text-blue-600 hover:text-blue-700 font-medium">
                                    {t('PlasFora')}
                                </a>
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SignupDropdown = ({ openDropdown, setOpenDropdown }) => {
    const isOpen = openDropdown === "signup";
    const { t } = useTranslation();
     const signupOptions = [
        {
            label: t("Sign up as Patient"),
            path: "http://localhost:3021/patient",
            icon: <FiUser className="text-blue-500" />,
            description: "For patients seeking care"
        },
        {
            label: t("Sign up as Doctor"),
            path: "http://localhost:3023/?type=doctor",
            icon: <FaUserMd className="text-green-500" />,
            description: "For medical professionals"
        },
        {
            label: t("Sign up as Clinic"),
            path: "http://localhost:3022/?type=clinic",
            icon: <FaHospital className="text-purple-500" />,
            description: "For medical facilities"
        },
        {
            label: t("Sign up as Ref Doctor"),
            path: "http://localhost:3024/?type=ref_doctor",
            icon: <FaUserTie className="text-orange-500" />,
            description: "For referring physicians"
        }
    ];

    

    return (
        <div
            className="relative"
            onMouseEnter={() => setOpenDropdown("signup")}
            onMouseLeave={() => setOpenDropdown(null)}
        >
            <motion.button
                className={`flex items-center gap-2 text-sm font-semibold px-3 py-2 lg:px-4 lg:py-2 rounded-full transition-all shadow-lg hover:shadow-xl ${isOpen
                    ? "text-white bg-blue-700"
                    : "text-white bg-blue-600 hover:bg-blue-700"
                    }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <FiUserPlus size={16} />
                <span className="hidden sm:inline">{t("Join Us")}</span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="text-white/80"
                >
                    <FiChevronDown size={14} />
                </motion.span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        exit={{ scaleY: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-2 right-0 w-72 bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100 z-50"
                        style={{ originY: 0 }}
                    >
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900 font-munika text-base flex items-center gap-2">
                                <FiUserPlus className="text-blue-600" />
                                {t("Signup Options")}
                            </h3>
                            <p className="text-sm text-gray-600 font-munika mt-1">
                                {t("Select the option that best describes you")}
                            </p>
                        </div>

                        <div className="p-2">
                            {signupOptions.map((option) => (
                                <motion.button
                                    key={option.label}
                                    whileHover={{ x: 4 }}
                                    className="w-full flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-blue-50 rounded-lg text-sm font-munika transition-all group"
                                    onClick={() => {
                                        window.location.href = option.path;
                                        setOpenDropdown(null);
                                    }}
                                >
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors shadow-sm">
                                        {option.icon}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="font-medium text-gray-900">{option.label}</div>
                                        <div className="text-xs text-gray-500">{option.description}</div>
                                    </div>
                                    <FiArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors" size={16} />
                                </motion.button>
                            ))}
                        </div>

                        <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
                            <p className="text-xs text-gray-500 font-munika">
                                {t('Join with us,')}{" "}
                                <a className="text-blue-600 hover:text-blue-700 font-medium">
                                    {t('PlasFora')}
                                </a>
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const UserProfileDropdown = ({ openDropdown, setOpenDropdown, userName, userEmail }) => {
    const isOpen = openDropdown === "userProfile";
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("insurance");
        localStorage.removeItem("age");
        window.location.reload();
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join("");
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => setOpenDropdown("userProfile")}
            onMouseLeave={() => setOpenDropdown(null)}
        >
            <motion.button
                className={`flex items-center gap-2 lg:gap-3 px-3 py-2 lg:px-4 lg:py-2 rounded-full transition-all ${isOpen
                    ? "bg-white/20 shadow-lg"
                    : "bg-white/10 hover:bg-white/20"
                    } backdrop-blur-md border border-white/20`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {getInitials(userName)}
                </div>

                <div className="hidden sm:flex flex-col items-start text-white">
                    <span className="text-sm font-semibold font-munika leading-none">
                        {userName || "User"}
                    </span>
                    <span className="text-xs text-white/80 font-munika leading-none mt-0.5">
                        {userEmail ? (userEmail.length > 15 ? userEmail.substring(0, 15) + "..." : userEmail) : ""}
                    </span>
                </div>

                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="text-white/80 ml-1"
                >
                    <FiChevronDown size={16} />
                </motion.span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        exit={{ scaleY: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-2 right-0 w-72 bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100 z-50"
                        style={{ originY: 0 }}
                    >
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    {getInitials(userName)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 font-munika text-base">
                                        {userName || "User"}
                                    </h3>
                                    <p className="text-sm text-gray-600 font-munika flex items-center gap-1">
                                        <FiMail size={12} />
                                        {userEmail || "No email"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-2">
                            <motion.button
                                whileHover={{ x: 4 }}
                                className="w-full flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-blue-50 rounded-lg text-sm font-munika transition-all group"
                                onClick={() => {
                                    navigate("/dashboard");
                                    setOpenDropdown(null);
                                }}
                            >
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                    <FiUser className="text-blue-600" size={16} />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-medium">My Dashboard</div>
                                    <div className="text-xs text-gray-500">View your Dashboard</div>
                                </div>
                            </motion.button>

                            <motion.button
                                whileHover={{ x: 4 }}
                                className="w-full flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-blue-50 rounded-lg text-sm font-munika transition-all group"
                                onClick={() => {
                                    navigate("/appointments");
                                    setOpenDropdown(null);
                                }}
                            >
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                    <FiCalendar className="text-blue-600" size={16} />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-medium">Make Appointment</div>
                                    <div className="text-xs text-gray-500">End to end crypted</div>
                                </div>
                            </motion.button>

                            <motion.button
                                whileHover={{ x: 4 }}
                                className="w-full flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-blue-50 rounded-lg text-sm font-munika transition-all group"
                                onClick={() => {
                                    navigate("/profile");
                                    setOpenDropdown(null);
                                }}
                            >
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                    <FiSettings className="text-gray-600" size={16} />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-medium">Settings</div>
                                    <div className="text-xs text-gray-500">Account preferences</div>
                                </div>
                            </motion.button>

                            <hr className="my-2 border-gray-100" />

                            <motion.button
                                whileHover={{ x: 4 }}
                                className="w-full flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg text-sm font-munika transition-all group"
                                onClick={handleLogout}
                            >
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                                    <FiLogOut className="text-red-600" size={16} />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-medium">Sign out</div>
                                    <div className="text-xs text-red-400">Logout from account</div>
                                </div>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const DesktopCenteredNavigation = ({ openDropdown, setOpenDropdown, onSearchClick }) => {
    const { t } = useTranslation(); // Ajoutez cette ligne

    return (
        <nav className="hidden md:flex items-center justify-center flex-1">
            <div className="bg-white/90 backdrop-blur-lg rounded-full px-6 py-3 shadow-lg">
                <ul className="flex items-center space-x-1 lg:space-x-2">
                    <li>
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="http://localhost:3020/"
                            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-full font-bump text-sm"
                        >
                            <FiHome className="mr-2" />
                            {t('Home')}
                        </motion.a>
                    </li>

                    <li>
                        <DropdownMenu
                            id="specialties"
                            label={t("Specialties")}
                            options={menuItems.find(item => item.id === "specialties")?.options || []}
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                        />
                    </li>

                    <li>
                        <DropdownMenu
                            id="services"
                            label={t("Services")}
                            options={menuItems.find(item => item.id === "services")?.options || []}
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                        />
                    </li>

                    <li>
                        <DropdownMenu
                            id="resources"
                            label={t("Resources")}
                            options={menuItems.find(item => item.id === "resources")?.options || []}
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                        />
                    </li>

                    <li>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onSearchClick}
                            className="flex items-center gap-2 px-4 py-2 rounded-full font-munika transition-all text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                        >
                            <FiSearch size={18} />
                        </motion.button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export const Curved = () => {
    const DesktopCenteredNavigation = ({ openDropdown, setOpenDropdown, onSearchClick }) => {
        const { t } = useTranslation(); // Ajoutez cette ligne

        return (
            <nav className="hidden md:flex items-center justify-center flex-1">
                <div className="bg-white/90 backdrop-blur-lg rounded-full px-6 py-3 shadow-lg">
                    <ul className="flex items-center space-x-1 lg:space-x-2">
                        <li>
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href="http://localhost:3020/"
                                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-full font-bump text-sm"
                            >
                                <FiHome className="mr-2" />
                                {t('Home')}
                            </motion.a>
                        </li>

                        <li>
                            <DropdownMenu
                                id="specialties"
                                label={t("Specialties")}
                                options={menuItems.find(item => item.id === "specialties")?.options || []}
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                            />
                        </li>

                        <li>
                            <DropdownMenu
                                id="services"
                                label={t("Services")}
                                options={menuItems.find(item => item.id === "services")?.options || []}
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                            />
                        </li>

                        <li>
                            <DropdownMenu
                                id="resources"
                                label={t("Resources")}
                                options={menuItems.find(item => item.id === "resources")?.options || []}
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                            />
                        </li>

                        <li>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onSearchClick}
                                className="flex items-center gap-2 px-4 py-2 rounded-full font-munika transition-all text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                            >
                                <FiSearch size={18} />
                            </motion.button>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    };
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const menuItems = [
        {
            id: "specialties",
            label: "Specialties",
            hasDropdown: true,
            options: [
                { label: t("Plastic surgery"), path: "http://localhost:3031/", icon: <FaCut className="text-blue-500" /> },
                {
                    label: t("Dentistry"),
                    path: "http://localhost:3070/",
                    icon: <FaTooth className="text-blue-500" />,
                    onClick: () => {
                        const accessToken = localStorage.getItem("accessToken");
                        const refreshToken = localStorage.getItem("refreshToken");
                        const user = {
                            name: localStorage.getItem("userName"),
                            email: localStorage.getItem("userEmail"),
                            insurance: localStorage.getItem("insurance"),
                            age: localStorage.getItem("age")
                        };
                        const targetWindow = window.open("http://localhost:3070", "_blank");
                        const interval = setInterval(() => {
                            targetWindow?.postMessage({ accessToken, refreshToken, user }, "http://localhost:3070");
                        }, 500);
                        setTimeout(() => clearInterval(interval), 4000);
                    }
                },
                { label: t("IVF"), path: "http://localhost:3029/", icon: <FaBaby className="text-blue-500" /> },
                { label: t("Healthy holiday"), path: "http://localhost:3030/", icon: <FaClinicMedical className="text-blue-500" /> },
                {
                    label: t("Hair transplant"),
                    path: "http://localhost:3028/",
                    icon: <FaCut className="text-blue-500" />,
                    onClick: () => {
                        const accessToken = localStorage.getItem("accessToken");
                        const refreshToken = localStorage.getItem("refreshToken");
                        const user = {
                            name: localStorage.getItem("userName"),
                            email: localStorage.getItem("userEmail"),
                            insurance: localStorage.getItem("insurance"),
                            age: localStorage.getItem("age")
                        };
                        const targetWindow = window.open("http://localhost:3028", "_blank");
                        const interval = setInterval(() => {
                            targetWindow?.postMessage({ accessToken, refreshToken, user }, "http://localhost:3028");
                        }, 500);
                        setTimeout(() => clearInterval(interval), 4000);
                    }
                }
            ]
        },
        {
            id: "services",
            label: "Services",
            hasDropdown: true,
            options: [
                { label: t("Medical booking"), path: "http://localhost:3010/", icon: <FaCalendarAlt className="text-blue-500" /> },
                { label: t("Travel assistant"), path: "http://localhost:3011/", icon: <FaPlane className="text-blue-500" /> },
                { label: t("Additional services"), path: "http://localhost:3012/", icon: <FaPlus className="text-blue-500" /> }
            ]
        },
        {
            id: "resources",
            label: "Resources",
            hasDropdown: true,
            options: [
                { label: t("Visit Tunisia"), path: "http://localhost:3013/", icon: <FaGlobeAfrica className="text-blue-500" /> },
                { label: t("WikiMed"), path: "http://localhost:3014/", icon: <FaBookMedical className="text-blue-500" /> },
                { label: t("Blogs"), path: "http://localhost:3015/", icon: <FaBlog className="text-blue-500" /> }
            ]
        }
    ];

    // Composant de recherche
    const SearchComponent = ({ isOpen, setIsOpen }) => {
        const [searchQuery, setSearchQuery] = useState("");
        const [searchResults, setSearchResults] = useState([]);

        useEffect(() => {
            if (isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'unset';
                setSearchQuery("");
                setSearchResults([]);
            }
            return () => {
                document.body.style.overflow = 'unset';
            };
        }, [isOpen]);

        const handleSearch = (query) => {
            setSearchQuery(query);

            if (query.trim() === "") {
                setSearchResults([]);
                return;
            }

            // Recherche dans toutes les options de menu
            const allOptions = menuItems.flatMap(item =>
                item.options.map(option => ({
                    ...option,
                    category: item.label
                }))
            );

            const filtered = allOptions.filter(option =>
                option.label.toLowerCase().includes(query.toLowerCase())
            );

            setSearchResults(filtered);
        };

        return (
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-[9998]"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Search Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-[9999] overflow-hidden"
                        >
                            {/* Search Header */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
                                <div className="flex items-center gap-4">
                                    <FiSearch className="text-blue-600 flex-shrink-0" size={24} />
                                    <input
                                        type="text"
                                        placeholder="Search for specialties, services, or resources..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="flex-1 bg-white px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none font-munika text-gray-700 placeholder-gray-400"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 rounded-lg hover:bg-white transition-colors flex-shrink-0"
                                        aria-label="Close search"
                                    >
                                        <FiX size={24} className="text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Search Results */}
                            <div className="max-h-[60vh] overflow-y-auto p-4">
                                {searchQuery === "" ? (
                                    <div className="text-center py-12">
                                        <FiSearch className="mx-auto text-gray-300 mb-4" size={48} />
                                        <p className="text-gray-500 font-munika">
                                            Start typing to search for specialties, services, or resources
                                        </p>
                                    </div>
                                ) : searchResults.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 font-munika">
                                            No results found for "<span className="font-semibold">{searchQuery}</span>"
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-500 font-munika mb-3">
                                            Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                                        </p>
                                        {searchResults.map((result, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                {result.onClick ? (
                                                    <button
                                                        onClick={() => {
                                                            result.onClick();
                                                            setIsOpen(false);
                                                        }}
                                                        className="w-full flex items-center gap-4 p-4 bg-white hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all group"
                                                    >
                                                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors flex-shrink-0">
                                                            {result.icon}
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                            <div className="font-semibold text-gray-900 font-munika">
                                                                {result.label}
                                                            </div>
                                                            <div className="text-sm text-gray-500 font-munika">
                                                                {result.category}
                                                            </div>
                                                        </div>
                                                        <FiArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" size={20} />
                                                    </button>
                                                ) : (
                                                    <a
                                                        href={result.path}
                                                        onClick={() => setIsOpen(false)}
                                                        className="w-full flex items-center gap-4 p-4 bg-white hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all group"
                                                    >
                                                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors flex-shrink-0">
                                                            {result.icon}
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                            <div className="font-semibold text-gray-900 font-munika">
                                                                {result.label}
                                                            </div>
                                                            <div className="text-sm text-gray-500 font-munika">
                                                                {result.category}
                                                            </div>
                                                        </div>
                                                        <FiArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" size={20} />
                                                    </a>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Quick Links */}
                            {searchQuery === "" && (
                                <div className="bg-gray-50 p-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 font-munika mb-3">Popular searches:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {["Plastic surgery", "Dentistry", "Hair transplant", "Medical booking"].map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => handleSearch(tag)}
                                                className="px-3 py-1.5 bg-white text-gray-700 rounded-full text-sm font-munika hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-200"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        );
    };


    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("accessToken");
            const name = localStorage.getItem("userName");
            const email = localStorage.getItem("userEmail");

            setIsAuthenticated(!!token);
            setUserName(name || "");
            setUserEmail(email || "");
        };

        checkAuth();
        window.addEventListener("storage", checkAuth);

        return () => {
            window.removeEventListener("storage", checkAuth);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY === 0) setShowNavbar(true);
            else if (window.scrollY > lastScrollY) setShowNavbar(false);
            else setShowNavbar(false);
            setLastScrollY(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("insurance");
        localStorage.removeItem("age");
        window.location.reload();
    };

    // Ajout du sélecteur de langue
    const LanguageSelector = () => (
        <div className="flex items-center space-x-2">
            {["en", "fr", "ar"].map((lng) => (
                <button
                    key={lng}
                    onClick={() => i18n.changeLanguage(lng)}
                    className={`px-2 py-1 rounded ${i18n.language === lng ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}
                >
                    {lng.toUpperCase()}
                </button>
            ))}
        </div>
    );

    return (
        <div className="relative w-full flex flex-col min-h-screen overflow-x-hidden">
            {/* Ajout du sélecteur de langue en haut à droite */}


            <div className="relative w-full h-screen min-h-[600px] sm:min-h-[700px] md:h-[80vh] md:min-h-[500px] lg:min-h-[600px]">
                <video
                    src={Da}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

                <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                    <div className="flex items-center justify-between px-4 py-3">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="text-white text-xl font-bold font-bump">
                                PlasFora
                            </div>
                        </motion.div>

                        <button
                            className="p-2.5 text-white bg-white/20 rounded-lg backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/30 transition-colors active:scale-95"
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <FiMenu size={24} />
                        </button>
                    </div>
                </div>

                <header className={`hidden md:block fixed -top-6 left-0 right-0 w-full z-50 transition-all duration-500 ease-in-out ${showNavbar ? "top-0 opacity-100" : "-top-20 opacity-0"
                    }`}>
                    <motion.div
                        initial={{ y: -100 }}
                        animate={{ y: showNavbar ? 0 : -100 }}
                        transition={{ type: "spring", damping: 20 }}
                        className="w-full bg-transparent"
                    >
                        <div className="container mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">

                            <div className="flex items-center w-1/4">
                                {/* Logo PlasFora en image */}
                                <img
                                    src={Logo} // Chemin vers votre image logo
                                    alt="PlasFora Medical Tourism"
                                    className="h-36 w-auto object-contain" // Ajustez la hauteur selon vos besoins
                                    onError={(e) => {
                                        // Fallback si l'image ne charge pas
                                        e.target.style.display = 'none';
                                        const fallback = document.createElement('div');
                                        fallback.className = 'text-white text-xl font-bold font-bump';
                                        fallback.textContent = 'PlasFora';
                                        e.target.parentNode.appendChild(fallback);
                                    }}
                                />
                            </div>

                            <div className="flex-1 flex justify-center">
                                <DesktopCenteredNavigation
                                    openDropdown={openDropdown}
                                    setOpenDropdown={setOpenDropdown}
                                    onSearchClick={() => setIsSearchOpen(true)}
                                />
                            </div>

                            <div className="flex items-center justify-end w-1/4 space-x-3">
                                {isAuthenticated ? (
                                    <UserProfileDropdown
                                        openDropdown={openDropdown}
                                        setOpenDropdown={setOpenDropdown}
                                        userName={userName}
                                        userEmail={userEmail}
                                    />
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <LoginDropdown
                                            openDropdown={openDropdown}
                                            setOpenDropdown={setOpenDropdown}
                                        />
                                        <SignupDropdown
                                            openDropdown={openDropdown}
                                            setOpenDropdown={setOpenDropdown}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </header>

                <MobileMenu
                    isOpen={isMobileMenuOpen}
                    setIsOpen={setIsMobileMenuOpen}
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                    isAuthenticated={isAuthenticated}
                    userName={userName}
                    userEmail={userEmail}
                    handleLogout={handleLogout}
                    navigate={navigate}
                />

                <SearchComponent
                    isOpen={isSearchOpen}
                    setIsOpen={setIsSearchOpen}
                />

                <div className="relative w-full h-full flex items-center">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-32 max-w-7xl mx-auto">
                            <div className="w-full lg:w-2/3 xl:w-1/2 text-white">
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bump leading-tight mb-4 sm:mb-5 lg:mb-6"
                                >
                                    <FiActivity className="inline mr-2 lg:mr-3 text-blue-400 mb-1 lg:mb-2" size={28} />
                                    {t('headline')}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 font-bump leading-relaxed"
                                >
                                    <FiHeart className="inline mr-2 text-red-400 mb-1" size={20} />
                                    {t('subheadline')}
                                </motion.p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-[#1a1440] text-white py-4 sm:py-5 text-center px-4">
                <h2 className="text-base sm:text-lg md:text-xl font-bold font-bump mb-2">
                    {t('explore_ai')}
                </h2>
                <a
                    href="http://localhost:3016/"
                    className="inline-flex items-center gap-2 text-white font-bump underline hover:text-gray-300 transition-colors text-sm sm:text-base"
                >
                    <motion.span
                        initial={{ x: 0 }}
                        whileHover={{ x: 8 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="flex items-center gap-2"
                    >
                        {t('learn_more')} <FiArrowRight />
                    </motion.span>
                </a>
            </div>
        </div>
    );
};

export default Curved