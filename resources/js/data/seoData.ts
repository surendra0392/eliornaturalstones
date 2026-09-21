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
        url: baseUrl,
        logo: `${baseUrl}/favicon.svg`,
        description:
            'Curated natural stone collections, precision processing, and architectural stone consulting for contemporary spaces.',
        foundingDate: '1990',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Hyderabad',
            addressRegion: 'Telangana',
            addressCountry: 'IN',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            telephone: '+91 81259 58071',
            email: 'connect@eliornaturalstones.com',
            availableLanguage: ['en', 'hi', 'te'],
        },
        knowsAbout: [
            'Italian Marble',
            'Granites',
            'Slate Stone',
            'Limestones',
            'Sand Stone',
            'Cobble Stones',
            'Pebbles',
            'Quartz Slabs',
            'Architectural Stone Sculptures',
        ],
    };
}

export function generateWebsiteSchema(baseUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'ELIOR Natural Stones',
        url: baseUrl,
        description:
            'Curated natural stone collections for contemporary architecture, luxury interiors, and considered private spaces.',
    };
}

export function generateLocalBusinessSchema(baseUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'HomeGoodsStore',
        name: 'ELIOR Natural Stones Studio & Gallery',
        image: `${baseUrl}/images/elior/homepage/homepage-hero.webp`,
        url: baseUrl,
        telephone: '+91 81259 58071',
        priceRange: '$$$$',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Hyderabad',
            addressRegion: 'Telangana',
            addressCountry: 'IN',
        },
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
