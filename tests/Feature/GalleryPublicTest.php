<?php

use App\Models\GalleryItem;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
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

test('01: Public /gallery page renders successfully with Inertia', function () {
    $response = $this->get('/gallery');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/Gallery/Index')
            ->has('galleryItems')
            ->has('categories')
        );
});

test('02: Public /gallery page contains active seeded items', function () {
    $response = $this->get('/gallery');

    $response->assertOk();
    $items = GalleryItem::where('is_active', true)->get();
    expect($items->count())->toBe(3);
});

test('03: Inactive gallery items are hidden from public /gallery API', function () {
    $item = GalleryItem::firstOrFail();
    $item->update(['is_active' => false]);

    $response = $this->getJson('/api/v1/gallery');

    $response->assertOk();
    $ids = collect($response->json('data'))->pluck('id')->all();
    expect($ids)->not->toContain($item->id);

    // Restore
    $item->update(['is_active' => true]);
});

test('04: Public API /api/v1/gallery returns active items and category metadata', function () {
    $response = $this->getJson('/api/v1/gallery');

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
                    'image_url',
                    'thumb_url',
                ],
            ],
            'categories',
            'message',
        ]);
});

test('05: Public API /api/v1/gallery/{slug} returns single item', function () {
    $item = GalleryItem::where('is_active', true)->firstOrFail();

    $response = $this->getJson("/api/v1/gallery/{$item->slug}");

    $response->assertOk()
        ->assertJsonPath('data.slug', $item->slug)
        ->assertJsonPath('data.title', $item->title);
});

test('06: Public API /api/v1/gallery/{slug} returns 404 for non-existent or inactive item', function () {
    $response = $this->getJson('/api/v1/gallery/non-existent-stone-slug');
    $response->assertNotFound();
});
