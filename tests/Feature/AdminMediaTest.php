<?php

use App\Models\Collection;
use App\Models\User;
use App\Models\Variety;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\CollectionSeeder;
use Database\Seeders\VarietySeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

beforeEach(function () {
    if (Collection::count() === 0) {
        $this->seed(CollectionSeeder::class);
        $this->seed(VarietySeeder::class);
    }
    if (User::where('email', 'admin@eliornaturalstones.com')->count() === 0) {
        $this->seed(AdminUserSeeder::class);
    }
});

test('01: Admin Media page is accessible to authorized Admin', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->get('/admin/media');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/Media')
            ->has('initialMedia')
            ->has('initialMeta')
            ->has('canonicalCollections')
            ->has('varieties')
        );
});

test('02: Unauthenticated access to /admin/media is rejected and redirects to login', function () {
    $response = $this->get('/admin/media');
    $response->assertRedirect('/admin/login');
});

test('03: Non-admin access to /admin/media is rejected with 403 Forbidden', function () {
    $regularUser = User::create([
        'name' => 'General Visitor',
        'email' => 'visitor@architects.com',
        'password' => Hash::make('password'),
        'is_admin' => false,
    ]);

    $response = $this->actingAs($regularUser)->get('/admin/media');
    $response->assertForbidden();
});

test('04: Media list endpoint /api/v1/admin/media returns valid JSON envelope', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->getJson('/api/v1/admin/media');

    $response->assertOk()
        ->assertJsonStructure([
            'data',
            'meta' => ['current_page', 'last_page', 'per_page', 'total'],
            'message',
        ]);
});

test('05: Media pagination works properly', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->getJson('/api/v1/admin/media?page=1&per_page=10');

    $response->assertOk();
    expect($response->json('meta.per_page'))->toBe(10);
});

test('06: Server-side search finds media by filename or name or alt text', function () {
    Storage::fake('public');
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $file = UploadedFile::fake()->image('carrara_bianco_slab.jpg', 600, 400);
    $media = $admin->addMedia($file)
        ->withCustomProperties(['alt_text' => 'Honed Carrara Bianco slab texture'])
        ->toMediaCollection('uploads');

    $searchFilename = $this->actingAs($admin)->getJson('/api/v1/admin/media?search=carrara_bianco');
    $searchFilename->assertOk();
    expect(collect($searchFilename->json('data'))->pluck('id'))->toContain($media->id);

    $searchAlt = $this->actingAs($admin)->getJson('/api/v1/admin/media?search=Honed Carrara');
    $searchAlt->assertOk();
    expect(collect($searchAlt->json('data'))->pluck('id'))->toContain($media->id);
});

test('07: Supported filters work for collection, entity, and type', function () {
    Storage::fake('public');
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $collection = Collection::firstOrFail();

    $file1 = UploadedFile::fake()->image('admin_upload.jpg', 500, 500);
    $adminMedia = $admin->addMedia($file1)->toMediaCollection('uploads');

    $file2 = UploadedFile::fake()->image('collection_hero.jpg', 800, 600);
    $collMedia = $collection->addMedia($file2)->toMediaCollection('hero');

    $filterCollection = $this->actingAs($admin)->getJson('/api/v1/admin/media?collection=hero');
    $filterCollection->assertOk();
    expect(collect($filterCollection->json('data'))->pluck('id'))->toContain($collMedia->id)
        ->and(collect($filterCollection->json('data'))->pluck('id'))->not->toContain($adminMedia->id);

    $filterEntity = $this->actingAs($admin)->getJson('/api/v1/admin/media?entity=collection');
    $filterEntity->assertOk();
    expect(collect($filterEntity->json('data'))->pluck('id'))->toContain($collMedia->id)
        ->and(collect($filterEntity->json('data'))->pluck('id'))->not->toContain($adminMedia->id);

    $filterType = $this->actingAs($admin)->getJson('/api/v1/admin/media?type=image');
    $filterType->assertOk();
    expect(collect($filterType->json('data'))->pluck('id'))->toContain($collMedia->id);
});

