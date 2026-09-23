import { useRef, useEffect } from 'react';
import { Container } from '../../layout/Container';
import { OUR_STORY_IMAGES } from '../../../data/ourStoryImages';
import { OUR_STORY_CONTENT } from '../../../data/ourStoryContent';
import {
    verticalTextReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';

export interface PhilosophyProps {
    content?: Partial<Record<keyof typeof OUR_STORY_CONTENT.philosophy, string>>;
}

export function PhilosophySection({ content }: PhilosophyProps = {}) {
    const contentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!contentRef.current || prefersReducedMotion()) return;
        verticalTextReveal(contentRef.current, {
            duration: 1.2,
            scrollTrigger: {
                trigger: contentRef.current,
                start: 'top 80%',
            },
        });
    }, []);

    const rawHeadline = content?.headline as string | undefined;
    const rawStatement = content?.supportingStatement as string | undefined;

    const headline =
        !rawHeadline || rawHeadline === 'Material First. Text Second.'
            ? OUR_STORY_CONTENT.philosophy.headline
            : rawHeadline;

    const supportingStatement =
        !rawStatement ||
        rawStatement === 'We believe the stone should speak before the specification does.'
            ? OUR_STORY_CONTENT.philosophy.supportingStatement
            : rawStatement;

    const philosophy = {
        ...OUR_STORY_CONTENT.philosophy,
        ...content,
        headline,
        supportingStatement,
    };

    return (
        <section
            aria-label="The ELIOR Philosophy"
            className="bg-graphite relative w-full overflow-hidden text-white"
        >
            {/* Monumental Architectural Stone Backdrop with Controlled Atmosphere */}
            <div className="absolute inset-0">
                <img
                    src={OUR_STORY_IMAGES.philosophy.src}
                    alt={OUR_STORY_IMAGES.philosophy.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover opacity-35"
                />
                <div
                    className="from-graphite via-graphite/80 to-graphite/60 absolute inset-0 bg-gradient-to-t"
                    aria-hidden="true"
                />
            </div>

            {/* Signature Editorial Moment */}
            <Container className="relative z-10 py-20 sm:py-24 lg:py-32">
                <div ref={contentRef} className="mx-auto max-w-4xl text-center">
                    <span className="text-champagne/90 font-sans text-xs tracking-[0.35em] uppercase">
                        CORE PHILOSOPHY
                    </span>

                    <h2 className="mt-6 font-serif text-4xl leading-[1.08] font-light tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                        {philosophy.headline}
                    </h2>

                    <p className="mt-8 font-serif text-xl leading-relaxed font-light text-white/90 italic sm:text-2xl md:text-3xl">
                        &ldquo;{philosophy.supportingStatement}&rdquo;
                    </p>

                    <div className="bg-champagne/40 mx-auto mt-8 h-px w-16" />

                    <p className="mx-auto mt-8 max-w-2xl font-sans text-base leading-relaxed font-light text-white/75 sm:text-lg">
                        {philosophy.secondaryCopy}
                    </p>
                </div>
            </Container>
        </section>
    );
}
