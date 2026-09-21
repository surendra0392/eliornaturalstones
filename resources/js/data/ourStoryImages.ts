/**
 * ELIOR Natural Stones — Our Story Photography Registry
 *
 * Centralized, editorial photographic assets adhering strictly to:
 * - Monumental natural stone architecture and quiet luxury
 * - Authentic quarry material and precision processing
 * - Zero stock office scenes, zero warehouse clutter, zero people
 * - Engineered quartz strictly represented by large monolithic slabs
 */

export const OUR_STORY_IMAGES = {
    // 01 — STORY HERO: Monumental natural stone architecture with warm light
    hero: {
        src: '/images/elior/story/story-hero.webp',
        alt: 'Monumental contemporary natural stone architecture illuminated by warm natural light',
    },

    // 02 — OPENING STATEMENT: Raw stone block / quarry material
    opening: {
        src: '/images/elior/story/story-opening.webp',
        alt: 'Monumental raw stone block extraction at quarry source showing ancient geological layers',
    },

    // 03 — THE JOURNEY / TIMELINE: 4 Period Supporting Visuals
    timeline: {
        '1990': {
            src: '/images/elior/story/story-timeline-1990.webp',
            alt: 'Monumental raw natural stone block reserves from early trading operations',
        },
        '2017': {
            src: '/images/elior/story/story-timeline-2017.webp',
            alt: 'Precision honed stone edge detail revealing dimensional tolerance and mineral integrity',
        },
        '2024': {
            src: '/images/elior/story/story-timeline-2024.webp',
            alt: 'Expansive monolithic engineered quartz slab island in contemporary architectural residence',
        },
        today: {
            src: '/images/elior/story/story-timeline-today.webp',
            alt: 'Flagship ELIOR natural stone installation in a serene architectural space',
        },
    },

    // 04 — FROM TRADITION TO PRECISION: 4-Stage Visual Progression
    traditionPrecision: {
        stage1: {
            src: '/images/elior/story/story-stage-1-extraction.webp',
            alt: 'Extraction of monumental raw stone blocks at quarry origin',
        },
        stage2: {
            src: '/images/elior/story/story-stage-2-calibration.webp',
            alt: 'High-precision diamond saw block calibration and dimensional slicing',
        },
        stage3: {
            src: '/images/elior/story/story-stage-3-finishing.webp',
            alt: 'Artisanal honing and surface finishing revealing natural mineral veining',
        },
        stage4: {
            src: '/images/elior/story/story-stage-4-installation.webp',
            alt: 'Finished architectural installation with bookmatched stone surfaces',
        },
    },

    // 06 — THE ELIOR PHILOSOPHY: Monumental stone architectural surface
    philosophy: {
        src: '/images/elior/story/story-philosophy.webp',
        alt: 'Expansive natural stone wall with deep geological character and tranquil ambient lighting',
    },

    // 07 — TODAY / LOOKING FORWARD: Contemporary architectural space
    lookingForward: {
        src: '/images/elior/story/story-looking-forward.webp',
        alt: 'Contemporary architectural residence integrating refined natural stone and minimalist design',
    },

    // 08 — FINAL BRAND STATEMENT: Atmospheric architectural installation
    closing: {
        src: '/images/elior/story/story-closing.webp',
        alt: 'Enduring natural stone architectural residence standing serene in natural light',
    },
} as const;
