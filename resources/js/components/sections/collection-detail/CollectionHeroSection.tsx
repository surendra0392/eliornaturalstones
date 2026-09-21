import { useRef, useEffect } from 'react';
import { Container } from '../../layout/Container';
import { ArchitecturalHeroImage } from '../../media/ArchitecturalHeroImage';
import { Button } from '../../ui/Button';
import {
    verticalTextReveal,
    prefersReducedMotion,
} from '../../../animations/gsap';
import type { CollectionEditorialData } from '../../../data/collectionDetailImages';

interface CollectionHeroSectionProps {
    collectionName: string;
    editorialData: CollectionEditorialData;
}

export function CollectionHeroSection({
    collectionName,
    editorialData,
}: CollectionHeroSectionProps) {
    const contentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!contentRef.current || prefersReducedMotion()) return;
        verticalTextReveal(contentRef.current, { duration: 1.1, delay: 0.15 });
    }, []);

    return (
        <section
            aria-label={`${collectionName} Hero`}
            className="relative w-full overflow-hidden"
        >
            <ArchitecturalHeroImage
                src={editorialData.heroImage.src}
                alt={editorialData.heroImage.alt}
                priority={true}
                height="standard"
                overlay="gradient"
                containerClassName="relative min-h-[50vh] lg:min-h-[58vh]"
            >
                <Container className="w-full pt-16 pb-12 sm:pt-20 sm:pb-14 lg:pt-24 lg:pb-16">
                    <div ref={contentRef} className="max-w-4xl text-left">
                        {/* Eyebrow & Index Indicator */}
                        <div className="mb-4 flex items-center gap-4 text-white/90">
                            <span className="text-bronze text-[11px] font-medium tracking-[0.32em] uppercase">
                                ELIOR / NATURAL STONES
                            </span>
                            <span
                                className="bg-bronze/60 h-[1px] w-8"
                                aria-hidden="true"
                            />
                            <span className="text-ivory/80 text-[11px] tracking-[0.28em] uppercase">
                                {editorialData.index} / 09
                            </span>
                        </div>

                        {/* Singular Page <h1> */}
                        <h1 className="font-serif text-4xl leading-[1.1] font-light tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                            {collectionName}
                        </h1>

                        {/* Dynamic Editorial Descriptor */}
                        <p className="mt-3 max-w-2xl font-serif text-lg leading-relaxed font-light text-white/85 italic sm:text-xl lg:text-2xl">
                            {editorialData.descriptor}
                        </p>

                        {/* Anchor Action */}
                        <div className="mt-6 flex items-center gap-4">
                            <Button
                                variant="secondary"
                                href="#varieties"
                                className="hover:!text-graphite !border-white/40 !bg-white/10 !text-white backdrop-blur-xs transition-all hover:!border-white hover:!bg-white"
                            >
                                Explore Varieties
                            </Button>
                        </div>
                    </div>
                </Container>
            </ArchitecturalHeroImage>
        </section>
    );
}
