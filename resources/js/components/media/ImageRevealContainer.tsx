import { useEffect, useRef, type ReactNode } from 'react';
import { revealImageClip, prefersReducedMotion } from '../../animations/gsap';
import { cn } from '../../lib/utils';

export interface ImageRevealContainerProps {
    children: ReactNode;
    className?: string;
    duration?: number;
    delay?: number;
}

export function ImageRevealContainer({
    children,
    className,
    duration = 1.3,
}: ImageRevealContainerProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el || typeof window === 'undefined') return;

        if (prefersReducedMotion()) {
            return;
        }

        const anim = revealImageClip(el, {
            duration,
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                once: true,
            },
        });

        return () => {
            anim?.kill();
        };
    }, [duration]);

    return (
        <div ref={containerRef} className={cn('overflow-hidden', className)}>
            {children}
        </div>
    );
}
