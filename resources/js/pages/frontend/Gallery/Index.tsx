import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PublicLayout } from '../../../layouts/PublicLayout';
import { SeoHead } from '../../../components/seo/SeoHead';
import { Container } from '../../../components/layout/Container';
import { Section } from '../../../components/layout/Section';
import { Button } from '../../../components/ui/Button';

export interface GalleryItemData {
    id: number;
    title: string;
    slug: string;
    category: string;
    space_type: string | null;
    material: string | null;
    description: string | null;
    is_featured: boolean;
    is_active: boolean;
    sort_order: number;
    image_url: string | null;
    thumb_url: string | null;
}

interface GalleryPageProps {
    galleryItems?: GalleryItemData[];
    categories?: string[];
    cmsContent?: {
        title?: string;
        meta_title?: string | null;
        meta_description?: string | null;
    } | null;
}

export default function GalleryIndex({
    galleryItems = [],
    categories: initialCategories = [],
    cmsContent,
}: GalleryPageProps) {
    const { appUrl } = usePage<{ appUrl?: string }>().props;
    const baseUrl = (appUrl || 'https://eliornaturalstones.com').replace(/\/$/, '');
    const canonicalUrl = `${baseUrl}/gallery`;

    const pageTitle =
        cmsContent?.meta_title ||
        'Architectural Stone Gallery | Curated Installations — ELIOR Natural Stones';
    const pageDescription =
        cmsContent?.meta_description ||
        'Explore our architectural gallery featuring 29 curated installations: bookmatched Italian marble salons, backlit onyx feature walls, cantilevered floating staircases, and hand-carved stone monoliths.';

    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Derived category list with counts
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { all: galleryItems.length };
        galleryItems.forEach((item) => {
            counts[item.category] = (counts[item.category] || 0) + 1;
        });
        return counts;
    }, [galleryItems]);

    const categoriesList = useMemo(() => {
        const unique = Array.from(new Set(galleryItems.map((item) => item.category)));
        return ['all', ...unique];
    }, [galleryItems]);

    // Filtered items based on active category
    const filteredItems = useMemo(() => {
        if (activeCategory === 'all') return galleryItems;
        return galleryItems.filter((item) => item.category === activeCategory);
    }, [galleryItems, activeCategory]);

    const currentLightboxItem =
        lightboxIndex !== null && filteredItems[lightboxIndex]
            ? filteredItems[lightboxIndex]
            : null;

    // Lightbox navigation
    const handleNext = useCallback(() => {
        if (lightboxIndex !== null) {
            setLightboxIndex((prev) =>
                prev !== null ? (prev + 1) % filteredItems.length : 0,
            );
        }
    }, [lightboxIndex, filteredItems.length]);

    const handlePrev = useCallback(() => {
        if (lightboxIndex !== null) {
            setLightboxIndex((prev) =>
                prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : 0,
            );
        }
    }, [lightboxIndex, filteredItems.length]);

    const handleClose = useCallback(() => {
        setLightboxIndex(null);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lightboxIndex === null) return;
            if (e.key === 'Escape') handleClose();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex, handleNext, handlePrev, handleClose]);

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        if (lightboxIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [lightboxIndex]);

    return (
        <PublicLayout
            breadcrumbs={[
                { name: 'Home', path: '/' },
                { name: 'Gallery', path: '/gallery' },
            ]}
        >
            <SeoHead
                title={pageTitle}
                description={pageDescription}
                canonical={canonicalUrl}
            />

            {/* Architectural Gallery Hero */}
            <header className="relative border-b border-stone-200 bg-[#FAF9F5] pt-28 pb-16 dark:border-stone-800 dark:bg-stone-950">
                <Container>
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-800/20 bg-amber-500/5 px-3 py-1 font-mono text-[11px] tracking-[0.28em] text-amber-800 uppercase dark:border-amber-400/20 dark:text-amber-300">
                            <span>ARCHITECTURAL CURATION</span>
                            <span>•</span>
                            <span>PROPORTION 5:4</span>
                        </div>
                        <h1 className="mt-5 font-serif text-4xl font-light tracking-tight text-stone-900 sm:text-5xl lg:text-6xl dark:text-stone-100">
                            The Architectural Gallery
                        </h1>
                        <p className="mt-6 font-sans text-base leading-relaxed text-stone-600 sm:text-lg dark:text-stone-300">
                            A curated retrospective of bespoke stone applications across private residences,
                            sanctuary suites, and hospitality pavilions. Each image captured in golden 5:4
                            framing, honoring mineral veining, light transmission, and monolithic geometry.
                        </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                        {categoriesList.map((cat) => {
                            const count = categoryCounts[cat] || 0;
                            const isActive = activeCategory === cat;
                            const label = cat === 'all' ? 'All Works' : cat;

                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => {
                                        setActiveCategory(cat);
                                        setLightboxIndex(null);
                                    }}
                                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                                        isActive
                                            ? 'bg-stone-900 text-stone-50 shadow-sm dark:bg-stone-100 dark:text-stone-950'
                                            : 'border border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-stone-600 dark:hover:text-stone-100'
                                    }`}
                                >
                                    <span>{label}</span>
                                    <span
                                        className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
                                            isActive
                                                ? 'bg-stone-800 text-stone-200 dark:bg-stone-200 dark:text-stone-800'
                                                : 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400'
                                        }`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </Container>
            </header>

            {/* Gallery Grid */}
            <Section className="py-16 sm:py-24">
                <Container>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredItems.map((item, index) => {
                            const imgUrl = item.thumb_url || item.image_url;

                            return (
                                <article
                                    key={item.id}
                                    onClick={() => setLightboxIndex(index)}
                                    className="group relative cursor-pointer overflow-hidden rounded-lg border border-stone-200/80 bg-white transition-all duration-300 hover:border-amber-700/40 hover:shadow-xl dark:border-stone-800 dark:bg-stone-900"
                                >
                                    {/* Strict 5:4 Aspect Ratio Frame */}
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

                                        {/* Subtle Dark Vignette on Hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                        {/* Featured Tag */}
                                        {item.is_featured && (
                                            <div className="absolute top-3 left-3 rounded-full bg-amber-500/90 px-2.5 py-0.5 font-mono text-[9px] font-medium tracking-wider text-white uppercase backdrop-blur-xs shadow-xs">
                                                Masterpiece
                                            </div>
                                        )}

                                        {/* Expand Icon on Hover */}
                                        <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100">
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
                                                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                                                />
                                            </svg>
                                        </div>

                                        {/* Hover Overlay Details */}
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

                                    {/* Static Card Bottom Info */}
                                    <div className="p-4 sm:p-5">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-[10px] tracking-wider text-amber-800 uppercase dark:text-amber-400">
                                                {item.category}
                                            </span>
                                            {item.space_type && (
                                                <span className="font-mono text-[10px] text-stone-400">
                                                    {item.space_type}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="mt-1 font-serif text-base font-normal text-stone-900 dark:text-stone-100">
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
                                </article>
                            );
                        })}
                    </div>
                </Container>
            </Section>

            {/* Interactive Lightbox Modal */}
            {lightboxIndex !== null && currentLightboxItem && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md sm:p-8"
                    onClick={handleClose}
                >
                    {/* Top Bar with Counter and Close */}
                    <div
                        className="absolute top-4 right-4 left-4 z-60 flex items-center justify-between text-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3">
                            <span className="rounded bg-white/10 px-2.5 py-1 font-mono text-xs text-stone-300 backdrop-blur-xs">
                                {lightboxIndex + 1} / {filteredItems.length}
                            </span>
                            <span className="hidden font-mono text-xs tracking-wider text-amber-400 uppercase sm:inline">
                                {currentLightboxItem.category}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                            title="Close (Esc)"
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Arrow Left */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePrev();
                        }}
                        className="absolute left-4 z-60 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 sm:left-6"
                        title="Previous (Left Arrow)"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>

                    {/* Navigation Arrow Right */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                        }}
                        className="absolute right-4 z-60 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 sm:right-6"
                        title="Next (Right Arrow)"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>

                    {/* Central Content Container */}
                    <div
                        className="relative z-50 flex max-h-[90vh] w-full max-w-5xl flex-col items-center justify-center gap-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 5:4 Display Image */}
                        <div className="relative aspect-[5/4] max-h-[68vh] w-auto overflow-hidden rounded-lg border border-white/10 shadow-2xl">
                            <img
                                src={
                                    currentLightboxItem.image_url ||
                                    currentLightboxItem.thumb_url ||
                                    ''
                                }
                                alt={currentLightboxItem.title}
                                className="h-full w-full object-contain"
                            />
                        </div>

                        {/* Lightbox Information Bar */}
                        <div className="w-full max-w-3xl rounded-xl border border-white/10 bg-black/60 p-5 text-center backdrop-blur-md">
                            <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs text-amber-400">
                                <span>{currentLightboxItem.category}</span>
                                {currentLightboxItem.space_type && (
                                    <>
                                        <span className="text-white/30">•</span>
                                        <span>{currentLightboxItem.space_type}</span>
                                    </>
                                )}
                                {currentLightboxItem.material && (
                                    <>
                                        <span className="text-white/30">•</span>
                                        <span className="text-stone-300">
                                            {currentLightboxItem.material}
                                        </span>
                                    </>
                                )}
                            </div>

                            <h2 className="mt-2 font-serif text-2xl font-light text-white">
                                {currentLightboxItem.title}
                            </h2>

                            {currentLightboxItem.description && (
                                <p className="mt-2 text-sm leading-relaxed text-stone-300">
                                    {currentLightboxItem.description}
                                </p>
                            )}

                            <div className="mt-4 flex items-center justify-center gap-4">
                                <Link
                                    href={`/contact?subject=Gallery+Inquiry+-+${encodeURIComponent(
                                        currentLightboxItem.title,
                                    )}`}
                                    className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-6 py-2 text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-amber-500"
                                >
                                    <span>Inquire About This Stone</span>
                                    <svg
                                        className="h-3.5 w-3.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                        />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Inquiries Banner */}
            <Section className="border-t border-stone-200 bg-[#FAF9F5] py-20 dark:border-stone-800 dark:bg-stone-900/40">
                <Container>
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="font-mono text-xs tracking-[0.25em] text-amber-800 uppercase dark:text-amber-400">
                            COMMISSION YOUR SPACE
                        </span>
                        <h2 className="mt-3 font-serif text-3xl font-light text-stone-900 sm:text-4xl dark:text-stone-100">
                            Custom Quarry Sourcing & Architectural Masonry
                        </h2>
                        <p className="mt-4 font-sans text-base leading-relaxed text-stone-600 dark:text-stone-300">
                            Every residence and commercial pavilion showcased in our gallery began with
                            raw block selection at the quarry face. Partner with our master stonemasons
                            and material engineers to bring your vision into reality.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                            <Button asChild size="lg">
                                <Link href="/contact">Schedule Private Consultation</Link>
                            </Button>
                            <Button asChild variant="secondary" size="lg">
                                <Link href="/collections">Explore All Collections</Link>
                            </Button>
                        </div>
                    </div>
                </Container>
            </Section>
        </PublicLayout>
    );
}
