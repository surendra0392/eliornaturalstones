import { useRef, useEffect } from 'react';
import { Container } from '../../layout/Container';
import { ArchitecturalHeroImage } from '../../media/ArchitecturalHeroImage';
import { Button } from '../../ui/Button';
import { ARCHITECT_SERVICES_IMAGES } from '../../../data/architectServicesImages';
import { ARCHITECT_SERVICES_CONTENT } from '../../../data/architectServicesContent';
import {
    verticalTextReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';

interface ArchitectServicesHeroProps {
    content?: {
        eyebrow?: string;
        marker?: string;
        title?: string;
        supportingLine?: string;
        secondaryLine?: string;
        cta?: string;
        ctaHref?: string;
        image?: string;
        imageAlt?: string;
    };
}

export function ArchitectServicesHeroSection({
    content,
}: ArchitectServicesHeroProps = {}) {
    const textRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!textRef.current || prefersReducedMotion()) return;
        verticalTextReveal(textRef.current, { duration: 1.2, delay: 0.15 });
    }, []);

    const hero = {
        ...ARCHITECT_SERVICES_CONTENT.hero,
        ...content,
        supportingLine:
            content?.supportingLine ||
            content?.secondaryLine ||
            ARCHITECT_SERVICES_CONTENT.hero.supportingLine,
        cta: content?.cta || ARCHITECT_SERVICES_CONTENT.hero.cta,
        ctaHref: content?.ctaHref || ARCHITECT_SERVICES_CONTENT.hero.ctaHref,
    };
    const heroSrc = content?.image || ARCHITECT_SERVICES_IMAGES.hero.src;
    const heroAlt = content?.imageAlt || ARCHITECT_SERVICES_IMAGES.hero.alt;

    return (
        <section
            aria-label="Architect & Designer Services Hero"
            className="relative w-full overflow-hidden"
        >
            <ArchitecturalHeroImage
                src={heroSrc}
                alt={heroAlt}
                height="standard"
                overlay="gradient"
                priority
                containerClassName="relative min-h-[48vh] lg:min-h-[54vh]"
            >
                <Container className="w-full pt-16 pb-12 sm:pt-20 sm:pb-14 lg:pt-24 lg:pb-16">
                    <div ref={textRef} className="max-w-3xl text-left">
                        {/* Architectural Brand Eyebrow & Supporting Marker */}
                        <div className="flex flex-wrap items-center gap-3 text-white/90">
                            <span className="font-serif text-sm tracking-[0.3em] uppercase md:text-base">
                                {hero.eyebrow}
                            </span>
                            <span
                                className="bg-bronze/70 h-px w-8"
                                aria-hidden="true"
                            />
                            <span className="border-champagne/40 text-champagne/90 rounded-none border px-2.5 py-0.5 font-sans text-[10px] tracking-[0.25em] uppercase md:text-xs">
                                {hero.marker}
                            </span>
                        </div>

                        {/* Page H1: Singular architectural statement */}
                        <h1 className="mt-5 font-serif text-3xl leading-[1.1] font-light tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                            {hero.title}
                        </h1>

                        {/* Supporting line */}
                        <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed font-light text-white/85 sm:text-lg">
                            {hero.supportingLine}
                        </p>

                        {/* Hero Primary CTA */}
                        <div className="mt-6">
                            <Button
                                href={hero.ctaHref}
                                variant="primary"
                                className="text-graphite hover:bg-linen bg-white"
                            >
                                {hero.cta}
                            </Button>
                        </div>
                    </div>
                </Container>
            </ArchitecturalHeroImage>
        </section>
    );
}
