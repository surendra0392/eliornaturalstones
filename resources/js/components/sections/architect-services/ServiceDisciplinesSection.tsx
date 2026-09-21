import { useRef, useEffect } from 'react';
import { Container } from '../../layout/Container';
import {
    ARCHITECT_SERVICES_CONTENT,
    type ServiceDiscipline,
} from '../../../data/architectServicesContent';
import {
    verticalTextReveal,
    staggerReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';

interface ServiceDisciplinesSectionProps {
    content?: {
        heading?: string;
        subline?: string;
        disciplines?: ServiceDiscipline[];
    };
}

export function ServiceDisciplinesSection({ content }: ServiceDisciplinesSectionProps = {}) {
    const headerRef = useRef<HTMLDivElement | null>(null);
    const gridRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (prefersReducedMotion()) return;

        if (headerRef.current) {
            verticalTextReveal(headerRef.current, {
                duration: 1.0,
                scrollTrigger: {
                    trigger: headerRef.current,
                    start: 'top 85%',
                },
            });
        }

        if (gridRef.current) {
            const cards = gridRef.current.querySelectorAll('.service-card');
            if (cards.length > 0) {
                staggerReveal(Array.from(cards) as HTMLElement[], {
                    stagger: 0.1,
                    duration: 0.85,
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: 'top 80%',
                    },
                });
            }
        }
    }, []);

    const services = {
        heading: content?.heading || ARCHITECT_SERVICES_CONTENT.services.heading,
        subline: content?.subline || ARCHITECT_SERVICES_CONTENT.services.subline,
        disciplines:
            content?.disciplines ||
            ARCHITECT_SERVICES_CONTENT.services.disciplines,
    };

    return (
        <section
            id="services"
            aria-label="Six Service Disciplines"
            className="bg-ivory-warm border-border-subtle relative border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                {/* Section Header */}
                <div ref={headerRef} className="max-w-2xl text-left">
                    <span className="text-bronze font-sans text-xs tracking-[0.25em] uppercase">
                        AREAS OF EXPERTISE
                    </span>
                    <h2 className="text-graphite mt-3 font-serif text-3xl leading-tight font-light sm:text-4xl md:text-5xl">
                        {services.heading}
                    </h2>
                    <p className="text-graphite/70 mt-3 font-sans text-base font-light sm:text-lg">
                        {services.subline}
                    </p>
                </div>

                {/* 3x2 Service Grid on Desktop, 2 cols on Tablet, 1 col on Mobile */}
                <div
                    ref={gridRef}
                    className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8"
                >
                    {services.disciplines.map((srv: ServiceDiscipline) => (
                        <div
                            key={srv.index}
                            className="service-card group border-border-stone hover:border-bronze/70 card-lift flex flex-col justify-between border bg-ivory p-8 transition-all duration-500 shadow-xs hover:shadow-[0_16px_40px_-15px_rgba(15,15,15,0.08)]"
                        >
                            <div>
                                {/* Index Numerals */}
                                <div className="flex items-center justify-between">
                                    <span className="text-bronze font-mono text-xs font-semibold tracking-wider">
                                        {srv.index}
                                    </span>
                                    <span className="text-stone-dark font-sans text-[10px] tracking-[0.2em] uppercase">
                                        DISCIPLINE
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-graphite mt-6 font-serif text-2xl font-normal tracking-wide">
                                    {srv.title}
                                </h3>

                                {/* Description */}
                                <p className="text-graphite/75 mt-4 font-sans text-sm leading-relaxed font-light">
                                    {srv.description}
                                </p>
                            </div>

                            {/* Subtle Editorial Arrow Indicator */}
                            <div className="text-stone/60 group-hover:text-bronze mt-8 flex items-center space-x-2 transition-colors duration-300">
                                <span className="font-sans text-[11px] tracking-[0.2em] uppercase">
                                    EXPLORE DISCIPLINE
                                </span>
                                <span
                                    aria-hidden="true"
                                    className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                                >
                                    →
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
