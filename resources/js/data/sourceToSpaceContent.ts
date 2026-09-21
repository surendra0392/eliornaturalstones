/**
 * ELIOR Natural Stones — From Source to Space Editorial Content
 *
 * All content strictly follows defensible, restrained architectural language.
 * Zero unsupported operational claims, quarry ownership claims,
 * proprietary technology assertions, or unverified logistics statistics.
 */

export interface JourneyStage {
    index: string;
    title: string;
    description: string;
    slug: string;
}

export interface SelectionAttribute {
    title: string;
    description: string;
}

export const SOURCE_TO_SPACE_CONTENT = {
    // 01 — HERO
    hero: {
        eyebrow: 'ELIOR / NATURAL STONES',
        title: 'From Source to Space',
        supportingLine:
            'Every material has a journey. We follow it from its origin to the spaces it helps define.',
        marker: 'MATERIAL JOURNEY',
    },

    // 02 — INTRODUCTION
    intro: {
        headline: 'From Material to Meaning.',
        paragraph1: 'Stone begins with geology. Architecture gives it purpose.',
        paragraph2:
            'Between the two lies a sequence of decisions — how material is selected, processed, inspected, protected and ultimately brought into a space.',
        paragraph3:
            'At ELIOR, the journey matters because the material matters.',
    },

    // 03 — THE SIX-STAGE JOURNEY
    journey: {
        heading: 'The Journey',
        subline: 'Six stages. One continuous relationship with material.',
        stages: [
            {
                index: '01',
                title: 'QUARRIES',
                description: 'Understanding where material begins.',
                slug: 'quarries',
            },
            {
                index: '02',
                title: 'PROCESSING',
                description:
                    'Revealing the character of the stone through considered processing.',
                slug: 'processing',
            },
            {
                index: '03',
                title: 'SELECTION',
                description:
                    'Choosing surfaces for colour, movement, texture and intended application.',
                slug: 'selection',
            },
            {
                index: '04',
                title: 'PACKAGING',
                description:
                    'Protecting the material through careful preparation for movement.',
                slug: 'packaging',
            },
            {
                index: '05',
                title: 'WORLDWIDE',
                description:
                    'Moving selected material toward its intended destination.',
                slug: 'worldwide',
            },
            {
                index: '06',
                title: 'INSPIRING SPACES',
                description: 'Where material becomes architecture.',
                slug: 'spaces',
            },
        ] as JourneyStage[],
    },

    // 04 — SOURCE / QUARRY
    source: {
        stageIndex: '01',
        heading: '01 — Where Stone Begins',
        subtitle: 'GEOLOGICAL ORIGIN',
        paragraph1:
            'Every stone begins with a geological story shaped long before it reaches architecture.',
        paragraph2:
            'At source, variation is part of the material — colour, grain, structure and natural movement are never completely identical.',
    },

    // 05 — PROCESSING / PRECISION
    processing: {
        stageIndex: '02',
        heading: '02 — Precision Reveals Character',
        subtitle: 'DIMENSIONAL CALIBRATION & FINISHING',
        paragraph1:
            'Processing transforms raw material into surfaces that can be understood, selected and used within architecture.',
        paragraph2:
            'Cut, finish and surface treatment influence how light moves across the stone and how its natural character is experienced.',
    },

    // 06 — SELECTION / CURATION
    selection: {
        stageIndex: '03',
        heading: '03 — Selection Is Part of the Design',
        subtitle: 'CURATORIAL DISCERNMENT',
        paragraph1:
            'No two natural surfaces tell exactly the same story. Selection is therefore more than choosing a colour — it is understanding movement, scale, texture and how the material will belong to a space.',
        attributes: [
            {
                title: 'COLOUR',
                description:
                    'Natural mineral pigmentation reacting uniquely under ambient and direct light.',
            },
            {
                title: 'MOVEMENT',
                description:
                    'Directional flow, tectonic veining, and organic strata establishing spatial energy.',
            },
            {
                title: 'TEXTURE',
                description:
                    'Tactile engagement from smooth honed calmness to cleft and leathered depth.',
            },
            {
                title: 'SCALE',
                description:
                    'Continuous monolithic slabs and calibrated elements proportioned to architectural rhythm.',
            },
        ] as SelectionAttribute[],
    },

    // 07 — PACKAGING / PROTECTION
    packaging: {
        stageIndex: '04',
        heading: '04 — Protecting the Material',
        subtitle: 'PRESERVATION & INTEGRITY',
        paragraph1:
            'Once selected, material needs to be prepared carefully for its next stage.',
        paragraph2:
            'Protection, handling and preparation are part of preserving the surface from source to destination.',
    },

    // 08 — MOVEMENT / DELIVERY
    movement: {
        stageIndex: '05',
        heading: '05 — From One Place to Another',
        stageLabel: '05 — WORLDWIDE',
        subtitle: 'TRANSIT TOWARD DESTINATION',
        paragraph1:
            'Material moves because architecture moves. The journey continues from preparation toward the place where the stone will be used.',
    },

    // 09 — SPACE / ARCHITECTURE
    architecture: {
        stageIndex: '06',
        heading: '06 — Where Material Becomes Architecture',
        subtitle: 'SPATIAL FULFILLMENT',
        paragraph1:
            'At its destination, stone becomes more than a surface. It becomes part of the rhythm, proportion and identity of a space.',
        paragraph2:
            'From source to space, every decision contributes to the final experience.',
        cta: 'EXPLORE COLLECTIONS',
        ctaHref: '/collections',
    },

    // 10 — CLOSING STATEMENT
    closing: {
        headline: 'From Source.\nTo Space.\nTo Something Lasting.',
        signature: 'ELIOR NATURAL STONES',
        cta: 'BEGIN A CONVERSATION',
        ctaHref: '/contact',
    },
} as const;
