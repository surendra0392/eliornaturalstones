<?php

use App\Models\Collection;
use App\Models\User;
use App\Models\Variety;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\CollectionSeeder;
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
});

test('01: Admin Collections page is accessible to authorized Admin', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->get('/admin/collections');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/Collections')
            ->has('initialCollections')
        );
});

test('02: Unauthenticated access to /admin/collections is rejected and redirects to login', function () {
    $response = $this->get('/admin/collections');
    $response->assertRedirect('/admin/login');
});

test('03: Non-admin access to /admin/collections is rejected with 403 Forbidden', function () {
    $regularUser = User::create([
        'name' => 'Trade User',
        'email' => 'trade@studio.com',
        'password' => Hash::make('password'),
        'is_admin' => false,
    ]);

    $response = $this->actingAs($regularUser)->get('/admin/collections');
    $response->assertForbidden();
});

test('04: Collection list endpoint /api/v1/admin/collections works and returns valid JSON envelope', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)
        ->getJson('/api/v1/admin/collections');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'slug',
                    'tagline',
                    'description',
                    'sort_order',
                    'is_active',
                    'varieties_count',
                ],
            ],
            'meta' => [
                'current_page',
                'last_page',
                'per_page',
                'total',
            ],
            'message',
        ]);
});

test('05: Collection detail endpoint /api/v1/admin/collections/{id} works', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $collection = Collection::where('slug', 'italian-marble')->firstOrFail();

    $response = $this->actingAs($admin)
        ->getJson("/api/v1/admin/collections/{$collection->id}");

    $response->assertOk()
        ->assertJsonPath('data.id', $collection->id)
        ->assertJsonPath('data.slug', 'italian-marble')
        ->assertJsonPath('data.name', 'Italian Marble');
});

test('06: Search works by collection name and slug', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    // Search by name
    $responseName = $this->actingAs($admin)
        ->getJson('/api/v1/admin/collections?search=Granites');

    $responseName->assertOk()
        ->assertJsonPath('meta.total', 1)
        ->assertJsonPath('data.0.slug', 'granites');

    // Search by slug
    $responseSlug = $this->actingAs($admin)
        ->getJson('/api/v1/admin/collections?search=slate-stone');

    $responseSlug->assertOk()
        ->assertJsonPath('meta.total', 1)
        ->assertJsonPath('data.0.slug', 'slate-stone');
});

test('07: Status filtering works correctly (all, active, inactive)', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    // Temporarily mark one collection inactive
    $collection = Collection::where('slug', 'sculptures')->firstOrFail();
    $collection->update(['is_active' => false]);

    // Filter: active
    $activeRes = $this->actingAs($admin)
        ->getJson('/api/v1/admin/collections?status=active');
    $activeRes->assertOk();
    $activeSlugs = collect($activeRes->json('data'))->pluck('slug');
    expect($activeSlugs)->not->toContain('sculptures');

    // Filter: inactive
    $inactiveRes = $this->actingAs($admin)
        ->getJson('/api/v1/admin/collections?status=inactive');
    $inactiveRes->assertOk();
    $inactiveSlugs = collect($inactiveRes->json('data'))->pluck('slug');
    expect($inactiveSlugs)->toContain('sculptures');

    // Restore
    $collection->update(['is_active' => true]);
});

test('08: Pagination and response metadata work properly', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)
        ->getJson('/api/v1/admin/collections?per_page=3');

    $response->assertOk()
        ->assertJsonPath('meta.per_page', 3)
        ->assertJsonPath('meta.current_page', 1);

    expect(count($response->json('data')))->toBe(3);
});

test('09: Create validation rejects missing or invalid required data with 422', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)
        ->postJson('/api/v1/admin/collections', [
            'name' => '',
            'slug' => '',
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'slug']);
});

test('10: Valid collection creation works and stores record in database', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)
        ->postJson('/api/v1/admin/collections', [
            'name' => 'Travertine Reserve',
            'slug' => 'travertine-reserve',
            'tagline' => 'Warm porous calcitic marvels',
            'description' => 'Architectural travertine selected for classical facade relief.',
            'sort_order' => 9,
            'is_active' => true,
        ]);

    $response->assertStatus(201)
        ->assertJsonPath('data.slug', 'travertine-reserve');

    $this->assertDatabaseHas('collections', [
        'slug' => 'travertine-reserve',
        'name' => 'Travertine Reserve',
    ]);

    // Cleanup created test collection
    Collection::where('slug', 'travertine-reserve')->delete();
});

