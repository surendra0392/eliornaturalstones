import { useState, useEffect, useRef } from 'react';
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

    // Hero image upload state & ref
    const heroFileInputRef = useRef<HTMLInputElement>(null);
    const [isUploadingHero, setIsUploadingHero] = useState(false);
    const [heroUploadError, setHeroUploadError] = useState<string | null>(null);

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
            'projects',
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

    const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setHeroUploadError('Please select a valid image file (WebP, JPG, PNG, etc.).');
            return;
        }

        if (file.size > 15 * 1024 * 1024) {
            setHeroUploadError('Image size exceeds 15MB limit.');
            return;
        }

        setIsUploadingHero(true);
        setHeroUploadError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            if (heroImageAlt.trim()) {
                formData.append('alt_text', heroImageAlt.trim());
            } else {
                formData.append(
                    'alt_text',
                    file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
                );
            }
            formData.append('entity_type', 'page');
            formData.append('entity_id', String(page.id));
            formData.append('collection_name', 'hero');

            const res = await apiClient<any>(API_ENDPOINTS.v1.admin.media, {
                method: 'POST',
                body: formData,
            });

            if (res?.data?.url) {
                setHeroImage(res.data.url);
                if (!heroImageAlt && res.data.alt_text) {
                    setHeroImageAlt(res.data.alt_text);
                }
            }
        } catch (err: any) {
            console.error('Failed to upload hero image:', err);
            setHeroUploadError(err?.message || 'Failed to upload hero image.');
        } finally {
            setIsUploadingHero(false);
            if (heroFileInputRef.current) {
                heroFileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm">
            <div className="flex h-full w-full max-w-4xl flex-col overflow-hidden border-l border-stone-200 bg-white shadow-2xl dark:border-stone-800 dark:bg-stone-900">
                {/* Sticky Header Bar */}
                <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50/80 px-6 py-4 backdrop-blur-xs dark:border-stone-800 dark:bg-stone-950/80">
                    <div className="flex items-center gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="font-serif text-lg font-normal text-stone-900 dark:text-stone-100">
                                    Edit Page: {page.title}
                                </h2>
                                {isCanonical && (
                                    <span className="border border-stone-300 bg-stone-100 px-2 py-0.5 text-[10px] font-medium tracking-wider text-stone-700 uppercase dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
                                        Canonical Page
                                    </span>
                                )}
                            </div>
                            <div className="mt-1 flex items-center gap-3">
                                <span className="text-xs text-stone-500 dark:text-stone-400">
                                    Slug:{' '}
                                    <code className="font-mono text-stone-700 dark:text-stone-300">
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
                                    className="inline-flex items-center gap-1 text-xs text-stone-600 underline hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                                >
                                    View Live ↗
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="flex cursor-pointer items-center gap-2 text-xs select-none">
                            <span className="text-xs text-stone-500 dark:text-stone-400">
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
                                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                        : 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                }`}
                            >
                                {isPublished ? '● Published' : '○ Draft'}
                            </span>
                        </label>

                        <button
                            type="button"
                            onClick={onClose}
                            className="border border-stone-300 px-3 py-1.5 text-xs font-medium uppercase text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSubmitting}
                            className="bg-stone-900 px-4 py-1.5 text-xs font-medium tracking-wider text-white uppercase transition-colors hover:bg-stone-800 disabled:opacity-40 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {/* Status Messages */}
                {errorMessage && (
                    <div className="border-b border-red-300 bg-red-50 px-6 py-2.5 text-xs text-red-800 dark:border-red-800/60 dark:bg-red-950/50 dark:text-red-300">
                        {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div className="border-b border-emerald-300 bg-emerald-50 px-6 py-2.5 text-xs text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300">
                        {successMessage}
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex border-b border-stone-200 bg-stone-50/40 px-6 dark:border-stone-800 dark:bg-stone-950/40">
                    <button
                        type="button"
                        onClick={() => setActiveTab('general')}
                        className={`border-b-2 px-4 py-3 text-xs font-medium tracking-wider uppercase transition-colors ${
                            activeTab === 'general'
                                ? 'border-stone-900 text-stone-900 dark:border-stone-100 dark:text-stone-100'
                                : 'border-transparent text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
                        }`}
                    >
                        General & SEO
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('hero')}
                        className={`border-b-2 px-4 py-3 text-xs font-medium tracking-wider uppercase transition-colors ${
                            activeTab === 'hero'
                                ? 'border-stone-900 text-stone-900 dark:border-stone-100 dark:text-stone-100'
                                : 'border-transparent text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
                        }`}
                    >
                        Hero Section
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('content')}
                        className={`border-b-2 px-4 py-3 text-xs font-medium tracking-wider uppercase transition-colors ${
                            activeTab === 'content'
                                ? 'border-stone-900 text-stone-900 dark:border-stone-100 dark:text-stone-100'
                                : 'border-transparent text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
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
                                    <label className="mb-1 block text-xs font-medium tracking-wider uppercase text-stone-700 dark:text-stone-300">
                                        Page Title{' '}
                                        <span className="text-stone-900 dark:text-stone-100">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        className="w-full border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium tracking-wider uppercase text-stone-700 dark:text-stone-300">
                                        URL Slug{' '}
                                        {isCanonical && (
                                            <span className="text-stone-400 dark:text-stone-500">
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
                                        className="w-full border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none disabled:bg-stone-100 disabled:opacity-50 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100 dark:disabled:bg-stone-900"
                                    />
                                    {isCanonical && (
                                        <p className="mt-1 text-[11px] text-stone-400 dark:text-stone-500">
                                            Canonical page slugs cannot be
                                            altered to protect route stability.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium tracking-wider uppercase text-stone-700 dark:text-stone-300">
                                    Subtitle / Secondary Line
                                </label>
                                <input
                                    type="text"
                                    value={subtitle}
                                    onChange={(e) =>
                                        setSubtitle(e.target.value)
                                    }
                                    className="w-full border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium tracking-wider uppercase text-stone-700 dark:text-stone-300">
                                    Page Excerpt
                                </label>
                                <textarea
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    rows={2}
                                    className="w-full border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                                />
                            </div>

                            <hr className="my-6 border-stone-200 dark:border-stone-800" />

                            <h3 className="font-serif text-base font-normal text-stone-900 dark:text-stone-100">
                                Search Engine Optimization (SEO)
                            </h3>

                            <div>
                                <div className="mb-1 flex items-center justify-between">
                                    <label className="text-xs font-medium tracking-wider uppercase text-stone-700 dark:text-stone-300">
                                        Meta Title
                                    </label>
                                    <span className="font-mono text-[11px] text-stone-400 dark:text-stone-500">
                                        {metaTitle.length}/60 chars
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    value={metaTitle}
                                    onChange={(e) =>
                                        setMetaTitle(e.target.value)
                                    }
                                    className="w-full border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                                    placeholder="ELIOR Natural Stones | ..."
                                />
                            </div>

                            <div>
                                <div className="mb-1 flex items-center justify-between">
                                    <label className="text-xs font-medium tracking-wider uppercase text-stone-700 dark:text-stone-300">
                                        Meta Description
                                    </label>
                                    <span className="font-mono text-[11px] text-stone-400 dark:text-stone-500">
                                        {metaDescription.length}/160 chars
                                    </span>
                                </div>
                                <textarea
                                    value={metaDescription}
                                    onChange={(e) =>
                                        setMetaDescription(e.target.value)
                                    }
                                    rows={3}
                                    className="w-full border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                                    placeholder="Brief description for search engines and social cards..."
                                />
                            </div>

                            {/* Search Preview Card */}
                            <div className="border border-stone-200 bg-stone-50/60 p-4 dark:border-stone-800 dark:bg-stone-950/60">
                                <span className="mb-2 block font-mono text-[10px] tracking-wider text-stone-400 uppercase dark:text-stone-500">
                                    Google Search Result Preview
                                </span>
                                <div className="font-sans text-xs">
                                    <p className="truncate text-sm font-medium text-blue-600 dark:text-blue-400">
                                        {metaTitle ||
                                            `${title} | ELIOR Natural Stones`}
                                    </p>
                                    <p className="truncate font-mono text-[11px] text-emerald-700 dark:text-emerald-500">
                                        https://eliornaturalstones.com/
                                        {slug === 'home' ? '' : slug}
                                    </p>
                                    <p className="mt-1 line-clamp-2 text-xs text-stone-600 dark:text-stone-400">
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
                                    <label className="mb-1 block text-xs font-medium tracking-wider uppercase text-stone-700 dark:text-stone-300">
                                        Eyebrow
                                    </label>
                                    <input
                                        type="text"
                                        value={heroEyebrow}
                                        onChange={(e) =>
                                            setHeroEyebrow(e.target.value)
                                        }
                                        placeholder="ELIOR / NATURAL STONES"
                                        className="w-full border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium tracking-wider uppercase text-stone-700 dark:text-stone-300">
                                        Marker / Badge
                                    </label>
                                    <input
                                        type="text"
                                        value={heroMarker}
                                        onChange={(e) =>
                                            setHeroMarker(e.target.value)
                                        }
                                        placeholder="SINCE 1990"
                                        className="w-full border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium tracking-wider uppercase text-stone-700 dark:text-stone-300">
                                    Hero Headline (H1)
                                </label>
                                <input
                                    type="text"
                                    value={heroTitle}
                                    onChange={(e) =>
                                        setHeroTitle(e.target.value)
                                    }
                                    className="w-full border border-stone-300 bg-white px-3 py-2 font-serif text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium tracking-wider uppercase text-stone-700 dark:text-stone-300">
                                    Supporting Narrative / Subtitle
                                </label>
                                <textarea
                                    value={heroSecondaryLine}
                                    onChange={(e) =>
                                        setHeroSecondaryLine(e.target.value)
                                    }
                                    rows={2}
                                    className="w-full border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                                />
                            </div>

                            {/* Call To Action Buttons */}
                            <div className="space-y-4 border border-stone-200 bg-stone-50/40 p-4 dark:border-stone-800 dark:bg-stone-950/40">
                                <h4 className="text-xs font-medium tracking-wider uppercase text-stone-900 dark:text-stone-100">
                                    Call To Action Actions
                                </h4>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-[11px] font-medium text-stone-600 dark:text-stone-400">
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
                                            className="w-full border border-stone-300 bg-white px-2.5 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-[11px] font-medium text-stone-600 dark:text-stone-400">
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
                                            className="w-full border border-stone-300 bg-white px-2.5 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-[11px] font-medium text-stone-600 dark:text-stone-400">
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
                                            className="w-full border border-stone-300 bg-white px-2.5 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-[11px] font-medium text-stone-600 dark:text-stone-400">
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
                                            className="w-full border border-stone-300 bg-white px-2.5 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Hero Image Picker & Direct Uploader */}
                            <div className="space-y-4 border border-stone-200 bg-stone-50/60 p-5 dark:border-stone-800 dark:bg-stone-950/60">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <label className="block text-xs font-medium tracking-wider uppercase text-stone-700 dark:text-stone-300">
                                            Architectural Hero Image
                                        </label>
                                        <p className="mt-0.5 text-[11px] text-stone-500 dark:text-stone-400">
                                            Select from media library, upload from your device, or enter a custom path.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            ref={heroFileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleHeroImageUpload}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => heroFileInputRef.current?.click()}
                                            disabled={isUploadingHero}
                                            className="inline-flex items-center gap-1.5 border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium tracking-wider uppercase text-stone-800 shadow-2xs transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700 disabled:opacity-50"
                                        >
                                            {isUploadingHero ? (
                                                <>
                                                    <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    <span>Uploading...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                    </svg>
                                                    <span>Upload Image</span>
                                                </>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setIsMediaPickerOpen(true)}
                                            className="border border-stone-300 bg-stone-100 px-3 py-1.5 text-xs font-medium tracking-wider uppercase text-stone-700 transition-colors hover:bg-stone-200 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800"
                                        >
                                            Media Library
                                        </button>

                                        {heroImage && (
                                            <button
                                                type="button"
                                                onClick={() => setHeroImage('')}
                                                className="border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/60"
                                                title="Clear Hero Image"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {heroUploadError && (
                                    <div className="border border-red-300 bg-red-50 p-2.5 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300">
                                        {heroUploadError}
                                    </div>
                                )}

                                <div className="flex flex-col items-start gap-4 sm:flex-row">
                                    {heroImage ? (
                                        <div
                                            onClick={() => heroFileInputRef.current?.click()}
                                            className="group relative h-32 w-52 flex-shrink-0 cursor-pointer overflow-hidden border border-stone-300 bg-black/40 shadow-xs dark:border-stone-700"
                                            title="Click to replace image"
                                        >
                                            <img
                                                src={heroImage}
                                                alt={heroImageAlt || 'Hero preview'}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                onError={(e) => {
                                                    (e.target as HTMLElement).style.display = 'none';
                                                }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                                <span className="text-[11px] font-medium tracking-wider uppercase text-white">
                                                    Change Image ↗
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => heroFileInputRef.current?.click()}
                                            className="flex h-32 w-52 flex-shrink-0 cursor-pointer flex-col items-center justify-center border border-dashed border-stone-300 bg-stone-100/50 p-3 text-center transition-colors hover:border-stone-500 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900/50 dark:hover:border-stone-600 dark:hover:bg-stone-900"
                                            title="Click to upload hero image"
                                        >
                                            <svg className="mb-1.5 h-6 w-6 text-stone-400 dark:text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-xs font-medium text-stone-700 dark:text-stone-300">
                                                Upload Hero Image
                                            </span>
                                            <span className="mt-0.5 text-[10px] text-stone-400 dark:text-stone-500">
                                                or choose from library
                                            </span>
                                        </div>
                                    )}

                                    <div className="w-full flex-1 space-y-2.5">
                                        <div>
                                            <label className="mb-1 block text-[11px] font-medium text-stone-600 dark:text-stone-400">
                                                Image URL / Static Path
                                            </label>
                                            <input
                                                type="text"
                                                value={heroImage}
                                                onChange={(e) => setHeroImage(e.target.value)}
                                                placeholder="/images/our-story/hero-legacy-stone.webp"
                                                className="w-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[11px] font-medium text-stone-600 dark:text-stone-400">
                                                Image Alt Text (SEO & Accessibility)
                                            </label>
                                            <input
                                                type="text"
                                                value={heroImageAlt}
                                                onChange={(e) => setHeroImageAlt(e.target.value)}
                                                placeholder="Descriptive architectural alt text"
                                                className="w-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
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

                            {page.slug === 'projects' && (
                                <ProjectsSectionEditor
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
                                'projects',
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
            <div className="space-y-3 border border-stone-200 bg-stone-50/60 p-4 dark:border-stone-800 dark:bg-stone-950/60">
                <h4 className="font-serif text-sm font-normal text-stone-900 dark:text-stone-100">
                    01. Opening Narrative Statement
                </h4>
                <div>
                    <label className="mb-1 block text-[11px] font-medium text-stone-600 dark:text-stone-400">
                        Statement
                    </label>
                    <input
                        type="text"
                        value={opening.statement || ''}
                        onChange={(e) =>
                            handleOpeningChange('statement', e.target.value)
                        }
                        className="w-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-[11px] font-medium text-stone-600 dark:text-stone-400">
                        Paragraph 1
                    </label>
                    <textarea
                        value={opening.paragraph1 || ''}
                        onChange={(e) =>
                            handleOpeningChange('paragraph1', e.target.value)
                        }
                        rows={2}
                        className="w-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-[11px] font-medium text-stone-600 dark:text-stone-400">
                        Paragraph 2
                    </label>
                    <textarea
                        value={opening.paragraph2 || ''}
                        onChange={(e) =>
                            handleOpeningChange('paragraph2', e.target.value)
                        }
                        rows={2}
                        className="w-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                    />
                </div>
            </div>

            {/* 02. Heritage Timeline Milestones */}
            <div className="space-y-4 border border-stone-200 bg-stone-50/60 p-4 dark:border-stone-800 dark:bg-stone-950/60">
                <div className="flex items-center justify-between">
                    <h4 className="font-serif text-sm font-normal text-stone-900 dark:text-stone-100">
                        02. Heritage Timeline Milestones (1990 – Present)
                    </h4>
                    <span className="font-mono text-[11px] text-stone-400 dark:text-stone-500">
                        {milestones.length} Milestones
                    </span>
                </div>

                <div className="space-y-3">
                    {milestones.map((m: any, idx: number) => (
                        <div
                            key={idx}
                            className="space-y-2 border border-stone-200 bg-white p-3.5 shadow-2xs dark:border-stone-800 dark:bg-stone-900/90"
                        >
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
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
                                        className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
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
                                        className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
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
                                        className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
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
                                    className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
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
            <div className="space-y-3 border border-stone-200 bg-stone-50/60 p-4 dark:border-stone-800 dark:bg-stone-950/60">
                <h4 className="font-serif text-sm font-normal text-stone-900 dark:text-stone-100">
                    01. Intro Statement
                </h4>
                <div>
                    <label className="mb-1 block text-[11px] font-medium text-stone-600 dark:text-stone-400">
                        Headline
                    </label>
                    <input
                        type="text"
                        value={intro.headline || ''}
                        onChange={(e) =>
                            handleIntroChange('headline', e.target.value)
                        }
                        className="w-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-[11px] font-medium text-stone-600 dark:text-stone-400">
                        Paragraph 1
                    </label>
                    <textarea
                        value={intro.paragraph1 || ''}
                        onChange={(e) =>
                            handleIntroChange('paragraph1', e.target.value)
                        }
                        rows={2}
                        className="w-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                    />
                </div>
            </div>

            <div className="space-y-4 border border-stone-200 bg-stone-50/60 p-4 dark:border-stone-800 dark:bg-stone-950/60">
                <h4 className="font-serif text-sm font-normal text-stone-900 dark:text-stone-100">
                    02. The Six Journey Stages
                </h4>
                <div className="space-y-3">
                    {stages.map((stage: any, idx: number) => (
                        <div
                            key={idx}
                            className="space-y-2 border border-stone-200 bg-white p-3.5 shadow-2xs dark:border-stone-800 dark:bg-stone-900/90"
                        >
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
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
                                        className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
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
                                        className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
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
                                    className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ProjectsSectionEditor({
    content,
    onChange,
}: {
    content: Record<string, any>;
    onChange: (val: Record<string, any>) => void;
}) {
    const intro = content.intro || {};
    const cta = content.cta || {};
    const projects = Array.isArray(content.projects) ? content.projects : [];
    const [mediaPickerIndex, setMediaPickerIndex] = useState<number | null>(null);

    const handleIntroChange = (field: string, val: string) => {
        onChange({
            ...content,
            intro: {
                ...intro,
                [field]: val,
            },
        });
    };

    const handleCtaChange = (field: string, val: string) => {
        onChange({
            ...content,
            cta: {
                ...cta,
                [field]: val,
            },
        });
    };

    const handleProjectChange = (
        index: number,
        field: string,
        val: any,
    ) => {
        const newProjects = [...projects];
        newProjects[index] = {
            ...newProjects[index],
            [field]: val,
        };
        onChange({
            ...content,
            projects: newProjects,
        });
    };

    const handleAddProject = () => {
        const timestamp = Date.now().toString(36);
        const newProject = {
            id: `commission-${timestamp}`,
            title: 'New Architectural Commission',
            typology: 'Private Residence',
            category: 'residential',
            location: 'Hyderabad, Telangana',
            year: String(new Date().getFullYear()),
            area: '12,000 sq.ft.',
            stones: ['Italian Marble', 'Black Granite'],
            description:
                'Brief architectural commission overview describing the project and application.',
            longDescription:
                'Detailed architectural study outlining spatial intent, quarry block selection, and bespoke cut-to-size specifications.',
            image: '/images/elior/projects/projects-hero.jpg',
            imageAlt: 'Architectural natural stone commission',
            featured: false,
        };

        onChange({
            ...content,
            projects: [newProject, ...projects],
        });
    };

    const handleDeleteProject = (index: number) => {
        const proj = projects[index];
        if (
            !window.confirm(
                `Are you sure you want to remove commission "${proj.title || 'Untitled'}"?`,
            )
        ) {
            return;
        }

        const newProjects = projects.filter((_, i) => i !== index);
        onChange({
            ...content,
            projects: newProjects,
        });
    };

    const handleMoveProject = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= projects.length) return;

        const newProjects = [...projects];
        const [moved] = newProjects.splice(index, 1);
        newProjects.splice(targetIndex, 0, moved);

        onChange({
            ...content,
            projects: newProjects,
        });
    };

    return (
        <div className="space-y-6">
            {/* Intro Editorial */}
            <div className="space-y-3 border border-stone-200 bg-stone-50/60 p-4 dark:border-stone-800 dark:bg-stone-950/60">
                <h4 className="font-serif text-sm font-normal text-stone-900 dark:text-stone-100">
                    Introductory Philosophy & Statement
                </h4>
                <div>
                    <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
                        Headline
                    </label>
                    <input
                        type="text"
                        value={intro.headline || ''}
                        onChange={(e) => handleIntroChange('headline', e.target.value)}
                        className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
                        Lead Paragraph
                    </label>
                    <textarea
                        value={intro.paragraph1 || ''}
                        onChange={(e) => handleIntroChange('paragraph1', e.target.value)}
                        rows={2}
                        className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
                        Supporting Paragraph
                    </label>
                    <textarea
                        value={intro.paragraph2 || ''}
                        onChange={(e) => handleIntroChange('paragraph2', e.target.value)}
                        rows={2}
                        className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                    />
                </div>
            </div>

            {/* Architectural Projects Header & Actions */}
            <div className="space-y-4 border border-stone-200 bg-stone-50/60 p-4 dark:border-stone-800 dark:bg-stone-950/60">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h4 className="font-serif text-sm font-normal text-stone-900 dark:text-stone-100">
                            Architectural Projects & Commissions ({projects.length})
                        </h4>
                        <p className="mt-0.5 text-[11px] text-stone-500 dark:text-stone-400">
                            Manage portfolio cards displayed on the /projects directory and the homepage featured section.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleAddProject}
                        className="inline-flex items-center gap-1 border border-stone-900 bg-stone-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-stone-800 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
                    >
                        <span>+</span>
                        <span>Add Project Commission</span>
                    </button>
                </div>

                <div className="space-y-4">
                    {projects.map((proj: any, idx: number) => {
                        const stonesText = Array.isArray(proj.stones)
                            ? proj.stones.join(', ')
                            : (proj.stones || '');

                        return (
                            <div
                                key={proj.id || idx}
                                className="space-y-3.5 border border-stone-200 bg-white p-4 shadow-2xs dark:border-stone-800 dark:bg-stone-900/90"
                            >
                                {/* Card Header / Controls */}
                                <div className="flex flex-wrap items-center justify-between border-b border-stone-200 pb-2.5 dark:border-stone-800">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs font-semibold text-stone-900 dark:text-stone-100">
                                            #{idx + 1}
                                        </span>
                                        <span className="text-xs font-medium text-stone-700 dark:text-stone-300">
                                            {proj.title || 'Untitled Commission'}
                                        </span>
                                        {proj.featured && (
                                            <span className="border border-amber-300 bg-amber-50 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
                                                Featured on Homepage
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            disabled={idx === 0}
                                            onClick={() => handleMoveProject(idx, 'up')}
                                            title="Move Up"
                                            className="border border-stone-200 px-2 py-0.5 text-xs text-stone-600 transition-colors hover:bg-stone-100 disabled:opacity-30 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800"
                                        >
                                            &uarr;
                                        </button>
                                        <button
                                            type="button"
                                            disabled={idx === projects.length - 1}
                                            onClick={() => handleMoveProject(idx, 'down')}
                                            title="Move Down"
                                            className="border border-stone-200 px-2 py-0.5 text-xs text-stone-600 transition-colors hover:bg-stone-100 disabled:opacity-30 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800"
                                        >
                                            &darr;
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteProject(idx)}
                                            className="border border-red-200 px-2 py-0.5 text-xs text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/50"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                {/* Primary Details Grid */}
                                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                                    <div className="sm:col-span-2">
                                        <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
                                            Project Title
                                        </label>
                                        <input
                                            type="text"
                                            value={proj.title || ''}
                                            onChange={(e) =>
                                                handleProjectChange(idx, 'title', e.target.value)
                                            }
                                            className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
                                            Anchor ID / Hash (e.g. #the-villa)
                                        </label>
                                        <input
                                            type="text"
                                            value={proj.id || ''}
                                            onChange={(e) =>
                                                handleProjectChange(
                                                    idx,
                                                    'id',
                                                    e.target.value
                                                        .toLowerCase()
                                                        .replace(/[^a-z0-9-]/g, '-'),
                                                )
                                            }
                                            className="w-full border border-stone-300 bg-white px-2 py-1 font-mono text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-4">
                                    <div>
                                        <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
                                            Typology
                                        </label>
                                        <input
                                            type="text"
                                            value={proj.typology || ''}
                                            onChange={(e) =>
                                                handleProjectChange(idx, 'typology', e.target.value)
                                            }
                                            placeholder="Private Residence"
                                            className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
                                            Category Filter
                                        </label>
                                        <select
                                            value={proj.category || 'residential'}
                                            onChange={(e) =>
                                                handleProjectChange(idx, 'category', e.target.value)
                                            }
                                            className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                        >
                                            <option value="residential">Private Residences</option>
                                            <option value="hospitality">Hospitality & Retreats</option>
                                            <option value="commercial">Commercial & Pavilions</option>
                                            <option value="landscape">Landscape & Courtyards</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            value={proj.location || ''}
                                            onChange={(e) =>
                                                handleProjectChange(idx, 'location', e.target.value)
                                            }
                                            placeholder="Jubilee Hills, Hyderabad"
                                            className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
                                            Completion Year
                                        </label>
                                        <input
                                            type="text"
                                            value={proj.year || ''}
                                            onChange={(e) =>
                                                handleProjectChange(idx, 'year', e.target.value)
                                            }
                                            placeholder="2025"
                                            className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                                    <div>
                                        <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
                                            Total Area
                                        </label>
                                        <input
                                            type="text"
                                            value={proj.area || ''}
                                            onChange={(e) =>
                                                handleProjectChange(idx, 'area', e.target.value)
                                            }
                                            placeholder="14,000 sq.ft."
                                            className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
                                            Stones Specified (comma-separated)
                                        </label>
                                        <input
                                            type="text"
                                            value={stonesText}
                                            onChange={(e) => {
                                                const raw = e.target.value;
                                                const list = raw
                                                    .split(',')
                                                    .map((s) => s.trim())
                                                    .filter(Boolean);
                                                handleProjectChange(idx, 'stones', list);
                                            }}
                                            placeholder="Italian Marble (Statuario), Black Galaxy Granite, Teakwood Sandstone"
                                            className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                        />
                                    </div>
                                </div>

                                {/* Homepage Featured Toggle */}
                                <div className="flex items-center gap-2 pt-1">
                                    <input
                                        type="checkbox"
                                        id={`proj-featured-${idx}`}
                                        checked={Boolean(proj.featured)}
                                        onChange={(e) =>
                                            handleProjectChange(idx, 'featured', e.target.checked)
                                        }
                                        className="h-3.5 w-3.5 border-stone-300 text-stone-900 focus:ring-0 dark:border-stone-700 dark:bg-stone-950"
                                    />
                                    <label
                                        htmlFor={`proj-featured-${idx}`}
                                        className="text-xs font-medium text-stone-700 dark:text-stone-300"
                                    >
                                        Feature on Homepage (showcase in 3-column architectural commissions grid)
                                    </label>
                                </div>

                                {/* Imagery Section with Media Picker */}
                                <div className="space-y-2 border-t border-stone-100 pt-2 dark:border-stone-800">
                                    <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
                                        Project Photography & Alt Text
                                    </label>
                                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                                        {proj.image && (
                                            <img
                                                src={proj.image}
                                                alt={proj.imageAlt || proj.title || 'Commission preview'}
                                                className="h-16 w-24 border border-stone-300 object-cover dark:border-stone-700"
                                                onError={(e) => {
                                                    (e.target as HTMLElement).style.display = 'none';
                                                }}
                                            />
                                        )}
                                        <div className="flex-1 space-y-1.5">
                                            <div className="flex items-center gap-1.5">
                                                <input
                                                    type="text"
                                                    value={proj.image || ''}
                                                    onChange={(e) =>
                                                        handleProjectChange(idx, 'image', e.target.value)
                                                    }
                                                    placeholder="/images/elior/projects/project-01.jpg"
                                                    className="w-full border border-stone-300 bg-white px-2 py-1 font-mono text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setMediaPickerIndex(idx)}
                                                    className="shrink-0 border border-stone-300 bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-800 transition-colors hover:bg-stone-200 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
                                                >
                                                    Media Library
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                value={proj.imageAlt || ''}
                                                onChange={(e) =>
                                                    handleProjectChange(idx, 'imageAlt', e.target.value)
                                                }
                                                placeholder="Descriptive alt text for accessibility & SEO"
                                                className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Descriptions */}
                                <div className="space-y-2 border-t border-stone-100 pt-2 dark:border-stone-800">
                                    <div>
                                        <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
                                            Card Description (shown on portfolio grid)
                                        </label>
                                        <textarea
                                            value={proj.description || ''}
                                            onChange={(e) =>
                                                handleProjectChange(idx, 'description', e.target.value)
                                            }
                                            rows={2}
                                            placeholder="A minimalist double-height villa centered around a reflecting water court..."
                                            className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
                                            Architectural Narrative / Case Study (shown in detail modal)
                                        </label>
                                        <textarea
                                            value={proj.longDescription || ''}
                                            onChange={(e) =>
                                                handleProjectChange(idx, 'longDescription', e.target.value)
                                            }
                                            rows={3}
                                            placeholder="Conceived as a sanctuary of light and water in Hyderabad’s Jubilee Hills..."
                                            className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CTA Section Configuration */}
            <div className="space-y-3 border border-stone-200 bg-stone-50/60 p-4 dark:border-stone-800 dark:bg-stone-950/60">
                <h4 className="font-serif text-sm font-normal text-stone-900 dark:text-stone-100">
                    Trade & Architectural Consultation Desk (Bottom CTA)
                </h4>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div>
                        <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
                            CTA Headline
                        </label>
                        <input
                            type="text"
                            value={cta.headline || ''}
                            onChange={(e) => handleCtaChange('headline', e.target.value)}
                            className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
                            CTA Button Text
                        </label>
                        <input
                            type="text"
                            value={cta.buttonText || ''}
                            onChange={(e) => handleCtaChange('buttonText', e.target.value)}
                            className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400">
                        CTA Subline
                    </label>
                    <textarea
                        value={cta.subline || ''}
                        onChange={(e) => handleCtaChange('subline', e.target.value)}
                        rows={2}
                        className="w-full border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                    />
                </div>
            </div>

            {/* Modal for Project Image Selection */}
            {mediaPickerIndex !== null && (
                <AdminMediaPickerModal
                    isOpen={true}
                    onClose={() => setMediaPickerIndex(null)}
                    currentUrl={projects[mediaPickerIndex]?.image || ''}
                    onSelect={({ url, alt }) => {
                        handleProjectChange(mediaPickerIndex, 'image', url);
                        if (alt && !projects[mediaPickerIndex]?.imageAlt) {
                            handleProjectChange(mediaPickerIndex, 'imageAlt', alt);
                        }
                        setMediaPickerIndex(null);
                    }}
                />
            )}
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
            <div className="space-y-3 border border-stone-200 bg-stone-50/60 p-4 dark:border-stone-800 dark:bg-stone-950/60">
                <h4 className="font-serif text-sm font-normal text-stone-900 dark:text-stone-100">
                    Direct Contact Coordinates
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-[11px] font-medium text-stone-600 dark:text-stone-400">
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
                            className="w-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-[11px] font-medium text-stone-600 dark:text-stone-400">
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
                            className="w-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="mb-1 block text-[11px] font-medium text-stone-600 dark:text-stone-400">
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
                            className="w-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
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
    const philosophy = content.philosophy || {};

    const handlePosChange = (field: string, val: string) => {
        onChange({
            ...content,
            brandPositioning: {
                ...brandPositioning,
                [field]: val,
            },
        });
    };

    const handlePhilChange = (field: string, val: string) => {
        onChange({
            ...content,
            philosophy: {
                ...philosophy,
                [field]: val,
            },
        });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-3 border border-stone-200 bg-stone-50/60 p-4 dark:border-stone-800 dark:bg-stone-950/60">
                <h4 className="font-serif text-sm font-normal text-stone-900 dark:text-stone-100">
                    Brand Positioning Statement
                </h4>
                <div>
                    <label className="mb-1 block text-[11px] font-medium text-stone-600 dark:text-stone-400">
                        Heading
                    </label>
                    <input
                        type="text"
                        value={brandPositioning.heading || ''}
                        onChange={(e) =>
                            handlePosChange('heading', e.target.value)
                        }
                        className="w-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-[11px] font-medium text-stone-600 dark:text-stone-400">
                        Paragraph 1
                    </label>
                    <textarea
                        value={brandPositioning.paragraph1 || ''}
                        onChange={(e) =>
                            handlePosChange('paragraph1', e.target.value)
                        }
                        rows={2}
                        className="w-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-[11px] font-medium text-stone-600 dark:text-stone-400">
                        Paragraph 2
                    </label>
                    <textarea
                        value={brandPositioning.paragraph2 || ''}
                        onChange={(e) =>
                            handlePosChange('paragraph2', e.target.value)
                        }
                        rows={2}
                        className="w-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                    />
                </div>
            </div>

            {/* Material Philosophy Section */}
            <div className="space-y-3 border border-stone-200 bg-stone-50/60 p-4 dark:border-stone-800 dark:bg-stone-950/60">
                <h4 className="font-serif text-sm font-normal text-stone-900 dark:text-stone-100">
                    Material Philosophy
                </h4>
                <div>
                    <label className="mb-1 block text-[11px] font-medium text-stone-600 dark:text-stone-400">
                        Headline
                    </label>
                    <input
                        type="text"
                        value={philosophy.headline || ''}
                        onChange={(e) =>
                            handlePhilChange('headline', e.target.value)
                        }
                        placeholder="Formed by Nature. Defined by Architecture."
                        className="w-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-[11px] font-medium text-stone-600 dark:text-stone-400">
                        Supporting Statement
                    </label>
                    <textarea
                        value={philosophy.supportingStatement || ''}
                        onChange={(e) =>
                            handlePhilChange(
                                'supportingStatement',
                                e.target.value,
                            )
                        }
                        placeholder="Every block of stone carries an unrepeatable geological story..."
                        rows={2}
                        className="w-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
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
            <div className="space-y-3 border border-stone-200 bg-stone-50/60 p-4 dark:border-stone-800 dark:bg-stone-950/60">
                <h4 className="font-serif text-sm font-normal text-stone-900 dark:text-stone-100">
                    Collections Overview Intro
                </h4>
                <div>
                    <label className="mb-1 block text-[11px] font-medium text-stone-600 dark:text-stone-400">
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
                        className="w-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-[11px] font-medium text-stone-600 dark:text-stone-400">
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
                        className="w-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
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
            <h4 className="font-serif text-sm font-normal text-stone-900 dark:text-stone-100">
                Structured Content (JSON)
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400">
                Edit the raw structured sections for this page. Must be valid
                JSON.
            </p>
            {parseError && (
                <div className="border border-red-300 bg-red-50 p-2 text-xs text-red-600 dark:border-red-800/50 dark:bg-red-950/40 dark:text-red-400">
                    JSON Syntax Error: {parseError}
                </div>
            )}
            <textarea
                value={jsonString}
                onChange={(e) => handleJsonChange(e.target.value)}
                rows={14}
                className="w-full border border-stone-300 bg-white px-3 py-2 font-mono text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
            />
        </div>
    );
}
