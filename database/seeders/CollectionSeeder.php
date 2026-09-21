<?php

namespace Database\Seeders;

use App\Models\Collection;
use Illuminate\Database\Seeder;

class CollectionSeeder extends Seeder
{
    /**
     * Seed the canonical ELIOR collections.
     *
     * Hierarchy:
     * 1. Italian Marble
     * 2. Granites
     * 3. Slate Stone
     * 4. Limestones
     * 5. Sand Stone
     * 6. Cobble Stones
     * 7. Pebbles
     * 8. Quartz
     * 9. Sculptures
     */
    public function run(): void
    {
        $collections = [
            [
                'name' => 'Italian Marble',
                'slug' => 'italian-marble',
                'tagline' => 'Timeless quarry masterworks from Carrara and Tuscany',
                'description' => 'Celebrated for centuries in classical and modernist architecture, our Italian Marble collection features rare veining, pristine crystalline structures, and luminous mineral compositions.',
                'meta_title' => 'Italian Marble Architectural Slabs | ELIOR Natural Stones',
                'meta_description' => 'Explore ELIOR’s curated Italian marble selection. Rare veins, exquisite finishes, and museum-grade architectural stone.',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Granites',
                'slug' => 'granites',
                'tagline' => 'Enduring igneous grandeur and crystalline resilience',
                'description' => 'Formed deep within tectonic depths, these dense, enduring stones combine monumental structural strength with subtle mineral depths for demanding interior and facade applications.',
                'meta_title' => 'Architectural Granites | ELIOR Natural Stones',
                'meta_description' => 'High-durability architectural granites for contemporary facades, statement surfaces, and monolithic spaces.',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Slate Stone',
                'slug' => 'slate-stone',
                'tagline' => 'Textural cleavage planes and earthy organic relief',
                'description' => 'Naturally cleaved metamorphic surfaces that impart depth, shadow play, and refined tactile warmth to architectural walls, terraces, and water elements.',
                'meta_title' => 'Natural Slate Stone | ELIOR Natural Stones',
                'meta_description' => 'Natural cleft slate stones with architectural texture and tactile elegance.',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Limestones',
                'slug' => 'limestones',
                'tagline' => 'Soft organic patina with tranquil sedimentary warmth',
                'description' => 'Understated, neutral, and gentle on the eye, our limestones capture ancient marine sedimentations and muted fossil imprints for calm, light-drenched environments.',
                'meta_title' => 'Architectural Limestones | ELIOR Natural Stones',
                'meta_description' => 'Muted, warm limestones crafted for serene architectural floors, walls, and pools.',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Sand Stone',
                'slug' => 'sandstone',
                'tagline' => 'Warm sedimentary grain and timeless architectural tactile depth',
                'description' => 'Formed through geological eons of natural quartz sand deposition, our Sand Stone collection reveals subtle sedimentary banding, comforting earthy warmth, and superior slip-resistant tactile qualities for monumental facades, open terraces, and serene courtyards.',
                'meta_title' => 'Natural Sand Stone Architectural Surfaces | ELIOR Natural Stones',
                'meta_description' => 'Explore ELIOR’s curated Sand Stone collection. Natural cleft and honed architectural sandstones for warm facades, tranquil courtyards, and enduring outdoor living.',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Cobble Stones',
                'slug' => 'cobble-stones',
                'tagline' => 'Monumental paving with ancestral craftsmanship',
                'description' => 'Hand-split and antique-finished cobbles designed to ground vehicular avenues, courtyards, and garden promenades in perpetual permanence.',
                'meta_title' => 'Heritage Cobble Stones | ELIOR Natural Stones',
                'meta_description' => 'Traditional and contemporary cobble stones for refined landscape architecture.',
                'sort_order' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'Pebbles',
                'slug' => 'pebbles',
                'tagline' => 'Fluvial tumbled stones for contemplative landscape design',
                'description' => 'Water-smoothed stones selected for uniform palettes and sculptural contours, bringing tranquility to courtyards, reflection pools, and landscape transitions.',
                'meta_title' => 'Selected Architectural Pebbles | ELIOR Natural Stones',
                'meta_description' => 'Smooth, polished, and natural river pebbles for landscape architecture and zen spaces.',
                'sort_order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Quartz',
                'slug' => 'quartz',
                'tagline' => 'Luminescent silica crystals and structural precision',
                'description' => 'Engineered purity meeting raw geological radiance. Uncompromising resistance to wear and moisture, designed for high-performance architectural work surfaces.',
                'meta_title' => 'High-Performance Quartz | ELIOR Natural Stones',
                'meta_description' => 'Dense crystalline quartz surfaces built for architectural precision and endurance.',
                'sort_order' => 8,
                'is_active' => true,
            ],
            [
                'name' => 'Sculptures',
                'slug' => 'sculptures',
                'tagline' => 'Monolithic art forms carved from living stone',
                'description' => 'Bespoke sculptural vessels, monumental plinths, and hand-carved stone art that act as focal anchors in bespoke residential and commercial sanctuaries.',
                'meta_title' => 'Monolithic Stone Sculptures | ELIOR Natural Stones',
                'meta_description' => 'Handcrafted architectural sculptures, stone vessels, and bespoke focal pieces.',
                'sort_order' => 9,
                'is_active' => true,
            ],
        ];

        foreach ($collections as $collection) {
            Collection::updateOrCreate(
                ['slug' => $collection['slug']],
                $collection
            );
        }
    }
}
