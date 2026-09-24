<?php

use App\Models\Collection;
use App\Models\Setting;
use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\CollectionSeeder;
use Database\Seeders\SettingSeeder;
use Database\Seeders\VarietySeeder;
use Illuminate\Support\Facades\File;

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
});

test('01: Dynamic XML Sitemap is available and properly formatted', function () {
    $response = $this->get('/sitemap.xml');

    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/xml; charset=utf-8');

    $content = $response->getContent();
    expect($content)->toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect($content)->toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect($content)->toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');

    // Static public routes
    expect($content)->toContain('<loc>'.route('home').'</loc>');
    expect($content)->toContain('<loc>'.route('collections.index').'</loc>');
    expect($content)->toContain('<loc>'.route('our-story').'</loc>');
    expect($content)->toContain('<loc>'.route('from-source-to-space').'</loc>');
    expect($content)->toContain('<loc>'.route('projects').'</loc>');
    expect($content)->toContain('<loc>'.route('contact').'</loc>');

    // 8 canonical collections
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

    // Critical exclusions
    expect($content)->not->toContain('/architect-designer-services');
    expect($content)->not->toContain('/admin');
    expect($content)->not->toContain('/api');
});

test('02: robots.txt disallows admin and api routes and points to sitemap', function () {
    $robotsPath = public_path('robots.txt');
    expect(File::exists($robotsPath))->toBeTrue();

    $content = File::get($robotsPath);
    expect($content)->toContain('Disallow: /admin/');
    expect($content)->toContain('Disallow: /api/');
    expect($content)->toContain('Sitemap: https://eliornaturalstones.com/sitemap.xml');
});

test('03: AdminUserSeeder refuses default password in production environment', function () {
    // Temporarily simulate production environment
    app()->detectEnvironment(fn () => 'production');

    // Without ADMIN_DEFAULT_PASSWORD or with default 'password', must throw RuntimeException
    expect(fn () => (new AdminUserSeeder)->run())
        ->toThrow(RuntimeException::class, 'PRODUCTION SECURITY VIOLATION');

    // Reset back to testing environment
    app()->detectEnvironment(fn () => 'testing');
});

test('04: Strict Route Guardrails: /admin/projects returns 404 and legacy route redirects', function () {
    $this->get('/admin/projects')->assertNotFound();
    $this->get('/architect-designer-services')->assertRedirect('/projects');
});

test('05: Security Headers are attached to all web responses', function () {
    $response = $this->get('/');

    $response->assertOk();
    $response->assertHeader('X-Content-Type-Options', 'nosniff');
    $response->assertHeader('X-Frame-Options', 'SAMEORIGIN');
    $response->assertHeader('X-XSS-Protection', '1; mode=block');
    $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    $response->assertHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
});

test('06: Public Enquiry creation does not expose internal audit metadata in response', function () {
    $response = $this->postJson('/api/v1/enquiries', [
        'name' => 'Alexander Wright',
        'email' => 'alexander.wright@wright-atelier.com',
        'phone' => '+44 20 7946 0999',
        'project_space' => 'Mayfair Penthouse',
        'enquiry_type' => 'Material Consultation',
        'collection' => 'Italian Marble',
        'message' => 'Specification review for Statuario marble master bathroom.',
    ]);

    $response->assertCreated();
    $response->assertJsonPath('data.name', 'Alexander Wright');
    $response->assertJsonPath('data.status', 'pending');

    // Verify IP and user agent are NOT leaked in API resource
    $data = $response->json('data');
    expect($data)->not->toHaveKey('ip_address');
    expect($data)->not->toHaveKey('user_agent');
});

test('07: Public Enquiry submission allows Sand Stone interest', function () {
    $response = $this->postJson('/api/v1/enquiries', [
        'name' => 'Alexander Wright',
        'email' => 'alexander.wright@wright-atelier.com',
        'phone' => '+44 20 7946 0999',
        'project_space' => 'Mayfair Penthouse',
        'enquiry_type' => 'Material Consultation',
        'collection' => 'Sand Stone',
        'message' => 'Seeking Indian Sandstone tiles.',
    ]);

    $response->assertCreated();
    $response->assertJsonPath('data.collection', 'Sand Stone');
});

test('08: All 9 canonical stone collections are seeded, active, and ordered', function () {
    $collections = Collection::orderBy('sort_order')->get();
    expect($collections)->toHaveCount(9);

    $expectedSlugs = [
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

    expect($collections->pluck('slug')->all())->toBe($expectedSlugs);

    foreach ($collections as $col) {
        expect($col->is_active)->toBeTrue();
        expect($col->varieties()->count())->toBeGreaterThan(0);
    }
});
