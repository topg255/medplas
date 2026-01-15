import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaPlane,
    FaTooth,
    FaBaby,
    FaClinicMedical,
    FaCut,
    FaCalendarAlt,
    FaConciergeBell,
    FaHandsHelping,
    FaPlus,
    FaGlobeAfrica,
    FaBookMedical,
    FaBlog,
    FaNewspaper
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const menuItems = [
    {
        id: "specialties",
        label: "specialties",
        hasDropdown: true,
        options: [
            { label: "plastic_surgery", path: "http://localhost:3031/", icon: <FaCut className="text-yellow-500" /> },
            { label: "dentistry", path: "http://localhost:3070/", icon: <FaTooth className="text-blue-500" /> },
            { label: "ivf", path: "http://localhost:3029/", icon: <FaBaby className="text-rose-500" /> },
            { label: "healthy_holiday", path: "http://localhost:3030/", icon: <FaClinicMedical className="text-green-500" /> },
            { label: "hair_transplant", path: "http://localhost:3028/", icon: <FaCut className="text-orange-500" /> }
        ]
    },
    {
        id: "services",
        label: "services",
        hasDropdown: true,
        options: [
            { label: "medical_booking", path: "http://localhost:3010/", icon: <FaCalendarAlt className="text-yellow-500" /> },
            { label: "travel_assistance", path: "http://localhost:3011/", icon: <FaPlane className="text-yellow-500" /> },
            { label: "additional_services", path: "http://localhost:3012/", icon: <FaPlus className="text-yellow-500" /> }
        ]
    },
    {
        id: "resources",
        label: "resources",
        hasDropdown: true,
        options: [
            { label: "visit_tunisia", path: "http://localhost:3013/", icon: <FaGlobeAfrica className="text-yellow-500" /> },
            { label: "wikimed", path: "http://localhost:3014/", icon: <FaBookMedical className="text-yellow-500" /> },
            { label: "blogs", path: "http://localhost:3015/", icon: <FaBlog className="text-yellow-500" /> },
        ]
    },
];

const dropdownVariants = {
    open: {
        scaleY: 1,
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    },
    closed: {
        scaleY: 0,
        opacity: 0,
        transition: {
            duration: 0.2,
            ease: [0.22, 1, 0.36, 1]
        }
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.2,
            ease: "easeOut"
        }
    },
};

const DropdownMenu = ({ id, label, openDropdown, setOpenDropdown, options }) => {
    const { t } = useTranslation();
    const isOpen = openDropdown === id;

    return (
        <div
            className="relative"
            onMouseEnter={() => setOpenDropdown(id)}
            onMouseLeave={() => setOpenDropdown(null)}
        >
            <motion.button
                className={`flex items-center gap-1 px-4 py-2 rounded-md font-munika transition-all -z-40 ${isOpen
                    ? "text-yellow-600 bg-yellow-50 shadow-inner"
                    : "text-gray-700 hover:text-yellow-600 hover:bg-yellow-50/50"
                    }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <motion.span
                    animate={{
                        opacity: isOpen ? 1 : 0.9,
                        x: isOpen ? 0 : -3
                    }}
                    transition={{ duration: 0.3 }}
                >
                    {t(label)}
                </motion.span>
                {options && (
                    <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-yellow-500 font-munika"
                    >
                        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                    </motion.span>
                )}
            </motion.button>
            <AnimatePresence>
                {options && isOpen && (
                    <motion.ul
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={dropdownVariants}
                        className="absolute top-full mt-1 left-0 w-56 bg-white shadow-xl rounded-lg overflow-hidden p-2 pointer-events-auto border border-yellow-100 z-50"
                        style={{ originY: 0 }}
                    >
                        {options.map((option, i) => (
                            <motion.li
                                key={option.label}
                                variants={itemVariants}
                                className="px-3 py-2 text-gray-700 hover:bg-yellow-50 rounded-md transition-colors text-sm cursor-pointer font-munika"
                                whileHover={{
                                    x: 5,
                                    backgroundColor: "rgba(239, 246, 255, 1)"
                                }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Link
                                    to={option.path}
                                    className="flex items-center gap-3 w-full h-full"
                                >
                                    <span className="text-lg">{option.icon}</span>
                                    <span className="font-medium font-munika">{t(option.label)}</span>
                                </Link>
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export const StaggeredDropDown = () => {
    const { t } = useTranslation();
    const [openDropdown, setOpenDropdown] = useState(null);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 z-50">
            {menuItems.map(({ id, label, hasDropdown, options }) =>
                hasDropdown ? (
                    <DropdownMenu
                        key={id}
                        id={id}
                        label={label}
                        openDropdown={openDropdown}
                        setOpenDropdown={setOpenDropdown}
                        options={options}
                    />
                ) : (
                    <motion.button
                        key={id}
                        className="px-4 py-2 rounded-md text-gray-700 font-munika hover:text-yellow-600 hover:bg-yellow-50/50 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {t(label)}
                    </motion.button>
                )
            )}
        </div>
    );
};