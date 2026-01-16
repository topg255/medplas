import React, { useState, useEffect } from "react";
import { cn } from "../utils/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Marquee } from "./testooo";
import P1 from '../assets/p1.jpg';
import P2 from '../assets/p2.jpg';
import P3 from '../assets/p3.jpg';
import P4 from '../assets/p4.jpg';
import P5 from '../assets/p5.jpg';
import { IconStarFilled, IconQuote, IconBrandTwitter, IconAB, IconHeart, IconX } from "@tabler/icons-react";

const useInView = (options = {}) => {
    const [ref, setRef] = useState(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        if (!ref) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsInView(entry.isIntersecting);
        }, options);

        observer.observe(ref);

        return () => {
            observer.disconnect();
        };
    }, [ref, options]);

    return [setRef, isInView];
};

// Enhanced review data with more engaging and varied testimonials
const reviews = [
    {
        name: "Jack Wilson",
        username: "@jack_wilson",
        body: "The attention to detail is unmatched. This experience completely transformed my expectations of what's possible.",
        img: P1,
        rating: 5,
        date: "2 days ago",
        likes: 247,
        verified: true,
        highlight: true
    },
    {
        name: "Sophia Chen",
        username: "@sophiachen",
        body: "Absolutely exceeded my expectations. The personalized approach made all the difference in my journey.",
        img: P2,
        rating: 5,
        date: "1 week ago",
        likes: 189,
        verified: true,
        highlight: false
    },
    {
        name: "Marcus Johnson",
        username: "@mjohnson",
        body: "After trying multiple alternatives, nothing comes close to this level of quality and care. Truly exceptional.",
        img: P3,
        rating: 4,
        date: "3 days ago",
        likes: 132,
        verified: false,
        highlight: true
    },
    {
        name: "Amelia Rodriguez",
        username: "@ameliar",
        body: "The results speak for themselves. I'm incredibly grateful for the expertise and support throughout my experience.",
        img: P4,
        rating: 5,
        date: "2 weeks ago",
        likes: 312,
        verified: true,
        highlight: false
    },
    {
        name: "Elena Petrov",
        username: "@elenap",
        body: "From consultation to aftercare, every step was handled with professionalism and genuine concern for my wellbeing.",
        img: P5,
        rating: 5,
        date: "5 days ago",
        likes: 276,
        verified: true,
        highlight: true
    },
    {
        name: "James Lee",
        username: "@jameslee",
        body: "The perfect blend of cutting-edge techniques and compassionate care. I couldn't have asked for better results.",
        img: P3,
        rating: 5,
        date: "1 month ago",
        likes: 421,
        verified: false,
        highlight: false
    },
    {
        name: "Maya Patel",
        username: "@mayapatel",
        body: "Worth every penny. The quality of service and attention to my specific needs was outstanding.",
        img: P1,
        rating: 5,
        date: "2 weeks ago",
        likes: 198,
        verified: true,
        highlight: false
    },
    {
        name: "Thomas Klein",
        username: "@thomask",
        body: "I was nervous at first, but the team put me completely at ease. The results are nothing short of miraculous.",
        img: P5,
        rating: 4,
        date: "3 weeks ago",
        likes: 167,
        verified: false,
        highlight: true
    },
];

const firstRow = [...reviews.slice(0, 4), ...reviews.slice(0, 2)];
const secondRow = [...reviews.slice(4), ...reviews.slice(2, 4)];

