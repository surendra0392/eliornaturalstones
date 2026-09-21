import { useState, useRef, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

interface AdminHeaderProps {
    title: string;
    onMenuClick?: () => void;
}

export function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
    const { auth } = usePage<{
        auth?: { user?: { name?: string; email?: string } };
    }>().props;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const user = auth?.user;
    const userName = user?.name || 'Administrator';
    const userEmail = user?.email || 'admin@eliornaturalstones.com';

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleLogout() {
        router.post('/admin/logout');
    }

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-8 dark:border-stone-800 dark:bg-stone-900">
            {/* Left: Mobile Toggle & Page Title */}
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Open sidebar"
                    className="flex h-10 w-10 items-center justify-center border border-stone-200 text-stone-600 md:hidden dark:border-stone-800 dark:text-stone-300"
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
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>

                <div>
                    <h1 className="font-serif text-lg font-normal text-stone-900 sm:text-xl dark:text-stone-100">
                        {title}
                    </h1>
                </div>
            </div>

            {/* Right: User Identity & Account Menu */}
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-3 border border-stone-200 bg-stone-50 px-3 py-1.5 transition-colors hover:border-stone-300 dark:border-stone-800 dark:bg-stone-800 dark:hover:border-stone-700"
                >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-xs font-medium text-white dark:bg-stone-100 dark:text-stone-900">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden text-left sm:block">
                        <p className="text-xs font-medium text-stone-900 dark:text-stone-100">
                            {userName}
                        </p>
                        <p className="font-mono text-[10px] text-stone-400 dark:text-stone-500">
                            {userEmail}
                        </p>
                    </div>
                    <svg
                        className={`h-3.5 w-3.5 text-stone-400 transition-transform ${
                            dropdownOpen ? 'rotate-180' : ''
                        }`}
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
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                    <div className="absolute right-0 z-50 mt-2 w-56 border border-stone-200 bg-white py-2 shadow-lg dark:border-stone-800 dark:bg-stone-900">
                        <div className="border-b border-stone-100 px-4 py-2 sm:hidden dark:border-stone-800">
                            <p className="text-xs font-medium text-stone-900 dark:text-stone-100">
                                {userName}
                            </p>
                            <p className="font-mono text-[10px] text-stone-400">
                                {userEmail}
                            </p>
                        </div>

                        <div className="px-4 py-1.5">
                            <span className="font-mono text-[9px] tracking-widest text-stone-400 uppercase dark:text-stone-500">
                                Status: Authorized Admin
                            </span>
                        </div>

                        <div className="border-t border-stone-100 pt-1 dark:border-stone-800">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                            >
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
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
