import { usePage } from '@inertiajs/react';
import { SeoHead } from '../../components/seo/SeoHead';
import {
    generateOrganizationSchema,
    generateWebsiteSchema,
    generateLocalBusinessSchema,
} from '../../data/seoData';
import { PublicLayout } from '../../layouts/PublicLayout';
import { HeroSliderEngine } from '../../components/slider/HeroSliderEngine';
import { BrandPositioningSection } from '../../components/sections/home/BrandPositioningSection';
import { CollectionsSection } from '../../components/sections/home/CollectionsSection';
import { MaterialPhilosophySection } from '../../components/sections/home/MaterialPhilosophySection';
import { HeritageSection } from '../../components/sections/home/HeritageSection';
import { SignatureMaterialSection } from '../../components/sections/home/SignatureMaterialSection';
import { SourceToSpaceSection } from '../../components/sections/home/SourceToSpaceSection';
import { ArchitectServicesSection } from '../../components/sections/home/ArchitectServicesSection';
import { FinalStatementSection } from '../../components/sections/home/FinalStatementSection';
import { HOMEPAGE_IMAGES } from '../../data/homepageImages';
import type { Collection } from '../../types/stone';
import type { PublicSiteSettings } from '../../types/setting';
import type { Slider } from '../../types/slider';

interface HomeProps {
    collections: Collection[];
    cmsContent?: {
        id?: number;
        title?: string;
        meta_title?: string | null;
        meta_description?: string | null;
        content?: Record<string, any>;
    } | null;
    heroSlider?: Slider | null;
}

export default function Home({
    collections,
    cmsContent,
    heroSlider,
}: HomeProps) {
    const { siteSettings, appUrl } = usePage<{
        siteSettings?: PublicSiteSettings;
        appUrl?: string;
    }>().props;

    const baseUrl = (appUrl || 'https://eliornaturalstones.com').replace(
        /\/$/,
        '',
    );
    const canonicalUrl = baseUrl;

    const pageTitle =
        cmsContent?.meta_title ||
        siteSettings?.default_meta_title ||
        'ELIOR Natural Stones | Premium Natural Stone for Architecture';
    const pageDescription =
        cmsContent?.meta_description ||
        siteSettings?.default_meta_description ||
        'ELIOR Natural Stones brings carefully selected natural stone materials to contemporary architecture, interiors and considered spaces.';
    const siteName = siteSettings?.site_name || 'ELIOR Natural Stones';
    const heroImage =
        heroSlider?.slides?.[0]?.background_image ||
        cmsContent?.content?.hero?.image ||
        siteSettings?.default_share_image_id?.url ||
        HOMEPAGE_IMAGES.hero.src;

    const schemas = [
        generateOrganizationSchema(baseUrl),
        generateWebsiteSchema(baseUrl),
        generateLocalBusinessSchema(baseUrl),
    ];

    return (
        <PublicLayout>
            <SeoHead
                title={pageTitle}
                description={pageDescription}
                canonicalPath=""
                ogImage={heroImage}
                keywords={[
                    'natural stones',
                    'Italian marble',
                    'architectural granite',
                    'slate stone',
                    'limestones',
                    'sandstone',
                    'cobble stones',
                    'pebbles',
                    'quartz slabs',
                    'monolithic stone sculptures',
                    'luxury architecture surfaces',
                ]}
                schemas={schemas}
            />

            {/* 01 — HERO SLIDER ENGINE (Database-backed Multi-Layer GSAP with safe fallback) */}
            <HeroSliderEngine
                slider={heroSlider}
                fallbackContent={cmsContent?.content?.hero}
            />

            {/* 02 — BRAND POSITIONING */}
            <BrandPositioningSection
                content={cmsContent?.content?.brandPositioning}
            />

            {/* 03 — COLLECTIONS (Exact 8 Canonical Reserves) */}
            <CollectionsSection collections={collections} />

            {/* 04 — MATERIAL PHILOSOPHY */}
            <MaterialPhilosophySection
                content={cmsContent?.content?.philosophy}
            />

            {/* 05 — HERITAGE / OUR STORY (1990 to Present) */}
            <HeritageSection content={cmsContent?.content?.heritage} />

            {/* 06 — SIGNATURE MATERIAL MOMENT */}
            <SignatureMaterialSection content={cmsContent?.content?.signature} />

            {/* 07 — FROM SOURCE TO SPACE */}
            <SourceToSpaceSection
                content={cmsContent?.content?.sourceToSpace}
            />

            {/* 08 — ARCHITECT & DESIGNER SERVICES */}
            <ArchitectServicesSection
                content={cmsContent?.content?.architectServices}
            />

            {/* 09 — FINAL BRAND STATEMENT */}
            <FinalStatementSection content={cmsContent?.content?.closing} />
        </PublicLayout>
    );
}
