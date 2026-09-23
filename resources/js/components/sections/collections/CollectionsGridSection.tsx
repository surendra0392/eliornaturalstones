import { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { Section } from '../../layout/Section';
import { Container } from '../../layout/Container';
import { EliorImage } from '../../media/EliorImage';
import { COLLECTIONS_IMAGES } from '../../../data/collectionsImages';
import { useGsapReveal } from '../../../hooks/useGsapReveal';
import type { Collection } from '../../../types/stone';

interface CollectionsGridSectionProps {
    collections: Collection[];
}

type FilterCategory =
    | 'all'
    | 'interior'
    | 'exterior'
    | 'landscape'
    | 'sculptural';

interface CategoryConfig {
    id: FilterCategory;
    label: string;
    slugs?: string[];
}

const CATEGORIES: CategoryConfig[] = [
    { id: 'all', label: 'All Collections' },
    {
        id: 'interior',
        label: 'Interior Surfaces',
        slugs: [
            'italian-marble',
            'granites',
            'slate-stone',
            'limestones',
            'sandstone',
            'sand-stone',
            'quartz',
        ],
    },
    {
        id: 'exterior',
        label: 'Exterior Facades',
        slugs: [
            'granites',
            'slate-stone',
            'limestones',
            'sandstone',
            'sand-stone',
            'cobble-stones',
        ],
    },
    {
        id: 'landscape',
        label: 'Landscape & Paving',
        slugs: [
            'limestones',
            'sandstone',
            'sand-stone',
            'cobble-stones',
            'pebbles',
        ],
    },
    {
        id: 'sculptural',
        label: 'Sculptural & Accent',
        slugs: ['italian-marble', 'quartz', 'sculptures'],
    },
];

export function CollectionsGridSection({
    collections,
}: CollectionsGridSectionProps) {
    const headerRevealRef = useGsapReveal<HTMLDivElement>({ type: 'text' });
    const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Enforce canonical collections in locked sequence
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

    const sortedCollections = useMemo(() => {
        return [...collections]
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
    }, [collections]);

    // Filter collections by category and search term
    const filteredCollections = useMemo(() => {
        return sortedCollections.filter((col) => {
            // 1. Category Filter
            if (activeCategory !== 'all') {
                const config = CATEGORIES.find((c) => c.id === activeCategory);
                if (config?.slugs && !config.slugs.includes(col.slug)) {
                    return false;
                }
            }

            // 2. Search Query Filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const matchesName = col.name.toLowerCase().includes(q);
                const matchesTagline = col.tagline?.toLowerCase().includes(q);
                const matchesDesc = col.description?.toLowerCase().includes(q);
                const matchesVarieties = col.varieties?.some((v) =>
                    v.name.toLowerCase().includes(q),
                );
                return (
                    matchesName ||
                    matchesTagline ||
                    matchesDesc ||
                    matchesVarieties
                );
            }

            return true;
        });
    }, [sortedCollections, activeCategory, searchQuery]);

    return (
        <Section
            background="warm"
            spacing="spacious"
            border="top"
            aria-label="The Canonical Material Collections"
        >
            <Container>
                {/* Section Header */}
                <div
                    ref={headerRevealRef}
                    className="border-border-stone mb-10 flex flex-col justify-between border-b pb-6 md:flex-row md:items-end lg:mb-12"
                >
                    <div className="max-w-2xl">
                        <p className="font-eyebrow">The Complete Reserve</p>
                        <h2 className="font-display-md text-graphite mt-3 font-light">
                            Explore the Collection
                        </h2>
                        <p className="font-body text-graphite-muted mt-2.5">
                            Natural materials. Distinct personalities.
                        </p>
                    </div>

                    <span className="font-caption text-taupe mt-4 hidden tracking-widest uppercase sm:inline-block md:mt-0">
                        {String(sortedCollections.length).padStart(2, '0')} Curated Reserves
                    </span>
                </div>

                {/* Interactive Architectural Filter & Search Toolbar */}
                <div className="mb-10 space-y-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        {/* Application Category Chips */}
                        <div
                            role="tablist"
                            aria-label="Filter collections by architectural application"
                            className="flex flex-wrap gap-2"
                        >
                            {CATEGORIES.map((category) => {
                                const isActive = activeCategory === category.id;
                                return (
                                    <button
                                        key={category.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => setActiveCategory(category.id)}
                                        className={`cursor-pointer px-3.5 py-2 text-[10px] font-medium tracking-[0.2em] uppercase transition-all duration-300 border focus-visible:outline-2 focus-visible:outline-bronze ${
                                            isActive
                                                ? 'border-graphite bg-graphite text-ivory shadow-xs'
                                                : 'border-border-stone bg-ivory/60 text-graphite-muted hover:border-bronze hover:text-graphite'
                                        }`}
                                    >
                                        {category.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Live Stone Search Input */}
                        <div className="relative w-full sm:w-72 md:w-80">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-taupe">
                                <svg
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                    />
                                </svg>
                            </span>
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search stones, varieties..."
                                aria-label="Search collections by stone or application"
                                className="w-full border-border-stone bg-ivory py-2 pr-8 pl-9 text-xs text-graphite placeholder:text-graphite-muted/60 transition-colors border focus:border-bronze focus:outline-hidden focus:ring-1 focus:ring-bronze"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    aria-label="Clear search input"
                                    className="text-taupe hover:text-graphite absolute inset-y-0 right-2.5 flex items-center cursor-pointer text-xs"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter Status / Results Count */}
                    <div className="flex items-center justify-between text-[11px] text-taupe tracking-wider uppercase">
                        <span>
                            Showing {filteredCollections.length} of {sortedCollections.length} curated reserves
                            {activeCategory !== 'all' && (
                                <span className="text-bronze ml-1.5 font-medium">
                                    in {CATEGORIES.find((c) => c.id === activeCategory)?.label}
                                </span>
                            )}
                            {searchQuery && (
                                <span className="text-graphite ml-1.5 font-medium">
                                    matching &ldquo;{searchQuery}&rdquo;
                                </span>
                            )}
                        </span>

                        {(activeCategory !== 'all' || searchQuery) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveCategory('all');
                                    setSearchQuery('');
                                }}
                                className="text-bronze hover:text-graphite cursor-pointer text-[10px] tracking-widest uppercase underline transition-colors"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                </div>

                {/* 4-Column Editorial Grid on Desktop, 2 on Tablet, 1 on Mobile */}
                {filteredCollections.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
                        {filteredCollections.map((collection, idx) => {
                            const indexString = String(idx + 1).padStart(2, '0');
                            const fallbackData =
                                COLLECTIONS_IMAGES.cards[collection.slug];
                            const imageSrc =
                                collection.hero_image ||
                                fallbackData?.src ||
                                undefined;
                            const altText =
                                fallbackData?.alt ||
                                `${collection.name} natural stone reserve`;

                            return (
                                <Link
                                    key={collection.id || collection.slug}
                                    href={`/collections/${collection.slug}`}
                                    className="group border-border-subtle bg-ivory hover:border-bronze/70 hover:shadow-[0_16px_40px_-15px_rgba(15,15,15,0.08)] hover:-translate-y-1.5 focus-visible:outline-graphite relative flex flex-col overflow-hidden border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2"
                                >
                                    {/* Substantial Image Area with 4:3 Aspect Ratio */}
                                    <div className="bg-stone-light/30 relative overflow-hidden">
                                        <EliorImage
                                            src={imageSrc}
                                            asset={collection.hero_asset}
                                            alt={altText}
                                            aspectRatio="4/3"
                                            className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                                        />
                                        <div
                                            className="bg-graphite/0 group-hover:bg-graphite/10 absolute inset-0 transition-colors duration-500"
                                            aria-hidden="true"
                                        />
                                    </div>

                                    {/* Minimalist Card Information */}
                                    <div className="flex flex-1 flex-col justify-between p-6 lg:p-7">
                                        <div>
                                            <span className="font-caption text-taupe block font-serif text-xs tracking-widest">
                                                {indexString}
                                            </span>

                                            <h3 className="text-graphite group-hover:text-bronze-dark mt-2 font-serif text-xl font-light tracking-wide uppercase transition-colors duration-300">
                                                {collection.name}
                                            </h3>
                                        </div>

                                        <div className="text-graphite group-hover:text-bronze mt-6 flex items-center text-[11px] font-medium tracking-[0.2em] uppercase transition-colors">
                                            Explore Collection{' '}
                                            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1.5">
                                                →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    /* Architectural Empty State */
                    <div className="border-border-stone bg-ivory p-12 text-center md:p-16 border">
                        <p className="font-serif text-2xl font-light text-graphite">
                            No Matching Stone Collections Found
                        </p>
                        <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-graphite-muted">
                            No curated collection matches &ldquo;{searchQuery}&rdquo; within the selected filter criteria.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveCategory('all');
                                    setSearchQuery('');
                                }}
                                className="border-graphite bg-graphite text-ivory hover:bg-bronze hover:border-bronze border px-6 py-2.5 text-[10px] tracking-[0.24em] uppercase transition-colors cursor-pointer"
                            >
                                Reset Filters
                            </button>
                            <Link
                                href="/contact?type=quarry-consultation"
                                className="border-border-stone bg-ivory text-graphite hover:border-bronze hover:text-bronze border px-6 py-2.5 text-[10px] tracking-[0.24em] uppercase transition-colors"
                            >
                                Request Bespoke Quarry Sourcing →
                            </Link>
                        </div>
                    </div>
                )}
            </Container>
        </Section>
    );
}
