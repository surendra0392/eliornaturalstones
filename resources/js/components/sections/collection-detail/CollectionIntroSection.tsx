import { Container } from '../../layout/Container';
import { EliorImage } from '../../media/EliorImage';
import { useGsapReveal } from '../../../hooks/useGsapReveal';
import type { CollectionEditorialData } from '../../../data/collectionDetailImages';

interface CollectionIntroSectionProps {
    collectionName: string;
    editorialData: CollectionEditorialData;
}

export function CollectionIntroSection({
    collectionName,
    editorialData,
}: CollectionIntroSectionProps) {
    const textRef = useGsapReveal<HTMLDivElement>({
        type: 'text',
        delay: 0.1,
    });
    const imageRef = useGsapReveal<HTMLDivElement>({
        type: 'clip',
        delay: 0.2,
    });

    return (
        <section
            aria-label={`${collectionName} Introduction`}
            className="border-border-subtle bg-ivory relative w-full border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                {/* Editorial Section Header */}
                <div className="mb-14 md:mb-20">
                    <p className="text-bronze text-[10px] font-medium tracking-[0.3em] uppercase md:text-xs">
                        Editorial Introduction
                    </p>
                    <h2 className="text-graphite sr-only">
                        About {collectionName}
                    </h2>
                </div>

                {/* 2-Column Asymmetrical Split */}
                <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
                    {/* Left Column: Monumental Statement */}
                    <div ref={textRef} className="lg:col-span-6 xl:col-span-7">
                        <blockquote className="text-graphite font-serif text-2xl leading-relaxed font-light sm:text-3xl lg:text-4xl">
                            &ldquo;{editorialData.intro.statement}&rdquo;
                        </blockquote>

                        <div className="border-border-stone mt-10 border-t pt-8">
                            <span className="text-taupe text-[10px] tracking-[0.28em] uppercase">
                                Material Observation / ELIOR Archive
                            </span>
                        </div>
                    </div>

                    {/* Right Column: Narrative Analysis & Material Plate */}
                    <div className="space-y-10 lg:col-span-6 xl:col-span-5">
                        <div className="space-y-5">
                            {editorialData.intro.paragraphs.map((para, idx) => (
                                <p
                                    key={idx}
                                    className="text-graphite-muted text-sm leading-relaxed font-light sm:text-base"
                                >
                                    {para}
                                </p>
                            ))}
                        </div>

                        {/* Tactile Material Detail Plate */}
                        <div
                            ref={imageRef}
                            className="border-border-stone bg-ivory-warm overflow-hidden border p-3"
                        >
                            <div className="relative aspect-[3/2] overflow-hidden">
                                <EliorImage
                                    src={editorialData.intro.image.src}
                                    alt={editorialData.intro.image.alt}
                                    aspectRatio="3/2"
                                    className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                                />
                            </div>
                            <p className="text-taupe mt-3 px-1 text-[10px] tracking-wider">
                                {editorialData.intro.image.alt}
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
