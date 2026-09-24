<?php

use App\Models\Collection;
use App\Models\Page;
use App\Models\Setting;
use App\Models\User;
use App\Models\Variety;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\CollectionSeeder;
use Database\Seeders\PageSeeder;
use Database\Seeders\SettingSeeder;
use Database\Seeders\VarietySeeder;

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

test('01: Canonical 9 collections are locked and active in exact order with zero Projects', function () {
    $expectedCollections = [
        ['slug' => 'italian-marble', 'name' => 'Marble', 'order' => 1],
        ['slug' => 'granites', 'name' => 'Granites', 'order' => 2],
        ['slug' => 'slate-stone', 'name' => 'Slate Stone', 'order' => 3],
        ['slug' => 'limestones', 'name' => 'Limestones', 'order' => 4],
        ['slug' => 'sandstone', 'name' => 'Sand Stone', 'order' => 5],
        ['slug' => 'cobble-stones', 'name' => 'Cobble Stones', 'order' => 6],
        ['slug' => 'pebbles', 'name' => 'Pebbles', 'order' => 7],
        ['slug' => 'quartz', 'name' => 'Quartz', 'order' => 8],
        ['slug' => 'sculptures', 'name' => 'Sculptures', 'order' => 9],
    ];

    $collections = Collection::orderBy('sort_order')->get();
    expect($collections)->toHaveCount(9);

    foreach ($expectedCollections as $index => $expected) {
        $actual = $collections[$index];
        expect($actual->slug)->toBe($expected['slug']);
        expect($actual->name)->toBe($expected['name']);
        expect($actual->sort_order)->toBe($expected['order']);
        expect($actual->is_active)->toBeTrue();
    }

    // Projects collection forbidden, sandstone exists
    expect(Collection::where('slug', 'sandstone')->exists())->toBeTrue();
    expect(Collection::where('slug', 'projects')->exists())->toBeFalse();
});

test('02: Route guardrails: canonical /projects returns 200 and /admin/projects returns 404', function () {
    $this->get('/projects')->assertOk();
    $this->get('/admin/projects')->assertNotFound();
});

test('03: Exact 36 authentic varieties are seeded with zero speculative lab specifications', function () {
    $varieties = Variety::with('collection')->get();
    expect($varieties)->toHaveCount(36);

    foreach ($varieties as $v) {
        expect($v->collection)->not->toBeNull();
        expect($v->name)->not->toBeEmpty();
        expect($v->slug)->not->toBeEmpty();
        expect($v->is_active)->toBeTrue();

        // Specifications must be empty or strictly non-speculative (no fake lab tests)
        $specs = $v->specifications ?? [];
        expect($specs)->toBeArray();
        foreach ($specs as $key => $val) {
            $text = strtolower(json_encode([$key => $val]));
            expect($text)->not->toContain('mpa');
            expect($text)->not->toContain('compressive strength');
            expect($text)->not->toContain('water absorption');
        }
    }

    // Verify Quartz varieties are engineered slabs
    $quartzVarieties = Variety::whereHas('collection', fn ($q) => $q->where('slug', 'quartz'))->get();
    expect($quartzVarieties)->toHaveCount(4);
    $quartzSlugs = $quartzVarieties->pluck('slug')->all();
    expect($quartzSlugs)->toContain('calacatta-nuvo-quartz');
    expect($quartzSlugs)->toContain('statuario-classic-quartz');
    expect($quartzSlugs)->toContain('eternal-charcoal-quartz');
    expect($quartzSlugs)->toContain('pure-blanco-quartz');

    foreach ($quartzVarieties as $qv) {
        expect(strtolower($qv->description))->toContain('slab');
    }

    // Verify Sand Stone varieties
    $sandstoneVarieties = Variety::whereHas('collection', fn ($q) => $q->where('slug', 'sandstone'))->get();
    expect($sandstoneVarieties)->toHaveCount(4);
    $sandstoneSlugs = $sandstoneVarieties->pluck('slug')->all();
    expect($sandstoneSlugs)->toContain('dholpur-beige-sandstone');
    expect($sandstoneSlugs)->toContain('rainbow-sandstone');
    expect($sandstoneSlugs)->toContain('teakwood-sandstone');
    expect($sandstoneSlugs)->toContain('mandana-stone');

    // Verify naming consistency
    expect(Variety::where('slug', 'viscon-white')->value('name'))->toBe('Viscon White');
    expect(Variety::where('slug', 'carrara-bianco')->value('name'))->toBe('Carrara Bianco');
    expect(Variety::where('slug', 'calacatta-gold')->value('name'))->toBe('Calacatta Gold');

    // Verify Sandstone Cobbles is an individual cobble variety, not a standalone collection
    $sandstoneCobble = Variety::where('slug', 'sandstone-cobbles')->first();
    expect($sandstoneCobble)->not->toBeNull();
    expect($sandstoneCobble->collection->slug)->toBe('cobble-stones');
});

