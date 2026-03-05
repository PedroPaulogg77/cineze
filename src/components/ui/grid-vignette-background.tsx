import { cn } from "@/lib/utils";
import React from "react";

interface GridVignetteBackgroundProps {
    size?: number;
    x?: number;
    y?: number;
    horizontalVignetteSize?: number;
    verticalVignetteSize?: number;
    intensity?: number;
}

export function GridVignetteBackground({
    className,
    size = 40,
    x = 50,
    y = 50,
    horizontalVignetteSize = 100,
    verticalVignetteSize = 100,
    intensity = 0,
}: React.ComponentProps<"div"> & GridVignetteBackgroundProps) {
    return (
        <div
            className={cn(
                "fixed inset-0 !z-0 pointer-events-none overflow-hidden",
                className
            )}
            style={{
                maskImage: `radial-gradient(ellipse ${horizontalVignetteSize}% ${verticalVignetteSize}% at ${x}% ${y}%, black ${100 - intensity}%, transparent 100%)`,
                WebkitMaskImage: `radial-gradient(ellipse ${horizontalVignetteSize}% ${verticalVignetteSize}% at ${x}% ${y}%, black ${100 - intensity}%, transparent 100%)`,
            }}
        >
            <div
                className="absolute inset-[-100%] animate-grid-chess opacity-50"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(6, 183, 216, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 183, 216, 0.15) 1px, transparent 1px)`,
                    backgroundSize: `${size}px ${size}px`
                }}
            />
        </div>
    );
}
