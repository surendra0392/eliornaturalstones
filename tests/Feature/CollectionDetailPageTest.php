<?php

use App\Models\Collection;
use App\Models\Variety;
use Database\Seeders\CollectionSeeder;
use Database\Seeders\VarietySeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    if (Collection::count() === 0) {
        $this->seed(CollectionSeeder::class);
    }
    if (Variety::count() === 0) {
        $this->seed(VarietySeeder::class);
    }
});

test('all 8 canonical collection detail pages return 200 and render frontend/Collections/Show', function (string $slug, string $expectedName) {
    $this->get("/collections/{$slug}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/Collections/Show')
            ->has('collection')
            ->where('collection.slug', $slug)
            ->where('collection.name', $expectedName)
            ->has('collection.varieties')
            ->has('relatedCollections', 3)
            ->where('relatedCollections.0.slug', fn ($val) => $val !== $slug)
            ->where('relatedCollections.1.slug', fn ($val) => $val !== $slug)
            ->where('relatedCollections.2.slug', fn ($val) => $val !== $slug)
        );
})->with([
    ['italian-marble', 'Italian Marble'],
    ['granites', 'Granites'],
    ['slate-stone', 'Slate Stone'],
    ['limestones', 'Limestones'],
    ['sandstone', 'Sand Stone'],
    ['cobble-stones', 'Cobble Stones'],
    ['pebbles', 'Pebbles'],
    ['quartz', 'Quartz'],
    ['sculptures', 'Sculptures'],
]);

test('invalid collection slug returns 404', function () {
    $this->get('/collections/non-existent-stone')->assertNotFound();
    $this->get('/collections/random-category')->assertNotFound();
});

test('sandstone collection renders successfully with varieties', function () {
    expect(Collection::where('slug', 'sandstone')->exists())->toBeTrue();

    $response = $this->get('/collections/sandstone');
    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/Collections/Show')
            ->where('collection.slug', 'sandstone')
            ->where('collection.name', 'Sand Stone')
            ->has('collection.varieties', 4)
        );
});

test('projects route returns 200 OK', function () {
    $this->get('/projects')->assertOk();
});

test('collection detail page gracefully handles collection with zero varieties', function () {
    $emptyCollection = Collection::create([
        'name' => 'Test Canonical Reserve',
        'slug' => 'test-canonical-reserve',
        'sort_order' => 99,
        'is_active' => true,
    ]);

    $this->get('/collections/test-canonical-reserve')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/Collections/Show')
            ->where('collection.slug', 'test-canonical-reserve')
            ->has('collection.varieties', 0)
        );

    $emptyCollection->delete();
});
