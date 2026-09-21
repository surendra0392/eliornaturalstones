import { Section } from '../../layout/Section';
import { Container } from '../../layout/Container';
import { Button } from '../../ui/Button';
import { EliorImage } from '../../media/EliorImage';
import { HOMEPAGE_IMAGES } from '../../../data/homepageImages';
import { useGsapReveal } from '../../../hooks/useGsapReveal';
import { useGsapStagger } from '../../../hooks/useGsapStagger';

interface HeritageSectionProps {
    content?: {
        eyebrow?: string;
        heading?: string;
        since?: string;
        timeline?: Array<{
            year: string;
            entity: string;
            description: string;
            isHighlight?: boolean;
        }>;
    };
}

export function HeritageSection({ content }: HeritageSectionProps = {}) {
    const headerRevealRef = useGsapReveal<HTMLDivElement>({ type: 'text' });
    const timelineListRef = useGsapStagger<HTMLDivElement>({
        selector: ':scope > div',
        stagger: 0.1,
        yOffset: 18,
    });

    const eyebrow = content?.eyebrow || 'Lineage & Mastery';
    const heading = content?.heading || 'A Legacy in Natural Stone';
    const sinceText = content?.since || 'Since 1990';

    const timeline = content?.timeline || [
        {
            year: '1990',
            entity: 'SSS Enterprises',
            description:
                'Wholesale distribution of raw block slabs across Southern India.',
        },
        {
            year: '2017',
            entity: 'TEJ Natural Stones',
            description:
                'High-tech manufacturing and diamond saw processing with export development.',
        },
        {
            year: '2024',
            entity: 'STONEX',
            description: 'Premium quartz slab lines.',
        },
        {
            year: 'Today',
            entity: 'ELIOR',
            description: 'The evolution into a premium natural-stone identity.',
            isHighlight: true,
        },
    ];

    return (
        <Section
            background="warm"
            spacing="spacious"
            border="top"
            aria-label="Heritage & Lineage"
        >
            <Container size="wide">
                <div
                    ref={headerRevealRef}
                    className="border-border-stone mb-12 flex flex-col justify-between border-b pb-6 md:flex-row md:items-end"
                >
                    <div>
                        <p className="font-eyebrow">{eyebrow}</p>
                        <h2 className="font-display-md text-graphite mt-3 font-light">
                            {heading}
                        </h2>
                    </div>
                    <span className="text-taupe mt-3 font-serif text-xl font-light italic md:mt-0">
                        {sinceText}
                    </span>
                </div>

                {/* Split Composition: Imagery Pair (Industrial Quarry + Contemporary Architecture) and Timeline */}
                <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
                    {/* Left: Dual Image Pair */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-6">
                        <div className="border-border-subtle bg-ivory card-lift border shadow-xs">
                            <EliorImage
                                src={HOMEPAGE_IMAGES.heritage.quarry.src}
                                alt={HOMEPAGE_IMAGES.heritage.quarry.alt}
                                aspectRatio="3/4"
                                className="object-cover"
                            />
                            <div className="bg-ivory p-4">
                                <span className="font-caption text-taupe block text-[9px] tracking-widest uppercase">
                                    Quarry Foundation
                                </span>
                                <p className="font-body-sm text-graphite mt-1">
                                    Ancestral Stone Extraction
                                </p>
                            </div>
                        </div>

                        <div className="border-border-subtle bg-ivory card-lift mt-0 border shadow-xs sm:mt-10">
                            <EliorImage
                                src={HOMEPAGE_IMAGES.heritage.modern.src}
                                alt={HOMEPAGE_IMAGES.heritage.modern.alt}
                                aspectRatio="3/4"
                                className="object-cover"
                            />
                            <div className="bg-ivory p-4">
                                <span className="font-caption text-taupe block text-[9px] tracking-widest uppercase">
                                    Contemporary Space
                                </span>
                                <p className="font-body-sm text-graphite mt-1">
                                    Architectural Permanence
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Restrained Historical Evolution Timeline */}
                    <div className="lg:col-span-6 lg:pl-6">
                        <p className="font-body-lg text-graphite-muted leading-relaxed">
                            Over three decades of dedication to stone
                            craftsmanship - from direct quarry block distribution
                            to state-of-the-art precision saw fabrication and
                            architectural curation.
                        </p>

                        <div
                            ref={timelineListRef}
                            className="border-border-stone mt-10 space-y-7 border-l pl-6 sm:pl-8"
                        >
                            {timeline.map((step) => (
                                <div
                                    key={step.year}
                                    className="relative transition-all duration-300"
                                >
                                    {/* Timeline Marker Dot */}
                                    <div
                                        className={`absolute top-1.5 -left-[31px] h-3.5 w-3.5 rounded-full border-2 sm:-left-[39px] ${
                                            step.isHighlight
                                                ? 'border-bronze bg-bronze'
                                                : 'border-taupe bg-ivory'
                                        }`}
                                        aria-hidden="true"
                                    />

                                    <div className="flex items-baseline space-x-3">
                                        <span className="font-caption text-bronze font-medium tracking-widest uppercase">
                                            {step.year}
                                        </span>
                                        <h3 className="text-graphite font-serif text-xl font-normal">
                                            {step.entity}
                                        </h3>
                                    </div>

                                    <p className="font-body-sm text-graphite-muted mt-2 max-w-md leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12">
                            <Button
                                href="/our-story"
                                variant="primary"
                                size="md"
                            >
                                Our Story
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
}
