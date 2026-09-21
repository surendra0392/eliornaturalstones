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
import { AdminSelect } from '../../components/admin/ui/AdminSelect';
import { AdminTextarea } from '../../components/admin/ui/AdminTextarea';
import { AdminModal } from '../../components/admin/ui/AdminModal';
import { AdminEmptyState } from '../../components/admin/ui/AdminEmptyState';
import { apiClient, ApiError } from '../../api/client';
import type { PaginatedMeta } from '../../types/api';

export interface AdminVarietyItem {
    id: number;
    collection_id: number;
    collection_name?: string;
    collection?: {
        id: number;
        name: string;
        slug: string;
    };
    name: string;
    slug: string;
    origin?: string | null;
    color_family?: string | null;
    finishes?: string[];
    description?: string | null;
    features?: string[];
    specifications?: Record<string, string>;
    meta_title?: string | null;
    meta_description?: string | null;
    sort_order: number;
    is_featured: boolean;
    is_active: boolean;
    slab_image?: string | null;
    swatch_image?: string | null;
    updated_at?: string;
    created_at?: string;
}

export interface CanonicalCollectionRef {
    id: number;
    name: string;
    slug: string;
}

interface VarietiesAdminProps {
    initialVarieties?: AdminVarietyItem[];
    initialMeta?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    canonicalCollections?: CanonicalCollectionRef[];
}

