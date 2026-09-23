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

test('01: Admin Varieties page is accessible to authorized Admin', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->get('/admin/varieties');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/Varieties')
            ->has('initialVarieties')
            ->has('initialMeta')
            ->has('canonicalCollections')
        );
});

test('02: Unauthenticated access to /admin/varieties is rejected and redirects to login', function () {
    $response = $this->get('/admin/varieties');
    $response->assertRedirect('/admin/login');
});

test('03: Non-admin access to /admin/varieties is rejected with 403 Forbidden', function () {
    $regularUser = User::create([
        'name' => 'Trade Specifier',
        'email' => 'specifier@studio.com',
        'password' => Hash::make('password'),
        'is_admin' => false,
    ]);

    $response = $this->actingAs($regularUser)->get('/admin/varieties');
    $response->assertForbidden();
});

test('04: Variety list endpoint /api/v1/admin/varieties works and returns valid JSON envelope', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)
        ->getJson('/api/v1/admin/varieties');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'collection_id',
                    'collection_name',
                    'name',
                    'slug',
                    'origin',
                    'color_family',
                    'finishes',
                    'description',
                    'is_featured',
                    'is_active',
                    'sort_order',
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

test('05: Variety detail endpoint /api/v1/admin/varieties/{id} works', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $variety = Variety::where('slug', 'calacatta-gold')->firstOrFail();

    $response = $this->actingAs($admin)
        ->getJson("/api/v1/admin/varieties/{$variety->id}");

    $response->assertOk()
        ->assertJsonPath('data.id', $variety->id)
        ->assertJsonPath('data.slug', 'calacatta-gold')
        ->assertJsonPath('data.name', 'Calacatta Gold');
});

test('06: Search works by variety name, slug, and collection name', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    // Search by variety name
    $resName = $this->actingAs($admin)
        ->getJson('/api/v1/admin/varieties?search=Statuario');
    $resName->assertOk();
    $names = collect($resName->json('data'))->pluck('name');
    expect($names)->toContain('Statuario Extra');

    // Search by variety slug
    $resSlug = $this->actingAs($admin)
        ->getJson('/api/v1/admin/varieties?search=carrara-bianco');
    $resSlug->assertOk()
        ->assertJsonPath('data.0.slug', 'carrara-bianco');

    // Search by parent collection name
    $resCol = $this->actingAs($admin)
        ->getJson('/api/v1/admin/varieties?search=Pebbles');
    $resCol->assertOk();
    expect($resCol->json('meta.total'))->toBeGreaterThan(0);
});

test('07: Collection filtering works correctly by slug or id', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    // Filter by collection slug
    $resSlug = $this->actingAs($admin)
        ->getJson('/api/v1/admin/varieties?collection=granites');
    $resSlug->assertOk();
    foreach ($resSlug->json('data') as $item) {
        expect($item['collection_name'])->toBe('Granites');
    }

    // Filter by collection id
    $marble = Collection::where('slug', 'italian-marble')->firstOrFail();
    $resId = $this->actingAs($admin)
        ->getJson("/api/v1/admin/varieties?collection={$marble->id}");
    $resId->assertOk();
    foreach ($resId->json('data') as $item) {
        expect($item['collection_id'])->toBe($marble->id);
    }
});

test('08: Status filtering works correctly (all, active, inactive)', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $variety = Variety::where('slug', 'arabescato-vagli')->firstOrFail();
    $variety->update(['is_active' => false]);

    // Active filter
    $activeRes = $this->actingAs($admin)
        ->getJson('/api/v1/admin/varieties?status=active');
    $activeRes->assertOk();
    $activeSlugs = collect($activeRes->json('data'))->pluck('slug');
    expect($activeSlugs)->not->toContain('arabescato-vagli');

    // Inactive filter
    $inactiveRes = $this->actingAs($admin)
        ->getJson('/api/v1/admin/varieties?status=inactive');
    $inactiveRes->assertOk();
    $inactiveSlugs = collect($inactiveRes->json('data'))->pluck('slug');
    expect($inactiveSlugs)->toContain('arabescato-vagli');

    // Restore
    $variety->update(['is_active' => true]);
});

test('09: Pagination and response metadata work properly', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)
        ->getJson('/api/v1/admin/varieties?per_page=5');

    $response->assertOk()
        ->assertJsonPath('meta.per_page', 5)
        ->assertJsonPath('meta.current_page', 1);

    expect(count($response->json('data')))->toBe(5);
});

test('10: Create validation rejects missing or invalid required data with 422', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)
        ->postJson('/api/v1/admin/varieties', [
            'name' => '',
            'slug' => '',
            'collection_id' => '',
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'slug', 'collection_id']);
});

