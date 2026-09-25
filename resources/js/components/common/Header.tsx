import { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Container } from '../layout/Container';
import { MobileNavigation } from './MobileNavigation';
import {
    PUBLIC_NAV_ITEMS,
    DEFAULT_COLLECTIONS_NAV,
    type NavCollection,
} from '../../types/navigation';
import { cn } from '../../lib/utils';

import type { PublicSiteSettings } from '../../types/setting';

export interface HeaderProps {
    variant?: 'transparent' | 'solid';
    className?: string;
}

export function Header({ variant = 'solid', className }: HeaderProps) {
    const { url, props } = usePage<{
        siteSettings?: PublicSiteSettings;
        navCollections?: NavCollection[];
    }>();
    const siteSettings = props.siteSettings;
    const brandName = siteSettings?.site_name || 'ELIOR';
    const brandDescriptor = siteSettings?.brand_descriptor || 'Natural Stones';
    const collectionsList =
        props.navCollections && props.navCollections.length > 0
            ? props.navCollections
            : DEFAULT_COLLECTIONS_NAV;

    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
    const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleDropdownEnter = () => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
            dropdownTimeoutRef.current = null;
        }
        setCollectionsDropdownOpen(true);
    };

    const handleDropdownLeave = () => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
        }
        dropdownTimeoutRef.current = setTimeout(() => {
            setCollectionsDropdownOpen(false);
        }, 180);
    };

    // Close dropdown on URL change or Escape key
    useEffect(() => {
        setCollectionsDropdownOpen(false);
    }, [url]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setCollectionsDropdownOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isSolid = variant === 'solid' || scrolled;

    const isActive = (href: string) => {
        if (href === '/') return url === '/' || url === '';
        return url.startsWith(href);
    };

    return (
        <>
            <header
                role="banner"
                className={cn(
                    'sticky top-0 z-40 w-full transition-all duration-500',
                    isSolid
                        ? 'border-border-subtle bg-ivory/92 border-b shadow-[0_4px_20px_-6px_rgba(15,15,15,0.05)] backdrop-blur-xl'
                        : 'border-b border-transparent bg-transparent',
                    className,
                )}
            >
                <Container className="flex h-20 items-center justify-between md:h-22">
                    {/* Architectural Brand Wordmark */}
                    <Link
                        href="/"
                        aria-label="ELIOR Natural Stones Home"
                        className="group focus-visible:outline-graphite flex flex-col tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4"
                    >
                        <span className="text-graphite font-serif text-[28px] font-medium tracking-[0.22em] uppercase transition-opacity duration-300 group-hover:opacity-75 md:text-[32px] leading-tight">
                            ELIOR
                        </span>
                        <span className="text-taupe text-[10px] font-semibold tracking-[0.38em] uppercase md:text-[11px]">
                            Natural Stones
                        </span>
                    </Link>

                    {/* Desktop Architectural Editorial Navigation */}
                    <nav
                        aria-label="Primary Navigation"
                        className="hidden items-center space-x-8 lg:flex lg:space-x-10"
                    >
                        {PUBLIC_NAV_ITEMS.map((item) => {
                            const active = isActive(item.href);
                            const isCollections = item.href === '/collections';

                            if (isCollections) {
                                return (
                                    <div
                                        key={item.href}
                                        className="relative"
                                        onMouseEnter={handleDropdownEnter}
                                        onMouseLeave={handleDropdownLeave}
                                    >
                                        <div className="flex items-center gap-1">
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    'group focus-visible:outline-graphite relative py-1.5 text-xs font-semibold tracking-[0.18em] uppercase transition-colors duration-300 focus-visible:outline-2 flex items-center gap-1.5',
                                                    active
                                                        ? 'text-graphite'
                                                        : 'text-graphite hover:text-bronze',
                                                )}
                                            >
                                                <span>{item.label}</span>
                                                <span
                                                    className={cn(
                                                        'bg-bronze absolute bottom-0 left-0 h-[2px] transition-all duration-300 ease-out',
                                                        active
                                                            ? 'w-full'
                                                            : 'w-0 group-hover:w-full',
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setCollectionsDropdownOpen(
                                                        (prev) => !prev,
                                                    )
                                                }
                                                aria-expanded={
                                                    collectionsDropdownOpen
                                                }
                                                aria-haspopup="true"
                                                aria-label="Toggle collections menu"
                                                className="text-graphite hover:text-bronze p-1 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-graphite"
                                            >
                                                <svg
                                                    className={cn(
                                                        'h-3 w-3 transition-transform duration-300',
                                                        collectionsDropdownOpen
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

                                        {/* Dropdown Menu Container */}
                                        <div
                                            role="menu"
                                            aria-label="Collections Submenu"
                                            className={cn(
                                                'absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[460px] z-50 transition-all duration-300 ease-out',
                                                collectionsDropdownOpen
                                                    ? 'opacity-100 translate-y-0 pointer-events-auto visible'
                                                    : 'opacity-0 -translate-y-2 pointer-events-none invisible',
                                            )}
                                        >
                                            <div className="bg-ivory border border-border-stone p-6 shadow-[0_24px_48px_-12px_rgba(15,15,15,0.14)] backdrop-blur-xl">
                                                {/* Header */}
                                                <div className="flex items-center justify-between border-b border-border-stone/60 pb-3 mb-4">
                                                    <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-bronze">
                                                        Architectural Reserves
                                                    </span>
                                                    <span className="text-[10px] tracking-wider text-taupe font-mono">
                                                        {collectionsList.length} Collections
                                                    </span>
                                                </div>

                                                {/* 2-Column Collection Grid */}
                                                <div className="grid grid-cols-2 gap-x-5 gap-y-1.5">
                                                    {collectionsList.map((col, cIdx) => {
                                                        const isColActive = url.startsWith(
                                                            `/collections/${col.slug}`,
                                                        );
                                                        return (
                                                            <Link
                                                                key={col.slug}
                                                                href={`/collections/${col.slug}`}
                                                                onClick={() =>
                                                                    setCollectionsDropdownOpen(
                                                                        false,
                                                                    )
                                                                }
                                                                role="menuitem"
                                                                className={cn(
                                                                    'group/item flex items-center justify-between py-2 px-2.5 transition-all duration-200 border border-transparent hover:border-border-stone/60 hover:bg-ivory-warm/60',
                                                                    isColActive &&
                                                                        'bg-ivory-warm/50 border-bronze/40 font-medium',
                                                                )}
                                                            >
                                                                <span
                                                                    className={cn(
                                                                        'font-serif text-[13px] tracking-wide transition-colors duration-200',
                                                                        isColActive
                                                                            ? 'text-bronze font-medium'
                                                                            : 'text-graphite group-hover/item:text-bronze',
                                                                    )}
                                                                >
                                                                    {col.name}
                                                                </span>
                                                                <span className="text-[10px] font-mono text-taupe/70 group-hover/item:text-bronze transition-colors">
                                                                    {String(
                                                                        cIdx + 1,
                                                                    ).padStart(
                                                                        2,
                                                                        '0',
                                                                    )}
                                                                </span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>

                                                {/* Footer Link: View All Collections */}
                                                <div className="mt-4 pt-3.5 border-t border-border-stone/60 flex items-center justify-between">
                                                    <span className="text-[10px] text-graphite-muted tracking-wider">
                                                        Natural Stone Masterworks
                                                    </span>
                                                    <Link
                                                        href="/collections"
                                                        onClick={() =>
                                                            setCollectionsDropdownOpen(
                                                                false,
                                                            )
                                                        }
                                                        className="group/all text-[11px] font-semibold text-bronze hover:text-graphite uppercase tracking-[0.16em] inline-flex items-center gap-1.5 transition-colors"
                                                    >
                                                        <span>View All Collections</span>
                                                        <span className="transition-transform duration-300 group-hover/all:translate-x-1">
                                                            →
                                                        </span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'group focus-visible:outline-graphite relative py-1.5 text-xs font-semibold tracking-[0.18em] uppercase transition-colors duration-300 focus-visible:outline-2',
                                        active
                                            ? 'text-graphite'
                                            : 'text-graphite hover:text-bronze',
                                    )}
                                >
                                    <span>{item.label}</span>
                                    <span
                                        className={cn(
                                            'bg-bronze absolute bottom-0 left-0 h-[2px] transition-all duration-300 ease-out',
                                            active
                                                ? 'w-full'
                                                : 'w-0 group-hover:w-full',
                                        )}
                                        aria-hidden="true"
                                    />
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Desktop Direct Inquire Action */}
                    <div className="hidden items-center space-x-6 lg:flex">
                        <Link
                            href="/contact"
                            className="border-graphite text-graphite hover:border-bronze hover:bg-bronze focus-visible:outline-graphite active:scale-[0.98] border-[1.5px] px-6 py-2.5 text-[11px] font-semibold tracking-[0.22em] uppercase transition-all duration-300 hover:text-white hover:shadow-xs focus-visible:outline-2"
                        >
                            Inquire
                        </Link>
                    </div>

                    {/* Mobile Navigation Trigger */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        aria-expanded={mobileMenuOpen}
                        aria-label="Open mobile navigation menu"
                        className="focus-visible:outline-graphite flex h-11 w-11 flex-col items-center justify-center space-y-1.5 p-2 focus-visible:outline-2 lg:hidden"
                    >
                        <span className="bg-graphite h-px w-6 transition-transform duration-300" />
                        <span className="bg-graphite h-px w-4 self-end transition-opacity duration-300" />
                        <span className="bg-graphite h-px w-6 transition-transform duration-300" />
                    </button>
                </Container>
            </header>

            {/* Mobile Navigation Drawer */}
            <MobileNavigation
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
            />
        </>
    );
}
