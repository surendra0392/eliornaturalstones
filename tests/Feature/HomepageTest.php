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
    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/Home')
            ->has('collections', 9)
            ->where('collections.0.slug', 'italian-marble')
        );
});

test('homepage strictly prohibits projects links and route', function () {
    $this->get('/projects')->assertNotFound();
});
