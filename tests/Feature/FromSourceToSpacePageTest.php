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

test('it renders the from-source-to-space page with HTTP 200 and frontend/FromSourceToSpace component', function () {
    $this->get('/from-source-to-space')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/FromSourceToSpace')
        );
});

test('from-source-to-space page contains hero and introduction narrative', function () {
    $response = $this->get('/from-source-to-space');
    $response->assertOk();

    $response->assertSee('From Source to Space');
    $response->assertSee('Every material has a journey. We follow it from its origin to the spaces it helps define.');
    $response->assertSee('MATERIAL JOURNEY');
    $response->assertSee('From Material to Meaning.');
    $response->assertSee('Stone begins with geology. Architecture gives it purpose.');
    $response->assertSee('At ELIOR, the journey matters because the material matters.');
});

test('from-source-to-space page contains the six journey stages in sequence', function () {
    $response = $this->get('/from-source-to-space');
    $response->assertOk();

    $response->assertSee('The Journey');
    $response->assertSee('Six stages. One continuous relationship with material.');

    // 01 Quarries
    $response->assertSee('QUARRIES');
    $response->assertSee('Understanding where material begins.');

    // 02 Processing
    $response->assertSee('PROCESSING');
    $response->assertSee('Revealing the character of the stone through considered processing.');

    // 03 Selection
    $response->assertSee('SELECTION');
    $response->assertSee('Choosing surfaces for colour, movement, texture and intended application.');

    // 04 Packaging
    $response->assertSee('PACKAGING');
    $response->assertSee('Protecting the material through careful preparation for movement.');

    // 05 All Over India
    $response->assertSee('ALL OVER INDIA');
    $response->assertSee('Moving selected material to project destinations all across India.');

    // 06 Inspiring Spaces
    $response->assertSee('INSPIRING SPACES');
    $response->assertSee('Where material becomes architecture.');
});

test('from-source-to-space page contains the six feature sections with defensible content', function () {
    $response = $this->get('/from-source-to-space');
    $response->assertOk();

    $response->assertSee('01 — Where Stone Begins');
    $response->assertSee('02 — Precision Reveals Character');
    $response->assertSee('03 — Selection Is Part of the Design');
    $response->assertSee('04 — Protecting the Material');
    $response->assertSee('05 — From One Place to Another');
    $response->assertSee('06 — Where Material Becomes Architecture');

    // 4 Curatorial Attributes
    $response->assertSee('COLOUR');
    $response->assertSee('MOVEMENT');
    $response->assertSee('TEXTURE');
    $response->assertSee('SCALE');
});

test('from-source-to-space page contains closing statement and contact conversation link', function () {
    $response = $this->get('/from-source-to-space');
    $response->assertOk();

    $response->assertSee('From Source.');
    $response->assertSee('To Space.');
    $response->assertSee('To Something Lasting.');
    $response->assertSee('ELIOR NATURAL STONES');
    $response->assertSee('BEGIN A CONVERSATION');
    $response->assertSee('/contact');
});

test('projects route returns 200 OK', function () {
    $this->get('/projects')->assertOk();
});

test('existing collection routes remain operational and unaffected', function () {
    $this->get('/collections')->assertOk();
    $this->get('/collections/italian-marble')->assertOk();
    $this->get('/collections/quartz')->assertOk();
});

test('our-story route remains operational and unaffected', function () {
    $this->get('/our-story')->assertOk();
});

test('homepage route remains operational and unaffected', function () {
    $this->get('/')->assertOk();
});
