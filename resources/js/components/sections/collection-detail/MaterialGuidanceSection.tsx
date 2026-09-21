import { Container } from '../../layout/Container';
import { useGsapReveal } from '../../../hooks/useGsapReveal';
import type { GuidanceItem } from '../../../data/collectionDetailImages';

interface MaterialGuidanceSectionProps {
    collectionName: string;
    guidance: GuidanceItem[];
}

export function MaterialGuidanceSection({
    collectionName,
    guidance,
}: MaterialGuidanceSectionProps) {
    const contentRef = useGsapReveal<HTMLDivElement>({
        type: 'fade',
        delay: 0.1,
    });

    return (
        <section
            aria-label={`${collectionName} Guidance`}
            className="border-border-subtle bg-ivory relative w-full border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
                    {/* Left Column: Heading & Context */}
                    <div className="lg:col-span-5">
                        <span className="text-bronze text-[10px] font-medium tracking-[0.3em] uppercase md:text-xs">
                            Architectural Specification
                        </span>
                        <h2 className="text-graphite mt-3 font-serif text-3xl font-light tracking-tight sm:text-4xl lg:text-5xl">
                            Consider the Material
                        </h2>
                        <p className="text-graphite-muted mt-6 text-sm leading-relaxed font-light">
                            Natural and engineered surfaces require thoughtful
                            integration with surrounding light, structural
                            substrates, and everyday spatial routines.
                        </p>
                        <div className="border-border-stone mt-10 border-t pt-8">
                            <p className="text-taupe text-xs italic">
                                ELIOR material consultants provide digital
                                mapping and slab selection support prior to dry
                                layout.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: 3-4 Concise Guidance Points */}
                    <div
                        ref={contentRef}
                        className="space-y-8 lg:col-span-7 lg:space-y-10"
                    >
                        {guidance.map((item, index) => (
                            <div
                                key={item.title}
                                className="border-border-stone border-b pb-8 last:border-b-0 last:pb-0"
                            >
                                <div className="flex items-baseline gap-4">
                                    <span className="text-bronze font-serif text-xs italic">
                                        0{index + 1}
                                    </span>
                                    <h3 className="text-graphite font-serif text-xl font-normal tracking-wide sm:text-2xl">
                                        {item.title}
                                    </h3>
                                </div>
                                <p className="text-graphite-muted mt-3 pl-7 text-xs leading-relaxed font-light sm:text-sm">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
