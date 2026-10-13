<?php

namespace Database\Seeders;

use App\Models\GalleryItem;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            [
                'title' => 'Calacatta Gold Sovereign Bath',
                'slug' => 'calacatta-gold-sovereign-bath',
                'category' => 'Italian Marble',
                'space_type' => 'Master Sanctuary Bath',
                'material' => 'Calacatta Gold & Statuario',
                'description' => 'A master bath clad in bookmatched Calacatta Gold marble slabs with warm gilded veining, custom freestanding soaking tub, and recessed ambient illumination.',
                'image_file' => 'gallery-01.webp',
                'sort_order' => 1,
                'is_featured' => true,
            ],
            [
                'title' => 'Statuario Extra Bookmatched Salon',
                'slug' => 'statuario-extra-bookmatched-salon',
                'category' => 'Italian Marble',
                'space_type' => 'Grand Salon',
                'material' => 'Statuario Extra Bookmatch',
                'description' => 'Floor-to-ceiling mirror-matched Statuario Extra marble feature wall integrated with linear fireplace, framing panoramic natural light in a penthouse living pavilion.',
                'image_file' => 'gallery-02.webp',
                'sort_order' => 2,
                'is_featured' => true,
            ],
            [
                'title' => 'Borghini Monolith Hearth',
                'slug' => 'borghini-monolith-hearth',
                'category' => 'Italian Marble',
                'space_type' => 'Penthouse Living Pavilion',
                'material' => 'Calacatta Borghini',
                'description' => 'Dramatic Calacatta Borghini focal wall with flowing grey-gold veins, precision shadowline joints, and floating marble bench seating.',
                'image_file' => 'gallery-03.webp',
                'sort_order' => 3,
                'is_featured' => false,
            ],
            [
                'title' => 'Venatino Minimalist Bath',
                'slug' => 'venatino-minimalist-bath',
                'category' => 'Italian Marble',
                'space_type' => 'Executive Master Bath',
                'material' => 'Carrara Venatino',
                'description' => 'Architectural Carrara Venatino walk-in shower and vanity suite with seamless mitered stone edges and integrated stone niche details.',
                'image_file' => 'gallery-04.webp',
                'sort_order' => 4,
                'is_featured' => false,
            ],
            [
                'title' => 'Luminescent Honey Onyx Spa',
                'slug' => 'luminescent-honey-onyx-spa',
                'category' => 'Onyx & Translucent',
                'space_type' => 'Wellness Spa Suite',
                'material' => 'Honey Onyx Translucent',
                'description' => 'Backlit crystalline Honey Onyx accent wall creating an ethereal golden glow behind a carved stone soaking tub in a private wellness sanctuary.',
                'image_file' => 'gallery-05.webp',
                'sort_order' => 5,
                'is_featured' => true,
            ],
            [
                'title' => 'Radiant Sunset Onyx Vanity',
                'slug' => 'radiant-sunset-onyx-vanity',
                'category' => 'Onyx & Translucent',
                'space_type' => 'Powder Room',
                'material' => 'Sunset Gold Onyx',
                'description' => 'Integrated backlit onyx vanity and illuminated architectural mirror backdrop highlighting the natural mineral banding of exotic Sunset Onyx.',
                'image_file' => 'gallery-06.webp',
                'sort_order' => 6,
                'is_featured' => false,
            ],
            [
                'title' => 'Grand Atrium Marble Facade',
                'slug' => 'grand-atrium-marble-facade',
                'category' => 'Italian Marble',
                'space_type' => 'Double-Height Atrium',
                'material' => 'Bianco Lasa Bookmatch',
                'description' => 'Double-height architectural marble wall installation with precision quad-bookmatching and indirect perimeter cove lighting.',
                'image_file' => 'gallery-07.webp',
                'sort_order' => 7,
                'is_featured' => true,
            ],
            [
                'title' => 'Amber Vein Backlit Onyx Slab',
                'slug' => 'amber-vein-backlit-onyx-slab',
                'category' => 'Onyx & Translucent',
                'space_type' => 'Feature Gallery Wall',
                'material' => 'Amber Vein Translucent Onyx',
                'description' => 'Monumental single-slab backlit onyx installation showcasing deep amber crystalline depth, dramatic organic veins, and museum-grade backlighting.',
                'image_file' => 'gallery-08.webp',
                'sort_order' => 8,
                'is_featured' => true,
            ],
            [
                'title' => 'Cuadra Architectural Marble Suite',
                'slug' => 'cuadra-architectural-marble-suite',
                'category' => 'Italian Marble',
                'space_type' => 'Architectural Residence',
                'material' => 'Italian Marble Ensemble',
                'description' => 'Holistic interior composition featuring bookmatched marble walls, tailored flooring, integrated kitchen counters, and architectural living areas.',
                'image_file' => 'gallery-09.webp',
                'sort_order' => 9,
                'is_featured' => false,
            ],
            [
                'title' => 'Sovereign Marble Villa Ensemble',
                'slug' => 'sovereign-marble-villa-ensemble',
                'category' => 'Italian Marble',
                'space_type' => 'Master Villa Suite',
                'material' => 'Statuario & Nero Marquina',
                'description' => 'Comprehensive luxury master residence suite blending Statuario wall cladding, Nero Marquina accents, and custom mitered vanities.',
                'image_file' => 'gallery-10.webp',
                'sort_order' => 10,
                'is_featured' => false,
            ],
            [
                'title' => 'Monolithic Portal Archway',
                'slug' => 'monolithic-portal-archway',
                'category' => 'Sculptures & Accents',
                'space_type' => 'Portal & Threshold',
                'material' => 'Travertine & White Marble',
                'description' => 'Monumental carved stone portal arch framing a modern courtyard, uniting classical stone masonry with contemporary minimalist architecture.',
                'image_file' => 'gallery-11.webp',
                'sort_order' => 11,
                'is_featured' => false,
            ],
            [
                'title' => 'Blue Roma Oceanic Bath',
                'slug' => 'blue-roma-oceanic-bath',
                'category' => 'Exotic Quartzite',
                'space_type' => 'Signature Master Bath',
                'material' => 'Blue Roma Quartzite',
                'description' => 'Rare Brazilian Blue Roma quartzite with copper-gold breccias and robin-egg blue currents, bookmatched across full-height walls with brass details.',
                'image_file' => 'gallery-12.webp',
                'sort_order' => 12,
                'is_featured' => true,
            ],
            [
                'title' => 'Verde Imperial Rotunda',
                'slug' => 'verde-imperial-rotunda',
                'category' => 'Italian Marble',
                'space_type' => 'Grand Reception Rotunda',
                'material' => 'Verde Alpi & Floresta',
                'description' => 'Prestigious hotel lobby rotunda enveloped in deep green polished marble with gold vein accents and bespoke architectural joinery.',
                'image_file' => 'gallery-13.webp',
                'sort_order' => 13,
                'is_featured' => true,
            ],
            [
                'title' => 'Macchia Vecchia Art Pavilion',
                'slug' => 'macchia-vecchia-art-pavilion',
                'category' => 'Italian Marble',
                'space_type' => 'Private Art Gallery',
                'material' => 'Calacatta Macchia Vecchia',
                'description' => 'Curated gallery hall lined with bookmatched Calacatta Macchia Vecchia marble featuring dramatic ochre and grey veins under museum track lighting.',
                'image_file' => 'gallery-14.webp',
                'sort_order' => 14,
                'is_featured' => false,
            ],
            [
                'title' => 'Triad Marble Sculpture Ensemble',
                'slug' => 'triad-marble-sculpture-ensemble',
                'category' => 'Sculptures & Accents',
                'space_type' => 'Sculptural Atrium',
                'material' => 'Hand-Carved Marble Monoliths',
                'description' => 'A sculptural collection of three monolithic carved marble vessels with organic fluted contours, positioned as focal centerpieces.',
                'image_file' => 'gallery-15.webp',
                'sort_order' => 15,
                'is_featured' => true,
            ],
            [
                'title' => 'Skyline Arabescato Salon',
                'slug' => 'skyline-arabescato-salon',
                'category' => 'Italian Marble',
                'space_type' => 'Skyline Penthouse Salon',
                'material' => 'Nero Antico & Arabescato',
                'description' => 'Floor-to-ceiling Arabescato marble feature wall overlooking city skyline vistas, complementing custom velvet seating and natural stone floors.',
                'image_file' => 'gallery-16.webp',
                'sort_order' => 16,
                'is_featured' => false,
            ],
            [
                'title' => 'Organic Marble Form Sanctuary',
                'slug' => 'organic-marble-form-sanctuary',
                'category' => 'Sculptures & Accents',
                'space_type' => 'Sculptural Lounge',
                'material' => 'Sculpted Italian Marble',
                'description' => 'Biophilic sculptural marble pedestals and carved stone forms set against warm architectural wood and natural stone paving.',
                'image_file' => 'gallery-17.webp',
                'sort_order' => 17,
                'is_featured' => false,
            ],
            [
                'title' => 'Floating Monolith Staircase',
                'slug' => 'floating-monolith-staircase',
                'category' => 'Architectural Stone',
                'space_type' => 'Central Stairwell',
                'material' => 'Pure White Thassos & Marble',
                'description' => 'Cantilevered floating marble stair treads appearing weightless against frameless structural glass and architectural concrete.',
                'image_file' => 'gallery-18.webp',
                'sort_order' => 18,
                'is_featured' => true,
            ],
            [
                'title' => 'Floresta Verde Sanctuary Suite',
                'slug' => 'floresta-verde-sanctuary-suite',
                'category' => 'Italian Marble',
                'space_type' => 'Presidential Bedroom Suite',
                'material' => 'Floresta Verde Marble',
                'description' => 'Bookmatched Floresta Verde emerald marble headboard wall with delicate white crystalline branching in a serene presidential suite.',
                'image_file' => 'gallery-19.webp',
                'sort_order' => 19,
                'is_featured' => true,
            ],
            [
                'title' => 'Verde Forest Dining Pavilion',
                'slug' => 'verde-forest-dining-pavilion',
                'category' => 'Italian Marble',
                'space_type' => 'Dining Pavilion',
                'material' => 'Verde Guatemala & Floresta',
                'description' => 'Rich green marble wall installation paired with custom walnut credenza and contemporary lighting in an executive private dining pavilion.',
                'image_file' => 'gallery-20.webp',
                'sort_order' => 20,
                'is_featured' => false,
            ],
            [
                'title' => 'Floresta Emerald Bath Pavilion',
                'slug' => 'floresta-emerald-bath-pavilion',
                'category' => 'Italian Marble',
                'space_type' => 'Master Spa Bath',
                'material' => 'Floresta Verde Marble',
                'description' => 'Seamless Floresta Verde stone slabs across vanity surfaces, step-in soaking tub, and accent walls with brushed bronze hardware.',
                'image_file' => 'gallery-21.webp',
                'sort_order' => 21,
                'is_featured' => false,
            ],
            [
                'title' => 'Pegasus High-Relief Stone Mural',
                'slug' => 'pegasus-high-relief-stone-mural',
                'category' => 'Sculptures & Accents',
                'space_type' => 'Grand Portico',
                'material' => 'Hand-Carved Natural Stone Relief',
                'description' => 'Bespoke hand-carved stone relief mural of a winged Pegasus in full stride, executed by master stone artisans in natural limestone.',
                'image_file' => 'gallery-22.webp',
                'sort_order' => 22,
                'is_featured' => true,
            ],
            [
                'title' => 'Nero Portoro Fireplace Hearth',
                'slug' => 'nero-portoro-fireplace-hearth',
                'category' => 'Italian Marble',
                'space_type' => 'Fireplace Hearth Lounge',
                'material' => 'Nero Portoro & Gold Vein',
                'description' => 'Deep black marble hearth with intense gold rivers of quartz, bookmatched around a suspended modern fire feature.',
                'image_file' => 'gallery-23.webp',
                'sort_order' => 23,
                'is_featured' => false,
            ],
            [
                'title' => 'Spire of Eternity Marble Sculpture',
                'slug' => 'spire-of-eternity-marble-sculpture',
                'category' => 'Sculptures & Accents',
                'space_type' => 'Courtyard Garden',
                'material' => 'Carved White Marble',
                'description' => 'An organic vertical marble spire hand-chiseled from a single block of crystalline white marble, celebrating light and shadow.',
                'image_file' => 'gallery-24.webp',
                'sort_order' => 24,
                'is_featured' => false,
            ],
            [
                'title' => 'Continuum Ribbon Marble Sculpture',
                'slug' => 'continuum-ribbon-marble-sculpture',
                'category' => 'Sculptures & Accents',
                'space_type' => 'Executive Atrium',
                'material' => 'Curvilinear Sculpted Marble',
                'description' => 'A dynamic ribbon-like natural stone sculpture capturing continuous fluid motion, standing as the crown jewel of an executive atrium.',
                'image_file' => 'gallery-25.webp',
                'sort_order' => 25,
                'is_featured' => false,
            ],
            [
                'title' => 'Floresta Verde Signature Bath',
                'slug' => 'floresta-verde-signature-bath',
                'category' => 'Italian Marble',
                'space_type' => 'Signature Master Suite',
                'material' => 'Floresta Verde Exotic Marble',
                'description' => 'Comprehensive master bathroom cladding showcasing Floresta Verde bookmatched slabs behind custom double vanities and walk-in glass shower.',
                'image_file' => 'gallery-26.webp',
                'sort_order' => 26,
                'is_featured' => true,
            ],
            [
                'title' => 'Floresta Verde Living Pavilion',
                'slug' => 'floresta-verde-living-pavilion',
                'category' => 'Italian Marble',
                'space_type' => 'Living Pavilion',
                'material' => 'Floresta Verde Exotic Marble',
                'description' => 'Expansive living room with full-height Floresta Verde feature wall, integrated custom display shelving, and modern furnishings.',
                'image_file' => 'gallery-27.webp',
                'sort_order' => 27,
                'is_featured' => false,
            ],
            [
                'title' => 'Midnight Gold Vein Bedroom Suite',
                'slug' => 'midnight-gold-vein-bedroom-suite',
                'category' => 'Italian Marble',
                'space_type' => 'Presidential Bedroom',
                'material' => 'Midnight Gold Vein Marble',
                'description' => 'Dramatic Midnight Gold Vein marble with sharp golden lightning strikes running across obsidian black background behind master bed.',
                'image_file' => 'gallery-28.webp',
                'sort_order' => 28,
                'is_featured' => true,
            ],
            [
                'title' => 'Midnight Wave Spiral Staircase',
                'slug' => 'midnight-wave-spiral-staircase',
                'category' => 'Architectural Stone',
                'space_type' => 'Grand Spiral Staircase',
                'material' => 'Midnight Gold Vein & Panda White',
                'description' => 'Monumental curved staircase clad in black-and-white flowing marble with recessed lighting reveals accentuating the architectural curvature.',
                'image_file' => 'gallery-29.webp',
                'sort_order' => 29,
                'is_featured' => true,
            ],
        ];

        $imageDir = public_path('images/elior/gallery');
        $total = count($items);

        $this->command?->info("Seeding {$total} architectural gallery items...");

        foreach ($items as $index => $data) {
            $idx = $index + 1;
            $imageFile = $data['image_file'];
            unset($data['image_file']);

            $item = GalleryItem::updateOrCreate(
                ['slug' => $data['slug']],
                $data
            );

            $this->command?->line("  [{$idx}/{$total}] {$item->title}");

            $imagePath = $imageDir.DIRECTORY_SEPARATOR.$imageFile;
            if (file_exists($imagePath)) {
                $existingMedia = $item->getFirstMedia('image');
                if (! $existingMedia || $existingMedia->file_name !== $imageFile) {
                    try {
                        $item->clearMediaCollection('image');
                        $item->addMedia($imagePath)
                            ->preservingOriginal()
                            ->withCustomProperties([
                                'alt_text' => $item->title,
                                'width' => 1500,
                                'height' => 1200,
                            ])
                            ->toMediaCollection('image');
                    } catch (\Throwable $e) {
                        logger()->warning("Could not attach gallery image for {$item->slug}: {$e->getMessage()}");
                    }
                }
            }
        }

        $this->command?->info("Successfully seeded all {$total} gallery items!");
    }
}
