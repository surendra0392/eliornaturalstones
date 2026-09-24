import { usePage } from '@inertiajs/react';
import { SeoHead } from '../../components/seo/SeoHead';
import { PublicLayout } from '../../layouts/PublicLayout';
import { SourceToSpaceHeroSection } from '../../components/sections/source-to-space/SourceToSpaceHeroSection';
import { SourceToSpaceIntroSection } from '../../components/sections/source-to-space/SourceToSpaceIntroSection';
import { JourneySection } from '../../components/sections/source-to-space/JourneySection';
import { SourceSection } from '../../components/sections/source-to-space/SourceSection';
import { ProcessingSection } from '../../components/sections/source-to-space/ProcessingSection';
import { SelectionSection } from '../../components/sections/source-to-space/SelectionSection';
import { PackagingSection } from '../../components/sections/source-to-space/PackagingSection';
import { MovementSection } from '../../components/sections/source-to-space/MovementSection';
import { ArchitectureSection } from '../../components/sections/source-to-space/ArchitectureSection';
import { SourceToSpaceClosingSection } from '../../components/sections/source-to-space/SourceToSpaceClosingSection';
import { SOURCE_TO_SPACE_IMAGES } from '../../data/sourceToSpaceImages';

interface FromSourceToSpaceProps {
    cmsContent?: {
        id?: number;
        title?: string;
        meta_title?: string | null;
        meta_description?: string | null;
        content?: Record<string, any>;
    } | null;
}

export default function FromSourceToSpace({
    cmsContent,
}: FromSourceToSpaceProps = {}) {
    const { appUrl } = usePage<{ appUrl?: string }>().props;
    const baseUrl = (appUrl || 'https://eliornaturalstones.com').replace(
        /\/$/,
        '',
    );
    const canonicalUrl = `${baseUrl}/from-source-to-space`;

    const pageTitle =
        cmsContent?.meta_title ||
        'Quarry to Space: 6-Stage Natural Stone Journey | ELIOR Stones';
    const pageDescription =
        cmsContent?.meta_description ||
        'Explore our precision 6-stage natural stone process: quarry extraction, gangsaw processing, dry-lay inspection, fumigated packing, transit & architectural installation.';
    const shareImage =
        cmsContent?.content?.hero?.image || SOURCE_TO_SPACE_IMAGES.hero.src;

    const journeyProcessSchema = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'The 6-Stage Natural Stone Architectural Journey',
        description: pageDescription,
        step: [
            {
                '@type': 'HowToStep',
                position: 1,
                name: 'Quarry Origin & Block Selection',
                text: 'Direct assessment at heritage quarries evaluating geological density, compressive strength, and natural veining.',
            },
            {
                '@type': 'HowToStep',
                position: 2,
                name: 'Precision Diamond Processing',
                text: 'Calibrated gang saw cutting, acoustic inspection, and tactile finishing tailored to architectural specs.',
            },
            {
                '@type': 'HowToStep',
                position: 3,
                name: 'Curation & Dry-Lay Inspection',
                text: 'Slab pairing, tonal grading, and full sequence dry-laying to verify visual rhythm.',
            },
            {
                '@type': 'HowToStep',
                position: 4,
                name: 'Engineered Packaging & Protection',
                text: 'Moisture-resistant bracing, shock-dampening fumigated timber crates, and corner guards.',
            },
            {
                '@type': 'HowToStep',
                position: 5,
                name: 'Logistics & White-Glove Transit',
                text: 'Secure multi-modal transit coordination from port direct to the project job site.',
            },
            {
                '@type': 'HowToStep',
                position: 6,
                name: 'Architectural Realization',
                text: 'Installation guidance, substrate alignment, and post-installation breathability sealing.',
            },
        ],
    };

    return (
        <PublicLayout
            breadcrumbs={[
                { name: 'Home', path: '/' },
                { name: 'From Source to Space', path: '/from-source-to-space' },
            ]}
        >
            <SeoHead
                title={pageTitle}
                description={pageDescription}
                canonicalPath="/from-source-to-space"
                ogImage={shareImage}
                breadcrumbs={[
                    { name: 'Home', path: '/' },
                    { name: 'From Source to Space', path: '/from-source-to-space' },
                ]}
                keywords={[
                    'natural stone journey',
                    'quarry block extraction india',
                    'natural stone processing gangsaw',
                    'dry-lay stone inspection hyderabad',
                    'architectural stone delivery india',
                    'stone installation guidelines',
                ]}
                schemas={[journeyProcessSchema]}
            />

            {/* 01. HERO */}
            <SourceToSpaceHeroSection content={cmsContent?.content?.hero} />

            {/* 02. INTRODUCTION */}
            <SourceToSpaceIntroSection content={cmsContent?.content?.intro} />

            {/* 03. THE SIX-STAGE JOURNEY */}
            <JourneySection content={cmsContent?.content?.journey} />

            {/* 04. SOURCE / QUARRY */}
            <SourceSection content={cmsContent?.content?.source} />

            {/* 05. PROCESSING / PRECISION */}
            <ProcessingSection content={cmsContent?.content?.processing} />

            {/* 06. SELECTION / CURATION */}
            <SelectionSection content={cmsContent?.content?.selection} />

            {/* 07. PACKAGING / PROTECTION */}
            <PackagingSection content={cmsContent?.content?.packaging} />

            {/* 08. MOVEMENT / DELIVERY */}
            <MovementSection content={cmsContent?.content?.movement} />

            {/* 09. SPACE / ARCHITECTURE */}
            <ArchitectureSection content={cmsContent?.content?.architecture} />

            {/* 10. CLOSING STATEMENT */}
            <SourceToSpaceClosingSection
                content={cmsContent?.content?.closing}
            />
        </PublicLayout>
    );
}
