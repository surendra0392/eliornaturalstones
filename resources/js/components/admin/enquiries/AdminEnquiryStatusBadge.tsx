interface AdminEnquiryStatusBadgeProps {
    status: string;
    showDot?: boolean;
    className?: string;
}

export function AdminEnquiryStatusBadge({
    status,
    showDot = true,
    className = '',
}: AdminEnquiryStatusBadgeProps) {
    const config: Record<
        string,
        {
            label: string;
            containerClass: string;
            dotClass: string;
        }
    > = {
        pending: {
            label: 'Pending',
            containerClass:
                'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
            dotClass: 'bg-amber-500 animate-pulse',
        },
        in_progress: {
            label: 'In Progress',
            containerClass:
                'bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800',
            dotClass: 'bg-sky-500',
        },
        responded: {
            label: 'Responded',
            containerClass:
                'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
            dotClass: 'bg-emerald-500',
        },
        closed: {
            label: 'Closed',
            containerClass:
                'bg-stone-100 text-stone-600 border-stone-300 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700',
            dotClass: 'bg-stone-400',
        },
        // Fallbacks for legacy aliases
        reviewed: {
            label: 'In Progress',
            containerClass:
                'bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800',
            dotClass: 'bg-sky-500',
        },
        contacted: {
            label: 'Responded',
            containerClass:
                'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
            dotClass: 'bg-emerald-500',
        },
        archived: {
            label: 'Closed',
            containerClass:
                'bg-stone-100 text-stone-600 border-stone-300 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700',
            dotClass: 'bg-stone-400',
        },
    };

    const current = config[status] || {
        label: status.replace(/_/g, ' '),
        containerClass:
            'bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700',
        dotClass: 'bg-stone-400',
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 border px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-wider uppercase ${current.containerClass} ${className}`}
        >
            {showDot && (
                <span
                    className={`h-1.5 w-1.5 rounded-full ${current.dotClass}`}
                    aria-hidden="true"
                />
            )}
            {current.label}
        </span>
    );
}
