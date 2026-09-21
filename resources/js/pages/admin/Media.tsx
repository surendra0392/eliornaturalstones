import { useState, useEffect, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AdminButton } from '../../components/admin/ui/AdminButton';
import { AdminInput } from '../../components/admin/ui/AdminInput';
import { AdminSelect } from '../../components/admin/ui/AdminSelect';
import { AdminEmptyState } from '../../components/admin/ui/AdminEmptyState';
import { AdminMediaCard } from '../../components/admin/media/AdminMediaCard';
import { AdminMediaUploadModal } from '../../components/admin/media/AdminMediaUploadModal';
import { AdminMediaDetailModal } from '../../components/admin/media/AdminMediaDetailModal';
import { apiClient } from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';
import type {
    MediaItem,
    MediaPaginationMeta,
    CanonicalCollectionRef,
    VarietyRef,
} from '../../types/media';

interface MediaAdminProps {
    initialMedia?: MediaItem[];
    initialMeta?: MediaPaginationMeta;
    canonicalCollections?: CanonicalCollectionRef[];
    varieties?: VarietyRef[];
}

export default function MediaAdmin({
    initialMedia = [],
    initialMeta = { current_page: 1, last_page: 1, per_page: 24, total: 0 },
    canonicalCollections = [],
    varieties = [],
}: MediaAdminProps) {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMedia);
    const [meta, setMeta] = useState<MediaPaginationMeta>(initialMeta);
    const [isLoading, setIsLoading] = useState(false);

    // Search and Filters
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [collectionFilter, setCollectionFilter] = useState('all');
    const [entityFilter, setEntityFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Modals
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

    // Notifications
    const [toast, setToast] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const showToast = (
        message: string,
        type: 'success' | 'error' = 'success',
    ) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // Debounce search input by 300ms
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchMedia = useCallback(
        async (page = 1) => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                params.set('page', String(page));
                params.set('per_page', '24');

                if (debouncedSearch.trim()) {
                    params.set('search', debouncedSearch.trim());
                }
                if (collectionFilter !== 'all') {
                    params.set('collection', collectionFilter);
                }
                if (entityFilter !== 'all') {
                    params.set('entity', entityFilter);
                }

                const endpoint = `${API_ENDPOINTS.v1.admin.media}?${params.toString()}`;
                const response = await apiClient<MediaItem[]>(endpoint);

                if (response.data) {
                    setMediaItems(response.data);
                }
                if (response.meta) {
                    setMeta(response.meta as unknown as MediaPaginationMeta);
                }
            } catch (err: unknown) {
                const msg =
                    err instanceof Error
                        ? err.message
                        : 'Failed to fetch media assets.';
                showToast(msg, 'error');
            } finally {
                setIsLoading(false);
            }
        },
        [debouncedSearch, collectionFilter, entityFilter],
    );

    // Refetch when filters change
    useEffect(() => {
        void fetchMedia(1);
    }, [fetchMedia]);

    const handleUploadSuccess = (newAssets: MediaItem[]) => {
        showToast(
            newAssets.length === 1
                ? 'Media asset uploaded successfully.'
                : `${newAssets.length} media assets uploaded successfully.`,
        );
        void fetchMedia(1);
    };

    const handleMediaUpdated = (updated: MediaItem) => {
        setMediaItems((prev) =>
            prev.map((m) => (m.id === updated.id ? updated : m)),
        );
        if (selectedMedia?.id === updated.id) {
            setSelectedMedia(updated);
        }
        showToast('Asset metadata saved successfully.');
    };

    const handleMediaAssigned = (assigned: MediaItem) => {
        showToast(
            `Asset assigned to ${assigned.associated_entity?.name || 'entity'}.`,
        );
        void fetchMedia(meta.current_page);
    };

    const handleMediaDeleted = (deletedId: number) => {
        setMediaItems((prev) => prev.filter((m) => m.id !== deletedId));
        setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
        setSelectedMedia(null);
        showToast('Media asset removed from catalog.');
    };

    return (
        <AdminLayout title="Media Library">
            <Head title="Media Library — ELIOR Admin" />

            {/* Notification Toast */}
            {toast && (
                <div
                    className={`fixed right-6 bottom-6 z-50 flex items-center gap-3 border px-4 py-3 font-mono text-xs shadow-2xl transition-all ${
                        toast.type === 'success'
                            ? 'border-gold/40 bg-graphite-dark text-gold-light'
                            : 'bg-graphite-dark border-red-500/40 text-red-400'
                    }`}
                >
                    <span className="bg-gold h-2 w-2 animate-pulse rounded-full" />
                    <span>{toast.message}</span>
                    <button
                        type="button"
                        onClick={() => setToast(null)}
                        className="text-taupe hover:text-ivory ml-2"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Header Toolbar */}
            <div className="border-border-stone flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-ivory font-serif text-2xl tracking-wide">
                        Media Library
                    </h1>
                    <p className="text-taupe mt-1 font-sans text-xs">
                        Manage the architectural imagery used throughout the
                        ELIOR website.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <AdminButton
                        variant="primary"
                        onClick={() => setIsUploadOpen(true)}
                        className="w-full sm:w-auto"
                    >
                        + UPLOAD MEDIA
                    </AdminButton>
                </div>
            </div>

            {/* Search & Filter Controls */}
            <div className="bg-stone-base/40 border-border-stone mt-6 flex flex-col gap-4 border p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                    {/* Search Input */}
                    <div className="relative min-w-[240px] flex-1">
                        <AdminInput
                            label="Search media"
                            name="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by filename, title, or alt text..."
                            className="w-full"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="text-taupe hover:text-ivory absolute top-2.5 right-3 font-mono text-xs"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Collection Filter */}
                    <div className="w-full sm:w-48">
                        <AdminSelect
                            label="Media Slot"
                            name="collection_filter"
                            value={collectionFilter}
                            onChange={(e) =>
                                setCollectionFilter(e.target.value)
                            }
                            options={[
                                {
                                    value: 'all',
                                    label: 'All Slots / Collections',
                                },
                                { value: 'hero', label: 'Hero Slots' },
                                { value: 'gallery', label: 'Gallery Slots' },
                                { value: 'slab', label: 'Slab Slots' },
                                { value: 'swatch', label: 'Swatch Slots' },
                                { value: 'uploads', label: 'General Uploads' },
                            ]}
                        />
                    </div>

                    {/* Entity Filter */}
                    <div className="w-full sm:w-48">
                        <AdminSelect
                            label="Associated Entity"
                            name="entity_filter"
                            value={entityFilter}
                            onChange={(e) => setEntityFilter(e.target.value)}
                            options={[
                                { value: 'all', label: 'All Entities' },
                                { value: 'collection', label: 'Collections' },
                                { value: 'variety', label: 'Stone Varieties' },
                                {
                                    value: 'unassigned',
                                    label: 'Unassigned Assets',
                                },
                            ]}
                        />
                    </div>
                </div>

                {/* View Mode Toggle */}
                <div className="border-border-stone bg-graphite flex items-center gap-1 self-end border p-1 lg:self-auto">
                    <button
                        type="button"
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-1 font-mono text-xs tracking-wider uppercase transition-colors ${
                            viewMode === 'grid'
                                ? 'bg-stone-base text-gold-light border-gold/30 border'
                                : 'text-taupe hover:text-ivory'
                        }`}
                    >
                        Grid
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-1 font-mono text-xs tracking-wider uppercase transition-colors ${
                            viewMode === 'list'
                                ? 'bg-stone-base text-gold-light border-gold/30 border'
                                : 'text-taupe hover:text-ivory'
                        }`}
                    >
                        List
                    </button>
                </div>
            </div>

            {/* Media Asset Display */}
            <div className="mt-6">
                {isLoading ? (
                    <div className="border-border-stone bg-stone-base/20 flex h-64 items-center justify-center border">
                        <div className="flex flex-col items-center gap-2">
                            <div className="border-gold h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
                            <span className="text-taupe font-mono text-xs tracking-widest uppercase">
                                Loading assets...
                            </span>
                        </div>
                    </div>
                ) : mediaItems.length === 0 ? (
                    <AdminEmptyState
                        title="No media assets found"
                        description={
                            search ||
                            collectionFilter !== 'all' ||
                            entityFilter !== 'all'
                                ? 'No images match your search criteria. Clear filters to browse all catalog assets.'
                                : 'Your architectural media catalog is empty. Upload stone photography to begin.'
                        }
                        action={
                            <AdminButton onClick={() => setIsUploadOpen(true)}>
                                + Upload First Asset
                            </AdminButton>
                        }
                    />
                ) : viewMode === 'grid' ? (
                    /* Primary Visual Grid View */
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {mediaItems.map((media) => (
                            <AdminMediaCard
                                key={media.id}
                                media={media}
                                onClick={(item) => setSelectedMedia(item)}
                            />
                        ))}
                    </div>
                ) : (
                    /* Alternative Table List View */
                    <div className="border-border-stone bg-stone-base/40 overflow-x-auto border">
                        <table className="w-full text-left text-xs">
                            <thead className="border-border-stone bg-graphite text-taupe border-b font-mono text-[10px] tracking-wider uppercase">
                                <tr>
                                    <th className="p-3">Asset</th>
                                    <th className="p-3">Filename / Title</th>
                                    <th className="p-3">Slot</th>
                                    <th className="p-3">Entity</th>
                                    <th className="p-3">Dimensions</th>
                                    <th className="p-3">Size</th>
                                    <th className="p-3">Uploaded</th>
                                    <th className="p-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-border-subtle divide-y font-sans">
                                {mediaItems.map((media) => (
                                    <tr
                                        key={media.id}
                                        onClick={() => setSelectedMedia(media)}
                                        className="hover:bg-stone-base/80 cursor-pointer transition-colors"
                                    >
                                        <td className="w-16 p-3">
                                            <div className="border-border-stone bg-graphite flex h-10 w-10 items-center justify-center overflow-hidden border">
                                                <img
                                                    src={
                                                        media.thumb_url ||
                                                        media.url
                                                    }
                                                    alt={
                                                        media.alt_text ||
                                                        media.name
                                                    }
                                                    className="h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </td>
                                        <td className="text-ivory p-3 font-medium">
                                            <div className="max-w-xs truncate">
                                                {media.name || media.file_name}
                                            </div>
                                            {media.alt_text && (
                                                <div className="text-taupe max-w-xs truncate font-mono text-[10px]">
                                                    {media.alt_text}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 font-mono text-[10px] text-stone-300 uppercase">
                                            {media.collection_name}
                                        </td>
                                        <td className="p-3 font-mono text-[10px]">
                                            {media.is_associated &&
                                            media.associated_entity ? (
                                                <span className="text-gold-light">
                                                    {
                                                        media.associated_entity
                                                            .name
                                                    }
                                                </span>
                                            ) : (
                                                <span className="text-taupe">
                                                    Unassigned
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-taupe p-3 font-mono text-[10px]">
                                            {media.dimensions.formatted || '—'}
                                        </td>
                                        <td className="text-taupe p-3 font-mono text-[10px]">
                                            {media.size_formatted}
                                        </td>
                                        <td className="text-taupe p-3 font-mono text-[10px]">
                                            {new Date(
                                                media.created_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="p-3 text-right">
                                            <span className="text-gold font-mono text-[10px] uppercase hover:underline">
                                                Inspect
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                {meta.total > 0 && (
                    <div className="border-border-stone text-taupe mt-6 flex flex-col items-center justify-between gap-4 border-t pt-4 font-mono text-xs sm:flex-row">
                        <div>
                            Showing page{' '}
                            <span className="text-ivory">
                                {meta.current_page}
                            </span>{' '}
                            of{' '}
                            <span className="text-ivory">{meta.last_page}</span>{' '}
                            ({meta.total} total assets)
                        </div>

                        <div className="flex items-center gap-2">
                            <AdminButton
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    void fetchMedia(meta.current_page - 1);
                                }}
                                disabled={meta.current_page <= 1 || isLoading}
                            >
                                ← PREVIOUS
                            </AdminButton>
                            <AdminButton
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    void fetchMedia(meta.current_page + 1);
                                }}
                                disabled={
                                    meta.current_page >= meta.last_page ||
                                    isLoading
                                }
                            >
                                NEXT →
                            </AdminButton>
                        </div>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            <AdminMediaUploadModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onSuccess={handleUploadSuccess}
                canonicalCollections={canonicalCollections}
                varieties={varieties}
            />

            {/* Detail & Inspector Modal */}
            <AdminMediaDetailModal
                isOpen={Boolean(selectedMedia)}
                media={selectedMedia}
                onClose={() => setSelectedMedia(null)}
                onUpdate={handleMediaUpdated}
                onDelete={handleMediaDeleted}
                onAssign={handleMediaAssigned}
                canonicalCollections={canonicalCollections}
                varieties={varieties}
            />
        </AdminLayout>
    );
}
