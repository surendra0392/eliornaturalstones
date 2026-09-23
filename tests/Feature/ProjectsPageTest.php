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
    if (Page::count() === 0 || ! Page::where('slug', 'projects')->exists()) {
        (new PageSeeder)->run();
    }
});

test('it renders the projects page with HTTP 200 and frontend/Projects component', function () {
    $this->get('/projects')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/Projects')
            ->has('cmsContent')
            ->where('cmsContent.slug', 'projects')
        );
});

test('legacy architect-designer-services route permanently redirects to projects', function () {
    $this->get('/architect-designer-services')
        ->assertRedirect('/projects');
});

test('projects page displays architectural commissions and stone specifications', function () {
    $response = $this->get('/projects');
    $response->assertOk();

    $response->assertSee('Spaces Defined by Stone.');
    $response->assertSee('Form Follows Material.');
    $response->assertSee('The Courtyard Villa');
    $response->assertSee('Jubilee Hills, Hyderabad');
    $response->assertSee('The Glass Pavilion & Gallery', false);
    $response->assertSee('Chanakyapuri, New Delhi');
    $response->assertSee('Lakeview Serenity Retreat');
    $response->assertSee('Lake Pichola, Udaipur');
    $response->assertSee('Monolith Cliffside Estate');
    $response->assertSee('Awas Beach, Alibaug');
});