test('11: Duplicate slug is rejected with 422 validation error', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)
        ->postJson('/api/v1/admin/collections', [
            'name' => 'Another Italian Marble',
            'slug' => 'italian-marble', // Already exists
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['slug']);
});

test('12: Edit validation works when updating with invalid data', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $collection = Collection::where('slug', 'quartz')->firstOrFail();

    $response = $this->actingAs($admin)
        ->putJson("/api/v1/admin/collections/{$collection->id}", [
            'name' => '',
            'sort_order' => -5,
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'sort_order']);
});

test('13: Valid collection update persists changes to database', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $collection = Collection::where('slug', 'quartz')->firstOrFail();

    $originalTagline = $collection->tagline;

    $response = $this->actingAs($admin)
        ->putJson("/api/v1/admin/collections/{$collection->id}", [
            'tagline' => 'Ultra-dense quartz surfaces engineered by tectonic pressure',
        ]);

    $response->assertOk()
        ->assertJsonPath('data.tagline', 'Ultra-dense quartz surfaces engineered by tectonic pressure');

    $this->assertDatabaseHas('collections', [
        'id' => $collection->id,
        'tagline' => 'Ultra-dense quartz surfaces engineered by tectonic pressure',
    ]);

    // Restore original tagline
    $collection->update(['tagline' => $originalTagline]);
});

test('14: Status update endpoint toggles is_active', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $collection = Collection::where('slug', 'pebbles')->firstOrFail();

    // Deactivate
    $deactivateRes = $this->actingAs($admin)
        ->patchJson("/api/v1/admin/collections/{$collection->id}/status", [
            'is_active' => false,
        ]);

    $deactivateRes->assertOk()
        ->assertJsonPath('data.is_active', false);

    expect($collection->fresh()->is_active)->toBeFalse();

    // Re-activate
    $activateRes = $this->actingAs($admin)
        ->patchJson("/api/v1/admin/collections/{$collection->id}/status", [
            'is_active' => true,
        ]);

    $activateRes->assertOk()
        ->assertJsonPath('data.is_active', true);

    expect($collection->fresh()->is_active)->toBeTrue();
});

test('15: Display order update endpoint modifies sort_order in database', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $collection = Collection::where('slug', 'granites')->firstOrFail();
    $originalOrder = $collection->sort_order;

    $response = $this->actingAs($admin)
        ->patchJson("/api/v1/admin/collections/{$collection->id}/order", [
            'sort_order' => 15,
        ]);

    $response->assertOk()
        ->assertJsonPath('data.sort_order', 15);

    expect($collection->fresh()->sort_order)->toBe(15);

    // Restore original order
    $collection->update(['sort_order' => $originalOrder]);
});

