import { usePage } from '@inertiajs/react';
import { SeoHead } from '../../components/seo/SeoHead';
import { PublicLayout } from '../../layouts/PublicLayout';
import { OurStoryHeroSection } from '../../components/sections/our-story/OurStoryHeroSection';
import { StoryOpeningSection } from '../../components/sections/our-story/StoryOpeningSection';
import { HeritageTimelineSection } from '../../components/sections/our-story/HeritageTimelineSection';
import { TraditionPrecisionSection } from '../../components/sections/our-story/TraditionPrecisionSection';
import { ExperiencePrinciplesSection } from '../../components/sections/our-story/ExperiencePrinciplesSection';
import { PhilosophySection } from '../../components/sections/our-story/PhilosophySection';
import { LookingForwardSection } from '../../components/sections/our-story/LookingForwardSection';
import { StoryClosingSection } from '../../components/sections/our-story/StoryClosingSection';
import { OUR_STORY_IMAGES } from '../../data/ourStoryImages';

interface OurStoryProps {
    cmsContent?: {
        id?: number;
        title?: string;
        meta_title?: string | null;
        meta_description?: string | null;
        content?: Record<string, any>;
    } | null;
}

export default function OurStory({ cmsContent }: OurStoryProps = {}) {
    const { appUrl } = usePage<{ appUrl?: string }>().props;
    const baseUrl = (appUrl || 'https://eliornaturalstones.com').replace(
        /\/$/,
        '',
    );
    const canonicalUrl = `${baseUrl}/our-story`;

    const pageTitle =
        cmsContent?.meta_title ||
        'About ELIOR Natural Stones | 35-Year Quarry Legacy & Craftsmanship';
    const pageDescription =
        cmsContent?.meta_description ||
        'Founded in 1990, ELIOR Natural Stones unites three decades of quarry extraction mastery with contemporary architectural curation across India’s Deccan plateau.';
    const shareImage =
        cmsContent?.content?.hero?.image || OUR_STORY_IMAGES.hero.src;

    const aboutPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: pageTitle,
        description: pageDescription,
        url: canonicalUrl,
        mainEntity: {
            '@type': 'Organization',
            name: 'ELIOR Natural Stones',
            url: baseUrl,
            foundingDate: '1990',
            description: pageDescription,
            knowsAbout: [
                'Natural Stone Processing',
                'Quarry Extraction',
                'Architectural Stone Curation',
            ],
        },
    };

    return (
        <PublicLayout
            breadcrumbs={[
                { name: 'Home', path: '/' },
                { name: 'Our Story', path: '/our-story' },
            ]}
        >
            <SeoHead
                title={pageTitle}
                description={pageDescription}
                canonicalPath="/our-story"
                ogImage={shareImage}
                breadcrumbs={[
                    { name: 'Home', path: '/' },
                    { name: 'Our Story', path: '/our-story' },
                ]}
                keywords={[
                    'ELIOR natural stones history',
                    'natural stone legacy india',
                    'stone processing craftsmanship hyderabad',
                    'architectural stone supplier india',
                    'quarry stone heritage 1990',
                    'indian stone masters',
                ]}
                schemas={[aboutPageSchema]}
            />

            {/* 01. STORY HERO */}
            <OurStoryHeroSection content={cmsContent?.content?.hero} />

            {/* 02. OPENING STATEMENT */}
            <StoryOpeningSection content={cmsContent?.content?.opening} />

            {/* 03. THE JOURNEY — TIMELINE */}
            <HeritageTimelineSection content={cmsContent?.content?.timeline} />

            {/* 04. FROM TRADITION TO PRECISION */}
            <TraditionPrecisionSection
                content={cmsContent?.content?.traditionPrecision}
            />

            {/* 05. WHAT EXPERIENCE TAUGHT US */}
            <ExperiencePrinciplesSection
                content={cmsContent?.content?.experience}
            />

            {/* 06. THE ELIOR PHILOSOPHY */}
            <PhilosophySection content={cmsContent?.content?.philosophy} />

            {/* 07. TODAY / LOOKING FORWARD */}
            <LookingForwardSection
                content={cmsContent?.content?.lookingForward}
            />

            {/* 08. FINAL BRAND STATEMENT */}
            <StoryClosingSection content={cmsContent?.content?.closing} />
        </PublicLayout>
    );
}
