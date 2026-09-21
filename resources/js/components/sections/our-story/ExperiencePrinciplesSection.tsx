import { useRef, useEffect } from 'react';
import { Container } from '../../layout/Container';
import {
    OUR_STORY_CONTENT,
    type ExperiencePrinciple,
} from '../../../data/ourStoryContent';
import {
    verticalTextReveal,
    staggerReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';

export interface ExperiencePrinciplesProps {
    content?: Partial<typeof OUR_STORY_CONTENT.experience>;
}

export function ExperiencePrinciplesSection({
    content,
}: ExperiencePrinciplesProps = {}) {
    const headingRef = useRef<HTMLDivElement | null>(null);
    const gridRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (prefersReducedMotion()) return;

        if (headingRef.current) {
            verticalTextReveal(headingRef.current, {
                duration: 1.0,
                scrollTrigger: {
                    trigger: headingRef.current,
                    start: 'top 85%',
                },
            });
        }

        if (gridRef.current) {
            const cards = gridRef.current.querySelectorAll('.principle-card');
            if (cards.length > 0) {
                staggerReveal(Array.from(cards) as HTMLElement[], {
                    stagger: 0.1,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: 'top 80%',
                    },
                });
            }
        }
    }, []);

    const experience = {
        ...OUR_STORY_CONTENT.experience,
        ...content,
    };

    return (
        <section
            aria-label="What Experience Taught Us"
            className="bg-ivory border-border-subtle relative border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                {/* Section Header */}
                <div ref={headingRef} className="max-w-2xl text-left">
                    <span className="text-bronze font-sans text-xs tracking-[0.25em] uppercase">
                        EDITORIAL PRINCIPLES
                    </span>
                    <h2 className="text-graphite mt-3 font-serif text-3xl leading-tight font-light sm:text-4xl md:text-5xl">
                        {experience.heading}
                    </h2>
                </div>

                {/* 4-Column Philosophy Grid */}
                <div
                    ref={gridRef}
                    className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-8"
                >
                    {experience.principles.map(
                        (principle: ExperiencePrinciple) => (
                            <div
                                key={principle.numeral}
                                className="principle-card group border-border-stone hover:border-bronze relative flex flex-col justify-between border-t pt-8 transition-colors duration-300"
                            >
                                <div>
                                    <span className="text-bronze font-mono text-xs font-semibold tracking-wider">
                                        {principle.numeral}
                                    </span>
                                    <h3 className="text-graphite mt-4 font-serif text-xl font-normal tracking-wide sm:text-2xl">
                                        {principle.title}
                                    </h3>
                                    <p className="text-graphite/75 mt-4 font-sans text-sm leading-relaxed font-light">
                                        {principle.description}
                                    </p>
                                </div>

                                <div className="bg-stone/20 group-hover:bg-bronze mt-8 h-px w-6 transition-all duration-300 group-hover:w-12" />
                            </div>
                        ),
                    )}
                </div>
            </Container>
        </section>
    );
}
