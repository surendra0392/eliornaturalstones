/**
 * ELIOR Natural Stones — Curated Collection Detail Photography & Editorial Registry
 *
 * Centralized data and photography registry for the 9 canonical collection showcases:
 * - Italian Marble (italian-marble)
 * - Granites (granites)
 * - Slate Stone (slate-stone)
 * - Limestones (limestones)
 * - Sand Stone (sandstone)
 * - Cobble Stones (cobble-stones)
 * - Pebbles (pebbles)
 * - Quartz (quartz — strictly large engineered slabs, broad continuous veining, NO crystals)
 * - Sculptures (sculptures — carved natural stone sculptures, architectural gallery setting)
 *
 * All imagery adheres strictly to ELIOR standards:
 * - High-efficiency CDN parameters (auto=format&fit=crop&q=85)
 * - Minimal, architectural, editorial compositions
 * - Zero generic showroom or commodity warehouse imagery
 */

export interface ApplicationItem {
    name: string;
    description: string;
    image: {
        src: string;
        alt: string;
    };
}

export interface GuidanceItem {
    title: string;
    description: string;
}

export interface CharacteristicItem {
    title: string;
    description: string;
}

export interface CollectionEditorialData {
    descriptor: string;
    index: string;
    heroImage: {
        src: string;
        alt: string;
    };
    intro: {
        statement: string;
        paragraphs: string[];
        image: {
            src: string;
            alt: string;
        };
    };
    characteristics: CharacteristicItem[];
    applications: ApplicationItem[];
    guidance: GuidanceItem[];
    varietyFallbacks: Record<string, { src: string; alt: string }>;
}

export const COLLECTION_DETAIL_REGISTRY: Record<
    string,
    CollectionEditorialData
