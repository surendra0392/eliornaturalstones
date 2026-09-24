import { Link, usePage } from '@inertiajs/react';
import { Container } from '../layout/Container';
import { PUBLIC_NAV_ITEMS } from '../../types/navigation';
import type { PublicSiteSettings } from '../../types/setting';

export function Footer() {
    const { siteSettings } = usePage<{ siteSettings?: PublicSiteSettings }>()
        .props;

    const brandName = siteSettings?.site_name || 'ELIOR';
    const brandDescriptor =
        siteSettings?.brand_descriptor ||
        'Natural Stones & Architectural Surfaces';
    const phone = siteSettings?.primary_phone || '+91 81259 58071';
    const email = siteSettings?.primary_email || 'info@eliornaturalstones.com';
    const locationCity = siteSettings?.default_location || 'Hyderabad';
    const locationRegion = 'Telangana, India';
    const availabilityText =
        siteSettings?.availability_text || 'Private Viewings by Appointment';

    const instagramUrl =
        siteSettings?.instagram_url || siteSettings?.social_links?.instagram;
    const linkedinUrl =
        siteSettings?.linkedin_url || siteSettings?.social_links?.linkedin;
    const pinterestUrl =
        siteSettings?.pinterest_url || siteSettings?.social_links?.pinterest;
    const hasSocial = Boolean(instagramUrl || linkedinUrl || pinterestUrl);

    return (
        <footer
            role="contentinfo"
            aria-label="Footer"
            className="border-border-subtle bg-ivory-warm text-graphite-muted border-t pt-16 pb-12 lg:pt-20 lg:pb-16"
        >
            <Container>
                {/* Brand Statement Banner */}
                <div className="border-border-stone border-b pb-12 lg:pb-14">
                    <p className="text-bronze text-[10px] font-medium tracking-[0.24em] uppercase">
                        Brand Statement
                    </p>
                    <h3 className="text-graphite mt-3 font-serif text-3xl font-light tracking-tight md:text-4xl lg:text-[42px] leading-tight">
                        Inspired by Nature.
                        <br />
                        <span className="text-taupe font-serif italic">
                            Made for Generations.
                        </span>
                    </h3>
                </div>

                {/* Main 4-Column Architectural Grid */}
                <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
                    {/* Column 1: Brand & Gallery Location */}
                    <div className="lg:col-span-3">
                        <Link
                            href="/"
                            aria-label="ELIOR Natural Stones Home"
                            className="focus-visible:outline-graphite inline-block focus-visible:outline-2"
                        >
                            <span className="text-graphite font-serif text-[28px] font-medium tracking-[0.22em] uppercase leading-tight md:text-[32px]">
                                ELIOR
                            </span>
                            <p className="text-graphite font-semibold mt-1 text-[11px] tracking-[0.38em] uppercase">
                                Natural Stones
                            </p>
                        </Link>
                        <p className="text-graphite/90 font-normal mt-5 max-w-sm text-xs leading-relaxed">
                            Purveyors of noble natural stones, monumental quarry
                            selections, and architectural surfaces for
                            discerning architects, builders, and spatial
                            designers.
                        </p>
                        <div className="border-border-stone mt-6 border-t pt-4 text-xs">
                            <span className="text-graphite font-semibold block text-[10px] tracking-[0.2em] uppercase">
                                Gallery Studio
                            </span>
                            <p className="text-graphite font-serif mt-1 text-sm font-semibold">
                                {locationCity}
                            </p>
                            <p className="text-graphite font-medium text-xs">
                                {locationRegion}
                            </p>
                        </div>
                    </div>

                    {/* Column 2: The 9 Curated Stone Collections */}
                    <div className="lg:col-span-4">
                        <h4 className="text-graphite text-xs font-semibold tracking-[0.25em] uppercase">
                            Material Collections
                        </h4>
                        <ul className="mt-5 grid grid-cols-1 gap-y-2.5 sm:grid-cols-2 sm:gap-x-4">
                            {[
                                { name: 'Marble', href: '/collections/italian-marble' },
                                { name: 'Granites', href: '/collections/granites' },
                                { name: 'Slate Stone', href: '/collections/slate-stone' },
                                { name: 'Limestones', href: '/collections/limestones' },
                                { name: 'Sandstone', href: '/collections/sandstone' },
                                { name: 'Cobble Stones', href: '/collections/cobble-stones' },
                                { name: 'Pebbles', href: '/collections/pebbles' },
                                { name: 'Quartz Surfaces', href: '/collections/quartz' },
                                { name: 'Stone Sculptures', href: '/collections/sculptures' },
                            ].map((col) => (
                                <li key={col.href}>
                                    <Link
                                        href={col.href}
                                        className="group font-semibold text-graphite hover:text-bronze focus-visible:outline-graphite relative inline-block text-xs tracking-wider transition-colors focus-visible:outline-2"
                                    >
                                        <span>{col.name}</span>
                                        <span
                                            className="bg-bronze absolute bottom-0 left-0 h-[1.5px] w-0 transition-all duration-300 group-hover:w-full"
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Architectural Navigation */}
                    <div className="lg:col-span-2">
                        <h4 className="text-graphite text-xs font-semibold tracking-[0.25em] uppercase">
                            Studio & Process
                        </h4>
                        <ul className="mt-5 space-y-2.5">
                            {PUBLIC_NAV_ITEMS.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="group font-semibold text-graphite hover:text-bronze focus-visible:outline-graphite relative inline-block text-xs tracking-wider transition-colors focus-visible:outline-2"
                                    >
                                        <span>{item.label}</span>
                                        <span
                                            className="bg-bronze absolute bottom-0 left-0 h-[1.5px] w-0 transition-all duration-300 group-hover:w-full"
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact Details & Specification Desk */}
                    <div className="lg:col-span-3">
                        <h4 className="text-graphite text-xs font-semibold tracking-[0.25em] uppercase">
                            Specification Desk
                        </h4>
                        <div className="mt-5 space-y-3.5 text-xs leading-relaxed">
                            <div>
                                <span className="text-graphite font-semibold mb-0.5 block text-[10px] tracking-[0.2em] uppercase">
                                    Direct Telephone
                                </span>
                                <a
                                    href={`tel:${phone.replace(/\s+/g, '')}`}
                                    className="text-graphite hover:text-bronze focus-visible:outline-graphite font-serif text-sm font-semibold tracking-wide transition-colors focus-visible:outline-2"
                                >
                                    {phone}
                                </a>
                            </div>

                            <div>
                                <span className="text-graphite font-semibold mb-0.5 block text-[10px] tracking-[0.2em] uppercase">
                                    Material Inquiries
                                </span>
                                <a
                                    href={`mailto:${email}`}
                                    className="text-graphite hover:text-bronze focus-visible:outline-graphite font-semibold transition-colors focus-visible:outline-2"
                                >
                                    {email}
                                </a>
                            </div>

                            <div className="border-border-stone border-t pt-3">
                                <p className="text-graphite font-semibold text-[10px] tracking-widest uppercase">
                                    {availabilityText}
                                </p>
                            </div>

                            {hasSocial && (
                                <div className="border-border-stone border-t pt-3">
                                    <span className="text-graphite font-semibold mb-1.5 block text-[10px] tracking-[0.2em] uppercase">
                                        Architectural Channels
                                    </span>
                                    <div className="flex items-center gap-3.5 text-xs">
                                        {instagramUrl && (
                                            <a
                                                href={instagramUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-semibold text-graphite hover:text-bronze focus-visible:outline-graphite transition-colors focus-visible:outline-1"
                                                aria-label="Instagram"
                                            >
                                                Instagram
                                            </a>
                                        )}
                                        {linkedinUrl && (
                                            <a
                                                href={linkedinUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-semibold text-graphite hover:text-bronze focus-visible:outline-graphite transition-colors focus-visible:outline-1"
                                                aria-label="LinkedIn"
                                            >
                                                LinkedIn
                                            </a>
                                        )}
                                        {pinterestUrl && (
                                            <a
                                                href={pinterestUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-semibold text-graphite hover:text-bronze focus-visible:outline-graphite transition-colors focus-visible:outline-1"
                                                aria-label="Pinterest"
                                            >
                                                Pinterest
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sub-Footer Legal / Brand Affiliation */}
                <div className="border-border-stone text-graphite mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-[11px] font-semibold tracking-wider sm:flex-row sm:gap-0">
                    <p>
                        © {new Date().getFullYear()} ELIOR Natural Stones. All
                        rights reserved.
                    </p>
                    <p className="text-graphite font-semibold">
                        A brand of Stone X
                    </p>
                </div>
            </Container>
        </footer>
    );
}
