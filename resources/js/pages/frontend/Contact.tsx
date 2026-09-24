import { usePage } from '@inertiajs/react';
import { SeoHead } from '../../components/seo/SeoHead';
import { generateLocalBusinessSchema } from '../../data/seoData';
import { PublicLayout } from '../../layouts/PublicLayout';
import { ContactHeroSection } from '../../components/sections/contact/ContactHeroSection';
import { EnquiryFormSection } from '../../components/sections/contact/EnquiryFormSection';
import { DirectContactSection } from '../../components/sections/contact/DirectContactSection';
import { HelpWithSection } from '../../components/sections/contact/HelpWithSection';
import { ContactClosingSection } from '../../components/sections/contact/ContactClosingSection';
import { contactImages } from '../../data/contactImages';

interface ContactPageProps {
    cmsContent?: {
        id?: number;
        title?: string;
        meta_title?: string | null;
        meta_description?: string | null;
        content?: Record<string, any>;
    } | null;
}

export default function Contact({ cmsContent }: ContactPageProps = {}) {
    const { appUrl } = usePage<{ appUrl?: string }>().props;
    const baseUrl = (appUrl || 'https://eliornaturalstones.com').replace(
        /\/$/,
        '',
    );
    const canonicalUrl = `${baseUrl}/contact`;

    const pageTitle =
        cmsContent?.meta_title ||
        'Contact ELIOR Natural Stones | Studio & Material Gallery Hyderabad';
    const pageDescription =
        cmsContent?.meta_description ||
        'Connect with ELIOR Natural Stones in Hyderabad. Reserve rare slabs, request stone sample boxes, or schedule private consultations for architects and interior designers.';
    const ogImage = contactImages.hero.src;

    const contactPageSchema = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: pageTitle,
        description: pageDescription,
        url: canonicalUrl,
        mainEntity: {
            '@type': 'Organization',
            name: 'ELIOR Natural Stones',
            url: baseUrl,
            contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                telephone: '+91 81259 58071',
                email: 'connect@eliornaturalstones.com',
            },
        },
    };

    const contactFaqs = [
        {
            question: 'How do I schedule a private architectural stone viewing?',
            answer: 'Private appointments can be arranged by submitting the enquiry form or calling our specification desk directly (+91 81259 58071) to ensure dedicated curation.',
        },
        {
            question: 'Where is the ELIOR Natural Stones studio and gallery located?',
            answer: 'Our flagship showroom and material gallery is situated in Jubilee Hills, Hyderabad, Telangana, India, showcasing full-scale slabs and tactile stone varieties.',
        },
        {
            question: 'Can you deliver stone consignments directly to site locations in Andhra Pradesh and Telangana?',
            answer: 'Yes, we provide end-to-end insured logistics delivering custom-crated marble, Markapuram slate, granites, and Tandur limestone directly to project job sites across Hyderabad, Secunderabad, Markapuram, Vijayawada, Visakhapatnam, Guntur, and all districts of Telangana and Andhra Pradesh.',
        },
    ];

    return (
        <PublicLayout
            breadcrumbs={[
                { name: 'Home', path: '/' },
                { name: 'Contact', path: '/contact' },
            ]}
        >
            <SeoHead
                title={pageTitle}
                description={pageDescription}
                canonicalPath="/contact"
                ogImage={ogImage}
                breadcrumbs={[
                    { name: 'Home', path: '/' },
                    { name: 'Contact', path: '/contact' },
                ]}
                faqItems={contactFaqs}
                keywords={[
                    'contact ELIOR natural stones',
                    'natural stone suppliers hyderabad',
                    'marble showroom jubilee hills hyderabad',
                    'markapuram slate stone suppliers',
                    'andhra pradesh natural stone enquiries',
                    'telangana architectural stone consultation',
                    'banjara hills stone showroom',
                    'stone sample box request india',
                    'tandur limestone dealers hyderabad',
                ]}
                schemas={[contactPageSchema, generateLocalBusinessSchema(baseUrl)]}
            />

            {/* 01 — HERO */}
            <ContactHeroSection content={cmsContent?.content?.hero} />

            {/* 02 — ENQUIRY FORM */}
            <EnquiryFormSection content={cmsContent?.content?.form} />

            {/* 03 — DIRECT CONTACT */}
            <DirectContactSection
                content={cmsContent?.content?.directContact}
            />

            {/* 04 — HOW WE CAN HELP */}
            <HelpWithSection content={cmsContent?.content?.howWeCanHelp} />

            {/* 05 — CLOSING ARCHITECTURAL STATEMENT */}
            <ContactClosingSection content={cmsContent?.content?.closing} />
        </PublicLayout>
    );
}
