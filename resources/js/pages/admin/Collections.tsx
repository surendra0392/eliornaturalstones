import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { Head } from '@inertiajs/react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AdminButton } from '../../components/admin/ui/AdminButton';
import { AdminBadge } from '../../components/admin/ui/AdminBadge';
import { AdminCard } from '../../components/admin/ui/AdminCard';
import {
    AdminTable,
    AdminTableHeader,
    AdminTableBody,
    AdminTableRow,
    AdminTableHead,
    AdminTableCell,
} from '../../components/admin/ui/AdminTable';
import { AdminInput } from '../../components/admin/ui/AdminInput';
import { AdminTextarea } from '../../components/admin/ui/AdminTextarea';
import { AdminModal } from '../../components/admin/ui/AdminModal';
import { AdminEmptyState } from '../../components/admin/ui/AdminEmptyState';
import { apiClient, ApiError } from '../../api/client';

export interface AdminCollectionItem {
    id: number;
    name: string;
    slug: string;
    tagline: string | null;
    description: string | null;
    meta_title: string | null;
    meta_description: string | null;
    sort_order: number;
    is_active: boolean;
    hero_image?: string | null;
    varieties_count?: number;
    created_at?: string;
    updated_at?: string;
}

interface CollectionsAdminProps {
    initialCollections?: AdminCollectionItem[];
}

const CANONICAL_SLUGS = [
    'italian-marble',
    'granites',
    'slate-stone',
    'limestones',
    'cobble-stones',
    'pebbles',
    'quartz',
    'sculptures',
];

