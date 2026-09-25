/**
 * ELIOR Natural Stones — Curated Architectural Photography Registry
 *
 * All photography strictly adheres to ELIOR visual direction:
 * - Monumental natural stone surfaces and refined contemporary architecture
 * - Controlled natural light, large openings, minimal furniture, no people
 * - Zero generic showroom or commodity warehouse imagery
 * - Engineered quartz surfaces depicted strictly as large slabs (NO crystals)
 * - Optimized with high-efficiency CDN parameters (WebP/AVIF, responsive sizing)
 */

export const HOMEPAGE_IMAGES = {
    // 01 — HERO: Monumental stone architecture, controlled light, reflecting stillness
    hero: {
        src: '/images/elior/homepage/homepage-hero.webp',
        alt: 'Monumental contemporary Indian luxury villa featuring bookmatched marble wall, Tandur limestone terrace, and reflection pool',
        focalPoint: { x: 50, y: 50 },
    },

    // 02 — BRAND POSITIONING: Quiet architectural texture & stone craftsmanship
    brandPositioning: {
        src: '/images/elior/homepage/homepage-brand-positioning.webp',
        alt: 'Refined architectural living space framed by natural stone walls and floor',
        focalPoint: { x: 50, y: 50 },
    },

    // 03 — COLLECTIONS: The 8 Canonical Reserves
    collections: {
        'italian-marble': {
            src: '/images/elior/collections/overview/collection-italian-marble.webp',
            alt: 'Monumental bookmatched white marble architectural feature wall with expressive charcoal veining',
        },
        marble: {
            src: '/images/elior/collections/overview/collection-italian-marble.webp',
            alt: 'Monumental bookmatched white marble architectural feature wall with expressive charcoal veining',
        },
        granites: {
            src: '/images/elior/collections/overview/collection-granites.webp',
            alt: 'Monumental waterfall kitchen island and backsplash crafted from exotic black and terracotta veined granite',
        },
        'slate-stone': {
            src: '/images/elior/collections/overview/collection-slate-stone.webp',
            alt: 'Monumental architectural feature wall clad in multi-color copper, golden amber, and silver-grey natural cleft slate stone panels',
        },
        limestones: {
            src: '/images/elior/collections/overview/collection-limestones.webp',
            alt: 'Expansive Tandur natural cleft-honed limestone flooring with warm olive-khaki and golden-sage tonal variation in architectural pavilion',
        },
        sandstone: {
            src: '/images/elior/collections/overview/collection-sandstone.webp',
            alt: 'Monumental architectural elevation of natural sandstone facade wall cladding and columns with reflection pools',
        },
        'sand-stone': {
            src: '/images/elior/collections/overview/collection-sandstone.webp',
            alt: 'Monumental architectural elevation of natural sandstone facade wall cladding and columns with reflection pools',
        },
        'cobble-stones': {
            src: '/images/elior/collections/overview/collection-cobble-stones.webp',
            alt: 'Hand-hewn natural cobble stone courtyard promenade',
        },
        pebbles: {
            src: '/images/elior/collections/overview/collection-pebbles.webp',
            alt: 'Multi-color natural river pebbles as decorative groundcover in a garden bed with Japanese maple alongside a paved stone walkway',
        },
        quartz: {
            // STRICT REQUIREMENT: Large engineered quartz slab surfaces, NOT small quartz crystals, NO people
            src: '/images/elior/collections/overview/collection-quartz.webp',
            alt: 'Seamless monolithic engineered quartz slab island in high-end architectural kitchen',
        },
        sculptures: {
            src: '/images/elior/collections/overview/collection-sculptures.webp',
            alt: 'Hand-carved natural stone Buddha sculpture seated in meditation on ornamental plinth within architectural reflection pool courtyard',
        },
    } as Record<string, { src: string; alt: string }>,

    // 04 — MATERIAL PHILOSOPHY: Macro detail, slab veining, textural tactile study
    materialPhilosophy: {
        primary: {
            src: '/images/elior/homepage/homepage-material-philosophy-primary.webp',
            alt: 'Tactile macro study of dramatic natural stone veining and crystalline depth',
        },
        detail: {
            src: '/images/elior/homepage/homepage-material-philosophy-detail.webp',
            alt: 'Architectural stone edge detail and honed surface texture',
        },
    },

    // 05 — HERITAGE: Industrial/quarry legacy paired with contemporary architecture
    heritage: {
        quarry: {
            src: '/images/elior/homepage/homepage-heritage-quarry.jpg',
            alt: 'Monumental raw stone block extraction at Indian quarry origin',
        },
        modern: {
            src: '/images/elior/homepage/homepage-heritage-modern.webp',
            alt: 'Contemporary stone-clad residence reflecting timeless lineage',
        },
    },

    // 06 — SIGNATURE MATERIAL MOMENT: Dramatic visual pause, full-width monolithic stone
    signatureMoment: {
        src: '/images/elior/homepage/homepage-signature-moment.webp',
        alt: 'Monolithic floor-to-ceiling architectural stone surface bathed in natural light',
    },

    // 07 — FROM SOURCE TO SPACE: 6-Stage Journey
    sourceToSpace: [
        {
            stage: '01',
            title: 'Quarries',
            description:
                'Carefully identified geological formations and noble mineral reserves across India.',
            src: '/images/elior/source-to-space/source-to-space-01-quarries.jpg',
        },
        {
            stage: '02',
            title: 'Processing',
            description:
                'Precision diamond saw calibration, block slicing, and artisan surface treatment.',
            src: '/images/elior/source-to-space/source-to-space-02-processing.jpg',
        },
        {
            stage: '03',
            title: 'Selection',
            description:
                'Rigorous visual grading, tone pairing, and vein-matching for architectural harmony.',
            src: '/images/elior/source-to-space/source-to-space-03-selection.jpg',
        },
        {
            stage: '04',
            title: 'Packaging',
            description:
                'Bespoke timber framing, moisture barriers, and shock-cushioned slab crating.',
            src: '/images/elior/source-to-space/source-to-space-04-packaging.jpg',
        },
        {
            stage: '05',
            title: 'All Over India',
            description:
                'Reliable freight logistics delivering intact monumental slabs to project sites across India.',
            src: '/images/elior/source-to-space/source-to-space-05-pan-india.jpg',
        },
        {
            stage: '06',
            title: 'Inspiring Spaces',
            description:
                'Flawless dry-lay installation in discerning residential and commercial sanctums.',
            src: '/images/elior/source-to-space/source-to-space-06-spaces.jpg',
        },
    ],

    // 08 — ARCHITECT & DESIGNER SERVICES: 4 Service Disciplines
    architectServices: [
        {
            number: '01',
            title: 'Consultation',
            description:
                'One-on-one material discovery to align design ambitions with stone performance.',
            src: '/images/elior/architect-services/services-01-consultation.jpg',
        },
        {
            number: '02',
            title: 'Custom Solutions',
            description:
                'Bespoke cut-to-size stone components, monolithic basins, and sculpted profiles.',
            src: '/images/elior/architect-services/services-03-custom-solutions.jpg',
        },
        {
            number: '03',
            title: 'Project Collaboration',
            description:
                'Direct coordination with project architects, site engineers, and installation teams.',
            src: '/images/elior/architect-services/services-05-project-collaboration.jpg',
        },
        {
            number: '04',
            title: 'Material Guidance',
            description:
                'Care protocols, finish suitability matrix, and long-term patina management.',
            src: '/images/elior/architect-services/services-06-material-guidance.webp',
        },
    ],

    // 09 — FINAL BRAND STATEMENT: Full-width closing visual moment
    finalStatement: {
        src: '/images/elior/homepage/homepage-final-statement.webp',
        alt: 'Monumental natural stone architectural retreat in Udaipur overlooking tranquil waters and the Aravali hills at dusk',
    },
};
