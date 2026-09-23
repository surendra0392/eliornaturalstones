import { usePage } from '@inertiajs/react';
import { SeoHead } from '../../components/seo/SeoHead';
import { PublicLayout } from '../../layouts/PublicLayout';
import { ArchitectServicesHeroSection } from '../../components/sections/architect-services/ArchitectServicesHeroSection';
import { ArchitectServicesIntroSection } from '../../components/sections/architect-services/ArchitectServicesIntroSection';
import { ServiceDisciplinesSection } from '../../components/sections/architect-services/ServiceDisciplinesSection';
import { MaterialConsultationSection } from '../../components/sections/architect-services/MaterialConsultationSection';
import { DesignSupportSection } from '../../components/sections/architect-services/DesignSupportSection';
import { ApplicationGuidanceSection } from '../../components/sections/architect-services/ApplicationGuidanceSection';
import { ProjectCollaborationSection } from '../../components/sections/architect-services/ProjectCollaborationSection';
import { SelectionProcessSection } from '../../components/sections/architect-services/SelectionProcessSection';
import { ProfessionalEnquirySection } from '../../components/sections/architect-services/ProfessionalEnquirySection';
import { ArchitectServicesClosingSection } from '../../components/sections/architect-services/ArchitectServicesClosingSection';
import { ARCHITECT_SERVICES_IMAGES } from '../../data/architectServicesImages';

interface ArchitectDesignerServicesProps {
    cmsContent?: {
        id?: number;
        title?: string;
        meta_title?: string | null;
        meta_description?: string | null;
        content?: Record<string, any>;
    } | null;
}

export default function ArchitectDesignerServices({
    cmsContent,
}: ArchitectDesignerServicesProps = {}) {
    const { appUrl } = usePage<{ appUrl?: string }>().props;
    const baseUrl = (appUrl || 'https://eliornaturalstones.com').replace(
        /\/$/,
        '',
    );
    const canonicalUrl = `${baseUrl}/architect-designer-services`;

    const pageTitle =
        cmsContent?.meta_title ||
        'ELIOR Natural Stones | Architect & Designer Services';
    const pageDescription =
        cmsContent?.meta_description ||
        'ELIOR Natural Stones supports architects and designers with considered material guidance, collection exploration and stone selection for contemporary spaces.';
    const shareImage =
        cmsContent?.content?.hero?.image || ARCHITECT_SERVICES_IMAGES.hero.src;

    const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Architect & Designer Material Consultation Services',
        provider: {
            '@type': 'Organization',
            name: 'ELIOR Natural Stones',
            url: baseUrl,
        },
        description: pageDescription,
        url: canonicalUrl,
        serviceType: 'Architectural Stone Consultation',
        areaServed: 'India',
    };

    const tradeFaqs = [
        {
            question: 'How can architects and interior designers request physical stone sample boxes?',
            answer: 'Design professionals can request curated physical sample boxes (100x100mm and 200x200mm calibrated specimens) directly through our consultation desk or enquiry form for prompt studio delivery.',
        },
        {
            question: 'Does ELIOR provide technical datasheets, ASTM testing, and BIM support?',
            answer: 'Yes. Every collection batch includes comprehensive technical documentation detailing compressive strength, water absorption, bulk density, slip resistance ratings, and finish suitability.',
        },
        {
            question: 'What is the lead time for bespoke quarry orders and calibrated sizing?',
            answer: 'Standard architectural reserves ship within 7 to 14 business days. Custom dimensional cutting, specialized curved cladding, and bookmatched sequence slabs are scheduled to match project milestones.',
        },
        {
            question: 'Are private viewing appointments and dry-lay inspections available?',
            answer: 'Yes, architects, designers, and their clients are welcomed to inspect continuous dry-lays and monolithic block selections by appointment at our Hyderabad gallery studio.',
        },
    ];

    return (
        <PublicLayout
            breadcrumbs={[
                { name: 'Home', path: '/' },
                {
                    name: 'Architect & Designer Services',
                    path: '/architect-designer-services',
                },
            ]}
        >
            <SeoHead
                title={pageTitle}
                description={pageDescription}
                canonicalPath="/architect-designer-services"
                ogImage={shareImage}
                breadcrumbs={[
                    { name: 'Home', path: '/' },
                    {
                        name: 'Architect & Designer Services',
                        path: '/architect-designer-services',
                    },
                ]}
                faqItems={tradeFaqs}
                keywords={[
                    'architect stone consultation',
                    'interior designer stone samples',
                    'architectural stone specifications',
                    'bespoke stone dry-lay',
                    'luxury trade stone supplier',
                ]}
                schemas={[serviceSchema]}
            />

            {/* 01. HERO */}
            <ArchitectServicesHeroSection content={cmsContent?.content?.hero} />

            {/* 02. INTRODUCTION */}
            <ArchitectServicesIntroSection
                content={cmsContent?.content?.intro}
            />

            {/* 03. SIX SERVICE DISCIPLINES */}
            <ServiceDisciplinesSection content={cmsContent?.content?.services} />

            {/* 04. MATERIAL CONSULTATION */}
            <MaterialConsultationSection
                content={cmsContent?.content?.consultation}
            />

            {/* 05. DESIGN SUPPORT */}
            <DesignSupportSection
                content={cmsContent?.content?.designSupport}
            />

            {/* 06. MATERIAL / APPLICATION GUIDANCE */}
            <ApplicationGuidanceSection
                content={cmsContent?.content?.applications}
            />

            {/* 07. PROJECT COLLABORATION */}
            <ProjectCollaborationSection
                content={cmsContent?.content?.collaboration}
            />

            {/* 08. THE MATERIAL SELECTION PROCESS */}
            <SelectionProcessSection
                content={cmsContent?.content?.selectionProcess}
            />

            {/* 09. PROFESSIONAL ENQUIRY */}
            <ProfessionalEnquirySection
                content={cmsContent?.content?.enquiry}
            />

            {/* 10. CLOSING STATEMENT */}
            <ArchitectServicesClosingSection
                content={cmsContent?.content?.closing}
            />
        </PublicLayout>
    );
}
