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

        $staticRoutes = [
            ['url' => route('home'), 'lastmod' => $pages->get('home')?->updated_at?->toAtomString() ?? now()->toAtomString(), 'priority' => '1.0', 'changefreq' => 'weekly'],
            ['url' => route('collections.index'), 'lastmod' => $pages->get('collections')?->updated_at?->toAtomString() ?? now()->toAtomString(), 'priority' => '0.9', 'changefreq' => 'weekly'],
            ['url' => route('our-story'), 'lastmod' => $pages->get('our-story')?->updated_at?->toAtomString() ?? now()->toAtomString(), 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['url' => route('from-source-to-space'), 'lastmod' => $pages->get('from-source-to-space')?->updated_at?->toAtomString() ?? now()->toAtomString(), 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['url' => route('architect-designer-services'), 'lastmod' => $pages->get('architect-designer-services')?->updated_at?->toAtomString() ?? now()->toAtomString(), 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['url' => route('contact'), 'lastmod' => $pages->get('contact')?->updated_at?->toAtomString() ?? now()->toAtomString(), 'priority' => '0.8', 'changefreq' => 'monthly'],
        ];

        // Canonical natural stone collections (active only)
        $collections = Collection::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $collectionUrls = $collections->map(fn (Collection $col) => [
            'url' => route('collections.show', ['slug' => $col->slug]),
            'lastmod' => $col->updated_at?->toAtomString() ?? now()->toAtomString(),
            'priority' => '0.8',
            'changefreq' => 'weekly',
        ]);

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        foreach ($staticRoutes as $route) {
            $xml .= '<url>';
            $xml .= '<loc>'.htmlspecialchars($route['url'], ENT_XML1, 'UTF-8').'</loc>';
            if (! empty($route['lastmod'])) {
                $xml .= '<lastmod>'.$route['lastmod'].'</lastmod>';
            }
            $xml .= '<changefreq>'.$route['changefreq'].'</changefreq>';
            $xml .= '<priority>'.$route['priority'].'</priority>';
            $xml .= '</url>';
        }

        foreach ($collectionUrls as $colRoute) {
            $xml .= '<url>';
            $xml .= '<loc>'.htmlspecialchars($colRoute['url'], ENT_XML1, 'UTF-8').'</loc>';
            $xml .= '<lastmod>'.$colRoute['lastmod'].'</lastmod>';
            $xml .= '<changefreq>'.$colRoute['changefreq'].'</changefreq>';
            $xml .= '<priority>'.$colRoute['priority'].'</priority>';
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=utf-8',
        ]);
    }
}
