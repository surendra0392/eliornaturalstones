import type { ReactNode } from 'react';

export interface AdminEmptyStateProps {
    title: string;
    description: string;
    icon?: ReactNode;
    action?: ReactNode;
}

export function AdminEmptyState({
    title,
    description,
    icon,
    action,
}: AdminEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center border border-dashed border-stone-300 px-6 py-12 text-center dark:border-stone-800">
            {icon ? (
                <div className="mb-4 text-stone-400 dark:text-stone-500">
                    {icon}
                </div>
            ) : (
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
                    <svg
                        className="h-6 w-6 text-stone-400 dark:text-stone-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                </div>
            )}
            <h4 className="font-serif text-base font-normal text-stone-900 dark:text-stone-100">
                {title}
            </h4>
            <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                {description}
            </p>
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
