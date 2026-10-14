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
        <Section className="border-b border-stone-200 bg-[#FAF9F5] py-20 lg:py-28 dark:border-stone-800 dark:bg-stone-900/50">
            <Container>
                {/* Section Header */}
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.26em] text-amber-800 uppercase dark:text-amber-400">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-600" />
                            <span>ARCHITECTURAL CURATION • 5:4 PROPORTION</span>
                        </div>
                        <h2 className="mt-3 font-serif text-3xl font-light tracking-tight text-stone-900 sm:text-4xl lg:text-5xl dark:text-stone-100">
                            The Architectural Gallery
                        </h2>
                        <p className="mt-4 font-sans text-base leading-relaxed text-stone-600 dark:text-stone-300">
                            Bespoke living pavilions, master spa suites, and carved monoliths executed
                            in rare Italian marble and crystalline onyx reserves across India.
                        </p>
                    </div>

                    <div className="shrink-0">
                        <Button asChild variant="secondary">
                            <Link href="/gallery" className="inline-flex items-center gap-2">
                                <span>View Full Gallery (29 Works)</span>
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Exactly Two Rows Grid: 3 columns x 2 rows = 6 items */}
                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {displayItems.map((item) => {
                        const imgUrl = item.thumb_url || item.image_url;

                        return (
                            <Link
                                key={item.id}
                                href="/gallery"
                                className="group relative block overflow-hidden rounded-lg border border-stone-200/80 bg-white transition-all duration-300 hover:border-amber-700/40 hover:shadow-xl dark:border-stone-800 dark:bg-stone-900"
                            >
                                {/* 5:4 Frame */}
                                <div className="relative aspect-[5/4] w-full overflow-hidden bg-stone-100 dark:bg-stone-950">
                                    {imgUrl ? (
                                        <img
                                            src={imgUrl}
                                            alt={item.title}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center font-mono text-xs text-stone-400">
                                            5:4 Composition
                                        </div>
                                    )}

                                    {/* Hover Vignette Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                    {/* Featured Badge */}
                                    {item.is_featured && (
                                        <div className="absolute top-3 left-3 rounded-full bg-amber-500/90 px-2.5 py-0.5 font-mono text-[9px] font-medium tracking-wider text-white uppercase backdrop-blur-xs shadow-xs">
                                            Masterpiece
                                        </div>
                                    )}

                                    {/* Hover Details */}
                                    <div className="absolute right-0 bottom-0 left-0 translate-y-2 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                        <span className="font-mono text-[10px] tracking-widest text-amber-300 uppercase">
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

                                {/* Card Base Info */}
                                <div className="p-4 sm:p-5">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-[10px] font-medium tracking-wider text-amber-800 uppercase dark:text-amber-400">
                                            {item.category}
                                        </span>
                                        {item.space_type && (
                                            <span className="font-mono text-[10px] text-stone-400">
                                                {item.space_type}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="mt-1 font-serif text-base font-normal text-stone-900 group-hover:text-amber-800 dark:text-stone-100 dark:group-hover:text-amber-300">
                                        {item.title}
                                    </h3>
                                    {item.material && (
                                        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                                            <span className="font-medium text-stone-700 dark:text-stone-300">
                                                Stone:
                                            </span>{' '}
                                            {item.material}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile Direct Link */}
                <div className="mt-8 text-center md:hidden">
                    <Button asChild variant="secondary" className="w-full">
                        <Link href="/gallery">View Full Gallery (29 Works)</Link>
                    </Button>
                </div>
            </Container>
        </Section>
    );
}
