import { usePage } from '@inertiajs/react';
import { SeoHead } from '../../../components/seo/SeoHead';
import { toAbsoluteUrl } from '../../../data/seoData';
import { PublicLayout } from '../../../layouts/PublicLayout';
import { CollectionsHeroSection } from '../../../components/sections/collections/CollectionsHeroSection';
import { CollectionsIntroSection } from '../../../components/sections/collections/CollectionsIntroSection';
import { CollectionsGridSection } from '../../../components/sections/collections/CollectionsGridSection';
import { CollectionsClosingSection } from '../../../components/sections/collections/CollectionsClosingSection';
import { COLLECTIONS_IMAGES } from '../../../data/collectionsImages';
import type { Collection } from '../../../types/stone';

interface CollectionsIndexProps {
    collections: Collection[];
    cmsContent?: {
        id?: number;
        title?: string;
        meta_title?: string | null;
        meta_description?: string | null;
        content?: Record<string, any>;
    } | null;
}

export default function CollectionsIndex({
    collections,
    cmsContent,
}: CollectionsIndexProps) {
    const { appUrl } = usePage<{ appUrl?: string }>().props;
    const baseUrl = (appUrl || 'https://eliornaturalstones.com').replace(
        /\/$/,
        '',
    );
    const canonicalUrl = `${baseUrl}/collections`;

    const pageTitle =
        cmsContent?.meta_title ||
        'Natural Stone Collections | Marble, Granite, Sandstone | ELIOR';
    const pageDescription =
        cmsContent?.meta_description ||
        'Explore 9 curated architectural natural stone collections: Marble, Granites, Markapuram Slate Stone, Tandur Limestones, Sandstone, Cobbles, Pebbles & Quartz in Hyderabad, Telangana & Andhra Pradesh.';
    const heroImage =
        cmsContent?.content?.hero?.image || COLLECTIONS_IMAGES.hero.src;

    const collectionPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: pageTitle,
        description: pageDescription,
        url: canonicalUrl,
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: collections.length,
            itemListElement: collections.map((col, idx) => ({
                '@type': 'ListItem',
                position: idx + 1,
                name: col.name,
                description: col.description || col.tagline,
                url: `${baseUrl}/collections/${col.slug}`,
                image: col.hero_image
                    ? toAbsoluteUrl(baseUrl, col.hero_image)
                    : undefined,
            })),
        },
    };

    return (
        <PublicLayout
            breadcrumbs={[
                { name: 'Home', path: '/' },
                { name: 'Collections', path: '/collections' },
            ]}
        >
            <SeoHead
                title={pageTitle}
                description={pageDescription}
                canonicalPath="/collections"
                ogImage={heroImage}
                breadcrumbs={[
                    { name: 'Home', path: '/' },
                    { name: 'Collections', path: '/collections' },
                ]}
                keywords={[
                    'natural stone collections hyderabad',
                    'marble slabs hyderabad telangana',
                    'markapuram slate stone andhra pradesh',
                    'tandur limestone flooring telangana',
                    'chimakurthy black galaxy granite',
                    'architectural granites hyderabad',
                    'natural sandstone slabs ap',
                    'cobble stones driveway paving',
                    'river pebbles india',
                    'quartz surfaces jubilee hills',
                    'hand carved stone sculptures',
                ]}
                schemas={[collectionPageSchema]}
            />

            {/* 01 — EDITORIAL HERO */}
            <CollectionsHeroSection content={cmsContent?.content?.hero} />

            {/* 02 — COLLECTION INTRODUCTION */}
            <CollectionsIntroSection content={cmsContent?.content?.intro} />

            {/* 03 — COLLECTION GRID (Exact 8 Canonical Reserves) */}
            <CollectionsGridSection collections={collections} />

            {/* 04 — MATERIAL PHILOSOPHY / CLOSING */}
            <CollectionsClosingSection content={cmsContent?.content?.closing} />
        </PublicLayout>
    );
}
