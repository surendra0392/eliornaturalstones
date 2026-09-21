export interface EnquiryTypeOption {
    value: string;
    label: string;
}

export interface CanonicalCollectionOption {
    value: string;
    label: string;
}

export interface HowWeCanHelpItem {
    id: string;
    number: string;
    title: string;
    description: string;
}

export interface ContactHeroContent {
    eyebrow: string;
    title: string;
    supportingCopy: string;
    ctaText: string;
    ctaHref: string;
}

export interface ContactIntroContent {
    eyebrow: string;
    title: string;
    description1: string;
    description2: string;
    pillars: Array<{
        title: string;
        description: string;
    }>;
}

export interface EnquiryFormContent {
    heading: string;
    supportingCopy: string;
    submitButtonText: string;
    submittingButtonText: string;
    privacyReassurance: string;
    successHeading: string;
    successMessage: string;
    resetButtonText: string;
}

export interface DirectContactContent {
    heading: string;
    phoneLabel: string;
    phoneValue: string;
    phoneDisplay: string;
    emailLabel: string;
    emailValue: string;
    locationLabel: string;
    locationValue: string;
}

export interface HowWeCanHelpContent {
    eyebrow: string;
    heading: string;
    items: HowWeCanHelpItem[];
}

export interface ContactClosingContent {
    heading: string;
    supportingLine: string;
    ctaText: string;
    ctaHref: string;
    brandMarker: string;
}

export interface ContactPageContent {
    hero: ContactHeroContent;
    intro: ContactIntroContent;
    form: EnquiryFormContent;
    directContact: DirectContactContent;
    howWeCanHelp: HowWeCanHelpContent;
    closing: ContactClosingContent;
    enquiryTypes: EnquiryTypeOption[];
    canonicalCollections: CanonicalCollectionOption[];
}

export const ENQUIRY_TYPE_OPTIONS: EnquiryTypeOption[] = [
    { value: 'Collection Enquiry', label: 'Collection Enquiry' },
    { value: 'Material Consultation', label: 'Material Consultation' },
    { value: 'Project Enquiry', label: 'Project Enquiry' },
    { value: 'Sample Request', label: 'Sample Request' },
    { value: 'Availability Enquiry', label: 'Availability Enquiry' },
    { value: 'General Enquiry', label: 'General Enquiry' },
];

export const CANONICAL_COLLECTION_OPTIONS: CanonicalCollectionOption[] = [
    { value: 'Italian Marble', label: 'Italian Marble' },
    { value: 'Granites', label: 'Granites' },
    { value: 'Slate Stone', label: 'Slate Stone' },
    { value: 'Limestones', label: 'Limestones' },
    { value: 'Sand Stone', label: 'Sand Stone' },
    { value: 'Cobble Stones', label: 'Cobble Stones' },
    { value: 'Pebbles', label: 'Pebbles' },
    { value: 'Quartz', label: 'Quartz' },
    { value: 'Sculptures', label: 'Sculptures' },
];

export const contactContent: ContactPageContent = {
    hero: {
        eyebrow: 'ELIOR NATURAL STONES',
        title: "Let's Talk About Your Space.",
        supportingCopy:
            "Whether you are selecting a single surface or shaping an entire architectural palette, we're here to help you find the right material.",
        ctaText: 'Start an Enquiry',
        ctaHref: '#enquiry-form',
    },
    intro: {
        eyebrow: 'ARCHITECTURAL DIALOGUE',
        title: 'A Conversation Starts With Material.',
        description1:
            'Every project begins differently. Some arrive with defined blueprints and material schedules, while others start with an initial atmospheric sketch or spatial volume.',
        description2:
            'We work closely with architects, interior designers, developers, and homeowners to understand specific spatial intentions and identify stone varieties that endure.',
        pillars: [
            {
                title: 'Project Vision',
                description:
                    'Aligning material tone, presence, and mood with architectural intent.',
            },
            {
                title: 'Space & Volume',
                description:
                    'Understanding dimensions, sightlines, and light transitions within the environment.',
            },
            {
                title: 'Material Direction',
                description:
                    'Selecting geological families that support the broader palette without competing.',
            },
            {
                title: 'Aesthetic Character',
                description:
                    'Evaluating stone veining, background neutrality, movement, and color depth.',
            },
            {
                title: 'Application Realities',
                description:
                    'Assessing daily wear, climate interaction, moisture exposure, and structural needs.',
            },
            {
                title: 'Desired Surface Finish',
                description:
                    'Selecting honed, brushed, flamed, or polished treatments for tactile expression.',
            },
        ],
    },
    form: {
        heading: 'Tell Us About Your Project.',
        supportingCopy:
            'Share a few details and our team can understand what you are looking for.',
        submitButtonText: 'Send Enquiry',
        submittingButtonText: 'Sending Enquiry...',
        privacyReassurance:
            'Your information is used only to respond to your enquiry.',
        successHeading: 'Enquiry Received',
        successMessage:
            'Thank you for your interest in ELIOR Natural Stones. Our material advisors will review your project details and reach out promptly.',
        resetButtonText: 'Submit Another Enquiry',
    },
    directContact: {
        heading: 'Prefer a Direct Conversation?',
        phoneLabel: 'Phone',
        phoneValue: '+918125958071',
        phoneDisplay: '+91 81259 58071',
        emailLabel: 'Email',
        emailValue: 'info@eliornaturalstones.com',
        locationLabel: 'Location',
        locationValue: 'Hyderabad, India',
    },
    howWeCanHelp: {
        eyebrow: 'CAPABILITIES',
        heading: 'How We Can Help',
        items: [
            {
                id: 'material-selection',
                number: '01',
                title: 'Material Selection',
                description:
                    'Guidance in identifying the right stone variety and tonality suited to your specific interior or exterior environment.',
            },
            {
                id: 'collection-enquiries',
                number: '02',
                title: 'Collection Enquiries',
                description:
                    'Detailed insights into slab inventory, veining patterns, quarry origins, and block availability across our curated collections.',
            },
            {
                id: 'project-collaboration',
                number: '03',
                title: 'Project Collaboration',
                description:
                    'Early-stage material dialogue with architects, designers, and developers to support seamless specification.',
            },
            {
                id: 'sample-requests',
                number: '04',
                title: 'Sample Requests',
                description:
                    'Curated physical stone specimens delivered to your studio or site for true lighting and tactile assessment.',
            },
            {
                id: 'availability-enquiries',
                number: '05',
                title: 'Availability Enquiries',
                description:
                    'Real-time information on lot quantities, block reservations, lead times, and dispatch logistics.',
            },
            {
                id: 'material-guidance',
                number: '06',
                title: 'Material Guidance',
                description:
                    'Practical observations on mineral hardness, surface finishes, natural patina, and maintenance requirements over time.',
            },
        ],
    },
    closing: {
        heading: 'The Right Material Changes Everything.',
        supportingLine: 'Begin with the material. Build from there.',
        ctaText: 'Explore Collections',
        ctaHref: '/collections',
        brandMarker: 'ELIOR NATURAL STONES',
    },
    enquiryTypes: ENQUIRY_TYPE_OPTIONS,
    canonicalCollections: CANONICAL_COLLECTION_OPTIONS,
};
