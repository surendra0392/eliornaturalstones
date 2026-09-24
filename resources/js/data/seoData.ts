/**
 * ELIOR Natural Stones — Structured Data & SEO Schema Generators
 *
 * Generates Schema.org compliant JSON-LD objects for enhanced search engine rich snippets
 * and Generative Engine Optimization (GEO) citations across Google, ChatGPT, Claude, and Perplexity.
 */

export interface BreadcrumbItem {
    name: string;
    path?: string;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export function cleanBaseUrl(appUrl?: string): string {
    return (appUrl || 'https://eliornaturalstones.com').replace(/\/$/, '');
}

export function toAbsoluteUrl(baseUrl: string, pathOrUrl?: string): string {
    if (!pathOrUrl) return `${baseUrl}/images/elior/homepage/homepage-hero.webp`;
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
        return pathOrUrl;
    }
    return `${baseUrl}/${pathOrUrl.replace(/^\//, '')}`;
}

export function generateOrganizationSchema(baseUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'ELIOR Natural Stones',
        alternateName: ['ELIOR', 'ELIOR Stones', 'Elior Natural Stones India'],
        url: baseUrl,
        logo: `${baseUrl}/favicon.svg`,
        description:
            'Leading natural stone suppliers in Hyderabad & India. Curating rare Italian marble, architectural granites, sandstone, limestone, slate & bespoke cut-to-size stone solutions.',
        foundingDate: '1990',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Jubilee Hills',
            addressLocality: 'Hyderabad',
            addressRegion: 'Telangana',
            postalCode: '500033',
            addressCountry: 'IN',
        },
        contactPoint: [
            {
                '@type': 'ContactPoint',
                contactType: 'sales and specification desk',
                telephone: '+91 81259 58071',
                email: 'info@eliornaturalstones.com',
                areaServed: 'IN',
                availableLanguage: ['en', 'hi', 'te'],
            },
        ],
        sameAs: [
            'https://www.instagram.com/eliornaturalstones',
            'https://www.linkedin.com/company/eliornaturalstones',
            'https://pinterest.com/eliornaturalstones',
        ],
        knowsAbout: [
            'Natural Stone Suppliers Hyderabad',
            'Italian Marble Slabs',
            'Statuario Extra Marble',
            'Calacatta Gold Marble',
            'Architectural Granites',
            'Black Galaxy Granite',
            'Slate Stone Wall Cladding',
            'Natural Limestones',
            'Kota Blue Limestone',
            'Sandstone Facades',
            'Cobble Stones Paving',
            'Polished River Pebbles',
            'Engineered Quartz Slabs',
            'Monolithic Stone Sculptures',
            'Architectural Stone Curation',
        ],
    };
}

export function generateWebsiteSchema(baseUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'ELIOR Natural Stones',
        alternateName: 'ELIOR',
        url: baseUrl,
        description:
            'Curated natural stone collections for contemporary architecture, luxury interiors, and considered private spaces in India.',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${baseUrl}/collections?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };
}

export function generateLocalBusinessSchema(baseUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'HomeGoodsStore',
        name: 'ELIOR Natural Stones Studio & Gallery',
        alternateName: 'ELIOR Natural Stones Hyderabad',
        image: `${baseUrl}/images/elior/homepage/homepage-hero.webp`,
        url: baseUrl,
        telephone: '+91 81259 58071',
        email: 'info@eliornaturalstones.com',
        priceRange: '$$$$',
        currenciesAccepted: 'INR, USD, EUR',
        paymentAccepted: 'Bank Transfer, Credit Card, Cheque',
        areaServed: [
            'Hyderabad',
            'Telangana',
            'Andhra Pradesh',
            'Bengaluru',
            'Mumbai',
            'Delhi NCR',
            'India',
        ],
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Jubilee Hills',
            addressLocality: 'Hyderabad',
            addressRegion: 'Telangana',
            postalCode: '500033',
            addressCountry: 'IN',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 17.4319,
            longitude: 78.4073,
        },
        hasMap: 'https://maps.google.com/?q=Hyderabad,Telangana,India',
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                ],
                opens: '09:30',
                closes: '18:30',
            },
        ],
    };
}

export function generateBreadcrumbSchema(
    baseUrl: string,
    items: BreadcrumbItem[],
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => {
            const itemUrl = item.path
                ? toAbsoluteUrl(baseUrl, item.path)
                : baseUrl;
            return {
                '@type': 'ListItem',
                position: index + 1,
                name: item.name,
                item: itemUrl,
            };
        }),
    };
}

export function generateFAQSchema(faqs: FAQItem[]) {
    if (!faqs || faqs.length === 0) return null;

    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}

export function generateProductCollectionSchema(
    collection: {
        name: string;
        description?: string | null;
        slug: string;
        hero_image?: string | null;
        varieties?: Array<{ name: string; description?: string | null }>;
    },
    baseUrl: string,
) {
    const canonicalUrl = `${baseUrl}/collections/${collection.slug}`;
    const imageUrl = toAbsoluteUrl(baseUrl, collection.hero_image || undefined);

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `${collection.name} Architectural Collection`,
        description:
            collection.description ||
            `Curated ${collection.name} architectural natural stone collection by ELIOR Natural Stones.`,
        image: imageUrl,
        brand: {
            '@type': 'Brand',
            name: 'ELIOR Natural Stones',
        },
        category: 'Building Materials > Natural Stone',
        material: collection.name,
        offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: canonicalUrl,
        },
    };
}

export const HOME_FAQS: FAQItem[] = [
    {
        question: 'Where can I source premium natural stones and Italian marble in Hyderabad?',
        answer: 'ELIOR Natural Stones supplies premium architectural natural stones, including Carrara and Tuscany Italian marble, architectural granites, sandstone, limestone, and hand-cut cobbles, from its studio gallery in Jubilee Hills, Hyderabad.',
    },
    {
        question: 'Does ELIOR Natural Stones deliver across India?',
        answer: 'Yes, ELIOR provides nationwide insured logistics with sea-worthy, fumigated timber crating, delivering curated stone slabs and cut-to-size architectural orders across Hyderabad, Bengaluru, Mumbai, Delhi NCR, Chennai, and all major project sites in India.',
    },
    {
        question: 'What stone finishes are available for architectural flooring and facades?',
        answer: 'ELIOR offers custom surface calibrations including mirror polish, honed satin, tactile river-washed, leathered, bush-hammered, flamed, and natural cleft finishes tailored for interior living spaces, high-traffic lobbies, outdoor courtyards, and ventilated facades.',
    },
    {
        question: 'Can architects and designers request physical stone samples or reserve specific block slabs?',
        answer: 'Yes. Architects, interior designers, and project owners can request physical sample boxes or arrange a private slab viewing at our Hyderabad gallery to inspect whole bookmatched bundles and reserve specific quarry lots before fabrication.',
    },
];