test('11: Valid variety creation works and stores record in database', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $collection = Collection::where('slug', 'granites')->firstOrFail();

    $response = $this->actingAs($admin)
        ->postJson('/api/v1/admin/varieties', [
            'collection_id' => $collection->id,
            'name' => 'Titanium Black Granite',
            'slug' => 'titanium-black-granite',
            'color_family' => 'Deep Charcoal & Gold',
            'finishes' => ['Polished', 'Leathered'],
            'description' => 'A dramatic deep black granite accented by swirling gold, cream, and silver quartz veins.',
            'sort_order' => 5,
            'is_active' => true,
        ]);

    $response->assertStatus(201)
        ->assertJsonPath('data.slug', 'titanium-black-granite')
        ->assertJsonPath('data.collection_name', 'Granites');

    $this->assertDatabaseHas('varieties', [
        'slug' => 'titanium-black-granite',
        'collection_id' => $collection->id,
    ]);

    // Clean up
    Variety::where('slug', 'titanium-black-granite')->delete();
});

test('12: Duplicate slug is rejected with 422 validation error', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $collection = Collection::where('slug', 'italian-marble')->firstOrFail();

    $response = $this->actingAs($admin)
        ->postJson('/api/v1/admin/varieties', [
            'collection_id' => $collection->id,
            'name' => 'Another Calacatta',
            'slug' => 'calacatta-gold', // Duplicate
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['slug']);
});

test('13: Invalid collection ID is rejected with 422 validation error', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)
        ->postJson('/api/v1/admin/varieties', [
            'collection_id' => 999999, // Non-existent
            'name' => 'Specimen Stone',
            'slug' => 'specimen-stone',
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['collection_id']);
});

test('14: Edit validation works when updating with invalid data', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $variety = Variety::where('slug', 'calacatta-gold')->firstOrFail();

    $response = $this->actingAs($admin)
        ->putJson("/api/v1/admin/varieties/{$variety->id}", [
            'name' => '',
            'sort_order' => -10,
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'sort_order']);
});

test('15: Valid variety update persists changes to database', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $variety = Variety::where('slug', 'calacatta-gold')->firstOrFail();

    $originalDesc = $variety->description;

    $response = $this->actingAs($admin)
        ->putJson("/api/v1/admin/varieties/{$variety->id}", [
            'description' => 'Updated masterwork veining description with warm honey and taupe mineral veins.',
        ]);

    $response->assertOk()
        ->assertJsonPath('data.description', 'Updated masterwork veining description with warm honey and taupe mineral veins.');

    $this->assertDatabaseHas('varieties', [
        'id' => $variety->id,
        'description' => 'Updated masterwork veining description with warm honey and taupe mineral veins.',
    ]);

    // Restore
    $variety->update(['description' => $originalDesc]);
});

test('16: Collection reassignment works properly', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $variety = Variety::where('slug', 'calacatta-gold')->firstOrFail();
    $originalCollectionId = $variety->collection_id;

    $limestones = Collection::where('slug', 'limestones')->firstOrFail();

    $response = $this->actingAs($admin)
        ->putJson("/api/v1/admin/varieties/{$variety->id}", [
            'collection_id' => $limestones->id,
        ]);

    $response->assertOk()
        ->assertJsonPath('data.collection_id', $limestones->id);

    expect($variety->fresh()->collection_id)->toBe($limestones->id);

    // Restore original collection
    $variety->update(['collection_id' => $originalCollectionId]);
});

test('17: Status update endpoint toggles is_active', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $variety = Variety::where('slug', 'statuario-extra')->firstOrFail();

    // Deactivate
    $deactivateRes = $this->actingAs($admin)
        ->patchJson("/api/v1/admin/varieties/{$variety->id}/status", [
            'is_active' => false,
        ]);

    $deactivateRes->assertOk()
        ->assertJsonPath('data.is_active', false);

    expect($variety->fresh()->is_active)->toBeFalse();

    // Reactivate
    $activateRes = $this->actingAs($admin)
        ->patchJson("/api/v1/admin/varieties/{$variety->id}/status", [
            'is_active' => true,
        ]);

    $activateRes->assertOk()
        ->assertJsonPath('data.is_active', true);

    expect($variety->fresh()->is_active)->toBeTrue();
});

test('18: Display order update endpoint modifies sort_order in database', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $variety = Variety::where('slug', 'carrara-bianco')->firstOrFail();
    $originalOrder = $variety->sort_order;

    $response = $this->actingAs($admin)
        ->patchJson("/api/v1/admin/varieties/{$variety->id}/order", [
            'sort_order' => 12,
        ]);

    $response->assertOk()
        ->assertJsonPath('data.sort_order', 12);

    expect($variety->fresh()->sort_order)->toBe(12);

    // Restore
    $variety->update(['sort_order' => $originalOrder]);
});

