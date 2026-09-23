import { Section } from '../../layout/Section';
import { Container } from '../../layout/Container';
import { CollectionCard } from '../../cards/CollectionCard';
import { Button } from '../../ui/Button';
import { useGsapReveal } from '../../../hooks/useGsapReveal';
import { useGsapStagger } from '../../../hooks/useGsapStagger';
import type { Collection } from '../../../types/stone';

interface CollectionsSectionProps {
    collections: Collection[];
}

export function CollectionsSection({ collections }: CollectionsSectionProps) {
    const headerRevealRef = useGsapReveal<HTMLDivElement>({ type: 'text' });
    const gridRef = useGsapStagger<HTMLDivElement>({
        selector: ':scope > div',
        stagger: 0.07,
        yOffset: 20,
    });

    // Ensure canonical collections ordered by sort_order
    const canonicalOrder = [
        'italian-marble',
        'granites',
        'slate-stone',
        'limestones',
        'sandstone',
        'sand-stone',
        'cobble-stones',
        'pebbles',
        'quartz',
        'sculptures',
    ];

    const sortedCollections = [...collections]
        .filter((col) => canonicalOrder.includes(col.slug))
        .sort((a, b) => {
            const orderA = a.sort_order ?? 0;
            const orderB = b.sort_order ?? 0;
            if (orderA !== orderB) {
                return orderA - orderB;
            }
            const indexA = canonicalOrder.indexOf(a.slug);
            const indexB = canonicalOrder.indexOf(b.slug);
            return (
                (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB)
            );
        });

    return (
        <Section
            background="warm"
            spacing="spacious"
            border="top"
            aria-label="Natural Stone Collections"
        >
            <Container>
                {/* Architectural Section Header */}
                <div
                    ref={headerRevealRef}
                    className="border-border-stone mb-10 flex flex-col justify-between border-b pb-6 md:flex-row md:items-end lg:mb-12"
                >
                    <div className="max-w-2xl">
                        <p className="font-eyebrow">Natural Stone Reserves</p>
                        <h2 className="font-display-md text-graphite mt-3 font-light">
                            Our Collections
                        </h2>
                        <p className="font-body text-graphite-muted mt-2.5">
                            Distinct materials. Considered for extraordinary
                            spaces.
                        </p>
                    </div>

                    <div className="mt-6 flex items-center space-x-4 md:mt-0">
                        <span className="font-caption text-taupe hidden tracking-widest uppercase sm:inline-block">
                            {String(sortedCollections.length).padStart(2, '0')} Canonical Reserves
                        </span>
                        <Button
                            href="/collections"
                            variant="secondary"
                            size="sm"
                        >
                            View All Reserves
                        </Button>
                    </div>
                </div>

                {/* Editorial Collection Grid - 4 Columns on Desktop, 2 on Tablet, 1 on Mobile */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7"
                >
                    {sortedCollections.map((collection, idx) => (
                        <div
                            key={collection.id || collection.slug}
                            className="transition-all duration-500"
                        >
                            <CollectionCard
                                collection={collection}
                                index={idx}
                            />
                        </div>
                    ))}
                </div>
            </Container>
        </Section>
    );
}
