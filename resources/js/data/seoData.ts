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
            'Premier natural stone suppliers in Hyderabad, Telangana and Markapuram, Andhra Pradesh. Curating rare marble, architectural granites, Markapuram slate stone, Tandur limestone, sandstone & bespoke cut-to-size stone solutions across India.',
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
            'Marble Slabs in Hyderabad',
            'Italian Marble Slabs Hyderabad',
            'Statuario Extra Marble',
            'Calacatta Gold Marble',
            'Markapuram Slate Stone',
            'Markapur Black Slate Cladding',
            'Prakasam District Slate Quarries',
            'Tandur Blue Limestone Flooring',
            'Tandur Yellow Stone Slabs',
            'Chimakurthy Black Galaxy Granite',
            'Architectural Granites Telangana',
            'Slate Stone Wall Cladding Andhra Pradesh',
            'Kota Blue Limestone Flooring',
            'Natural Sandstone Facades',
            'Basalt Cobble Stones Paving Hyderabad',
            'Polished River Pebbles India',
            'Engineered Quartz Slabs Hyderabad',
            'Monolithic Stone Sculptures',
            'Jubilee Hills Luxury Stone Studio',
            'Banjara Hills Villa Natural Stone',
            'Gachibowli Kokapet Stone Flooring',
            'Andhra Pradesh Natural Stone Suppliers',
            'Telangana Architectural Stone Reserves',
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
        alternateName: 'ELIOR Natural Stones Hyderabad & Markapuram',
        image: `${baseUrl}/images/elior/homepage/homepage-hero.webp`,
        url: baseUrl,
        telephone: '+91 81259 58071',
        email: 'info@eliornaturalstones.com',
        priceRange: '$$$$',
        currenciesAccepted: 'INR, USD, EUR',
        paymentAccepted: 'Bank Transfer, Credit Card, Cheque',
        areaServed: [
            'Hyderabad',
            'Secunderabad',
            'Jubilee Hills',
            'Banjara Hills',
            'Gachibowli',
            'HITEC City',
            'Madhapur',
            'Financial District',
            'Kokapet',
            'Gandipet',
            'Narsingi',
            'Tellapur',
            'Manikonda',
            'Kondapur',
            'Tandur',
            'Warangal',
            'Karimnagar',
            'Khammam',
            'Nizamabad',
            'Nalgonda',
            'Mahabubnagar',
            'Telangana',
            'Markapuram',
            'Prakasam',
            'Ongole',
            'Chimakurthy',
            'Giddalur',
            'Cumbum',
            'Podili',
            'Kanigiri',
            'Yerragondapalem',
            'Vijayawada',
            'Guntur',
            'Amaravati',
            'Visakhapatnam',
            'Kurnool',
            'Kadapa',
            'Tirupati',
            'Nellore',
            'Rajahmundry',
            'Andhra Pradesh',
            'Bengaluru',
            'Chennai',
            'Mumbai',
            'Pune',
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
        question: 'Where can I source premium marble and natural stones in Hyderabad and Telangana?',
        answer: 'ELIOR Natural Stones supplies premium marble slabs (including Statuario, Calacatta, and Carrara), granites, Tandur limestone, sandstone, and slate from its studio gallery in Jubilee Hills, Hyderabad, catering to projects in Jubilee Hills, Banjara Hills, Gachibowli, Kokapet, HITEC City, Secunderabad, and across Telangana.',
    },
    {
        question: 'Does ELIOR supply Markapuram slate stone and natural stones from Andhra Pradesh?',
        answer: 'Yes. ELIOR curates authentic natural cleft slate stone and quartzites sourced directly from heritage quarry reserves around Markapuram, Prakasam district, as well as Chimakurthy Black Galaxy granite in Andhra Pradesh, delivering to projects in Markapuram, Vijayawada, Guntur, Amaravati, Visakhapatnam, and Kurnool.',
    },
    {
        question: 'What regional stone varieties are best suited for flooring and wall cladding in Andhra Pradesh and Telangana?',
        answer: 'For regional climate resilience, we specialize in authentic Markapuram black and multi-colored slate wall cladding, honed Tandur blue & yellow limestone flooring, mirror-polished marble slabs, and flamed Chimakurthy granite for both exterior facades and interior luxury residences.',
    },
    {
        question: 'Does ELIOR Natural Stones deliver across India?',
        answer: 'Yes, ELIOR provides nationwide insured logistics with sea-worthy, fumigated timber crating, delivering curated stone slabs and cut-to-size architectural orders across Hyderabad, Bengaluru, Chennai, Mumbai, Pune, Delhi NCR, and all major project sites in India.',
    },
    {
        question: 'What custom surface finishes are available for architectural projects?',
        answer: 'ELIOR offers custom surface calibrations including mirror polish, honed satin, tactile river-washed, leathered, bush-hammered, flamed, and natural cleft finishes tailored for interior living spaces, high-traffic lobbies, outdoor courtyards, and ventilated facades.',
    },
    {
        question: 'Can architects and designers request physical stone samples or reserve specific block slabs?',
        answer: 'Yes. Architects, interior designers, and project owners across Hyderabad, Markapuram, Andhra Pradesh, and India can request physical sample boxes or book a private material viewing at our Hyderabad gallery to inspect whole bookmatched bundles and reserve specific quarry lots before fabrication.',
    },
];
