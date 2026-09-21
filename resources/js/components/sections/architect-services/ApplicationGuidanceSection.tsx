import { useRef, useEffect } from 'react';
import { Container } from '../../layout/Container';
import { EliorImage } from '../../media/EliorImage';
import { ARCHITECT_SERVICES_IMAGES } from '../../../data/architectServicesImages';
import {
    ARCHITECT_SERVICES_CONTENT,
    type ApplicationCategory,
} from '../../../data/architectServicesContent';
import {
    verticalTextReveal,
    staggerReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';

interface ApplicationGuidanceSectionProps {
    content?: {
        heading?: string;
        subtitle?: string;
        categories?: ApplicationCategory[];
    };
}

export function ApplicationGuidanceSection({ content }: ApplicationGuidanceSectionProps = {}) {
    const headerRef = useRef<HTMLDivElement | null>(null);
    const matrixRef = useRef<HTMLDivElement | null>(null);

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

        if (matrixRef.current) {
            const cards = matrixRef.current.querySelectorAll('.app-card');
            if (cards.length > 0) {
                staggerReveal(Array.from(cards) as HTMLElement[], {
                    stagger: 0.1,
                    duration: 0.85,
                    scrollTrigger: {
                        trigger: matrixRef.current,
                        start: 'top 80%',
                    },
                });
            }
        }
    }, []);

    const applications = {
        heading:
            content?.heading || ARCHITECT_SERVICES_CONTENT.applications.heading,
        subtitle:
            content?.subtitle ||
            ARCHITECT_SERVICES_CONTENT.applications.subtitle,
        categories:
            content?.categories ||
            ARCHITECT_SERVICES_CONTENT.applications.categories,
    };

    const getApplicationImage = (title: string) => {
        switch (title) {
            case 'INTERIOR FLOORS':
                return ARCHITECT_SERVICES_IMAGES.applications.floors;
            case 'WALL SURFACES':
                return ARCHITECT_SERVICES_IMAGES.applications.walls;
            case 'KITCHEN / WORK SURFACES':
                return ARCHITECT_SERVICES_IMAGES.applications.workSurfaces;
            case 'EXTERIOR / LANDSCAPE':
            default:
                return ARCHITECT_SERVICES_IMAGES.applications.landscape;
        }
    };

    return (
        <section
            aria-label="Application Guidance Matrix"
            className="bg-ivory border-border-subtle relative border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                {/* Header */}
                <div ref={headerRef} className="max-w-2xl text-left">
                    <span className="text-bronze font-sans text-xs tracking-[0.25em] uppercase">
                        {applications.subtitle}
                    </span>
                    <h2 className="text-graphite mt-3 font-serif text-3xl leading-tight font-light sm:text-4xl md:text-5xl">
                        {applications.heading}
                    </h2>
                    <p className="text-graphite/70 mt-3 font-sans text-base font-light sm:text-lg">
                        Design-led spatial considerations for key architectural
                        typologies.
                    </p>
                </div>

                {/* 4-Column Application Matrix */}
                <div
                    ref={matrixRef}
                    className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-8"
                >
                    {applications.categories.map(
                        (category: ApplicationCategory) => {
                            const img = getApplicationImage(category.title);
                            return (
                                <div
                                    key={category.title}
                                    className="app-card group border-border-stone hover:border-bronze/70 card-lift flex flex-col justify-between border bg-ivory-warm/40 p-6 transition-all duration-500 shadow-xs hover:shadow-[0_16px_40px_-15px_rgba(15,15,15,0.08)]"
                                >
                                    <div>
                                        {/* Image Thumbnail */}
                                        <div className="bg-stone/10 aspect-[4/3] w-full overflow-hidden">
                                            <EliorImage
                                                src={img.src}
                                                alt={img.alt}
                                                aspectRatio="4/3"
                                                className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            />
                                        </div>

                                        <span className="text-bronze mt-5 block font-sans text-[10px] tracking-[0.2em] uppercase">
                                            {category.subtitle}
                                        </span>

                                        <h3 className="text-graphite mt-2 font-serif text-xl font-normal">
                                            {category.title}
                                        </h3>

                                        {/* Considerations Checklist */}
                                        <div className="border-stone/15 mt-6 border-t pt-4">
                                            <span className="text-graphite/50 font-sans text-[10px] tracking-wider uppercase">
                                                CONSIDERATIONS:
                                            </span>
                                            <ul className="text-graphite/80 mt-3 space-y-2 font-sans text-xs font-light">
                                                {category.considerations.map(
                                                    (c: string) => (
                                                        <li
                                                            key={c}
                                                            className="flex items-center space-x-2"
                                                        >
                                                            <span
                                                                aria-hidden="true"
                                                                className="bg-bronze/60 h-1 w-1 rounded-full"
                                                            />
                                                            <span>{c}</span>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            );
                        },
                    )}
                </div>
            </Container>
        </section>
    );
}
