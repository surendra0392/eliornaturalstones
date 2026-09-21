import { useEffect, useRef } from 'react';
import {
    staggerReveal,
    prefersReducedMotion,
    ScrollTrigger,
} from '../animations/gsap';

export interface UseGsapStaggerOptions {
    selector?: string;
    stagger?: number;
    duration?: number;
    yOffset?: number;
    y?: number;
    delay?: number;
    start?: string;
}

export function useGsapStagger<T extends HTMLElement>(
    options: UseGsapStaggerOptions = {},
) {
    const containerRef = useRef<T | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || typeof window === 'undefined') return;

        if (prefersReducedMotion()) {
            return;
        }

        const rawSelector = options.selector || ':scope > *';
        const safeSelector = rawSelector.startsWith('>')
            ? `:scope ${rawSelector}`
            : rawSelector;

        let children: NodeListOf<Element>;
        try {
            children = container.querySelectorAll(safeSelector);
        } catch {
            children = container.querySelectorAll(':scope > *');
        }
        if (!children || children.length === 0) return;

        const childArray = Array.from(children) as HTMLElement[];
        const yVal = options.yOffset ?? options.y ?? 24;

        // Initially hide children to prevent layout jump before trigger
        childArray.forEach((child) => {
            child.style.opacity = '0';
            child.style.transform = `translateY(${yVal}px)`;
        });

        const ctx = ScrollTrigger.create({
            trigger: container,
            start: options.start || 'top 85%',
            once: true,
            onEnter: () => {
                staggerReveal(childArray, {
                    stagger: options.stagger ?? 0.08,
                    duration: options.duration ?? 0.85,
                    yOffset: yVal,
                });
            },
        });

        return () => {
            ctx.kill();
        };
    }, [
        options.selector,
        options.stagger,
        options.duration,
        options.yOffset,
        options.delay,
        options.start,
    ]);

    return containerRef;
}
