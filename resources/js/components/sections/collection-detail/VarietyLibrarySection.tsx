import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Container } from '../../layout/Container';
import { EliorImage } from '../../media/EliorImage';
import { useGsapStagger } from '../../../hooks/useGsapStagger';
import { VarietyModal } from './VarietyModal';
import type { Variety } from '../../../types/stone';
import type { CollectionEditorialData } from '../../../data/collectionDetailImages';

interface VarietyLibrarySectionProps {
    collectionName: string;
    varieties: Variety[];
    editorialData: CollectionEditorialData;
}

export function VarietyLibrarySection({
    collectionName,
    varieties,
    editorialData,
}: VarietyLibrarySectionProps) {
    const [activeModalVariety, setActiveModalVariety] = useState<Variety | null>(null);
    const gridRef = useGsapStagger<HTMLDivElement>({
        selector: '.variety-card',
        y: 24,
        stagger: 0.08,
    });

    return (
        <section
            id="varieties"
            aria-label={`${collectionName} Varieties`}
            className="border-border-subtle bg-ivory relative w-full border-b py-16 md:py-20 lg:py-24"
        >
            <Container>
                {/* Section Heading */}
                <div className="border-border-stone mb-12 flex flex-col justify-between gap-6 border-b pb-8 sm:flex-row sm:items-end md:mb-16">
                    <div>
                        <span className="text-bronze text-[10px] font-medium tracking-[0.3em] uppercase md:text-xs">
                            Material Catalog
                        </span>
                        <h2 className="text-graphite mt-3 font-serif text-3xl font-light tracking-tight sm:text-4xl lg:text-5xl">
                            Explore the Varieties
                        </h2>
                        <p className="text-graphite-muted mt-2 font-serif text-base italic sm:text-lg">
                            Every stone carries its own character.
                        </p>
                    </div>

                    <div className="text-taupe text-xs tracking-wider uppercase">
                        {varieties.length}{' '}
                        {varieties.length === 1
                            ? 'Documented Variety'
                            : 'Documented Varieties'}
                    </div>
                </div>

                {/* Varieties Display */}
                {varieties.length > 0 ? (
                    <div
                        ref={gridRef}
                        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
                    >
                        {varieties.map((variety, idx) => {
                            const fallback =
                                editorialData.varietyFallbacks[variety.slug];
                            const imageSrc =
                                variety.slab_image ||
                                fallback?.src ||
                                editorialData.heroImage.src;
                            const imageAlt =
                                fallback?.alt ||
                                `${variety.name} stone variety slab`;

                            return (
                                <article
                                    key={variety.id || variety.slug}
                                    className="variety-card group border-border-stone bg-ivory-warm/30 hover:border-bronze/70 card-lift flex flex-col justify-between border transition-all duration-500 shadow-xs hover:shadow-[0_16px_40px_-15px_rgba(15,15,15,0.08)]"
                                >
                                    <div>
                                        {/* Variety Material Photography (Inspect Modal Trigger) */}
                                        <button
                                            type="button"
                                            onClick={() => setActiveModalVariety(variety)}
                                            className="group/img bg-stone-light relative aspect-[4/3] w-full overflow-hidden text-left cursor-zoom-in focus-visible:outline-2 focus-visible:outline-bronze"
                                            aria-label={`Inspect ${variety.name} architectural specimen`}
                                        >
                                            <EliorImage
                                                src={imageSrc}
                                                alt={imageAlt}
                                                aspectRatio="4/3"
                                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                            />
                                            {/* Subtle Index Tag */}
                                            <span className="bg-graphite/85 text-ivory absolute top-3 left-3 px-2 py-0.5 text-[10px] font-medium tracking-widest uppercase backdrop-blur-xs">
                                                {String(idx + 1).padStart(2, '0')}
                                            </span>
                                            {/* Hover Inspection Badge */}
                                            <div className="bg-graphite/30 opacity-0 group-hover/img:opacity-100 absolute inset-0 flex items-center justify-center transition-opacity duration-300">
                                                <span className="bg-ivory/95 text-graphite border-border-stone flex items-center gap-1.5 border px-3 py-1.5 text-[9px] font-medium tracking-[0.2em] uppercase shadow-md backdrop-blur-xs">
                                                    <svg
                                                        className="text-bronze h-3 w-3"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                                                        />
                                                    </svg>
                                                    Inspect Slab
                                                </span>
                                            </div>
                                        </button>

                                        {/* Variety Meta */}
                                        <div className="p-5 sm:p-5 lg:p-5 xl:p-6">
                                            {variety.color_family && (
                                                <span className="text-taupe block text-[10px] tracking-[0.24em] uppercase">
                                                    {variety.color_family}
                                                </span>
                                            )}

                                            <h3 className="text-graphite mt-1.5 font-serif text-lg xl:text-xl font-normal tracking-wide group-hover:text-bronze transition-colors duration-300">
                                                {variety.name}
                                            </h3>

                                            {variety.description && (
                                                <p className="text-graphite-muted mt-2.5 line-clamp-3 text-xs leading-relaxed font-light">
                                                    {variety.description}
                                                </p>
                                            )}

                                            {/* Finish Tags */}
                                            {variety.finishes &&
                                                variety.finishes.length > 0 && (
                                                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                                                        {variety.finishes.map(
                                                            (finish) => (
                                                                <span
                                                                    key={finish}
                                                                    className="border-border-stone bg-ivory text-graphite-muted border px-2 py-0.5 text-[9px] tracking-wider uppercase group-hover:border-border-subtle"
                                                                >
                                                                    {finish}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                    {/* Actions: Inspect & Enquire */}
                                    <div className="border-border-stone flex items-center justify-between border-t p-5 pt-3.5 sm:p-5 sm:pt-3.5 lg:p-5 lg:pt-3.5 xl:p-6 xl:pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setActiveModalVariety(variety)}
                                            className="text-graphite-muted hover:text-bronze focus-visible:outline-graphite inline-flex items-center text-[10px] tracking-[0.2em] uppercase transition-colors cursor-pointer focus-visible:outline-2"
                                        >
                                            <span>Inspect</span>
                                        </button>

                                        <Link
                                            href={`/contact?interest=${encodeURIComponent(variety.name)}&collection=${encodeURIComponent(collectionName)}`}
                                            className="text-graphite group-hover:text-bronze focus-visible:outline-graphite inline-flex items-center text-[10px] tracking-[0.24em] uppercase transition-colors focus-visible:outline-2"
                                        >
                                            <span>Enquire</span>
                                            <span
                                                className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1"
                                                aria-hidden="true"
                                            >
                                                →
                                            </span>
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    /* Graceful Empty State */
                    <div className="border-border-stone bg-ivory-warm border p-16 text-center">
                        <p className="text-graphite font-serif text-xl font-light">
                            Collection Reserve in Curation
                        </p>
                        <p className="text-graphite-muted mx-auto mt-3 max-w-md text-xs leading-relaxed font-light">
                            Specimens for {collectionName} are currently being
                            documented and catalogued directly from active
                            quarry allocations.
                        </p>
                        <div className="mt-8">
                            <Link
                                href="/contact"
                                className="text-bronze hover:text-graphite text-xs tracking-widest uppercase transition-colors"
                            >
                                Request Custom Quarry Allocation →
                            </Link>
                        </div>
                    </div>
                )}
            </Container>

            {/* Specimen Inspection Modal */}
            <VarietyModal
                variety={activeModalVariety}
                collectionName={collectionName}
                isOpen={!!activeModalVariety}
                onClose={() => setActiveModalVariety(null)}
                fallbackImage={
                    activeModalVariety
                        ? editorialData.varietyFallbacks[activeModalVariety.slug]
                        : undefined
                }
            />
        </section>
    );
}
