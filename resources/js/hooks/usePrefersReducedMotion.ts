import { useState, useEffect } from 'react';
import { prefersReducedMotion } from '../animations/gsap';

export function usePrefersReducedMotion(): boolean {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        setReduced(prefersReducedMotion());

        const mediaQuery = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        );
        const handleChange = (e: MediaQueryListEvent) => setReduced(e.matches);

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return reduced;
}
