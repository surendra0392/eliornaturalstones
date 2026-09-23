import { useRef, useEffect } from 'react';
import { Container } from '../../layout/Container';
import { EliorImage } from '../../media/EliorImage';
import { SOURCE_TO_SPACE_IMAGES } from '../../../data/sourceToSpaceImages';
import {
    SOURCE_TO_SPACE_CONTENT,
    type JourneyStage,
} from '../../../data/sourceToSpaceContent';
import {
    verticalTextReveal,
    staggerReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';

interface JourneySectionProps {
    content?: {
        heading?: string;
        subline?: string;
        stages?: JourneyStage[];
    };
}

export function JourneySection({ content }: JourneySectionProps = {}) {
    const headerRef = useRef<HTMLDivElement | null>(null);
    const stripRef = useRef<HTMLDivElement | null>(null);

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

        if (stripRef.current) {
            const cards = stripRef.current.querySelectorAll('.journey-card');
            if (cards.length > 0) {
                staggerReveal(Array.from(cards) as HTMLElement[], {
                    stagger: 0.1,
                    duration: 0.85,
                    scrollTrigger: {
                        trigger: stripRef.current,
                        start: 'top 80%',
                    },
                });
            }
        }
    }, []);

    const journey = {
        heading: content?.heading || SOURCE_TO_SPACE_CONTENT.journey.heading,
        subline: content?.subline || SOURCE_TO_SPACE_CONTENT.journey.subline,
        stages: content?.stages || SOURCE_TO_SPACE_CONTENT.journey.stages,
    };

    const getJourneyImage = (slug: string) => {
        switch (slug) {
            case 'quarries':
                return SOURCE_TO_SPACE_IMAGES.journey.quarries;
            case 'processing':
                return SOURCE_TO_SPACE_IMAGES.journey.processing;
            case 'selection':
                return SOURCE_TO_SPACE_IMAGES.journey.selection;
            case 'packaging':
                return SOURCE_TO_SPACE_IMAGES.journey.packaging;
            case 'all-over-india':
            case 'pan-india':
            case 'worldwide':
                return SOURCE_TO_SPACE_IMAGES.journey.worldwide;
            case 'spaces':
            default:
                return SOURCE_TO_SPACE_IMAGES.journey.spaces;
        }
    };

    return (
        <section
            id="journey"
            aria-label="The Six-Stage Journey"
            className="bg-ivory-warm border-border-subtle relative border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                {/* Section Header */}
                <div ref={headerRef} className="max-w-2xl text-left">
                    <span className="text-bronze font-sans text-xs tracking-[0.25em] uppercase">
                        CHRONOLOGY OF CRAFT
                    </span>
                    <h2 className="text-graphite mt-3 font-serif text-3xl leading-tight font-light sm:text-4xl md:text-5xl">
                        {journey.heading}
                    </h2>
                    <p className="text-graphite/70 mt-3 font-sans text-base font-light sm:text-lg">
                        {journey.subline}
                    </p>
                </div>

                {/* Narrative Strip: 6 Stages. Horizontal 6-cols on large desktop, vertical stack on mobile */}
                <div ref={stripRef} className="relative mt-12 lg:mt-16">
                    {/* Horizontal connecting line on desktop */}
                    <div
                        aria-hidden="true"
                        className="bg-border-stone absolute top-[115px] right-6 left-6 hidden h-px lg:block"
                    />

                    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4 xl:gap-6">
                        {journey.stages.map((stage: JourneyStage) => {
                            const img = getJourneyImage(stage.slug);
                            return (
                                <div
                                    key={stage.index}
                                    className="journey-card group relative flex flex-col"
                                >
                                    {/* Stage Numerical Marker */}
                                    <div className="flex items-center space-x-2">
                                        <div className="border-bronze bg-ivory shadow-xs flex h-8 w-8 items-center justify-center border">
                                            <span className="text-graphite font-mono text-xs font-medium">
                                                {stage.index}
                                            </span>
                                        </div>
                                        <span className="text-stone-dark font-sans text-[10px] tracking-[0.2em] uppercase">
                                            STAGE
                                        </span>
                                    </div>

                                    {/* Supporting Image Thumbnail */}
                                    <div className="bg-stone-light border-border-stone mt-5 aspect-[4/3] w-full overflow-hidden border shadow-xs transition-transform duration-500 ease-out group-hover:scale-[1.03]">
                                        <EliorImage
                                            src={img.src}
                                            alt={img.alt}
                                            aspectRatio="4/3"
                                            className="h-full w-full object-cover contrast-105 grayscale transition-all duration-700 group-hover:grayscale-0"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 16vw"
                                        />
                                    </div>

                                    {/* Stage Title */}
                                    <h3 className="text-graphite mt-5 font-serif text-lg font-medium tracking-wide lg:text-base xl:text-lg">
                                        {stage.title}
                                    </h3>

                                    {/* Stage Description */}
                                    <p className="text-graphite/75 mt-2 font-sans text-xs leading-relaxed font-light">
                                        {stage.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Container>
        </section>
    );
}
