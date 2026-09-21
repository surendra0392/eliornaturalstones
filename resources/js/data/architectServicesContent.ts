/**
 * ELIOR Natural Stones — Architect & Designer Services Content
 *
 * Material-focused consultancy narrative.
 * Zero claims of staffing, labor supply, contractor services,
 * structural engineering certification, or unverified laboratory specs.
 */

export interface ServiceDiscipline {
    index: string;
    title: string;
    description: string;
}

export interface ApplicationCategory {
    title: string;
    subtitle: string;
    considerations: string[];
}

export interface SelectionStep {
    step: string;
    title: string;
    description: string;
}

export const ARCHITECT_SERVICES_CONTENT = {
    // 01 — HERO
    hero: {
        eyebrow: 'ELIOR / NATURAL STONES',
        title: 'Designed Around Your Vision.',
        supportingLine:
            'Material guidance for architects, designers and spaces shaped with intention.',
        marker: 'ARCHITECT & DESIGNER SERVICES',
        cta: 'START A MATERIAL CONVERSATION',
        ctaHref: '/contact',
    },

    // 02 — INTRODUCTION
    intro: {
        headline: 'Good Architecture Begins With the Right Material.',
        paragraph1:
            'Stone influences more than a surface. Its colour, scale, movement, texture and finish can change how a space is perceived.',
        paragraph2:
            'ELIOR supports architects and designers with material-focused guidance — helping explore possibilities, compare surfaces and identify materials that fit the intent of a space.',
    },

    // 03 — SIX SERVICE DISCIPLINES
    services: {
        heading: 'How We Support Your Process',
        subline:
            'Material expertise, considered around the needs of your project.',
        disciplines: [
            {
                index: '01',
                title: 'CONSULTATION',
                description:
                    'Discuss the material direction, visual intent and requirements of your space.',
            },
            {
                index: '02',
                title: 'DESIGN SUPPORT',
                description:
                    'Explore stone surfaces, finishes and visual possibilities alongside your design development.',
            },
            {
                index: '03',
                title: 'CUSTOM SOLUTIONS',
                description:
                    'Discuss material requirements where standard selections do not fully express the intended result.',
            },
            {
                index: '04',
                title: 'TECHNICAL ASSISTANCE',
                description:
                    'Review relevant material considerations, finish options and application context.',
            },
            {
                index: '05',
                title: 'PROJECT COLLABORATION',
                description:
                    'Work through material decisions as your project develops from concept toward execution.',
            },
            {
                index: '06',
                title: 'MATERIAL GUIDANCE',
                description:
                    'Compare colour, movement, texture, scale and finish to help identify an appropriate material direction.',
            },
        ] as ServiceDiscipline[],
    },

    // 04 — MATERIAL CONSULTATION
    consultation: {
        heading: '01 — Start With the Material.',
        subtitle: 'MATERIAL TRANSLATION',
        paragraph:
            'Every project begins with an intention. We help translate that intention into a material direction by looking at tone, scale, movement, texture, finish and the character of the space.',
        considerations: [
            'COLOUR',
            'MOVEMENT',
            'TEXTURE',
            'FINISH',
            'SCALE',
        ] as string[],
    },

    // 05 — DESIGN SUPPORT
    designSupport: {
        heading: '02 — See the Possibilities.',
        subtitle: 'CONTEXTUAL INTEGRATION',
        paragraph:
            'Material decisions become easier when the surface can be considered in context. Explore how stone behaves alongside architecture, light, proportion and neighbouring materials.',
        supportingStatement:
            'Material should support the design, not compete with it.',
    },

    // 06 — MATERIAL / APPLICATION GUIDANCE
    applications: {
        heading: '03 — Consider the Application.',
        subtitle: 'SPATIAL DISCERNMENT',
        categories: [
            {
                title: 'INTERIOR FLOORS',
                subtitle: 'Surface & Footfall Context',
                considerations: [
                    'Surface finish',
                    'Scale',
                    'Light',
                    'Maintenance context',
                ],
            },
            {
                title: 'WALL SURFACES',
                subtitle: 'Vertical Expression',
                considerations: [
                    'Slab movement',
                    'Visual continuity',
                    'Lighting',
                    'Surrounding materials',
                ],
            },
            {
                title: 'KITCHEN / WORK SURFACES',
                subtitle: 'Functional Planes',
                considerations: [
                    'Finish',
                    'Edge treatment',
                    'Visual movement',
                    'Intended use',
                ],
            },
            {
                title: 'EXTERIOR / LANDSCAPE',
                subtitle: 'Climatic Harmony',
                considerations: [
                    'Surface character',
                    'Environment',
                    'Weather exposure',
                    'Intended application',
                ],
            },
        ] as ApplicationCategory[],
    },

    // 07 — PROJECT COLLABORATION
    collaboration: {
        heading: '04 — Stay Close to the Material.',
        subtitle: 'CONTINUOUS DIALOGUE',
        paragraph:
            'As a project develops, material decisions often become more specific. ELIOR can remain part of the conversation as selections are refined and the relationship between material and architecture becomes clearer.',
        progression: [
            { stage: '01', title: 'CONCEPT' },
            { stage: '02', title: 'MATERIAL DIRECTION' },
            { stage: '03', title: 'SELECTION' },
            { stage: '04', title: 'REFINEMENT' },
            { stage: '05', title: 'ARCHITECTURAL SPACE' },
        ],
    },

    // 08 — THE MATERIAL SELECTION PROCESS
    selectionProcess: {
        heading: 'A More Considered Selection.',
        subline:
            'A five-step framework designed to align materiality with architectural intent.',
        steps: [
            {
                step: '01',
                title: 'UNDERSTAND',
                description:
                    'Understand the space, design intent and application.',
            },
            {
                step: '02',
                title: 'EXPLORE',
                description:
                    'Explore relevant collections and material directions.',
            },
            {
                step: '03',
                title: 'COMPARE',
                description:
                    'Compare colour, movement, texture, scale and finish.',
            },
            {
                step: '04',
                title: 'REFINE',
                description:
                    'Narrow the material direction according to the design.',
            },
            {
                step: '05',
                title: 'SELECT',
                description: 'Arrive at a considered material choice.',
            },
        ] as SelectionStep[],
    },

    // 09 — PROFESSIONAL ENQUIRY
    enquiry: {
        headline: 'Working on a Project?',
        supportingCopy:
            'Tell us about the space, material direction or design challenge you are considering.',
        ctaPrimary: 'BEGIN A CONVERSATION',
        ctaPrimaryHref: '/contact',
        ctaSecondary: 'EXPLORE COLLECTIONS',
        ctaSecondaryHref: '/collections',
    },

    // 10 — CLOSING STATEMENT
    closing: {
        headline: 'Material Becomes Architecture.',
        signature: 'ELIOR NATURAL STONES',
        cta: 'EXPLORE COLLECTIONS',
        ctaHref: '/collections',
    },
} as const;
