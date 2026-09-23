<?php

use App\Models\Collection;
use App\Models\Page;
use App\Models\Setting;
use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\CollectionSeeder;
use Database\Seeders\PageSeeder;
use Database\Seeders\SettingSeeder;
use Database\Seeders\VarietySeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    if (Collection::count() === 0) {
        $this->seed(CollectionSeeder::class);
        $this->seed(VarietySeeder::class);
    }
    if (User::where('email', 'admin@eliornaturalstones.com')->count() === 0) {
        $this->seed(AdminUserSeeder::class);
    }
    if (Setting::count() === 0) {
        $this->seed(SettingSeeder::class);
    }
    if (Page::where('slug', 'our-story')->count() === 0) {
        $this->seed(PageSeeder::class);
    }
});

test('01: HandleInertiaRequests shares appUrl and siteSettings', function () {
    $response = $this->get('/');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->has('appUrl')
        ->has('siteSettings')
        ->where('appUrl', rtrim((string) config('app.url', ''), '/'))
    );
});

test('02: Baseline Blade template contains global robots crawler directive', function () {
    $response = $this->get('/');

    $response->assertOk();
    $content = $response->getContent();

    expect($content)->toContain('<meta name="robots" content="index, follow">');
    expect($content)->toContain('ELIOR Natural Stones');
});

test('03: All 15 canonical public routes return 200 OK and valid Inertia components', function () {
    $canonicalSlugs = [
        'italian-marble',
        'granites',
        'slate-stone',
        'limestones',
        'sandstone',
        'cobble-stones',
        'pebbles',
        'quartz',
        'sculptures',
    ];

    // 1. Home
    $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page->component('frontend/Home'));

    // 2. Collections Index
    $this->get('/collections')->assertOk()->assertInertia(fn (Assert $page) => $page->component('frontend/Collections/Index'));

    // 3-11. Nine Canonical Collection Detail pages
    foreach ($canonicalSlugs as $slug) {
        $this->get('/collections/'.$slug)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('frontend/Collections/Show')
                ->has('collection')
                ->where('collection.slug', $slug)
            );
    }

    // 12. Our Story
    $this->get('/our-story')->assertOk()->assertInertia(fn (Assert $page) => $page->component('frontend/OurStory'));

    // 13. From Source to Space
    $this->get('/from-source-to-space')->assertOk()->assertInertia(fn (Assert $page) => $page->component('frontend/FromSourceToSpace'));

    // 14. Projects
    $this->get('/projects')->assertOk()->assertInertia(fn (Assert $page) => $page->component('frontend/Projects'));

    // 15. Contact
    $this->get('/contact')->assertOk()->assertInertia(fn (Assert $page) => $page->component('frontend/Contact'));
});

test('04: Strict 404 guardrails are active for prohibited routes', function () {
    $this->get('/admin/projects')->assertNotFound();
    $this->get('/non-existent-page')->assertNotFound();
});

test('05: Dynamic XML sitemap contains all 15 canonical URLs and zero prohibited routes', function () {
    $response = $this->get('/sitemap.xml');
    $response->assertOk();
    $content = $response->getContent();

    // 6 static routes
    expect($content)->toContain('<loc>'.route('home').'</loc>');
    expect($content)->toContain('<loc>'.route('collections.index').'</loc>');
    expect($content)->toContain('<loc>'.route('our-story').'</loc>');
    expect($content)->toContain('<loc>'.route('from-source-to-space').'</loc>');
    expect($content)->toContain('<loc>'.route('projects').'</loc>');
    expect($content)->toContain('<loc>'.route('contact').'</loc>');

    // Canonical collections
    $canonicalSlugs = [
        'italian-marble',
        'granites',
        'slate-stone',
        'limestones',
        'sandstone',
        'cobble-stones',
        'pebbles',
        'quartz',
        'sculptures',
    ];

    foreach ($canonicalSlugs as $slug) {
        expect($content)->toContain('/collections/'.$slug);
    }

    // Zero prohibited routes
    expect($content)->not->toContain('/architect-designer-services');
    expect($content)->not->toContain('/admin');
});

test('06: Collection SEO precedence provides custom meta_title and meta_description', function () {
    $collection = Collection::where('slug', 'italian-marble')->firstOrFail();
    $collection->update([
        'meta_title' => 'Custom Italian Marble SEO Title | ELIOR',
        'meta_description' => 'Custom Italian Marble SEO Description curated for testing.',
    ]);

    $response = $this->get('/collections/italian-marble');
    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('frontend/Collections/Show')
        ->where('collection.meta_title', 'Custom Italian Marble SEO Title | ELIOR')
        ->where('collection.meta_description', 'Custom Italian Marble SEO Description curated for testing.')
    );
});

test('07: CMS Page SEO precedence provides custom meta_title and meta_description', function () {
    $page = Page::firstOrCreate(
        ['slug' => 'our-story'],
        ['title' => 'Our Story', 'is_published' => true]
    );
    $page->update([
        'meta_title' => 'Custom Our Story SEO Title | ELIOR',
        'meta_description' => 'Custom Our Story SEO Description.',
    ]);

    $response = $this->get('/our-story');
    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('frontend/OurStory')
        ->where('cmsContent.meta_title', 'Custom Our Story SEO Title | ELIOR')
        ->where('cmsContent.meta_description', 'Custom Our Story SEO Description.')
    );
});

test('08: Baseline Blade SSR renders rich OpenGraph, Twitter, and canonical tags for crawlers', function () {
    $routes = [
        '/',
        '/collections',
        '/collections/sandstone',
        '/our-story',
        '/from-source-to-space',
        '/projects',
        '/contact',
    ];

    foreach ($routes as $route) {
        $response = $this->get($route);
        $response->assertOk();
        $content = $response->getContent();

        // Canonical link verification
        expect($content)->toContain('<link rel="canonical"');

        // OpenGraph metadata verification
        expect($content)->toContain('<meta property="og:site_name" content="ELIOR Natural Stones">');
        expect($content)->toContain('<meta property="og:type" content="website">');
        expect($content)->toContain('<meta property="og:title"');
        expect($content)->toContain('<meta property="og:description"');
        expect($content)->toContain('<meta property="og:image"');

        // Twitter Card verification
        expect($content)->toContain('<meta name="twitter:card" content="summary_large_image">');
        expect($content)->toContain('<meta name="twitter:title"');
        expect($content)->toContain('<meta name="twitter:description"');
        expect($content)->toContain('<meta name="twitter:image"');

        // Theme and Crawler directives
        expect($content)->toContain('<meta name="theme-color" content="#0F0F0F">');
        expect($content)->toContain('<meta name="robots" content="index, follow">');
    }
});

test('09: Sand Stone collection is fully represented in dynamic XML sitemap with lastmod', function () {
    $response = $this->get('/sitemap.xml');
    $response->assertOk();
    $content = $response->getContent();

    expect($content)->toContain('/collections/sandstone</loc>');
    expect($content)->toContain('<lastmod>');
    expect($content)->toContain('<priority>0.8</priority>');
});

test('10: Robots.txt allows all canonical public routes and welcoming AI search crawlers', function () {
    $robotsPath = public_path('robots.txt');
    expect(\Illuminate\Support\Facades\File::exists($robotsPath))->toBeTrue();

    $content = \Illuminate\Support\Facades\File::get($robotsPath);
    expect($content)->toContain('User-agent: GPTBot');
    expect($content)->toContain('User-agent: ClaudeBot');
    expect($content)->toContain('User-agent: PerplexityBot');
    expect($content)->toContain('Disallow: /admin/');
    expect($content)->toContain('Disallow: /api/');
});
