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

            {/* Architectural Gallery Hero with Ambient Stone Backdrop */}
            <header className="relative flex min-h-[50vh] flex-col justify-center overflow-hidden border-b border-stone-800 bg-[#0c0a09] pt-28 pb-16 lg:min-h-[56vh] lg:pt-36 lg:pb-20">
                {/* Background Architectural Canvas */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/elior/gallery/gallery-29.webp"
                        alt="Architectural Stone Gallery Atmosphere"
                        className="h-full w-full object-cover object-center scale-105 opacity-35 filter contrast-125 brightness-90 transition-transform duration-1000 ease-out"
                    />
                    {/* Deep multi-stop luxury gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/75 to-[#0c0a09]/85" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />
                </div>

                <Container className="relative z-10 text-center">
                    <div className="mx-auto max-w-4xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/35 bg-amber-950/40 px-4 py-1.5 font-mono text-[11px] tracking-[0.28em] text-amber-300 uppercase backdrop-blur-md shadow-lg shadow-black/40">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                            <span>ARCHITECTURAL CURATION</span>
                            <span>•</span>
                            <span>PROPORTION 5:4</span>
                        </div>
                        <h1 className="mt-6 font-serif text-4xl font-light tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl">
                            The Architectural Gallery
                        </h1>
                        <p className="mx-auto mt-5 max-w-2xl font-sans text-base leading-relaxed text-stone-300 sm:text-lg">
                            A curated retrospective of bespoke stone applications across private residences,
                            sanctuary suites, and hospitality pavilions. Each image captured in golden 5:4
                            framing, honoring mineral veining, light transmission, and monolithic geometry.
                        </p>
                    </div>

                    {/* Filter Pills with Frosted Glass Styling */}
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
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
                                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all backdrop-blur-md ${
                                        isActive
                                            ? 'border border-amber-500 bg-amber-600 text-white shadow-lg shadow-amber-950/50'
                                            : 'border border-white/15 bg-white/10 text-stone-200 hover:border-amber-400/50 hover:bg-white/15 hover:text-white'
                                    }`}
                                >
                                    <span>{label}</span>
                                    <span
                                        className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
                                            isActive
                                                ? 'bg-amber-800 text-amber-100'
                                                : 'bg-black/40 text-stone-300'
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

            {/* Inquiries / Commission Section with Authentic Quarry Backdrop */}
            <section
                aria-label="Commission Your Architectural Space"
                className="relative overflow-hidden bg-[#0c0a09] py-24 sm:py-28 lg:py-32"
            >
                {/* Background Quarry Image with Ambient Lighting */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/elior/source-to-space/source-to-space-01-quarries.webp"
                        alt="Authentic quarry face with monumental raw stone blocks"
                        loading="lazy"
                        className="h-full w-full object-cover object-center opacity-35 filter contrast-125 brightness-85 scale-105 transition-transform duration-1000 ease-out"
                    />
                    {/* Deep multi-stop luxury gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/80 to-[#0c0a09]/90" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />
                </div>

                <Container className="relative z-10 text-center">
                    <div className="mx-auto max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/35 bg-amber-950/40 px-4 py-1.5 font-mono text-[11px] tracking-[0.28em] text-amber-300 uppercase backdrop-blur-md shadow-lg shadow-black/40">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                            <span>COMMISSION YOUR SPACE</span>
                        </div>
                        <h2 className="mt-6 font-serif text-3xl font-light text-white drop-shadow-md sm:text-4xl lg:text-5xl">
                            Custom Quarry Sourcing & Architectural Masonry
                        </h2>
                        <p className="mx-auto mt-5 max-w-2xl font-sans text-base leading-relaxed text-stone-300 sm:text-lg">
                            Every residence and commercial pavilion showcased in our gallery began with
                            raw block selection at the quarry face. Partner with our master stonemasons
                            and material engineers to bring your vision into reality.
                        </p>
                        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-7 py-3.5 text-xs font-semibold tracking-wider text-white uppercase shadow-lg shadow-amber-950/50 transition-all hover:bg-amber-500 hover:shadow-xl hover:shadow-amber-900/60"
                            >
                                <span>Schedule Private Consultation</span>
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
                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    />
                                </svg>
                            </Link>
                            <Link
                                href="/collections"
                                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-xs font-semibold tracking-wider text-stone-200 uppercase backdrop-blur-md transition-all hover:border-amber-400/50 hover:bg-white/15 hover:text-white"
                            >
                                <span>Explore All Collections</span>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>
        </PublicLayout>
    );
}
