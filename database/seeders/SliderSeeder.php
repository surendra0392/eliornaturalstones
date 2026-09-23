<?php

namespace Database\Seeders;

use App\Models\Slide;
use App\Models\SlideLayer;
use App\Models\Slider;
use Illuminate\Database\Seeder;

class SliderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Avoid duplicate seeding
        $existing = Slider::where('slug', 'homepage-hero')->first();
        if ($existing) {
            return;
        }

        $slider = Slider::create([
            'name' => 'Homepage Master Hero Slider',
            'slug' => 'homepage-hero',
            'description' => 'Main cinematic layered architectural slider for the ELIOR homepage.',
            'status' => Slider::STATUS_PUBLISHED,
            'settings' => [
                'autoplay' => true,
                'autoplay_interval' => 6500,
                'pause_on_hover' => true,
                'loop' => true,
                'navigation' => true,
                'pagination' => true,
                'progress_bar' => true,
                'keyboard_nav' => true,
                'touch_swipe' => true,
                'default_transition' => 'fade',
                'transition_duration' => 0.9,
            ],
        ]);

        // =========================================================================
        // SLIDE 01: Spaces of Permanence
        // =========================================================================
        $slide1 = Slide::create([
            'slider_id' => $slider->id,
            'title' => 'Slide 01 — Architectural Permanence',
            'status' => Slide::STATUS_PUBLISHED,
            'sort_order' => 1,
            'duration' => 7000,
            'transition' => 'fade',
            'background_type' => 'image',
            'background_image' => '/images/elior/homepage/slider-slide-01.webp',
            'background_color' => '#0F0F0F',
            'background_position' => 'center center',
            'background_size' => 'cover',
            'overlay_type' => 'gradient',
            'overlay_opacity' => 45,
            'content_alignment' => 'left',
            'content_width' => 'standard',
            'vertical_position' => 'center',
            'parallax_enabled' => true,
            'parallax_intensity' => 0.15,
        ]);

        // Slide 1 Layer 1: Eyebrow
        SlideLayer::create([
            'slide_id' => $slide1->id,
            'type' => SlideLayer::TYPE_EYEBROW,
            'name' => 'Brand Eyebrow',
            'sort_order' => 1,
            'z_index' => 10,
            'is_visible' => true,
            'content' => [
                'text' => 'ELIOR / NATURAL STONES',
                'secondary_text' => 'ARCHITECTURAL SURFACES',
                'color' => '#D4B381', // Champagne
                'font_family' => 'Montserrat',
            ],
            'positioning' => [
                'horizontal_align' => 'left',
                'max_width' => '65ch',
            ],
            'animation' => [
                'entrance' => 'fade-up',
                'duration' => 0.8,
                'delay' => 0.1,
                'ease' => 'power3.out',
            ],
        ]);

        // Slide 1 Layer 2: Decorative Accent Line
        SlideLayer::create([
            'slide_id' => $slide1->id,
            'type' => SlideLayer::TYPE_DECORATIVE_SHAPE,
            'name' => 'Architectural Accent Line',
            'sort_order' => 2,
            'z_index' => 10,
            'is_visible' => true,
            'content' => [
                'shape_type' => 'line',
                'color' => '#B9987A', // Bronze
                'width' => '48px',
                'height' => '1px',
            ],
            'positioning' => [
                'horizontal_align' => 'left',
            ],
            'animation' => [
                'entrance' => 'scale-in',
                'duration' => 0.6,
                'delay' => 0.25,
                'ease' => 'power2.out',
            ],
        ]);

        // Slide 1 Layer 3: Heading (H1 for page semantics on slide 1)
        SlideLayer::create([
            'slide_id' => $slide1->id,
            'type' => SlideLayer::TYPE_HEADING,
            'name' => 'Hero Heading',
            'sort_order' => 3,
            'z_index' => 10,
            'is_visible' => true,
            'content' => [
                'text' => 'Spaces of Permanence & Quiet Refinement',
                'tag' => 'h1',
                'color' => '#FFFFFF',
                'font_family' => 'Playfair Display',
            ],
            'positioning' => [
                'horizontal_align' => 'left',
                'max_width' => '22ch',
            ],
            'animation' => [
                'entrance' => 'fade-up',
                'duration' => 1.0,
                'delay' => 0.2,
                'ease' => 'power3.out',
            ],
            'responsive' => [
                'desktop' => ['font_size' => 'text-5xl lg:text-7xl'],
                'mobile' => ['font_size' => 'text-3xl sm:text-4xl'],
            ],
        ]);

        // Slide 1 Layer 4: Description
        SlideLayer::create([
            'slide_id' => $slide1->id,
            'type' => SlideLayer::TYPE_DESCRIPTION,
            'name' => 'Architectural Description',
            'sort_order' => 4,
            'z_index' => 10,
            'is_visible' => true,
            'content' => [
                'text' => 'Monumental architectural surfaces, quarry-selected reserves, and bespoke material curation for spaces shaped with intention.',
                'color' => 'rgba(255, 255, 255, 0.85)',
                'font_family' => 'Montserrat',
            ],
            'positioning' => [
                'horizontal_align' => 'left',
                'max_width' => '54ch',
            ],
            'animation' => [
                'entrance' => 'fade-up',
                'duration' => 0.8,
                'delay' => 0.35,
                'ease' => 'power3.out',
            ],
        ]);

        // Slide 1 Layer 5: CTAs
        SlideLayer::create([
            'slide_id' => $slide1->id,
            'type' => SlideLayer::TYPE_CTA,
            'name' => 'Action Buttons',
            'sort_order' => 5,
            'z_index' => 10,
            'is_visible' => true,
            'content' => [
                'primary_label' => 'Explore Collections',
                'primary_url' => '/collections',
                'primary_variant' => 'primary',
                'secondary_label' => 'Our Story',
                'secondary_url' => '/our-story',
                'secondary_variant' => 'secondary',
            ],
            'positioning' => [
                'horizontal_align' => 'left',
            ],
            'animation' => [
                'entrance' => 'fade-up',
                'duration' => 0.8,
                'delay' => 0.5,
                'ease' => 'power3.out',
            ],
        ]);

        // =========================================================================
        // SLIDE 02: From Source to Space
        // =========================================================================
        $slide2 = Slide::create([
            'slider_id' => $slider->id,
            'title' => 'Slide 02 — Source to Space',
            'status' => Slide::STATUS_PUBLISHED,
            'sort_order' => 2,
            'duration' => 6500,
            'transition' => 'fade',
            'background_type' => 'image',
            'background_image' => '/images/elior/homepage/slider-slide-02.webp',
            'background_color' => '#0F0F0F',
            'background_position' => 'center center',
            'background_size' => 'cover',
            'overlay_type' => 'gradient',
            'overlay_opacity' => 45,
            'content_alignment' => 'left',
            'content_width' => 'standard',
            'vertical_position' => 'center',
            'parallax_enabled' => true,
            'parallax_intensity' => 0.15,
        ]);

        // Slide 2 Layer 1: Eyebrow
        SlideLayer::create([
            'slide_id' => $slide2->id,
            'type' => SlideLayer::TYPE_EYEBROW,
            'name' => 'Process Eyebrow',
            'sort_order' => 1,
            'z_index' => 10,
            'is_visible' => true,
            'content' => [
                'text' => 'MATERIAL JOURNEY',
                'secondary_text' => 'FROM SOURCE TO SPACE',
                'color' => '#D4B381',
                'font_family' => 'Montserrat',
            ],
            'positioning' => ['horizontal_align' => 'left'],
            'animation' => [
                'entrance' => 'fade-up',
                'duration' => 0.8,
                'delay' => 0.1,
                'ease' => 'power3.out',
            ],
        ]);

        // Slide 2 Layer 2: Heading (H2)
        SlideLayer::create([
            'slide_id' => $slide2->id,
            'type' => SlideLayer::TYPE_HEADING,
            'name' => 'Process Heading',
            'sort_order' => 2,
            'z_index' => 10,
            'is_visible' => true,
            'content' => [
                'text' => 'Quarry Extraction to Finished Architecture',
                'tag' => 'h2',
                'color' => '#FFFFFF',
                'font_family' => 'Playfair Display',
            ],
            'positioning' => [
                'horizontal_align' => 'left',
                'max_width' => '24ch',
            ],
            'animation' => [
                'entrance' => 'fade-up',
                'duration' => 1.0,
                'delay' => 0.2,
                'ease' => 'power3.out',
            ],
            'responsive' => [
                'desktop' => ['font_size' => 'text-5xl lg:text-7xl'],
                'mobile' => ['font_size' => 'text-3xl sm:text-4xl'],
            ],
        ]);

        // Slide 2 Layer 3: Description
        SlideLayer::create([
            'slide_id' => $slide2->id,
            'type' => SlideLayer::TYPE_DESCRIPTION,
            'name' => 'Process Description',
            'sort_order' => 3,
            'z_index' => 10,
            'is_visible' => true,
            'content' => [
                'text' => 'From open-bench quarrying through precise calibration, edge treatment, and global transport to final installation.',
                'color' => 'rgba(255, 255, 255, 0.85)',
                'font_family' => 'Montserrat',
            ],
            'positioning' => [
                'horizontal_align' => 'left',
                'max_width' => '54ch',
            ],
            'animation' => [
                'entrance' => 'fade-up',
                'duration' => 0.8,
                'delay' => 0.35,
                'ease' => 'power3.out',
            ],
        ]);

        // Slide 2 Layer 4: CTAs
        SlideLayer::create([
            'slide_id' => $slide2->id,
            'type' => SlideLayer::TYPE_CTA,
            'name' => 'Process Action Buttons',
            'sort_order' => 4,
            'z_index' => 10,
            'is_visible' => true,
            'content' => [
                'primary_label' => 'Explore the Process',
                'primary_url' => '/from-source-to-space',
                'primary_variant' => 'primary',
                'secondary_label' => 'Explore Projects',
                'secondary_url' => '/projects',
                'secondary_variant' => 'secondary',
            ],
            'positioning' => ['horizontal_align' => 'left'],
            'animation' => [
                'entrance' => 'fade-up',
                'duration' => 0.8,
                'delay' => 0.5,
                'ease' => 'power3.out',
            ],
        ]);

        // =========================================================================
        // SLIDE 03: Considered Material Curation
        // =========================================================================
        $slide3 = Slide::create([
            'slider_id' => $slider->id,
            'title' => 'Slide 03 — Material Collections',
            'status' => Slide::STATUS_PUBLISHED,
            'sort_order' => 3,
            'duration' => 6500,
            'transition' => 'fade',
            'background_type' => 'image',
            'background_image' => '/images/elior/homepage/slider-slide-03.webp',
            'background_color' => '#0F0F0F',
            'background_position' => 'center center',
            'background_size' => 'cover',
            'overlay_type' => 'gradient',
            'overlay_opacity' => 45,
            'content_alignment' => 'left',
            'content_width' => 'standard',
            'vertical_position' => 'center',
            'parallax_enabled' => true,
            'parallax_intensity' => 0.15,
        ]);

        // Slide 3 Layer 1: Eyebrow
        SlideLayer::create([
            'slide_id' => $slide3->id,
            'type' => SlideLayer::TYPE_EYEBROW,
            'name' => 'Collections Eyebrow',
            'sort_order' => 1,
            'z_index' => 10,
            'is_visible' => true,
            'content' => [
                'text' => 'NINE CANONICAL COLLECTIONS',
                'secondary_text' => 'CURATED RESERVES',
                'color' => '#D4B381',
                'font_family' => 'Montserrat',
            ],
            'positioning' => ['horizontal_align' => 'left'],
            'animation' => [
                'entrance' => 'fade-up',
                'duration' => 0.8,
                'delay' => 0.1,
                'ease' => 'power3.out',
            ],
        ]);

        // Slide 3 Layer 2: Heading (H2)
        SlideLayer::create([
            'slide_id' => $slide3->id,
            'type' => SlideLayer::TYPE_HEADING,
            'name' => 'Collections Heading',
            'sort_order' => 2,
            'z_index' => 10,
            'is_visible' => true,
            'content' => [
                'text' => 'Curated Reserves for Discriminating Architecture',
                'tag' => 'h2',
                'color' => '#FFFFFF',
                'font_family' => 'Playfair Display',
            ],
            'positioning' => [
                'horizontal_align' => 'left',
                'max_width' => '24ch',
            ],
            'animation' => [
                'entrance' => 'fade-up',
                'duration' => 1.0,
                'delay' => 0.2,
                'ease' => 'power3.out',
            ],
            'responsive' => [
                'desktop' => ['font_size' => 'text-5xl lg:text-7xl'],
                'mobile' => ['font_size' => 'text-3xl sm:text-4xl'],
            ],
        ]);

        // Slide 3 Layer 3: Description
        SlideLayer::create([
            'slide_id' => $slide3->id,
            'type' => SlideLayer::TYPE_DESCRIPTION,
            'name' => 'Collections Description',
            'sort_order' => 3,
            'z_index' => 10,
            'is_visible' => true,
            'content' => [
                'text' => 'Italian Marble, Granites, Slate Stone, Limestones, Cobble Stones, Pebbles, Quartz, and Monolithic Sculptures.',
                'color' => 'rgba(255, 255, 255, 0.85)',
                'font_family' => 'Montserrat',
            ],
            'positioning' => [
                'horizontal_align' => 'left',
                'max_width' => '54ch',
            ],
            'animation' => [
                'entrance' => 'fade-up',
                'duration' => 0.8,
                'delay' => 0.35,
                'ease' => 'power3.out',
            ],
        ]);

        // Slide 3 Layer 4: CTAs
        SlideLayer::create([
            'slide_id' => $slide3->id,
            'type' => SlideLayer::TYPE_CTA,
            'name' => 'Collections Action Buttons',
            'sort_order' => 4,
            'z_index' => 10,
            'is_visible' => true,
            'content' => [
                'primary_label' => 'View All Collections',
                'primary_url' => '/collections',
                'primary_variant' => 'primary',
                'secondary_label' => 'Contact ELIOR',
                'secondary_url' => '/contact',
                'secondary_variant' => 'secondary',
            ],
            'positioning' => ['horizontal_align' => 'left'],
            'animation' => [
                'entrance' => 'fade-up',
                'duration' => 0.8,
                'delay' => 0.5,
                'ease' => 'power3.out',
            ],
        ]);
    }
}
