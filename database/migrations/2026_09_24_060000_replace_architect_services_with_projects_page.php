<?php

use App\Models\Page;
use App\Models\SlideLayer;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Remove legacy architect-designer-services page completely
        Page::query()->where('slug', 'architect-designer-services')->delete();

        // Also update homepage content to rename architectServices to featuredProjects if present
        $homePage = Page::query()->where('slug', 'home')->first();
        if ($homePage && is_array($homePage->content)) {
            $content = $homePage->content;
            if (isset($content['architectServices'])) {
                unset($content['architectServices']);
            }
            $content['featuredProjects'] = [
                'eyebrow' => 'ELIOR / ARCHITECTURAL COMMISSIONS',
                'marker' => '08 — FEATURED COMMISSIONS',
                'title' => 'Spaces Defined by Stone.',
                'subtitle' => 'Distinguished private residences, commercial pavilions, and luxury hospitality destinations executed with ELIOR natural stone reserves.',
                'ctaText' => 'EXPLORE ALL PROJECTS',
                'ctaHref' => '/projects',
            ];
            $homePage->content = $content;
            $homePage->save();
        }

        // Update any slide layers pointing to architect-designer-services
        foreach (SlideLayer::where('type', 'cta')->get() as $layer) {
            $c = $layer->content;
            if (is_array($c) && isset($c['secondary_url']) && $c['secondary_url'] === '/architect-designer-services') {
                $c['secondary_url'] = '/projects';
                $c['secondary_label'] = 'Explore Projects';
                $layer->content = $c;
                $layer->save();
            }
        }

        // 2. Insert canonical projects page
        $projectsContent = [
            'template' => 'projects',
            'hero' => [
                'eyebrow' => 'ELIOR / ARCHITECTURAL COMMISSIONS',
                'marker' => 'PORTFOLIO',
                'title' => 'Spaces Defined by Stone.',
                'subtitle' => 'Distinguished private residences, commercial pavilions, and luxury hospitality destinations executed with ELIOR natural stone reserves across India.',
                'image' => '/images/elior/projects/projects-hero.jpg',
                'imageAlt' => 'Contemporary cultural stone pavilion in New Delhi with warm Rajasthani sandstone screens and honed stone flooring',
            ],
            'intro' => [
                'headline' => 'Form Follows Material.',
                'paragraph1' => 'Every building begins as an intention; natural stone grounds that intention in permanent geological reality.',
                'paragraph2' => 'At ELIOR, we collaborate directly with leading architects, structural engineers, and interior designers to supply monumental block reserves, calibrate finishes, and deliver bespoke cut-to-size stone solutions for notable commissions across India.',
            ],
            'categories' => [
                ['id' => 'all', 'label' => 'All Projects'],
                ['id' => 'residential', 'label' => 'Private Residences'],
                ['id' => 'hospitality', 'label' => 'Hospitality & Retreats'],
                ['id' => 'commercial', 'label' => 'Commercial & Pavilions'],
                ['id' => 'landscape', 'label' => 'Landscape & Courtyards'],
            ],
            'projects' => [
                [
                    'id' => 'the-courtyard-villa',
                    'title' => 'The Courtyard Villa',
                    'typology' => 'Private Residence',
                    'category' => 'residential',
                    'location' => 'Jubilee Hills, Hyderabad',
                    'year' => '2025',
                    'area' => '14,000 sq.ft.',
                    'stones' => ['Italian Marble (Statuario)', 'Black Galaxy Granite', 'Teakwood Sandstone'],
                    'description' => 'A minimalist double-height villa centered around a reflecting water court. The residence features bookmatched Statuario marble focal walls, fluted black granite colonnades, and honed interior limestone floors.',
                    'image' => '/images/elior/projects/project-01-hyderabad-villa.jpg',
                    'imageAlt' => 'Minimalist luxury villa in Hyderabad with bookmatched marble accent wall and reflecting pool',
                    'featured' => true,
                ],
                [
                    'id' => 'the-glass-pavilion',
                    'title' => 'The Glass Pavilion & Gallery',
                    'typology' => 'Commercial & Cultural',
                    'category' => 'commercial',
                    'location' => 'Chanakyapuri, New Delhi',
                    'year' => '2024',
                    'area' => '22,000 sq.ft.',
                    'stones' => ['Jodhpur Beige Sandstone', 'Honed White Marble', 'Grey Quartz'],
                    'description' => 'An embassy cultural gallery juxtaposing frameless floor-to-ceiling glass envelopes with thermal-mass sandstone screens and honed light beige stone floor planes, creating dynamic linear shadow play.',
                    'image' => '/images/elior/projects/project-02-delhi-pavilion.jpg',
                    'imageAlt' => 'Cultural pavilion in New Delhi with warm Rajasthani sandstone screens and glass facade',
                    'featured' => true,
                ],
                [
                    'id' => 'lakeview-serenity-retreat',
                    'title' => 'Lakeview Serenity Retreat',
                    'typology' => 'Hospitality & Retreat',
                    'category' => 'hospitality',
                    'location' => 'Lake Pichola, Udaipur',
                    'year' => '2025',
                    'area' => '35,000 sq.ft.',
                    'stones' => ['Kota Blue Limestone', 'Jaisalmer Yellow Stone', 'Monolithic Stone Sculptures'],
                    'description' => 'A boutique luxury wellness sanctuary overlooking Lake Pichola. Hand-carved stone colonnades and stepped reflection pools frame a sunken fire lounge, harmonizing traditional Mewari stonemasonry with contemporary geometry.',
                    'image' => '/images/elior/projects/project-03-udaipur-retreat.jpg',
                    'imageAlt' => 'Luxury lakeside retreat in Udaipur with Kota blue limestone reflection pool and carved colonnade',
                    'featured' => true,
                ],
                [
                    'id' => 'monolith-cliffside-estate',
                    'title' => 'Monolith Cliffside Estate',
                    'typology' => 'Private Residence',
                    'category' => 'residential',
                    'location' => 'Awas Beach, Alibaug',
                    'year' => '2024',
                    'area' => '18,500 sq.ft.',
                    'stones' => ['Charcoal Cleft Slate', 'Flamed Steel Grey Granite', 'White Quartz'],
                    'description' => 'An oceanfront brutalist residence rooted into coastal bedrock. Flamed granite cantilevered terraces and natural cleft slate courtyards withstand coastal marine salt spray while providing deep tactile contrast.',
                    'image' => '/images/elior/projects/project-04-alibaug-estate.jpg',
                    'imageAlt' => 'Brutalist coastal private residence in Alibaug with slate courtyards and cantilevered granite terrace',
                    'featured' => true,
                ],
                [
                    'id' => 'aura-corporate-atrium',
                    'title' => 'Aura Corporate Atrium',
                    'typology' => 'Commercial & Workspace',
                    'category' => 'commercial',
                    'location' => 'Whitefield, Bengaluru',
                    'year' => '2025',
                    'area' => '28,000 sq.ft.',
                    'stones' => ['Engineered Quartz', 'Calacatta Gold Marble', 'Black Granite'],
                    'description' => 'A soaring 40-foot commercial atrium anchored by a sculpted marble reception totem and seamless high-durability crystalline quartz lobby floors calibrated for high footfall acoustics.',
                    'image' => '/images/elior/projects/project-05-bengaluru-atrium.jpg',
                    'imageAlt' => 'Soaring corporate atrium in Bengaluru with quartz floors and stone features',
                    'featured' => false,
                ],
                [
                    'id' => 'the-olive-grove-courtyard',
                    'title' => 'The Olive Grove Courtyard',
                    'typology' => 'Landscape & Courtyard',
                    'category' => 'landscape',
                    'location' => 'Sarjapur, Bengaluru',
                    'year' => '2023',
                    'area' => '12,000 sq.ft.',
                    'stones' => ['Basalt Cobble Stones', 'Polished River Pebbles', 'Dholpur Sandstone'],
                    'description' => 'Sculptural landscape grounds for an ancestral family residence featuring dry-laid basalt cobblestone pathways, polished river pebble drainage swales, and outdoor monolithic stone seating elements.',
                    'image' => '/images/elior/projects/project-06-bangalore-courtyard.jpg',
                    'imageAlt' => 'Sculptural courtyard garden in Bengaluru with cobblestone pathways and river stone landscaping',
                    'featured' => false,
                ],
            ],
            'cta' => [
                'headline' => 'Developing an Architectural Project?',
                'subline' => 'Our material specialists assist with slab reservations, technical test data, custom cut-to-size specifications, and physical sample boxes delivered across India.',
                'buttonText' => 'REQUEST MATERIAL SPECIFICATION',
                'buttonHref' => '/contact',
            ],
            'closing' => [
                'headline' => "Natural stone.\nTimeless spaces.",
                'signature' => 'ELIOR NATURAL STONES',
            ],
        ];

        Page::updateOrCreate(
            ['slug' => 'projects'],
            [
                'title' => 'Projects',
                'slug' => 'projects',
                'subtitle' => 'Distinguished private residences, commercial pavilions, and luxury hospitality destinations executed with ELIOR natural stone reserves.',
                'excerpt' => 'Explore the portfolio of architectural stone commissions by ELIOR Natural Stones across India, featuring Italian Marble, Granites, Sandstone, Limestones, Slate, and sculptural elements.',
                'meta_title' => 'ELIOR Natural Stones | Architectural Projects & Commissions',
                'meta_description' => 'Discover private residences, luxury hospitality retreats, and cultural pavilions executed with ELIOR natural stone reserves across India.',
                'is_published' => true,
                'content' => $projectsContent,
            ]
        );
    }

    public function down(): void
    {
        Page::query()->where('slug', 'projects')->delete();
    }
};
