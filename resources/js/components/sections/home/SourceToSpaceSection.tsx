import { Section } from '../../layout/Section';
import { Container } from '../../layout/Container';
import { Button } from '../../ui/Button';
import { EliorImage } from '../../media/EliorImage';
import { HOMEPAGE_IMAGES } from '../../../data/homepageImages';
import { useGsapReveal } from '../../../hooks/useGsapReveal';
import { useGsapStagger } from '../../../hooks/useGsapStagger';

interface SourceToSpaceSectionProps {
    content?: {
        eyebrow?: string;
        heading?: string;
        description?: string;
        ctaText?: string;
        ctaHref?: string;
    };
}

export function SourceToSpaceSection({ content }: SourceToSpaceSectionProps = {}) {
    const headerRevealRef = useGsapReveal<HTMLDivElement>({ type: 'text' });
    const stagesGridRef = useGsapStagger<HTMLDivElement>({
        selector: ':scope > div',
        stagger: 0.08,
        yOffset: 20,
    });

    const eyebrow = content?.eyebrow || 'The Material Journey';
    const heading = content?.heading || 'From Source to Space';
    const description =
        content?.description ||
        'Every ELIOR material begins with the earth and travels through a considered process before becoming part of a space.';
    const ctaText = content?.ctaText || 'Discover the Journey';
    const ctaHref = content?.ctaHref || '/from-source-to-space';

    return (
        <Section
            background="ivory"
            spacing="spacious"
            border="none"
            aria-label="From Source to Space Journey"
        >
            <Container>
                {/* Header */}
                <div
                    ref={headerRevealRef}
                    className="border-border-stone mb-10 flex flex-col justify-between border-b pb-6 md:flex-row md:items-end lg:mb-12"
                >
                    <div className="max-w-2xl">
                        <p className="font-eyebrow">{eyebrow}</p>
                        <h2 className="font-display-md text-graphite mt-3 font-light">
                            {heading}
                        </h2>
                        <p className="font-body text-graphite-muted mt-2.5">
                            {description}
                        </p>
                    </div>

                    <div className="mt-6 md:mt-0">
                        <Button
                            href={ctaHref}
                            variant="primary"
                            size="md"
                        >
                            {ctaText}
                        </Button>
                    </div>
                </div>

                {/* 6-Stage Progression: 6 Columns on large screens, 3 columns on tablet, vertical on mobile */}
                <div
                    ref={stagesGridRef}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-6"
                >
                    {HOMEPAGE_IMAGES.sourceToSpace.map((item, idx) => (
                        <div
                            key={item.stage}
                            className="group border-border-subtle bg-ivory-light hover:border-bronze/60 hover:shadow-[0_16px_40px_-15px_rgba(15,15,15,0.08)] hover:-translate-y-1.5 relative flex flex-col border p-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        >
                            {/* Card Stage Tag */}
                            <div className="flex items-center justify-between pb-3">
                                <span className="text-bronze font-serif text-lg font-light">
                                    {item.stage}
                                </span>
                                <span className="font-caption text-taupe text-[9px] font-medium tracking-widest uppercase">
                                    Stage 0{idx + 1}
                                </span>
                            </div>

                            {/* Stage Visual */}
                            <div className="border-border-subtle/60 relative overflow-hidden border">
                                <EliorImage
                                    src={item.src}
                                    alt={`${item.title} - Stage ${item.stage}`}
                                    aspectRatio="4/3"
                                    className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                                />
                            </div>

                            {/* Stage Narrative */}
                            <div className="flex flex-1 flex-col justify-between pt-4">
                                <div>
                                    <h3 className="text-graphite group-hover:text-bronze font-serif text-lg font-normal transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="font-body-sm text-graphite-muted mt-2 text-xs leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </Section>
    );
}