// Enhanced Review Card Component with responsive design
const ReviewCard = ({ img, name, username, body, rating, date, likes, verified, highlight, isPlayingAnimation, compact = false }) => {
    const [isHovered, setIsHovered] = useState(false);

    const cardVariants = {
        initial: { y: 0 },
        hover: { y: compact ? 0 : -8, transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] } },
    };

    const contentVariants = {
        initial: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.figure
            className={cn(
                "relative overflow-hidden rounded-2xl p-4 sm:p-5",
                "border transition-all duration-300",
                highlight
                    ? "border-blue-500/20 bg-gradient-to-br from-blue-900/90 to-indigo-900/90 shadow-lg shadow-blue-900/20"
                    : "border-gray-800/40 bg-gradient-to-br from-gray-900/90 to-gray-800/90",
                isHovered && !compact && "shadow-xl",
                compact ? "w-full" : "h-full w-full sm:w-80 lg:w-72 xl:w-80 min-w-[280px] sm:min-w-[300px]"
            )}
            variants={cardVariants}
            initial="initial"
            whileHover={compact ? "" : "hover"}
            onHoverStart={() => !compact && setIsHovered(true)}
            onHoverEnd={() => !compact && setIsHovered(false)}
        >
            {!compact && (
                <div className="absolute -right-4 -top-4 opacity-5">
                    <IconQuote size={80} />
                </div>
            )}

            <motion.div
                className="flex flex-row items-center gap-3"
                variants={contentVariants}
                initial="initial"
                animate="visible"
                transition={{ duration: 0.4 }}
            >
                <div className="relative">
                    <img
                        className={cn("rounded-full object-cover border-2", compact ? "h-10 w-10 border-blue-400/10" : "h-10 w-10 sm:h-12 sm:w-12 border-blue-400/20")}
                        alt={`${name}'s profile`}
                        src={img}
                    />
                    {verified && (
                        <div className="absolute -right-1 -bottom-1 rounded-full bg-blue-500 p-0.5">
                            <IconAB size={compact ? 10 : 12} className="text-white" />
                        </div>
                    )}
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                        <figcaption className={cn("font-bold font-bump text-white truncate", compact ? "text-xs" : "text-sm")}>
                            {name}
                        </figcaption>
                        {highlight && !compact && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring" }}
                                className="flex-shrink-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 p-0.5"
                            >
                                <IconAB size={12} className="text-blue-400" />
                            </motion.span>
                        )}
                    </div>

                    <div className="flex items-center gap-1 flex-wrap">
                        <IconBrandTwitter size={compact ? 10 : 12} className="text-blue-400 flex-shrink-0" />
                        <p className={cn("text-blue-300/70 truncate", compact ? "text-[10px]" : "text-xs")}>{username}</p>
                        <span className={cn("mx-1 text-gray-500 flex-shrink-0", compact ? "text-[10px]" : "text-xs")}>•</span>
                        <p className={cn("text-gray-400 flex-shrink-0", compact ? "text-[10px]" : "text-xs")}>{date}</p>
                    </div>

                    <div className={cn("flex", compact ? "mt-0.5" : "mt-1")}>
                        {Array(5).fill(0).map((_, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                            >
                                <IconStarFilled
                                    size={compact ? 10 : 12}
                                    className={i < rating ? "text-amber-400" : "text-gray-600"}
                                />
                            </motion.span>
                        ))}
                    </div>
                </div>
            </motion.div>

            <motion.blockquote
                className={cn("relative font-bump leading-relaxed text-gray-100 mt-3 sm:mt-4", compact ? "text-xs" : "text-sm")}
                variants={contentVariants}
                initial="initial"
                animate="visible"
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <span className="relative">
                    "{body}"
                    {highlight && isPlayingAnimation && !compact && (
                        <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent bg-clip-text"
                            initial={{ x: "-100%" }}
                            animate={{ x: "200%" }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                        />
                    )}
                </span>
            </motion.blockquote>

            <motion.div
                className={cn("flex items-center justify-between", compact ? "mt-2" : "mt-3 sm:mt-4")}
                variants={contentVariants}
                initial="initial"
                animate="visible"
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <div className="flex items-center gap-1">
                    <IconHeart size={compact ? 12 : 14} className={cn("transition-colors", isHovered ? "text-red-500" : "text-gray-400")} />
                    <span className={cn("text-gray-400", compact ? "text-[10px]" : "text-xs")}>{likes}</span>
                </div>

                {highlight && !compact && (
                    <div className="text-xs font-bump text-blue-400">Recommended</div>
                )}
            </motion.div>

            {!compact && (
                <>
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        )}
                    </AnimatePresence>

                    {highlight && (
                        <motion.div
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0.5 }}
                            transition={{ duration: 0.3 }}
                        />
                    )}
                </>
            )}
        </motion.figure>
    );
};

