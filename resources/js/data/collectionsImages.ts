/**
 * ELIOR Natural Stones — Curated Collections Overview Photography Registry
 *
 * All photography strictly adheres to ELIOR visual direction:
 * - Monumental natural stone surfaces and refined contemporary architecture
 * - Controlled natural light, large openings, minimal furniture, no people
 * - Zero generic showroom or commodity warehouse imagery
 * - Engineered quartz surfaces depicted strictly as large slabs (NO crystals)
 * - Optimized with high-efficiency CDN parameters (WebP/AVIF, responsive sizing)
 */

export const COLLECTIONS_IMAGES = {
    // 01 — HERO: Monumental stone architecture, controlled light, reflecting stillness
    hero: {
        src: '/images/elior/collections/overview/collections-hero.webp',
        alt: 'Monumental contemporary stone residence with serene architectural geometry',
        focalPoint: { x: 50, y: 50 },
    },

    // 02 — INTRO: Close material/slab veining detail plate
    intro: {
        src: '/images/elior/collections/overview/collections-intro.webp',
        alt: 'Tactile study of bookmatched natural stone veining and honed crystalline surface',
    },

    // 03 — THE 8 CANONICAL COLLECTIONS
    cards: {
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
            alt: 'Warm honed limestone flooring in light-drenched architectural interior',
        },
        sandstone: {
            src: '/images/elior/collections/overview/collection-sandstone.webp',
            alt: 'Natural sedimentary Sand Stone architectural wall cladding on contemporary pavilion facade',
        },
        'sand-stone': {
            src: '/images/elior/collections/overview/collection-sandstone.webp',
            alt: 'Natural sedimentary Sand Stone architectural wall cladding on contemporary pavilion facade',
        },
        'cobble-stones': {
            src: '/images/elior/collections/overview/collection-cobble-stones.webp',
            alt: 'Hand-hewn natural cobble stone courtyard promenade with distinct stone blocks',
        },
        pebbles: {
            src: '/images/elior/collections/overview/collection-pebbles.webp',
            alt: 'Selected water-smoothed natural river pebbles in contemplative landscape installation',
        },
        quartz: {
            // STRICT REQUIREMENT: Large engineered quartz slab surfaces, NOT small quartz crystals, NO people
            src: '/images/elior/collections/overview/collection-quartz.webp',
            alt: 'Seamless monolithic engineered quartz slab island in luxury architectural kitchen',
        },
        sculptures: {
            src: '/images/elior/collections/overview/collection-sculptures.webp',
            alt: 'Classical carved marble sculpture figures in architectural gallery setting',
        },
    } as Record<string, { src: string; alt: string }>,

    // 04 — CLOSING: Wide architectural stone closing visual
    closing: {
        src: '/images/elior/collections/overview/collections-closing.webp',
        alt: 'Expansive natural stone architectural installation bathed in ambient twilight',
    },
};
