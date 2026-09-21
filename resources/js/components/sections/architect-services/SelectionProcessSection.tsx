import { useRef, useEffect } from 'react';
import { Container } from '../../layout/Container';
import { EliorImage } from '../../media/EliorImage';
import { ARCHITECT_SERVICES_IMAGES } from '../../../data/architectServicesImages';
import {
    ARCHITECT_SERVICES_CONTENT,
    type SelectionStep,
} from '../../../data/architectServicesContent';
import {
    verticalTextReveal,
    staggerReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';

interface SelectionProcessSectionProps {
    content?: {
        heading?: string;
        subline?: string;
        steps?: Array<{
            step: string;
            title: string;
            description: string;
        }>;
    };
}

export function SelectionProcessSection({ content }: SelectionProcessSectionProps = {}) {
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
            const cards = gridRef.current.querySelectorAll('.process-card');
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

    const selectionProcess = {
        heading:
            content?.heading ||
            ARCHITECT_SERVICES_CONTENT.selectionProcess.heading,
        subline:
            content?.subline ||
            ARCHITECT_SERVICES_CONTENT.selectionProcess.subline,
        steps:
            content?.steps || ARCHITECT_SERVICES_CONTENT.selectionProcess.steps,
    };

    const getStepImage = (step: string) => {
        switch (step) {
            case '01':
                return ARCHITECT_SERVICES_IMAGES.selectionProcess.understand;
            case '02':
                return ARCHITECT_SERVICES_IMAGES.selectionProcess.explore;
            case '03':
                return ARCHITECT_SERVICES_IMAGES.selectionProcess.compare;
            case '04':
                return ARCHITECT_SERVICES_IMAGES.selectionProcess.refine;
            case '05':
            default:
                return ARCHITECT_SERVICES_IMAGES.selectionProcess.select;
        }
    };

    return (
        <section
            aria-label="The Material Selection Process"
            className="bg-ivory border-border-subtle relative border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                {/* Header */}
                <div ref={headerRef} className="max-w-2xl text-left">
                    <span className="text-bronze font-sans text-xs tracking-[0.25em] uppercase">
                        METHODICAL SELECTION
                    </span>
                    <h2 className="text-graphite mt-3 font-serif text-3xl leading-tight font-light sm:text-4xl md:text-5xl">
                        {selectionProcess.heading}
                    </h2>
                    <p className="text-graphite/70 mt-3 font-sans text-base font-light sm:text-lg">
                        {selectionProcess.subline}
                    </p>
                </div>

                {/* 5-Step Card Grid */}
                <div
                    ref={gridRef}
                    className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-5 lg:gap-6"
                >
                    {selectionProcess.steps.map((item: SelectionStep) => {
                        const img = getStepImage(item.step);
                        return (
                            <div
                                key={item.step}
                                className="process-card group border-border-stone hover:border-bronze/70 card-lift flex flex-col justify-between border bg-ivory-warm/40 p-5 transition-all duration-500 shadow-xs hover:shadow-[0_16px_40px_-15px_rgba(15,15,15,0.08)]"
                            >
                                <div>
                                    {/* Thumbnail Image */}
                                    <div className="bg-stone/10 aspect-[4/3] w-full overflow-hidden">
                                        <EliorImage
                                            src={img.src}
                                            alt={img.alt}
                                            aspectRatio="4/3"
                                            className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                                        />
                                    </div>

                                    {/* Number & Title */}
                                    <div className="mt-5 flex items-baseline space-x-2">
                                        <span className="text-bronze font-mono text-xs font-semibold">
                                            {item.step}
                                        </span>
                                        <h3 className="text-graphite font-serif text-lg font-medium">
                                            {item.title}
                                        </h3>
                                    </div>

                                    {/* Description */}
                                    <p className="text-graphite/75 mt-3 font-sans text-xs leading-relaxed font-light">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
