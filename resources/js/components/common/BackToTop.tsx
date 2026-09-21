import { useCallback, useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

export interface BackToTopProps {
    /**
     * Scroll threshold in pixels before the button becomes visible.
     * @default 300
     */
    threshold?: number;
    className?: string;
}

export function BackToTop({ threshold = 300, className }: BackToTopProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleScroll = useCallback(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        setIsVisible(scrollTop > threshold);

        if (scrollHeight > 0) {
            const progress = Math.min(
                100,
                Math.max(0, (scrollTop / scrollHeight) * 100),
            );
            setScrollProgress(progress);
        } else {
            setScrollProgress(0);
        }
    }, [threshold]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    const scrollToTop = () => {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
    };

    // Circular progress indicator calculations (diameter: 48px, stroke: 2px)
    const size = 48;
    const strokeWidth = 2;
    const center = size / 2;
    const radius = center - strokeWidth - 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset =
        circumference - (scrollProgress / 100) * circumference;

    return (
        <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top of page"
            tabIndex={isVisible ? 0 : -1}
            className={cn(
                'group border-graphite/15 bg-ivory/90 text-graphite fixed right-6 bottom-6 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border shadow-md backdrop-blur-md transition-all duration-300 md:right-8 md:bottom-8',
                'hover:border-bronze hover:bg-graphite hover:text-ivory hover:shadow-xl active:scale-95',
                'focus-visible:outline-bronze focus-visible:outline-2 focus-visible:outline-offset-3',
                isVisible
                    ? 'pointer-events-auto translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-4 opacity-0',
                className,
            )}
        >
            {/* Scroll Progress SVG Ring */}
            <svg
                className="pointer-events-none absolute inset-0 -rotate-90"
                width={size}
                height={size}
                aria-hidden="true"
            >
                {/* Background Track */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    className="stroke-graphite/10 fill-none"
                    strokeWidth={strokeWidth}
                />
                {/* Active Progress Ring */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    className="stroke-bronze group-hover:stroke-bronze-light fill-none transition-[stroke-dashoffset] duration-150 ease-out"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </svg>

            {/* Upward Chevron Icon */}
            <span className="relative flex flex-col items-center justify-center transition-transform duration-300 group-hover:-translate-y-0.5">
                <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 15.75l7.5-7.5 7.5 7.5"
                    />
                </svg>
            </span>
        </button>
    );
}
