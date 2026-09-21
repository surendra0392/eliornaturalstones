/**
 * ELIOR Natural Stones — Our Story Editorial Content
 *
 * All content strictly follows the verified ELIOR heritage narrative.
 * Zero fabricated founder names, factory locations, client names,
 * certifications, or business metrics.
 */

export interface TimelineMilestone {
    index: string;
    year: string;
    company: string;
    description: string;
    badge?: string;
}

export interface ExperiencePrinciple {
    numeral: string;
    title: string;
    description: string;
}

export interface TraditionPrecisionStage {
    index: string;
    title: string;
    caption: string;
}

export const OUR_STORY_CONTENT = {
    // 01 — STORY HERO
    hero: {
        eyebrow: 'ELIOR / NATURAL STONES',
        title: 'A Legacy in Natural Stone',
        secondaryLine:
            'From material to architecture, our story has always been shaped by stone.',
        marker: 'SINCE 1990',
    },

    // 02 — OPENING STATEMENT
    opening: {
        statement: 'Three Decades. One Material.',
        paragraph1:
            'ELIOR is built on a long relationship with natural stone — from the movement of raw blocks to the precision of modern processing and the demands of contemporary architecture.',
        paragraph2:
            'Across every stage, the material remains the constant. What changes is how thoughtfully it is selected, processed and brought into space.',
    },

    // 03 — THE JOURNEY / TIMELINE
    timeline: {
        heading: 'A Legacy in Natural Stone',
        subline: 'From 1990 to today.',
        milestones: [
            {
                index: '01',
                year: '1990',
                company: 'SSS Enterprises',
                description: 'Wholesale raw block slabs across Southern India.',
                badge: 'TRADING FOUNDATION',
            },
            {
                index: '02',
                year: '2017',
                company: 'TEJ Natural Stones',
                description:
                    'High-tech stone manufacturing, diamond saw processing and development toward exports.',
                badge: 'PRECISION PROCESSING',
            },
            {
                index: '03',
                year: '2024',
                company: 'STONEX',
                description:
                    'Premium quartz slab lines and expansion into engineered surfaces.',
                badge: 'ENGINEERED SURFACES',
            },
            {
                index: '04',
                year: 'TODAY',
                company: 'ELIOR',
                description:
                    'A new flagship identity focused on premium stone for contemporary architecture.',
                badge: 'ARCHITECTURAL FLAGSHIP',
            },
        ] as TimelineMilestone[],
    },

    // 04 — FROM TRADITION TO PRECISION
    traditionPrecision: {
        headline: 'From Tradition to Precision.',
        paragraph1:
            'Natural stone has always demanded respect for its origin and variation. Over time, our role has evolved — from moving raw material to understanding how precision processing can reveal its architectural potential.',
        paragraph2:
            'Technology changed the process. The material remained the inspiration.',
        stages: [
            {
                index: '01',
                title: 'Raw Block Extraction',
                caption:
                    'Evaluating natural geological integrity, density, and organic veining in monumental blocks.',
            },
            {
                index: '02',
                title: 'Precision Diamond Slicing',
                caption:
                    'Calibrated diamond gang saw cutting ensuring absolute dimensional accuracy across continuous slabs.',
            },
            {
                index: '03',
                title: 'Tactile Surface Refinement',
                caption:
                    'Artisanal honing, leathering, and polishing designed to reveal depth rather than mask the mineral face.',
            },
            {
                index: '04',
                title: 'Architectural Realization',
                caption:
                    'Slabs bookmatched and dry-laid for monumental contemporary residential and civic spaces.',
            },
        ] as TraditionPrecisionStage[],
    },

    // 05 — WHAT EXPERIENCE TAUGHT US
    experience: {
        heading: 'What Experience Taught Us.',
        principles: [
            {
                numeral: '01',
                title: 'RESPECT THE MATERIAL',
                description:
                    'Natural stone is never identical. Its variation is part of its character.',
            },
            {
                numeral: '02',
                title: 'SELECT WITH INTENTION',
                description:
                    'The right stone depends on the space, light, scale and surrounding materials.',
            },
            {
                numeral: '03',
                title: 'PRECISION MATTERS',
                description:
                    'Processing should reveal the material rather than overwhelm it.',
            },
            {
                numeral: '04',
                title: 'DESIGN FOR TIME',
                description:
                    'Good materials should continue to belong to a space long after trends have changed.',
            },
        ] as ExperiencePrinciple[],
    },

    // 06 — THE ELIOR PHILOSOPHY
    philosophy: {
        headline: 'Material First. Text Second.',
        supportingStatement:
            'We believe the stone should speak before the specification does.',
        secondaryCopy:
            'Colour, movement, texture, scale and light all contribute to how a material belongs within architecture.',
    },

    // 07 — TODAY / LOOKING FORWARD
    lookingForward: {
        heading: 'Looking Forward.',
        paragraph1:
            'ELIOR represents the next expression of our relationship with stone — bringing natural materials, engineered surfaces and architectural thinking together with a more considered approach to selection and design.',
        paragraph2:
            'From a single surface to an entire architectural language, the aim remains simple: choose materials that make spaces feel enduring.',
    },

    // 08 — FINAL BRAND STATEMENT
    closing: {
        headline: 'Natural stone.\nTimeless spaces.',
        signature: 'ELIOR Natural Stones',
        cta: 'EXPLORE COLLECTIONS',
        ctaHref: '/collections',
    },
} as const;
