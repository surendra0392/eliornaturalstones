<?php

use App\Models\GalleryItem;
use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    if (User::where('email', 'admin@eliornaturalstones.com')->count() === 0) {
        $this->seed(AdminUserSeeder::class);
    }
    if (GalleryItem::count() === 0) {
        GalleryItem::create([
            'title' => 'Calacatta Gold Sovereign Bath',
            'slug' => 'calacatta-gold-sovereign-bath',
            'category' => 'Italian Marble',
            'space_type' => 'Master Sanctuary Bath',
            'material' => 'Calacatta Gold & Statuario',
            'description' => 'A master bath clad in bookmatched Calacatta Gold marble slabs.',
            'sort_order' => 1,
            'is_featured' => true,
            'is_active' => true,
        ]);
        GalleryItem::create([
            'title' => 'Statuario Extra Bookmatched Salon',
            'slug' => 'statuario-extra-bookmatched-salon',
            'category' => 'Italian Marble',
            'space_type' => 'Grand Salon',
            'material' => 'Statuario Extra Bookmatch',
            'description' => 'Floor-to-ceiling mirror-matched Statuario Extra marble feature wall.',
            'sort_order' => 2,
            'is_featured' => true,
            'is_active' => true,
        ]);
        GalleryItem::create([
            'title' => 'Luminescent Honey Onyx Spa',
            'slug' => 'luminescent-honey-onyx-spa',
            'category' => 'Onyx & Translucent',
            'space_type' => 'Wellness Spa Suite',
            'material' => 'Honey Onyx Translucent',
            'description' => 'Backlit crystalline Honey Onyx accent wall.',
            'sort_order' => 3,
            'is_featured' => true,
            'is_active' => true,
        ]);
    }
});

test('01: Admin Gallery page is accessible to authorized Admin', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->get('/admin/gallery');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/Gallery')
            ->has('initialItems')
            ->has('categories')
        );
});

test('02: Unauthenticated access to /admin/gallery redirects to login', function () {
    $response = $this->get('/admin/gallery');
    $response->assertRedirect('/admin/login');
});

test('03: Non-admin access to /admin/gallery is rejected with 403 Forbidden', function () {
    $regularUser = User::create([
        'name' => 'Regular User',
        'email' => 'regular@client.com',
        'password' => Hash::make('password'),
        'is_admin' => false,
    ]);

    $response = $this->actingAs($regularUser)->get('/admin/gallery');
    $response->assertForbidden();
});

test('04: Gallery API index /api/v1/admin/gallery returns list of items with proper structure', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->getJson('/api/v1/admin/gallery');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'title',
                    'slug',
                    'category',
                    'space_type',
                    'material',
                    'description',
                    'is_featured',
                    'is_active',
                    'sort_order',
                    'image_url',
                    'thumb_url',
                ],
            ],
            'meta',
            'categories',
            'message',
        ]);
});

test('05: Admin can filter gallery items by search query and category', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)
        ->getJson('/api/v1/admin/gallery?category='.urlencode('Italian Marble'));

    $response->assertOk();
    $data = $response->json('data');
    expect(count($data))->toBe(2);
    foreach ($data as $item) {
        expect($item['category'])->toBe('Italian Marble');
    }
});

test('06: Admin can create a new gallery item via API', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $payload = [
        'title' => 'Test Calacatta Masterpiece Pavilion',
        'category' => 'Italian Marble',
        'space_type' => 'Grand Pavilion',
        'material' => 'Calacatta Extra Bookmatch',
        'description' => 'Test architectural description of Calacatta Extra stone installation.',
        'sort_order' => 99,
        'is_featured' => true,
        'is_active' => true,
    ];

    $response = $this->actingAs($admin)->postJson('/api/v1/admin/gallery', $payload);

    $response->assertCreated()
        ->assertJsonPath('data.title', 'Test Calacatta Masterpiece Pavilion')
        ->assertJsonPath('data.slug', 'test-calacatta-masterpiece-pavilion');

    $this->assertDatabaseHas('gallery_items', [
        'title' => 'Test Calacatta Masterpiece Pavilion',
        'slug' => 'test-calacatta-masterpiece-pavilion',
    ]);
});

test('07: Creating gallery item fails when required fields are missing', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->postJson('/api/v1/admin/gallery', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['title', 'category']);
});

test('08: Admin can update an existing gallery item', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $item = GalleryItem::firstOrFail();

    $response = $this->actingAs($admin)->putJson("/api/v1/admin/gallery/{$item->id}", [
        'title' => 'Updated Gallery Title Name',
    ]);

    $response->assertOk()
        ->assertJsonPath('data.title', 'Updated Gallery Title Name');

    expect($item->fresh()->title)->toBe('Updated Gallery Title Name');
});

test('09: Admin can toggle is_active status via dedicated endpoint', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $item = GalleryItem::firstOrFail();
    $originalStatus = $item->is_active;

    $response = $this->actingAs($admin)
        ->patchJson("/api/v1/admin/gallery/{$item->id}/status", [
            'is_active' => ! $originalStatus,
        ]);

    $response->assertOk()
        ->assertJsonPath('data.is_active', ! $originalStatus);

    expect($item->fresh()->is_active)->toBe(! $originalStatus);
});

test('10: Admin can update sort_order via dedicated endpoint', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $item = GalleryItem::firstOrFail();

    $response = $this->actingAs($admin)
        ->patchJson("/api/v1/admin/gallery/{$item->id}/order", [
            'sort_order' => 42,
        ]);

    $response->assertOk()
        ->assertJsonPath('data.sort_order', 42);

    expect($item->fresh()->sort_order)->toBe(42);
});

test('11: Admin can upload and replace gallery item image', function () {
    Storage::fake('public');
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $item = GalleryItem::firstOrFail();

    $image = UploadedFile::fake()->image('replacement-5-4.jpg', 600, 480);

    $response = $this->actingAs($admin)
        ->post("/api/v1/admin/gallery/{$item->id}/image", [
            'image' => $image,
            'alt_text' => 'Updated 5:4 Luxury Installation',
        ]);

    $response->assertOk();
    $fresh = $item->fresh();
    expect($fresh->hasMedia('image'))->toBeTrue();
});

test('12: Admin can delete a gallery item', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $item = GalleryItem::create([
        'title' => 'Temporary Deletable Gallery Item',
        'slug' => 'temp-deletable-gallery-item',
        'category' => 'Italian Marble',
    ]);

    $response = $this->actingAs($admin)
        ->deleteJson("/api/v1/admin/gallery/{$item->id}");

    $response->assertOk();
    $this->assertDatabaseMissing('gallery_items', ['id' => $item->id]);
});