test('08: Upload validation rejects invalid non-image or executable files', function () {
    Storage::fake('public');
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $badFile = UploadedFile::fake()->create('script.php', 100, 'application/x-php');

    $response = $this->actingAs($admin)->postJson('/api/v1/admin/media', [
        'file' => $badFile,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['file']);
});

test('09: Upload validation rejects oversized files exceeding 10MB', function () {
    Storage::fake('public');
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $largeFile = UploadedFile::fake()->image('giant_slab.jpg')->size(11 * 1024); // 11MB

    $response = $this->actingAs($admin)->postJson('/api/v1/admin/media', [
        'file' => $largeFile,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['file']);
});

test('10: Valid image upload succeeds and returns HTTP 201', function () {
    Storage::fake('public');
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $validImage = UploadedFile::fake()->image('statuario_quarry.jpg', 1200, 800);

    $response = $this->actingAs($admin)->postJson('/api/v1/admin/media', [
        'file' => $validImage,
        'alt_text' => 'Statuario Extra extracted blocks at alpine quarry',
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.file_name', 'statuario_quarry.jpg')
        ->assertJsonPath('data.alt_text', 'Statuario Extra extracted blocks at alpine quarry');
});

test('11: Uploaded media record is persisted in Spatie media table', function () {
    Storage::fake('public');
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $validImage = UploadedFile::fake()->image('calacatta_gold_slab.jpg', 1600, 1000);

    $response = $this->actingAs($admin)->postJson('/api/v1/admin/media', [
        'file' => $validImage,
    ]);

    $response->assertCreated();
    $mediaId = $response->json('data.id');

    expect(Media::where('id', $mediaId)->exists())->toBeTrue();
});

test('12: Media metadata includes dimensions, formatted size, and MIME type', function () {
    Storage::fake('public');
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $validImage = UploadedFile::fake()->image('texture_sample.png', 800, 600);

    $response = $this->actingAs($admin)->postJson('/api/v1/admin/media', [
        'file' => $validImage,
    ]);

    $response->assertCreated();
    expect($response->json('data.dimensions.width'))->toBe(800)
        ->and($response->json('data.dimensions.height'))->toBe(600)
        ->and($response->json('data.dimensions.formatted'))->toBe('800 × 600')
        ->and($response->json('data.mime_type'))->toBe('image/png')
        ->and($response->json('data.size_formatted'))->toBeString();
});

test('13: Media detail endpoint GET /api/v1/admin/media/{media} returns single resource', function () {
    Storage::fake('public');
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $file = UploadedFile::fake()->image('detail_inspection.jpg', 400, 300);
    $media = $admin->addMedia($file)->toMediaCollection('uploads');

    $response = $this->actingAs($admin)->getJson("/api/v1/admin/media/{$media->id}");

    $response->assertOk()
        ->assertJsonPath('data.id', $media->id)
        ->assertJsonPath('data.file_name', 'detail_inspection.jpg');
});

test('14: Metadata update PATCH /api/v1/admin/media/{media} updates title and alt text', function () {
    Storage::fake('public');
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $file = UploadedFile::fake()->image('update_test.jpg', 400, 300);
    $media = $admin->addMedia($file)->toMediaCollection('uploads');

    $response = $this->actingAs($admin)->patchJson("/api/v1/admin/media/{$media->id}", [
        'name' => 'Updated Architectural Marble Display',
        'alt_text' => 'High-resolution honed marble surface reflection',
    ]);

    $response->assertOk()
        ->assertJsonPath('data.name', 'Updated Architectural Marble Display')
        ->assertJsonPath('data.alt_text', 'High-resolution honed marble surface reflection');

    $freshMedia = $media->fresh();
    expect($freshMedia->name)->toBe('Updated Architectural Marble Display')
        ->and($freshMedia->getCustomProperty('alt_text'))->toBe('High-resolution honed marble surface reflection');
});

test('15: Media URL is returned safely without revealing local filesystem paths', function () {
    Storage::fake('public');
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $file = UploadedFile::fake()->image('safe_url_test.jpg', 400, 300);
    $media = $admin->addMedia($file)->toMediaCollection('uploads');

    $response = $this->actingAs($admin)->getJson("/api/v1/admin/media/{$media->id}");

    $response->assertOk();
    $url = $response->json('data.url');

    expect($url)->toBeString()
        ->and($url)->not->toContain('C:\\')
        ->and($url)->not->toContain('/var/')
        ->and($url)->not->toContain('storage/app');
});

test('16: Associated media relationships are properly detected', function () {
    Storage::fake('public');
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $collection = Collection::firstOrFail();

    $file = UploadedFile::fake()->image('coll_assoc_test.jpg', 400, 300);
    $media = $collection->addMedia($file)->toMediaCollection('hero');

    $response = $this->actingAs($admin)->getJson("/api/v1/admin/media/{$media->id}");

    $response->assertOk()
        ->assertJsonPath('data.is_associated', true)
        ->assertJsonPath('data.associated_entity.type', 'collection')
        ->assertJsonPath('data.associated_entity.id', $collection->id)
        ->assertJsonPath('data.associated_entity.name', $collection->name);
});

test('17: Safe deletion requires confirmation (force: true) when media is associated', function () {
    Storage::fake('public');
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $collection = Collection::firstOrFail();

    $file = UploadedFile::fake()->image('protected_hero.jpg', 400, 300);
    $media = $collection->addMedia($file)->toMediaCollection('hero');

    // Attempting delete without force flag should return 422 warning
    $failResponse = $this->actingAs($admin)->deleteJson("/api/v1/admin/media/{$media->id}");
    $failResponse->assertStatus(422)
        ->assertJsonPath('is_associated', true);

    expect(Media::where('id', $media->id)->exists())->toBeTrue();
    expect(Collection::where('id', $collection->id)->exists())->toBeTrue();

    // Deleting with force: true succeeds and leaves collection intact
    $successResponse = $this->actingAs($admin)->deleteJson("/api/v1/admin/media/{$media->id}?force=true");
    $successResponse->assertOk();

    expect(Media::where('id', $media->id)->exists())->toBeFalse();
    expect(Collection::where('id', $collection->id)->exists())->toBeTrue();
});

test('18: Unauthorized deletion is rejected with 403 Forbidden', function () {
    Storage::fake('public');
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $file = UploadedFile::fake()->image('unauth_delete.jpg', 400, 300);
    $media = $admin->addMedia($file)->toMediaCollection('uploads');

    $regularUser = User::create([
        'name' => 'Regular Member',
        'email' => 'regular@studio.com',
        'password' => Hash::make('password'),
        'is_admin' => false,
    ]);

    $response = $this->actingAs($regularUser)->deleteJson("/api/v1/admin/media/{$media->id}");
    $response->assertForbidden();
});

test('19: Unauthorized metadata mutation is rejected with 403 Forbidden', function () {
    Storage::fake('public');
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $file = UploadedFile::fake()->image('unauth_patch.jpg', 400, 300);
    $media = $admin->addMedia($file)->toMediaCollection('uploads');

    $regularUser = User::create([
        'name' => 'Regular Member 2',
        'email' => 'regular2@studio.com',
        'password' => Hash::make('password'),
        'is_admin' => false,
    ]);

    $response = $this->actingAs($regularUser)->patchJson("/api/v1/admin/media/{$media->id}", [
        'name' => 'Hacked Name',
    ]);
    $response->assertForbidden();
});

test('20: Collection media assignment works correctly', function () {
    Storage::fake('public');
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $collection = Collection::firstOrFail();

    $file = UploadedFile::fake()->image('assignable_hero.jpg', 1200, 800);
    $media = $admin->addMedia($file)->toMediaCollection('uploads');

    $response = $this->actingAs($admin)->postJson("/api/v1/admin/media/{$media->id}/assign", [
        'entity_type' => 'collection',
        'entity_id' => $collection->id,
        'collection_name' => 'hero',
        'mode' => 'copy',
    ]);

    $response->assertOk()
        ->assertJsonPath('data.associated_entity.id', $collection->id);

    $collection->refresh();
    expect($collection->getFirstMedia('hero'))->not->toBeNull();
});

test('21: Variety media assignment works correctly', function () {
    Storage::fake('public');
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $variety = Variety::firstOrFail();

    $file = UploadedFile::fake()->image('assignable_slab.jpg', 800, 800);
    $media = $admin->addMedia($file)->toMediaCollection('uploads');

    $response = $this->actingAs($admin)->postJson("/api/v1/admin/media/{$media->id}/assign", [
        'entity_type' => 'variety',
        'entity_id' => $variety->id,
        'collection_name' => 'slab',
        'mode' => 'copy',
    ]);

    $response->assertOk()
        ->assertJsonPath('data.associated_entity.id', $variety->id);

    $variety->refresh();
    expect($variety->getFirstMedia('slab'))->not->toBeNull();
});

test('22: Public collection image output reflects assigned hero media', function () {
    Storage::fake('public');
    $collection = Collection::where('slug', 'italian-marble')->firstOrFail();

    $file = UploadedFile::fake()->image('italian_marble_hero.jpg', 1920, 1080);
    $collection->addMedia($file)->toMediaCollection('hero');

    $apiResponse = $this->getJson("/api/v1/collections/{$collection->slug}");
    $apiResponse->assertOk();
    expect($apiResponse->json('data.hero_image'))->not->toBeNull();

    $webResponse = $this->get("/collections/{$collection->slug}");
    $webResponse->assertOk();
});

test('23: Public variety image output reflects assigned slab image', function () {
    Storage::fake('public');
    $variety = Variety::where('slug', 'statuario-extra')->firstOrFail();

    $file = UploadedFile::fake()->image('statuario_slab.jpg', 1000, 1000);
    $variety->addMedia($file)->toMediaCollection('slab');

    $apiResponse = $this->getJson("/api/v1/varieties/{$variety->slug}");
    $apiResponse->assertOk();
    expect($apiResponse->json('data.slab_image'))->not->toBeNull();
});

test('24: /projects route remains HTTP 200 OK', function () {
    $this->get('/projects')->assertOk();
});

test('25: Existing Collections Admin remains fully functional', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $this->actingAs($admin)->get('/admin/collections')->assertOk();
    $this->actingAs($admin)->getJson('/api/v1/admin/collections')->assertOk();
});

test('26: Existing Varieties Admin remains fully functional', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $this->actingAs($admin)->get('/admin/varieties')->assertOk();
    $this->actingAs($admin)->getJson('/api/v1/admin/varieties')->assertOk();
});

test('27: Existing Admin authentication remains functional', function () {
    $response = $this->postJson('/api/v1/admin/login', [
        'email' => 'admin@eliornaturalstones.com',
        'password' => 'password',
    ]);
    $response->assertOk();
});

test('28: Existing public pages remain functional', function () {
    $this->get('/')->assertOk();
    $this->get('/collections')->assertOk();
    $this->get('/our-story')->assertOk();
    $this->get('/from-source-to-space')->assertOk();
    $this->get('/projects')->assertOk();
    $this->get('/contact')->assertOk();
});
