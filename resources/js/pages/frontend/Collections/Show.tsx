import { usePage } from '@inertiajs/react';
import { SeoHead } from '../../../components/seo/SeoHead';
import { generateProductCollectionSchema } from '../../../data/seoData';
import { PublicLayout } from '../../../layouts/PublicLayout';
import { CollectionHeroSection } from '../../../components/sections/collection-detail/CollectionHeroSection';
import { CollectionIntroSection } from '../../../components/sections/collection-detail/CollectionIntroSection';
import { MaterialCharacteristicsSection } from '../../../components/sections/collection-detail/MaterialCharacteristicsSection';
import { VarietyLibrarySection } from '../../../components/sections/collection-detail/VarietyLibrarySection';
import { ApplicationsSection } from '../../../components/sections/collection-detail/ApplicationsSection';
import { MaterialGuidanceSection } from '../../../components/sections/collection-detail/MaterialGuidanceSection';
import { RelatedCollectionsSection } from '../../../components/sections/collection-detail/RelatedCollectionsSection';
import { CollectionEnquirySection } from '../../../components/sections/collection-detail/CollectionEnquirySection';
import {
    COLLECTION_DETAIL_REGISTRY,
    type CollectionEditorialData,
} from '../../../data/collectionDetailImages';
import type { Collection } from '../../../types/stone';

interface CollectionShowProps {
    collection: Collection;
    relatedCollections?: Collection[];
}

