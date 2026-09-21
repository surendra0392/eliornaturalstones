import { useRef, useEffect } from 'react';
import { Container } from '../../layout/Container';
import { ARCHITECT_SERVICES_CONTENT } from '../../../data/architectServicesContent';
import {
    verticalTextReveal,
    staggerReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';

interface ProjectCollaborationSectionProps {
    content?: {
        heading?: string;
        subtitle?: string;
        paragraph?: string;
        progression?: Array<{ stage: string; title: string }>;
    };
}

export function ProjectCollaborationSection({ content }: ProjectCollaborationSectionProps = {}) {
    const textRef = useRef<HTMLDivElement | null>(null);
    const progressionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (prefersReducedMotion()) return;

        if (textRef.current) {
            verticalTextReveal(textRef.current, {
                duration: 1.0,
                scrollTrigger: {
                    trigger: textRef.current,
                    start: 'top 85%',
                },
            });
        }

        if (progressionRef.current) {
            const steps = progressionRef.current.querySelectorAll('.prog-step');
            if (steps.length > 0) {
                staggerReveal(Array.from(steps) as HTMLElement[], {
                    stagger: 0.1,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: progressionRef.current,
                        start: 'top 80%',
                    },
                });
            }
        }
    }, []);

    const collaboration = {
        heading:
            content?.heading ||
            ARCHITECT_SERVICES_CONTENT.collaboration.heading,
        subtitle:
            content?.subtitle ||
            ARCHITECT_SERVICES_CONTENT.collaboration.subtitle,
        paragraph:
            content?.paragraph ||
            ARCHITECT_SERVICES_CONTENT.collaboration.paragraph,
        progression:
            content?.progression ||
            ARCHITECT_SERVICES_CONTENT.collaboration.progression,
    };

    return (
        <section
            aria-label="Project Collaboration Progression"
            className="bg-ivory-warm border-border-subtle relative border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                {/* Header */}
                <div ref={textRef} className="mx-auto max-w-3xl text-center">
                    <span className="text-bronze font-sans text-xs tracking-[0.25em] uppercase">
                        {collaboration.subtitle}
                    </span>

                    <h2 className="text-graphite mt-4 font-serif text-3xl leading-[1.12] font-light sm:text-4xl md:text-5xl">
                        {collaboration.heading}
                    </h2>

                    <p className="text-graphite/85 mt-6 font-sans text-base leading-relaxed font-light sm:text-lg">
                        {collaboration.paragraph}
                    </p>
                </div>

                {/* 5-Stage Conceptual Progression Strip */}
                <div ref={progressionRef} className="relative mt-12 lg:mt-16">
                    {/* Horizontal connecting line on desktop */}
                    <div
                        aria-hidden="true"
                        className="bg-border-stone absolute top-[28px] right-12 left-12 hidden h-px lg:block"
                    />

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
                        {collaboration.progression.map(
                            (
                                item: { stage: string; title: string },
                                idx: number,
                            ) => (
                                <div
                                    key={item.stage}
                                    className="prog-step group relative flex flex-col items-center text-center"
                                >
                                    {/* Numbered Node */}
                                    <div className="border-bronze bg-ivory shadow-xs group-hover:bg-bronze relative z-10 flex h-14 w-14 items-center justify-center border transition-all duration-300 group-hover:text-white">
                                        <span className="font-mono text-xs font-semibold tracking-wider">
                                            {item.stage}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-graphite mt-6 font-serif text-base font-normal tracking-wide sm:text-lg">
                                        {item.title}
                                    </h3>

                                    {/* Mobile arrow indicator */}
                                    {idx <
                                        collaboration.progression.length -
                                            1 && (
                                        <div
                                            aria-hidden="true"
                                            className="text-stone/40 my-3 block lg:hidden"
                                        >
                                            ↓
                                        </div>
                                    )}
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </Container>
        </section>
    );
}
