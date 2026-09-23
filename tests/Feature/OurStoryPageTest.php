<?php

use App\Models\Collection;
use App\Models\Page;
use App\Models\Variety;
use Database\Seeders\CollectionSeeder;
use Database\Seeders\PageSeeder;
use Database\Seeders\VarietySeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    if (Collection::count() === 0) {
        $this->seed(CollectionSeeder::class);
    }
    if (Variety::count() === 0) {
        $this->seed(VarietySeeder::class);
    }
    if (Page::where('slug', 'our-story')->count() === 0) {
        $this->seed(PageSeeder::class);
    }
});

test('it renders the our story page with HTTP 200 and frontend/OurStory component', function () {
    $this->get('/our-story')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/OurStory')
        );
});

test('our story page contains verified story content without invented facts', function () {
    $response = $this->get('/our-story');
    $response->assertOk();

    // Verify key narrative phrases
    $response->assertSee('A Legacy in Natural Stone');
    $response->assertSee('Three Decades. One Material.');
    $response->assertSee('From Tradition to Precision.');
    $response->assertSee('What Experience Taught Us.');
    $response->assertSee('Formed by Nature. Defined by Architecture.');
    $response->assertSee('Looking Forward.');
});

test('our story page timeline contains verified 1990 SSS Enterprises milestone', function () {
    $response = $this->get('/our-story');
    $response->assertOk();

    $response->assertSee('1990');
    $response->assertSee('SSS Enterprises');
    $response->assertSee('Wholesale raw block slabs across Southern India.');
});

test('our story page timeline contains verified 2017 TEJ Natural Stones milestone', function () {
    $response = $this->get('/our-story');
    $response->assertOk();

    $response->assertSee('2017');
    $response->assertSee('TEJ Natural Stones');
    $response->assertSee('High-tech stone manufacturing, diamond saw processing and development toward exports.');
});

test('our story page timeline contains verified 2024 STONEX milestone', function () {
    $response = $this->get('/our-story');
    $response->assertOk();

    $response->assertSee('2024');
    $response->assertSee('STONEX');
    $response->assertSee('Premium quartz slab lines and expansion into engineered surfaces.');
});

test('our story page timeline contains verified TODAY ELIOR milestone', function () {
    $response = $this->get('/our-story');
    $response->assertOk();

    $response->assertSee('TODAY');
    $response->assertSee('ELIOR');
    $response->assertSee('A new flagship identity focused on premium stone for contemporary architecture.');
});

test('our story page contains the 4 experience principles', function () {
    $response = $this->get('/our-story');
    $response->assertOk();

    $response->assertSee('RESPECT THE MATERIAL');
    $response->assertSee('SELECT WITH INTENTION');
    $response->assertSee('PRECISION MATTERS');
    $response->assertSee('DESIGN FOR TIME');
});

test('our story page contains final brand statement and collections link', function () {
    $response = $this->get('/our-story');
    $response->assertOk();

    $response->assertSee('Natural stone.');
    $response->assertSee('Timeless spaces.');
    $response->assertSee('EXPLORE COLLECTIONS');
    $response->assertSee('/collections');
});

test('canonical projects route is operational', function () {
    $this->get('/projects')->assertOk();
});

test('unrelated public routes remain operational and untouched', function () {
    $this->get('/')->assertOk();
    $this->get('/collections')->assertOk();
    $this->get('/collections/italian-marble')->assertOk();
    $this->get('/collections/quartz')->assertOk();
});