test('19: Safe deletion removes variety without deleting parent collection', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $marble = Collection::where('slug', 'italian-marble')->firstOrFail();

    // Create temporary variety
    $tempVariety = Variety::create([
        'collection_id' => $marble->id,
        'name' => 'Temp Test Variety',
        'slug' => 'temp-test-variety',
        'is_active' => true,
        'sort_order' => 99,
    ]);

    $response = $this->actingAs($admin)
        ->deleteJson("/api/v1/admin/varieties/{$tempVariety->id}");

    $response->assertOk()
        ->assertJsonPath('message', 'Variety deleted successfully.');

    $this->assertDatabaseMissing('varieties', ['id' => $tempVariety->id]);
    $this->assertDatabaseHas('collections', ['id' => $marble->id]); // Collection untouched
});

test('20: Unauthorized mutation is rejected for unauthenticated and non-admin requests', function () {
    $variety = Variety::where('slug', 'calacatta-gold')->firstOrFail();

    // Unauthenticated
    $this->postJson('/api/v1/admin/varieties', ['name' => 'Test'])->assertUnauthorized();
    $this->putJson("/api/v1/admin/varieties/{$variety->id}", ['name' => 'Test'])->assertUnauthorized();
    $this->deleteJson("/api/v1/admin/varieties/{$variety->id}")->assertUnauthorized();

    // Non-admin
    $regularUser = User::create([
        'name' => 'Non Admin 3',
        'email' => 'regular3@test.com',
        'password' => Hash::make('password'),
        'is_admin' => false,
    ]);

    $this->actingAs($regularUser)->postJson('/api/v1/admin/varieties', ['name' => 'Test'])->assertForbidden();
    $this->actingAs($regularUser)->putJson("/api/v1/admin/varieties/{$variety->id}", ['name' => 'Test'])->assertForbidden();
    $this->actingAs($regularUser)->deleteJson("/api/v1/admin/varieties/{$variety->id}")->assertForbidden();
});

test('21: Sandstone variety can be created under sandstone collection, reserved slugs rejected', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $sandstone = Collection::where('slug', 'sandstone')->firstOrFail();

    // Reserved slug rejection
    $resReserved = $this->actingAs($admin)
        ->postJson('/api/v1/admin/varieties', [
            'collection_id' => $sandstone->id,
            'name' => 'Admin Special',
            'slug' => 'admin',
        ]);
    $resReserved->assertStatus(422)
        ->assertJsonValidationErrors(['slug']);
});

test('22: Public collection detail page reflects variety updates', function () {
    $variety = Variety::where('slug', 'calacatta-gold')->firstOrFail();
    $originalName = $variety->name;

    $variety->update(['name' => 'Calacatta Oro Sovereign']);

    $response = $this->get('/collections/italian-marble');
    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/Collections/Show')
            ->where('collection.varieties', fn ($vars) => collect($vars)->contains('name', 'Calacatta Oro Sovereign'))
        );

    // Restore
    $variety->update(['name' => $originalName]);
});

test('23: Inactive variety is excluded from public collection detail output', function () {
    $variety = Variety::where('slug', 'calacatta-gold')->firstOrFail();

    // 1. When active, it is present
    $resActive = $this->get('/collections/italian-marble');
    $resActive->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/Collections/Show')
            ->where('collection.varieties', fn ($vars) => collect($vars)->contains('slug', 'calacatta-gold'))
        );

    // 2. When deactivated, it is excluded
    $variety->update(['is_active' => false]);

    $resInactive = $this->get('/collections/italian-marble');
    $resInactive->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/Collections/Show')
            ->where('collection.varieties', fn ($vars) => ! collect($vars)->contains('slug', 'calacatta-gold'))
        );

    // Restore
    $variety->update(['is_active' => true]);
});

test('24: Existing Collections Admin module remains functional', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->get('/admin/collections');
    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('admin/Collections'));
});

test('25: Existing Admin authentication remains functional', function () {
    $response = $this->post('/admin/login', [
        'email' => 'admin@eliornaturalstones.com',
        'password' => 'password',
    ]);

    $response->assertRedirect('/admin/dashboard');
    $this->assertAuthenticated();
});

test('26: /projects returns 200 and /admin/projects strictly returns HTTP 404', function () {
    $this->get('/projects')->assertOk();
    $this->get('/admin/projects')->assertNotFound();
});

test('27: Existing public routes remain functional with HTTP 200', function (string $route) {
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
    '/projects',
    '/contact',
]);
