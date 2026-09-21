export interface Page {
    id: number;
    title: string;
    slug: string;
    subtitle: string | null;
    excerpt: string | null;
    content: Record<string, any>;
    meta_title: string | null;
    meta_description: string | null;
    is_published: boolean;
    is_canonical?: boolean;
    template?: string;
    section_count?: number;
    live_url?: string;
    created_at?: string;
    updated_at?: string;
}

export interface PagePaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    counts?: {
        total: number;
        published: number;
        draft: number;
    };
}

export interface HeroContent {
    eyebrow?: string;
    marker?: string;
    title: string;
    secondaryLine?: string;
    supportingLine?: string;
    supportingCopy?: string;
    ctaPrimaryText?: string;
    ctaPrimaryHref?: string;
    ctaSecondaryText?: string;
    ctaSecondaryHref?: string;
    ctaText?: string;
    ctaHref?: string;
    image?: string;
    imageAlt?: string;
}

export interface TimelineMilestoneItem {
    index: string;
    year: string;
    company: string;
    description: string;
    badge?: string;
}

export interface JourneyStageItem {
    index: string;
    title: string;
    description: string;
    slug: string;
}

export interface ServiceDisciplineItem {
    index: string;
    title: string;
    description: string;
}

export interface SelectionAttributeItem {
    title: string;
    description: string;
}

export interface ExperiencePrincipleItem {
    numeral: string;
    title: string;
    description: string;
}

export interface TraditionPrecisionStageItem {
    index: string;
    title: string;
    caption: string;
}

export interface DirectContactDetails {
    heading?: string;
    phoneLabel?: string;
    phoneValue?: string;
    phoneDisplay?: string;
    emailLabel?: string;
    emailValue?: string;
    locationLabel?: string;
    locationValue?: string;
}

export interface HowWeCanHelpItemContent {
    id: string;
    number: string;
    title: string;
    description: string;
}
