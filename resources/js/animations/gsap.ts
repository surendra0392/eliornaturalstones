import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * ELIOR Architectural Motion System
 *
 * Philosophy:
 * Slow. Intentional. Architectural. Elegant.
 * Restrained transitions honoring structural materials.
 * Full compliance with prefers-reduced-motion.
 */

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export const ARCHITECTURAL_EASE = 'power2.out';
export const EDITORIAL_EASE = 'power3.out';
export const MONOLITH_EASE = 'expo.out';

export const DURATION_FAST = 0.5;
export const DURATION_STANDARD = 0.9;
export const DURATION_SLOW = 1.4;

/**
 * Detect if user has requested reduced motion.
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * 1. Fade reveal: subtle opacity transition.
 */
export function fadeReveal(
    element: HTMLElement | string,
    options: {
        duration?: number;
        delay?: number;
        scrollTrigger?: ScrollTrigger.Vars;
    } = {},
) {
    if (typeof window === 'undefined') return;

    if (prefersReducedMotion()) {
        gsap.set(element, { opacity: 1 });
        return;
    }

    return gsap.fromTo(
        element,
        { opacity: 0 },
        {
            opacity: 1,
            duration: options.duration ?? DURATION_STANDARD,
            delay: options.delay ?? 0,
            ease: ARCHITECTURAL_EASE,
            scrollTrigger: options.scrollTrigger,
        },
    );
}

/**
 * 2. Vertical text reveal: subtle upward translation with fade.
 */
export function verticalTextReveal(
    element: HTMLElement | string,
    options: {
        delay?: number;
        duration?: number;
        yOffset?: number;
        scrollTrigger?: ScrollTrigger.Vars;
    } = {},
) {
    if (typeof window === 'undefined') return;

    if (prefersReducedMotion()) {
        gsap.set(element, { opacity: 1, y: 0 });
        return;
    }

    return gsap.fromTo(
        element,
        {
            opacity: 0,
            y: options.yOffset ?? 24,
        },
        {
            opacity: 1,
            y: 0,
            duration: options.duration ?? DURATION_STANDARD,
            delay: options.delay ?? 0,
            ease: ARCHITECTURAL_EASE,
            scrollTrigger: options.scrollTrigger,
        },
    );
}

// Backwards compatibility alias for Prompt #1
export const revealElement = verticalTextReveal;

/**
 * 3. Image clipping reveal: elegant architectural curtain-lift reveal.
 */
export function imageClipReveal(
    element: HTMLElement | string,
    options: {
        duration?: number;
        delay?: number;
        scrollTrigger?: ScrollTrigger.Vars;
    } = {},
) {
    if (typeof window === 'undefined') return;

    if (prefersReducedMotion()) {
        gsap.set(element, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 });
        return;
    }

    return gsap.fromTo(
        element,
        {
            clipPath: 'inset(100% 0% 0% 0%)',
            scale: 1.05,
        },
        {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1,
            duration: options.duration ?? DURATION_SLOW,
            delay: options.delay ?? 0,
            ease: EDITORIAL_EASE,
            scrollTrigger: options.scrollTrigger,
        },
    );
}

// Backwards compatibility alias for Prompt #1
export const revealImageClip = imageClipReveal;

/**
 * 4. Stagger reveal: sequential reveal of children elements.
 */
export function staggerReveal(
    elements: HTMLElement[] | string,
    options: {
        stagger?: number;
        duration?: number;
        yOffset?: number;
        scrollTrigger?: ScrollTrigger.Vars;
    } = {},
) {
    if (typeof window === 'undefined') return;

    if (prefersReducedMotion()) {
        gsap.set(elements, { opacity: 1, y: 0 });
        return;
    }

    return gsap.fromTo(
        elements,
        {
            opacity: 0,
            y: options.yOffset ?? 20,
        },
        {
            opacity: 1,
            y: 0,
            duration: options.duration ?? DURATION_STANDARD,
            stagger: options.stagger ?? 0.12,
            ease: ARCHITECTURAL_EASE,
            scrollTrigger: options.scrollTrigger,
        },
    );
}

/**
 * 5. Subtle architectural parallax for monumental specimen imagery.
 */
export function subtleParallax(
    element: HTMLElement | string,
    trigger?: HTMLElement | string,
    speed: number = 15,
) {
    if (typeof window === 'undefined') return;

    if (prefersReducedMotion()) {
        return;
    }

    const actualTrigger = trigger || element;

    return gsap.to(element, {
        yPercent: -speed,
        ease: 'none',
        scrollTrigger: {
            trigger: actualTrigger,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
        },
    });
}

// Backwards compatibility alias for Prompt #1
export const applyParallax = subtleParallax;

/**
 * 6. Mobile navigation drawer transition.
 */
export function mobileNavTransition(
    drawer: HTMLElement,
    items: HTMLElement[],
    isOpen: boolean,
    onComplete?: () => void,
) {
    if (typeof window === 'undefined') return;

    if (prefersReducedMotion()) {
        gsap.set(drawer, {
            opacity: isOpen ? 1 : 0,
            display: isOpen ? 'block' : 'none',
        });
        gsap.set(items, { opacity: isOpen ? 1 : 0 });
        onComplete?.();
        return;
    }

    const tl = gsap.timeline({ onComplete });

    if (isOpen) {
        gsap.set(drawer, { display: 'block' });
        tl.fromTo(
            drawer,
            { opacity: 0, y: -16 },
            { opacity: 1, y: 0, duration: 0.45, ease: ARCHITECTURAL_EASE },
        ).fromTo(
            items,
            { opacity: 0, y: 18 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.07,
                ease: EDITORIAL_EASE,
            },
            '-=0.25',
        );
    } else {
        tl.to(items, {
            opacity: 0,
            y: -10,
            duration: 0.25,
            stagger: 0.04,
            ease: 'power1.in',
        })
            .to(drawer, {
                opacity: 0,
                y: -10,
                duration: 0.3,
                ease: 'power1.in',
            })
            .set(drawer, { display: 'none' });
    }

    return tl;
}

export { gsap, ScrollTrigger };
