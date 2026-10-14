<?php

use App\Models\Collection;
use Database\Seeders\CollectionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    if (Collection::count() === 0) {
        $this->seed(CollectionSeeder::class);
    }
});

test('homepage renders frontend/Home with canonical collections', function () {
    $activeCount = Collection::where('is_active', true)->count();

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/Home')
            ->has('collections', $activeCount)
            ->has('featuredGalleryItems')
            ->where('collections.0.slug', 'italian-marble')
        );
});

test('projects route returns 404 by default when disabled and 200 when enabled', function () {
    $this->get('/projects')->assertNotFound();

    \App\Models\Setting::set('projects_enabled', true, \App\Models\Setting::GROUP_GENERAL, 'boolean');

    $this->get('/projects')->assertOk();
});
