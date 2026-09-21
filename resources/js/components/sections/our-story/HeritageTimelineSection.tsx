import { useRef, useEffect } from 'react';
import { Container } from '../../layout/Container';
import { EliorImage } from '../../media/EliorImage';
import { OUR_STORY_IMAGES } from '../../../data/ourStoryImages';
import {
    OUR_STORY_CONTENT,
    type TimelineMilestone,
} from '../../../data/ourStoryContent';
import {
    verticalTextReveal,
    staggerReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';

interface HeritageTimelineProps {
    content?: {
        heading?: string;
        subline?: string;
        milestones?: TimelineMilestone[];
    };
}

export function HeritageTimelineSection({
    content,
}: HeritageTimelineProps = {}) {
    const headerRef = useRef<HTMLDivElement | null>(null);
    const timelineRef = useRef<HTMLDivElement | null>(null);

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

        if (timelineRef.current) {
            const items =
                timelineRef.current.querySelectorAll('.timeline-node');
            if (items.length > 0) {
                staggerReveal(Array.from(items) as HTMLElement[], {
                    stagger: 0.15,
                    duration: 0.9,
                    scrollTrigger: {
                        trigger: timelineRef.current,
                        start: 'top 80%',
                    },
                });
            }
        }
    }, []);

    const timeline = {
        ...OUR_STORY_CONTENT.timeline,
        ...content,
    };

    const getImageForMilestone = (year: string) => {
        switch (year) {
            case '1990':
                return OUR_STORY_IMAGES.timeline['1990'];
            case '2017':
                return OUR_STORY_IMAGES.timeline['2017'];
            case '2024':
                return OUR_STORY_IMAGES.timeline['2024'];
            case 'TODAY':
            default:
                return OUR_STORY_IMAGES.timeline.today;
        }
    };

    return (
        <section
            id="timeline"
            aria-label="The Journey Timeline"
            className="bg-ivory-warm border-border-subtle relative border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                {/* Section Header */}
                <div ref={headerRef} className="max-w-2xl text-left">
                    <span className="text-bronze font-sans text-xs tracking-[0.25em] uppercase">
                        CHRONOLOGY
                    </span>
                    <h2 className="text-graphite mt-3 font-serif text-3xl leading-tight font-light sm:text-4xl md:text-5xl">
                        {timeline.heading}
                    </h2>
                    <p className="text-graphite/70 mt-3 font-sans text-base font-light sm:text-lg">
                        {timeline.subline}
                    </p>
                </div>

                {/* Timeline Grid: Horizontal on Desktop (lg:grid-cols-4), Vertical on Mobile */}
                <div ref={timelineRef} className="relative mt-12 lg:mt-16">
                    {/* Desktop Horizontal Connecting Line (hidden on mobile) */}
                    <div
                        aria-hidden="true"
                        className="bg-border-stone absolute top-[148px] right-8 left-8 hidden h-px lg:block"
                    />

                    <div className="grid grid-cols-1 gap-12 sm:gap-16 lg:grid-cols-4 lg:gap-8">
                        {timeline.milestones.map((item: TimelineMilestone) => {
                            const image = getImageForMilestone(item.year);
                            return (
                                <div
                                    key={item.year}
                                    className="timeline-node group relative flex flex-col"
                                >
                                    {/* Mobile vertical line connector */}
                                    <div
                                        aria-hidden="true"
                                        className="bg-border-stone absolute top-0 bottom-0 left-[18px] w-px lg:hidden"
                                    />

                                    {/* Milestone Card Content */}
                                    <div className="relative pl-10 lg:pl-0">
                                        {/* Milestone Node Marker */}
                                        <div className="flex items-center space-x-3">
                                            <div className="border-bronze bg-ivory shadow-xs absolute left-0 flex h-9 w-9 items-center justify-center border lg:relative">
                                                <span className="text-graphite font-mono text-xs font-medium">
                                                    {item.index}
                                                </span>
                                            </div>
                                            <span className="text-bronze hidden font-sans text-[10px] tracking-[0.2em] uppercase lg:inline-block">
                                                {item.badge}
                                            </span>
                                        </div>

                                        {/* Supporting Visual Thumbnail */}
                                        <div className="bg-stone-light border-border-stone mt-6 aspect-[16/10] w-full overflow-hidden border shadow-xs transition-transform duration-500 ease-out group-hover:scale-[1.02]">
                                            <EliorImage
                                                src={image.src}
                                                alt={image.alt}
                                                aspectRatio="16/9"
                                                className="h-full w-full object-cover contrast-105 grayscale transition-all duration-700 group-hover:grayscale-0"
                                                sizes="(max-width: 1024px) 100vw, 25vw"
                                            />
                                        </div>

                                        {/* Year Display */}
                                        <div className="border-stone/15 mt-6 flex items-baseline justify-between border-b pb-2">
                                            <span className="text-graphite font-serif text-3xl font-light sm:text-4xl lg:text-4xl xl:text-5xl">
                                                {item.year}
                                            </span>
                                            <span className="text-bronze font-sans text-[10px] tracking-[0.2em] uppercase lg:hidden">
                                                {item.badge}
                                            </span>
                                        </div>

                                        {/* Company / Entity Title */}
                                        <h3 className="text-graphite mt-4 font-serif text-xl font-normal">
                                            {item.company}
                                        </h3>

                                        {/* Narrative Description */}
                                        <p className="text-graphite/75 mt-2 font-sans text-sm leading-relaxed font-light">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Container>
        </section>
    );
}
