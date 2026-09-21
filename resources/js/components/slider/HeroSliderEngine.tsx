import { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { Button } from '../ui/Button';
import { Container } from '../layout/Container';
import { HeroSection } from '../sections/home/HeroSection';
import { prefersReducedMotion } from '../../animations/gsap';
import type { Slider, SlideLayer, TransitionType } from '../../types/slider';

interface HeroSliderEngineProps {
    slider?: Slider | null;
    fallbackContent?: {
        eyebrow?: string;
        marker?: string;
        title?: string;
        secondaryLine?: string;
        ctaPrimaryText?: string;
        ctaPrimaryHref?: string;
        ctaSecondaryText?: string;
        ctaSecondaryHref?: string;
        image?: string;
        imageAlt?: string;
    };
    className?: string;
}

/**
 * Validates URLs to prevent script injection
 */
function isSafeUrl(url?: string): boolean {
    if (!url) return false;
    const trimmed = url.trim().toLowerCase();
    return (
        !trimmed.startsWith('javascript:') &&
        !trimmed.startsWith('data:') &&
        !trimmed.startsWith('vbscript:')
    );
}

/**
 * Maps overlay types to Tailwind overlay gradient / color classes
 */
function getOverlayClasses(
    overlayType: string,
    opacity: number,
    alignment: string,
): string {
    if (overlayType === 'none' || opacity <= 0) return 'bg-transparent';

    const opacityPercent = Math.min(
        100,
        Math.max(0, Math.round(opacity * 100)),
    );

    if (overlayType === 'gradient') {
        if (alignment === 'center') {
            return 'bg-gradient-to-t from-graphite via-graphite/70 to-graphite/40';
        }
        return 'bg-gradient-to-r from-graphite/95 via-graphite/75 to-graphite/30';
    }

    if (overlayType === 'subtle') return 'bg-graphite/35';
    if (overlayType === 'medium') return 'bg-graphite/55';
    if (overlayType === 'dark') return 'bg-graphite/80';

    return `bg-graphite/[${(opacityPercent / 100).toFixed(2)}]`;
}

/**
 * Returns alignment classes for the slide container
 */
function getAlignmentClasses(alignment: string): {
    container: string;
    text: string;
} {
    switch (alignment) {
        case 'center':
            return {
                container: 'items-center text-center justify-center',
                text: 'text-center items-center mx-auto',
            };
        case 'right':
            return {
                container: 'items-end text-right justify-end ml-auto',
                text: 'text-right items-end ml-auto',
            };
        case 'left':
        default:
            return {
                container: 'items-start text-left justify-start mr-auto',
                text: 'text-left items-start mr-auto',
            };
    }
}

/**
 * Returns content width max-width class
 */
function getContentWidthClass(width: string): string {
    switch (width) {
        case 'compact':
            return 'max-w-2xl';
        case 'wide':
            return 'max-w-5xl';
        case 'full':
            return 'max-w-full';
        case 'standard':
        default:
            return 'max-w-3xl';
    }
}

export function HeroSliderEngine({
    slider,
    fallbackContent,
    className = '',
}: HeroSliderEngineProps) {
    // 1. Safe Fallback check: If no slider or no published slides exist, render static HeroSection
    const publishedSlides = (slider?.slides || [])
        .filter((slide) => !slide.status || slide.status === 'published')
        .sort((a, b) => a.sort_order - b.sort_order);

    if (!slider || publishedSlides.length === 0) {
        return <HeroSection content={fallbackContent} />;
    }

    const settings = slider.settings || {};
    const hasMultipleSlides = publishedSlides.length > 1;
    const defaultInterval = settings.autoplay_interval ?? 6500;
    const pauseOnHover = settings.pause_on_hover !== false;
    const loop = settings.loop !== false;
    const enableNav = settings.navigation !== false && hasMultipleSlides;
    const enablePagination = settings.pagination !== false && hasMultipleSlides;
    const enableProgressBar =
        settings.progress_bar !== false && hasMultipleSlides;

    // State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(
        settings.autoplay !== false && hasMultipleSlides,
    );
    const [isHovered, setIsHovered] = useState(false);

    // Refs
    const rootRef = useRef<HTMLDivElement | null>(null);
    const slidesContainerRef = useRef<HTMLDivElement | null>(null);
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
    const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
    const progressBarRef = useRef<HTMLDivElement | null>(null);
    const progressTweenRef = useRef<gsap.core.Tween | null>(null);
    const isTransitioningRef = useRef(false);
    const prevIndexRef = useRef(0);

    // Touch / Swipe state
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    const activeSlide = publishedSlides[currentIndex];

    // Slide navigation dispatcher
    const goToSlide = useCallback(
        (targetIndex: number) => {
            if (isTransitioningRef.current || targetIndex === currentIndex)
                return;
            let nextTarget = targetIndex;
            if (targetIndex < 0 || targetIndex >= publishedSlides.length) {
                if (!loop) return;
                nextTarget = targetIndex < 0 ? publishedSlides.length - 1 : 0;
            }

            prevIndexRef.current = currentIndex;
            setCurrentIndex(nextTarget);
        },
        [currentIndex, publishedSlides.length, loop],
    );

    const nextSlide = useCallback(() => {
        const nextIdx = (currentIndex + 1) % publishedSlides.length;
        if (!loop && nextIdx === 0) return;
        goToSlide(nextIdx);
    }, [currentIndex, publishedSlides.length, loop, goToSlide]);

    const prevSlide = useCallback(() => {
        const prevIdx =
            (currentIndex - 1 + publishedSlides.length) %
            publishedSlides.length;
        if (!loop && currentIndex === 0) return;
        goToSlide(prevIdx);
    }, [currentIndex, publishedSlides.length, loop, goToSlide]);

    // Animate slide transitions and layer reveals with GSAP
    useEffect(() => {
        const fromIdx = prevIndexRef.current;
        const toIdx = currentIndex;
        const fromEl = slideRefs.current[fromIdx];
        const toEl = slideRefs.current[toIdx];
        const toBg = bgRefs.current[toIdx];

        if (!toEl) return;

        isTransitioningRef.current = true;
        const reduced = prefersReducedMotion();

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    isTransitioningRef.current = false;
                },
            });

            // Transition type for current slide
            const transition: TransitionType =
                activeSlide.transition || settings.default_transition || 'fade';
            const duration = reduced
                ? 0.2
                : (settings.transition_duration ?? 0.9);

            // Handle outgoing slide
            if (fromEl && fromEl !== toEl) {
                if (reduced) {
                    gsap.set(fromEl, {
                        opacity: 0,
                        pointerEvents: 'none',
                        zIndex: 1,
                    });
                } else {
                    gsap.set(fromEl, { zIndex: 2 });
                    if (transition === 'slide') {
                        const moveX = toIdx > fromIdx ? '-30%' : '30%';
                        tl.to(
                            fromEl,
                            {
                                x: moveX,
                                opacity: 0,
                                duration,
                                ease: 'power2.inOut',
                            },
                            0,
                        );
                    } else if (transition === 'cinematic') {
                        tl.to(
                            fromEl,
                            {
                                opacity: 0,
                                scale: 1.04,
                                duration: duration * 1.1,
                                ease: 'power2.out',
                            },
                            0,
                        );
                    } else {
                        // fade / crossfade
                        tl.to(
                            fromEl,
                            { opacity: 0, duration, ease: 'power2.out' },
                            0,
                        );
                    }
                    tl.set(fromEl, { pointerEvents: 'none', zIndex: 1 });
                }
            }

            // Handle incoming slide container
            if (reduced) {
                gsap.set(toEl, {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    pointerEvents: 'auto',
                    zIndex: 10,
                });
            } else {
                gsap.set(toEl, { pointerEvents: 'auto', zIndex: 10 });
                if (transition === 'slide') {
                    const startX = toIdx > fromIdx ? '30%' : '-30%';
                    tl.fromTo(
                        toEl,
                        { x: startX, opacity: 0 },
                        { x: '0%', opacity: 1, duration, ease: 'power2.inOut' },
                        0,
                    );
                } else if (transition === 'cinematic') {
                    tl.fromTo(
                        toEl,
                        { opacity: 0, scale: 1.06 },
                        {
                            opacity: 1,
                            scale: 1,
                            duration: duration * 1.1,
                            ease: 'power2.out',
                        },
                        0,
                    );
                } else {
                    tl.fromTo(
                        toEl,
                        { opacity: 0 },
                        { opacity: 1, duration, ease: 'power2.out' },
                        0,
                    );
                }
            }

            // Ambient Ken Burns scale for background image
            if (toBg && !reduced) {
                gsap.fromTo(
                    toBg,
                    { scale: 1.0 },
                    {
                        scale: 1.05,
                        duration:
                            (activeSlide.duration ?? defaultInterval) / 1000,
                        ease: 'none',
                    },
                );
            }

            // Animate incoming slide layers
            const layerElements =
                toEl.querySelectorAll<HTMLElement>('[data-layer-type]');
            if (layerElements.length > 0) {
                if (reduced) {
                    gsap.set(layerElements, {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        scale: 1,
                        clipPath: 'none',
                    });
                } else {
                    layerElements.forEach((layerEl) => {
                        const animType =
                            layerEl.getAttribute('data-anim-entrance') ||
                            'fade-up';
                        const delay = Number.parseFloat(
                            layerEl.getAttribute('data-anim-delay') || '0.1',
                        );
                        const layerDur = Number.parseFloat(
                            layerEl.getAttribute('data-anim-duration') || '0.8',
                        );
                        const ease =
                            layerEl.getAttribute('data-anim-ease') ||
                            'power2.out';

                        let fromVars: gsap.TweenVars = { opacity: 0 };
                        let toVars: gsap.TweenVars = {
                            opacity: 1,
                            duration: layerDur,
                            ease,
                        };

                        switch (animType) {
                            case 'fade-up':
                                fromVars = { opacity: 0, y: 32 };
                                toVars = { ...toVars, y: 0 };
                                break;
                            case 'fade-down':
                                fromVars = { opacity: 0, y: -32 };
                                toVars = { ...toVars, y: 0 };
                                break;
                            case 'slide-left':
                                fromVars = { opacity: 0, x: -44 };
                                toVars = { ...toVars, x: 0 };
                                break;
                            case 'slide-right':
                                fromVars = { opacity: 0, x: 44 };
                                toVars = { ...toVars, x: 0 };
                                break;
                            case 'scale-in':
                                fromVars = { opacity: 0, scale: 0.92 };
                                toVars = { ...toVars, scale: 1 };
                                break;
                            case 'clip-reveal':
                                fromVars = {
                                    opacity: 0,
                                    clipPath: 'inset(100% 0% 0% 0%)',
                                };
                                toVars = {
                                    ...toVars,
                                    opacity: 1,
                                    clipPath: 'inset(0% 0% 0% 0%)',
                                };
                                break;
                            case 'fade-in':
                            default:
                                fromVars = { opacity: 0 };
                                toVars = { ...toVars, opacity: 1 };
                                break;
                        }

                        // Stagger entrance slightly after slide container starts transitioning
                        tl.fromTo(
                            layerEl,
                            fromVars,
                            toVars,
                            Math.max(0.1, delay),
                        );
                    });
                }
            }
        }, rootRef);

        return () => {
            ctx.revert();
        };
    }, [currentIndex, activeSlide, settings, defaultInterval]);

    // Progress bar and autoplay timer management
    useEffect(() => {
        if (!hasMultipleSlides || !isPlaying) {
            if (progressTweenRef.current) {
                progressTweenRef.current.kill();
                progressTweenRef.current = null;
            }
            if (progressBarRef.current) {
                gsap.set(progressBarRef.current, { scaleX: 0 });
            }
            return;
        }

        const durationSec = (activeSlide.duration ?? defaultInterval) / 1000;

        if (progressBarRef.current) {
            gsap.set(progressBarRef.current, {
                scaleX: 0,
                transformOrigin: 'left center',
            });
            progressTweenRef.current = gsap.to(progressBarRef.current, {
                scaleX: 1,
                duration: durationSec,
                ease: 'none',
                onComplete: () => {
                    nextSlide();
                },
            });

            if (isHovered && pauseOnHover) {
                progressTweenRef.current.pause();
            }
        }

        return () => {
            if (progressTweenRef.current) {
                progressTweenRef.current.kill();
                progressTweenRef.current = null;
            }
        };
    }, [
        currentIndex,
        isPlaying,
        isHovered,
        pauseOnHover,
        activeSlide,
        defaultInterval,
        hasMultipleSlides,
        nextSlide,
    ]);

    // Handle document visibility change (pause on tab switch, resume on return)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (progressTweenRef.current) {
                    progressTweenRef.current.pause();
                }
            } else {
                if (isPlaying && (!isHovered || !pauseOnHover)) {
                    if (progressTweenRef.current) {
                        progressTweenRef.current.resume();
                    }
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );
        };
    }, [isPlaying, isHovered, pauseOnHover]);

    // Handle Keyboard navigation (ArrowLeft & ArrowRight)
    useEffect(() => {
        if (!settings.keyboard_nav && settings.keyboard_nav !== undefined)
            return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!rootRef.current) return;
            const rect = rootRef.current.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;

            if (isInView || document.activeElement === rootRef.current) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevSlide();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextSlide();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [prevSlide, nextSlide, settings.keyboard_nav]);

    // Pointer / Touch swipe handlers
    const handlePointerDown = (e: React.PointerEvent) => {
        if (!settings.touch_swipe && settings.touch_swipe !== undefined) return;
        touchStartX.current = e.clientX;
        touchStartY.current = e.clientY;
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (touchStartX.current === null || touchStartY.current === null)
            return;
        const diffX = e.clientX - touchStartX.current;
        const diffY = e.clientY - touchStartY.current;

        touchStartX.current = null;
        touchStartY.current = null;

        // Horizontal swipe gesture detection (minimum 45px threshold)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
            if (diffX < 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    };

    const renderLayer = (layer: SlideLayer, slideIndex: number) => {
        if (layer.is_visible === false) return null;

        const content = layer.content || {};
        const anim = layer.animation || {};
        const pos = layer.positioning || {};

        const animEntrance = anim.entrance || 'fade-up';
        const animDuration = anim.duration ?? 0.8;
        const animDelay = anim.delay ?? 0.1;
        const animEase = anim.ease || 'power2.out';

        const customStyle: React.CSSProperties = {
            zIndex: layer.z_index,
            maxWidth: pos.max_width || undefined,
            opacity: pos.opacity ?? 1,
            transform: pos.scale ? `scale(${pos.scale})` : undefined,
        };

        const dataAttrs = {
            'data-layer-id': layer.id,
            'data-layer-type': layer.type,
            'data-anim-entrance': animEntrance,
            'data-anim-duration': animDuration,
            'data-anim-delay': animDelay,
            'data-anim-ease': animEase,
        };

        switch (layer.type) {
            case 'eyebrow': {
                const text = content.text || 'ELIOR NATURAL STONES';
                const secondary = content.secondary_text;
                return (
                    <div
                        key={layer.id}
                        {...dataAttrs}
                        style={customStyle}
                        className="mb-4 flex items-center space-x-3 text-white/90"
                    >
                        <span className="text-champagne font-serif text-xs tracking-[0.32em] uppercase sm:text-sm">
                            {text}
                        </span>
                        {secondary && (
                            <>
                                <span
                                    className="bg-bronze/70 h-px w-6 sm:w-8"
                                    aria-hidden="true"
                                />
                                <span className="text-[10px] tracking-[0.36em] text-white/80 uppercase sm:text-xs">
                                    {secondary}
                                </span>
                            </>
                        )}
                    </div>
                );
            }

            case 'heading': {
                const text = content.text || '';
                const isFirstSlide = slideIndex === 0;

                // Semantic H1 rule: First slide gets the page H1, subsequent slides get H2 with identical regal styling
                const HeadingTag = isFirstSlide ? 'h1' : 'h2';

                return (
                    <HeadingTag
                        key={layer.id}
                        {...dataAttrs}
                        style={customStyle}
                        className="font-serif text-4xl leading-[1.08] font-light tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
                        dangerouslySetInnerHTML={{ __html: text }}
                    />
                );
            }

            case 'description': {
                const text = content.text || '';
                return (
                    <p
                        key={layer.id}
                        {...dataAttrs}
                        style={customStyle}
                        className="mt-6 max-w-xl font-sans text-base leading-relaxed font-normal text-white/85 sm:text-lg"
                    >
                        {text}
                    </p>
                );
            }

            case 'cta': {
                const primaryUrl = isSafeUrl(content.primary_url)
                    ? content.primary_url
                    : '/collections';
                const secondaryUrl = isSafeUrl(content.secondary_url)
                    ? content.secondary_url
                    : '/our-story';
                const primaryLabel =
                    content.primary_label || 'Explore Collections';
                const secondaryLabel = content.secondary_label;

                return (
                    <div
                        key={layer.id}
                        {...dataAttrs}
                        style={customStyle}
                        className="mt-8 flex flex-col items-start gap-4 sm:mt-10 sm:flex-row sm:items-center sm:gap-6"
                    >
                        {content.primary_label && (
                            <Button
                                href={primaryUrl}
                                variant="primary"
                                size="lg"
                                className="bg-ivory text-graphite hover:text-graphite border-ivory font-sans shadow-md hover:bg-white"
                            >
                                {primaryLabel}
                            </Button>
                        )}

                        {secondaryLabel && (
                            <Button
                                href={secondaryUrl}
                                variant="secondary"
                                size="lg"
                                className="hover:border-champagne border-white/40 font-sans text-white hover:bg-white/10"
                            >
                                {secondaryLabel}
                            </Button>
                        )}
                    </div>
                );
            }

            case 'decorative_shape': {
                const shapeType = content.shape_type || 'line';
                if (shapeType === 'line') {
                    return (
                        <div
                            key={layer.id}
                            {...dataAttrs}
                            style={customStyle}
                            className="bg-champagne/60 my-4 h-px w-16 sm:w-24"
                            aria-hidden="true"
                        />
                    );
                }
                return (
                    <div
                        key={layer.id}
                        {...dataAttrs}
                        style={customStyle}
                        className="border-champagne/40 my-4 h-8 w-8 rotate-45 border"
                        aria-hidden="true"
                    />
                );
            }

            case 'image': {
                if (!content.src) return null;
                return (
                    <div
                        key={layer.id}
                        {...dataAttrs}
                        style={customStyle}
                        className="my-4 overflow-hidden rounded-xs border border-white/20 shadow-2xl"
                    >
                        <img
                            src={content.src}
                            alt={content.alt || 'Architectural specimen'}
                            className="h-auto max-w-xs object-cover md:max-w-md"
                            loading="lazy"
                        />
                    </div>
                );
            }

            case 'spacer': {
                const height = content.height || '2rem';
                return (
                    <div
                        key={layer.id}
                        {...dataAttrs}
                        style={{ height, ...customStyle }}
                        aria-hidden="true"
                    />
                );
            }

            default:
                return null;
        }
    };

    return (
        <section
            ref={rootRef}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label={slider.name || 'Hero Banner'}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group/slider bg-graphite relative h-[calc(100vh-5rem)] min-h-[580px] w-full overflow-hidden select-none focus:outline-hidden md:h-[calc(100vh-6rem)] ${className}`}
        >
            {/* Screen reader live announcement */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
                Slide {currentIndex + 1} of {publishedSlides.length}:{' '}
                {activeSlide.title}
            </div>

            {/* Slides container */}
            <div ref={slidesContainerRef} className="relative h-full w-full">
                {publishedSlides.map((slide, slideIdx) => {
                    const isActive = slideIdx === currentIndex;
                    const alignment = getAlignmentClasses(
                        slide.content_alignment || 'left',
                    );
                    const widthClass = getContentWidthClass(
                        slide.content_width || 'standard',
                    );
                    const sortedLayers = (slide.layers || [])
                        .filter((l) => l.is_visible !== false)
                        .sort((a, b) => a.sort_order - b.sort_order);

                    const overlayClass = getOverlayClasses(
                        slide.overlay_type || 'gradient',
                        slide.overlay_opacity ?? 0.6,
                        slide.content_alignment || 'left',
                    );

                    return (
                        <div
                            key={slide.id}
                            ref={(el) => {
                                slideRefs.current[slideIdx] = el;
                            }}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`Slide ${slideIdx + 1} of ${publishedSlides.length}: ${slide.title}`}
                            aria-hidden={!isActive}
                            className={`absolute inset-0 flex h-full w-full flex-col justify-center transition-opacity ${
                                isActive
                                    ? 'pointer-events-auto z-10 opacity-100'
                                    : 'pointer-events-none z-1 opacity-0'
                            }`}
                        >
                            {/* Slide Background */}
                            <div className="absolute inset-0 h-full w-full overflow-hidden">
                                {slide.background_type === 'image' &&
                                slide.background_image ? (
                                    <div
                                        ref={(el) => {
                                            bgRefs.current[slideIdx] = el;
                                        }}
                                        className="absolute inset-0 h-full w-full bg-cover bg-center transition-transform duration-1000 ease-out will-change-transform"
                                        style={{
                                            backgroundImage: `url('${slide.background_image}')`,
                                            backgroundPosition:
                                                slide.background_position ||
                                                'center',
                                            backgroundSize:
                                                slide.background_size ||
                                                'cover',
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="absolute inset-0 h-full w-full"
                                        style={{
                                            backgroundColor:
                                                slide.background_color ||
                                                '#0F0F0F',
                                        }}
                                    />
                                )}

                                {/* Overlay scrim */}
                                <div
                                    className={`absolute inset-0 ${overlayClass}`}
                                />
                            </div>

                            {/* Slide Content Layer */}
                            <div className="relative z-10 flex w-full flex-1 flex-col justify-center">
                                <Container className="w-full pt-16 pb-20 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28">
                                    <div
                                        className={`flex flex-col ${alignment.container}`}
                                    >
                                        <div
                                            className={`w-full ${widthClass} ${alignment.text}`}
                                        >
                                            {sortedLayers.map((layer) =>
                                                renderLayer(layer, slideIdx),
                                            )}
                                        </div>
                                    </div>
                                </Container>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Architectural Autoplay Progress Indicator */}
            {enableProgressBar && (
                <div
                    className="absolute top-0 right-0 left-0 z-30 h-[2px] bg-white/10"
                    aria-hidden="true"
                >
                    <div
                        ref={progressBarRef}
                        className="bg-champagne h-full origin-left transition-transform"
                        style={{ transform: 'scaleX(0)' }}
                    />
                </div>
            )}

            {/* Slide Navigation Dock (Arrows + Counter + Indicators + Autoplay toggle) */}
            {hasMultipleSlides && (
                <div className="pointer-events-auto absolute right-6 bottom-6 z-30 flex items-center gap-3 sm:right-10 sm:bottom-8 sm:gap-6">
                    {/* Architectural Counter */}
                    <div className="font-mono text-xs tracking-widest text-white/70 sm:text-sm">
                        <span className="text-champagne font-semibold">
                            {String(currentIndex + 1).padStart(2, '0')}
                        </span>
                        <span className="mx-1 text-white/40">/</span>
                        <span>
                            {String(publishedSlides.length).padStart(2, '0')}
                        </span>
                    </div>

                    {/* Pagination Indicators */}
                    {enablePagination && (
                        <div
                            className="flex items-center gap-1.5 sm:gap-2"
                            role="tablist"
                            aria-label="Slide Selection"
                        >
                            {publishedSlides.map((slide, dotIdx) => {
                                const isCurrent = dotIdx === currentIndex;
                                return (
                                    <button
                                        key={slide.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={isCurrent}
                                        aria-label={`Go to slide ${dotIdx + 1}: ${slide.title}`}
                                        onClick={() => goToSlide(dotIdx)}
                                        className={`focus-visible:ring-champagne h-1.5 rounded-full transition-all duration-300 focus:outline-hidden focus-visible:ring-1 ${
                                            isCurrent
                                                ? 'bg-champagne w-8'
                                                : 'w-2 bg-white/30 hover:bg-white/60'
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {/* Navigation Chevrons */}
                    {enableNav && (
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <button
                                type="button"
                                onClick={prevSlide}
                                aria-label="Previous slide"
                                className="bg-graphite/60 hover:border-champagne hover:bg-graphite focus-visible:ring-champagne flex h-10 w-10 cursor-pointer items-center justify-center rounded-xs border border-white/20 text-white/80 backdrop-blur-xs transition-all duration-200 hover:text-white focus:outline-hidden focus-visible:ring-1 sm:h-11 sm:w-11"
                            >
                                <svg
                                    className="h-4 w-4 -rotate-180 transform"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                    />
                                </svg>
                            </button>

                            <button
                                type="button"
                                onClick={nextSlide}
                                aria-label="Next slide"
                                className="bg-graphite/60 hover:border-champagne hover:bg-graphite focus-visible:ring-champagne flex h-10 w-10 cursor-pointer items-center justify-center rounded-xs border border-white/20 text-white/80 backdrop-blur-xs transition-all duration-200 hover:text-white focus:outline-hidden focus-visible:ring-1 sm:h-11 sm:w-11"
                            >
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                    />
                                </svg>
                            </button>

                            {/* Autoplay Play/Pause toggle */}
                            <button
                                type="button"
                                onClick={() => setIsPlaying(!isPlaying)}
                                aria-label={
                                    isPlaying
                                        ? 'Pause slideshow'
                                        : 'Play slideshow'
                                }
                                title={
                                    isPlaying
                                        ? 'Pause slideshow'
                                        : 'Play slideshow'
                                }
                                className="bg-graphite/60 hover:border-champagne hover:bg-graphite focus-visible:ring-champagne flex h-10 w-10 cursor-pointer items-center justify-center rounded-xs border border-white/20 text-white/80 backdrop-blur-xs transition-all duration-200 hover:text-white focus:outline-hidden focus-visible:ring-1 sm:h-11 sm:w-11"
                            >
                                {isPlaying ? (
                                    <svg
                                        className="h-4 w-4"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-4 w-4"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
