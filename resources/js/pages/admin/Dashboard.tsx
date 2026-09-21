import { Head, Link } from '@inertiajs/react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AdminCard } from '../../components/admin/ui/AdminCard';
import { AdminBadge } from '../../components/admin/ui/AdminBadge';
import { AdminEnquiryStatusBadge } from '../../components/admin/enquiries/AdminEnquiryStatusBadge';
import {
    AdminTable,
    AdminTableHeader,
    AdminTableBody,
    AdminTableRow,
    AdminTableHead,
    AdminTableCell,
} from '../../components/admin/ui/AdminTable';
import { AdminEmptyState } from '../../components/admin/ui/AdminEmptyState';

interface EnquiryRecord {
    id: number;
    name: string;
    email: string;
    type: string;
    material_interest?: string;
    status: string;
    created_at: string;
}

interface DashboardProps {
    metrics: {
        collections_count: number;
        varieties_count: number;
        enquiries_count: number;
        pending_enquiries_count: number;
    };
    recent_enquiries?: EnquiryRecord[];
}

export default function Dashboard({
    metrics,
    recent_enquiries = [],
}: DashboardProps) {
    const summaryCards = [
        {
            title: 'Collections',
            value: metrics.collections_count,
            description: 'Curated stone collections',
            href: '/admin/collections',
            label: 'View Collections',
        },
        {
            title: 'Stone Varieties',
            value: metrics.varieties_count,
            description: 'Active catalog varieties',
            href: '/admin/varieties',
            label: 'View Varieties',
        },
        {
            title: 'Total Enquiries',
            value: metrics.enquiries_count,
            description: 'Client architectural requests',
            href: '/admin/enquiries',
            label: 'View Enquiries',
        },
        {
            title: 'Pending Enquiries',
            value: metrics.pending_enquiries_count,
            description: 'Awaiting consultation review',
            href: '/admin/enquiries',
            label: 'Process Enquiries',
            isWarning: metrics.pending_enquiries_count > 0,
        },
    ];

    function formatEnquiryDate(dateStr: string) {
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
    }

    return (
        <AdminLayout title="Dashboard Overview">
            <Head title="Admin Dashboard — ELIOR Natural Stones" />

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {summaryCards.map((c) => (
                    <AdminCard key={c.title} className="p-0">
                        <div className="flex items-start justify-between">
                            <span className="font-mono text-[10px] tracking-widest text-stone-500 uppercase dark:text-stone-400">
                                {c.title}
                            </span>
                            {c.isWarning && (
                                <AdminBadge variant="warning">
                                    Action Needed
                                </AdminBadge>
                            )}
                        </div>
                        <p className="mt-3 font-serif text-3xl font-light text-stone-900 sm:text-4xl dark:text-stone-100">
                            {c.value}
                        </p>
                        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                            {c.description}
                        </p>
                        <div className="mt-5 border-t border-stone-100 pt-3 dark:border-stone-800">
                            <Link
                                href={c.href}
                                className="font-mono text-[10px] tracking-wider text-stone-700 uppercase transition-colors hover:text-stone-950 dark:text-stone-300 dark:hover:text-white"
                            >
                                {c.label} &rarr;
                            </Link>
                        </div>
                    </AdminCard>
                ))}
            </div>

            {/* Recent Enquiries Section */}
            <div className="mt-10">
                <AdminCard
                    title="Recent Enquiries"
                    description="Real-time architectural inquiries submitted through public portal"
                    badge={
                        <AdminBadge variant="neutral">
                            {recent_enquiries.length} recent
                        </AdminBadge>
                    }
                    action={
                        <Link
                            href="/admin/enquiries"
                            className="font-mono text-[10px] tracking-wider text-stone-600 uppercase hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                        >
                            All Enquiries &rarr;
                        </Link>
                    }
                >
                    {recent_enquiries.length === 0 ? (
                        <AdminEmptyState
                            title="No Enquiries Registered"
                            description="When clients submit enquiries through the contact form or material catalogue, they will appear here."
                        />
                    ) : (
                        <AdminTable>
                            <AdminTableHeader>
                                <AdminTableRow>
                                    <AdminTableHead>Date</AdminTableHead>
                                    <AdminTableHead>
                                        Contact / Studio
                                    </AdminTableHead>
                                    <AdminTableHead>
                                        Enquiry Type
                                    </AdminTableHead>
                                    <AdminTableHead>
                                        Stone Interest
                                    </AdminTableHead>
                                    <AdminTableHead>Status</AdminTableHead>
                                </AdminTableRow>
                            </AdminTableHeader>
                            <AdminTableBody>
                                {recent_enquiries.map((enq) => (
                                    <AdminTableRow key={enq.id}>
                                        <AdminTableCell className="font-mono text-stone-500">
                                            {formatEnquiryDate(enq.created_at)}
                                        </AdminTableCell>
                                        <AdminTableCell>
                                            <p className="font-medium text-stone-900 dark:text-stone-100">
                                                {enq.name}
                                            </p>
                                            <p className="font-mono text-[10px] text-stone-400">
                                                {enq.email}
                                            </p>
                                        </AdminTableCell>
                                        <AdminTableCell>
                                            {enq.type}
                                        </AdminTableCell>
                                        <AdminTableCell>
                                            {enq.material_interest || 'General'}
                                        </AdminTableCell>
                                        <AdminTableCell>
                                            <AdminEnquiryStatusBadge
                                                status={enq.status}
                                            />
                                        </AdminTableCell>
                                    </AdminTableRow>
                                ))}
                            </AdminTableBody>
                        </AdminTable>
                    )}
                </AdminCard>
            </div>

            {/* Content Foundation Status */}
            <div className="mt-10 border border-stone-200 bg-white p-6 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
                <div className="flex items-center gap-3">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                    <h3 className="font-serif text-base font-normal text-stone-900 dark:text-stone-100">
                        ELIOR Custom React Admin System
                    </h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-stone-600 dark:text-stone-400">
                    Production-grade admin architecture established without
                    third-party CMS or Filament. The system communicates through
                    Laravel REST API endpoints, utilizes role-based
                    authorization, and provides structured module placeholders
                    for Collections, Varieties, Media, Pages, Enquiries, and
                    Settings.
                </p>
            </div>
        </AdminLayout>
    );
}
