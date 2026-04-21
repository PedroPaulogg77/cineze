import { useRef, useEffect, ReactNode } from "react";

/**
 * Replica visual do ContainerScroll original usando scroll listener nativo passivo,
 * sem useScroll/useTransform do framer-motion (zero overhead de TBT).
 * Mantém: rotateX 20°→0°, scale 1.05→1 (desktop) / 0.8→1 (mobile), translateY 0→-100px.
 */
export function ContainerScrollLite({
    titleComponent,
    children,
}: {
    titleComponent: ReactNode;
    children: ReactNode;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const card = cardRef.current;
        const titleEl = titleRef.current;
        if (!container || !card) return;

        const isMobile = window.innerWidth <= 768;
        const scaleFrom = isMobile ? 0.8 : 1.05;

        // Cached layout values — read once, never inside scroll handler
        let containerOffsetTop = 0;
        let containerHeight = 0;
        let viewH = window.innerHeight;

        const cacheLayout = () => {
            containerOffsetTop = container.getBoundingClientRect().top + window.scrollY;
            containerHeight = container.offsetHeight;
            viewH = window.innerHeight;
        };

        // window.scrollY never triggers layout recalculation — safe inside scroll handler
        const update = () => {
            const elTop = containerOffsetTop - window.scrollY;
            const progress = Math.max(0, Math.min(1,
                (viewH - elTop) / (containerHeight + viewH)
            ));
            card.style.transform = `rotateX(${20 * (1 - progress)}deg) scale(${scaleFrom + (1 - scaleFrom) * progress})`;
            if (titleEl) titleEl.style.transform = `translateY(${-100 * progress}px)`;
        };

        // Defer initial layout read until after first paint to avoid blocking TBT
        requestAnimationFrame(() => { cacheLayout(); update(); });

        window.addEventListener("scroll", update, { passive: true });

        const handleResize = () => { cacheLayout(); update(); };
        window.addEventListener("resize", handleResize, { passive: true });

        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="h-[55rem] md:h-[70rem] flex flex-col items-center justify-start relative pt-8 md:pt-20 px-6 md:px-4"
        >
            <div
                className="w-full relative flex flex-col items-center"
                style={{ perspective: "1000px" }}
            >
                {/* Título — translada para cima conforme scroll (mesmo comportamento do original) */}
                <div
                    ref={titleRef}
                    className="w-full max-w-5xl text-center flex flex-col items-center z-20"
                >
                    {titleComponent}
                </div>

                {/* Card 3D — rotaciona de 20° para 0° conforme scroll */}
                <div
                    ref={cardRef}
                    className="max-w-[17rem] md:max-w-5xl -mt-10 md:-mt-12 mx-auto h-[35rem] md:h-[40rem] w-full border-[6px] md:border-[8px] border-[#334155]/30 md:border-[#0A1A2F] p-1 md:p-3 bg-[#050D18] rounded-[2.5rem] relative overflow-hidden z-20 shadow-2xl"
                    style={{
                        boxShadow: "0 0 50px rgba(6,183,216,0.1), 0 20px 40px rgba(0,0,0,0.5)",
                        transformStyle: "preserve-3d",
                        transform: "rotateX(20deg) scale(1.05)", // estado inicial antes do JS
                        willChange: "transform",
                    }}
                >
                    {/* Decorative iPhone Notch (Mobile Only) */}
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#334155]/30 rounded-full z-30 pointer-events-none md:hidden" />
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/10 to-transparent pointer-events-none z-10" />
                    <div className="h-full w-full overflow-hidden rounded-[2rem] md:rounded-[2.2rem] border border-white/5 relative z-0 flex items-center justify-center bg-[#07111F]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
