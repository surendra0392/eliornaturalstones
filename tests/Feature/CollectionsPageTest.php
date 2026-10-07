<?php

use App\Models\Collection;
use Database\Seeders\CollectionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    if (Collection::count() === 0) {
        $this->seed(CollectionSeeder::class);
    }
});

test('collections overview page renders frontend/Collections/Index with 8 active collections', function () {
    $this->get('/collections')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/Collections/Index')
            ->has('collections', 8)
            ->where('collections.0.slug', 'italian-marble')
            ->where('collections.1.slug', 'granites')
            ->where('collections.2.slug', 'slate-stone')
            ->where('collections.3.slug', 'limestones')
            ->where('collections.4.slug', 'cobble-stones')
            ->where('collections.5.slug', 'pebbles')
            ->where('collections.6.slug', 'quartz')
            ->where('collections.7.slug', 'sculptures')
        );
});

test('collections page contains sandstone in database as deactivated and canonical projects page is accessible', function () {
    expect(Collection::where('slug', 'sandstone')->exists())->toBeTrue();
    expect(Collection::where('slug', 'sandstone')->value('is_active'))->toBeFalse();

    $this->get('/projects')->assertOk();
});
