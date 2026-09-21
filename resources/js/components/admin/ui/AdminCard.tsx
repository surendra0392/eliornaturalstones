import type { ReactNode } from 'react';

export interface AdminCardProps {
    title?: string;
    description?: string;
    badge?: ReactNode;
    action?: ReactNode;
    footer?: ReactNode;
    className?: string;
    children: ReactNode;
}

export function AdminCard({
    title,
    description,
    badge,
    action,
    footer,
    className = '',
    children,
}: AdminCardProps) {
    return (
        <div
            className={`border border-stone-200 bg-white shadow-2xs dark:border-stone-800 dark:bg-stone-900 ${className}`}
        >
            {(title || description || action || badge) && (
                <div className="flex items-center justify-between border-b border-stone-200/80 px-6 py-4 dark:border-stone-800/80">
                    <div>
                        {title && (
                            <div className="flex items-center gap-3">
                                <h3 className="font-serif text-lg font-normal text-stone-900 dark:text-stone-100">
                                    {title}
                                </h3>
                                {badge}
                            </div>
                        )}
                        {description && (
                            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                                {description}
                            </p>
                        )}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}

            <div className="p-6">{children}</div>

            {footer && (
                <div className="border-t border-stone-200/80 bg-stone-50/50 px-6 py-3.5 dark:border-stone-800/80 dark:bg-stone-900/50">
                    {footer}
                </div>
            )}
        </div>
    );
}