> = {
    'italian-marble': {
        descriptor: 'Timeless expression in natural stone.',
        index: '01',
        heroImage: {
            src: '/images/elior/collections/italian-marble/hero.webp',
            alt: 'Monumental Italian marble interior wall with luminous natural veining',
        },
        intro: {
            statement:
                'Defined by depth, movement and variation, Italian marble brings a sense of permanence to interiors. Its veining can move quietly across a surface or become the defining gesture of a space.',
            paragraphs: [
                'Formed over millions of years through intense geological pressure and mineral crystallization, each slab of Italian marble tells a distinct chronological story.',
                'The interaction of light with crystalline calcite gives the material a luminous, semi-translucent quality that synthetic substitutes cannot replicate.',
                'Whether honed to an understated matte texture or polished to reflect ambient daylight, Italian marble adapts effortlessly from grand classical architecture to refined contemporary minimalism.',
            ],
            image: {
                src: '/images/elior/collections/italian-marble/intro.webp',
                alt: 'Tactile study of bookmatched Italian marble slab veining',
            },
        },
        characteristics: [
            {
                title: 'Distinctive Veining',
                description:
                    'Natural mineral ribbons flowing organically through crystalline calcite structures.',
            },
            {
                title: 'Refined Surface',
                description:
                    'Available in honed, polished, or brushed treatments to complement tactile ambitions.',
            },
            {
                title: 'Natural Variation',
                description:
                    'No two slabs share identical veining patterns, guaranteeing unique spatial character.',
            },
            {
                title: 'Architectural Elegance',
                description:
                    'Celebrated across centuries of classical and modernist monumental buildings.',
            },
        ],
        applications: [
            {
                name: 'Expansive Flooring',
                description:
                    'Continuous vein-matched slabs creating uninterrupted visual rhythm across living pavilions.',
                image: {
                    src: '/images/elior/collections/italian-marble/app-flooring.webp',
                    alt: 'Light-drenched architectural living space with marble flooring',
                },
            },
            {
                name: 'Feature Walls',
                description:
                    'Bookmatched vertical installations creating monumental focal planes in formal spaces.',
                image: {
                    src: '/images/elior/collections/italian-marble/app-feature-walls.webp',
                    alt: 'Monolithic stone feature wall in contemporary residential gallery',
                },
            },
            {
                name: 'Sanctuary Bathrooms',
                description:
                    'Full-slab shower walls and carved monolithic basins delivering quiet, spa-like stillness.',
                image: {
                    src: '/images/elior/collections/italian-marble/app-bathrooms.webp',
                    alt: 'Minimalist luxury bathroom framed by bookmatched marble slabs',
                },
            },
            {
                name: 'Bespoke Joinery',
                description:
                    'Floating vanity tops, hearth surrounds, and custom architectural credenza surfaces.',
                image: {
                    src: '/images/elior/collections/italian-marble/app-joinery.webp',
                    alt: 'Architectural fireplace hearth and bespoke marble credenza',
                },
            },
        ],
        guidance: [
            {
                title: 'Surface Finish Selection',
                description:
                    'Honed surfaces soften reflections and mask minor micro-abrasions in high-traffic zones, while high-polish enhances crystalline depth.',
            },
            {
                title: 'Bookmatch Planning',
                description:
                    'Consecutive slabs sliced from the same block should be digitally previewed to ensure vein orientation harmonizes with room proportions.',
            },
            {
                title: 'Lighting Interaction',
                description:
                    'Raking indirect daylight illuminates subtle mineral shifts, while warm grazing lighting accents directional vein flow.',
            },
            {
                title: 'Care & Maintenance',
                description:
                    'Natural marble benefits from breathable penetrating sealers and pH-neutral cleansing to preserve its organic patina over time.',
            },
        ],
        varietyFallbacks: {
            'sugar-beige': {
                src: '/images/elior/collections/italian-marble/variety-sugar-beige.webp',
                alt: 'Sugar Beige marble slab with fine spiderweb calcite veins',
            },
            'ottoman-beige': {
                src: '/images/elior/collections/italian-marble/variety-ottoman-beige.webp',
                alt: 'Ottoman Beige marble slab with parallel linear sedimentary strata',
            },
            'ottaman-beige': {
                src: '/images/elior/collections/italian-marble/variety-ottoman-beige.webp',
                alt: 'Ottoman Beige marble slab with parallel linear sedimentary strata',
            },
            'dyna-beige': {
                src: '/images/elior/collections/italian-marble/variety-dyna-beige.webp',
                alt: 'Dyna Beige marble slab with creamy foundation and delicate crystalline clouds',
            },
            'crema-nuova': {
                src: '/images/elior/collections/italian-marble/variety-crema-nuova.webp',
                alt: 'Crema Nuova marble slab with warm cream tone and organic brecciated texture',
            },
            'satuario': {
                src: '/images/elior/collections/italian-marble/variety-satuario.webp',
                alt: 'Satuario white marble slab with bold dramatic grey veining',
            },
            'statuario': {
                src: '/images/elior/collections/italian-marble/variety-satuario.webp',
                alt: 'Satuario white marble slab with bold dramatic grey veining',
            },
            'statuario-extra': {
                src: '/images/elior/collections/italian-marble/variety-satuario.webp',
                alt: 'Satuario white marble slab with bold dramatic grey veining',
            },
            'platino-grey': {
                src: '/images/elior/collections/italian-marble/variety-platino-grey.webp',
                alt: 'Platino Grey architectural marble with silver-grey ground and delicate graphite veining',
            },
            'mocha-crema-leather': {
                src: '/images/elior/collections/italian-marble/variety-mocha-crema-leather.webp',
                alt: 'Mocha Crema Leather marble with rich mocha tones and tactile leathered patina',
            },
            'vietnam-white': {
                src: '/images/elior/collections/italian-marble/variety-vietnam-white.webp',
                alt: 'Vietnam White crystalline marble with luminous monolithic purity',
            },
            'botochino': {
                src: '/images/elior/collections/italian-marble/variety-botochino.webp',
                alt: 'Botochino compact marble with warm ivory ground and golden-hazel micro-veining',
            },
            'botticino': {
                src: '/images/elior/collections/italian-marble/variety-botochino.webp',
                alt: 'Botochino compact marble with warm ivory ground and golden-hazel micro-veining',
            },
        },
    },

    granites: {
        descriptor: 'Mineral strength shaped by nature.',
        index: '02',
        heroImage: {
            src: '/images/elior/collections/granites/hero.webp',
            alt: 'Honed dark architectural granite monolith in contemporary setting',
        },
        intro: {
            statement:
                'Born from tectonic cooling deep within the earth, architectural granite pairs monumental density with intricate crystalline texture, creating surfaces of quiet resilience.',
            paragraphs: [
                'Granite is composed primarily of interlocking quartz, feldspar, and mica minerals, forming a material uniquely capable of withstanding heavy daily use and harsh exterior climates.',
                'Its visual presence is marked by a deep, grounded stillness. Rather than dramatic directional veins, granite reveals depth through multidirectional crystalline layers that reward close inspection.',
                'From flamed non-slip terraces to leathered kitchen surfaces, granite provides an uncompromising material baseline for architects designing spaces for generations.',
            ],
            image: {
                src: '/images/elior/collections/granites/intro.webp',
                alt: 'Raw granite extraction and geological stratification',
            },
        },
        characteristics: [
            {
                title: 'Mineral Character',
                description:
                    'Dense interlocking quartz, feldspar, and mica crystalline matrices.',
            },
            {
                title: 'Strong Visual Depth',
                description:
                    'Subtle crystalline reflections that respond dynamically to shifting ambient light.',
            },
            {
                title: 'Natural Variation',
                description:
                    'Organic shifts in grain size, mineral concentration, and background saturation.',
            },
            {
                title: 'Interior & Exterior Potential',
                description:
                    'Remarkable durability suitable for high-traffic public floors as well as bespoke interiors.',
            },
        ],
        applications: [
            {
                name: 'High-Performance Kitchens',
                description:
                    'Resilient worktops and island surrounds impervious to hot pans and acidic exposure.',
                image: {
                    src: '/images/elior/collections/granites/app-worksurfaces.webp',
                    alt: 'Architectural kitchen with dark honed stone worktops',
                },
            },
            {
                name: 'Monolithic Facades',
                description:
                    'Ventilated rainscreens and rusticated base plinths grounding buildings in geological permanence.',
                image: {
                    src: '/images/elior/collections/granites/app-facades.webp',
                    alt: 'Contemporary residence with stone-clad facade',
                },
            },
            {
                name: 'Commercial Flooring',
                description:
                    'High-compressive stone slabs designed for airports, corporate headquarters, and civic halls.',
                image: {
                    src: '/images/elior/collections/granites/app-demanding-floors.webp',
                    alt: 'Spacious architectural atrium with honed stone floor',
                },
            },
            {
                name: 'Landscape Monoliths',
                description:
                    'Solid carved steps, retaining plinths, and outdoor seating blocks connecting architecture to site.',
                image: {
                    src: '/images/elior/collections/granites/app-monolithic-furniture.webp',
                    alt: 'Outdoor architectural stone terrace and landscaping',
                },
            },
        ],
        guidance: [
            {
                title: 'Finish Considerations',
                description:
                    'Leathered finishes impart a rich tactile softness that reduces glare, while flamed finishes deliver high slip resistance for exterior thresholds.',
            },
            {
                title: 'Tonal Consistency',
                description:
                    'Large expanses benefit from selecting slabs from identical quarry extractions to maintain cohesive background depth.',
            },
            {
                title: 'Joint Detailing',
                description:
                    'Minimal 2mm shadowline or tight chamfered joints celebrate the monolithic scale of precision-cut granite blocks.',
            },
            {
                title: 'Long-Term Endurance',
                description:
                    'Granite retains its structural integrity indefinitely with periodic cleaning and minimal surface upkeep.',
            },
        ],
        varietyFallbacks: {
            'black-galaxy-granite': {
                src: '/images/elior/collections/granites/variety-black-galaxy.webp',
                alt: 'Black Galaxy granite surface with bronzite specks',
            },
            'black-galaxy': {
                src: '/images/elior/collections/granites/variety-black-galaxy.webp',
                alt: 'Black Galaxy granite surface with bronzite specks',
            },
            'steel-grey': {
                src: '/images/elior/collections/granites/variety-steel-grey.webp',
                alt: 'Steel Grey granite slab with fine crystalline grain',
            },
            'tan-brown': {
                src: '/images/elior/collections/granites/variety-tan-brown.webp',
                alt: 'Tan Brown granite slab with chocolate and amber crystals',
            },
            'absolute-black': {
                src: '/images/elior/collections/granites/variety-absolute-black.webp',
                alt: 'Absolute Black monolithic dense granite slab',
            },
            'chima-pink-granite': {
                src: '/images/elior/collections/granites/variety-chima-pink-granite.webp',
                alt: 'Chima Pink granite slab with rosy-pink feldspar crystals',
            },
            'colonial-white': {
                src: '/images/elior/collections/granites/variety-colonial-white.webp',
                alt: 'Colonial White granite slab with garnet specks',
            },
            'burgundy-white': {
                src: '/images/elior/collections/granites/variety-burgundy-white.webp',
                alt: 'Burgundy White granite slab with deep burgundy mineral currents',
            },
            'apple-green': {
                src: '/images/elior/collections/granites/variety-apple-green.webp',
                alt: 'Apple Green granite slab with sage-green mineral tones',
            },
            'parda-gold': {
                src: '/images/elior/collections/granites/variety-parda-gold.webp',
                alt: 'Parda Gold granite slab with golden-ochre undulating waves',
            },
            'river-white': {
                src: '/images/elior/collections/granites/variety-river-white.webp',
                alt: 'River White granite slab with linear silver-grey currents',
            },
            'nadol-grey': {
                src: '/images/elior/collections/granites/variety-nadol-grey.webp',
                alt: 'Nadol Grey granite slab with balanced uniform salt-and-pepper grain',
            },
            'viscon-white': {
                src: '/images/elior/collections/granites/variety-viscon-white.webp',
                alt: 'Viscon White granite with flowing silver and charcoal waves',
            },
            'silk-brown': {
                src: '/images/elior/collections/granites/variety-silk-brown.webp',
                alt: 'Silk Brown granite slab with soft mocha and bronze tones',
            },
            'alaska-white': {
                src: '/images/elior/collections/granites/variety-alaska-white.webp',
                alt: 'Alaska White granite slab with frosty feldspar and onyx patches',
            },
            'white-granite': {
                src: '/images/elior/collections/granites/variety-white-granite.webp',
                alt: 'White Granite architectural slab with refined crystalline flecks',
            },
            'foreign-black': {
                src: '/images/elior/collections/granites/variety-foreign-black.webp',
                alt: 'Foreign Black exotic deep-black granite with metallic crystalline flecks',
            },
        },
    },

    'slate-stone': {
        descriptor: 'Layered character. Quiet permanence.',
        index: '03',
        heroImage: {
            src: '/images/elior/collections/slate-stone/hero.webp',
            alt: 'Layered natural cleft slate stone surface with dark charcoal organic texture',
        },
        intro: {
            statement:
                'Formed by the metamorphic compression of fine sedimentary clay, slate displays organic cleavage planes that introduce tactile shadow relief and natural earth tones.',
            paragraphs: [
                'The distinctive foliation of slate allows it to split naturally along cleavage lines, producing a textured surface that catches and scatters directional light.',
                'Its muted palette—spanning deep charcoal, graphite, copper, and subtle sage—creates an immediate dialogue with surrounding landscape and raw timber elements.',
                'Slate is naturally low in porosity, making it exceptionally resilient against freeze-thaw cycles, moisture exposure, and outdoor weathering.',
            ],
            image: {
                src: '/images/elior/collections/slate-stone/intro.webp',
                alt: 'Close-up of naturally cleaved dark slate stone layers',
            },
        },
        characteristics: [
            {
                title: 'Layered Texture',
                description:
                    'Natural split-face surface with organic riven relief and shadow depth.',
            },
            {
                title: 'Natural Cleavage',
                description:
                    'Metamorphic foliation that splits along fine planar mineral layers.',
            },
            {
                title: 'Earth-Led Colour',
                description:
                    'Rich muted hues of charcoal, oxidized copper, plum, and warm graphite.',
            },
            {
                title: 'Architectural Versatility',
                description:
                    'Seamlessly transitions from interior wet areas to exterior rainscreen cladding.',
            },
        ],
        applications: [
            {
                name: 'Exterior Cladding',
                description:
                    'Raked natural cleft wall tiles that cast changing architectural shadows throughout the day.',
                image: {
                    src: '/images/elior/collections/slate-stone/app-accent-walls.webp',
                    alt: 'Architectural stone wall cladding in modern pavilion',
                },
            },
            {
                name: 'Terrace & Pool Paving',
                description:
                    'Naturally textured non-slip flagstones providing secure tactile footing around water.',
                image: {
                    src: '/images/elior/collections/slate-stone/app-floors.webp',
                    alt: 'Stone pool surround and outdoor terrace paving',
                },
            },
            {
                name: 'Interior Feature Walls',
                description:
                    'Textural backdrop for minimalist fireplaces, entry foyers, and living galleries.',
                image: {
                    src: '/images/elior/collections/slate-stone/app-water-features.webp',
                    alt: 'Dark slate fireplace feature wall in contemporary interior',
                },
            },
            {
                name: 'Landscape Retaining Walls',
                description:
                    'Dry-stacked or coursed stone walls that nestle modern architecture into topography.',
                image: {
                    src: '/images/elior/collections/slate-stone/app-hearth-cladding.webp',
                    alt: 'Natural stone retaining wall integrated into landscape',
                },
            },
        ],
        guidance: [
            {
                title: 'Cleavage Plane Variation',
                description:
                    'Natural cleft finishes exhibit thickness variations of 2–4mm; dry-lay grouping ensures smooth transitions across surfaces.',
            },
            {
                title: 'Substrate Preparation',
                description:
                    'Rigid substrates with compatible flexible mortars allow natural metamorphic stones to breathe without shear strain.',
            },
            {
                title: 'Moisture Interaction',
                description:
                    'Slate deepens in saturation when wet, creating dynamic visual changes across rainy exterior courtyards.',
            },
            {
                title: 'Low Chemical Sensitivity',
                description:
                    'Slate demonstrates remarkable resistance to acids, requiring only clean water washing to maintain its natural state.',
            },
        ],
        varietyFallbacks: {
            'black-slate': {
                src: '/images/elior/collections/slate-stone/variety-black-slate.webp',
                alt: 'Black Slate natural cleft surface with authentic riven texture',
            },
            'black-rustic': {
                src: '/images/elior/collections/slate-stone/variety-black-rustic.webp',
                alt: 'Black Rustic slate slab with organic iron-oxide rust markings',
            },
            'indian-autumn': {
                src: '/images/elior/collections/slate-stone/variety-indian-autumn.webp',
                alt: 'Indian Autumn slate slab with warm autumnal earthy tones',
            },
            'gold-rustic': {
                src: '/images/elior/collections/slate-stone/variety-gold-rustic.webp',
                alt: 'Gold Rustic slate slab with golden ochre and weathered markings',
            },
            'california-gold': {
                src: '/images/elior/collections/slate-stone/variety-california-gold.webp',
                alt: 'California Gold exotic multi-tonal slate slab with bronze accents',
            },
            'sp-autumn': {
                src: '/images/elior/collections/slate-stone/variety-sp-autumn.webp',
                alt: 'SP Autumn slate with intense warm amber and terracotta waves',
            },
            'multi-colour': {
                src: '/images/elior/collections/slate-stone/variety-multi-colour.webp',
                alt: 'Multi Colour natural slate slab with polychromatic earthy mosaic',
            },
            'grey-slate': {
                src: '/images/elior/collections/slate-stone/variety-grey-slate.webp',
                alt: 'Grey Slate slab with fine laminar foliation and neutral grey tone',
            },
            'chocolate': {
                src: '/images/elior/collections/slate-stone/variety-chocolate.webp',
                alt: 'Chocolate slate slab with uniform rich cocoa and mocha tones',
            },
            'm-green': {
                src: '/images/elior/collections/slate-stone/variety-m-green.webp',
                alt: 'M Green slate slab with deep olive and forest green layers',
            },
            'n-green': {
                src: '/images/elior/collections/slate-stone/variety-n-green.webp',
                alt: 'N Green slate slab with tranquil sage and jade green minerals',
            },
            's-white': {
                src: '/images/elior/collections/slate-stone/variety-s-white.webp',
                alt: 'S White luminous silver-white micaceous quartzite slate slab',
            },
            'black-buching': {
                src: '/images/elior/collections/slate-stone/variety-black-buching.webp',
                alt: 'Black Buching architectural split-face chiseled wall cladding slate',
            },
            'n-green-buching': {
                src: '/images/elior/collections/slate-stone/variety-n-green-buching.webp',
                alt: 'N Green Buching hand-chiseled textured split face cladding slate',
            },
            'lime-green-buching': {
                src: '/images/elior/collections/slate-stone/variety-lime-green-buching.webp',
                alt: 'Lime Green Buching radiant pale lime chiseled split slate',
            },
            'lime-pink-buching': {
                src: '/images/elior/collections/slate-stone/variety-lime-pink-buching.webp',
                alt: 'Lime Pink Buching artistic blush-pink and lime chiseled split slate',
            },
        },
    },

    limestones: {
        descriptor: 'Natural warmth. Architectural simplicity.',
        index: '04',
        heroImage: {
            src: '/images/elior/collections/limestones/hero.webp',
            alt: 'Warm honed limestone flooring in light-drenched architectural interior',
        },
        intro: {
            statement:
                'Quiet, tactile and soothing to the senses, limestone embodies ancient sedimentary calm. Its muted palettes of warm cream, sand, and pale grey create tranquil spaces bathed in soft light.',
            paragraphs: [
                'Formed primarily of calcium carbonate deposits from ancient coral beds and sea basins, limestone captures geological history in delicate shell impressions and subtle tonal drifts.',
                'Unlike highly reflective crystalline stones, limestone absorbs and diffuses daylight gently, eliminating glare and imparting an understated warmth to large spatial volumes.',
                'Its soft tactile touch underfoot makes it the primary material choice for Mediterranean, coastal, and serene modernist residences worldwide.',
            ],
            image: {
                src: '/images/elior/collections/limestones/intro.webp',
                alt: 'Tactile limestone floor and wall surfaces in sunlit villa',
            },
        },
        characteristics: [
            {
                title: 'Soft Mineral Character',
                description:
                    'Gentle calcium carbonate compositions with organic micro-fossils.',
            },
            {
                title: 'Warm Tones',
                description:
                    'Calming palettes of honey, sand, pale taupe, and steel blue-grey.',
            },
            {
                title: 'Tactile Surfaces',
                description:
                    'Velvet-honed, brushed, or antique finishes that feel soft underfoot.',
            },
            {
                title: 'Timeless Architecture',
                description:
                    'Historic foundation of classical temples and contemporary sanctuary villas.',
            },
        ],
        applications: [
            {
                name: 'Seamless Living Floors',
                description:
                    'Large-format honed tiles flowing seamlessly from interior salons to covered loggias.',
                image: {
                    src: '/images/elior/collections/limestones/app-spatial-flooring.webp',
                    alt: 'Expansive honed limestone floor in light-drenched villa',
                },
            },
            {
                name: 'Internal Wall Cladding',
                description:
                    'Subtle monolithic wall surfaces that soften acoustic reverberation and ambient lighting.',
                image: {
                    src: '/images/elior/collections/limestones/app-courtyards.webp',
                    alt: 'Limestone wall cladding framing floor-to-ceiling windows',
                },
            },
            {
                name: 'Wellness & Bathrooms',
                description:
                    'Textural honed vanity slabs and zero-threshold shower basins delivering tranquil warmth.',
                image: {
                    src: '/images/elior/collections/limestones/app-wall-cladding.webp',
                    alt: 'Honed limestone bathroom with warm natural light',
                },
            },
            {
                name: 'Pool Coping & Terraces',
                description:
                    'Comfortable barefoot flagstones that remain cool beneath direct summer sunlight.',
                image: {
                    src: '/images/elior/collections/limestones/app-pool-surrounds.webp',
                    alt: 'Limestone terrace and pool coping surrounding water feature',
                },
            },
        ],
        guidance: [
            {
                title: 'Thermal Performance',
                description:
                    'Limestone naturally absorbs ambient warmth without overheating, making it an ideal thermal conductor for underfloor heating or sun-facing terraces.',
            },
            {
                title: 'Grout Color Harmonization',
                description:
                    'Matching mortar to the stone’s undertone creates a unified monolithic plane across large open floors.',
            },
            {
                title: 'Fossil Distribution',
                description:
                    'Sedimentary stones feature scattered prehistoric inclusions; blending tiles across multiple pallets achieves balanced visual harmony.',
            },
            {
                title: 'Protective Sealing',
                description:
                    'Breathable penetrating impregnators preserve breathability while shielding calcium structures from everyday stains.',
            },
        ],
        varietyFallbacks: {
            'kadapa-black-polish': {
                src: '/images/elior/collections/limestones/variety-kadapa-black-polish.webp',
                alt: 'Kadapa Black Polish limestone with deep obsidian mirror finish',
            },
            'kadapa-black-honed-finish': {
                src: '/images/elior/collections/limestones/variety-kadapa-black-honed-finish.webp',
                alt: 'Kadapa Black Honed Finish limestone with smooth matte velvet texture',
            },
            'kadapa-black-rough': {
                src: '/images/elior/collections/limestones/variety-kadapa-black-rough.webp',
                alt: 'Kadapa Black Rough limestone with natural cleft split-face profile',
            },
            'kadapa-black-flaming': {
                src: '/images/elior/collections/limestones/variety-kadapa-black-flaming.webp',
                alt: 'Kadapa Black Flaming limestone with thermal-treated micro-textured surface',
            },
            'tandur-blue-rough': {
                src: '/images/elior/collections/limestones/variety-tandur-blue-rough.webp',
                alt: 'Tandur Blue Rough limestone with natural riven steel blue-grey texture',
            },
            'tandur-blue-polish': {
                src: '/images/elior/collections/limestones/variety-tandur-blue-polish.webp',
                alt: 'Tandur Blue Polish limestone with oceanic slate-blue sheen',
            },
            'tandur-blue-leather': {
                src: '/images/elior/collections/limestones/variety-tandur-blue-leather.webp',
                alt: 'Tandur Blue Leather limestone with silky undulating antique finish',
            },
            'tandur-blue-satin-finish': {
                src: '/images/elior/collections/limestones/variety-tandur-blue-satin-finish.webp',
                alt: 'Tandur Blue Satin Finish limestone with non-glare velvet reflection',
            },
            'tandur-yellow-rough': {
                src: '/images/elior/collections/limestones/variety-tandur-yellow-rough.webp',
                alt: 'Tandur Yellow Rough limestone with warm golden-ochre cleft face',
            },
            'tandur-yellow-leather': {
                src: '/images/elior/collections/limestones/variety-tandur-yellow-leather.webp',
                alt: 'Tandur Yellow Leather limestone with antique honey-gold tactile patina',
            },
            'kurnool-grey-polish': {
                src: '/images/elior/collections/limestones/variety-kurnool-grey-polish.webp',
                alt: 'Kurnool Grey Polish limestone with luminous silver-grey crystalline clarity',
            },
            'kurnool-grey-satin-finish': {
                src: '/images/elior/collections/limestones/variety-kurnool-grey-satin-finish.webp',
                alt: 'Kurnool Grey Satin Finish limestone with soft diffused smoke-grey surface',
            },
        },
    },

    sandstone: {
        descriptor: 'Warm sedimentary grain and tactile permanence.',
        index: '05',
        heroImage: {
            src: '/images/elior/collections/sandstone/hero.webp',
            alt: 'Monumental contemporary residence featuring golden buff Sand Stone facade and reflection terrace',
        },
        intro: {
            statement:
                'Formed through geological eons of quartz sand deposition and natural compression, Sand Stone brings earthy warmth, subtle linear banding, and reassuring tactile permanence to architectural landscapes.',
            paragraphs: [
                'Layered across millions of years, natural sandstone carries visible sedimentary striations that record ancient river currents, winds, and mineral tides.',
                'Its naturally fine, gritty cleft surface offers remarkable slip resistance under wet conditions and remains comfortably cool beneath direct sunlight, making it the supreme choice for open terraces and pool surroundings.',
                'From the uniform golden warmth of Dholpur Beige to the captivating concentric waves of Rainbow and the organic grain of Teakwood, Sand Stone connects modern architecture intimately with the raw geological earth.',
            ],
            image: {
                src: '/images/elior/collections/sandstone/intro.webp',
                alt: 'Macro material study of natural cleft sandstone revealing sedimentary quartz layers',
            },
        },
        characteristics: [
            {
                title: 'Sedimentary Strata',
                description:
                    'Natural mineral stratification and fine-grained quartz beds that diffuse harsh sunlight into ambient warmth.',
            },
            {
                title: 'Thermal & Tactile Comfort',
                description:
                    'Naturally heat-dissipating and slip-resistant underfoot, providing comfort in high-sun outdoor living zones.',
            },
            {
                title: 'Earthy Color Spectrum',
                description:
                    'Rich palettes ranging from desert buff and warm ochre to variegated plum and timber-like swirls.',
            },
            {
                title: 'Exterior Resilience',
                description:
                    'Time-tested endurance against freeze-thaw cycles, monsoon rainfall, and decades of outdoor weathering.',
            },
        ],
        applications: [
            {
                name: 'Exterior Terraces & Pool Surrounds',
                description:
                    'Large-format honed and cleft sandstone pavers creating seamless transitions from internal living to open-air pools.',
                image: {
                    src: '/images/elior/collections/sandstone/app-exterior-terraces.webp',
                    alt: 'Luxury architectural exterior terrace and pool surround paved in warm natural sandstone slabs',
                },
            },
            {
                name: 'Courtyard Facades & Cladding',
                description:
                    'Rainscreen wall panels and monumental vertical stone slabs introducing textured rhythm and depth to internal courtyards.',
                image: {
                    src: '/images/elior/collections/sandstone/app-courtyard-facades.webp',
                    alt: 'Contemporary internal courtyard featuring monumental sandstone wall cladding and reflection pool',
                },
            },
        ],
        guidance: [
            {
                title: 'Sub-base Drainage',
                description:
                    'External sandstone paving must be installed on a permeable mortar bed with adequate cross-fall falls (1:60 minimum) to facilitate rapid rainwater runoff.',
            },
            {
                title: 'Penetrating Silane Impregnation',
                description:
                    'Applying a breathable penetrating sealer protects sedimentary quartz pores against organic staining while allowing the stone to breathe naturally.',
            },
            {
                title: 'Expansion Joint Alignment',
                description:
                    'Design continuous expansion joints in large outdoor terraces matching concrete sub-slabs to absorb seasonal thermal movement gracefully.',
            },
            {
                title: 'Natural Patina Evolution',
                description:
                    'Sandstone matures organically outdoors; gentle periodic pressure washing preserves the original cleft texture and mineral vibrancy.',
            },
        ],
        varietyFallbacks: {
            'dholpur-beige-sandstone': {
                src: '/images/elior/collections/sandstone/variety-dholpur-beige-sandstone.webp',
                alt: 'Dholpur Beige Sandstone with uniform buff-beige tone and subtle cleft texture',
            },
            'rainbow-sandstone': {
                src: '/images/elior/collections/sandstone/variety-rainbow-sandstone.webp',
                alt: 'Rainbow Sandstone with dramatic concentric sedimentary waves and earth striations',
            },
            'teakwood-sandstone': {
                src: '/images/elior/collections/sandstone/variety-teakwood-sandstone.webp',
                alt: 'Teakwood Sandstone with distinctive natural wood-grain veining',
            },
            'mandana-stone': {
                src: '/images/elior/collections/sandstone/variety-mandana-stone.webp',
                alt: 'Mandana Stone with dense chocolate-red and plum quartzitic durability',
            },
        },
    },

    'sand-stone': {
        descriptor: 'Warm sedimentary grain and tactile permanence.',
        index: '05',
        heroImage: {
            src: '/images/elior/collections/sandstone/hero.webp',
            alt: 'Monumental contemporary residence featuring golden buff Sand Stone facade and reflection terrace',
        },
        intro: {
            statement:
                'Formed through geological eons of quartz sand deposition and natural compression, Sand Stone brings earthy warmth, subtle linear banding, and reassuring tactile permanence to architectural landscapes.',
            paragraphs: [
                'Layered across millions of years, natural sandstone carries visible sedimentary striations that record ancient river currents, winds, and mineral tides.',
                'Its naturally fine, gritty cleft surface offers remarkable slip resistance under wet conditions and remains comfortably cool beneath direct sunlight, making it the supreme choice for open terraces and pool surroundings.',
                'From the uniform golden warmth of Dholpur Beige to the captivating concentric waves of Rainbow and the organic grain of Teakwood, Sand Stone connects modern architecture intimately with the raw geological earth.',
            ],
            image: {
                src: '/images/elior/collections/sandstone/intro.webp',
                alt: 'Macro material study of natural cleft sandstone revealing sedimentary quartz layers',
            },
        },
        characteristics: [
            {
                title: 'Sedimentary Strata',
                description:
                    'Natural mineral stratification and fine-grained quartz beds that diffuse harsh sunlight into ambient warmth.',
            },
            {
                title: 'Thermal & Tactile Comfort',
                description:
                    'Naturally heat-dissipating and slip-resistant underfoot, providing comfort in high-sun outdoor living zones.',
            },
            {
                title: 'Earthy Color Spectrum',
                description:
                    'Rich palettes ranging from desert buff and warm ochre to variegated plum and timber-like swirls.',
            },
            {
                title: 'Exterior Resilience',
                description:
                    'Time-tested endurance against freeze-thaw cycles, monsoon rainfall, and decades of outdoor weathering.',
            },
        ],
        applications: [
            {
                name: 'Exterior Terraces & Pool Surrounds',
                description:
                    'Large-format honed and cleft sandstone pavers creating seamless transitions from internal living to open-air pools.',
                image: {
                    src: '/images/elior/collections/sandstone/app-exterior-terraces.webp',
                    alt: 'Luxury architectural exterior terrace and pool surround paved in warm natural sandstone slabs',
                },
            },
            {
                name: 'Courtyard Facades & Cladding',
                description:
                    'Rainscreen wall panels and monumental vertical stone slabs introducing textured rhythm and depth to internal courtyards.',
                image: {
                    src: '/images/elior/collections/sandstone/app-courtyard-facades.webp',
                    alt: 'Contemporary internal courtyard featuring monumental sandstone wall cladding and reflection pool',
                },
            },
        ],
        guidance: [
            {
                title: 'Sub-base Drainage',
                description:
                    'External sandstone paving must be installed on a permeable mortar bed with adequate cross-fall falls (1:60 minimum) to facilitate rapid rainwater runoff.',
            },
            {
                title: 'Penetrating Silane Impregnation',
                description:
                    'Applying a breathable penetrating sealer protects sedimentary quartz pores against organic staining while allowing the stone to breathe naturally.',
            },
            {
                title: 'Expansion Joint Alignment',
                description:
                    'Design continuous expansion joints in large outdoor terraces matching concrete sub-slabs to absorb seasonal thermal movement gracefully.',
            },
            {
                title: 'Natural Patina Evolution',
                description:
                    'Sandstone matures organically outdoors; gentle periodic pressure washing preserves the original cleft texture and mineral vibrancy.',
            },
        ],
        varietyFallbacks: {
            'dholpur-beige-sandstone': {
                src: '/images/elior/collections/sandstone/variety-dholpur-beige-sandstone.webp',
                alt: 'Dholpur Beige Sandstone with uniform buff-beige tone and subtle cleft texture',
            },
            'rainbow-sandstone': {
                src: '/images/elior/collections/sandstone/variety-rainbow-sandstone.webp',
                alt: 'Rainbow Sandstone with dramatic concentric sedimentary waves and earth striations',
            },
            'teakwood-sandstone': {
                src: '/images/elior/collections/sandstone/variety-teakwood-sandstone.webp',
                alt: 'Teakwood Sandstone with distinctive natural wood-grain veining',
            },
            'mandana-stone': {
                src: '/images/elior/collections/sandstone/variety-mandana-stone.webp',
                alt: 'Mandana Stone with dense chocolate-red and plum quartzitic durability',
            },
        },
    },

    'cobble-stones': {
        descriptor: 'Enduring texture for considered landscapes.',
        index: '06',
        heroImage: {
            src: '/images/elior/collections/cobble-stones/hero.webp',
            alt: 'Hand-hewn natural granite cobble stone courtyard promenade with distinct stone blocks',
        },
        intro: {
            statement:
                'Grounding architecture in permanence, hand-hewn cobble stones transform pedestrian avenues, courtyards, and driveways into enduring landscape works.',
            paragraphs: [
                'Historically utilized to pave ancient Roman highways and Renaissance city squares, cobbles celebrate the integrity of individual stone blocks laid with rhythm.',
                'Their split-face top textures offer natural traction for both vehicular and pedestrian traffic, aging gracefully under decades of footfall and weather.',
                'Arranged in fans, arcs, herringbone, or linear courses, cobble stones introduce scale and ancestral craftsmanship to modern landscape architecture.',
            ],
            image: {
                src: '/images/elior/collections/cobble-stones/intro.webp',
                alt: 'Cobblestone courtyard pathway bordered by architecture',
            },
        },
        characteristics: [
            {
                title: 'Individual Stone Character',
                description:
                    'Each block is hand-hewn, offering unique dimensional variation and artisanal texture.',
            },
            {
                title: 'Textural Surface',
                description:
                    'Natural split or tumbled faces deliver dependable traction in all seasons.',
            },
            {
                title: 'Landscape Versatility',
                description:
                    'Adapts effortlessly to curves, elevation transitions, and grand carriageways.',
            },
            {
                title: 'Enduring Visual Appeal',
                description:
                    'Develops a deep, rich patina with decades of use and weather exposure.',
            },
        ],
        applications: [
            {
                name: 'Private Driveways',
                description:
                    'Load-bearing avenues paved with granite or basalt cobbles that endure generations of vehicular traffic.',
                image: {
                    src: '/images/elior/collections/cobble-stones/app-courtyards.webp',
                    alt: 'Cobblestone driveway paving with authentic stone blocks',
                },
            },
            {
                name: 'Architectural Courtyards',
                description:
                    'Central gravel and stone courtyards that ground private residences in historic permanence.',
                image: {
                    src: '/images/elior/collections/cobble-stones/app-promenades.webp',
                    alt: 'Architectural courtyard paved with natural stone',
                },
            },
            {
                name: 'Garden Promenades',
                description:
                    'Meandering stone walkways woven through structured hedges and landscape borders.',
                image: {
                    src: '/images/elior/collections/cobble-stones/app-transitional-terraces.webp',
                    alt: 'Garden promenade with natural stone borders',
                },
            },
            {
                name: 'Threshold Transitions',
                description:
                    'Artisan stone apron transitions delineating property boundaries and entry portals.',
                image: {
                    src: '/images/elior/collections/cobble-stones/app-civic-plazas.webp',
                    alt: 'Stone entry threshold of contemporary estate',
                },
            },
        ],
        guidance: [
            {
                title: 'Sub-Base Compaction',
                description:
                    'A well-drained, compacted aggregate base prevents settling and ensures long-term load bearing for vehicular cobble courses.',
            },
            {
                title: 'Joint Infill Options',
                description:
                    'Permeable stone dust joints permit natural rainwater infiltration, whereas polymeric or resin mortars lock stones into a rigid monolithic surface.',
            },
            {
                title: 'Pattern Selection',
                description:
                    'Segmental arcs and fish-scale patterns absorb multidirectional vehicular braking loads more effectively than linear bonds.',
            },
            {
                title: 'Maintenance Simplicity',
                description:
                    'Cobblestones require virtually zero ongoing maintenance, easily cleaned with seasonal pressure washing.',
            },
        ],
        varietyFallbacks: {
            'white-granite-cobble-handcut': {
                src: '/images/elior/collections/cobble-stones/variety-white-granite-cobble-handcut.webp',
                alt: 'White Granite Cobble Handcut with natural split cleft texture',
            },
            'black-granite-cobble-handcut': {
                src: '/images/elior/collections/cobble-stones/variety-black-granite-cobble-handcut.webp',
                alt: 'Black Granite Cobble Handcut with deep charcoal natural cleft face',
            },
            'yellow-granite-cobble-handcut': {
                src: '/images/elior/collections/cobble-stones/variety-yellow-granite-cobble-handcut.webp',
                alt: 'Yellow Granite Cobble Handcut with warm honey-amber mineral tones',
            },
            'pink-granite-cobble-handcut': {
                src: '/images/elior/collections/cobble-stones/variety-pink-granite-cobble-handcut.webp',
                alt: 'Pink Granite Cobble Handcut with crystalline rose feldspar matrix',
            },
            'white-granite-cobble-1inch-machine-cut': {
                src: '/images/elior/collections/cobble-stones/variety-white-granite-cobble-1inch-machine-cut.webp',
                alt: 'White Granite Cobble 1inch Machine Cut with precision calibrated edges',
            },
            'black-granite-cobbles-1inch-machine-cut': {
                src: '/images/elior/collections/cobble-stones/variety-black-granite-cobbles-1inch-machine-cut.webp',
                alt: 'Black Granite Cobbles 1inch Machine Cut with sharp linear profiles',
            },
            'black-granite-1inch-machine-cut-flaming': {
                src: '/images/elior/collections/cobble-stones/variety-black-granite-1inch-machine-cut-flaming.webp',
                alt: 'Black Granite 1inch Machine Cut Flaming with thermal-treated slip-resistant surface',
            },
            'white-1inch-machine-cut-flaming': {
                src: '/images/elior/collections/cobble-stones/variety-white-1inch-machine-cut-flaming.webp',
                alt: 'White 1inch Machine Cut Flaming with textured non-slip frost white face',
            },
            'black-granite-full-box-cut-flaming': {
                src: '/images/elior/collections/cobble-stones/variety-black-granite-full-box-cut-flaming.webp',
                alt: 'Black Granite Full Box Cut Flaming with 6-sided precision sawn geometry',
            },
            'white-granite-full-box-cut-flaming': {
                src: '/images/elior/collections/cobble-stones/variety-white-granite-full-box-cut-flaming.webp',
                alt: 'White Granite Full Box Cut Flaming with engineered dimensional accuracy',
            },
            'black-granite-1inch-machine-cut-bush-hammered': {
                src: '/images/elior/collections/cobble-stones/variety-black-granite-1inch-machine-cut-bush-hammered.webp',
                alt: 'Black Granite 1inch Machine Cut Bush Hammered with uniform stippled grip texture',
            },
            'lime-black-cobbles-handcut': {
                src: '/images/elior/collections/cobble-stones/variety-lime-black-cobbles-handcut.webp',
                alt: 'Lime Black Cobbles Handcut with authentic limestone cleft relief',
            },
        },
    },

    pebbles: {
        descriptor: 'Small forms. Natural rhythm.',
        index: '07',
        heroImage: {
            src: '/images/elior/collections/pebbles/hero.webp',
            alt: 'Selected water-smoothed natural river pebbles in contemplative landscape installation',
        },
        intro: {
            statement:
                'Sculpted by millennia of river currents and ocean tides, natural pebbles introduce organic geometry, tactile resonance, and meditative stillness to modern spaces.',
            paragraphs: [
                'Each pebble represents a mineral fragment rounded and polished by friction against sand and water, yielding smooth, satisfying contours.',
                'Their soft multi-tonal palettes create natural transitions between architectural slabs and living plant forms, preventing harsh visual boundaries.',
                'Submerged in reflection pools or dry-laid in zen gardens, pebbles respond dynamically to water and light, deepening in saturation when damp.',
            ],
            image: {
                src: '/images/elior/collections/pebbles/intro.webp',
                alt: 'Detailed view of water-smoothed colorful river pebbles',
            },
        },
        characteristics: [
            {
                title: 'Rounded Natural Forms',
                description:
                    'Fluvial tumbled contours shaped over centuries of natural water action.',
            },
            {
                title: 'Organic Colour Variation',
                description:
                    'Subtle gradations from snow white and amber to deep obsidian black.',
            },
            {
                title: 'Landscape Versatility',
                description:
                    'Flexible groundcover conforming effortlessly to freeform contours and root zones.',
            },
            {
                title: 'Water & Garden Applications',
                description:
                    'Harmonizes water elements, zen courtyards, and lightwell installations.',
            },
        ],
        applications: [
            {
                name: 'Reflection Pools',
                description:
                    'Submerged dark pebble floors that amplify surface reflections and create liquid stillness.',
                image: {
                    src: '/images/elior/collections/pebbles/app-water-basins.webp',
                    alt: 'Water feature with smooth stone pebble bed',
                },
            },
            {
                name: 'Interior Lightwells',
                description:
                    'Draped pebble beds beneath interior bamboo planters and architectural open staircases.',
                image: {
                    src: '/images/elior/collections/pebbles/app-zen-gardens.webp',
                    alt: 'Architectural interior garden with natural stone pebbles',
                },
            },
            {
                name: 'Zen Courtyards',
                description:
                    'Contemplative raked gravel and pebble zones framing solitary architectural monoliths.',
                image: {
                    src: '/images/elior/collections/pebbles/app-planters.webp',
                    alt: 'Minimalist landscape courtyard with river pebbles',
                },
            },
            {
                name: 'Tree Basin Mulch',
                description:
                    'Permeable, elegant inorganic groundcover conserving soil moisture while maintaining clean borders.',
                image: {
                    src: '/images/elior/collections/pebbles/app-groundcover.webp',
                    alt: 'Landscape tree basin dressed in river pebbles',
                },
            },
        ],
        guidance: [
            {
                title: 'Grading & Sizing',
                description:
                    'Selecting calibrated size bands (20–40mm vs 50–80mm) dictates the visual density and walking comfort of loose pebble installations.',
            },
            {
                title: 'Landscape Geotextile',
                description:
                    'Underlaying woven geotextile fabric prevents pebble migration into sub-soils and suppresses weed growth without blocking rainwater drainage.',
            },
            {
                title: 'Water Saturation Depth',
                description:
                    'Pebbles reveal their richest mineral tones when submerged; edge detailing should accommodate water level fluctuations.',
            },
            {
                title: 'Containment Edging',
                description:
                    'Recessed steel or stone perimeter headers maintain crisp, clean boundaries between turf and pebble beds.',
            },
        ],
        varietyFallbacks: {
            'snow-white-river-pebbles': {
                src: '/images/elior/collections/pebbles/variety-snow-white-river-pebbles.webp',
                alt: 'Snow White River Pebbles with smooth crystalline contours',
            },
            'black-polished-pebbles': {
                src: '/images/elior/collections/pebbles/variety-black-polished-pebbles.webp',
                alt: 'Black Polished Pebbles with obsidian satin sheen',
            },
            'mixed-natural-river-pebbles': {
                src: '/images/elior/collections/pebbles/variety-mixed-natural-river-pebbles.webp',
                alt: 'Mixed Natural River Pebbles with variegated earth tones',
            },
            'onyx-amber-pebbles': {
                src: '/images/elior/collections/pebbles/variety-onyx-amber-pebbles.webp',
                alt: 'Onyx Amber Pebbles with warm translucent honey glow',
            },
        },
    },

    quartz: {
        descriptor: 'Engineered surfaces with architectural clarity.',
        index: '08',
        heroImage: {
            // STRICT REQUIREMENT: Large engineered quartz slab waterfall island, NO crystals, NO people
            src: '/images/elior/collections/quartz/hero.webp',
            alt: 'Monolithic engineered quartz waterfall island in luxury architectural kitchen',
        },
        intro: {
            statement:
                'Engineered quartz combines pure natural mineral aggregates with high-performance polymers, producing expansive, non-porous architectural slabs with continuous marble-inspired veining.',
            paragraphs: [
                'Through precision vacuum-compaction technology, natural quartz granules are bound into solid, monolithic slabs that resist scratching, staining, and liquid absorption.',
                'Our quartz collections faithfully reproduce the broad, organic flow of noble Italian marbles, allowing architects to specify continuous veining across expansive kitchen waterfall islands without maintenance anxiety.',
                'The result is an architectural surface engineered for immaculate performance in high-use contemporary residences, corporate hospitality suites, and commercial environments.',
            ],
            image: {
                src: '/images/elior/collections/quartz/intro.webp',
                alt: 'Broad veining detail on monolithic engineered quartz slab countertop',
            },
        },
        characteristics: [
            {
                title: 'Consistent Engineered Surface',
                description:
                    'Strict slab-to-slab color calibration and uniform structural integrity throughout.',
            },
            {
                title: 'Marble-Inspired Designs',
                description:
                    'Cascading broad veining patterns evoking Carrara and Calacatta nobility.',
            },
            {
                title: 'Broad Visual Continuity',
                description:
                    'Expansive slab dimensions permitting seamless waterfall returns and continuous islands.',
            },
            {
                title: 'Contemporary Applications',
                description:
                    'Non-porous hygienic surfaces tailored for discerning culinary and hospitality spaces.',
            },
        ],
        applications: [
            {
                name: 'Waterfall Kitchen Islands',
                description:
                    'Expansive seamless monolithic centerpieces where slab veining turns mitred 90-degree corners.',
                image: {
                    src: '/images/elior/collections/quartz/app-island-monoliths.webp',
                    alt: 'Waterfall kitchen island featuring large quartz slab surface',
                },
            },
            {
                name: 'Culinary Worktops',
                description:
                    'Ultra-hygienic preparation counters completely impervious to oils, acids, and wine spills.',
                image: {
                    src: '/images/elior/collections/quartz/app-backsplashes.webp',
                    alt: 'Architectural kitchen worktop in marble-look quartz slab',
                },
            },
            {
                name: 'Full-Height Backsplashes',
                description:
                    'Floor-to-ceiling vertical slab installations eliminating grout joints behind cooktops.',
                image: {
                    src: '/images/elior/collections/quartz/app-vanity-tops.webp',
                    alt: 'Monolithic quartz slab backsplash in minimalist kitchen',
                },
            },
            {
                name: 'Hospitality Bar Tops',
                description:
                    'High-wear continuous counter surfaces in luxury hotel lounges and private tasting rooms.',
                image: {
                    src: '/images/elior/collections/quartz/app-hospitality.webp',
                    alt: 'Hospitality stone bar counter in refined architectural venue',
                },
            },
        ],
        guidance: [
            {
                title: 'Thermal Safeguards',
                description:
                    'While highly resilient, using trivets beneath high-temperature cookware preserves resin polymers against thermal shock.',
            },
            {
                title: 'Mitred Edge Detailing',
                description:
                    'Precision 45-degree mitred waterfall aprons create the visual illusion of solid 50mm–100mm monolithic stone blocks.',
            },
            {
                title: 'Interior Specification Only',
                description:
                    'Engineered quartz is calibrated for interior residential and commercial climate environments away from direct exterior UV radiation.',
            },
            {
                title: 'Zero-Seal Care',
                description:
                    'Unlike natural sedimentary stones, non-porous engineered quartz never requires resealing or specialized waxes.',
            },
        ],
        varietyFallbacks: {
            'calacatta-nuvo-quartz': {
                src: '/images/elior/collections/quartz/variety-calacatta-nuvo-quartz.webp',
                alt: 'Calacatta Nuvo engineered quartz slab with cascading grey veins',
            },
            'statuario-classic-quartz': {
                src: '/images/elior/collections/quartz/variety-statuario-classic-quartz.webp',
                alt: 'Statuario Classic engineered quartz slab with flowing graphite veining',
            },
            'eternal-charcoal-quartz': {
                src: '/images/elior/collections/quartz/variety-eternal-charcoal-quartz.webp',
                alt: 'Eternal Charcoal engineered quartz slab with luminous white veins',
            },
            'pure-blanco-quartz': {
                src: '/images/elior/collections/quartz/variety-pure-blanco-quartz.webp',
                alt: 'Pure Blanco engineered quartz slab with pristine monochromatic clarity',
            },
        },
    },

    sculptures: {
        descriptor: 'Stone shaped into lasting form.',
        index: '09',
        heroImage: {
            // STRICT REQUIREMENT: Hand-carved marble sculpture, architectural gallery presentation
            src: '/images/elior/collections/sculptures/hero.webp',
            alt: 'Classical carved marble sculpture figures in architectural gallery setting',
        },
        intro: {
            statement:
                'Where geological materiality meets human craftsmanship, architectural stone sculptures transform inert blocks into tactile vessels, monumental plinths, and bespoke art anchors.',
            paragraphs: [
                'Carved by master artisans utilizing diamond saws, pneumatic chisels, and hand-rubbed abrasives, our sculptures celebrate the inherent grain and weight of solid stone.',
                'Each piece is sculpted from a single extraction block, revealing natural mineral inclusions, crystal pockets, and geological stratification as the form emerges.',
                'Positioned in courtyards, entrance galleries, or private gardens, these monolithic objects introduce permanence, stillness, and tactile dignity to spatial compositions.',
            ],
            image: {
                src: '/images/elior/collections/sculptures/intro.webp',
                alt: 'Artisan hand-carved stone sculpture detail and texture',
            },
        },
        characteristics: [
            {
                title: 'Hand-Finished Character',
                description:
                    'Artisan chisel marks, honed planes, and bush-hammered reliefs crafted by hand.',
            },
            {
                title: 'Three-Dimensional Form',
                description:
                    'Monolithic mass carved from solid quarry blocks rather than assembled panels.',
            },
            {
                title: 'Natural Stone Expression',
                description:
                    'Showcases the raw mineral strata, crystalline inclusions, and weight of noble stone.',
            },
            {
                title: 'Architectural Presence',
                description:
                    'Serves as an enduring focal anchor for grand interior rotundas and outdoor grounds.',
            },
        ],
        applications: [
            {
                name: 'Sculptural Courtyards',
                description:
                    'Monumental outdoor plinths and carved basalt vessels grounding central reflection courtyards.',
                image: {
                    src: '/images/elior/collections/sculptures/app-courtyard-centerpieces.webp',
                    alt: 'Architectural courtyard featuring stone sculpture anchor',
                },
            },
            {
                name: 'Grand Entrance Foyers',
                description:
                    'Carved marble totems and pedestal forms creating immediate arrival prestige.',
                image: {
                    src: '/images/elior/collections/sculptures/app-vestibule-statements.webp',
                    alt: 'Classical marble sculptures anchoring grand gallery foyer',
                },
            },
            {
                name: 'Hospitality Rotundas',
                description:
                    'Bespoke carved stone water basins and monoliths defining luxury hotel lobbies.',
                image: {
                    src: '/images/elior/collections/sculptures/app-water-interactive.webp',
                    alt: 'Monolithic stone focal feature in contemporary architectural lobby',
                },
            },
            {
                name: 'Private Art Sanctuaries',
                description:
                    'Intimate carved stone vessels and tactile pedestals curated for discerning private collectors.',
                image: {
                    src: '/images/elior/collections/sculptures/app-pedestal-commissions.webp',
                    alt: 'Private living gallery featuring curated natural stone artwork',
                },
            },
        ],
        guidance: [
            {
                title: 'Structural Load Planning',
                description:
                    'Solid monolithic stone forms require verified slab engineering to support concentrated floor loads exceeding 500kg.',
            },
            {
                title: 'Directional Lighting',
                description:
                    'Grazing spotlights positioned at 30-degree angles cast dynamic shadow relief across carved chiseled contours.',
            },
            {
                title: 'Weathering & Patina',
                description:
                    'Outdoor sculptures develop a soft organic patina with rainwater exposure; annual gentle washing preserves textural details.',
            },
            {
                title: 'Rigging & Placement',
                description:
                    'Heavy stone plinths are delivered in reinforced timber cradles and placed using padded nylon hoisting slings.',
            },
        ],
        varietyFallbacks: {
            'monolithic-carved-basin': {
                src: '/images/elior/collections/sculptures/variety-monolithic-carved-basin.webp',
                alt: 'Monolithic Carved Basin carved from solid natural stone',
            },
            'architectural-stone-totem': {
                src: '/images/elior/collections/sculptures/variety-architectural-stone-totem.webp',
                alt: 'Architectural Stone Totem with fine geometric reliefs',
            },
            'fluted-classical-pedestal': {
                src: '/images/elior/collections/sculptures/variety-fluted-classical-pedestal.webp',
                alt: 'Fluted Classical Pedestal hand-carved in noble stone',
            },
            'contemplative-stone-vessel': {
                src: '/images/elior/collections/sculptures/variety-contemplative-stone-vessel.webp',
                alt: 'Contemplative Stone Vessel carved from dense basalt',
            },
        },
    },
};
