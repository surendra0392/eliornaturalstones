import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Container } from '../layout/Container';
import { MobileNavigation } from './MobileNavigation';
import { PUBLIC_NAV_ITEMS } from '../../types/navigation';
import { cn } from '../../lib/utils';

import type { PublicSiteSettings } from '../../types/setting';

export interface HeaderProps {
    variant?: 'transparent' | 'solid';
    className?: string;
}

export function Header({ variant = 'solid', className }: HeaderProps) {
    const { url, props } = usePage<{ siteSettings?: PublicSiteSettings }>();
    const siteSettings = props.siteSettings;
    const brandName = siteSettings?.site_name || 'ELIOR';
    const brandDescriptor = siteSettings?.brand_descriptor || 'Natural Stones';

    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                        <span className="text-graphite font-serif text-2xl font-light tracking-[0.24em] uppercase transition-opacity duration-300 group-hover:opacity-75 md:text-[25px]">
                            ELIOR
                        </span>
                        <span className="text-taupe text-[8.5px] font-medium tracking-[0.36em] uppercase">
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
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'group focus-visible:outline-graphite relative py-1.5 text-xs tracking-[0.2em] uppercase transition-colors duration-300 focus-visible:outline-2',
                                        active
                                            ? 'text-graphite font-medium'
                                            : 'text-graphite-light hover:text-bronze',
                                    )}
                                >
                                    <span>{item.label}</span>
                                    <span
                                        className={cn(
                                            'bg-bronze absolute bottom-0 left-0 h-[1.5px] transition-all duration-300 ease-out',
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
                            className="border-graphite/60 text-graphite hover:border-bronze hover:bg-bronze focus-visible:outline-graphite active:scale-[0.98] border px-6 py-2.5 text-[11px] font-medium tracking-[0.22em] uppercase transition-all duration-300 hover:text-white hover:shadow-xs focus-visible:outline-2"
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
