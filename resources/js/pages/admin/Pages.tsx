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
                <div className="flex flex-col justify-between gap-4 border border-stone-200 bg-white p-6 shadow-2xs md:flex-row md:items-center dark:border-stone-800 dark:bg-stone-900">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="font-serif text-2xl font-light text-stone-900 sm:text-3xl dark:text-stone-100">
                                Pages CMS
                            </h1>
                            <span className="border border-stone-300 bg-stone-100 px-2.5 py-0.5 text-[10px] font-medium tracking-wider text-stone-700 uppercase dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
                                Structured Content
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                            Manage editorial narratives, architectural statements, and structured section content.
                        </p>
                    </div>

                    {/* Status Metric Pills */}
                    <div className="flex items-center gap-2">
                        <div className="border border-stone-200 bg-stone-50 px-3.5 py-1.5 text-center dark:border-stone-800 dark:bg-stone-950">
                            <span className="block font-mono text-[9px] tracking-wider text-stone-400 uppercase dark:text-stone-500">
                                Total Pages
                            </span>
                            <span className="font-serif text-base font-normal text-stone-900 dark:text-stone-100">
                                {totalCount}
                            </span>
                        </div>
                        <div className="border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-center dark:border-emerald-800 dark:bg-emerald-950/60">
                            <span className="block font-mono text-[9px] tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
                                Published
                            </span>
                            <span className="font-serif text-base font-normal text-emerald-800 dark:text-emerald-300">
                                {publishedCount}
                            </span>
                        </div>
                        <div className="border border-amber-300 bg-amber-50 px-3.5 py-1.5 text-center dark:border-amber-800 dark:bg-amber-950/60">
                            <span className="block font-mono text-[9px] tracking-wider text-amber-700 uppercase dark:text-amber-400">
                                Draft
                            </span>
                            <span className="font-serif text-base font-normal text-amber-800 dark:text-amber-300">
                                {draftCount}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col items-center justify-between gap-4 border border-stone-200 bg-white p-4 shadow-2xs sm:flex-row dark:border-stone-800 dark:bg-stone-900">
                    {/* Status Filter Tabs */}
                    <div className="flex w-full items-center gap-1 sm:w-auto">
                        {(['all', 'published', 'draft'] as const).map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setStatusFilter(tab)}
                                className={`px-3 py-1.5 text-xs font-medium tracking-wider uppercase transition-colors ${
                                    statusFilter === tab
                                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100'
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
                            className="w-full border border-stone-300 bg-stone-50/50 px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-100"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute top-1.5 right-2.5 text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Pages Grid */}
                {isLoading ? (
                    <div className="flex h-64 items-center justify-center border border-stone-200 bg-white text-xs text-stone-500 shadow-2xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400">
                        Loading editorial pages...
                    </div>
                ) : pages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center border border-stone-200 bg-white p-12 text-center shadow-2xs dark:border-stone-800 dark:bg-stone-900">
                        <p className="font-serif text-lg text-stone-900 dark:text-stone-100">
                            No pages found
                        </p>
                        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                            {search
                                ? 'No pages matched your search criteria.'
                                : 'No pages found in this view.'}
                        </p>
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="mt-4 border border-stone-300 px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
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
                                    className="group flex flex-col justify-between border border-stone-200 bg-white p-5 shadow-2xs transition-all hover:border-stone-400 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700"
                                >
                                    <div>
                                        {/* Top Card Meta */}
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs text-stone-500 dark:text-stone-400">
                                                    /{page.slug}
                                                </span>
                                                {isCanonical && (
                                                    <span className="border border-stone-300 bg-stone-100 px-1.5 py-0.5 text-[9px] font-medium tracking-wider text-stone-700 uppercase dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
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
                                                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60'
                                                        : 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-900/60'
                                                }`}
                                            >
                                                {page.is_published
                                                    ? '● Published'
                                                    : '○ Draft'}
                                            </button>
                                        </div>

                                        {/* Page Title */}
                                        <h2 className="mt-3 font-serif text-lg font-normal text-stone-900 transition-colors group-hover:text-stone-700 dark:text-stone-100 dark:group-hover:text-stone-300">
                                            {page.title}
                                        </h2>

                                        {/* Excerpt / Subtitle */}
                                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                                            {page.subtitle ||
                                                page.excerpt ||
                                                'No excerpt configured.'}
                                        </p>
                                    </div>

                                    {/* Card Footer / Action Bar */}
                                    <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4 dark:border-stone-800/80">
                                        <div className="font-mono text-[11px] text-stone-400 dark:text-stone-500">
                                            {page.section_count
                                                ? `${page.section_count} Sections`
                                                : 'Structured Page'}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <a
                                                href={liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="border border-stone-200 px-2.5 py-1 text-[11px] text-stone-600 transition-colors hover:border-stone-400 hover:bg-stone-50 hover:text-stone-900 dark:border-stone-800 dark:text-stone-400 dark:hover:border-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
                                                title="View live page on website"
                                            >
                                                Live ↗
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleOpenEditor(page)
                                                }
                                                className="border border-transparent bg-stone-900 px-3 py-1 text-[11px] font-medium tracking-wider text-white uppercase transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
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
