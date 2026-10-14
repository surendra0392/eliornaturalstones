import { Link } from '@inertiajs/react';
import { Container } from '../../layout/Container';
import { Section } from '../../layout/Section';
import { Button } from '../../ui/Button';
import type { GalleryItemData } from '../../../pages/frontend/Gallery/Index';

interface HomeGallerySectionProps {
    items?: GalleryItemData[];
}

export function HomeGallerySection({ items = [] }: HomeGallerySectionProps) {
    if (!items || items.length === 0) {
        return null;
    }

    // Two rows on 3-column desktop layout = exactly 6 items
    const displayItems = items.slice(0, 6);

    return (
        <Section
            background="warm"
            spacing="spacious"
            border="top"
            aria-label="The Architectural Gallery"
        >
            <Container>
                {/* Architectural Section Header (matching Collections & FeaturedProjects sections) */}
                <div className="border-border-stone mb-10 flex flex-col justify-between border-b pb-6 md:flex-row md:items-end lg:mb-12">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-[10px] tracking-[0.24em] text-bronze uppercase">
                                07
                            </span>
                            <span className="h-px w-6 bg-bronze/40" />
                            <p className="font-eyebrow text-stone-500 uppercase">
                                Architectural Curation • 5:4 Proportion
                            </p>
                        </div>
                        <h2 className="font-display-md text-graphite mt-3 font-light">
                            The Architectural Gallery
                        </h2>
                        <p className="font-body text-graphite-muted mt-2.5">
                            Bespoke living pavilions, master spa suites, and carved monoliths executed
                            in rare Italian marble and crystalline onyx reserves across India.
                        </p>
                    </div>

                    <div className="mt-6 flex items-center space-x-4 md:mt-0">
                        <span className="font-caption text-taupe hidden tracking-widest uppercase sm:inline-block">
                            29 Curated Works
                        </span>
                        <Button
                            href="/gallery"
                            variant="secondary"
                            size="sm"
                            arrow
                        >
                            View Full Gallery
                        </Button>
                    </div>
                </div>

                {/* Exactly Two Rows Grid: 3 columns x 2 rows = 6 items */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                    {displayItems.map((item) => {
                        const imgUrl = item.thumb_url || item.image_url;

                        return (
                            <Link
                                key={item.id}
                                href="/gallery"
                                className="group border-border-subtle bg-ivory-light hover:border-bronze/70 hover:shadow-[0_16px_40px_-15px_rgba(15,15,15,0.08)] hover:-translate-y-1.5 focus-visible:outline-graphite relative flex flex-col overflow-hidden border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2"
                            >
                                {/* 5:4 Architectural Frame */}
                                <div className="relative aspect-[5/4] w-full overflow-hidden bg-stone-light/40">
                                    {imgUrl ? (
                                        <img
                                            src={imgUrl}
                                            alt={item.title}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center font-mono text-xs text-graphite-muted">
                                            5:4 Composition
                                        </div>
                                    )}

                                    {/* Hover Vignette Overlay */}
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-graphite/75 via-graphite/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                        aria-hidden="true"
                                    />

                                    {/* Masterpiece Badge */}
                                    {item.is_featured && (
                                        <div className="bg-graphite/90 text-ivory absolute top-3 left-3 px-2.5 py-0.5 font-mono text-[9px] font-medium tracking-wider uppercase backdrop-blur-xs">
                                            Masterpiece
                                        </div>
                                    )}

                                    {/* Hover Details */}
                                    <div className="absolute right-0 bottom-0 left-0 translate-y-2 p-5 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                        <span className="text-champagne font-mono text-[10px] tracking-widest uppercase">
                                            {item.space_type || item.category}
                                        </span>
                                        <h3 className="mt-0.5 font-serif text-lg font-light text-white">
                                            {item.title}
                                        </h3>
                                        {item.material && (
                                            <p className="mt-1 font-sans text-xs text-stone-200">
                                                {item.material}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Card Base Information */}
                                <div className="flex flex-1 flex-col justify-between p-5 lg:p-6">
                                    <div>
                                        <div className="text-taupe flex items-center justify-between text-[10px] font-medium tracking-[0.24em] uppercase">
                                            <span>{item.category}</span>
                                            {item.space_type && (
                                                <span className="text-graphite-muted font-mono text-[10px]">
                                                    {item.space_type}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-graphite group-hover:text-bronze-dark mt-2.5 font-serif text-xl font-light tracking-[-0.01em] transition-colors duration-300">
                                            {item.title}
                                        </h3>
                                        {item.material && (
                                            <p className="text-graphite-muted mt-1.5 text-xs">
                                                <span className="text-graphite font-medium">Stone:</span>{' '}
                                                {item.material}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile Direct Link */}
                <div className="mt-10 text-center md:hidden">
                    <Button
                        href="/gallery"
                        variant="secondary"
                        className="w-full"
                        arrow
                    >
                        View Full Gallery (29 Works)
                    </Button>
                </div>
            </Container>
        </Section>
    );
}
