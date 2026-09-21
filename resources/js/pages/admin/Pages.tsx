import { useState, useEffect, useTransition } from 'react';
import { Head } from '@inertiajs/react';
import { AdminLayout } from '../../layouts/AdminLayout';
import type { Page, PagePaginationMeta } from '../../types/page';
import { AdminPageEditor } from '../../components/admin/pages/AdminPageEditor';
import { apiClient } from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';

interface PagesAdminProps {
    initialPages?: Page[];
    initialMeta?: PagePaginationMeta;
}

export default function PagesAdmin({
    initialPages = [],
    initialMeta,
}: PagesAdminProps) {
    const [pages, setPages] = useState<Page[]>(initialPages);
    const [meta, setMeta] = useState<PagePaginationMeta | undefined>(
        initialMeta,
    );
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<
        'all' | 'published' | 'draft'
    >('all');
    const [isLoading, setIsLoading] = useState(false);
    const [, startTransition] = useTransition();

    // Editor state
    const [editingPage, setEditingPage] = useState<Page | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    // Toast notification state
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error';
    } | null>(null);

    const showToast = (
        message: string,
        type: 'success' | 'error' = 'success',
    ) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    // Load pages when search or filter changes
    const fetchPages = async (
        query = search,
        status = statusFilter,
        pageNum = 1,
    ) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', String(pageNum));
            params.set('per_page', '15');
            if (query.trim()) params.set('search', query.trim());
            if (status !== 'all') params.set('status', status);

            const res = await apiClient<Page[]>(
                `${API_ENDPOINTS.v1.admin.pages}?${params.toString()}`,
            );

            if (res) {
                startTransition(() => {
                    if (res.data) setPages(res.data);
                    if (res.meta)
                        setMeta(res.meta as unknown as PagePaginationMeta);
                });
            }
        } catch (err: any) {
            console.error('Failed to fetch pages:', err);
            showToast('Failed to load pages.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            void fetchPages(search, statusFilter, 1);
        }, 250);

        return () => clearTimeout(timer);
    }, [search, statusFilter]);

    // Quick Publish / Unpublish Toggle
    const handleTogglePublish = async (page: Page) => {
        const nextStatus = !page.is_published;
        const origPages = [...pages];

        // Optimistic update
        setPages((prev) =>
            prev.map((p) =>
                p.id === page.id ? { ...p, is_published: nextStatus } : p,
            ),
        );

        try {
            const res = await apiClient<Page>(
                API_ENDPOINTS.v1.admin.publishPage(page.id),
                {
                    method: 'PATCH',
                    body: JSON.stringify({ is_published: nextStatus }),
                },
            );

            if (res?.data) {
                setPages((prev) =>
                    prev.map((p) => (p.id === page.id ? res.data! : p)),
                );
                showToast(res.message || 'Page status updated.');
            }
        } catch (err: any) {
            // Rollback on error
            setPages(origPages);
            const msg =
                err?.response?.data?.message || 'Failed to update page status.';
            showToast(msg, 'error');
        }
    };

    const handleOpenEditor = (page: Page) => {
        setEditingPage(page);
        setIsEditorOpen(true);
    };

    const handlePageSaved = (updatedPage: Page) => {
        setPages((prev) =>
            prev.map((p) => (p.id === updatedPage.id ? updatedPage : p)),
        );
        showToast(`Page '${updatedPage.title}' saved successfully.`);
    };

    const totalCount = meta?.counts?.total ?? pages.length;
    const publishedCount =
        meta?.counts?.published ?? pages.filter((p) => p.is_published).length;
    const draftCount =
        meta?.counts?.draft ?? pages.filter((p) => !p.is_published).length;

    return (
        <AdminLayout title="Pages CMS">
            <Head title="Pages CMS — ELIOR Admin" />

            {/* Toast Alert */}
            {toast && (
                <div
                    role="alert"
                    className={`fixed right-6 bottom-6 z-50 flex items-center gap-3 border px-4 py-3 shadow-xl transition-all ${
                        toast.type === 'success'
                            ? 'border-emerald-700/60 bg-emerald-950/90 text-emerald-200'
                            : 'border-red-700/60 bg-red-950/90 text-red-200'
                    }`}
                >
                    <span className="text-sm">
                        {toast.type === 'success' ? '✓' : '✕'}
                    </span>
                    <span className="text-xs font-medium">{toast.message}</span>
                </div>
            )}

            <div className="space-y-6">
                {/* Header & Metrics Bar */}
                <div className="border-border-stone bg-charcoal flex flex-col justify-between gap-4 border p-6 md:flex-row md:items-center">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="font-serif text-2xl font-light tracking-wide text-white">
                                Pages CMS
                            </h1>
                            <span className="border-champagne/30 text-champagne bg-champagne/10 rounded px-2.5 py-0.5 text-[10px] font-medium tracking-wider uppercase">
                                Structured Content
                            </span>
                        </div>
                        <p className="text-stone-warm mt-1 text-xs">
                            Manage editorial narratives, architectural
                            statements, and structured section content.
                        </p>
                    </div>

                    {/* Status Metric Pills */}
                    <div className="flex items-center gap-2">
                        <div className="border-border-stone/60 bg-stone-dark/60 border px-3 py-1.5 text-center">
                            <span className="text-taupe block text-[10px] tracking-wider uppercase">
                                Total Pages
                            </span>
                            <span className="font-serif text-base text-white">
                                {totalCount}
                            </span>
                        </div>
                        <div className="border border-emerald-900/40 bg-emerald-950/20 px-3 py-1.5 text-center">
                            <span className="block text-[10px] tracking-wider text-emerald-400 uppercase">
                                Published
                            </span>
                            <span className="font-serif text-base text-emerald-300">
                                {publishedCount}
                            </span>
                        </div>
                        <div className="border border-amber-900/40 bg-amber-950/20 px-3 py-1.5 text-center">
                            <span className="block text-[10px] tracking-wider text-amber-400 uppercase">
                                Draft
                            </span>
                            <span className="font-serif text-base text-amber-300">
                                {draftCount}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="border-border-stone bg-charcoal flex flex-col items-center justify-between gap-4 border p-4 sm:flex-row">
                    {/* Status Filter Tabs */}
                    <div className="flex w-full items-center gap-1 sm:w-auto">
                        {(['all', 'published', 'draft'] as const).map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setStatusFilter(tab)}
                                className={`px-3 py-1.5 text-xs font-medium tracking-wider uppercase transition-colors ${
                                    statusFilter === tab
                                        ? 'bg-champagne text-charcoal'
                                        : 'text-stone-warm hover:bg-stone-dark/50 hover:text-white'
                                }`}
                            >
                                {tab === 'all'
                                    ? `All (${totalCount})`
                                    : tab === 'published'
                                      ? `Published (${publishedCount})`
                                      : `Draft (${draftCount})`}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-72">
                        <input
                            type="text"
                            placeholder="Search by title or slug..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border-border-stone bg-stone-dark/60 placeholder:text-stone-warm focus:border-champagne w-full border px-3 py-1.5 text-xs text-white focus:outline-none"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="text-stone-warm absolute top-1.5 right-2.5 text-xs hover:text-white"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Pages Grid */}
                {isLoading ? (
                    <div className="border-border-stone bg-charcoal text-stone-warm flex h-64 items-center justify-center border text-xs">
                        Loading editorial pages...
                    </div>
                ) : pages.length === 0 ? (
                    <div className="border-border-stone bg-charcoal flex flex-col items-center justify-center border p-12 text-center">
                        <p className="font-serif text-lg text-white">
                            No pages found
                        </p>
                        <p className="text-taupe mt-1 text-xs">
                            {search
                                ? 'No pages matched your search criteria.'
                                : 'No pages found in this view.'}
                        </p>
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="border-border-stone text-champagne hover:bg-stone-dark/50 mt-4 border px-3 py-1.5 text-xs"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {pages.map((page) => {
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
                            const liveUrl =
                                page.live_url ||
                                (page.slug === 'home' ? '/' : `/${page.slug}`);

                            return (
                                <div
                                    key={page.id}
                                    className="border-border-stone bg-charcoal hover:border-border-stone/80 group flex flex-col justify-between border p-5 transition-colors"
                                >
                                    <div>
                                        {/* Top Card Meta */}
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-taupe font-mono text-[11px]">
                                                    /{page.slug}
                                                </span>
                                                {isCanonical && (
                                                    <span className="border-champagne/40 text-champagne bg-champagne/10 py-0.2 border px-1.5 text-[9px] font-medium tracking-wider uppercase">
                                                        Canonical
                                                    </span>
                                                )}
                                            </div>

                                            {/* Status Badge */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleTogglePublish(page)
                                                }
                                                title="Click to toggle publish status"
                                                className={`border px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase transition-all ${
                                                    page.is_published
                                                        ? 'border-emerald-800/50 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60'
                                                        : 'border-amber-800/50 bg-amber-950/40 text-amber-400 hover:bg-amber-900/60'
                                                }`}
                                            >
                                                {page.is_published
                                                    ? '● Published'
                                                    : '○ Draft'}
                                            </button>
                                        </div>

                                        {/* Page Title */}
                                        <h2 className="group-hover:text-champagne mt-3 font-serif text-lg font-light text-white transition-colors">
                                            {page.title}
                                        </h2>

                                        {/* Excerpt / Subtitle */}
                                        <p className="text-stone-warm mt-2 line-clamp-2 text-xs leading-relaxed">
                                            {page.subtitle ||
                                                page.excerpt ||
                                                'No excerpt configured.'}
                                        </p>
                                    </div>

                                    {/* Card Footer / Action Bar */}
                                    <div className="border-border-stone/40 mt-5 flex items-center justify-between border-t pt-4">
                                        <div className="text-taupe text-[11px]">
                                            {page.section_count
                                                ? `${page.section_count} Sections`
                                                : 'Structured Page'}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <a
                                                href={liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="border-border-stone/60 text-stone-warm hover:border-border-stone border px-2.5 py-1 text-[11px] transition-colors hover:text-white"
                                                title="View live page on website"
                                            >
                                                Live ↗
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleOpenEditor(page)
                                                }
                                                className="border border-stone-700 bg-stone-900 px-3 py-1 text-[11px] font-medium tracking-wider text-stone-100 uppercase transition-colors hover:border-stone-500 hover:bg-stone-800 hover:text-white"
                                            >
                                                Edit Page
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Slide-out / Modal Page Editor */}
            <AdminPageEditor
                page={editingPage}
                isOpen={isEditorOpen}
                onClose={() => {
                    setIsEditorOpen(false);
                    setEditingPage(null);
                }}
                onSaved={handlePageSaved}
            />
        </AdminLayout>
    );
}
