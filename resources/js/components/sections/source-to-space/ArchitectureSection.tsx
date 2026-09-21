import { useRef, useEffect } from 'react';
import { Container } from '../../layout/Container';
import { Button } from '../../ui/Button';
import { SOURCE_TO_SPACE_IMAGES } from '../../../data/sourceToSpaceImages';
import { SOURCE_TO_SPACE_CONTENT } from '../../../data/sourceToSpaceContent';
import {
    verticalTextReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';

interface ArchitectureSectionProps {
    content?: {
        stageIndex?: string;
        heading?: string;
        subtitle?: string;
        paragraph1?: string;
        paragraph2?: string;
        cta?: string;
        ctaHref?: string;
        image?: string;
    };
}

export function ArchitectureSection({ content }: ArchitectureSectionProps = {}) {
    const textRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!textRef.current || prefersReducedMotion()) return;
        verticalTextReveal(textRef.current, {
            duration: 1.1,
            scrollTrigger: {
                trigger: textRef.current,
                start: 'top 85%',
            },
        });
    }, []);

    const architecture = {
        stageIndex:
            content?.stageIndex ||
            SOURCE_TO_SPACE_CONTENT.architecture.stageIndex,
        heading:
            content?.heading || SOURCE_TO_SPACE_CONTENT.architecture.heading,
        subtitle:
            content?.subtitle || SOURCE_TO_SPACE_CONTENT.architecture.subtitle,
        paragraph1:
            content?.paragraph1 ||
            SOURCE_TO_SPACE_CONTENT.architecture.paragraph1,
        paragraph2:
            content?.paragraph2 ||
            SOURCE_TO_SPACE_CONTENT.architecture.paragraph2,
        cta: content?.cta || SOURCE_TO_SPACE_CONTENT.architecture.cta,
        ctaHref:
            content?.ctaHref || SOURCE_TO_SPACE_CONTENT.architecture.ctaHref,
    };

    return (
        <section
            aria-label="Where Material Becomes Architecture"
            className="bg-graphite relative w-full overflow-hidden py-20 text-white sm:py-24 lg:py-32"
        >
            {/* Monumental Architectural Space Backdrop */}
            <div className="absolute inset-0">
                <img
                    src={SOURCE_TO_SPACE_IMAGES.features.architecture.src}
                    alt={SOURCE_TO_SPACE_IMAGES.features.architecture.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover opacity-35"
                />
                <div
                    className="from-graphite via-graphite/75 to-graphite/55 absolute inset-0 bg-gradient-to-t"
                    aria-hidden="true"
                />
            </div>

            <Container className="relative z-10">
                <div ref={textRef} className="mx-auto max-w-3xl text-center">
                    <span className="text-champagne/90 font-sans text-xs tracking-[0.3em] uppercase">
                        {architecture.subtitle}
                    </span>

                    <h2 className="mt-6 font-serif text-4xl leading-[1.1] font-light tracking-tight text-white sm:text-5xl md:text-6xl">
                        {architecture.heading}
                    </h2>

                    <div className="mt-8 space-y-4">
                        <p className="font-serif text-xl leading-relaxed font-light text-white/90 italic sm:text-2xl">
                            &ldquo;{architecture.paragraph1}&rdquo;
                        </p>
                        <p className="mx-auto max-w-xl font-sans text-base leading-relaxed font-light text-white/75 sm:text-lg">
                            {architecture.paragraph2}
                        </p>
                    </div>

                    <div className="mt-10 flex justify-center">
                        <Button
                            href={architecture.ctaHref}
                            variant="secondary"
                            className="border-white/40 text-white hover:border-white hover:bg-white/10"
                        >
                            {architecture.cta}
                        </Button>
                    </div>
                </div>
            </Container>
        </section>
    );
}
