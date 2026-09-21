import { Link } from '@inertiajs/react';

export interface BreadcrumbItem {
    name: string;
    path?: string;
}

export interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
    if (!items || items.length <= 1) return null;

    return (
        <nav
            aria-label="Breadcrumb navigation"
            className={`w-full ${className}`}
        >
            <ol className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] font-sans tracking-[0.18em] uppercase">
                {items.map((item, idx) => {
                    const isLast = idx === items.length - 1;
                    return (
                        <li key={idx} className="flex items-center gap-1.5">
                            {idx > 0 && (
                                <span
                                    className="text-bronze/70 text-[9px] select-none"
                                    aria-hidden="true"
                                >
                                    /
                                </span>
                            )}
                            {isLast || !item.path ? (
                                <span
                                    className="text-graphite font-medium"
                                    aria-current="page"
                                >
                                    {item.name}
                                </span>
                            ) : (
                                <Link
                                    href={item.path}
                                    className="text-graphite-muted hover:text-bronze transition-colors duration-200"
                                >
                                    {item.name}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