test('16: Safe deletion prevents deleting canonical collections and collections with varieties', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $canonicalCollection = Collection::where('slug', 'italian-marble')->firstOrFail();

    // 1. Attempt deleting canonical collection is rejected
    $canonicalRes = $this->actingAs($admin)
        ->deleteJson("/api/v1/admin/collections/{$canonicalCollection->id}");

    $canonicalRes->assertStatus(422)
        ->assertJsonValidationErrors(['collection']);

    // 2. Attempt deleting non-canonical collection with varieties is rejected
    $customCollection = Collection::create([
        'name' => 'Bespoke Basalt',
        'slug' => 'bespoke-basalt',
        'is_active' => true,
        'sort_order' => 20,
    ]);

    Variety::create([
        'collection_id' => $customCollection->id,
        'name' => 'Basalt Noir',
        'slug' => 'basalt-noir',
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $varietyRes = $this->actingAs($admin)
        ->deleteJson("/api/v1/admin/collections/{$customCollection->id}");

    $varietyRes->assertStatus(422)
        ->assertJsonValidationErrors(['collection']);

    // 3. Deleting an empty non-canonical collection succeeds
    Variety::where('slug', 'basalt-noir')->delete();
    $deleteRes = $this->actingAs($admin)
        ->deleteJson("/api/v1/admin/collections/{$customCollection->id}");

    $deleteRes->assertOk();
    $this->assertDatabaseMissing('collections', ['slug' => 'bespoke-basalt']);
});

test('17: Unauthorized mutation is rejected for unauthenticated and non-admin requests', function () {
    $collection = Collection::where('slug', 'italian-marble')->firstOrFail();

    // Unauthenticated POST
    $this->postJson('/api/v1/admin/collections', ['name' => 'Test', 'slug' => 'test'])
        ->assertUnauthorized();

    // Unauthenticated PUT
    $this->putJson("/api/v1/admin/collections/{$collection->id}", ['name' => 'Hacked'])
        ->assertUnauthorized();

    // Unauthenticated DELETE
    $this->deleteJson("/api/v1/admin/collections/{$collection->id}")
        ->assertUnauthorized();

    // Non-admin user
    $regularUser = User::create([
        'name' => 'Regular User 2',
        'email' => 'regular2@test.com',
        'password' => Hash::make('password'),
        'is_admin' => false,
    ]);

    $this->actingAs($regularUser)
        ->postJson('/api/v1/admin/collections', ['name' => 'Test', 'slug' => 'test'])
        ->assertForbidden();

    $this->actingAs($regularUser)
        ->putJson("/api/v1/admin/collections/{$collection->id}", ['name' => 'Hacked'])
        ->assertForbidden();

    $this->actingAs($regularUser)
        ->deleteJson("/api/v1/admin/collections/{$collection->id}")
        ->assertForbidden();
});

test('18: Exactly eight canonical collections remain available in the system', function () {
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

    $existingSlugs = Collection::whereIn('slug', $canonicalSlugs)->pluck('slug')->all();

    expect(count($existingSlugs))->toBe(9);
    foreach ($canonicalSlugs as $slug) {
        expect($existingSlugs)->toContain($slug);
    }
});

test('19: Sand Stone is a valid collection and reserved slugs are rejected', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    // Verify Sand Stone exists
    expect(Collection::where('slug', 'sandstone')->exists())->toBeTrue();

    // Rejection of reserved slug: projects
    $resBySlug = $this->actingAs($admin)
        ->postJson('/api/v1/admin/collections', [
            'name' => 'New Projects',
            'slug' => 'projects',
        ]);
    $resBySlug->assertStatus(422)
        ->assertJsonValidationErrors(['slug']);
});

test('20: Public /collections reflects database changes', function () {
    $collection = Collection::where('slug', 'sculptures')->firstOrFail();

    // 1. Deactivating hides it from public collections page
    $collection->update(['is_active' => false]);

    $response = $this->get('/collections');
    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/Collections/Index')
            ->has('collections', 8)
            ->where('collections', fn ($colls) => ! collect($colls)->contains('slug', 'sculptures'))
        );

    // 2. Reactivating brings it back
    $collection->update(['is_active' => true]);

    $responseActive = $this->get('/collections');
    $responseActive->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/Collections/Index')
            ->has('collections', 9)
            ->where('collections', fn ($colls) => collect($colls)->contains('slug', 'sculptures'))
        );
});

test('21: Public collection detail route remains functional', function () {
    $response = $this->get('/collections/italian-marble');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/Collections/Show')
            ->where('collection.slug', 'italian-marble')
        );
});

test('22: /projects and /admin/projects strictly return HTTP 404', function () {
    $this->get('/projects')->assertNotFound();
    $this->get('/admin/projects')->assertNotFound();
});

test('23: Existing Admin authentication remains functional', function () {
    $response = $this->post('/admin/login', [
        'email' => 'admin@eliornaturalstones.com',
        'password' => 'password',
    ]);

    $response->assertRedirect('/admin/dashboard');
    $this->assertAuthenticated();
});

test('24: Existing public pages remain functional with HTTP 200', function (string $route) {
    $this->get($route)->assertOk();
})->with([
    '/',
    '/collections',
    '/collections/italian-marble',
    '/collections/granites',
    '/collections/slate-stone',
    '/collections/limestones',
    '/collections/cobble-stones',
    '/collections/pebbles',
    '/collections/quartz',
    '/collections/sculptures',
    '/our-story',
    '/from-source-to-space',
    '/architect-designer-services',
    '/contact',
]);
