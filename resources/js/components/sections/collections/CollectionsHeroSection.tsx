import { useRef, useEffect } from 'react';
import { Container } from '../../layout/Container';
import { ArchitecturalHeroImage } from '../../media/ArchitecturalHeroImage';
import { COLLECTIONS_IMAGES } from '../../../data/collectionsImages';
import {
    verticalTextReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';

interface CollectionsHeroProps {
    content?: {
        eyebrow?: string;
        marker?: string;
        title?: string;
        secondaryLine?: string;
        image?: string;
        imageAlt?: string;
    };
}

export function CollectionsHeroSection({ content }: CollectionsHeroProps = {}) {
    const textRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!textRef.current || prefersReducedMotion()) return;
        verticalTextReveal(textRef.current, { duration: 1.1, delay: 0.15 });
    }, []);

    const eyebrow = content?.eyebrow || 'ELIOR';
    const marker = content?.marker || 'Natural Stones';
    const title = content?.title || 'Our Collections';
    const secondaryLine =
        content?.secondaryLine ||
        'Distinct materials. Considered for extraordinary spaces.';
    const heroSrc = content?.image || COLLECTIONS_IMAGES.hero.src;
    const heroAlt = content?.imageAlt || COLLECTIONS_IMAGES.hero.alt;

    return (
        <section
            aria-label="Collections Overview Introduction"
            className="relative w-full overflow-hidden"
        >
            <ArchitecturalHeroImage
                src={heroSrc}
                alt={heroAlt}
                height="standard"
                overlay="gradient"
                priority
                containerClassName="relative min-h-[46vh] lg:min-h-[52vh]"
            >
                <Container className="w-full pt-16 pb-12 sm:pt-20 sm:pb-14 lg:pt-24 lg:pb-16">
                    <div ref={textRef} className="max-w-2xl text-left">
                        {/* Architectural Brand Eyebrow */}
                        <div className="flex items-center space-x-3 text-white/90">
                            <span className="font-serif text-sm tracking-[0.3em] uppercase md:text-base">
                                {eyebrow}
                            </span>
                            <span
                                className="bg-bronze/70 h-px w-8"
                                aria-hidden="true"
                            />
                            <span className="text-champagne/90 text-[10px] tracking-[0.34em] uppercase md:text-xs">
                                {marker}
                            </span>
                        </div>

                        {/* Page H1: Singular architectural statement */}
                        <h1 className="mt-5 font-serif text-3xl leading-[1.1] font-light tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                            {title}
                        </h1>

                        <p className="mt-3 max-w-xl font-sans text-base leading-relaxed font-light text-white/85 sm:text-lg">
                            {secondaryLine}
                        </p>
                    </div>
                </Container>
            </ArchitecturalHeroImage>
        </section>
    );
}
