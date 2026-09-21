import { useEffect, useState, type ReactNode } from 'react';
import { router } from '@inertiajs/react';
import { prefersReducedMotion } from '../../animations/gsap';
import { cn } from '../../lib/utils';

export interface PageTransitionProps {
    children: ReactNode;
    className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        if (prefersReducedMotion()) return;

        const handleStart = () => {
            setOpacity(0.4);
        };

        const handleFinish = () => {
            setOpacity(1);
        };

        const removeStart = router.on('start', handleStart);
        const removeFinish = router.on('finish', handleFinish);

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    return (
        <div
            style={{ opacity }}
            className={cn(
                'transition-opacity duration-300 ease-out',
                className,
            )}
        >
            {children}
        </div>
    );
}