export default function CollectionShow({
    collection,
    relatedCollections = [],
}: CollectionShowProps) {
    // Look up editorial & image registry data with safe fallback, prioritizing database edits
    const registryData = COLLECTION_DETAIL_REGISTRY[collection.slug];
    const editorialData: CollectionEditorialData = {
        descriptor:
            collection.tagline ||
            registryData?.descriptor ||
            'Distinctive natural stone surfaces for considered architecture.',
        index: String(collection.sort_order || 1).padStart(2, '0'),
        heroImage: {
            src:
                collection.hero_image ||
                registryData?.heroImage?.src ||
                '/images/elior/brand/shared-fallback.webp',
            alt: `${collection.name} architectural stone surface`,
        },
        intro: {
            statement:
                collection.description ||
                registryData?.intro?.statement ||
                'Natural stone embodies permanence and organic character, defining extraordinary architectural spaces.',
            paragraphs: registryData?.intro?.paragraphs || [
                'Formed through geological transformation, each extraction carries subtle mineral variations and unique textural depth.',
                'Engineered to meet contemporary design demands while preserving timeless material integrity.',
            ],
            image: registryData?.intro?.image || {
                src:
                    collection.hero_image ||
                    '/images/elior/brand/shared-fallback.webp',
                alt: `${collection.name} stone detail plate`,
            },
        },
        characteristics: registryData?.characteristics || [
            {
                title: 'Mineral Character',
                description:
                    'Natural mineral density and geological integrity.',
            },
            {
                title: 'Surface Variety',
                description:
                    'Available in honed, polished, or cleft treatments.',
            },
            {
                title: 'Architectural Scale',
                description:
                    'Suitable for monumental walls and seamless floors.',
            },
        ],
        applications: registryData?.applications || [
            {
                name: 'Interior Floors',
                description:
                    'Expansive stone floors connecting architectural spaces.',
                image: {
                    src: '/images/elior/brand/shared-fallback.webp',
                    alt: 'Interior stone flooring',
                },
            },
            {
                name: 'Feature Walls',
                description:
                    'Monolithic wall cladding creating vertical rhythm.',
                image: {
                    src: '/images/elior/brand/shared-fallback.webp',
                    alt: 'Stone feature wall',
                },
            },
        ],
        guidance: registryData?.guidance || [
            {
                title: 'Finish Suitability',
                description:
                    'Select honed surfaces for high-traffic zones and polished finishes for vertical focal planes.',
            },
            {
                title: 'Lighting Integration',
                description:
                    'Directional raking light illuminates subtle geological textures and mineral depth.',
            },
        ],
        varietyFallbacks: registryData?.varietyFallbacks || {},
    };

    const { appUrl } = usePage<{ appUrl?: string }>().props;
    const baseUrl = (appUrl || 'https://eliornaturalstones.com').replace(
        /\/$/,
        '',
    );
    const canonicalUrl = `${baseUrl}/collections/${collection.slug}`;

    const pageTitle =
        collection.meta_title || `${collection.name} | ELIOR Natural Stones`;
    const pageDescription =
        collection.meta_description ||
        collection.description ||
        `Explore ${collection.name} from ELIOR Natural Stones — distinctive natural stone surfaces selected for considered architecture and interiors.`;
    const pageImage = collection.hero_image || editorialData.heroImage.src;

    const collectionPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: pageTitle,
        description: pageDescription,
        url: canonicalUrl,
        mainEntity: {
            '@type': 'ItemList',
            name: `${collection.name} Varieties`,
            numberOfItems: (collection.varieties || []).length,
            itemListElement: (collection.varieties || []).map(
                (variety, idx) => ({
                    '@type': 'ListItem',
                    position: idx + 1,
                    name: variety.name,
                }),
            ),
        },
    };

    const productSchema = generateProductCollectionSchema(collection, baseUrl);

    const stoneFaqs = [
        {
            question: `What architectural applications are best suited for ${collection.name}?`,
            answer: `${collection.name} is selected for interior flooring, feature walls, monumental facades, and bespoke joinery where natural mineral depth and enduring material character are demanded.`,
        },
        {
            question: `What finishes are available for ELIOR ${collection.name}?`,
            answer: `Finishes include honed, polished, brushed, leathered, and natural cleft, calibrated to specific acoustic, tactile, and slip-resistance architectural requirements.`,
        },
        {
            question: `How should ${collection.name} be maintained and protected?`,
            answer: `We recommend penetrating breathable impregnating sealers applied after installation, with routine maintenance using neutral pH stone cleaners to protect mineral luster without altering surface breathability.`,
        },
        {
            question: `Does ELIOR provide custom thicknesses and bookmatching for ${collection.name}?`,
            answer: `Yes, ELIOR coordinates directly with partner quarries to provide custom slab thicknesses (20mm, 30mm, 50mm) and sequential bookmatching for continuous veining across architectural focal planes.`,
        },
    ];

    return (
        <PublicLayout
            breadcrumbs={[
                { name: 'Home', path: '/' },
                { name: 'Collections', path: '/collections' },
                {
                    name: collection.name,
                    path: `/collections/${collection.slug}`,
                },
            ]}
        >
            <SeoHead
                title={pageTitle}
                description={pageDescription}
                canonicalPath={`/collections/${collection.slug}`}
                ogImage={pageImage}
                breadcrumbs={[
                    { name: 'Home', path: '/' },
                    { name: 'Collections', path: '/collections' },
                    {
                        name: collection.name,
                        path: `/collections/${collection.slug}`,
                    },
                ]}
                faqItems={stoneFaqs}
                keywords={[
                    `${collection.name} slabs`,
                    `natural ${collection.name}`,
                    `${collection.name} in Hyderabad`,
                    `${collection.name} suppliers in Telangana`,
                    `${collection.name} in Andhra Pradesh`,
                    'Markapuram slate stone andhra pradesh',
                    'Tandur limestone flooring telangana',
                    `${collection.name} suppliers in India`,
                    'architectural stone surfaces',
                    `${collection.name} flooring`,
                    `${collection.name} wall cladding`,
                    'luxury interior stone',
                    'ELIOR Natural Stones',
                ]}
                schemas={[collectionPageSchema, productSchema]}
            />

            {/* 01 — COLLECTION HERO */}
            <CollectionHeroSection
                collectionName={collection.name}
                editorialData={editorialData}
            />

            {/* 02 — EDITORIAL INTRODUCTION */}
            <CollectionIntroSection
                collectionName={collection.name}
                editorialData={editorialData}
            />

            {/* 03 — MATERIAL CHARACTERISTICS */}
            <MaterialCharacteristicsSection
                collectionName={collection.name}
                characteristics={editorialData.characteristics}
            />

            {/* 04 — VARIETY LIBRARY (#varieties) */}
            <VarietyLibrarySection
                collectionName={collection.name}
                varieties={collection.varieties || []}
                editorialData={editorialData}
            />

            {/* 05 — ARCHITECTURAL APPLICATIONS */}
            <ApplicationsSection
                collectionName={collection.name}
                applications={editorialData.applications}
            />

            {/* 06 — MATERIAL GUIDANCE / CONSIDERATIONS */}
            <MaterialGuidanceSection
                collectionName={collection.name}
                guidance={editorialData.guidance}
            />

            {/* 07 — RELATED COLLECTIONS */}
            <RelatedCollectionsSection
                relatedCollections={relatedCollections}
            />

            {/* 08 — ENQUIRY CTA */}
            <CollectionEnquirySection collectionName={collection.name} />
        </PublicLayout>
    );
}
