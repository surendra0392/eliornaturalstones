<?php

use App\Models\Collection;
use App\Models\Page;
use App\Models\Setting;
use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\CollectionSeeder;
use Database\Seeders\SettingSeeder;
use Database\Seeders\VarietySeeder;
use Illuminate\Support\Facades\Hash;
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
});

test('01: Admin Settings index is accessible to authorized Admin', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->get('/admin/settings');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/Settings')
            ->has('initialSettings')
            ->has('initialSettings.general')
            ->has('initialSettings.branding')
            ->has('initialSettings.contact')
            ->has('initialSettings.seo')
            ->has('initialSettings.social')
        );
});

test('02: Unauthenticated access to /admin/settings is redirected to login', function () {
    $response = $this->get('/admin/settings');
    $response->assertRedirect('/admin/login');
});

test('03: Non-admin access to /admin/settings is rejected with 403 Forbidden', function () {
    $regularUser = User::create([
        'name' => 'Trade Specifier',
        'email' => 'specifier.settings@atelier-rossi.it',
        'password' => Hash::make('password'),
        'is_admin' => false,
    ]);

    $response = $this->actingAs($regularUser)->get('/admin/settings');
    $response->assertForbidden();
});

test('04: Settings API endpoint /api/v1/admin/settings returns valid envelope with groups', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->getJson('/api/v1/admin/settings');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                'general',
                'branding',
                'contact',
                'seo',
                'social',
            ],
            'public_settings',
            'message',
        ]);
});

test('05: Unauthenticated and non-admin access to /api/v1/admin/settings is blocked', function () {
    // Unauthenticated
    $response = $this->getJson('/api/v1/admin/settings');
    $response->assertUnauthorized();

    // Non-admin
    $regularUser = User::create([
        'name' => 'Unauthorized Client',
        'email' => 'client@architecture.co.uk',
        'password' => Hash::make('password'),
        'is_admin' => false,
    ]);

    $response2 = $this->actingAs($regularUser)->getJson('/api/v1/admin/settings');
    $response2->assertForbidden();
});

test('06: Updating settings via PATCH persists modifications in database', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->patchJson('/api/v1/admin/settings', [
        'group' => 'general',
        'settings' => [
            'site_name' => 'ELIOR Architectural Stones',
            'brand_descriptor' => 'Noble Quarry Selections & Monumental Slabs',
        ],
    ]);

    $response->assertOk()
        ->assertJson([
            'message' => 'General Settings updated successfully.',
        ]);

    expect(Setting::get('site_name'))->toBe('ELIOR Architectural Stones');
    expect(Setting::get('brand_descriptor'))->toBe('Noble Quarry Selections & Monumental Slabs');
});

test('07: Saving one group preserves settings in unrelated groups', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    // Ensure initial contact email exists
    Setting::set('primary_email', 'initial@eliornaturalstones.com', 'contact');

    // Update only general group
    $this->actingAs($admin)->patchJson('/api/v1/admin/settings', [
        'group' => 'general',
        'settings' => [
            'default_location' => 'Hyderabad Gallery & Atelier',
        ],
    ])->assertOk();

    // Assert general setting updated and contact setting preserved intact
    expect(Setting::get('default_location'))->toBe('Hyderabad Gallery & Atelier');
    expect(Setting::get('primary_email'))->toBe('initial@eliornaturalstones.com');
});

test('08: Validation rejects invalid emails', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->patchJson('/api/v1/admin/settings', [
        'group' => 'contact',
        'settings' => [
            'primary_email' => 'not-an-email-address',
        ],
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['settings.primary_email']);
});

test('09: Validation rejects invalid URLs and malicious protocols', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    // Malicious javascript protocol
    $response = $this->actingAs($admin)->patchJson('/api/v1/admin/settings', [
        'group' => 'social',
        'settings' => [
            'instagram_url' => 'javascript:alert(1)',
        ],
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['settings.instagram_url']);
});

test('10: Validation rejects non-existent media references', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->patchJson('/api/v1/admin/settings', [
        'group' => 'branding',
        'settings' => [
            'logo_media_id' => [
                'id' => 99999999, // non-existent
                'url' => 'https://example.com/bogus.jpg',
            ],
        ],
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['settings.logo_media_id']);
});

test('11: Validation strictly rejects arbitrary key injection', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->patchJson('/api/v1/admin/settings', [
        'group' => 'general',
        'settings' => [
            'injected_malicious_key' => 'malicious_value',
        ],
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['settings.injected_malicious_key']);
});

test('12: Validation rejects executable script injection in settings values', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->patchJson('/api/v1/admin/settings', [
        'group' => 'seo',
        'settings' => [
            'default_meta_title' => 'ELIOR <script>alert("xss")</script>',
        ],
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['settings.default_meta_title']);
});

test('13: HandleInertiaRequests shares safe siteSettings and never leaks private config', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    // Create a mock private setting
    Setting::updateOrCreate(
        ['key' => 'internal_admin_token'],
        [
            'group' => 'general',
            'type' => 'text',
            'value' => 'secret-value-12345',
            'is_public' => false,
            'description' => 'Super secret system token',
        ]
    );

    $response = $this->actingAs($admin)->get('/admin/dashboard');
    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('siteSettings')
            ->missing('siteSettings.internal_admin_token')
        );
});

test('14: Settings API updates return clean JSON with fresh key-values', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->patchJson('/api/v1/admin/settings', [
        'group' => 'contact',
        'settings' => [
            'enquiry_phone' => '+91 99887 76655',
            'enquiry_email' => 'concierge@eliornaturalstones.com',
        ],
    ]);

    $response->assertOk()
        ->assertJsonStructure([
            'data',
            'public_settings',
            'message',
        ]);

    expect($response->json('public_settings.enquiry_phone'))->toBe('+91 99887 76655');
    expect($response->json('public_settings.enquiry_email'))->toBe('concierge@eliornaturalstones.com');
});

test('15: Regressions: all canonical collections remain intact, Projects returns 404', function () {
    // Check canonical collections
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

    $collections = Collection::orderBy('sort_order')->get();
    expect($collections)->toHaveCount(9);

    foreach ($canonicalSlugs as $slug) {
        expect($collections->pluck('slug'))->toContain($slug);
    }

    // Sandstone exists in database
    expect(Collection::where('slug', 'sandstone')->exists())->toBeTrue();

    // Projects route is canonical 200 and /admin/projects returns 404
    $this->get('/projects')->assertOk();
    $this->get('/admin/projects')->assertNotFound();
});
