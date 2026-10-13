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
import { AdminSelect } from '../../components/admin/ui/AdminSelect';
import { AdminModal } from '../../components/admin/ui/AdminModal';
import { AdminEmptyState } from '../../components/admin/ui/AdminEmptyState';
import {
    AdminGalleryImageModal,
    type AdminGalleryItem,
} from '../../components/admin/gallery/AdminGalleryImageModal';
import { apiClient, ApiError } from '../../api/client';

interface GalleryAdminProps {
    initialItems?: AdminGalleryItem[];
    initialMeta?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    categories?: string[];
}

const DEFAULT_CATEGORIES = [
    'Italian Marble',
    'Onyx & Translucent',
    'Sculptures & Accents',
    'Exotic Quartzite',
    'Architectural Stone',
];

export default function GalleryAdmin({
    initialItems = [],
    initialMeta,
    categories: propCategories = [],
}: GalleryAdminProps) {
    const [items, setItems] = useState<AdminGalleryItem[]>(initialItems);
    const [categories, setCategories] = useState<string[]>(
        propCategories.length ? propCategories : DEFAULT_CATEGORIES,
    );
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    // Create / Edit Modal State
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<AdminGalleryItem | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Image Upload Modal State
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imageModalItem, setImageModalItem] = useState<AdminGalleryItem | null>(null);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<AdminGalleryItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form inputs
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: 'Italian Marble',
        space_type: '',
        material: '',
        description: '',
        sort_order: 0,
        is_featured: false,
        is_active: true,
    });
    const [formFile, setFormFile] = useState<File | null>(null);
    const [formFilePreview, setFormFilePreview] = useState<string | null>(null);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    };

    const fetchItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery.trim()) params.append('search', searchQuery.trim());
            if (selectedCategory !== 'all') params.append('category', selectedCategory);
            if (statusFilter !== 'all') params.append('status', statusFilter);
            params.append('per_page', '100');

            const res = await apiClient<AdminGalleryItem[]>(
                `/api/v1/admin/gallery?${params.toString()}`,
            );
            if (res.data) {
                setItems(res.data);
            }
            if ((res as unknown as { categories?: string[] }).categories) {
                const cats = (res as unknown as { categories?: string[] }).categories;
                if (cats && cats.length) {
                    setCategories(cats);
                }
            }
        } catch (err) {
            const apiErr = err as ApiError;
            showNotification('error', apiErr.message || 'Failed to fetch gallery items.');
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, selectedCategory, statusFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchItems();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchItems]);

    // Open Create Modal
    const handleOpenCreate = () => {
        setEditingItem(null);
        setFormErrors({});
        setFormData({
            title: '',
            slug: '',
            category: categories[0] || 'Italian Marble',
            space_type: '',
            material: '',
            description: '',
            sort_order: items.length > 0 ? Math.max(...items.map((i) => i.sort_order)) + 1 : 1,
            is_featured: false,
            is_active: true,
        });
        setFormFile(null);
        setFormFilePreview(null);
        setIsFormModalOpen(true);
    };

    // Open Edit Modal
    const handleOpenEdit = (item: AdminGalleryItem) => {
        setEditingItem(item);
        setFormErrors({});
        setFormData({
            title: item.title,
            slug: item.slug,
            category: item.category,
            space_type: item.space_type || '',
            material: item.material || '',
            description: item.description || '',
            sort_order: item.sort_order,
            is_featured: item.is_featured,
            is_active: item.is_active,
        });
        setFormFile(null);
        setFormFilePreview(null);
        setIsFormModalOpen(true);
    };

    // Handle Form Submit (Create or Update)
    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setFormErrors({});

        try {
            const formPayload = new FormData();
            formPayload.append('title', formData.title);
            if (formData.slug.trim()) formPayload.append('slug', formData.slug.trim());
            formPayload.append('category', formData.category);
            if (formData.space_type.trim()) formPayload.append('space_type', formData.space_type.trim());
            if (formData.material.trim()) formPayload.append('material', formData.material.trim());
            if (formData.description.trim()) formPayload.append('description', formData.description.trim());
            formPayload.append('sort_order', String(formData.sort_order));
            formPayload.append('is_featured', formData.is_featured ? '1' : '0');
            formPayload.append('is_active', formData.is_active ? '1' : '0');

            if (formFile) {
                formPayload.append('image', formFile);
            }

            if (editingItem) {
                // For update with files, Laravel supports POST with _method=PUT or PATCH
                formPayload.append('_method', 'PUT');
                const res = await apiClient<AdminGalleryItem>(
                    `/api/v1/admin/gallery/${editingItem.id}`,
                    {
                        method: 'POST',
                        body: formPayload,
                    },
                );

                if (res.data) {
                    setItems((prev) =>
                        prev.map((i) => (i.id === editingItem.id ? res.data! : i)),
                    );
                    showNotification('success', `Updated "${res.data.title}" successfully.`);
                    setIsFormModalOpen(false);
                }
            } else {
                const res = await apiClient<AdminGalleryItem>('/api/v1/admin/gallery', {
                    method: 'POST',
                    body: formPayload,
                });

                if (res.data) {
                    setItems((prev) => [res.data!, ...prev]);
                    showNotification('success', `Created "${res.data.title}" successfully.`);
                    setIsFormModalOpen(false);
                }
            }
        } catch (err) {
            const apiErr = err as ApiError;
            if (apiErr.errors) {
                const flatErrors: Record<string, string> = {};
                Object.entries(apiErr.errors).forEach(([field, msgs]) => {
                    flatErrors[field] = msgs[0];
                });
                setFormErrors(flatErrors);
            }
            showNotification('error', apiErr.message || 'Validation error while saving gallery item.');
        } finally {
            setIsSaving(false);
        }
    };

    // Toggle Status
    const handleToggleStatus = async (item: AdminGalleryItem) => {
        try {
            const newStatus = !item.is_active;
            const res = await apiClient<AdminGalleryItem>(
                `/api/v1/admin/gallery/${item.id}/status`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({ is_active: newStatus }),
                },
            );

            if (res.data) {
                setItems((prev) =>
                    prev.map((i) => (i.id === item.id ? { ...i, is_active: newStatus } : i)),
                );
                showNotification(
                    'success',
                    `"${item.title}" ${newStatus ? 'activated' : 'deactivated'}.`,
                );
            }
        } catch (err) {
            const apiErr = err as ApiError;
            showNotification('error', apiErr.message || 'Failed to update status.');
        }
    };

    // Handle Delete Confirm
    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);

        try {
            await apiClient(`/api/v1/admin/gallery/${itemToDelete.id}`, {
                method: 'DELETE',
            });

            setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
            showNotification('success', `Deleted "${itemToDelete.title}" successfully.`);
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (err) {
            const apiErr = err as ApiError;
            showNotification('error', apiErr.message || 'Failed to delete gallery item.');
        } finally {
            setIsDeleting(false);
        }
    };

    // Open Image Modal
    const handleOpenImageModal = (item: AdminGalleryItem) => {
        setImageModalItem(item);
        setIsImageModalOpen(true);
    };

    const handleImageUpdated = (updatedItem: AdminGalleryItem) => {
        setItems((prev) =>
            prev.map((i) => (i.id === updatedItem.id ? updatedItem : i)),
        );
        showNotification('success', `Image updated for "${updatedItem.title}".`);
    };

    return (
        <AdminLayout title="Architectural Gallery Management">
            <Head title="Architectural Gallery Management — ELIOR Admin" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-serif text-2xl font-light tracking-wide text-stone-900 dark:text-stone-100">
                            Architectural Gallery
                        </h1>
                        <p className="font-mono text-xs tracking-wider text-stone-500 uppercase dark:text-stone-400">
                            Curated 5:4 Luxury Stone Installations & Architectural Spaces ({items.length} items)
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* View Mode Toggle */}
                        <div className="inline-flex rounded-lg border border-stone-200 bg-white p-1 dark:border-stone-800 dark:bg-stone-900">
                            <button
                                type="button"
                                onClick={() => setViewMode('grid')}
                                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-amber-600 text-white shadow-xs'
                                        : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
                                }`}
                                title="Visual 5:4 Grid View"
                            >
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
                                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                    />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('table')}
                                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                                    viewMode === 'table'
                                        ? 'bg-amber-600 text-white shadow-xs'
                                        : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
                                }`}
                                title="Table Data View"
                            >
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
                                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>

                        <AdminButton variant="primary" onClick={handleOpenCreate}>
                            <svg
                                className="mr-1.5 -ml-1 h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Add Gallery Item
                        </AdminButton>
                    </div>
                </div>

                {/* Notification Banner */}
                {notification && (
                    <div
                        className={`rounded-md p-4 text-sm ${
                            notification.type === 'success'
                                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
                                : 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-200'
                        }`}
                    >
                        {notification.message}
                    </div>
                )}

                {/* Filters & Search Toolbar */}
                <AdminCard>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        {/* Search Input */}
                        <div className="md:col-span-2">
                            <AdminInput
                                label="Search Gallery"
                                placeholder="Search by title, stone material, space type..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <AdminSelect
                                label="Category"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                options={[
                                    { value: 'all', label: 'All Categories' },
                                    ...categories.map((c) => ({ value: c, label: c })),
                                ]}
                            />
                        </div>

                        {/* Status Filter */}
                        <div>
                            <AdminSelect
                                label="Status"
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')
                                }
                                options={[
                                    { value: 'all', label: 'All Statuses' },
                                    { value: 'active', label: 'Active Only' },
                                    { value: 'inactive', label: 'Inactive Only' },
                                ]}
                            />
                        </div>
                    </div>
                </AdminCard>

                {/* Visual 5:4 Grid View */}
                {viewMode === 'grid' && (
                    <div>
                        {isLoading && items.length === 0 ? (
                            <div className="flex h-64 items-center justify-center">
                                <span className="font-mono text-xs text-stone-400">
                                    Loading gallery items...
                                </span>
                            </div>
                        ) : items.length === 0 ? (
                            <AdminEmptyState
                                title="No gallery items found"
                                description="Try adjusting your search filters or click 'Add Gallery Item' to create one."
                                action={{
                                    label: 'Add Gallery Item',
                                    onClick: handleOpenCreate,
                                }}
                            />
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {items.map((item) => {
                                    const img = item.thumb_url || item.image_url;
                                    return (
                                        <div
                                            key={item.id}
                                            className="group flex flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-xs transition-all hover:border-amber-400 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
                                        >
                                            {/* 5:4 Aspect Ratio Image Container */}
                                            <div className="relative aspect-[5/4] w-full overflow-hidden bg-stone-100 dark:bg-stone-950">
                                                {img ? (
                                                    <img
                                                        src={img}
                                                        alt={item.title}
                                                        loading="lazy"
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                                                        <svg
                                                            className="h-8 w-8 text-stone-300 dark:text-stone-700"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={1.5}
                                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                        <span className="mt-1 font-mono text-[10px] text-stone-400">
                                                            No Image (5:4)
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Top Badges Overlay */}
                                                <div className="absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between">
                                                    <span className="rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] font-medium text-white backdrop-blur-xs">
                                                        #{item.sort_order}
                                                    </span>
                                                    <div className="flex gap-1.5">
                                                        {item.is_featured && (
                                                            <span className="rounded bg-amber-500/90 px-2 py-0.5 font-mono text-[10px] font-medium text-white shadow-xs">
                                                                Featured
                                                            </span>
                                                        )}
                                                        <span
                                                            className={`rounded px-2 py-0.5 font-mono text-[10px] font-medium text-white backdrop-blur-xs ${
                                                                item.is_active
                                                                    ? 'bg-emerald-600/90'
                                                                    : 'bg-stone-600/90'
                                                            }`}
                                                        >
                                                            {item.is_active ? 'Active' : 'Hidden'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Image Change Button Overlay */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenImageModal(item)}
                                                    className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5 rounded bg-black/70 px-2.5 py-1 text-xs font-medium text-white opacity-90 backdrop-blur-xs transition-opacity hover:opacity-100"
                                                >
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
                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    <span>Change Image</span>
                                                </button>
                                            </div>

                                            {/* Details Body */}
                                            <div className="flex flex-1 flex-col justify-between p-4">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-[10px] font-medium tracking-wider text-amber-700 uppercase dark:text-amber-400">
                                                            {item.category}
                                                        </span>
                                                        {item.space_type && (
                                                            <>
                                                                <span className="text-stone-300 dark:text-stone-700">
                                                                    •
                                                                </span>
                                                                <span className="font-mono text-[10px] text-stone-500">
                                                                    {item.space_type}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <h3 className="mt-1 font-serif text-base font-normal text-stone-900 group-hover:text-amber-800 dark:text-stone-100 dark:group-hover:text-amber-300">
                                                        {item.title}
                                                    </h3>
                                                    {item.material && (
                                                        <p className="mt-1 font-sans text-xs text-stone-600 dark:text-stone-400">
                                                            <strong className="font-medium text-stone-700 dark:text-stone-300">
                                                                Material:
                                                            </strong>{' '}
                                                            {item.material}
                                                        </p>
                                                    )}
                                                    {item.description && (
                                                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Card Footer Actions */}
                                                <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 dark:border-stone-800">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleStatus(item)}
                                                        className={`text-xs font-medium transition-colors ${
                                                            item.is_active
                                                                ? 'text-stone-500 hover:text-stone-700'
                                                                : 'text-amber-600 hover:text-amber-700'
                                                        }`}
                                                    >
                                                        {item.is_active ? 'Deactivate' : 'Activate'}
                                                    </button>

                                                    <div className="flex items-center gap-2">
                                                        <AdminButton
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => handleOpenEdit(item)}
                                                        >
                                                            Edit
                                                        </AdminButton>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setItemToDelete(item);
                                                                setIsDeleteModalOpen(true);
                                                            }}
                                                            className="p-1 text-stone-400 hover:text-red-600"
                                                            title="Delete Item"
                                                        >
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
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Table Data View */}
                {viewMode === 'table' && (
                    <AdminCard>
                        <AdminTable>
                            <AdminTableHeader>
                                <AdminTableRow>
                                    <AdminTableHead className="w-16">Image</AdminTableHead>
                                    <AdminTableHead className="w-16">Order</AdminTableHead>
                                    <AdminTableHead>Title & Space</AdminTableHead>
                                    <AdminTableHead>Category</AdminTableHead>
                                    <AdminTableHead>Material</AdminTableHead>
                                    <AdminTableHead>Status</AdminTableHead>
                                    <AdminTableHead className="text-right">Actions</AdminTableHead>
                                </AdminTableRow>
                            </AdminTableHeader>
                            <AdminTableBody>
                                {items.map((item) => {
                                    const img = item.thumb_url || item.image_url;
                                    return (
                                        <AdminTableRow key={item.id}>
                                            <AdminTableCell>
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenImageModal(item)}
                                                    className="group relative block aspect-[5/4] w-14 overflow-hidden rounded border border-stone-200 bg-stone-100 dark:border-stone-800"
                                                    title="Click to change image"
                                                >
                                                    {img ? (
                                                        <img
                                                            src={img}
                                                            alt={item.title}
                                                            className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <span className="flex h-full w-full items-center justify-center font-mono text-[9px] text-stone-400">
                                                            5:4
                                                        </span>
                                                    )}
                                                </button>
                                            </AdminTableCell>
                                            <AdminTableCell className="font-mono text-xs">
                                                {item.sort_order}
                                            </AdminTableCell>
                                            <AdminTableCell>
                                                <div className="font-medium text-stone-900 dark:text-stone-100">
                                                    {item.title}
                                                </div>
                                                <div className="font-mono text-xs text-stone-500">
                                                    {item.space_type || '—'}
                                                </div>
                                            </AdminTableCell>
                                            <AdminTableCell>
                                                <AdminBadge variant="secondary">
                                                    {item.category}
                                                </AdminBadge>
                                            </AdminTableCell>
                                            <AdminTableCell className="text-xs text-stone-600 dark:text-stone-400">
                                                {item.material || '—'}
                                            </AdminTableCell>
                                            <AdminTableCell>
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(item)}
                                                >
                                                    <AdminBadge
                                                        variant={item.is_active ? 'success' : 'secondary'}
                                                    >
                                                        {item.is_active ? 'Active' : 'Inactive'}
                                                    </AdminBadge>
                                                </button>
                                            </AdminTableCell>
                                            <AdminTableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <AdminButton
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => handleOpenImageModal(item)}
                                                    >
                                                        Image
                                                    </AdminButton>
                                                    <AdminButton
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => handleOpenEdit(item)}
                                                    >
                                                        Edit
                                                    </AdminButton>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setItemToDelete(item);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="p-1.5 text-stone-400 hover:text-red-600"
                                                        title="Delete"
                                                    >
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
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </AdminTableCell>
                                        </AdminTableRow>
                                    );
                                })}
                            </AdminTableBody>
                        </AdminTable>
                    </AdminCard>
                )}

                {/* Create / Edit Item Modal */}
                <AdminModal
                    isOpen={isFormModalOpen}
                    onClose={() => setIsFormModalOpen(false)}
                    title={editingItem ? `Edit: ${editingItem.title}` : 'Add New Gallery Item'}
                    size="lg"
                    footer={
                        <div className="flex w-full justify-end gap-2">
                            <AdminButton
                                type="button"
                                variant="secondary"
                                onClick={() => setIsFormModalOpen(false)}
                                disabled={isSaving}
                            >
                                Cancel
                            </AdminButton>
                            <AdminButton
                                type="button"
                                variant="primary"
                                onClick={handleFormSubmit}
                                disabled={isSaving}
                            >
                                {isSaving
                                    ? 'Saving...'
                                    : editingItem
                                    ? 'Update Gallery Item'
                                    : 'Create Gallery Item'}
                            </AdminButton>
                        </div>
                    }
                >
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <AdminInput
                                label="Title"
                                required
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                                }
                                error={formErrors.title}
                                placeholder="e.g. Calacatta Gold Sovereign Bath"
                            />

                            <AdminInput
                                label="Slug (optional, auto-generated)"
                                value={formData.slug}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                                }
                                error={formErrors.slug}
                                placeholder="calacatta-gold-sovereign-bath"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-1 block font-mono text-xs tracking-wider text-stone-600 uppercase dark:text-stone-400">
                                    Category *
                                </label>
                                <input
                                    type="text"
                                    list="gallery-categories-list"
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            category: e.target.value,
                                        }))
                                    }
                                    placeholder="Select or enter category"
                                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
                                />
                                <datalist id="gallery-categories-list">
                                    {categories.map((c) => (
                                        <option key={c} value={c} />
                                    ))}
                                </datalist>
                                {formErrors.category && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {formErrors.category}
                                    </p>
                                )}
                            </div>

                            <AdminInput
                                label="Space Type"
                                value={formData.space_type}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        space_type: e.target.value,
                                    }))
                                }
                                placeholder="e.g. Master Sanctuary Bath"
                            />

                            <AdminInput
                                label="Natural Stone Material"
                                value={formData.material}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        material: e.target.value,
                                    }))
                                }
                                placeholder="e.g. Calacatta Gold & Statuario"
                            />
                        </div>

                        <AdminTextarea
                            label="Architectural Description"
                            rows={3}
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            placeholder="Architectural design narrative, veining details, bookmatching alignment..."
                        />

                        {/* Image Upload Input for New/Edit Item */}
                        <div>
                            <label className="mb-1 block font-mono text-xs tracking-wider text-stone-600 uppercase dark:text-stone-400">
                                {editingItem ? 'Replace Image (optional, 5:4 ratio)' : 'Gallery Image (5:4 ratio)'}
                            </label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/avif"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        setFormFile(file);
                                        setFormFilePreview(URL.createObjectURL(file));
                                    }
                                }}
                                className="w-full text-xs text-stone-500 file:mr-4 file:rounded-md file:border-0 file:bg-stone-100 file:px-4 file:py-2 file:font-mono file:text-xs file:font-semibold file:text-stone-700 hover:file:bg-stone-200 dark:file:bg-stone-800 dark:file:text-stone-300"
                            />
                            {formFilePreview && (
                                <div className="mt-3 aspect-[5/4] max-w-xs overflow-hidden rounded border border-stone-200 dark:border-stone-800">
                                    <img
                                        src={formFilePreview}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 border-t border-stone-200 pt-4 md:grid-cols-3 dark:border-stone-800">
                            <AdminInput
                                label="Display Sort Order"
                                type="number"
                                min={0}
                                value={formData.sort_order}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        sort_order: parseInt(e.target.value, 10) || 0,
                                    }))
                                }
                            />

                            <div className="flex items-center gap-2 pt-6">
                                <input
                                    type="checkbox"
                                    id="form-is-featured"
                                    checked={formData.is_featured}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            is_featured: e.target.checked,
                                        }))
                                    }
                                    className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                                />
                                <label
                                    htmlFor="form-is-featured"
                                    className="text-sm text-stone-700 dark:text-stone-300"
                                >
                                    Featured in Showcase
                                </label>
                            </div>

                            <div className="flex items-center gap-2 pt-6">
                                <input
                                    type="checkbox"
                                    id="form-is-active"
                                    checked={formData.is_active}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            is_active: e.target.checked,
                                        }))
                                    }
                                    className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                                />
                                <label
                                    htmlFor="form-is-active"
                                    className="text-sm text-stone-700 dark:text-stone-300"
                                >
                                    Active (Visible to Public)
                                </label>
                            </div>
                        </div>
                    </form>
                </AdminModal>

                {/* Separate Quick Image Upload/Change Modal */}
                <AdminGalleryImageModal
                    isOpen={isImageModalOpen}
                    onClose={() => {
                        setIsImageModalOpen(false);
                        setImageModalItem(null);
                    }}
                    item={imageModalItem}
                    onImageUpdated={handleImageUpdated}
                    onError={(msg) => showNotification('error', msg)}
                />

                {/* Delete Confirmation Modal */}
                <AdminModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setItemToDelete(null);
                    }}
                    title="Confirm Delete Gallery Item"
                    size="sm"
                    footer={
                        <div className="flex w-full justify-end gap-2">
                            <AdminButton
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setItemToDelete(null);
                                }}
                                disabled={isDeleting}
                            >
                                Cancel
                            </AdminButton>
                            <AdminButton
                                type="button"
                                variant="danger"
                                onClick={handleDeleteConfirm}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                            </AdminButton>
                        </div>
                    }
                >
                    <p className="text-sm text-stone-600 dark:text-stone-300">
                        Are you sure you want to permanently delete{' '}
                        <strong>&ldquo;{itemToDelete?.title}&rdquo;</strong>? This action will remove
                        the item and its attached imagery.
                    </p>
                </AdminModal>
            </div>
        </AdminLayout>
    );
}
