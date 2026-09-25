import { useEffect, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    PUBLIC_NAV_ITEMS,
    DEFAULT_COLLECTIONS_NAV,
    type NavCollection,
} from '../../types/navigation';
import type { PublicSiteSettings } from '../../types/setting';
import {
    mobileNavTransition,
    prefersReducedMotion,
} from '../../animations/gsap';
import { cn } from '../../lib/utils';

export interface MobileNavigationProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
    const drawerRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const closeBtnRef = useRef<HTMLButtonElement | null>(null);

    const [collectionsExpanded, setCollectionsExpanded] = useState(false);

    const { siteSettings, navCollections } = usePage<{
        siteSettings?: PublicSiteSettings;
        navCollections?: NavCollection[];
    }>().props;

    const collectionsList =
        navCollections && navCollections.length > 0
            ? navCollections
            : DEFAULT_COLLECTIONS_NAV;
    const phone =
        siteSettings?.enquiry_phone ||
        siteSettings?.primary_phone ||
        '+91 81259 58071';
    const email =
        siteSettings?.enquiry_email ||
        siteSettings?.primary_email ||
        'info@eliornaturalstones.com';
    const location =
        siteSettings?.business_location ||
        siteSettings?.default_location ||
        'Hyderabad, Telangana, India';

    // Close on Escape key and trap focus
    useEffect(() => {
        if (!isOpen) return;

        // Lock background body scroll
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Focus close button on open
        closeBtnRef.current?.focus();

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // GSAP animated entrance / exit
    useEffect(() => {
        const drawer = drawerRef.current;
        if (!drawer) return;

        const validItems = itemRefs.current.filter(
            (el): el is HTMLDivElement => el !== null,
        );

        if (isOpen) {
            mobileNavTransition(drawer, validItems, true);
        } else if (drawer.style.display !== 'none') {
            mobileNavTransition(drawer, validItems, false);
        }
    }, [isOpen]);

    if (!isOpen && typeof window !== 'undefined' && prefersReducedMotion()) {
        return null;
    }

    return (
        <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            style={{ display: isOpen ? 'block' : 'none' }}
            className="bg-ivory text-graphite fixed inset-0 z-[100] overflow-y-auto"
        >
            <div className="flex min-h-screen flex-col justify-between px-6 py-8 md:px-12">
                {/* Top bar with Brand and Close button */}
                <div className="border-border-subtle flex items-center justify-between border-b pb-6">
                    <Link
                        href="/"
                        onClick={onClose}
                        className="group focus-visible:outline-graphite flex flex-col focus-visible:outline-2"
                    >
                        <span className="text-graphite font-serif text-[28px] font-medium tracking-[0.22em] uppercase leading-tight">
                            ELIOR
                        </span>
                        <span className="text-taupe text-[10px] font-semibold tracking-[0.38em] uppercase md:text-[11px]">
                            Natural Stones
                        </span>
                    </Link>

                    <button
                        ref={closeBtnRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Close navigation menu"
                        className="border-border-stone text-graphite hover:border-bronze hover:text-bronze focus-visible:outline-graphite flex h-11 w-11 items-center justify-center border text-xs tracking-widest uppercase transition-colors focus-visible:outline-2"
                    >
                        ✕
                    </button>
                </div>

                {/* Primary Nav Links */}
                <nav
                    aria-label="Mobile Main Navigation"
                    className="my-auto flex flex-col space-y-5 py-10 md:space-y-7"
                >
                    {PUBLIC_NAV_ITEMS.map((item, idx) => {
                        const { url } = usePage();
                        const isActive =
                            item.href === '/'
                                ? url === '/' || url === ''
                                : url.startsWith(item.href);
                        const isCollections = item.href === '/collections';

                        return (
                            <div
                                key={item.href}
                                ref={(el) => {
                                    itemRefs.current[idx] = el;
                                }}
                            >
                                {isCollections ? (
                                    <div className="flex flex-col">
                                        <div className="flex items-center justify-between py-2">
                                            <Link
                                                href={item.href}
                                                onClick={onClose}
                                                className="group focus-visible:outline-graphite flex-1 transition-colors focus-visible:outline-2"
                                            >
                                                <span
                                                    className={cn(
                                                        'font-serif text-2xl font-bold tracking-tight transition-colors md:text-3xl',
                                                        isActive
                                                            ? 'text-bronze'
                                                            : 'text-graphite group-hover:text-bronze',
                                                    )}
                                                >
                                                    {item.label}
                                                </span>
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setCollectionsExpanded(
                                                        (prev) => !prev,
                                                    )
                                                }
                                                aria-expanded={collectionsExpanded}
                                                aria-label="Toggle collections sub-menu"
                                                className="border-border-stone text-graphite hover:text-bronze hover:border-bronze flex h-10 w-10 items-center justify-center border text-xs transition-colors cursor-pointer"
                                            >
                                                <svg
                                                    className={cn(
                                                        'h-4 w-4 transition-transform duration-300',
                                                        collectionsExpanded
                                                            ? 'rotate-180 text-bronze'
                                                            : '',
                                                    )}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Collapsible Mobile Collections Sub-menu */}
                                        {collectionsExpanded && (
                                            <div className="border-l-2 border-bronze/40 pl-4 my-2 flex flex-col space-y-2">
                                                {collectionsList.map((col, cIdx) => (
                                                    <Link
                                                        key={col.slug}
                                                        href={`/collections/${col.slug}`}
                                                        onClick={onClose}
                                                        className="flex items-center justify-between py-1.5 text-base font-serif text-graphite hover:text-bronze transition-colors"
                                                    >
                                                        <span>{col.name}</span>
                                                        <span className="text-[10px] font-mono text-taupe">
                                                            {String(cIdx + 1).padStart(2, '0')}
                                                        </span>
                                                    </Link>
                                                ))}
                                                <Link
                                                    href="/collections"
                                                    onClick={onClose}
                                                    className="text-xs font-semibold text-bronze uppercase tracking-widest pt-2 hover:text-graphite transition-colors inline-flex items-center gap-1.5"
                                                >
                                                    <span>View All Collections</span>
                                                    <span>→</span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className="group focus-visible:outline-graphite flex items-baseline justify-between py-2 transition-colors focus-visible:outline-2"
                                    >
                                        <span
                                            className={cn(
                                                'font-serif text-2xl font-bold tracking-tight transition-colors md:text-3xl',
                                                isActive
                                                    ? 'text-bronze'
                                                    : 'text-graphite group-hover:text-bronze',
                                            )}
                                        >
                                            {item.label}
                                        </span>
                                        <span
                                            className={cn(
                                                'text-xs font-bold tracking-widest uppercase transition-colors',
                                                isActive
                                                    ? 'text-bronze'
                                                    : 'text-taupe group-hover:text-bronze',
                                            )}
                                        >
                                            0{idx + 1}
                                        </span>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Direct Contact & Location info */}
                <div
                    ref={(el) => {
                        itemRefs.current[PUBLIC_NAV_ITEMS.length] = el;
                    }}
                    className="border-border-stone grid grid-cols-1 gap-6 border-t pt-8 text-xs md:grid-cols-3"
                >
                    <div>
                        <span className="text-graphite font-bold mb-1 block text-[10px] tracking-[0.24em] uppercase">
                            Direct Inquiries
                        </span>
                        <a
                            href={`tel:${phone.replace(/\s+/g, '')}`}
                            className="text-graphite hover:text-bronze block font-serif text-sm font-bold tracking-wide transition-colors"
                        >
                            {phone}
                        </a>
                        <a
                            href={`mailto:${email}`}
                            className="text-graphite font-semibold hover:text-bronze mt-0.5 block transition-colors"
                        >
                            {email}
                        </a>
                    </div>

                    <div>
                        <span className="text-graphite font-bold mb-1 block text-[10px] tracking-[0.24em] uppercase">
                            Gallery & Studio
                        </span>
                        <p className="text-graphite font-serif text-sm font-bold">
                            {location}
                        </p>
                    </div>

                    <div className="flex items-end md:justify-end">
                        <Link
                            href="/contact"
                            onClick={onClose}
                            className="border-graphite bg-graphite text-ivory hover:border-bronze hover:bg-bronze inline-block border px-6 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors"
                        >
                            Inquire / Book Consultation
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
