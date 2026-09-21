import { useEffect, useRef } from 'react';
import {
    verticalTextReveal,
    fadeReveal,
    imageClipReveal,
    prefersReducedMotion,
    ScrollTrigger,
} from '../animations/gsap';

export interface UseGsapRevealOptions {
    type?: 'text' | 'fade' | 'clip';
    delay?: number;
    duration?: number;
    yOffset?: number;
    triggerOnce?: boolean;
}

export function useGsapReveal<T extends HTMLElement>(
    options: UseGsapRevealOptions = {},
) {
    const elementRef = useRef<T | null>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element || typeof window === 'undefined') return;

        if (prefersReducedMotion()) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            return;
        }

        const type = options.type || 'text';

        const ctx = ScrollTrigger.create({
            trigger: element,
            start: 'top 88%',
            once: options.triggerOnce ?? true,
            onEnter: () => {
                if (type === 'clip') {
                    imageClipReveal(element, {
                        delay: options.delay,
                        duration: options.duration,
                    });
                } else if (type === 'fade') {
                    fadeReveal(element, {
                        delay: options.delay,
                        duration: options.duration,
                    });
                } else {
                    verticalTextReveal(element, {
                        delay: options.delay,
                        duration: options.duration,
                        yOffset: options.yOffset,
                    });
                }
            },
        });

        return () => {
            ctx.kill();
        };
    }, [
        options.type,
        options.delay,
        options.duration,
        options.yOffset,
        options.triggerOnce,
    ]);

    return elementRef;
}
