<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    /**
     * Seed canonical editorial pages with authentic copy.
     */
    public function run(): void
    {
        $pages = [
            [
                'title' => 'Home',
                'slug' => 'home',
                'subtitle' => 'Natural stone for spaces that endure.',
                'excerpt' => 'Monumental architectural surfaces, quarry-selected reserves, and bespoke material curation for spaces of permanence and quiet refinement.',
                'meta_title' => 'ELIOR Natural Stones | Premium Natural Stone for Architecture',
                'meta_description' => 'ELIOR Natural Stones brings carefully selected natural stone materials to contemporary architecture, interiors and considered spaces.',
                'is_published' => true,
                'content' => [
                    'template' => 'home',
                    'hero' => [
                        'eyebrow' => 'ELIOR',
                        'marker' => 'Natural Stones',
                        'title' => 'Natural stone for spaces that endure.',
                        'secondaryLine' => 'Monumental architectural surfaces, quarry-selected reserves, and bespoke material curation for spaces of permanence and quiet refinement.',
                        'ctaPrimaryText' => 'EXPLORE COLLECTIONS',
                        'ctaPrimaryHref' => '/collections',
                        'ctaSecondaryText' => 'OUR STORY',
                        'ctaSecondaryHref' => '/our-story',
                        'image' => '/images/elior/homepage/homepage-hero.webp',
                        'imageAlt' => 'Monumental bookmatched Italian Marble in an architectural gallery pavilion',
                    ],
                    'brandPositioning' => [
                        'heading' => 'Permanent. Tactile. Distinct.',
                        'paragraph1' => 'Stone is not merely a surface finish; it is the geological weight and enduring character of architectural space.',
                        'paragraph2' => "At ELIOR, our philosophy is anchored in material reverence. From raw quarry block extraction to millimeter-precise calibrated slabbing, every step preserves the stone's organic soul.",
                    ],
                    'philosophy' => [
                        'headline' => 'Formed by Nature. Defined by Architecture.',
                        'supportingStatement' => 'Every block of stone carries an unrepeatable geological story, curated to bring enduring elegance and quiet luxury to spaces.',
                    ],
                    'closing' => [
                        'headline' => 'Spaces of Permanence.',
                        'subline' => 'Begin your material journey with ELIOR.',
                        'ctaText' => 'INQUIRE NOW',
                        'ctaHref' => '/contact',
                    ],
                ],
            ],
            [
                'title' => 'Our Collections',
                'slug' => 'collections',
                'subtitle' => 'Distinct materials. Considered for extraordinary spaces.',
                'excerpt' => 'Explore ELIOR Natural Stones collections — Italian Marble, Granites, Slate Stone, Limestones, Sand Stone, Cobble Stones, Pebbles, Quartz and Sculptures for considered architecture and interiors.',
                'meta_title' => 'ELIOR Natural Stones | Collections',
                'meta_description' => 'Explore ELIOR Natural Stones collections — Italian Marble, Granites, Slate Stone, Limestones, Sand Stone, Cobble Stones, Pebbles, Quartz and Sculptures for considered architecture and interiors.',
                'is_published' => true,
                'content' => [
                    'template' => 'collections',
                    'hero' => [
                        'eyebrow' => 'ELIOR',
                        'marker' => 'Natural Stones',
                        'title' => 'Our Collections',
                        'secondaryLine' => 'Distinct materials. Considered for extraordinary spaces.',
                        'image' => '/images/elior/collections/overview/collections-hero.webp',
                        'imageAlt' => 'Architectural natural stone slabs in curated gallery setting',
                    ],
                    'intro' => [
                        'headline' => 'Nine Natural Stone Expressions',
                        'paragraph1' => 'Each collection in the ELIOR archive represents a distinct geological character, aesthetic palette, and spatial purpose.',
                        'paragraph2' => "Carefully curated from the world's most distinguished quarries, our stones provide architects and designers with surfaces that endure.",
                    ],
                    'closing' => [
                        'headline' => 'Materiality Defined.',
                        'subline' => 'Need guidance selecting the right stone for your project?',
                        'ctaText' => 'SPEAK WITH A SPECIALIST',
                        'ctaHref' => '/contact',
                    ],
                ],
            ],
            [
                'title' => 'Our Story',
                'slug' => 'our-story',
                'subtitle' => 'From material to architecture, our story has always been shaped by stone.',
                'excerpt' => 'Discover the ELIOR Natural Stones story — a journey from natural stone trading and processing to a contemporary architectural material identity.',
                'meta_title' => 'ELIOR Natural Stones | Our Story',
                'meta_description' => 'Discover the ELIOR Natural Stones story — a journey from natural stone trading and processing to a contemporary architectural material identity.',
                'is_published' => true,
                'content' => [
                    'template' => 'our-story',
                    'hero' => [
                        'eyebrow' => 'ELIOR / NATURAL STONES',
                        'marker' => 'SINCE 1990',
                        'title' => 'A Legacy in Natural Stone',
                        'secondaryLine' => 'From material to architecture, our story has always been shaped by stone.',
                        'image' => '/images/elior/story/story-hero.webp',
                        'imageAlt' => 'Monumental architectural natural stone slab showcasing decades of geological formation',
                    ],
                    'opening' => [
                        'statement' => 'Three Decades. One Material.',
                        'paragraph1' => 'ELIOR is built on a long relationship with natural stone — from the movement of raw blocks to the precision of modern processing and the demands of contemporary architecture.',
                        'paragraph2' => 'Across every stage, the material remains the constant. What changes is how thoughtfully it is selected, processed and brought into space.',
                    ],
                    'timeline' => [
                        'heading' => 'A Legacy in Natural Stone',
                        'subline' => 'From 1990 to today.',
                        'milestones' => [
                            [
                                'index' => '01',
                                'year' => '1990',
                                'company' => 'SSS Enterprises',
                                'description' => 'Wholesale raw block slabs across Southern India.',
                                'badge' => 'TRADING FOUNDATION',
                            ],
                            [
                                'index' => '02',
                                'year' => '2017',
                                'company' => 'TEJ Natural Stones',
                                'description' => 'High-tech stone manufacturing, diamond saw processing and development toward exports.',
                                'badge' => 'PRECISION PROCESSING',
                            ],
                            [
                                'index' => '03',
                                'year' => '2024',
                                'company' => 'STONEX',
                                'description' => 'Premium quartz slab lines and expansion into engineered surfaces.',
                                'badge' => 'ENGINEERED SURFACES',
                            ],
                            [
                                'index' => '04',
                                'year' => 'TODAY',
                                'company' => 'ELIOR',
                                'description' => 'A new flagship identity focused on premium stone for contemporary architecture.',
                                'badge' => 'ARCHITECTURAL FLAGSHIP',
                            ],
                        ],
                    ],
                    'traditionPrecision' => [
                        'headline' => 'From Tradition to Precision.',
                        'paragraph1' => 'Natural stone has always demanded respect for its origin and variation. Over time, our role has evolved — from moving raw material to understanding how precision processing can reveal its architectural potential.',
                        'paragraph2' => 'Technology changed the process. The material remained the inspiration.',
                        'stages' => [
                            [
                                'index' => '01',
                                'title' => 'Raw Block Extraction',
                                'caption' => 'Evaluating natural geological integrity, density, and organic veining in monumental blocks.',
                            ],
                            [
                                'index' => '02',
                                'title' => 'Precision Diamond Slicing',
                                'caption' => 'Calibrated diamond gang saw cutting ensuring absolute dimensional accuracy across continuous slabs.',
                            ],
                            [
                                'index' => '03',
                                'title' => 'Tactile Surface Refinement',
                                'caption' => 'Artisanal honing, leathering, and polishing designed to reveal depth rather than mask the mineral face.',
                            ],
                            [
                                'index' => '04',
                                'title' => 'Architectural Realization',
                                'caption' => 'Slabs bookmatched and dry-laid for monumental contemporary residential and civic spaces.',
                            ],
                        ],
                    ],
                    'experience' => [
                        'heading' => 'What Experience Taught Us.',
                        'principles' => [
                            [
                                'numeral' => '01',
                                'title' => 'RESPECT THE MATERIAL',
                                'description' => 'Natural stone is never identical. Its variation is part of its character.',
                            ],
                            [
                                'numeral' => '02',
                                'title' => 'SELECT WITH INTENTION',
                                'description' => 'The right stone depends on the space, light, scale and surrounding materials.',
                            ],
                            [
                                'numeral' => '03',
                                'title' => 'PRECISION MATTERS',
                                'description' => 'Processing should reveal the material rather than overwhelm it.',
                            ],
                            [
                                'numeral' => '04',
                                'title' => 'DESIGN FOR TIME',
                                'description' => 'Good materials should continue to belong to a space long after trends have changed.',
                            ],
                        ],
                    ],
                    'philosophy' => [
                        'headline' => 'Formed by Nature. Defined by Architecture.',
                        'supportingStatement' => 'Every block of stone carries an unrepeatable geological story, curated to bring enduring elegance and quiet luxury to spaces.',
                        'secondaryCopy' => 'Colour, movement, texture, scale and light all contribute to how a material belongs within architecture.',
                    ],
                    'lookingForward' => [
                        'heading' => 'Looking Forward.',
                        'paragraph1' => 'ELIOR represents the next expression of our relationship with stone — bringing natural materials, engineered surfaces and architectural thinking together with a more considered approach to selection and design.',
                        'paragraph2' => 'From a single surface to an entire architectural language, the aim remains simple: choose materials that make spaces feel enduring.',
                    ],
                    'closing' => [
                        'headline' => "Natural stone.\nTimeless spaces.",
                        'signature' => 'ELIOR Natural Stones',
                        'cta' => 'EXPLORE COLLECTIONS',
                        'ctaHref' => '/collections',
                    ],
                ],
            ],
            [
                'title' => 'From Source to Space',
                'slug' => 'from-source-to-space',
                'subtitle' => 'Every material has a journey. We follow it from its origin to the spaces it helps define.',
                'excerpt' => 'Explore the six-stage journey of ELIOR Natural Stones — from quarry origin to processing, curation, protection, transit, and inspiring architectural spaces.',
                'meta_title' => 'ELIOR Natural Stones | From Source to Space',
                'meta_description' => 'Explore the six-stage journey of ELIOR Natural Stones — from quarry origin to processing, curation, protection, transit, and inspiring architectural spaces.',
                'is_published' => true,
                'content' => [
                    'template' => 'from-source-to-space',
                    'hero' => [
                        'eyebrow' => 'ELIOR / NATURAL STONES',
                        'marker' => 'MATERIAL JOURNEY',
                        'title' => 'From Source to Space',
                        'supportingLine' => 'Every material has a journey. We follow it from its origin to the spaces it helps define.',
                        'image' => '/images/elior/source-to-space/source-to-space-hero.webp',
                        'imageAlt' => 'Monumental quarry wall showing natural stone stratification and extraction origin',
                    ],
                    'intro' => [
                        'headline' => 'From Material to Meaning.',
                        'paragraph1' => 'Stone begins with geology. Architecture gives it purpose.',
                        'paragraph2' => 'Between the two lies a sequence of decisions — how material is selected, processed, inspected, protected and ultimately brought into a space.',
                        'paragraph3' => 'At ELIOR, the journey matters because the material matters.',
                    ],
                    'journey' => [
                        'heading' => 'The Journey',
                        'subline' => 'Six stages. One continuous relationship with material.',
                        'stages' => [
                            [
                                'index' => '01',
                                'title' => 'QUARRIES',
                                'description' => 'Understanding where material begins.',
                                'slug' => 'quarries',
                            ],
                            [
                                'index' => '02',
                                'title' => 'PROCESSING',
                                'description' => 'Revealing the character of the stone through considered processing.',
                                'slug' => 'processing',
                            ],
                            [
                                'index' => '03',
                                'title' => 'SELECTION',
                                'description' => 'Choosing surfaces for colour, movement, texture and intended application.',
                                'slug' => 'selection',
                            ],
                            [
                                'index' => '04',
                                'title' => 'PACKAGING',
                                'description' => 'Protecting the material through careful preparation for movement.',
                                'slug' => 'packaging',
                            ],
                            [
                                'index' => '05',
                                'title' => 'WORLDWIDE',
                                'description' => 'Moving selected material toward its intended destination.',
                                'slug' => 'worldwide',
                            ],
                            [
                                'index' => '06',
                                'title' => 'INSPIRING SPACES',
                                'description' => 'Where material becomes architecture.',
                                'slug' => 'spaces',
                            ],
                        ],
                    ],
                    'source' => [
                        'stageIndex' => '01',
                        'heading' => '01 — Where Stone Begins',
                        'subtitle' => 'GEOLOGICAL ORIGIN',
                        'paragraph1' => 'Every stone begins with a geological story shaped long before it reaches architecture.',
                        'paragraph2' => 'At source, variation is part of the material — colour, grain, structure and natural movement are never completely identical.',
                    ],
                    'processing' => [
                        'stageIndex' => '02',
                        'heading' => '02 — Precision Reveals Character',
                        'subtitle' => 'DIMENSIONAL CALIBRATION & FINISHING',
                        'paragraph1' => 'Processing transforms raw material into surfaces that can be understood, selected and used within architecture.',
                        'paragraph2' => 'Cut, finish and surface treatment influence how light moves across the stone and how its natural character is experienced.',
                    ],
                    'selection' => [
                        'stageIndex' => '03',
                        'heading' => '03 — Selection Is Part of the Design',
                        'subtitle' => 'CURATORIAL DISCERNMENT',
                        'paragraph1' => 'No two natural surfaces tell exactly the same story. Selection is therefore more than choosing a colour — it is understanding movement, scale, texture and how the material will belong to a space.',
                        'attributes' => [
                            [
                                'title' => 'COLOUR',
                                'description' => 'Natural mineral pigmentation reacting uniquely under ambient and direct light.',
                            ],
                            [
                                'title' => 'MOVEMENT',
                                'description' => 'Directional flow, tectonic veining, and organic strata establishing spatial energy.',
                            ],
                            [
                                'title' => 'TEXTURE',
                                'description' => 'Tactile engagement from smooth honed calmness to cleft and leathered depth.',
                            ],
                            [
                                'title' => 'SCALE',
                                'description' => 'Continuous monolithic slabs and calibrated elements proportioned to architectural rhythm.',
                            ],
                        ],
                    ],
                    'packaging' => [
                        'stageIndex' => '04',
                        'heading' => '04 — Protecting the Material',
                        'subtitle' => 'PRESERVATION & INTEGRITY',
                        'paragraph1' => 'Once selected, material needs to be prepared carefully for its next stage.',
                        'paragraph2' => 'Protection, handling and preparation are part of preserving the surface from source to destination.',
                    ],
                    'movement' => [
                        'stageIndex' => '05',
                        'heading' => '05 — From One Place to Another',
                        'stageLabel' => '05 — WORLDWIDE',
                        'subtitle' => 'TRANSIT TOWARD DESTINATION',
                        'paragraph1' => 'Material moves because architecture moves. The journey continues from preparation toward the place where the stone will be used.',
                    ],
                    'architecture' => [
                        'stageIndex' => '06',
                        'heading' => '06 — Where Material Becomes Architecture',
                        'subtitle' => 'SPATIAL FULFILLMENT',
                        'paragraph1' => 'At its destination, stone becomes more than a surface. It becomes part of the rhythm, proportion and identity of a space.',
                        'paragraph2' => 'From source to space, every decision contributes to the final experience.',
                        'cta' => 'EXPLORE COLLECTIONS',
                        'ctaHref' => '/collections',
                    ],
                    'selectionAttributes' => [
                        [
                            'title' => 'COLOUR',
                            'description' => 'Natural mineral pigmentation reacting uniquely under ambient and direct light.',
                        ],
                        [
                            'title' => 'MOVEMENT',
                            'description' => 'Directional flow, tectonic veining, and organic strata establishing spatial energy.',
                        ],
                        [
                            'title' => 'TEXTURE',
                            'description' => 'Tactile engagement from smooth honed calmness to cleft and leathered depth.',
                        ],
                        [
                            'title' => 'SCALE',
                            'description' => 'Continuous monolithic slabs and calibrated elements proportioned to architectural rhythm.',
                        ],
                    ],
                    'closing' => [
                        'headline' => "From Source.\nTo Space.\nTo Something Lasting.",
                        'signature' => 'ELIOR NATURAL STONES',
                        'cta' => 'BEGIN A CONVERSATION',
                        'ctaHref' => '/contact',
                    ],
                ],
            ],
            [
                'title' => 'Architect & Designer Services',
                'slug' => 'architect-designer-services',
                'subtitle' => 'Material guidance for architects, designers and spaces shaped with intention.',
                'excerpt' => 'Architectural consultation, bespoke material curation, and trade partnership for residential and commercial spaces shaped with intention.',
                'meta_title' => 'ELIOR Natural Stones | Architect & Designer Services',
                'meta_description' => 'Architectural consultation, bespoke material curation, and trade partnership for residential and commercial spaces shaped with intention.',
                'is_published' => true,
                'content' => [
                    'template' => 'architect-designer-services',
                    'hero' => [
                        'eyebrow' => 'ELIOR / NATURAL STONES',
                        'marker' => 'ARCHITECT & DESIGNER SERVICES',
                        'title' => 'Designed Around Your Vision.',
                        'supportingLine' => 'Material guidance for architects, designers and spaces shaped with intention.',
                        'cta' => 'START A MATERIAL CONVERSATION',
                        'ctaHref' => '/contact',
                        'image' => '/images/elior/architect-services/services-hero.webp',
                        'imageAlt' => 'Architectural consultation table with stone samples, technical drawings, and natural light',
                    ],
                    'intro' => [
                        'headline' => 'Good Architecture Begins With the Right Material.',
                        'paragraph1' => 'Stone influences more than a surface. Its colour, scale, movement, texture and finish can change how a space is perceived.',
                        'paragraph2' => 'ELIOR supports architects and designers with material-focused guidance — helping explore possibilities, compare surfaces and identify materials that fit the intent of a space.',
                    ],
                    'services' => [
                        'heading' => 'How We Support Your Process',
                        'subline' => 'Material expertise, considered around the needs of your project.',
                        'disciplines' => [
                            [
                                'index' => '01',
                                'title' => 'CONSULTATION',
                                'description' => 'Discuss the material direction, visual intent and requirements of your space.',
                            ],
                            [
                                'index' => '02',
                                'title' => 'DESIGN SUPPORT',
                                'description' => 'Explore stone surfaces, finishes and visual possibilities alongside your design development.',
                            ],
                            [
                                'index' => '03',
                                'title' => 'CUSTOM SOLUTIONS',
                                'description' => 'Discuss material requirements where standard selections do not fully express the intended result.',
                            ],
                            [
                                'index' => '04',
                                'title' => 'TECHNICAL ASSISTANCE',
                                'description' => 'Review relevant material considerations, finish options and application context.',
                            ],
                            [
                                'index' => '05',
                                'title' => 'PROJECT COLLABORATION',
                                'description' => 'Work through material decisions as your project develops from concept toward execution.',
                            ],
                            [
                                'index' => '06',
                                'title' => 'MATERIAL GUIDANCE',
                                'description' => 'Compare colour, movement, texture, scale and finish to help identify an appropriate material direction.',
                            ],
                        ],
                    ],
                    'consultation' => [
                        'heading' => '01 — Start With the Material.',
                        'subtitle' => 'MATERIAL TRANSLATION',
                        'paragraph' => 'Every project begins with an intention. We help translate that intention into a material direction by looking at tone, scale, movement, texture, finish and the character of the space.',
                        'considerations' => [
                            'COLOUR',
                            'MOVEMENT',
                            'TEXTURE',
                            'FINISH',
                            'SCALE',
                        ],
                    ],
                    'designSupport' => [
                        'heading' => '02 — See the Possibilities.',
                        'subtitle' => 'CONTEXTUAL INTEGRATION',
                        'paragraph' => 'Material decisions become easier when the surface can be considered in context. Explore how stone behaves alongside architecture, light, proportion and neighbouring materials.',
                        'supportingStatement' => 'Material should support the design, not compete with it.',
                    ],
                    'applications' => [
                        'heading' => '03 — Consider the Application.',
                        'subtitle' => 'SPATIAL DISCERNMENT',
                        'categories' => [
                            [
                                'title' => 'INTERIOR FLOORS',
                                'subtitle' => 'Surface & Footfall Context',
                                'considerations' => [
                                    'Surface finish',
                                    'Scale',
                                    'Light',
                                    'Maintenance context',
                                ],
                            ],
                            [
                                'title' => 'WALL SURFACES',
                                'subtitle' => 'Vertical Expression',
                                'considerations' => [
                                    'Slab movement',
                                    'Visual continuity',
                                    'Lighting',
                                    'Surrounding materials',
                                ],
                            ],
                            [
                                'title' => 'KITCHEN / WORK SURFACES',
                                'subtitle' => 'Functional Planes',
                                'considerations' => [
                                    'Finish',
                                    'Edge treatment',
                                    'Visual movement',
                                    'Intended use',
                                ],
                            ],
                            [
                                'title' => 'EXTERIOR / LANDSCAPE',
                                'subtitle' => 'Climatic Harmony',
                                'considerations' => [
                                    'Surface character',
                                    'Environment',
                                    'Weather exposure',
                                    'Intended application',
                                ],
                            ],
                        ],
                    ],
                    'collaboration' => [
                        'heading' => '04 — Stay Close to the Material.',
                        'subtitle' => 'CONTINUOUS DIALOGUE',
                        'paragraph' => 'As a project develops, material decisions often become more specific. ELIOR can remain part of the conversation as selections are refined and the relationship between material and architecture becomes clearer.',
                        'progression' => [
                            ['stage' => '01', 'title' => 'CONCEPT'],
                            ['stage' => '02', 'title' => 'MATERIAL DIRECTION'],
                            ['stage' => '03', 'title' => 'SELECTION'],
                            ['stage' => '04', 'title' => 'REFINEMENT'],
                            ['stage' => '05', 'title' => 'ARCHITECTURAL SPACE'],
                        ],
                    ],
                    'enquiry' => [
                        'headline' => 'Working on a Project?',
                        'supportingCopy' => 'Tell us about the space, material direction or design challenge you are considering.',
                        'ctaPrimary' => 'BEGIN A CONVERSATION',
                        'ctaPrimaryHref' => '/contact',
                        'ctaSecondary' => 'EXPLORE COLLECTIONS',
                        'ctaSecondaryHref' => '/collections',
                    ],
                    'selectionProcess' => [
                        'heading' => 'A More Considered Selection.',
                        'subline' => 'A five-step framework designed to align materiality with architectural intent.',
                        'steps' => [
                            [
                                'step' => '01',
                                'title' => 'UNDERSTAND',
                                'description' => 'Understand the space, design intent and application.',
                            ],
                            [
                                'step' => '02',
                                'title' => 'EXPLORE',
                                'description' => 'Explore relevant collections and material directions.',
                            ],
                            [
                                'step' => '03',
                                'title' => 'COMPARE',
                                'description' => 'Compare colour, movement, texture, scale and finish.',
                            ],
                            [
                                'step' => '04',
                                'title' => 'REFINE',
                                'description' => 'Narrow the material direction according to the design.',
                            ],
                            [
                                'step' => '05',
                                'title' => 'SELECT',
                                'description' => 'Arrive at a considered material choice.',
                            ],
                        ],
                    ],
                    'closing' => [
                        'headline' => 'Material Becomes Architecture.',
                        'signature' => 'ELIOR NATURAL STONES',
                        'cta' => 'EXPLORE COLLECTIONS',
                        'ctaHref' => '/collections',
                    ],
                ],
            ],
            [
                'title' => 'Contact & Material Enquiry',
                'slug' => 'contact',
                'subtitle' => "Whether you are selecting a single surface or shaping an entire architectural palette, we're here to help you find the right material.",
                'excerpt' => 'Get in touch with ELIOR Natural Stones for material consultation, sample requests, slab reservations, and architectural trade enquiries.',
                'meta_title' => 'ELIOR Natural Stones | Contact & Material Enquiry',
                'meta_description' => 'Get in touch with ELIOR Natural Stones for material consultation, sample requests, slab reservations, and architectural trade enquiries.',
                'is_published' => true,
                'content' => [
                    'template' => 'contact',
                    'hero' => [
                        'eyebrow' => 'ELIOR NATURAL STONES',
                        'title' => "Let's Talk About Your Space.",
                        'supportingCopy' => "Whether you are selecting a single surface or shaping an entire architectural palette, we're here to help you find the right material.",
                        'ctaText' => 'Start an Enquiry',
                        'ctaHref' => '#enquiry-form',
                    ],
                    'intro' => [
                        'eyebrow' => 'ARCHITECTURAL DIALOGUE',
                        'title' => 'A Conversation Starts With Material.',
                        'description1' => 'Every project begins differently. Some arrive with defined blueprints and material schedules, while others start with an initial atmospheric sketch or spatial volume.',
                        'description2' => 'We work closely with architects, interior designers, developers, and homeowners to understand specific spatial intentions and identify stone varieties that endure.',
                    ],
                    'form' => [
                        'heading' => 'Tell Us About Your Project.',
                        'supportingCopy' => 'Share a few details and our team can understand what you are looking for.',
                        'submitButtonText' => 'Send Enquiry',
                        'submittingButtonText' => 'Sending Enquiry...',
                        'privacyReassurance' => 'Your information is used only to respond to your enquiry.',
                        'successHeading' => 'Enquiry Received',
                        'successMessage' => 'Thank you for your interest in ELIOR Natural Stones. Our material advisors will review your project details and reach out promptly.',
                        'resetButtonText' => 'Submit Another Enquiry',
                    ],
                    'directContact' => [
                        'heading' => 'Prefer a Direct Conversation?',
                        'phoneLabel' => 'Phone',
                        'phoneValue' => '+918125958071',
                        'phoneDisplay' => '+91 81259 58071',
                        'emailLabel' => 'Email',
                        'emailValue' => 'info@eliornaturalstones.com',
                        'locationLabel' => 'Location',
                        'locationValue' => 'Hyderabad, India',
                    ],
                    'howWeCanHelp' => [
                        'eyebrow' => 'CAPABILITIES',
                        'heading' => 'How We Can Help',
                        'items' => [
                            [
                                'id' => 'material-selection',
                                'number' => '01',
                                'title' => 'Material Selection',
                                'description' => 'Guidance in identifying the right stone variety and tonality suited to your specific interior or exterior environment.',
                            ],
                            [
                                'id' => 'collection-enquiries',
                                'number' => '02',
                                'title' => 'Collection Enquiries',
                                'description' => 'Detailed insights into slab inventory, veining patterns, quarry origins, and block availability across our nine collections.',
                            ],
                            [
                                'id' => 'project-collaboration',
                                'number' => '03',
                                'title' => 'Project Collaboration',
                                'description' => 'Early-stage material dialogue with architects, designers, and developers to support seamless specification.',
                            ],
                            [
                                'id' => 'sample-requests',
                                'number' => '04',
                                'title' => 'Sample Requests',
                                'description' => 'Curated physical stone specimens delivered to your studio or site for true lighting and tactile assessment.',
                            ],
                            [
                                'id' => 'availability-enquiries',
                                'number' => '05',
                                'title' => 'Availability Enquiries',
                                'description' => 'Real-time information on lot quantities, block reservations, lead times, and dispatch logistics.',
                            ],
                            [
                                'id' => 'material-guidance',
                                'number' => '06',
                                'title' => 'Material Guidance',
                                'description' => 'Practical observations on mineral hardness, surface finishes, natural patina, and maintenance requirements over time.',
                            ],
                        ],
                    ],
                    'closing' => [
                        'heading' => 'The Right Material Changes Everything.',
                        'supportingLine' => 'Begin with the material. Build from there.',
                        'ctaText' => 'Explore Collections',
                        'ctaHref' => '/collections',
                        'brandMarker' => 'ELIOR NATURAL STONES',
                    ],
                ],
            ],
        ];

        foreach ($pages as $pageData) {
            Page::updateOrCreate(
                ['slug' => $pageData['slug']],
                $pageData
            );
        }
    }
}
