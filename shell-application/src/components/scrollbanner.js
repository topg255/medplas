import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const InfiniteScrollBanner = () => {
    const [scrollDirection, setScrollDirection] = useState(1);
    const [isPaused, setIsPaused] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const containerRef = useRef(null);
    const firstRowRef = useRef(null);
    const secondRowRef = useRef(null);

    useEffect(() => {
        const animateScroll = () => {
            if (!containerRef.current || !firstRowRef.current || !secondRowRef.current || isPaused) return;

            const firstRow = firstRowRef.current;
            const secondRow = secondRowRef.current;

            if (firstRow.scrollLeft >= (firstRow.scrollWidth - firstRow.clientWidth - 5) && scrollDirection === 1) {
                setScrollDirection(-1);
            } else if (firstRow.scrollLeft <= 5 && scrollDirection === -1) {
                setScrollDirection(1);
            }

            firstRow.scrollLeft += scrollDirection;
            secondRow.scrollLeft += scrollDirection * -0.7;
        };

        const interval = setInterval(animateScroll, 20);
        return () => clearInterval(interval);
    }, [scrollDirection, isPaused]);

    const medicalServices = {
        row1: [
            { id: 1, name: "Plastic Surgery", href: "/plastic-surgery", icon: "✨" },
            { id: 2, name: "Dentistry", href: "/dentistry", icon: "🦷" },
            { id: 3, name: "IVF", href: "/ivf", icon: "👶" },
            { id: 4, name: "Hair Transplant", href: "/hair-transplant", icon: "💇" },
            { id: 5, name: "Healthy Holiday", href: "/healthy-holiday", icon: "🏝️" },
            { id: 6, name: "Blogs", href: "/blogs", icon: "📝" },
        ],
        row2: [
            { id: 7, name: "WikiMed", href: "/wikimed", icon: "🔍" },
            { id: 8, name: "Medical Booking", href: "/medical-booking", icon: "📅" },
            { id: 9, name: "Travel Assistant", href: "/travel-assistant", icon: "✈️" },
            { id: 10, name: "Additional Services", href: "/additional-services", icon: "➕" },
            { id: 11, name: "Visit Tunisia", href: "/visit-tunisia", icon: "🏛️" },
        ]
    };

    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);

    return (
        <div className="relative w-full perspective-1000 my-16">
            {/* Premium 3D angled container with glass effect */}
            <motion.div 
                ref={containerRef} 
                className="w-full bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md py-12 px-2 shadow-2xl rounded-xl overflow-hidden border border-white/20"
                style={{ 
                    transform: "perspective(1000px) rotateX(-5deg)",
                    transformStyle: "preserve-3d",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 -5px 20px rgba(255, 255, 255, 0.7)"
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Top glow */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-blue-200/30 to-transparent" />

                {/* Top animated separator with shimmer effect */}
                <div className="relative h-1 w-full overflow-hidden">
                    <motion.div
                        className="w-full h-full bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400"
                        initial={{ backgroundPosition: "0% 0%" }}
                        animate={{ backgroundPosition: "100% 0%" }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        style={{ backgroundSize: "200% 100%" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-transparent to-white/50" />
                </div>

                {/* First row with perspective */}
                <div
                    ref={firstRowRef}
                    className="flex items-center py-10 px-8 overflow-x-hidden whitespace-nowrap"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{ 
                        transform: "perspective(1000px) translateZ(20px)"
                    }}
                >
                    {[...medicalServices.row1, ...medicalServices.row1].map((service, index) => (
                        <motion.a
                            key={`${service.id}-${index}`}
                            href={service.href}
                            className="mx-10 flex items-center group relative"
                            onMouseEnter={() => setHoveredItem(`row1-${service.id}-${index}`)}
                            onMouseLeave={() => setHoveredItem(null)}
                            whileHover={{ scale: 1.08, y: -5 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {/* Icon with circular background */}
                            <motion.div 
                                className="mr-3 w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 shadow-md"
                                initial={{ opacity: 0.9, rotate: 0 }}
                                whileHover={{ opacity: 1, rotate: 10, scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="text-lg">{service.icon}</span>
                            </motion.div>
                            
                            <motion.div className="relative">
                                <motion.span
                                    className="text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-600 transition-all duration-300"
                                    style={{ 
                                        textShadow: "0 1px 2px rgba(0,0,0,0.05)"
                                    }}
                                >
                                    {service.name}
                                </motion.span>
                                
                                {/* Animated underline */}
                                <motion.div 
                                    className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"
                                    initial={{ width: "0%" }}
                                    animate={{ 
                                        width: hoveredItem === `row1-${service.id}-${index}` ? "100%" : "0%" 
                                    }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.div>
                            
                            {/* Animated arrow */}
                            <motion.div
                                className="ml-3 text-blue-500"
                                initial={{ x: -5, opacity: 0 }}
                                animate={{ 
                                    x: hoveredItem === `row1-${service.id}-${index}` ? 0 : -5,
                                    opacity: hoveredItem === `row1-${service.id}-${index}` ? 1 : 0
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                                </svg>
                            </motion.div>
                            
                            {/* Hover glow effect */}
                            {hoveredItem === `row1-${service.id}-${index}` && (
                                <motion.div 
                                    className="absolute -inset-4 bg-blue-100/30 rounded-xl blur-xl -z-10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}
                        </motion.a>
                    ))}
                </div>

                {/* Middle separator with shimmer effect */}
                <div className="relative h-1 w-full overflow-hidden my-2">
                    <motion.div
                        className="w-full h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
                        initial={{ backgroundPosition: "100% 0%" }}
                        animate={{ backgroundPosition: "0% 0%" }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        style={{ backgroundSize: "200% 100%" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-transparent to-white/50" />
                </div>

                {/* Second row with opposite perspective */}
                <div
                    ref={secondRowRef}
                    className="flex items-center py-10 px-8 overflow-x-hidden whitespace-nowrap"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{ 
                        transform: "perspective(1000px) translateZ(10px)"
                    }}
                >
                    {[...medicalServices.row2, ...medicalServices.row2].map((service, index) => (
                        <motion.a
                            key={`${service.id}-${index}`}
                            href={service.href}
                            className="mx-10 flex items-center group relative"
                            onMouseEnter={() => setHoveredItem(`row2-${service.id}-${index}`)}
                            onMouseLeave={() => setHoveredItem(null)}
                            whileHover={{ scale: 1.08, y: -5 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {/* Icon with circular background */}
                            <motion.div 
                                className="mr-3 w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center text-purple-600 shadow-md"
                                initial={{ opacity: 0.9, rotate: 0 }}
                                whileHover={{ opacity: 1, rotate: -10, scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="text-lg">{service.icon}</span>
                            </motion.div>
                            
                            <motion.div className="relative">
                                <motion.span
                                    className="text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-purple-600 transition-all duration-300"
                                    style={{ 
                                        textShadow: "0 1px 2px rgba(0,0,0,0.05)"
                                    }}
                                >
                                    {service.name}
                                </motion.span>
                                
                                {/* Animated underline */}
                                <motion.div 
                                    className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                                    initial={{ width: "0%" }}
                                    animate={{ 
                                        width: hoveredItem === `row2-${service.id}-${index}` ? "100%" : "0%" 
                                    }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.div>
                            
                            {/* Animated arrow */}
                            <motion.div
                                className="ml-3 text-purple-500"
                                initial={{ x: -5, opacity: 0 }}
                                animate={{ 
                                    x: hoveredItem === `row2-${service.id}-${index}` ? 0 : -5,
                                    opacity: hoveredItem === `row2-${service.id}-${index}` ? 1 : 0
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                                </svg>
                            </motion.div>
                            
                            {/* Hover glow effect */}
                            {hoveredItem === `row2-${service.id}-${index}` && (
                                <motion.div 
                                    className="absolute -inset-4 bg-purple-100/30 rounded-xl blur-xl -z-10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}
                        </motion.a>
                    ))}
                </div>

                {/* Bottom separator with shimmer effect */}
                <div className="relative h-1 w-full overflow-hidden">
                    <motion.div
                        className="w-full h-full bg-gradient-to-r from-pink-500 via-blue-500 to-pink-500"
                        initial={{ backgroundPosition: "0% 0%" }}
                        animate={{ backgroundPosition: "100% 0%" }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        style={{ backgroundSize: "200% 100%" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-transparent to-white/50" />
                </div>

                {/* Bottom glow */}
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-purple-200/30 to-transparent" />
            </motion.div>

            {/* Advanced ambient light effects */}
            <div className="absolute -inset-full pointer-events-none">
                <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-blue-200/20 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-purple-200/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/4 right-1/4 w-1/3 h-1/3 rounded-full bg-pink-200/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Edge reflections */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-b from-white/80 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-t from-white/80 to-transparent"></div>
        </div>
    );
};

export default InfiniteScrollBanner;