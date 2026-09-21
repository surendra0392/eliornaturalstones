import { useState, useEffect, useTransition, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import { AdminLayout } from '../../layouts/AdminLayout';
import type {
    AdminEnquiry,
    EnquiryStatus,
    EnquiryPaginationMeta,
} from '../../types/enquiry';
import { AdminEnquiryStatusBadge } from '../../components/admin/enquiries/AdminEnquiryStatusBadge';
import { AdminEnquiryDetailDrawer } from '../../components/admin/enquiries/AdminEnquiryDetailDrawer';
import { AdminModal } from '../../components/admin/ui/AdminModal';
import { AdminButton } from '../../components/admin/ui/AdminButton';
import { AdminEmptyState } from '../../components/admin/ui/AdminEmptyState';
import { apiClient } from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';

interface EnquiriesAdminProps {
    initialEnquiries?: AdminEnquiry[];
    initialMeta?: EnquiryPaginationMeta;
    canonicalCollections?: string[];
    enquiryTypes?: string[];
}

const DEFAULT_COLLECTIONS = [
    'Italian Marble',
    'Granites',
    'Slate Stone',
    'Limestones',
    'Cobble Stones',
    'Pebbles',
    'Quartz',
    'Sculptures',
];

const DEFAULT_ENQUIRY_TYPES = [
    'Collection Enquiry',
    'Material Consultation',
    'Project Enquiry',
    'Sample Request',
    'Availability Enquiry',
    'General Enquiry',
];

export default function EnquiriesAdmin({
    initialEnquiries = [],
    initialMeta,
    canonicalCollections = DEFAULT_COLLECTIONS,
    enquiryTypes = DEFAULT_ENQUIRY_TYPES,
}: EnquiriesAdminProps) {
    const [enquiries, setEnquiries] =
        useState<AdminEnquiry[]>(initialEnquiries);
    const [meta, setMeta] = useState<EnquiryPaginationMeta | undefined>(
        initialMeta,
    );
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<EnquiryStatus | 'all'>(
        'all',
    );
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [collectionFilter, setCollectionFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState<number>(
        initialMeta?.current_page || 1,
    );
    const [isLoading, setIsLoading] = useState(false);
    const [, startTransition] = useTransition();

    // Drawer state
    const [selectedEnquiry, setSelectedEnquiry] = useState<AdminEnquiry | null>(
        null,
    );
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    // Delete confirmation modal state
    const [deleteTarget, setDeleteTarget] = useState<AdminEnquiry | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    // Fetch enquiries from API
    const fetchEnquiries = useCallback(
        async (
            query = search,
            status = statusFilter,
            type = typeFilter,
            collection = collectionFilter,
            page = currentPage,
        ) => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                params.set('page', String(page));
                params.set('per_page', '15');
                if (query.trim()) params.set('search', query.trim());
                if (status !== 'all') params.set('status', status);
                if (type !== 'all') params.set('type', type);
                if (collection !== 'all') params.set('collection', collection);

                const res = await apiClient<AdminEnquiry[]>(
                    `${API_ENDPOINTS.v1.admin.enquiries}?${params.toString()}`,
                );

                if (res) {
                    startTransition(() => {
                        if (res.data) setEnquiries(res.data);
                        if (res.meta)
                            setMeta(
                                res.meta as unknown as EnquiryPaginationMeta,
                            );
                    });
                }
            } catch (err: any) {
                console.error('Failed to fetch enquiries:', err);
                showToast('Failed to load enquiries.', 'error');
            } finally {
                setIsLoading(false);
            }
        },
        [search, statusFilter, typeFilter, collectionFilter, currentPage],
    );

    // Debounced search trigger
    useEffect(() => {
        const timer = setTimeout(() => {
            void fetchEnquiries(
                search,
                statusFilter,
                typeFilter,
                collectionFilter,
                1,
            );
            setCurrentPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [search, statusFilter, typeFilter, collectionFilter, fetchEnquiries]);

    // Handle Quick Status Change
    const handleStatusChange = async (
        enquiryId: number,
        nextStatus: EnquiryStatus,
    ) => {
        setIsUpdatingStatus(true);
        try {
            const res = await apiClient<AdminEnquiry>(
                API_ENDPOINTS.v1.admin.enquiryStatus(enquiryId),
                {
                    method: 'PATCH',
                    body: JSON.stringify({ status: nextStatus }),
                },
            );

            if (res?.data) {
                const updated = res.data;
                setEnquiries((prev) =>
                    prev.map((e) => (e.id === enquiryId ? updated : e)),
                );
                if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
                    setSelectedEnquiry(updated);
                }

                // Update meta counts optimistically
                setMeta((prev) => {
                    if (!prev || !prev.counts) return prev;
                    const oldStatus = enquiries.find(
                        (e) => e.id === enquiryId,
                    )?.status;
                    if (!oldStatus || oldStatus === nextStatus) return prev;

                    const counts = { ...prev.counts };
                    if (oldStatus in counts) {
                        counts[oldStatus as keyof typeof counts] = Math.max(
                            0,
                            counts[oldStatus as keyof typeof counts] - 1,
                        );
                    }
                    if (nextStatus in counts) {
                        counts[nextStatus as keyof typeof counts] =
                            (counts[nextStatus as keyof typeof counts] || 0) +
                            1;
                    }

                    return { ...prev, counts };
                });

                showToast(res.message || 'Status updated.');
            }
        } catch (err: any) {
            console.error('Failed to update enquiry status:', err);
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'Failed to update status.';
            showToast(msg, 'error');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    // Handle Enquiry Safe Deletion
    const handleDeleteEnquiry = async () => {
        if (!deleteTarget) return;

        setIsDeleting(true);
        try {
            const res = await apiClient<{ message: string }>(
                API_ENDPOINTS.v1.admin.enquiryItem(deleteTarget.id),
                {
                    method: 'DELETE',
                },
            );

            showToast(res?.message || 'Enquiry deleted successfully.');

            // Close drawer if deleted enquiry was open
            if (selectedEnquiry?.id === deleteTarget.id) {
                setIsDrawerOpen(false);
                setSelectedEnquiry(null);
            }

            setDeleteTarget(null);
            void fetchEnquiries(
                search,
                statusFilter,
                typeFilter,
                collectionFilter,
                currentPage,
            );
        } catch (err: any) {
            console.error('Failed to delete enquiry:', err);
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'Failed to delete enquiry.';
            showToast(msg, 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    // Open detail drawer
    const handleOpenDetail = (enquiry: AdminEnquiry) => {
        setSelectedEnquiry(enquiry);
        setIsDrawerOpen(true);
    };

    // Reset filters
    const handleResetFilters = () => {
        setSearch('');
        setStatusFilter('all');
        setTypeFilter('all');
        setCollectionFilter('all');
        setCurrentPage(1);
    };

    const hasActiveFilters =
        search !== '' ||
        statusFilter !== 'all' ||
        typeFilter !== 'all' ||
        collectionFilter !== 'all';

    const counts = meta?.counts || {
        total: meta?.total || enquiries.length,
        pending: enquiries.filter((e) => e.status === 'pending').length,
        in_progress: enquiries.filter((e) => e.status === 'in_progress').length,
        responded: enquiries.filter((e) => e.status === 'responded').length,
        closed: enquiries.filter((e) => e.status === 'closed').length,
    };

    const statusTabs: {
        id: 'all' | EnquiryStatus;
        label: string;
        count: number;
    }[] = [
        { id: 'all', label: 'All Enquiries', count: counts.total },
        { id: 'pending', label: 'Pending', count: counts.pending },
        { id: 'in_progress', label: 'In Progress', count: counts.in_progress },
        { id: 'responded', label: 'Responded', count: counts.responded },
        { id: 'closed', label: 'Closed', count: counts.closed },
    ];

    return (
        <AdminLayout title="Trade & Client Inquiries">
            <Head title="Enquiries — ELIOR Admin" />

            {/* Notification Toast */}
            {toast && (
                <div
                    className={`animate-in fade-in slide-in-from-top-2 fixed top-5 right-5 z-50 flex items-center gap-3 border px-4 py-3 text-xs shadow-lg transition-all ${
                        toast.type === 'success'
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                            : 'border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200'
                    }`}
                    role="alert"
                >
                    <span
                        className={`h-2 w-2 rounded-full ${
                            toast.type === 'success'
                                ? 'bg-emerald-500'
                                : 'bg-red-500'
                        }`}
                    />
                    <span className="font-mono">{toast.message}</span>
                    <button
                        type="button"
                        onClick={() => setToast(null)}
                        className="ml-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                        aria-label="Dismiss toast"
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* Page Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-serif text-2xl font-light text-stone-900 sm:text-3xl dark:text-stone-100">
                        Client & Trade Enquiries
                    </h1>
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                        Review architectural specifications, consultation
                        requests, and material requirements submitted by clients
                        and trade studios.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            fetchEnquiries(
                                search,
                                statusFilter,
                                typeFilter,
                                collectionFilter,
                                currentPage,
                            )
                        }
                        disabled={isLoading}
                        className="inline-flex min-h-[40px] items-center gap-2 border border-stone-300 bg-white px-3.5 py-2 font-mono text-xs tracking-wider text-stone-700 uppercase transition-colors hover:bg-stone-50 disabled:opacity-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800"
                    >
                        <svg
                            className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Top Metric Cards */}
            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
                <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`border p-4 text-left transition-all ${
                        statusFilter === 'all'
                            ? 'border-stone-900 bg-stone-900 text-white shadow-sm dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900'
                            : 'border-stone-200 bg-white hover:border-stone-400 dark:border-stone-800 dark:bg-stone-900'
                    }`}
                >
                    <span className="block font-mono text-[10px] tracking-widest uppercase opacity-70">
                        Total Enquiries
                    </span>
                    <p className="mt-2 font-serif text-3xl font-light">
                        {counts.total}
                    </p>
                    <span className="mt-1 block text-[11px] opacity-70">
                        All received inquiries
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setStatusFilter('pending')}
                    className={`border p-4 text-left transition-all ${
                        statusFilter === 'pending'
                            ? 'border-amber-600 bg-amber-500/15 text-amber-900 ring-1 ring-amber-500/50 dark:border-amber-500 dark:text-amber-100'
                            : 'border-stone-200 bg-white hover:border-amber-300 dark:border-stone-800 dark:bg-stone-900'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] tracking-widest text-amber-700 uppercase dark:text-amber-300">
                            Pending Review
                        </span>
                        {counts.pending > 0 && (
                            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                        )}
                    </div>
                    <p className="mt-2 font-serif text-3xl font-light text-stone-900 dark:text-stone-100">
                        {counts.pending}
                    </p>
                    <span className="mt-1 block text-[11px] text-stone-500 dark:text-stone-400">
                        Awaiting review
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setStatusFilter('in_progress')}
                    className={`border p-4 text-left transition-all ${
                        statusFilter === 'in_progress'
                            ? 'border-sky-600 bg-sky-500/15 text-sky-900 ring-1 ring-sky-500/50 dark:border-sky-500 dark:text-sky-100'
                            : 'border-stone-200 bg-white hover:border-sky-300 dark:border-stone-800 dark:bg-stone-900'
                    }`}
                >
                    <span className="block font-mono text-[10px] tracking-widest text-sky-700 uppercase dark:text-sky-300">
                        In Progress
                    </span>
                    <p className="mt-2 font-serif text-3xl font-light text-stone-900 dark:text-stone-100">
                        {counts.in_progress}
                    </p>
                    <span className="mt-1 block text-[11px] text-stone-500 dark:text-stone-400">
                        Under active review
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setStatusFilter('responded')}
                    className={`border p-4 text-left transition-all ${
                        statusFilter === 'responded'
                            ? 'border-emerald-600 bg-emerald-500/15 text-emerald-900 ring-1 ring-emerald-500/50 dark:border-emerald-500 dark:text-emerald-100'
                            : 'border-stone-200 bg-white hover:border-emerald-300 dark:border-stone-800 dark:bg-stone-900'
                    }`}
                >
                    <span className="block font-mono text-[10px] tracking-widest text-emerald-700 uppercase dark:text-emerald-300">
                        Responded
                    </span>
                    <p className="mt-2 font-serif text-3xl font-light text-stone-900 dark:text-stone-100">
                        {counts.responded}
                    </p>
                    <span className="mt-1 block text-[11px] text-stone-500 dark:text-stone-400">
                        Client contacted
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setStatusFilter('closed')}
                    className={`border p-4 text-left transition-all ${
                        statusFilter === 'closed'
                            ? 'border-stone-600 bg-stone-500/15 text-stone-900 ring-1 ring-stone-500/50 dark:border-stone-400 dark:text-stone-100'
                            : 'border-stone-200 bg-white hover:border-stone-400 dark:border-stone-800 dark:bg-stone-900'
                    }`}
                >
                    <span className="block font-mono text-[10px] tracking-widest text-stone-600 uppercase dark:text-stone-400">
                        Closed
                    </span>
                    <p className="mt-2 font-serif text-3xl font-light text-stone-900 dark:text-stone-100">
                        {counts.closed}
                    </p>
                    <span className="mt-1 block text-[11px] text-stone-500 dark:text-stone-400">
                        Archived or resolved
                    </span>
                </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="mb-6 space-y-4 border border-stone-200 bg-white p-4 sm:p-5 dark:border-stone-800 dark:bg-stone-900">
                {/* Search and Secondary Selects */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                    {/* Search Field */}
                    <div className="relative md:col-span-6">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
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
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by client name, email, phone, studio, or message..."
                            className="min-h-[44px] w-full border border-stone-300 bg-white pr-4 pl-9 text-xs text-stone-900 placeholder-stone-400 transition-colors focus:border-stone-900 focus:ring-1 focus:ring-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100 dark:focus:ring-stone-100"
                        />
                    </div>

                    {/* Enquiry Type Filter */}
                    <div className="relative md:col-span-3">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            aria-label="Filter by enquiry type"
                            className="min-h-[44px] w-full appearance-none border border-stone-300 bg-white px-3.5 py-2 pr-10 text-xs text-stone-900 transition-colors focus:border-stone-900 focus:ring-1 focus:ring-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100 dark:focus:ring-stone-100"
                        >
                            <option value="all">All Enquiry Types</option>
                            {enquiryTypes.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-400">
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
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Collection Filter */}
                    <div className="relative md:col-span-3">
                        <select
                            value={collectionFilter}
                            onChange={(e) =>
                                setCollectionFilter(e.target.value)
                            }
                            aria-label="Filter by stone collection"
                            className="min-h-[44px] w-full appearance-none border border-stone-300 bg-white px-3.5 py-2 pr-10 text-xs text-stone-900 transition-colors focus:border-stone-900 focus:ring-1 focus:ring-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100 dark:focus:ring-stone-100"
                        >
                            <option value="all">All Collections</option>
                            {canonicalCollections.map((col) => (
                                <option key={col} value={col}>
                                    {col}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-400">
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
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Status Tabs and Clear Filter Action */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3 dark:border-stone-800">
                    <div className="flex flex-wrap items-center gap-1.5">
                        {statusTabs.map((tab) => {
                            const isActive = statusFilter === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setStatusFilter(tab.id)}
                                    className={`inline-flex min-h-[36px] items-center gap-1.5 border px-3 py-1 font-mono text-[10px] font-medium tracking-wider uppercase transition-colors ${
                                        isActive
                                            ? 'border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900'
                                            : 'border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300 hover:bg-white dark:border-stone-800 dark:bg-stone-950 dark:text-stone-400 dark:hover:bg-stone-900'
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span
                                        className={`py-0.2 rounded-full px-1.5 text-[9px] ${
                                            isActive
                                                ? 'bg-stone-700 text-white dark:bg-stone-300 dark:text-stone-900'
                                                : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="font-mono text-xs text-stone-500 underline transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                        >
                            Clear Filters &times;
                        </button>
                    )}
                </div>
            </div>

            {/* Enquiries Data Section */}
            <div className="border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900">
                {enquiries.length === 0 ? (
                    <div className="p-8">
                        <AdminEmptyState
                            title={
                                hasActiveFilters
                                    ? 'No Enquiries Match Filters'
                                    : 'No Enquiries Registered'
                            }
                            description={
                                hasActiveFilters
                                    ? 'Try clearing or changing your search criteria, collection filter, or status filter.'
                                    : 'When clients submit enquiries through the contact form or material catalogue, they will appear here.'
                            }
                            action={
                                hasActiveFilters ? (
                                    <AdminButton
                                        variant="secondary"
                                        onClick={handleResetFilters}
                                    >
                                        Reset All Filters
                                    </AdminButton>
                                ) : undefined
                            }
                        />
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-stone-200 bg-stone-50/75 text-[11px] font-medium tracking-[0.14em] text-stone-500 uppercase dark:border-stone-800 dark:bg-stone-950/60 dark:text-stone-400">
                                        <th className="px-5 py-3 font-mono">
                                            Date & Time
                                        </th>
                                        <th className="px-5 py-3">
                                            Contact / Studio
                                        </th>
                                        <th className="px-5 py-3">
                                            Enquiry Type
                                        </th>
                                        <th className="px-5 py-3">
                                            Collection & Space
                                        </th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80">
                                    {enquiries.map((enq) => (
                                        <tr
                                            key={enq.id}
                                            onClick={() =>
                                                handleOpenDetail(enq)
                                            }
                                            className="group cursor-pointer transition-colors hover:bg-stone-50/80 dark:hover:bg-stone-800/40"
                                        >
                                            {/* Date */}
                                            <td className="px-5 py-4 align-top">
                                                <div className="font-mono text-xs text-stone-700 dark:text-stone-300">
                                                    {enq.formatted_date ||
                                                        enq.created_at?.slice(
                                                            0,
                                                            10,
                                                        )}
                                                </div>
                                                <div className="mt-0.5 font-mono text-[10px] text-stone-400">
                                                    {enq.time_ago}
                                                </div>
                                            </td>

                                            {/* Contact */}
                                            <td className="px-5 py-4 align-top">
                                                <p className="font-medium text-stone-900 group-hover:text-stone-950 dark:text-stone-100 dark:group-hover:text-white">
                                                    {enq.name}
                                                </p>
                                                <div className="mt-0.5 space-y-0.5">
                                                    <p className="font-mono text-xs text-stone-500 dark:text-stone-400">
                                                        {enq.email}
                                                    </p>
                                                    {enq.phone && (
                                                        <p className="font-mono text-[11px] text-stone-400">
                                                            {enq.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Type */}
                                            <td className="px-5 py-4 align-top">
                                                <span className="font-serif text-sm text-stone-800 dark:text-stone-200">
                                                    {enq.enquiry_type ||
                                                        enq.type}
                                                </span>
                                            </td>

                                            {/* Collection & Project Space */}
                                            <td className="px-5 py-4 align-top">
                                                <div className="inline-block border border-stone-200 bg-stone-50 px-2 py-0.5 font-mono text-[11px] font-medium text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200">
                                                    {enq.collection ||
                                                        enq.material_interest ||
                                                        'General'}
                                                </div>
                                                <p className="mt-1 max-w-xs truncate text-xs text-stone-500 dark:text-stone-400">
                                                    {enq.project_space ||
                                                        enq.company ||
                                                        '—'}
                                                </p>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-5 py-4 align-top">
                                                <AdminEnquiryStatusBadge
                                                    status={enq.status}
                                                />
                                            </td>

                                            {/* Actions */}
                                            <td
                                                className="px-5 py-4 text-right align-top"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Quick Status Dropdown */}
                                                    <select
                                                        value={enq.status}
                                                        disabled={
                                                            isUpdatingStatus
                                                        }
                                                        onChange={(e) =>
                                                            handleStatusChange(
                                                                enq.id,
                                                                e.target
                                                                    .value as EnquiryStatus,
                                                            )
                                                        }
                                                        aria-label={`Update status for enquiry ${enq.id}`}
                                                        className="border border-stone-200 bg-white px-2 py-1 font-mono text-[11px] text-stone-700 hover:border-stone-400 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                                                    >
                                                        <option value="pending">
                                                            Pending
                                                        </option>
                                                        <option value="in_progress">
                                                            In Progress
                                                        </option>
                                                        <option value="responded">
                                                            Responded
                                                        </option>
                                                        <option value="closed">
                                                            Closed
                                                        </option>
                                                    </select>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleOpenDetail(
                                                                enq,
                                                            )
                                                        }
                                                        className="border border-stone-300 bg-stone-50 px-2.5 py-1 font-mono text-[11px] tracking-wider text-stone-700 uppercase hover:bg-stone-200 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards View */}
                        <div className="divide-y divide-stone-200 md:hidden dark:divide-stone-800">
                            {enquiries.map((enq) => (
                                <div
                                    key={enq.id}
                                    onClick={() => handleOpenDetail(enq)}
                                    className="cursor-pointer space-y-3 p-4 hover:bg-stone-50/50 dark:hover:bg-stone-800/30"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-serif font-medium text-stone-900 dark:text-stone-100">
                                                {enq.name}
                                            </h3>
                                            <p className="font-mono text-xs text-stone-500 dark:text-stone-400">
                                                {enq.email}
                                            </p>
                                        </div>
                                        <AdminEnquiryStatusBadge
                                            status={enq.status}
                                        />
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                                        <span className="border border-stone-200 bg-stone-50 px-2 py-0.5 text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
                                            {enq.collection || 'General'}
                                        </span>
                                        <span className="text-stone-400">
                                            &bull;
                                        </span>
                                        <span className="text-stone-600 dark:text-stone-400">
                                            {enq.enquiry_type || enq.type}
                                        </span>
                                    </div>

                                    {enq.project_space && (
                                        <p className="text-xs text-stone-600 italic dark:text-stone-300">
                                            Project: {enq.project_space}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between border-t border-stone-100 pt-2 font-mono text-[10px] text-stone-400 dark:border-stone-800">
                                        <span>
                                            {enq.formatted_date ||
                                                enq.created_at?.slice(0, 10)}
                                        </span>
                                        <span className="text-stone-600 underline dark:text-stone-300">
                                            View Details &rarr;
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Footer */}
                        {meta && meta.last_page > 1 && (
                            <div className="flex flex-col items-center justify-between gap-4 border-t border-stone-200 px-6 py-4 sm:flex-row dark:border-stone-800">
                                <span className="font-mono text-xs text-stone-500 dark:text-stone-400">
                                    Showing page{' '}
                                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                                        {meta.current_page}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                                        {meta.last_page}
                                    </span>{' '}
                                    ({meta.total} total enquiries)
                                </span>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        disabled={
                                            meta.current_page <= 1 || isLoading
                                        }
                                        onClick={() => {
                                            const prev = meta.current_page - 1;
                                            setCurrentPage(prev);
                                            void fetchEnquiries(
                                                search,
                                                statusFilter,
                                                typeFilter,
                                                collectionFilter,
                                                prev,
                                            );
                                        }}
                                        className="min-h-[36px] border border-stone-300 bg-white px-3 py-1 font-mono text-xs text-stone-700 transition-colors hover:bg-stone-50 disabled:opacity-40 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800"
                                    >
                                        &larr; Previous
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            meta.current_page >=
                                                meta.last_page || isLoading
                                        }
                                        onClick={() => {
                                            const next = meta.current_page + 1;
                                            setCurrentPage(next);
                                            void fetchEnquiries(
                                                search,
                                                statusFilter,
                                                typeFilter,
                                                collectionFilter,
                                                next,
                                            );
                                        }}
                                        className="min-h-[36px] border border-stone-300 bg-white px-3 py-1 font-mono text-xs text-stone-700 transition-colors hover:bg-stone-50 disabled:opacity-40 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800"
                                    >
                                        Next &rarr;
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Slide-over Enquiry Detail Drawer */}
            <AdminEnquiryDetailDrawer
                enquiry={selectedEnquiry}
                isOpen={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false);
                    setSelectedEnquiry(null);
                }}
                onStatusChange={handleStatusChange}
                onDelete={(enq) => setDeleteTarget(enq)}
                isUpdatingStatus={isUpdatingStatus}
            />

            {/* Safe Delete Confirmation Modal */}
            <AdminModal
                isOpen={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                title="Confirm Safe Deletion"
                description="Are you sure you want to delete this architectural enquiry?"
                maxWidth="sm"
                footer={
                    <>
                        <AdminButton
                            variant="secondary"
                            onClick={() => setDeleteTarget(null)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </AdminButton>
                        <AdminButton
                            variant="danger"
                            onClick={handleDeleteEnquiry}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                        </AdminButton>
                    </>
                }
            >
                {deleteTarget && (
                    <div className="space-y-3 font-mono text-xs text-stone-600 dark:text-stone-300">
                        <p>
                            You are about to permanently delete enquiry #
                            {deleteTarget.id} submitted by{' '}
                            <span className="font-semibold text-stone-900 dark:text-stone-100">
                                {deleteTarget.name}
                            </span>{' '}
                            ({deleteTarget.email}).
                        </p>
                        <p className="text-amber-700 dark:text-amber-400">
                            This action cannot be undone.
                        </p>
                    </div>
                )}
            </AdminModal>
        </AdminLayout>
    );
}
