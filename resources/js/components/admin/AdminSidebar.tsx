import { Link, usePage } from '@inertiajs/react';

export interface AdminNavGroup {
    group: string;
    items: Array<{
        name: string;
        href: string;
        badge?: string | number;
    }>;
}

export const ADMIN_NAVIGATION: AdminNavGroup[] = [
    {
        group: 'Overview',
        items: [{ name: 'Dashboard', href: '/admin/dashboard' }],
    },
    {
        group: 'Content',
        items: [
            { name: 'Sliders', href: '/admin/sliders' },
            { name: 'Collections', href: '/admin/collections' },
            { name: 'Varieties', href: '/admin/varieties' },
            { name: 'Projects', href: '/admin/pages?edit=projects' },
            { name: 'Media', href: '/admin/media' },
            { name: 'Pages', href: '/admin/pages' },
        ],
    },
    {
        group: 'Enquiries',
        items: [{ name: 'Enquiries', href: '/admin/enquiries' }],
    },
    {
        group: 'System',
        items: [{ name: 'Settings', href: '/admin/settings' }],
    },
];

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
    const { url } = usePage();

    const sidebarContent = (
        <div className="flex h-full flex-col justify-between p-6">
            <div>
                {/* Brand Logo & Console Marker */}
                <div className="border-b border-stone-200 pb-5 dark:border-stone-800">
                    <Link href="/admin/dashboard" className="block">
                        <span className="font-serif text-lg tracking-[0.24em] text-stone-900 uppercase dark:text-stone-100">
                            ELIOR
                        </span>
                        <p className="font-mono text-[9px] tracking-[0.3em] text-stone-400 uppercase dark:text-stone-500">
                            Admin Console
                        </p>
                    </Link>
                </div>

                {/* Grouped Navigation */}
                <nav className="mt-6 space-y-6">
                    {ADMIN_NAVIGATION.map((section) => (
                        <div key={section.group}>
                            <p className="font-mono text-[9px] font-medium tracking-[0.24em] text-stone-400 uppercase dark:text-stone-500">
                                {section.group}
                            </p>
                            <div className="mt-2 space-y-1">
                                {section.items.map((item) => {
                                    const isActive = item.href.includes('?')
                                        ? url === item.href
                                        : url === item.href ||
                                          (item.href !== '/admin/dashboard' &&
                                              !url.includes('?') &&
                                              url.startsWith(item.href + '/'));

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={onClose}
                                            className={`flex items-center justify-between px-3 py-2 text-xs tracking-wider uppercase transition-colors ${
                                                isActive
                                                    ? 'border-l-2 border-stone-900 bg-stone-100 font-medium text-stone-900 dark:border-stone-100 dark:bg-stone-800 dark:text-stone-100'
                                                    : 'text-stone-600 hover:bg-stone-100/60 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800/60 dark:hover:text-stone-100'
                                            }`}
                                        >
                                            <span>{item.name}</span>
                                            {item.badge !== undefined && (
                                                <span className="font-mono text-[10px] text-stone-400">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Public Site Link */}
            <div className="border-t border-stone-200 pt-5 dark:border-stone-800">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-stone-400 uppercase transition-colors hover:text-stone-900 dark:hover:text-stone-200"
                >
                    <span>&larr;</span>
                    <span>Return to Site</span>
                </Link>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Persistent Sidebar */}
            <aside className="hidden w-64 shrink-0 border-r border-stone-200 bg-stone-50 md:block dark:border-stone-800 dark:bg-stone-900">
                {sidebarContent}
            </aside>

            {/* Mobile Slide-over Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Drawer */}
                    <div className="fixed inset-y-0 left-0 w-72 max-w-full border-r border-stone-200 bg-stone-50 shadow-xl dark:border-stone-800 dark:bg-stone-900">
                        <div className="absolute top-4 right-4">
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close navigation"
                                className="flex h-8 w-8 items-center justify-center text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
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
                        {sidebarContent}
                    </div>
                </div>
            )}
        </>
    );
}