test('04: Variety validation allows Sandstone Cobbles in cobble-stones collection and rejects reserved slugs', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $sandstone = Collection::where('slug', 'sandstone')->firstOrFail();

    // 1. Rejected: Using reserved slug 'projects'
    $this->actingAs($admin)
        ->postJson('/api/v1/admin/varieties', [
            'collection_id' => $sandstone->id,
            'name' => 'Special Projects Stone',
            'slug' => 'projects',
        ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['slug']);

    // 2. Allowed: Updating Sandstone Cobbles in cobble-stones collection
    $sandstoneCobble = Variety::where('slug', 'sandstone-cobbles')->firstOrFail();
    $this->actingAs($admin)
        ->putJson("/api/v1/admin/varieties/{$sandstoneCobble->id}", [
            'name' => 'Sandstone Cobbles',
            'description' => 'Updated authentic architectural hand-cut cobbles.',
        ])
        ->assertOk()
        ->assertJsonPath('data.name', 'Sandstone Cobbles');
});

test('05: Pages CMS contains the 5 published canonical editorial pages with authentic copy', function () {
    $expectedPages = ['home', 'our-story', 'from-source-to-space', 'projects', 'contact'];

    foreach ($expectedPages as $slug) {
        $page = Page::where('slug', $slug)->first();
        expect($page)->not->toBeNull();
        expect($page->is_published)->toBeTrue();
        expect($page->content)->toBeArray();
    }

    // Our Story timeline verification
    $storyPage = Page::where('slug', 'our-story')->firstOrFail();
    $milestones = $storyPage->content['timeline']['milestones'] ?? [];
    expect($milestones)->toHaveCount(4);
    expect($milestones[0]['year'])->toBe('1990');
    expect($milestones[0]['company'])->toBe('SSS Enterprises');
    expect($milestones[1]['year'])->toBe('2017');
    expect($milestones[1]['company'])->toBe('TEJ Natural Stones');
    expect($milestones[2]['year'])->toBe('2024');
    expect($milestones[2]['company'])->toBe('STONEX');
    expect($milestones[3]['year'])->toBe('TODAY');
    expect($milestones[3]['company'])->toBe('ELIOR');

    // From Source to Space stages verification
    $sourceToSpace = Page::where('slug', 'from-source-to-space')->firstOrFail();
    $stages = $sourceToSpace->content['journey']['stages'] ?? [];
    expect($stages)->toHaveCount(6);
    expect($stages[0]['title'])->toBe('QUARRIES');
    expect($stages[1]['title'])->toBe('PROCESSING');
    expect($stages[2]['title'])->toBe('SELECTION');
    expect($stages[3]['title'])->toBe('PACKAGING');

    // Projects commissions verification
    $projectsPage = Page::where('slug', 'projects')->firstOrFail();
    $projects = $projectsPage->content['projects'] ?? [];
    expect(count($projects))->toBeGreaterThanOrEqual(4);
    expect($projects[0]['title'])->toBe('The Courtyard Villa');
    expect($projects[1]['title'])->toBe('The Glass Pavilion & Gallery');
});

test('06: Site configuration settings are authentic and non-placeholder', function () {
    $settings = Setting::pluck('value', 'key');

    expect($settings['site_name'])->toBe('ELIOR');
    expect($settings['primary_phone'])->toContain('81259');
    expect($settings['primary_email'])->toBe('info@eliornaturalstones.com');
    expect($settings['default_location'])->toContain('Hyderabad');
});
