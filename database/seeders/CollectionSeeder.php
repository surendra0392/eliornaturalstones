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
                'meta_title' => 'Italian Marble Slabs in Hyderabad & India | ELIOR Natural Stones',
                'meta_description' => 'Direct importer of Italian marble slabs in Hyderabad, India. Statuario, Calacatta, Botticino & Michelangelo marble for luxury flooring, wall cladding & interiors.',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Granites',
                'slug' => 'granites',
                'tagline' => 'Enduring igneous grandeur and crystalline resilience',
                'description' => 'Formed deep within tectonic depths, these dense, enduring stones combine monumental structural strength with subtle mineral depths for demanding interior and facade applications.',
                'meta_title' => 'Architectural Granite Slabs in Hyderabad & India | ELIOR Stones',
                'meta_description' => 'Premium architectural granite slabs in Hyderabad & India. High-density Black Galaxy, Tan Brown, honed & flamed granite for facades, countertops & monumental surfaces.',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Slate Stone',
                'slug' => 'slate-stone',
                'tagline' => 'Textural cleavage planes and earthy organic relief',
                'description' => 'Naturally cleaved metamorphic surfaces that impart depth, shadow play, and refined tactile warmth to architectural walls, terraces, and water elements.',
                'meta_title' => 'Natural Slate Stone Slabs & Wall Cladding | ELIOR Natural Stones',
                'meta_description' => 'Hand-cleaved natural slate stone in Hyderabad & India. Kund Multi, Silver Grey & Charcoal slate for exterior wall cladding, feature walls, wet areas & pool decks.',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Limestones',
                'slug' => 'limestones',
                'tagline' => 'Soft organic patina with tranquil sedimentary warmth',
                'description' => 'Understated, neutral, and gentle on the eye, our limestones capture ancient marine sedimentations and muted fossil imprints for calm, light-drenched environments.',
                'meta_title' => 'Natural Limestone Slabs & Flooring Hyderabad | ELIOR Stones',
                'meta_description' => 'Architectural natural limestone slabs in India. Kota Blue, Tandur Yellow, Shahabad & Kadappa limestone for serene indoor flooring, landscaping & ventilated facades.',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Sand Stone',
                'slug' => 'sandstone',
                'tagline' => 'Warm sedimentary grain and timeless architectural tactile depth',
                'description' => 'Formed through geological eons of natural quartz sand deposition, our Sand Stone collection reveals subtle sedimentary banding, comforting earthy warmth, and superior slip-resistant tactile qualities for monumental facades, open terraces, and serene courtyards.',
                'meta_title' => 'Natural Sandstone Slabs & Facade Stone India | ELIOR Stones',
                'meta_description' => 'Curated natural sandstone slabs and cladding in India. Dholpur Beige, Teakwood, Rainbow & Mint sandstone for exterior facades, courtyard paving & pool surrounds.',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Cobble Stones',
                'slug' => 'cobble-stones',
                'tagline' => 'Monumental paving with ancestral craftsmanship',
                'description' => 'Hand-split and antique-finished cobbles designed to ground vehicular avenues, courtyards, and garden promenades in perpetual permanence.',
                'meta_title' => 'Natural Cobble Stones & Driveway Paving Hyderabad | ELIOR Stones',
                'meta_description' => 'Hand-dressed basalt, granite & sandstone cobble stones in Hyderabad & India. Heavy-duty paving for luxury driveways, pathways, landscape promenades & courtyards.',
                'sort_order' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'Pebbles',
                'slug' => 'pebbles',
                'tagline' => 'Fluvial tumbled stones for contemplative landscape design',
                'description' => 'Water-smoothed stones selected for uniform palettes and sculptural contours, bringing tranquility to courtyards, reflection pools, and landscape transitions.',
                'meta_title' => 'Natural Landscape Pebbles & River Stones | ELIOR Natural Stones',
                'meta_description' => 'Polished and tumbled natural river pebbles in Hyderabad & India. Snow White, Onyx Black, River Mixed pebbles for landscape design, zen gardens & water features.',
                'sort_order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Quartz',
                'slug' => 'quartz',
                'tagline' => 'Luminescent silica crystals and structural precision',
                'description' => 'Engineered purity meeting raw geological radiance. Uncompromising resistance to wear and moisture, designed for high-performance architectural work surfaces.',
                'meta_title' => 'Architectural Quartz Slabs & Countertops | ELIOR Natural Stones',
                'meta_description' => 'Engineered architectural quartz slabs in Hyderabad. Non-porous, stain-resistant quartz surfaces for luxury kitchen countertops, vanity tops & high-traffic spaces.',
                'sort_order' => 8,
                'is_active' => true,
            ],
            [
                'name' => 'Sculptures',
                'slug' => 'sculptures',
                'tagline' => 'Monolithic art forms carved from living stone',
                'description' => 'Bespoke sculptural vessels, monumental plinths, and hand-carved stone art that act as focal anchors in bespoke residential and commercial sanctuaries.',
                'meta_title' => 'Bespoke Hand-Carved Natural Stone Sculptures | ELIOR Stones',
                'meta_description' => 'Monolithic stone sculptures, bespoke stone bathtubs, plinths & architectural water features carved by master artisans from single blocks of natural marble & granite.',
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
