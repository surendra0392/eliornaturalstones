<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Generate dynamic XML sitemap for search engine crawlers.
     */
    public function index(): Response
    {
        $pages = \App\Models\Page::query()->where('is_published', true)->get()->keyBy('slug');

        $appUrl = rtrim((string) config('app.url', 'https://eliornaturalstones.com'), '/');

        $staticRoutes = [
            [
                'url' => route('home'),
                'lastmod' => $pages->get('home')?->updated_at?->toAtomString() ?? now()->toAtomString(),
                'priority' => '1.0',
                'changefreq' => 'weekly',
                'image' => $appUrl.'/images/elior/homepage/homepage-hero.webp',
                'image_title' => 'ELIOR Natural Stones — Architectural Natural Stone Gallery Hyderabad',
                'image_caption' => 'Curated Marble, Granite, Slate, and Architectural Stone Surfaces in Hyderabad, Andhra Pradesh & Telangana',
            ],
            [
                'url' => route('collections.index'),
                'lastmod' => $pages->get('collections')?->updated_at?->toAtomString() ?? now()->toAtomString(),
                'priority' => '0.9',
                'changefreq' => 'weekly',
                'image' => $appUrl.'/images/elior/collections/collections-hero.webp',
                'image_title' => 'Natural Stone Collections — Marble, Granite, Sandstone | ELIOR',
                'image_caption' => 'Nine canonical natural stone collections for contemporary architecture',
            ],
            [
                'url' => route('our-story'),
                'lastmod' => $pages->get('our-story')?->updated_at?->toAtomString() ?? now()->toAtomString(),
                'priority' => '0.8',
                'changefreq' => 'monthly',
                'image' => $appUrl.'/images/elior/our-story/elior-story-hero.webp',
                'image_title' => 'ELIOR Natural Stones Heritage & Quarry Extraction Legacy',
                'image_caption' => 'Three decades of quarry mastery and stone curation across India',
            ],
            [
                'url' => route('from-source-to-space'),
                'lastmod' => $pages->get('from-source-to-space')?->updated_at?->toAtomString() ?? now()->toAtomString(),
                'priority' => '0.8',
                'changefreq' => 'monthly',
                'image' => $appUrl.'/images/elior/process/source-to-space-hero.webp',
                'image_title' => 'From Source to Space — The 6-Stage Natural Stone Journey',
                'image_caption' => 'Quarry origin extraction, precision gangsaw processing, dry-lay inspection and transit',
            ],
            [
                'url' => route('projects'),
                'lastmod' => $pages->get('projects')?->updated_at?->toAtomString() ?? now()->toAtomString(),
                'priority' => '0.8',
                'changefreq' => 'monthly',
                'image' => $appUrl.'/images/elior/projects/projects-hero.jpg',
                'image_title' => 'Architectural Natural Stone Commissions & Private Villas in India',
                'image_caption' => 'Distinguished private residences and cultural pavilions executed with ELIOR stone reserves',
            ],
            [
                'url' => route('contact'),
                'lastmod' => $pages->get('contact')?->updated_at?->toAtomString() ?? now()->toAtomString(),
                'priority' => '0.8',
                'changefreq' => 'monthly',
                'image' => $appUrl.'/images/elior/contact/contact-hero.webp',
                'image_title' => 'Contact ELIOR Natural Stones Studio & Material Gallery Hyderabad',
                'image_caption' => 'Private material viewing showroom and specification desk in Hyderabad, Telangana',
            ],
        ];

        // Canonical natural stone collections (active only)
        $collections = Collection::query()
            ->where('is_active', true)
            ->with(['varieties' => fn ($q) => $q->where('is_active', true)])
            ->orderBy('sort_order')
            ->get();

        $collectionUrls = $collections->map(function (Collection $col) use ($appUrl) {
            $heroImg = $col->hero_image
                ? (str_starts_with($col->hero_image, 'http') ? $col->hero_image : $appUrl.'/'.ltrim($col->hero_image, '/'))
                : $appUrl.'/images/elior/collections/'.$col->slug.'.webp';

            return [
                'url' => route('collections.show', ['slug' => $col->slug]),
                'lastmod' => $col->updated_at?->toAtomString() ?? now()->toAtomString(),
                'priority' => '0.8',
                'changefreq' => 'weekly',
                'image' => $heroImg,
                'image_title' => $col->name.' Slabs & Architectural Surfaces | ELIOR Natural Stones',
                'image_caption' => $col->tagline ?? ($col->name.' architectural collection in Hyderabad, India'),
            ];
        });

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';

        foreach ($staticRoutes as $route) {
            $xml .= '<url>';
            $xml .= '<loc>'.htmlspecialchars($route['url'], ENT_XML1, 'UTF-8').'</loc>';
            if (! empty($route['lastmod'])) {
                $xml .= '<lastmod>'.$route['lastmod'].'</lastmod>';
            }
            $xml .= '<changefreq>'.$route['changefreq'].'</changefreq>';
            $xml .= '<priority>'.$route['priority'].'</priority>';
            if (! empty($route['image'])) {
                $xml .= '<image:image>';
                $xml .= '<image:loc>'.htmlspecialchars($route['image'], ENT_XML1, 'UTF-8').'</image:loc>';
                $xml .= '<image:title>'.htmlspecialchars($route['image_title'], ENT_XML1, 'UTF-8').'</image:title>';
                $xml .= '<image:caption>'.htmlspecialchars($route['image_caption'], ENT_XML1, 'UTF-8').'</image:caption>';
                $xml .= '</image:image>';
            }
            $xml .= '</url>';
        }

        foreach ($collectionUrls as $colRoute) {
            $xml .= '<url>';
            $xml .= '<loc>'.htmlspecialchars($colRoute['url'], ENT_XML1, 'UTF-8').'</loc>';
            $xml .= '<lastmod>'.$colRoute['lastmod'].'</lastmod>';
            $xml .= '<changefreq>'.$colRoute['changefreq'].'</changefreq>';
            $xml .= '<priority>'.$colRoute['priority'].'</priority>';
            if (! empty($colRoute['image'])) {
                $xml .= '<image:image>';
                $xml .= '<image:loc>'.htmlspecialchars($colRoute['image'], ENT_XML1, 'UTF-8').'</image:loc>';
                $xml .= '<image:title>'.htmlspecialchars($colRoute['image_title'], ENT_XML1, 'UTF-8').'</image:title>';
                $xml .= '<image:caption>'.htmlspecialchars($colRoute['image_caption'], ENT_XML1, 'UTF-8').'</image:caption>';
                $xml .= '</image:image>';
            }
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=utf-8',
        ]);
    }
}