export default function VarietiesAdmin({
    initialVarieties = [],
    initialMeta = {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: initialVarieties.length,
    },
    canonicalCollections = [],
}: VarietiesAdminProps) {
    const [varieties, setVarieties] =
        useState<AdminVarietyItem[]>(initialVarieties);
    const [collectionsList, setCollectionsList] =
        useState<CanonicalCollectionRef[]>(canonicalCollections);
    const [meta, setMeta] = useState(initialMeta);
    const [isLoading, setIsLoading] = useState(false);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCollection, setSelectedCollection] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<
        'all' | 'active' | 'inactive'
    >('all');
    const [currentPage, setCurrentPage] = useState(
        initialMeta.current_page || 1,
    );

    // Notification State
    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    // Create / Edit Modal State
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingVariety, setEditingVariety] =
        useState<AdminVarietyItem | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        collection_id: collectionsList[0]?.id || 1,
        name: '',
        slug: '',
        color_family: '',
        finishesText: '',
        description: '',
        sort_order: 1,
        is_active: true,
        meta_title: '',
        meta_description: '',
    });

    // Delete Confirmation Modal State
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        actionLabel: string;
        variant: 'danger' | 'primary';
        variety: AdminVarietyItem | null;
        isProcessing: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        actionLabel: 'Delete Variety',
        variant: 'danger',
        variety: null,
        isProcessing: false,
    });

    // Auto-dismiss notification
    useEffect(() => {
        if (!notification) return;
        const timer = setTimeout(() => {
            setNotification(null);
        }, 5000);
        return () => clearTimeout(timer);
    }, [notification]);

    // Load collections list if empty
    useEffect(() => {
        if (collectionsList.length === 0) {
            void (async () => {
                try {
                    const res = await apiClient<CanonicalCollectionRef[]>(
                        '/api/v1/admin/collections?per_page=100',
                    );
                    if (res.data) {
                        setCollectionsList(res.data);
                    }
                } catch {
                    // Fallback to initial
                }
            })();
        }
    }, [collectionsList.length]);

    // Fetch varieties from API
    const fetchVarieties = useCallback(
        async (
            page = currentPage,
            search = searchQuery,
            collection = selectedCollection,
            status = statusFilter,
        ) => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                if (search.trim()) {
                    params.set('search', search.trim());
                }
                if (collection !== 'all') {
                    params.set('collection', collection);
                }
                if (status !== 'all') {
                    params.set('status', status);
                }
                params.set('page', String(page));
                params.set('per_page', '15');

                const endpoint = `/api/v1/admin/varieties?${params.toString()}`;
                const res = await apiClient<AdminVarietyItem[]>(endpoint);
                if (res.data) {
                    setVarieties(res.data);
                }
                if (res.meta) {
                    const paginated = res.meta as PaginatedMeta;
                    setMeta({
                        current_page: paginated.current_page ?? page,
                        last_page: paginated.last_page ?? 1,
                        per_page: paginated.per_page ?? 15,
                        total: paginated.total ?? res.data?.length ?? 0,
                    });
                }
            } catch (err) {
                const apiErr = err as ApiError;
                setNotification({
                    type: 'error',
                    message:
                        apiErr.message || 'Failed to fetch varieties catalog.',
                });
            } finally {
                setIsLoading(false);
            }
        },
        [currentPage, searchQuery, selectedCollection, statusFilter],
    );

    // Debounce search and filter updates
    useEffect(() => {
        const handler = setTimeout(() => {
            void fetchVarieties(
                1,
                searchQuery,
                selectedCollection,
                statusFilter,
            );
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery, selectedCollection, statusFilter, fetchVarieties]);

    const slugify = (text: string) =>
        text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

    const handleOpenCreate = () => {
        setEditingVariety(null);
        setFormData({
            collection_id:
                selectedCollection !== 'all' && Number(selectedCollection)
                    ? Number(selectedCollection)
                    : collectionsList[0]?.id || 1,
            name: '',
            slug: '',
            color_family: '',
            finishesText: 'Polished, Honed',
            description: '',
            sort_order: varieties.length + 1,
            is_active: true,
            meta_title: '',
            meta_description: '',
        });
        setFormErrors({});
        setIsFormModalOpen(true);
    };

    const handleOpenEdit = (variety: AdminVarietyItem) => {
        setEditingVariety(variety);
        setFormData({
            collection_id: variety.collection_id,
            name: variety.name,
            slug: variety.slug,
            color_family: variety.color_family || '',
            finishesText: (variety.finishes || []).join(', '),
            description: variety.description || '',
            sort_order: variety.sort_order,
            is_active: variety.is_active,
            meta_title: variety.meta_title || '',
            meta_description: variety.meta_description || '',
        });
        setFormErrors({});
        setIsFormModalOpen(true);
    };

    const handleNameChange = (val: string) => {
        setFormData((prev) => ({
            ...prev,
            name: val,
            slug: !editingVariety ? slugify(val) : prev.slug,
        }));
    };

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setFormErrors({});

        try {
            const isEditing = !!editingVariety;
            const endpoint = isEditing
                ? `/api/v1/admin/varieties/${editingVariety.id}`
                : '/api/v1/admin/varieties';
            const method = isEditing ? 'PUT' : 'POST';

            // Split finishesText into array
            const finishesArray = formData.finishesText
                .split(',')
                .map((f) => f.trim())
                .filter(Boolean);

            const payload = {
                collection_id: Number(formData.collection_id),
                name: formData.name,
                slug: formData.slug,
                color_family: formData.color_family || null,
                finishes: finishesArray,
                description: formData.description || null,
                sort_order: Number(formData.sort_order),
                is_active: formData.is_active,
                meta_title: formData.meta_title || null,
                meta_description: formData.meta_description || null,
            };

            const res = await apiClient<AdminVarietyItem>(endpoint, {
                method,
                body: JSON.stringify(payload),
            });

            setNotification({
                type: 'success',
                message:
                    res.message ||
                    (isEditing
                        ? 'Variety updated successfully.'
                        : 'Variety created successfully.'),
            });

            setIsFormModalOpen(false);
            void fetchVarieties();
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
                        'Failed to save variety. Please check input.',
                });
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleQuickStatusToggle = async (variety: AdminVarietyItem) => {
        try {
            const nextStatus = !variety.is_active;
            const res = await apiClient<AdminVarietyItem>(
                `/api/v1/admin/varieties/${variety.id}/status`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({ is_active: nextStatus }),
                },
            );

            setVarieties((prev) =>
                prev.map((v) =>
                    v.id === variety.id ? { ...v, is_active: nextStatus } : v,
                ),
            );

            setNotification({
                type: 'success',
                message:
                    res.message ||
                    `Variety "${variety.name}" ${nextStatus ? 'activated' : 'deactivated'}.`,
            });
        } catch (err) {
            const apiErr = err as ApiError;
            setNotification({
                type: 'error',
                message: apiErr.message || 'Failed to update variety status.',
            });
        }
    };

    const handleAdjustOrder = async (
        variety: AdminVarietyItem,
        delta: number,
    ) => {
        const nextOrder = Math.max(0, variety.sort_order + delta);
        if (nextOrder === variety.sort_order) return;

        try {
            await apiClient<AdminVarietyItem>(
                `/api/v1/admin/varieties/${variety.id}/order`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({ sort_order: nextOrder }),
                },
            );

            void fetchVarieties();
        } catch (err) {
            const apiErr = err as ApiError;
            setNotification({
                type: 'error',
                message: apiErr.message || 'Failed to update sort order.',
            });
        }
    };

    const handlePromptDelete = (variety: AdminVarietyItem) => {
        setConfirmDialog({
            isOpen: true,
            title: `Delete Variety: ${variety.name}`,
            message: `Are you sure you want to permanently delete "${variety.name}" from the ${variety.collection_name || 'parent'} collection? This variety will be removed from all public catalogues and applications.`,
            actionLabel: 'Delete Variety',
            variant: 'danger',
            variety,
            isProcessing: false,
        });
    };

    const handleConfirmDelete = async () => {
        const item = confirmDialog.variety;
        if (!item) return;

        setConfirmDialog((prev) => ({ ...prev, isProcessing: true }));

        try {
            const res = await apiClient<{ message: string }>(
                `/api/v1/admin/varieties/${item.id}`,
                {
                    method: 'DELETE',
                },
            );

            setNotification({
                type: 'success',
                message: res.message || 'Variety deleted successfully.',
            });

            setConfirmDialog((prev) => ({
                ...prev,
                isOpen: false,
                isProcessing: false,
            }));
            void fetchVarieties();
        } catch (err) {
            const apiErr = err as ApiError;
            setNotification({
                type: 'error',
                message: apiErr.message || 'Failed to delete variety.',
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

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > meta.last_page) return;
        setCurrentPage(newPage);
        void fetchVarieties(newPage);
    };

    return (
        <AdminLayout title="Varieties">
            <Head title="Varieties Management — ELIOR Admin" />

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

            {/* Page Header and Primary Action */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-serif text-2xl font-light text-stone-900 sm:text-3xl dark:text-stone-100">
                        Varieties
                    </h1>
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                        Manage the individual stone varieties presented within
                        each ELIOR collection.
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
                        Add Variety
                    </AdminButton>
                </div>
            </div>

            {/* Search & Filters Toolbar */}
            <AdminCard className="mb-6 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Search Input */}
                    <div className="w-full lg:max-w-xs">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, slug, or collection..."
                                className="min-h-[44px] w-full border border-stone-300 bg-stone-50/50 pr-4 pl-10 text-xs text-stone-900 placeholder-stone-400 focus:border-stone-900 focus:bg-white focus:ring-1 focus:ring-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100 dark:focus:ring-stone-100"
                                aria-label="Search varieties"
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

                    {/* Collection Selector & Status Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Collection Filter */}
                        <div className="w-full sm:w-auto">
                            <AdminSelect
                                aria-label="Filter by Collection"
                                value={selectedCollection}
                                onChange={(e) =>
                                    setSelectedCollection(e.target.value)
                                }
                                className="w-full sm:w-48"
                            >
                                <option value="all">All Collections</option>
                                {collectionsList.map((col) => (
                                    <option key={col.id} value={col.slug}>
                                        {col.name}
                                    </option>
                                ))}
                            </AdminSelect>
                        </div>

                        {/* Status Filter Buttons */}
                        <div className="flex items-center gap-1.5">
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
                </div>
            </AdminCard>

            {/* Varieties Table */}
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
                            Loading stone varieties...
                        </div>
                    </div>
                ) : varieties.length === 0 ? (
                    <div className="p-8">
                        <AdminEmptyState
                            title="No Varieties Found"
                            description={
                                searchQuery ||
                                selectedCollection !== 'all' ||
                                statusFilter !== 'all'
                                    ? 'No stone varieties match your current filter settings. Try resetting filters.'
                                    : 'There are currently no stone varieties in this category.'
                            }
                            action={
                                searchQuery ||
                                selectedCollection !== 'all' ||
                                statusFilter !== 'all' ? (
                                    <AdminButton
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedCollection('all');
                                            setStatusFilter('all');
                                        }}
                                    >
                                        Clear All Filters
                                    </AdminButton>
                                ) : (
                                    <AdminButton
                                        variant="primary"
                                        size="sm"
                                        onClick={handleOpenCreate}
                                    >
                                        Add Stone Variety
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
                                    <AdminTableHead>Variety</AdminTableHead>
                                    <AdminTableHead>Collection</AdminTableHead>
                                    <AdminTableHead>Slug</AdminTableHead>
                                    <AdminTableHead>Status</AdminTableHead>
                                    <AdminTableHead>Updated</AdminTableHead>
                                    <AdminTableHead className="text-right">
                                        Actions
                                    </AdminTableHead>
                                </AdminTableRow>
                            </AdminTableHeader>
                            <AdminTableBody>
                                {varieties.map((variety) => (
                                    <AdminTableRow key={variety.id}>
                                        {/* Order with controls */}
                                        <AdminTableCell className="font-mono">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-semibold text-stone-900 dark:text-stone-100">
                                                    {variety.sort_order}
                                                </span>
                                                <div className="flex flex-col">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleAdjustOrder(
                                                                variety,
                                                                -1,
                                                            )
                                                        }
                                                        className="flex min-h-[20px] min-w-[20px] items-center justify-center p-0.5 leading-none text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                                                        title="Move up (lower sort order number)"
                                                        aria-label={`Move ${variety.name} up`}
                                                    >
                                                        ▲
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleAdjustOrder(
                                                                variety,
                                                                1,
                                                            )
                                                        }
                                                        className="flex min-h-[20px] min-w-[20px] items-center justify-center p-0.5 leading-none text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                                                        title="Move down (higher sort order number)"
                                                        aria-label={`Move ${variety.name} down`}
                                                    >
                                                        ▼
                                                    </button>
                                                </div>
                                            </div>
                                        </AdminTableCell>

                                        {/* Variety Name & Color Family */}
                                        <AdminTableCell>
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-stone-900 dark:text-stone-100">
                                                        {variety.name}
                                                    </span>
                                                    {variety.is_featured && (
                                                        <span className="border border-amber-200 bg-amber-50 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-amber-700 uppercase dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                                {variety.color_family && (
                                                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                                                        Tone:{' '}
                                                        {variety.color_family}
                                                    </p>
                                                )}
                                            </div>
                                        </AdminTableCell>

                                        {/* Collection */}
                                        <AdminTableCell>
                                            <AdminBadge variant="bronze">
                                                {variety.collection_name ||
                                                    variety.collection?.name ||
                                                    'Collection'}
                                            </AdminBadge>
                                        </AdminTableCell>

                                        {/* Slug */}
                                        <AdminTableCell>
                                            <code className="bg-stone-100 px-2 py-0.5 font-mono text-[11px] text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                                                {variety.slug}
                                            </code>
                                        </AdminTableCell>

                                        {/* Status */}
                                        <AdminTableCell>
                                            <div className="flex items-center gap-2">
                                                <AdminBadge
                                                    variant={
                                                        variety.is_active
                                                            ? 'success'
                                                            : 'neutral'
                                                    }
                                                >
                                                    {variety.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </AdminBadge>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleQuickStatusToggle(
                                                            variety,
                                                        )
                                                    }
                                                    className="flex min-h-[44px] items-center font-mono text-[10px] text-stone-400 uppercase underline decoration-stone-300 hover:text-stone-800 dark:hover:text-stone-200"
                                                    title={
                                                        variety.is_active
                                                            ? 'Deactivate'
                                                            : 'Activate'
                                                    }
                                                >
                                                    {variety.is_active
                                                        ? 'Deactivate'
                                                        : 'Activate'}
                                                </button>
                                            </div>
                                        </AdminTableCell>

                                        {/* Updated */}
                                        <AdminTableCell className="font-mono text-[11px] text-stone-500">
                                            {formatDate(variety.updated_at)}
                                        </AdminTableCell>

                                        {/* Actions */}
                                        <AdminTableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <AdminButton
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleOpenEdit(variety)
                                                    }
                                                >
                                                    Edit
                                                </AdminButton>
                                                <AdminButton
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() =>
                                                        handlePromptDelete(
                                                            variety,
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </AdminButton>
                                            </div>
                                        </AdminTableCell>
                                    </AdminTableRow>
                                ))}
                            </AdminTableBody>
                        </AdminTable>
                    </div>
                )}

                {/* Pagination Controls */}
                {meta.total > 0 && (
                    <div className="flex flex-col gap-3 border-t border-stone-200/80 bg-stone-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800/80 dark:bg-stone-900/50">
                        <div className="font-mono text-[11px] text-stone-500">
                            Showing page {meta.current_page} of {meta.last_page}{' '}
                            ({meta.total} stone varieties)
                        </div>
                        <div className="flex items-center gap-2">
                            <AdminButton
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handlePageChange(meta.current_page - 1)
                                }
                                disabled={meta.current_page <= 1 || isLoading}
                            >
                                &larr; Previous
                            </AdminButton>
                            <AdminButton
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handlePageChange(meta.current_page + 1)
                                }
                                disabled={
                                    meta.current_page >= meta.last_page ||
                                    isLoading
                                }
                            >
                                Next &rarr;
                            </AdminButton>
                        </div>
                    </div>
                )}
            </AdminCard>

            {/* Create / Edit Variety Modal */}
            <AdminModal
                isOpen={isFormModalOpen}
                onClose={() => !isSaving && setIsFormModalOpen(false)}
                title={
                    editingVariety
                        ? `Edit Variety: ${editingVariety.name}`
                        : 'Add Stone Variety'
                }
                description="Manage stone variety metadata, finishes, parent collection, and public visibility."
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
                            {editingVariety ? 'Save Changes' : 'Create Variety'}
                        </AdminButton>
                    </>
                }
            >
                <form
                    onSubmit={handleFormSubmit}
                    className="space-y-4"
                    noValidate
                >
                    {/* Collection Selector */}
                    <AdminSelect
                        label="Parent Stone Collection"
                        id="variety-collection"
                        required
                        value={formData.collection_id}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                collection_id: Number(e.target.value),
                            }))
                        }
                        error={formErrors.collection_id}
                    >
                        {collectionsList.map((col) => (
                            <option key={col.id} value={col.id}>
                                {col.name}
                            </option>
                        ))}
                    </AdminSelect>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Name */}
                        <AdminInput
                            label="Variety Name"
                            id="variety-name"
                            required
                            value={formData.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="e.g., Calacatta Gold"
                            error={formErrors.name}
                        />

                        {/* Slug */}
                        <AdminInput
                            label="URL Slug"
                            id="variety-slug"
                            required
                            value={formData.slug}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    slug: e.target.value,
                                }))
                            }
                            placeholder="e.g., calacatta-gold"
                            error={formErrors.slug}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Color Family */}
                        <AdminInput
                            label="Color Tone / Palette"
                            id="variety-color-family"
                            value={formData.color_family}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    color_family: e.target.value,
                                }))
                            }
                            placeholder="e.g., Warm White, Ivory & Gold"
                            error={formErrors.color_family}
                        />

                        {/* Finishes */}
                        <AdminInput
                            label="Finishes (comma separated)"
                            id="variety-finishes"
                            value={formData.finishesText}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    finishesText: e.target.value,
                                }))
                            }
                            placeholder="e.g., Polished, Honed, Satin"
                            helperText="Separated by commas"
                            error={formErrors.finishes}
                        />
                    </div>

                    {/* Description */}
                    <AdminTextarea
                        label="Editorial Description"
                        id="variety-description"
                        rows={3}
                        value={formData.description}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                        placeholder="Architectural character, veining structure, tonal depth, and tactile relief..."
                        error={formErrors.description}
                    />

                    <div className="grid grid-cols-1 gap-4 border-t border-stone-200 pt-2 sm:grid-cols-2 dark:border-stone-800">
                        {/* Sort Order */}
                        <AdminInput
                            label="Display Order (0-9999)"
                            id="variety-sort-order"
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
                            helperText="Sequence within parent collection"
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
                                    Active (visible on public collection detail
                                    page)
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
                            id="variety-meta-title"
                            value={formData.meta_title}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    meta_title: e.target.value,
                                }))
                            }
                            placeholder="e.g., Calacatta Gold Marble | ELIOR Natural Stones"
                            error={formErrors.meta_title}
                        />
                        <AdminTextarea
                            label="Meta Description"
                            id="variety-meta-description"
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
