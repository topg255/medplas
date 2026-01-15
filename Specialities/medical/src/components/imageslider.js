"use client";
import { cn } from "../../public/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

export const ImagesSlider = ({
    images,
    children,
    overlay = true,
    overlayClassName,
    className,
    autoplay = true,
    direction = "up",
    containerHeight = "30rem", // Hauteur par défaut en REM (modifiable)
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState([]);

    useEffect(() => {
        const loadImages = () => {
            const loadPromises = images.map((image) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = image;
                    img.onload = () => resolve(image);
                    img.onerror = reject;
                });
            });

            Promise.all(loadPromises)
                .then((loaded) => setLoadedImages(loaded))
                .catch((error) => console.error("Failed to load images", error));
        };

        loadImages();
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "ArrowRight") setCurrentIndex((prev) => (prev + 1) % images.length);
            if (event.key === "ArrowLeft") setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        };

        window.addEventListener("keydown", handleKeyDown);

        let interval;
        if (autoplay) {
            interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length);
            }, 3000);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            clearInterval(interval);
        };
    }, [autoplay, images.length]);

    const slideVariants = {
        initial: { scale: 0, opacity: 0, rotateX: 45 },
        visible: { scale: 1, rotateX: 0, opacity: 1, transition: { duration: 0.5, ease: [0.645, 0.045, 0.355, 1.0] } },
        exit: { opacity: 0, y: direction === "up" ? "-100%" : "100%", transition: { duration: 1 } },
    };

    return (
        <div
            className={cn("overflow-hidden w-full rounded-lg relative flex items-center justify-center z-10" , className)}
            style={{ height: containerHeight }} //Ici on force la hauteur
        >
            {loadedImages.length > 0 && children}
            {loadedImages.length > 0 && overlay && (
                <div className={cn("absolute inset-0 bg-black/60 z-40", overlayClassName)} />
            )}
            {loadedImages.length > 0 && (
                <AnimatePresence>
                    <motion.img
                        key={currentIndex}
                        src={loadedImages[currentIndex]}
                        initial="initial"
                        animate="visible"
                        exit="exit"
                        variants={slideVariants}
                        className="h-full w-full absolute inset-0 object-cover object-center"
                    />
                </AnimatePresence>
            )}
        </div>
    );
};
