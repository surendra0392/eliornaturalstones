import { useState, useEffect } from 'react';
import type { AdminEnquiry, EnquiryStatus } from '../../../types/enquiry';
import { AdminEnquiryStatusBadge } from './AdminEnquiryStatusBadge';

interface AdminEnquiryDetailDrawerProps {
    enquiry: AdminEnquiry | null;
    isOpen: boolean;
    onClose: () => void;
    onStatusChange: (enquiryId: number, status: EnquiryStatus) => Promise<void>;
    onDelete: (enquiry: AdminEnquiry) => void;
    isUpdatingStatus?: boolean;
}

export function AdminEnquiryDetailDrawer({
    enquiry,
    isOpen,
    onClose,
    onStatusChange,
    onDelete,
    isUpdatingStatus = false,
}: AdminEnquiryDetailDrawerProps) {
    const [isTechnicalExpanded, setIsTechnicalExpanded] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !enquiry) return null;

    const copyToClipboard = (text: string, fieldName: string) => {
        void navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const statusActions: {
        status: EnquiryStatus;
        label: string;
        activeClass: string;
    }[] = [
        {
            status: 'pending',
            label: 'Mark Pending',
            activeClass:
                'border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300',
        },
        {
            status: 'in_progress',
            label: 'Mark In Progress',
            activeClass:
                'border-sky-400 bg-sky-500/10 text-sky-700 dark:text-sky-300',
        },
        {
            status: 'responded',
            label: 'Mark Responded',
            activeClass:
                'border-emerald-400 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
        },
        {
            status: 'closed',
            label: 'Close Enquiry',
            activeClass:
                'border-stone-400 bg-stone-500/10 text-stone-700 dark:text-stone-300',
        },
    ];

    return (
        <div className="animate-in fade-in fixed inset-0 z-50 flex justify-end bg-stone-900/60 backdrop-blur-xs transition-opacity duration-200">
            {/* Backdrop click handler */}
            <div
                className="absolute inset-0 cursor-default"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Slide-over Container */}
            <div
                className="relative z-10 flex h-full w-full max-w-2xl flex-col border-l border-stone-200 bg-white shadow-2xl transition-all duration-300 dark:border-stone-800 dark:bg-stone-900"
                role="dialog"
                aria-modal="true"
                aria-labelledby="enquiry-drawer-title"
            >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-stone-200/80 px-6 py-5 dark:border-stone-800/80">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h2
                                id="enquiry-drawer-title"
                                className="font-serif text-xl font-normal text-stone-900 dark:text-stone-100"
                            >
                                {enquiry.name}
                            </h2>
                            <AdminEnquiryStatusBadge status={enquiry.status} />
                        </div>
                        <p className="font-mono text-xs text-stone-500 dark:text-stone-400">
                            Enquiry #{enquiry.id} &bull; Received{' '}
                            {enquiry.formatted_date || enquiry.created_at}{' '}
                            {enquiry.time_ago && `(${enquiry.time_ago})`}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center p-2 text-stone-400 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-200"
                        aria-label="Close enquiry details"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Status Transition Action Bar */}
                <div className="border-b border-stone-200 bg-stone-50/75 px-6 py-3 dark:border-stone-800 dark:bg-stone-900/60">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-[10px] tracking-wider text-stone-500 uppercase dark:text-stone-400">
                            Update Status:
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5">
                            {statusActions.map((item) => {
                                const isCurrent =
                                    enquiry.status === item.status;
                                return (
                                    <button
                                        key={item.status}
                                        type="button"
                                        disabled={isUpdatingStatus || isCurrent}
                                        onClick={() =>
                                            onStatusChange(
                                                enquiry.id,
                                                item.status,
                                            )
                                        }
                                        className={`min-h-[36px] border px-3 py-1 font-mono text-[10px] font-medium tracking-wider uppercase transition-colors disabled:opacity-50 ${
                                            isCurrent
                                                ? `${item.activeClass} font-semibold ring-1 ring-current`
                                                : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
                                        }`}
                                    >
                                        {isCurrent
                                            ? `✓ ${item.label.replace('Mark ', '')}`
                                            : item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Body Content (Scrollable) */}
                <div className="flex-1 space-y-6 overflow-y-auto p-6">
                    {/* Contact Information */}
                    <div className="border border-stone-200/80 bg-stone-50/40 p-4 dark:border-stone-800 dark:bg-stone-950/40">
                        <h3 className="font-mono text-[10px] font-medium tracking-widest text-stone-500 uppercase dark:text-stone-400">
                            Client & Contact Details
                        </h3>
                        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <span className="block font-mono text-[10px] text-stone-400 uppercase">
                                    Email Address
                                </span>
                                <div className="mt-1 flex items-center gap-2">
                                    <a
                                        href={`mailto:${enquiry.email}`}
                                        className="font-medium text-stone-900 underline decoration-stone-300 underline-offset-2 hover:text-stone-600 dark:text-stone-100 dark:decoration-stone-700 dark:hover:text-stone-300"
                                    >
                                        {enquiry.email}
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            copyToClipboard(
                                                enquiry.email,
                                                'email',
                                            )
                                        }
                                        className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                                        title="Copy email"
                                        aria-label="Copy email address"
                                    >
                                        <svg
                                            className="h-3.5 w-3.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </button>
                                    {copiedField === 'email' && (
                                        <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                                            Copied
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <span className="block font-mono text-[10px] text-stone-400 uppercase">
                                    Phone Number
                                </span>
                                <div className="mt-1 flex items-center gap-2">
                                    {enquiry.phone ? (
                                        <>
                                            <a
                                                href={`tel:${enquiry.phone}`}
                                                className="font-mono text-sm text-stone-900 hover:text-stone-600 dark:text-stone-100 dark:hover:text-stone-300"
                                            >
                                                {enquiry.phone}
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        enquiry.phone || '',
                                                        'phone',
                                                    )
                                                }
                                                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                                                title="Copy phone"
                                                aria-label="Copy phone number"
                                            >
                                                <svg
                                                    className="h-3.5 w-3.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </button>
                                            {copiedField === 'phone' && (
                                                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                                                    Copied
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <span className="text-xs text-stone-400 italic">
                                            Not provided
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <span className="block font-mono text-[10px] text-stone-400 uppercase">
                                    Project / Space / Studio
                                </span>
                                <p className="mt-1 text-sm font-medium text-stone-900 dark:text-stone-100">
                                    {enquiry.project_space ||
                                        enquiry.company ||
                                        'Private Residence / Undisclosed Space'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Specification & Scope */}
                    <div className="border border-stone-200/80 bg-stone-50/40 p-4 dark:border-stone-800 dark:bg-stone-950/40">
                        <h3 className="font-mono text-[10px] font-medium tracking-widest text-stone-500 uppercase dark:text-stone-400">
                            Architectural Scope & Interest
                        </h3>
                        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <span className="block font-mono text-[10px] text-stone-400 uppercase">
                                    Enquiry Type
                                </span>
                                <p className="mt-1 font-serif text-sm text-stone-900 dark:text-stone-100">
                                    {enquiry.enquiry_type || enquiry.type}
                                </p>
                            </div>

                            <div>
                                <span className="block font-mono text-[10px] text-stone-400 uppercase">
                                    Stone Collection
                                </span>
                                <div className="mt-1">
                                    <span className="inline-block border border-stone-300 bg-white px-2.5 py-0.5 font-mono text-xs font-medium text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200">
                                        {enquiry.collection ||
                                            enquiry.material_interest ||
                                            'General Consultation'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <span className="block font-mono text-[10px] text-stone-400 uppercase">
                                    Estimated Scope
                                </span>
                                <p className="mt-1 font-mono text-xs text-stone-700 dark:text-stone-300">
                                    {enquiry.estimated_requirement ||
                                        'Custom / To be scoped'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Verbatim Message */}
                    <div>
                        <h3 className="font-mono text-[10px] font-medium tracking-widest text-stone-500 uppercase dark:text-stone-400">
                            Client Message / Specification Note
                        </h3>
                        <div className="mt-2 border-l-2 border-stone-400 bg-stone-50 p-4 text-sm leading-relaxed whitespace-pre-wrap text-stone-800 dark:border-stone-600 dark:bg-stone-950/60 dark:text-stone-200">
                            {enquiry.message}
                        </div>
                    </div>

                    {/* Collapsible Technical Information */}
                    <div className="border-t border-stone-200 pt-4 dark:border-stone-800">
                        <button
                            type="button"
                            onClick={() =>
                                setIsTechnicalExpanded(!isTechnicalExpanded)
                            }
                            className="flex w-full items-center justify-between py-2 text-left font-mono text-[10px] tracking-wider text-stone-500 uppercase hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
                        >
                            <span>
                                Technical Audit Trail{' '}
                                {isTechnicalExpanded ? '[-]' : '[+]'}
                            </span>
                            <span className="text-xs">
                                {isTechnicalExpanded ? '▲ Hide' : '▼ View'}
                            </span>
                        </button>

                        {isTechnicalExpanded && (
                            <div className="mt-3 space-y-3 rounded-none border border-stone-200 bg-stone-100/50 p-3 font-mono text-xs text-stone-600 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-400">
                                <div>
                                    <span className="text-stone-400">
                                        IP Address:
                                    </span>{' '}
                                    <span className="text-stone-800 dark:text-stone-200">
                                        {enquiry.ip_address || '127.0.0.1'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-stone-400">
                                        User Agent:
                                    </span>{' '}
                                    <span className="text-[11px] break-all text-stone-700 dark:text-stone-300">
                                        {enquiry.user_agent || 'Unknown'}
                                    </span>
                                </div>
                                {enquiry.metadata &&
                                    Object.keys(enquiry.metadata).length >
                                        0 && (
                                        <div>
                                            <span className="text-stone-400">
                                                Additional Metadata:
                                            </span>
                                            <pre className="mt-1 max-h-32 overflow-auto bg-stone-200/60 p-2 text-[10px] dark:bg-stone-900">
                                                {JSON.stringify(
                                                    enquiry.metadata,
                                                    null,
                                                    2,
                                                )}
                                            </pre>
                                        </div>
                                    )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Action Bar */}
                <div className="flex items-center justify-between border-t border-stone-200/80 bg-stone-50/50 px-6 py-4 dark:border-stone-800/80 dark:bg-stone-900/50">
                    <button
                        type="button"
                        onClick={() => onDelete(enquiry)}
                        className="font-mono text-xs text-red-600 transition-colors hover:text-red-800 hover:underline dark:text-red-400 dark:hover:text-red-300"
                    >
                        Delete Enquiry
                    </button>

                    <div className="flex items-center gap-3">
                        <a
                            href={`mailto:${enquiry.email}?subject=${encodeURIComponent(
                                `Regarding your ELIOR Natural Stones inquiry — ${enquiry.collection || 'Architectural Stone'}`,
                            )}`}
                            className="inline-flex min-h-[40px] items-center justify-center border border-stone-300 bg-white px-4 py-2 font-mono text-xs font-medium tracking-wider text-stone-800 uppercase transition-colors hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
                        >
                            Reply via Email &rarr;
                        </a>

                        <button
                            type="button"
                            onClick={onClose}
                            className="min-h-[40px] border border-transparent px-4 py-2 font-mono text-xs tracking-wider text-stone-500 uppercase hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
