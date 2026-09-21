import { Head, usePage } from '@inertiajs/react';
import {
    cleanBaseUrl,
    toAbsoluteUrl,
    generateBreadcrumbSchema,
    generateFAQSchema,
    type BreadcrumbItem,
    type FAQItem,
} from '../../data/seoData';
import type { PublicSiteSettings } from '../../types/setting';

export interface SeoHeadProps {
    title: string;
    description: string;
    canonicalPath?: string;
    ogImage?: string;
    ogType?: 'website' | 'article';
    keywords?: string | string[];
    breadcrumbs?: BreadcrumbItem[];
    faqItems?: FAQItem[];
    schemas?: Array<Record<string, any> | null | undefined>;
}

export function SeoHead({
    title,
    description,
    canonicalPath = '',
    ogImage,
    ogType = 'website',
    keywords,
    breadcrumbs,
    faqItems,
    schemas = [],
}: SeoHeadProps) {
    const { appUrl, siteSettings } = usePage<{
        appUrl?: string;
        siteSettings?: PublicSiteSettings;
    }>().props;

    const baseUrl = cleanBaseUrl(appUrl);
    const normalizedPath = canonicalPath.startsWith('/')
        ? canonicalPath
        : canonicalPath
          ? `/${canonicalPath}`
          : '';
    const canonicalUrl = `${baseUrl}${normalizedPath}`;
    const absoluteOgImage = toAbsoluteUrl(baseUrl, ogImage);
    const siteName = siteSettings?.site_name || 'ELIOR Natural Stones';

    const keywordsContent = Array.isArray(keywords)
        ? keywords.join(', ')
        : keywords;

    // Compile active schemas
    const allSchemas: Record<string, any>[] = [];

    if (breadcrumbs && breadcrumbs.length > 0) {
        allSchemas.push(generateBreadcrumbSchema(baseUrl, breadcrumbs));
    }

    if (faqItems && faqItems.length > 0) {
        const faqSchema = generateFAQSchema(faqItems);
        if (faqSchema) allSchemas.push(faqSchema);
    }

    if (schemas && schemas.length > 0) {
        schemas.forEach((schema) => {
            if (schema && typeof schema === 'object') {
                allSchemas.push(schema);
            }
        });
    }

    return (
        <Head>
            {/* Primary Browser & Crawler Meta */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />
            <meta name="robots" content="index, follow" />
            <meta
                name="googlebot"
                content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
            />
            <meta name="theme-color" content="#0F0F0F" />
            <meta name="msapplication-TileColor" content="#0F0F0F" />
            {keywordsContent && (
                <meta name="keywords" content={keywordsContent} />
            )}

            {/* Open Graph Meta Tags */}
            <meta property="og:site_name" content={siteName} />
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={absoluteOgImage} />
            <meta property="og:image:alt" content={title} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:locale" content="en_US" />

            {/* Twitter Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={absoluteOgImage} />
            <meta name="twitter:image:alt" content={title} />

            {/* Structured Data (Schema.org JSON-LD) */}
            {allSchemas.map((schema, index) => (
                <script
                    key={`schema-${index}-${schema['@type'] || 'ldjson'}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schema),
                    }}
                />
            ))}
        </Head>
    );
}
