import { useState, useCallback, useEffect, useRef } from "react";
import { motion, type PanInfo, AnimatePresence } from "framer-motion";

// Import all images from the carrossel folder
import post1 from "@/assets/carrossel/POST (1).webp";
import post2 from "@/assets/carrossel/POST (2).webp";
import post3 from "@/assets/carrossel/POST (3).webp";
import post4 from "@/assets/carrossel/POST (4).webp";
import post5 from "@/assets/carrossel/POST (5).webp";
import post6 from "@/assets/carrossel/POST (6).webp";
import post7 from "@/assets/carrossel/POST (7).webp";
import post8 from "@/assets/carrossel/POST (8).webp";
import post9 from "@/assets/carrossel/POST (9).webp";
import post10 from "@/assets/carrossel/POST (10).webp";
import post11 from "@/assets/carrossel/POST (11).webp";

const images = [
    { id: 1, src: post1, alt: "Cineze Post 1" },
    { id: 2, src: post2, alt: "Cineze Post 2" },
    { id: 3, src: post3, alt: "Cineze Post 3" },
    { id: 4, src: post4, alt: "Cineze Post 4" },
    { id: 5, src: post5, alt: "Cineze Post 5" },
    { id: 6, src: post6, alt: "Cineze Post 6" },
    { id: 7, src: post7, alt: "Cineze Post 7" },
    { id: 8, src: post8, alt: "Cineze Post 8" },
    { id: 9, src: post9, alt: "Cineze Post 9" },
    { id: 10, src: post10, alt: "Cineze Post 10" },
    { id: 11, src: post11, alt: "Cineze Post 11" },
];

export function VerticalImageStack() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const lastNavigationTime = useRef(0);
    const navigationCooldown = 400; // ms between navigations

    const navigate = useCallback((newDirection: number) => {
        const now = Date.now();
        if (now - lastNavigationTime.current < navigationCooldown) return;
        lastNavigationTime.current = now;

        setCurrentIndex((prev) => {
            if (newDirection > 0) {
                return prev === images.length - 1 ? 0 : prev + 1;
            }
            return prev === 0 ? images.length - 1 : prev - 1;
        });
    }, []);

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 50;
        if (info.offset.y < -threshold) {
            navigate(1);
        } else if (info.offset.y > threshold) {
            navigate(-1);
        }
    };

    const handleWheel = useCallback(
        (e: WheelEvent) => {
            // Only navigate if the mouse is over the carousel container
            // This prevents the whole page from being blocked if not intended
            // But for this specific case, we'll follow the user's reference
            if (Math.abs(e.deltaY) > 30) {
                if (e.deltaY > 0) {
                    navigate(1);
                } else {
                    navigate(-1);
                }
            }
        },
        [navigate]
    );

    useEffect(() => {
        const carouselElement = document.getElementById("vertical-carousel-container");
        const onWheel = (e: WheelEvent) => {
            if (carouselElement && carouselElement.contains(e.target as Node)) {
                handleWheel(e);
            }
        };

        window.addEventListener("wheel", onWheel, { passive: true });
        return () => window.removeEventListener("wheel", onWheel);
    }, [handleWheel]);

    const getCardStyle = (index: number) => {
        const total = images.length;
        let diff = index - currentIndex;

        // Normalizing the diff for circular behavior
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;

        if (diff === 0) {
            return { y: 0, scale: 1, opacity: 1, zIndex: 10, rotateX: 0 };
        } else if (diff === -1) {
            return { y: -140, scale: 0.82, opacity: 0.6, zIndex: 8, rotateX: 8 };
        } else if (diff === -2) {
            return { y: -240, scale: 0.7, opacity: 0.3, zIndex: 6, rotateX: 15 };
        } else if (diff === 1) {
            return { y: 140, scale: 0.82, opacity: 0.6, zIndex: 8, rotateX: -8 };
        } else if (diff === 2) {
            return { y: 240, scale: 0.7, opacity: 0.3, zIndex: 6, rotateX: -15 };
        } else {
            return { y: diff > 0 ? 400 : -400, scale: 0.6, opacity: 0, zIndex: 0, rotateX: diff > 0 ? -20 : 20 };
        }
    };

    const isVisible = (index: number) => {
        const total = images.length;
        let diff = index - currentIndex;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;
        return Math.abs(diff) <= 2;
    };

    return (
        <div id="vertical-carousel-container" className="relative flex h-[550px] w-full items-center justify-center overflow-visible bg-transparent">
            {/* Subtle ambient glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/10 blur-[80px]" />
            </div>

            {/* Card Stack */}
            <div className="relative flex h-[500px] w-full items-center justify-center" style={{ perspective: "1200px" }}>
                {images.map((image, index) => {
                    if (!isVisible(index)) return null;
                    const style = getCardStyle(index);
                    const isCurrent = index === currentIndex;

                    return (
                        <motion.div
                            key={image.id}
                            className="absolute cursor-grab active:cursor-grabbing"
                            animate={{
                                y: style.y,
                                scale: style.scale,
                                opacity: style.opacity,
                                rotateX: style.rotateX,
                                zIndex: style.zIndex,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                                mass: 1,
                            }}
                            drag={isCurrent ? "y" : false}
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={0.2}
                            onDragEnd={handleDragEnd}
                            style={{
                                transformStyle: "preserve-3d",
                                zIndex: style.zIndex,
                            }}
                        >
                            <div
                                className="relative h-[320px] w-[240px] md:h-[400px] md:w-[300px] overflow-hidden rounded-[2rem] bg-[#0D1F35]/80 backdrop-blur-xl border border-white/10 shadow-2xl"
                                style={{
                                    boxShadow: isCurrent
                                        ? "0 25px 50px -12px rgba(6, 183, 216, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                                        : "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
                                }}
                            >
                                {/* Card inner glow */}
                                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />

                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="object-cover w-full h-full"
                                    draggable={false}
                                />

                                {/* Bottom gradient overlay */}
                                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A1628]/80 to-transparent pointer-events-none" />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Navigation dots */}
            <div className="absolute -right-4 md:right-8 top-1/2 flex -translate-y-1/2 flex-col gap-2 z-30">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            if (index !== currentIndex) {
                                setCurrentIndex(index);
                            }
                        }}
                        className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? "h-6 bg-secondary" : "bg-white/20 hover:bg-white/40"
                            }`}
                        aria-label={`Go to image ${index + 1}`}
                    />
                ))}
            </div>

            {/* Counter */}
            <div className="absolute -left-4 md:left-8 top-1/2 -translate-y-1/2 z-30">
                <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold text-white tabular-nums">
                        {String(currentIndex + 1).padStart(2, "0")}
                    </span>
                    <div className="my-2 h-px w-6 bg-secondary/50" />
                    <span className="text-xs font-medium text-white/40 tabular-nums">{String(images.length).padStart(2, "0")}</span>
                </div>
            </div>
        </div>
    );
}