// New Premium Modal Component with responsive design
const ReviewsModal = ({ reviews, onClose }) => {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Backdrop */}
            <motion.div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <motion.div
                className="relative w-full max-w-full sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl h-full sm:h-auto max-h-[90vh] sm:max-h-[80vh] rounded-xl sm:rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl overflow-hidden border border-gray-700/50"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
            >
                {/* Header */}
                <div className="border-b border-gray-700/50 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl sm:text-2xl font-bold font-bump text-white truncate">Client Testimonials</h2>
                            <p className="text-blue-300/80 font-bump text-sm sm:text-base truncate">What our clients say about us</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex-shrink-0 rounded-full p-1 sm:p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors ml-2"
                        >
                            <IconX size={20} className="sm:w-6 sm:h-6" />
                        </button>
                    </div>
                </div>

                {/* Reviews Grid */}
                <div className="h-[calc(100%-120px)] sm:h-[60vh] overflow-y-auto p-3 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                        {reviews.map((review, index) => (
                            <ReviewCard key={`modal-${review.username}-${index}`} {...review} compact />
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-700/50 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 p-3 sm:p-4 text-center">
                    <p className="text-sm font-bump text-gray-400">Showing {reviews.length} reviews</p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export function MarqueeDemo() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [containerRef, isInView] = useInView({ threshold: 0.2 });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (isInView) {
            setIsPlaying(true);
        }
    }, [isInView]);

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="relative flex w-full flex-col items-center justify-center overflow-hidden py-6 sm:py-10 lg:py-12 px-4 sm:px-6"
        >
            {/* Section title */}
            <motion.div
                className="mb-6 sm:mb-8 text-center w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8 }}
            >
                <motion.span
                    className="inline-block text-sm font-bump uppercase tracking-wider text-blue-400"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    What People Are Saying
                </motion.span>

                <motion.h2
                    className="mt-2 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-bump text-blue-800"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    Client testimonials
                </motion.h2>

                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                    className="relative h-[2px] sm:h-[3px] w-32 sm:w-40 mx-auto my-6 sm:my-8"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent blur-sm" />
                </motion.div>
            </motion.div>

            {/* Enhanced marquee with gap and perspective effects */}
            <div className="w-full perspective-1000">
                <Marquee
                    pauseOnHover
                    className="[--duration:35s] [--gap:0.5rem] sm:[--gap:1rem] mb-3 sm:mb-4"
                >
                    {firstRow.map((review, index) => (
                        <div key={`${review.username}-${index}`} className="px-2 sm:px-4">
                            <ReviewCard {...review} isPlayingAnimation={isPlaying} />
                        </div>
                    ))}
                </Marquee>

                <Marquee
                    reverse
                    pauseOnHover
                    className="[--duration:45s] [--gap:0.5rem] sm:[--gap:1rem]"
                >
                    {secondRow.map((review, index) => (
                        <div key={`${review.username}-${index}`} className="px-2 sm:px-4">
                            <ReviewCard {...review} isPlayingAnimation={isPlaying} />
                        </div>
                    ))}
                </Marquee>
            </div>

            {/* Enhanced gradient overlays - responsive sizing */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-4 sm:w-8 lg:w-12 xl:w-24 bg-gradient-to-r from-white/90 via-white/60 to-transparent z-10"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-4 sm:w-8 lg:w-12 xl:w-24 bg-gradient-to-l from-white/90 via-white/60 to-transparent z-10"></div>

            {/* Bottom call to action */}
            <motion.div
                className="mt-6 sm:mt-8 text-center w-full max-w-4xl px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.9, duration: 0.6 }}
            >
                <p className="mx-auto font-bump text-base sm:text-lg text-gray-500 leading-relaxed">
                    Join thousands of satisfied clients who transformed their lives with our premium services.
                </p>

                <motion.button
                    className="mt-4 sm:mt-6 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 sm:px-8 py-2.5 sm:py-3 font-bump text-white text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all hover:shadow-xl hover:shadow-blue-600/40 w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(true)}
                >
                    Read All Reviews
                </motion.button>
            </motion.div>

            {/* Reviews Modal */}
            <AnimatePresence>
                {showModal && (
                    <ReviewsModal reviews={reviews} onClose={() => setShowModal(false)} />
                )}
            </AnimatePresence>
        </motion.div>
    );
}