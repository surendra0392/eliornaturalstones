import { useRef, useEffect } from 'react';
import { Button } from '../../ui/Button';
import { Container } from '../../layout/Container';
import { ArchitecturalHeroImage } from '../../media/ArchitecturalHeroImage';
import { HOMEPAGE_IMAGES } from '../../../data/homepageImages';
import {
    verticalTextReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';

interface HeroSectionProps {
    content?: {
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
}

export function HeroSection({ content }: HeroSectionProps = {}) {
    const textRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!textRef.current || prefersReducedMotion()) return;
        verticalTextReveal(textRef.current, { duration: 1.1, delay: 0.2 });
    }, []);

    const eyebrow = content?.eyebrow || 'ELIOR';
    const marker = content?.marker || 'Natural Stones';
    const title = content?.title || null;
    const secondaryLine =
        content?.secondaryLine ||
        'Monumental architectural surfaces, quarry-selected reserves, and bespoke material curation for spaces of permanence and quiet refinement.';
    const heroSrc = content?.image || HOMEPAGE_IMAGES.hero.src;
    const heroAlt = content?.imageAlt || HOMEPAGE_IMAGES.hero.alt;
    const ctaPrimaryText = content?.ctaPrimaryText || 'Explore Collections';
    const ctaPrimaryHref = content?.ctaPrimaryHref || '/collections';
    const ctaSecondaryText = content?.ctaSecondaryText || 'Discover ELIOR';
    const ctaSecondaryHref = content?.ctaSecondaryHref || '/our-story';

    return (
        <section
            aria-label="Introduction & Architecture"
            className="relative w-full overflow-hidden"
        >
            <ArchitecturalHeroImage
                src={heroSrc}
                alt={heroAlt}
                height="screen"
                overlay="gradient"
                priority
                containerClassName="relative min-h-[92vh] sm:min-h-screen"
            >
                <Container className="w-full pt-24 pb-16 md:pb-24 lg:pb-28">
                    <div ref={textRef} className="max-w-3xl text-left">
                        {/* Architectural Brand Eyebrow */}
                        <div className="flex items-center space-x-3 text-white/90">
                            <span className="font-serif text-sm tracking-[0.32em] uppercase md:text-base">
                                {eyebrow}
                            </span>
                            <span
                                className="bg-bronze/70 h-px w-8"
                                aria-hidden="true"
                            />
                            <span className="text-champagne/90 text-[10px] tracking-[0.36em] uppercase md:text-xs">
                                {marker}
                            </span>
                        </div>

                        {/* Page H1: Singular architectural statement */}
                        <h1 className="mt-6 font-serif text-4xl leading-[1.08] font-light tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                            {title ? (
                                title
                            ) : (
                                <>
                                    Natural stone for <br />
                                    <span className="text-champagne italic">
                                        spaces that endure.
                                    </span>
                                </>
                            )}
                        </h1>

                        <p className="mt-6 max-w-xl font-sans text-base leading-relaxed font-normal text-white/80 sm:text-lg">
                            {secondaryLine}
                        </p>

                        {/* Direct Actions */}
                        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                            <Button
                                href={ctaPrimaryHref}
                                variant="primary"
                                size="lg"
                                className="bg-ivory text-graphite hover:text-graphite shadow-sm hover:bg-white"
                            >
                                {ctaPrimaryText}
                            </Button>

                            <Button
                                href={ctaSecondaryHref}
                                variant="secondary"
                                size="lg"
                                className="hover:border-champagne border-white/40 text-white hover:bg-white/10"
                            >
                                {ctaSecondaryText}
                            </Button>
                        </div>
                    </div>
                </Container>
            </ArchitecturalHeroImage>
        </section>
    );
}
