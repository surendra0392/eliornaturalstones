import { Container } from '../../layout/Container';
import { CollectionCard } from '../../cards/CollectionCard';
import { useGsapStagger } from '../../../hooks/useGsapStagger';
import type { Collection } from '../../../types/stone';

interface RelatedCollectionsSectionProps {
    relatedCollections: Collection[];
}

export function RelatedCollectionsSection({
    relatedCollections,
}: RelatedCollectionsSectionProps) {
    const gridRef = useGsapStagger<HTMLDivElement>({
        selector: 'article',
        y: 24,
        stagger: 0.1,
    });

    if (!relatedCollections || relatedCollections.length === 0) {
        return null;
    }

    return (
        <section
            aria-label="Related Collections"
            className="border-border-subtle bg-ivory-warm relative w-full border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                {/* Header */}
                <div className="border-border-stone mb-12 flex flex-col justify-between gap-4 border-b pb-8 sm:flex-row sm:items-end md:mb-16">
                    <div>
                        <span className="text-bronze text-[10px] font-medium tracking-[0.3em] uppercase md:text-xs">
                            Architectural Reserves
                        </span>
                        <h2 className="text-graphite mt-3 font-serif text-3xl font-light tracking-tight sm:text-4xl lg:text-5xl">
                            Continue Exploring
                        </h2>
                    </div>
                    <p className="text-graphite-muted text-xs tracking-wider uppercase">
                        Parallel Geological Reserves
                    </p>
                </div>

                {/* 3-Column Related Grid */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {relatedCollections.slice(0, 3).map((col, index) => (
                        <CollectionCard
                            key={col.id}
                            collection={col}
                            index={index}
                        />
                    ))}
                </div>
            </Container>
        </section>
    );
}