export default function CollectionsAdmin({
    initialCollections = [],
}: CollectionsAdminProps) {
    const [collections, setCollections] =
        useState<AdminCollectionItem[]>(initialCollections);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<
        'all' | 'active' | 'inactive'
    >('all');
    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    // Create / Edit Modal State
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingCollection, setEditingCollection] =
        useState<AdminCollectionItem | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        tagline: '',
        description: '',
        meta_title: '',
        meta_description: '',
        sort_order: 0,
        is_active: true,
    });

    // Delete / Deactivate Confirmation Modal State
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        actionLabel: string;
        variant: 'danger' | 'primary';
        collection: AdminCollectionItem | null;
        isProcessing: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        actionLabel: '',
        variant: 'danger',
        collection: null,
        isProcessing: false,
    });

    // Auto-dismiss notification after 5s
    useEffect(() => {
        if (!notification) return;
        const timer = setTimeout(() => {
            setNotification(null);
        }, 5000);
        return () => clearTimeout(timer);
    }, [notification]);

    // Fetch collections from REST API with search & status filter
    const fetchCollections = useCallback(
        async (search = searchQuery, status = statusFilter) => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                if (search.trim()) {
                    params.set('search', search.trim());
                }
                if (status !== 'all') {
                    params.set('status', status);
                }
                params.set('per_page', '100');

                const endpoint = `/api/v1/admin/collections?${params.toString()}`;
                const res = await apiClient<AdminCollectionItem[]>(endpoint);
                if (res.data) {
                    setCollections(res.data);
                }
            } catch (err) {
                const apiErr = err as ApiError;
                setNotification({
                    type: 'error',
                    message:
                        apiErr.message || 'Failed to fetch collections list.',
                });
            } finally {
                setIsLoading(false);
            }
        },
        [searchQuery, statusFilter],
    );

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            void fetchCollections(searchQuery, statusFilter);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery, statusFilter, fetchCollections]);

    // Helpers
    const isCanonical = (slug: string) => CANONICAL_SLUGS.includes(slug);

    const slugify = (text: string) =>
        text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

    const handleOpenCreate = () => {
        setEditingCollection(null);
        setFormData({
            name: '',
            slug: '',
            tagline: '',
            description: '',
            meta_title: '',
            meta_description: '',
            sort_order: collections.length + 1,
            is_active: true,
        });
        setFormErrors({});
        setIsFormModalOpen(true);
    };

    const handleOpenEdit = (collection: AdminCollectionItem) => {
        setEditingCollection(collection);
        setFormData({
            name: collection.name,
            slug: collection.slug,
            tagline: collection.tagline || '',
            description: collection.description || '',
            meta_title: collection.meta_title || '',
            meta_description: collection.meta_description || '',
            sort_order: collection.sort_order,
            is_active: collection.is_active,
        });
        setFormErrors({});
        setIsFormModalOpen(true);
    };

    const handleNameChange = (val: string) => {
        setFormData((prev) => ({
            ...prev,
            name: val,
            // Auto-generate slug only if creating a new collection
            slug: !editingCollection ? slugify(val) : prev.slug,
        }));
    };

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setFormErrors({});

        try {
            const isEditing = !!editingCollection;
            const endpoint = isEditing
                ? `/api/v1/admin/collections/${editingCollection.id}`
                : '/api/v1/admin/collections';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await apiClient<AdminCollectionItem>(endpoint, {
                method,
                body: JSON.stringify(formData),
            });

            setNotification({
                type: 'success',
                message:
                    res.message ||
                    (isEditing
                        ? 'Collection updated successfully.'
                        : 'Collection created successfully.'),
            });

            setIsFormModalOpen(false);
            void fetchCollections();
        } catch (err) {
            const apiErr = err as ApiError;
            if (apiErr.errors) {
                const mappedErrors: Record<string, string> = {};
                for (const [key, msgs] of Object.entries(apiErr.errors)) {
                    mappedErrors[key] = Array.isArray(msgs)
                        ? msgs[0]
                        : String(msgs);
                }
                setFormErrors(mappedErrors);
            } else {
                setNotification({
                    type: 'error',
                    message:
                        apiErr.message ||
                        'Failed to save collection. Please check input.',
                });
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleQuickStatusToggle = async (collection: AdminCollectionItem) => {
        try {
            const nextStatus = !collection.is_active;
            const res = await apiClient<AdminCollectionItem>(
                `/api/v1/admin/collections/${collection.id}/status`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({ is_active: nextStatus }),
                },
            );

            setCollections((prev) =>
                prev.map((c) =>
                    c.id === collection.id
                        ? { ...c, is_active: nextStatus }
                        : c,
                ),
            );

            setNotification({
                type: 'success',
                message:
                    res.message ||
                    `Collection "${collection.name}" ${nextStatus ? 'activated' : 'deactivated'}.`,
            });
        } catch (err) {
            const apiErr = err as ApiError;
            setNotification({
                type: 'error',
                message:
                    apiErr.message || 'Failed to update collection status.',
            });
        }
    };

    const handleAdjustOrder = async (
        collection: AdminCollectionItem,
        delta: number,
    ) => {
        const nextOrder = Math.max(0, collection.sort_order + delta);
        if (nextOrder === collection.sort_order) return;

        try {
            await apiClient<AdminCollectionItem>(
                `/api/v1/admin/collections/${collection.id}/order`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({ sort_order: nextOrder }),
                },
            );

            void fetchCollections();
        } catch (err) {
            const apiErr = err as ApiError;
            setNotification({
                type: 'error',
                message: apiErr.message || 'Failed to update sort order.',
            });
        }
    };

    const handlePromptDelete = (collection: AdminCollectionItem) => {
        if (isCanonical(collection.slug)) {
            setNotification({
                type: 'error',
                message:
                    'Canonical ELIOR collections cannot be deleted. You can deactivate them instead.',
            });
            return;
        }

        if (collection.varieties_count && collection.varieties_count > 0) {
            setNotification({
                type: 'error',
                message: `Cannot delete "${collection.name}" because it contains ${collection.varieties_count} associated varieties. Please reassign them or deactivate the collection.`,
            });
            return;
        }

        setConfirmDialog({
            isOpen: true,
            title: `Delete Collection: ${collection.name}`,
            message: `Are you sure you want to permanently delete the "${collection.name}" collection? This action cannot be undone.`,
            actionLabel: 'Delete Collection',
            variant: 'danger',
            collection,
            isProcessing: false,
        });
    };

    const handleConfirmDelete = async () => {
        const col = confirmDialog.collection;
        if (!col) return;

        setConfirmDialog((prev) => ({ ...prev, isProcessing: true }));

        try {
            const res = await apiClient<{ message: string }>(
                `/api/v1/admin/collections/${col.id}`,
                {
                    method: 'DELETE',
                },
            );

            setNotification({
                type: 'success',
                message: res.message || 'Collection deleted successfully.',
            });

            setConfirmDialog((prev) => ({
                ...prev,
                isOpen: false,
                isProcessing: false,
            }));
            void fetchCollections();
        } catch (err) {
            const apiErr = err as ApiError;
            setNotification({
                type: 'error',
                message: apiErr.message || 'Failed to delete collection.',
            });
            setConfirmDialog((prev) => ({
                ...prev,
                isOpen: false,
                isProcessing: false,
            }));
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '—';
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <AdminLayout title="Collections">
            <Head title="Collections Management — ELIOR Admin" />

            {/* Notification Toast */}
            {notification && (
                <div
                    className={`mb-6 flex items-center justify-between border px-4 py-3 text-xs transition-all ${
                        notification.type === 'success'
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200'
                            : 'border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/60 dark:text-red-200'
                    }`}
                    role="alert"
                >
                    <div className="flex items-center gap-2">
                        <span
                            className={`h-2 w-2 rounded-full ${
                                notification.type === 'success'
                                    ? 'bg-emerald-500'
                                    : 'bg-red-500'
                            }`}
                        />
                        <span>{notification.message}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setNotification(null)}
                        className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                        aria-label="Dismiss notification"
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* Page Header and Actions */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-serif text-2xl font-light text-stone-900 sm:text-3xl dark:text-stone-100">
                        Collections
                    </h1>
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                        Manage the natural stone collections displayed
                        throughout the ELIOR website.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <AdminButton
                        variant="primary"
                        onClick={handleOpenCreate}
                        className="w-full sm:w-auto"
                    >
                        <svg
                            className="mr-2 h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Add Collection
                    </AdminButton>
                </div>
            </div>

            {/* Canonical Reserves Informational Notice */}
            <div className="mb-8 border border-stone-200 bg-white p-5 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
                <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-2 w-2 shrink-0 rounded-full bg-stone-700 dark:bg-stone-300" />
                    <div className="text-xs text-stone-600 dark:text-stone-400">
                        <span className="font-medium text-stone-900 dark:text-stone-100">
                            Eight Canonical Architectural Collections Locked:
                        </span>{' '}
                        Italian Marble, Granites, Slate Stone, Limestones,
                        Cobble Stones, Pebbles, Quartz, and Sculptures.
                        Canonical collections cannot be permanently deleted, but
                        their descriptions, taglines, order, and active
                        visibility can be updated at any time.
                    </div>
                </div>
            </div>

            {/* Search and Filters Bar */}
            <AdminCard className="mb-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Search Input */}
                    <div className="w-full sm:max-w-md">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name or slug..."
                                className="min-h-[44px] w-full border border-stone-300 bg-stone-50/50 pr-4 pl-10 text-xs text-stone-900 placeholder-stone-400 focus:border-stone-900 focus:bg-white focus:ring-1 focus:ring-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100 dark:focus:ring-stone-100"
                                aria-label="Search collections"
                            />
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                                    aria-label="Clear search"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Status Filter Buttons */}
                    <div className="flex items-center gap-1.5 self-start sm:self-auto">
                        <span className="mr-2 font-mono text-[10px] tracking-wider text-stone-400 uppercase">
                            Filter:
                        </span>
                        {(['all', 'active', 'inactive'] as const).map(
                            (status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setStatusFilter(status)}
                                    className={`min-h-[44px] px-3.5 py-2 font-mono text-[10px] tracking-wider uppercase transition-colors ${
                                        statusFilter === status
                                            ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
                                    }`}
                                >
                                    {status}
                                </button>
                            ),
                        )}
                    </div>
                </div>
            </AdminCard>

            {/* Collections Management Table */}
            <AdminCard className="overflow-hidden p-0">
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="flex items-center gap-3 font-mono text-xs tracking-wider text-stone-500 uppercase">
                            <svg
                                className="h-4 w-4 animate-spin text-stone-600"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Loading collections...
                        </div>
                    </div>
                ) : collections.length === 0 ? (
                    <div className="p-8">
                        <AdminEmptyState
                            title="No Collections Found"
                            description={
                                searchQuery || statusFilter !== 'all'
                                    ? 'No collections matched your current search or status filter. Try clearing filters.'
                                    : 'There are currently no stone collections in the database.'
                            }
                            action={
                                searchQuery || statusFilter !== 'all' ? (
                                    <AdminButton
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setStatusFilter('all');
                                        }}
                                    >
                                        Clear Filters
                                    </AdminButton>
                                ) : (
                                    <AdminButton
                                        variant="primary"
                                        size="sm"
                                        onClick={handleOpenCreate}
                                    >
                                        Create Collection
                                    </AdminButton>
                                )
                            }
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <AdminTable>
                            <AdminTableHeader>
                                <AdminTableRow>
                                    <AdminTableHead className="w-20">
                                        Order
                                    </AdminTableHead>
                                    <AdminTableHead>Collection</AdminTableHead>
                                    <AdminTableHead>Slug</AdminTableHead>
                                    <AdminTableHead>Status</AdminTableHead>
                                    <AdminTableHead className="text-center">
                                        Varieties
                                    </AdminTableHead>
                                    <AdminTableHead>Updated</AdminTableHead>
                                    <AdminTableHead className="text-right">
                                        Actions
                                    </AdminTableHead>
                                </AdminTableRow>
                            </AdminTableHeader>
                            <AdminTableBody>
                                {collections.map((col) => {
                                    const canonical = isCanonical(col.slug);
                                    return (
                                        <AdminTableRow key={col.id}>
                                            {/* Order */}
                                            <AdminTableCell className="font-mono">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                                                        {col.sort_order}
                                                    </span>
                                                    <div className="flex flex-col">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleAdjustOrder(
                                                                    col,
                                                                    -1,
                                                                )
                                                            }
                                                            className="flex min-h-[20px] min-w-[20px] items-center justify-center p-0.5 leading-none text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                                                            title="Move up (lower sort order number)"
                                                            aria-label={`Move ${col.name} up`}
                                                        >
                                                            ▲
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleAdjustOrder(
                                                                    col,
                                                                    1,
                                                                )
                                                            }
                                                            className="flex min-h-[20px] min-w-[20px] items-center justify-center p-0.5 leading-none text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                                                            title="Move down (higher sort order number)"
                                                            aria-label={`Move ${col.name} down`}
                                                        >
                                                            ▼
                                                        </button>
                                                    </div>
                                                </div>
                                            </AdminTableCell>

                                            {/* Collection Name & Tagline */}
                                            <AdminTableCell>
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-stone-900 dark:text-stone-100">
                                                            {col.name}
                                                        </span>
                                                        {canonical && (
                                                            <AdminBadge variant="bronze">
                                                                Canonical
                                                            </AdminBadge>
                                                        )}
                                                    </div>
                                                    {col.tagline && (
                                                        <p className="line-clamp-1 max-w-xs text-[11px] text-stone-500 dark:text-stone-400">
                                                            {col.tagline}
                                                        </p>
                                                    )}
                                                </div>
                                            </AdminTableCell>

                                            {/* Slug */}
                                            <AdminTableCell>
                                                <code className="bg-stone-100 px-2 py-0.5 font-mono text-[11px] text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                                                    {col.slug}
                                                </code>
                                            </AdminTableCell>

                                            {/* Status */}
                                            <AdminTableCell>
                                                <div className="flex items-center gap-2">
                                                    <AdminBadge
                                                        variant={
                                                            col.is_active
                                                                ? 'success'
                                                                : 'neutral'
                                                        }
                                                    >
                                                        {col.is_active
                                                            ? 'Active'
                                                            : 'Inactive'}
                                                    </AdminBadge>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleQuickStatusToggle(
                                                                col,
                                                            )
                                                        }
                                                        className="flex min-h-[44px] items-center font-mono text-[10px] text-stone-400 uppercase underline decoration-stone-300 hover:text-stone-800 dark:hover:text-stone-200"
                                                        title={
                                                            col.is_active
                                                                ? 'Deactivate'
                                                                : 'Activate'
                                                        }
                                                    >
                                                        {col.is_active
                                                            ? 'Deactivate'
                                                            : 'Activate'}
                                                    </button>
                                                </div>
                                            </AdminTableCell>

                                            {/* Varieties */}
                                            <AdminTableCell className="text-center font-mono text-stone-600 dark:text-stone-400">
                                                {col.varieties_count ?? 0}
                                            </AdminTableCell>

                                            {/* Updated */}
                                            <AdminTableCell className="font-mono text-[11px] text-stone-500">
                                                {formatDate(col.updated_at)}
                                            </AdminTableCell>

                                            {/* Actions */}
                                            <AdminTableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <AdminButton
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleOpenEdit(col)
                                                        }
                                                    >
                                                        Edit
                                                    </AdminButton>
                                                    {!canonical && (
                                                        <AdminButton
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() =>
                                                                handlePromptDelete(
                                                                    col,
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </AdminButton>
                                                    )}
                                                </div>
                                            </AdminTableCell>
                                        </AdminTableRow>
                                    );
                                })}
                            </AdminTableBody>
                        </AdminTable>
                    </div>
                )}
            </AdminCard>

            {/* Create / Edit Collection Modal Dialog */}
            <AdminModal
                isOpen={isFormModalOpen}
                onClose={() => !isSaving && setIsFormModalOpen(false)}
                title={
                    editingCollection
                        ? `Edit Collection: ${editingCollection.name}`
                        : 'Add Natural Stone Collection'
                }
                description="Manage stone collection details, display sequence, and public catalog visibility."
                footer={
                    <>
                        <AdminButton
                            variant="outline"
                            type="button"
                            onClick={() => setIsFormModalOpen(false)}
                            disabled={isSaving}
                        >
                            Cancel
                        </AdminButton>
                        <AdminButton
                            variant="primary"
                            type="button"
                            onClick={handleFormSubmit}
                            isLoading={isSaving}
                        >
                            {editingCollection
                                ? 'Save Changes'
                                : 'Create Collection'}
                        </AdminButton>
                    </>
                }
            >
                <form
                    onSubmit={handleFormSubmit}
                    className="space-y-4"
                    noValidate
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Name */}
                        <AdminInput
                            label="Collection Name"
                            id="collection-name"
                            required
                            value={formData.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="e.g., Italian Marble"
                            error={formErrors.name}
                        />

                        {/* Slug */}
                        <AdminInput
                            label="URL Slug"
                            id="collection-slug"
                            required
                            value={formData.slug}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    slug: e.target.value,
                                }))
                            }
                            placeholder="e.g., italian-marble"
                            helperText="Used in public website URL: /collections/[slug]"
                            error={formErrors.slug}
                        />
                    </div>

                    {/* Tagline */}
                    <AdminInput
                        label="Tagline / Short Summary"
                        id="collection-tagline"
                        value={formData.tagline}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                tagline: e.target.value,
                            }))
                        }
                        placeholder="e.g., Timeless quarry masterworks from Carrara and Tuscany"
                        error={formErrors.tagline}
                    />

                    {/* Description */}
                    <AdminTextarea
                        label="Editorial Description"
                        id="collection-description"
                        rows={3}
                        value={formData.description}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                        placeholder="Detailed narrative describing geological heritage, tactile characteristics, and architectural applications..."
                        error={formErrors.description}
                    />

                    <div className="grid grid-cols-1 gap-4 border-t border-stone-200 pt-2 sm:grid-cols-2 dark:border-stone-800">
                        {/* Sort Order */}
                        <AdminInput
                            label="Display Order (0-9999)"
                            id="collection-sort-order"
                            type="number"
                            min={0}
                            max={9999}
                            value={formData.sort_order}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    sort_order:
                                        parseInt(e.target.value, 10) || 0,
                                }))
                            }
                            helperText="Lower numbers appear first on the public website"
                            error={formErrors.sort_order}
                        />

                        {/* Status Checkbox */}
                        <div className="flex min-h-[44px] flex-col justify-center space-y-1.5">
                            <label className="block text-[11px] font-medium tracking-[0.16em] text-stone-700 uppercase dark:text-stone-300">
                                Catalog Visibility
                            </label>
                            <label className="flex min-h-[44px] cursor-pointer items-center gap-3 py-1">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            is_active: e.target.checked,
                                        }))
                                    }
                                    className="h-4 w-4 rounded-none border-stone-300 text-stone-900 focus:ring-stone-900"
                                />
                                <span className="text-xs text-stone-700 dark:text-stone-300">
                                    Active (visible on public website and API)
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* SEO Meta Fields */}
                    <div className="space-y-4 border-t border-stone-200 pt-2 dark:border-stone-800">
                        <h4 className="font-mono text-[10px] tracking-wider text-stone-500 uppercase">
                            Search Engine Optimization (Optional)
                        </h4>
                        <AdminInput
                            label="Meta Title"
                            id="collection-meta-title"
                            value={formData.meta_title}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    meta_title: e.target.value,
                                }))
                            }
                            placeholder="e.g., Italian Marble Architectural Slabs | ELIOR Natural Stones"
                            error={formErrors.meta_title}
                        />
                        <AdminTextarea
                            label="Meta Description"
                            id="collection-meta-description"
                            rows={2}
                            value={formData.meta_description}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    meta_description: e.target.value,
                                }))
                            }
                            placeholder="Brief architectural meta summary for search engines..."
                            error={formErrors.meta_description}
                        />
                    </div>
                </form>
            </AdminModal>

            {/* Confirmation Dialog */}
            <AdminModal
                isOpen={confirmDialog.isOpen}
                onClose={() =>
                    !confirmDialog.isProcessing &&
                    setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
                }
                title={confirmDialog.title}
                maxWidth="md"
                footer={
                    <>
                        <AdminButton
                            variant="outline"
                            type="button"
                            onClick={() =>
                                setConfirmDialog((prev) => ({
                                    ...prev,
                                    isOpen: false,
                                }))
                            }
                            disabled={confirmDialog.isProcessing}
                        >
                            Cancel
                        </AdminButton>
                        <AdminButton
                            variant={confirmDialog.variant}
                            type="button"
                            onClick={handleConfirmDelete}
                            isLoading={confirmDialog.isProcessing}
                        >
                            {confirmDialog.actionLabel}
                        </AdminButton>
                    </>
                }
            >
                <div className="py-2">
                    <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-300">
                        {confirmDialog.message}
                    </p>
                </div>
            </AdminModal>
        </AdminLayout>
    );
}
