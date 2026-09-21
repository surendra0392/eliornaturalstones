import { useState, useEffect } from 'react';
import type { Page } from '../../../types/page';
import { AdminMediaPickerModal } from './AdminMediaPickerModal';
import { apiClient } from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';

interface AdminPageEditorProps {
    page: Page | null;
    isOpen: boolean;
    onClose: () => void;
    onSaved: (updatedPage: Page) => void;
}

type TabType = 'general' | 'hero' | 'content';

export function AdminPageEditor({
    page,
    isOpen,
    onClose,
    onSaved,
}: AdminPageEditorProps) {
    const [activeTab, setActiveTab] = useState<TabType>('general');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // General & SEO Fields
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [isPublished, setIsPublished] = useState(true);

    // Hero Section Fields
    const [heroEyebrow, setHeroEyebrow] = useState('');
    const [heroMarker, setHeroMarker] = useState('');
    const [heroTitle, setHeroTitle] = useState('');
    const [heroSecondaryLine, setHeroSecondaryLine] = useState('');
    const [heroCtaPrimaryText, setHeroCtaPrimaryText] = useState('');
    const [heroCtaPrimaryHref, setHeroCtaPrimaryHref] = useState('');
    const [heroCtaSecondaryText, setHeroCtaSecondaryText] = useState('');
    const [heroCtaSecondaryHref, setHeroCtaSecondaryHref] = useState('');
    const [heroImage, setHeroImage] = useState('');
    const [heroImageAlt, setHeroImageAlt] = useState('');

    // Entire Content JSON object
    const [content, setContent] = useState<Record<string, any>>({});

    // Media Picker Modal state
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

    useEffect(() => {
        if (!page || !isOpen) return;

        setTitle(page.title || '');
        setSlug(page.slug || '');
        setSubtitle(page.subtitle || '');
        setExcerpt(page.excerpt || '');
        setMetaTitle(page.meta_title || '');
        setMetaDescription(page.meta_description || '');
        setIsPublished(page.is_published);

        const pageContent = page.content || {};
        setContent(pageContent);

        const hero = pageContent.hero || {};
        setHeroEyebrow(hero.eyebrow || '');
        setHeroMarker(hero.marker || '');
        setHeroTitle(hero.title || '');
        setHeroSecondaryLine(
            hero.secondaryLine ||
                hero.supportingLine ||
                hero.supportingCopy ||
                '',
        );
        setHeroCtaPrimaryText(
            hero.ctaPrimaryText || hero.cta || hero.ctaText || '',
        );
        setHeroCtaPrimaryHref(hero.ctaPrimaryHref || hero.ctaHref || '');
        setHeroCtaSecondaryText(hero.ctaSecondaryText || '');
        setHeroCtaSecondaryHref(hero.ctaSecondaryHref || '');
        setHeroImage(hero.image || '');
        setHeroImageAlt(hero.imageAlt || '');

        setErrorMessage(null);
        setSuccessMessage(null);
        setActiveTab('general');
    }, [page, isOpen]);

    if (!isOpen || !page) return null;

    const isCanonical =
        page.is_canonical ??
        [
            'home',
            'collections',
            'our-story',
            'from-source-to-space',
            'architect-designer-services',
            'contact',
        ].includes(page.slug);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        // Build updated hero content
        const updatedHero = {
            ...content.hero,
            eyebrow: heroEyebrow,
            marker: heroMarker,
            title: heroTitle,
            secondaryLine: heroSecondaryLine,
            supportingLine: heroSecondaryLine,
            supportingCopy: heroSecondaryLine,
            ctaPrimaryText: heroCtaPrimaryText,
            cta: heroCtaPrimaryText,
            ctaText: heroCtaPrimaryText,
            ctaPrimaryHref: heroCtaPrimaryHref,
            ctaHref: heroCtaPrimaryHref,
            ctaSecondaryText: heroCtaSecondaryText,
            ctaSecondaryHref: heroCtaSecondaryHref,
            image: heroImage,
            imageAlt: heroImageAlt,
        };

        const updatedContent = {
            ...content,
            hero: updatedHero,
        };

        const payload: Record<string, any> = {
            title,
            subtitle,
            excerpt,
            meta_title: metaTitle,
            meta_description: metaDescription,
            is_published: isPublished,
            content: updatedContent,
        };

        if (!isCanonical) {
            payload.slug = slug;
        }

        try {
            const url = API_ENDPOINTS.v1.admin.pageItem(page.id);
            const res = await apiClient<Page>(url, {
                method: 'PATCH',
                body: JSON.stringify(payload),
            });
            if (res?.data) {
                setSuccessMessage('Page content saved successfully.');
                onSaved(res.data);
                setTimeout(() => {
                    onClose();
                }, 800);
            }
        } catch (err: any) {
            console.error('Failed to save page:', err);
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'An error occurred while saving the page.';
            setErrorMessage(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm">
            <div className="border-border-stone bg-charcoal flex h-full w-full max-w-4xl flex-col overflow-hidden border-l shadow-2xl">
                {/* Sticky Header Bar */}
                <div className="border-border-stone bg-stone-dark flex items-center justify-between border-b px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="font-serif text-lg font-light text-white">
                                    Edit Page: {page.title}
                                </h2>
                                {isCanonical && (
                                    <span className="border-champagne/40 text-champagne bg-champagne/10 rounded px-2 py-0.5 text-[10px] tracking-wider uppercase">
                                        Canonical Page
                                    </span>
                                )}
                            </div>
                            <div className="mt-1 flex items-center gap-3">
                                <span className="text-taupe text-xs">
                                    Slug:{' '}
                                    <code className="text-stone-warm">
                                        /{page.slug}
                                    </code>
                                </span>
                                <a
                                    href={
                                        page.live_url ||
                                        `/${page.slug === 'home' ? '' : page.slug}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-champagne/80 hover:text-champagne inline-flex items-center gap-1 text-xs underline"
                                >
                                    View Live ↗
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="flex cursor-pointer items-center gap-2 text-xs select-none">
                            <span className="text-stone-warm text-xs">
                                Status:
                            </span>
                            <input
                                type="checkbox"
                                checked={isPublished}
                                onChange={(e) =>
                                    setIsPublished(e.target.checked)
                                }
                                className="sr-only"
                            />
                            <span
                                className={`border px-2.5 py-1 text-[11px] font-medium tracking-wider uppercase transition-colors ${
                                    isPublished
                                        ? 'border-emerald-800/60 bg-emerald-950/40 text-emerald-400'
                                        : 'border-amber-800/60 bg-amber-950/40 text-amber-400'
                                }`}
                            >
                                {isPublished ? '● Published' : '○ Draft'}
                            </span>
                        </label>

                        <button
                            type="button"
                            onClick={onClose}
                            className="border-border-stone text-stone-warm border px-3 py-1.5 text-xs uppercase transition-colors hover:text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSubmitting}
                            className="bg-champagne hover:bg-champagne/90 text-charcoal px-4 py-1.5 text-xs font-medium tracking-wider uppercase transition-colors disabled:opacity-40"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {/* Status Messages */}
                {errorMessage && (
                    <div className="border-b border-red-800/60 bg-red-950/50 px-6 py-2.5 text-xs text-red-300">
                        {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div className="border-b border-emerald-800/60 bg-emerald-950/50 px-6 py-2.5 text-xs text-emerald-300">
                        {successMessage}
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="border-border-stone/60 bg-stone-dark/40 flex border-b px-6">
                    <button
                        type="button"
                        onClick={() => setActiveTab('general')}
                        className={`border-b-2 px-4 py-3 text-xs font-medium tracking-wider uppercase transition-colors ${
                            activeTab === 'general'
                                ? 'border-champagne text-champagne'
                                : 'text-stone-warm border-transparent hover:text-white'
                        }`}
                    >
                        General & SEO
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('hero')}
                        className={`border-b-2 px-4 py-3 text-xs font-medium tracking-wider uppercase transition-colors ${
                            activeTab === 'hero'
                                ? 'border-champagne text-champagne'
                                : 'text-stone-warm border-transparent hover:text-white'
                        }`}
                    >
                        Hero Section
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('content')}
                        className={`border-b-2 px-4 py-3 text-xs font-medium tracking-wider uppercase transition-colors ${
                            activeTab === 'content'
                                ? 'border-champagne text-champagne'
                                : 'text-stone-warm border-transparent hover:text-white'
                        }`}
                    >
                        Structured Content
                    </button>
                </div>

                {/* Tab Content Container */}
                <div className="flex-1 space-y-6 overflow-y-auto p-6">
                    {/* TAB 1: GENERAL & SEO */}
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-stone-warm mb-1 block text-xs font-medium tracking-wider uppercase">
                                        Page Title{' '}
                                        <span className="text-champagne">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-2 text-xs text-white focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-stone-warm mb-1 block text-xs font-medium tracking-wider uppercase">
                                        URL Slug{' '}
                                        {isCanonical && (
                                            <span className="text-taupe">
                                                (Locked)
                                            </span>
                                        )}
                                    </label>
                                    <input
                                        type="text"
                                        value={slug}
                                        disabled={isCanonical}
                                        onChange={(e) =>
                                            setSlug(e.target.value)
                                        }
                                        className="border-border-stone bg-charcoal disabled:bg-stone-dark/40 focus:border-champagne w-full border px-3 py-2 text-xs text-white focus:outline-none disabled:opacity-50"
                                    />
                                    {isCanonical && (
                                        <p className="text-taupe mt-1 text-[11px]">
                                            Canonical page slugs cannot be
                                            altered to protect route stability.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="text-stone-warm mb-1 block text-xs font-medium tracking-wider uppercase">
                                    Subtitle / Secondary Line
                                </label>
                                <input
                                    type="text"
                                    value={subtitle}
                                    onChange={(e) =>
                                        setSubtitle(e.target.value)
                                    }
                                    className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-2 text-xs text-white focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-stone-warm mb-1 block text-xs font-medium tracking-wider uppercase">
                                    Page Excerpt
                                </label>
                                <textarea
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    rows={2}
                                    className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-2 text-xs text-white focus:outline-none"
                                />
                            </div>

                            <hr className="border-border-stone/40 my-6" />

                            <h3 className="font-serif text-base font-light text-white">
                                Search Engine Optimization (SEO)
                            </h3>

                            <div>
                                <div className="mb-1 flex items-center justify-between">
                                    <label className="text-stone-warm text-xs font-medium tracking-wider uppercase">
                                        Meta Title
                                    </label>
                                    <span className="text-taupe text-[11px]">
                                        {metaTitle.length}/60 chars
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    value={metaTitle}
                                    onChange={(e) =>
                                        setMetaTitle(e.target.value)
                                    }
                                    className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-2 text-xs text-white focus:outline-none"
                                    placeholder="ELIOR Natural Stones | ..."
                                />
                            </div>

                            <div>
                                <div className="mb-1 flex items-center justify-between">
                                    <label className="text-stone-warm text-xs font-medium tracking-wider uppercase">
                                        Meta Description
                                    </label>
                                    <span className="text-taupe text-[11px]">
                                        {metaDescription.length}/160 chars
                                    </span>
                                </div>
                                <textarea
                                    value={metaDescription}
                                    onChange={(e) =>
                                        setMetaDescription(e.target.value)
                                    }
                                    rows={3}
                                    className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-2 text-xs text-white focus:outline-none"
                                    placeholder="Brief description for search engines and social cards..."
                                />
                            </div>

                            {/* Search Preview Card */}
                            <div className="border-border-stone/60 bg-stone-dark/30 border p-4">
                                <span className="text-taupe mb-2 block text-[10px] tracking-wider uppercase">
                                    Google Search Result Preview
                                </span>
                                <div className="font-sans text-xs">
                                    <p className="truncate text-sm font-medium text-blue-400">
                                        {metaTitle ||
                                            `${title} | ELIOR Natural Stones`}
                                    </p>
                                    <p className="truncate text-[11px] text-emerald-500">
                                        https://eliornaturalstones.com/
                                        {slug === 'home' ? '' : slug}
                                    </p>
                                    <p className="text-stone-warm mt-1 line-clamp-2 text-xs">
                                        {metaDescription ||
                                            excerpt ||
                                            'ELIOR Natural Stones brings carefully selected natural stone materials to contemporary architecture.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: HERO SECTION */}
                    {activeTab === 'hero' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-stone-warm mb-1 block text-xs font-medium tracking-wider uppercase">
                                        Eyebrow
                                    </label>
                                    <input
                                        type="text"
                                        value={heroEyebrow}
                                        onChange={(e) =>
                                            setHeroEyebrow(e.target.value)
                                        }
                                        placeholder="ELIOR / NATURAL STONES"
                                        className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-2 text-xs text-white focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-stone-warm mb-1 block text-xs font-medium tracking-wider uppercase">
                                        Marker / Badge
                                    </label>
                                    <input
                                        type="text"
                                        value={heroMarker}
                                        onChange={(e) =>
                                            setHeroMarker(e.target.value)
                                        }
                                        placeholder="SINCE 1990"
                                        className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-2 text-xs text-white focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-stone-warm mb-1 block text-xs font-medium tracking-wider uppercase">
                                    Hero Headline (H1)
                                </label>
                                <input
                                    type="text"
                                    value={heroTitle}
                                    onChange={(e) =>
                                        setHeroTitle(e.target.value)
                                    }
                                    className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-2 font-serif text-xs text-white focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-stone-warm mb-1 block text-xs font-medium tracking-wider uppercase">
                                    Supporting Narrative / Subtitle
                                </label>
                                <textarea
                                    value={heroSecondaryLine}
                                    onChange={(e) =>
                                        setHeroSecondaryLine(e.target.value)
                                    }
                                    rows={2}
                                    className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-2 text-xs text-white focus:outline-none"
                                />
                            </div>

                            {/* Call To Action Buttons */}
                            <div className="border-border-stone/40 bg-stone-dark/20 space-y-4 border p-4">
                                <h4 className="text-xs font-medium tracking-wider text-white uppercase">
                                    Call To Action Actions
                                </h4>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className="text-stone-warm mb-1 block text-[11px]">
                                            Primary CTA Text
                                        </label>
                                        <input
                                            type="text"
                                            value={heroCtaPrimaryText}
                                            onChange={(e) =>
                                                setHeroCtaPrimaryText(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="EXPLORE COLLECTIONS"
                                            className="border-border-stone bg-charcoal focus:border-champagne w-full border px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-stone-warm mb-1 block text-[11px]">
                                            Primary CTA Destination URL
                                        </label>
                                        <input
                                            type="text"
                                            value={heroCtaPrimaryHref}
                                            onChange={(e) =>
                                                setHeroCtaPrimaryHref(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="/collections"
                                            className="border-border-stone bg-charcoal focus:border-champagne w-full border px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-stone-warm mb-1 block text-[11px]">
                                            Secondary CTA Text (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={heroCtaSecondaryText}
                                            onChange={(e) =>
                                                setHeroCtaSecondaryText(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="OUR STORY"
                                            className="border-border-stone bg-charcoal focus:border-champagne w-full border px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-stone-warm mb-1 block text-[11px]">
                                            Secondary CTA Destination URL
                                        </label>
                                        <input
                                            type="text"
                                            value={heroCtaSecondaryHref}
                                            onChange={(e) =>
                                                setHeroCtaSecondaryHref(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="/our-story"
                                            className="border-border-stone bg-charcoal focus:border-champagne w-full border px-2.5 py-1.5 text-xs text-white focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Hero Image Picker */}
                            <div className="border-border-stone/60 bg-stone-dark/30 space-y-3 border p-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-stone-warm text-xs font-medium tracking-wider uppercase">
                                        Architectural Hero Image
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsMediaPickerOpen(true)
                                        }
                                        className="bg-champagne/20 hover:bg-champagne/30 text-champagne border-champagne/40 border px-3 py-1 text-xs tracking-wider uppercase transition-colors"
                                    >
                                        Select from Media Library
                                    </button>
                                </div>

                                <div className="flex flex-col items-start gap-4 sm:flex-row">
                                    {heroImage ? (
                                        <div className="border-border-stone relative h-28 w-44 flex-shrink-0 overflow-hidden border bg-black/50">
                                            <img
                                                src={heroImage}
                                                alt={
                                                    heroImageAlt ||
                                                    'Hero preview'
                                                }
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    (
                                                        e.target as HTMLElement
                                                    ).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="border-border-stone text-taupe flex h-28 w-44 flex-shrink-0 items-center justify-center border border-dashed p-2 text-center text-xs">
                                            No Hero Image Selected
                                        </div>
                                    )}

                                    <div className="w-full flex-1 space-y-2">
                                        <div>
                                            <label className="text-stone-warm mb-0.5 block text-[11px]">
                                                Image URL / Path
                                            </label>
                                            <input
                                                type="text"
                                                value={heroImage}
                                                onChange={(e) =>
                                                    setHeroImage(e.target.value)
                                                }
                                                placeholder="/images/our-story/hero-legacy-stone.webp"
                                                className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-1.5 text-xs text-white focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-stone-warm mb-0.5 block text-[11px]">
                                                Image Alt Text
                                            </label>
                                            <input
                                                type="text"
                                                value={heroImageAlt}
                                                onChange={(e) =>
                                                    setHeroImageAlt(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Descriptive architectural alt text"
                                                className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-1.5 text-xs text-white focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: STRUCTURED EDITORIAL CONTENT */}
                    {activeTab === 'content' && (
                        <div className="space-y-6">
                            {/* Specialized editors based on slug / template */}
                            {page.slug === 'our-story' && (
                                <OurStorySectionEditor
                                    content={content}
                                    onChange={setContent}
                                />
                            )}

                            {page.slug === 'from-source-to-space' && (
                                <SourceToSpaceSectionEditor
                                    content={content}
                                    onChange={setContent}
                                />
                            )}

                            {page.slug === 'architect-designer-services' && (
                                <ArchitectServicesSectionEditor
                                    content={content}
                                    onChange={setContent}
                                />
                            )}

                            {page.slug === 'contact' && (
                                <ContactSectionEditor
                                    content={content}
                                    onChange={setContent}
                                />
                            )}

                            {page.slug === 'home' && (
                                <HomeSectionEditor
                                    content={content}
                                    onChange={setContent}
                                />
                            )}

                            {page.slug === 'collections' && (
                                <CollectionsSectionEditor
                                    content={content}
                                    onChange={setContent}
                                />
                            )}

                            {![
                                'our-story',
                                'from-source-to-space',
                                'architect-designer-services',
                                'contact',
                                'home',
                                'collections',
                            ].includes(page.slug) && (
                                <GenericJsonSectionEditor
                                    content={content}
                                    onChange={setContent}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Media Picker Modal */}
            <AdminMediaPickerModal
                isOpen={isMediaPickerOpen}
                onClose={() => setIsMediaPickerOpen(false)}
                onSelect={({ url, alt }) => {
                    setHeroImage(url);
                    if (alt) setHeroImageAlt(alt);
                }}
                currentUrl={heroImage}
            />
        </div>
    );
}

// -------------------------------------------------------------
// SUB-EDITORS FOR SPECIALIZED EDITORIAL PAGE TEMPLATES
// -------------------------------------------------------------

function OurStorySectionEditor({
    content,
    onChange,
}: {
    content: Record<string, any>;
    onChange: (val: Record<string, any>) => void;
}) {
    const opening = content.opening || {};
    const timeline = content.timeline || {};
    const milestones = Array.isArray(timeline.milestones)
        ? timeline.milestones
        : [];

    const handleOpeningChange = (field: string, val: string) => {
        onChange({
            ...content,
            opening: {
                ...opening,
                [field]: val,
            },
        });
    };

    const handleMilestoneChange = (
        index: number,
        field: string,
        val: string,
    ) => {
        const newMilestones = [...milestones];
        newMilestones[index] = {
            ...newMilestones[index],
            [field]: val,
        };
        onChange({
            ...content,
            timeline: {
                ...timeline,
                milestones: newMilestones,
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* 01. Opening Statement */}
            <div className="border-border-stone/60 bg-stone-dark/30 space-y-3 border p-4">
                <h4 className="font-serif text-sm font-light text-white">
                    01. Opening Narrative Statement
                </h4>
                <div>
                    <label className="text-stone-warm mb-1 block text-[11px]">
                        Statement
                    </label>
                    <input
                        type="text"
                        value={opening.statement || ''}
                        onChange={(e) =>
                            handleOpeningChange('statement', e.target.value)
                        }
                        className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                </div>
                <div>
                    <label className="text-stone-warm mb-1 block text-[11px]">
                        Paragraph 1
                    </label>
                    <textarea
                        value={opening.paragraph1 || ''}
                        onChange={(e) =>
                            handleOpeningChange('paragraph1', e.target.value)
                        }
                        rows={2}
                        className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                </div>
                <div>
                    <label className="text-stone-warm mb-1 block text-[11px]">
                        Paragraph 2
                    </label>
                    <textarea
                        value={opening.paragraph2 || ''}
                        onChange={(e) =>
                            handleOpeningChange('paragraph2', e.target.value)
                        }
                        rows={2}
                        className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                </div>
            </div>

            {/* 02. Heritage Timeline Milestones */}
            <div className="border-border-stone/60 bg-stone-dark/30 space-y-4 border p-4">
                <div className="flex items-center justify-between">
                    <h4 className="font-serif text-sm font-light text-white">
                        02. Heritage Timeline Milestones (1990 – Present)
                    </h4>
                    <span className="text-taupe text-[11px]">
                        {milestones.length} Milestones
                    </span>
                </div>

                <div className="space-y-3">
                    {milestones.map((m: any, idx: number) => (
                        <div
                            key={idx}
                            className="border-border-stone/40 bg-charcoal/60 space-y-2 border p-3"
                        >
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="text-stone-warm block text-[10px]">
                                        Year
                                    </label>
                                    <input
                                        type="text"
                                        value={m.year || ''}
                                        onChange={(e) =>
                                            handleMilestoneChange(
                                                idx,
                                                'year',
                                                e.target.value,
                                            )
                                        }
                                        className="border-border-stone bg-charcoal focus:border-champagne w-full border px-2 py-1 text-xs text-white focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-stone-warm block text-[10px]">
                                        Company / Era
                                    </label>
                                    <input
                                        type="text"
                                        value={m.company || ''}
                                        onChange={(e) =>
                                            handleMilestoneChange(
                                                idx,
                                                'company',
                                                e.target.value,
                                            )
                                        }
                                        className="border-border-stone bg-charcoal focus:border-champagne w-full border px-2 py-1 text-xs text-white focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-stone-warm block text-[10px]">
                                        Badge
                                    </label>
                                    <input
                                        type="text"
                                        value={m.badge || ''}
                                        onChange={(e) =>
                                            handleMilestoneChange(
                                                idx,
                                                'badge',
                                                e.target.value,
                                            )
                                        }
                                        className="border-border-stone bg-charcoal focus:border-champagne w-full border px-2 py-1 text-xs text-white focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-stone-warm block text-[10px]">
                                    Description
                                </label>
                                <textarea
                                    value={m.description || ''}
                                    onChange={(e) =>
                                        handleMilestoneChange(
                                            idx,
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    rows={2}
                                    className="border-border-stone bg-charcoal focus:border-champagne w-full border px-2 py-1 text-xs text-white focus:outline-none"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function SourceToSpaceSectionEditor({
    content,
    onChange,
}: {
    content: Record<string, any>;
    onChange: (val: Record<string, any>) => void;
}) {
    const intro = content.intro || {};
    const journey = content.journey || {};
    const stages = Array.isArray(journey.stages) ? journey.stages : [];

    const handleIntroChange = (field: string, val: string) => {
        onChange({
            ...content,
            intro: {
                ...intro,
                [field]: val,
            },
        });
    };

    const handleStageChange = (index: number, field: string, val: string) => {
        const newStages = [...stages];
        newStages[index] = {
            ...newStages[index],
            [field]: val,
        };
        onChange({
            ...content,
            journey: {
                ...journey,
                stages: newStages,
            },
        });
    };

    return (
        <div className="space-y-6">
            <div className="border-border-stone/60 bg-stone-dark/30 space-y-3 border p-4">
                <h4 className="font-serif text-sm font-light text-white">
                    01. Intro Statement
                </h4>
                <div>
                    <label className="text-stone-warm mb-1 block text-[11px]">
                        Headline
                    </label>
                    <input
                        type="text"
                        value={intro.headline || ''}
                        onChange={(e) =>
                            handleIntroChange('headline', e.target.value)
                        }
                        className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                </div>
                <div>
                    <label className="text-stone-warm mb-1 block text-[11px]">
                        Paragraph 1
                    </label>
                    <textarea
                        value={intro.paragraph1 || ''}
                        onChange={(e) =>
                            handleIntroChange('paragraph1', e.target.value)
                        }
                        rows={2}
                        className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                </div>
            </div>

            <div className="border-border-stone/60 bg-stone-dark/30 space-y-4 border p-4">
                <h4 className="font-serif text-sm font-light text-white">
                    02. The Six Journey Stages
                </h4>
                <div className="space-y-3">
                    {stages.map((stage: any, idx: number) => (
                        <div
                            key={idx}
                            className="border-border-stone/40 bg-charcoal/60 space-y-2 border p-3"
                        >
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-stone-warm block text-[10px]">
                                        Stage Title
                                    </label>
                                    <input
                                        type="text"
                                        value={stage.title || ''}
                                        onChange={(e) =>
                                            handleStageChange(
                                                idx,
                                                'title',
                                                e.target.value,
                                            )
                                        }
                                        className="border-border-stone bg-charcoal focus:border-champagne w-full border px-2 py-1 text-xs text-white focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-stone-warm block text-[10px]">
                                        Slug
                                    </label>
                                    <input
                                        type="text"
                                        value={stage.slug || ''}
                                        onChange={(e) =>
                                            handleStageChange(
                                                idx,
                                                'slug',
                                                e.target.value,
                                            )
                                        }
                                        className="border-border-stone bg-charcoal focus:border-champagne w-full border px-2 py-1 text-xs text-white focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-stone-warm block text-[10px]">
                                    Description
                                </label>
                                <textarea
                                    value={stage.description || ''}
                                    onChange={(e) =>
                                        handleStageChange(
                                            idx,
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    rows={2}
                                    className="border-border-stone bg-charcoal focus:border-champagne w-full border px-2 py-1 text-xs text-white focus:outline-none"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ArchitectServicesSectionEditor({
    content,
    onChange,
}: {
    content: Record<string, any>;
    onChange: (val: Record<string, any>) => void;
}) {
    const services = content.services || {};
    const disciplines = Array.isArray(services.disciplines)
        ? services.disciplines
        : [];

    const handleDisciplineChange = (
        index: number,
        field: string,
        val: string,
    ) => {
        const newDisciplines = [...disciplines];
        newDisciplines[index] = {
            ...newDisciplines[index],
            [field]: val,
        };
        onChange({
            ...content,
            services: {
                ...services,
                disciplines: newDisciplines,
            },
        });
    };

    return (
        <div className="space-y-6">
            <div className="border-border-stone/60 bg-stone-dark/30 space-y-4 border p-4">
                <h4 className="font-serif text-sm font-light text-white">
                    Service Disciplines
                </h4>
                <div className="space-y-3">
                    {disciplines.map((d: any, idx: number) => (
                        <div
                            key={idx}
                            className="border-border-stone/40 bg-charcoal/60 space-y-2 border p-3"
                        >
                            <div>
                                <label className="text-stone-warm block text-[10px]">
                                    Discipline Title
                                </label>
                                <input
                                    type="text"
                                    value={d.title || ''}
                                    onChange={(e) =>
                                        handleDisciplineChange(
                                            idx,
                                            'title',
                                            e.target.value,
                                        )
                                    }
                                    className="border-border-stone bg-charcoal focus:border-champagne w-full border px-2 py-1 text-xs text-white focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-stone-warm block text-[10px]">
                                    Description
                                </label>
                                <textarea
                                    value={d.description || ''}
                                    onChange={(e) =>
                                        handleDisciplineChange(
                                            idx,
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    rows={2}
                                    className="border-border-stone bg-charcoal focus:border-champagne w-full border px-2 py-1 text-xs text-white focus:outline-none"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ContactSectionEditor({
    content,
    onChange,
}: {
    content: Record<string, any>;
    onChange: (val: Record<string, any>) => void;
}) {
    const directContact = content.directContact || {};

    const handleContactChange = (field: string, val: string) => {
        onChange({
            ...content,
            directContact: {
                ...directContact,
                [field]: val,
            },
        });
    };

    return (
        <div className="space-y-6">
            <div className="border-border-stone/60 bg-stone-dark/30 space-y-3 border p-4">
                <h4 className="font-serif text-sm font-light text-white">
                    Direct Contact Coordinates
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                        <label className="text-stone-warm mb-1 block text-[11px]">
                            Phone Display
                        </label>
                        <input
                            type="text"
                            value={directContact.phoneDisplay || ''}
                            onChange={(e) =>
                                handleContactChange(
                                    'phoneDisplay',
                                    e.target.value,
                                )
                            }
                            className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-1.5 text-xs text-white focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-stone-warm mb-1 block text-[11px]">
                            Email Value
                        </label>
                        <input
                            type="email"
                            value={directContact.emailValue || ''}
                            onChange={(e) =>
                                handleContactChange(
                                    'emailValue',
                                    e.target.value,
                                )
                            }
                            className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-1.5 text-xs text-white focus:outline-none"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="text-stone-warm mb-1 block text-[11px]">
                            Studio Location
                        </label>
                        <input
                            type="text"
                            value={directContact.locationValue || ''}
                            onChange={(e) =>
                                handleContactChange(
                                    'locationValue',
                                    e.target.value,
                                )
                            }
                            className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-1.5 text-xs text-white focus:outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function HomeSectionEditor({
    content,
    onChange,
}: {
    content: Record<string, any>;
    onChange: (val: Record<string, any>) => void;
}) {
    const brandPositioning = content.brandPositioning || {};

    const handlePosChange = (field: string, val: string) => {
        onChange({
            ...content,
            brandPositioning: {
                ...brandPositioning,
                [field]: val,
            },
        });
    };

    return (
        <div className="space-y-6">
            <div className="border-border-stone/60 bg-stone-dark/30 space-y-3 border p-4">
                <h4 className="font-serif text-sm font-light text-white">
                    Brand Positioning Statement
                </h4>
                <div>
                    <label className="text-stone-warm mb-1 block text-[11px]">
                        Heading
                    </label>
                    <input
                        type="text"
                        value={brandPositioning.heading || ''}
                        onChange={(e) =>
                            handlePosChange('heading', e.target.value)
                        }
                        className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                </div>
                <div>
                    <label className="text-stone-warm mb-1 block text-[11px]">
                        Paragraph 1
                    </label>
                    <textarea
                        value={brandPositioning.paragraph1 || ''}
                        onChange={(e) =>
                            handlePosChange('paragraph1', e.target.value)
                        }
                        rows={2}
                        className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                </div>
                <div>
                    <label className="text-stone-warm mb-1 block text-[11px]">
                        Paragraph 2
                    </label>
                    <textarea
                        value={brandPositioning.paragraph2 || ''}
                        onChange={(e) =>
                            handlePosChange('paragraph2', e.target.value)
                        }
                        rows={2}
                        className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
}

function CollectionsSectionEditor({
    content,
    onChange,
}: {
    content: Record<string, any>;
    onChange: (val: Record<string, any>) => void;
}) {
    const intro = content.intro || {};

    return (
        <div className="space-y-6">
            <div className="border-border-stone/60 bg-stone-dark/30 space-y-3 border p-4">
                <h4 className="font-serif text-sm font-light text-white">
                    Collections Overview Intro
                </h4>
                <div>
                    <label className="text-stone-warm mb-1 block text-[11px]">
                        Headline
                    </label>
                    <input
                        type="text"
                        value={intro.headline || ''}
                        onChange={(e) =>
                            onChange({
                                ...content,
                                intro: { ...intro, headline: e.target.value },
                            })
                        }
                        className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                </div>
                <div>
                    <label className="text-stone-warm mb-1 block text-[11px]">
                        Paragraph 1
                    </label>
                    <textarea
                        value={intro.paragraph1 || ''}
                        onChange={(e) =>
                            onChange({
                                ...content,
                                intro: { ...intro, paragraph1: e.target.value },
                            })
                        }
                        rows={2}
                        className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
}

function GenericJsonSectionEditor({
    content,
    onChange,
}: {
    content: Record<string, any>;
    onChange: (val: Record<string, any>) => void;
}) {
    const [jsonString, setJsonString] = useState(
        JSON.stringify(content, null, 2),
    );
    const [parseError, setParseError] = useState<string | null>(null);

    const handleJsonChange = (val: string) => {
        setJsonString(val);
        try {
            const parsed = JSON.parse(val);
            setParseError(null);
            onChange(parsed);
        } catch (err: any) {
            setParseError(err.message);
        }
    };

    return (
        <div className="space-y-3">
            <h4 className="font-serif text-sm font-light text-white">
                Structured Content (JSON)
            </h4>
            <p className="text-taupe text-xs">
                Edit the raw structured sections for this page. Must be valid
                JSON.
            </p>
            {parseError && (
                <div className="border border-red-800/50 bg-red-950/40 p-2 text-xs text-red-400">
                    JSON Syntax Error: {parseError}
                </div>
            )}
            <textarea
                value={jsonString}
                onChange={(e) => handleJsonChange(e.target.value)}
                rows={14}
                className="border-border-stone bg-charcoal focus:border-champagne w-full border px-3 py-2 font-mono text-xs text-white focus:outline-none"
            />
        </div>
    );
}
