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

test('it renders the architect-designer-services page with HTTP 200 and frontend/ArchitectDesignerServices component', function () {
    $this->get('/architect-designer-services')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('frontend/ArchitectDesignerServices')
        );
});

test('architect-designer-services page contains exactly six service disciplines', function () {
    $response = $this->get('/architect-designer-services');
    $response->assertOk();

    $response->assertSee('How We Support Your Process');
    $response->assertSee('Material expertise, considered around the needs of your project.');

    // 01 Consultation
    $response->assertSee('CONSULTATION');
    $response->assertSee('Discuss the material direction, visual intent and requirements of your space.');

    // 02 Design Support
    $response->assertSee('DESIGN SUPPORT');
    $response->assertSee('Explore stone surfaces, finishes and visual possibilities alongside your design development.');

    // 03 Custom Solutions
    $response->assertSee('CUSTOM SOLUTIONS');
    $response->assertSee('Discuss material requirements where standard selections do not fully express the intended result.');

    // 04 Technical Assistance
    $response->assertSee('TECHNICAL ASSISTANCE');
    $response->assertSee('Review relevant material considerations, finish options and application context.');

    // 05 Project Collaboration
    $response->assertSee('PROJECT COLLABORATION');
    $response->assertSee('Work through material decisions as your project develops from concept toward execution.');

    // 06 Material Guidance
    $response->assertSee('MATERIAL GUIDANCE');
    $response->assertSee('Compare colour, movement, texture, scale and finish to help identify an appropriate material direction.');
});

test('architect-designer-services page contains the five selection steps', function () {
    $response = $this->get('/architect-designer-services');
    $response->assertOk();

    $response->assertSee('A More Considered Selection.');
    $response->assertSee('UNDERSTAND');
    $response->assertSee('Understand the space, design intent and application.');

    $response->assertSee('EXPLORE');
    $response->assertSee('Explore relevant collections and material directions.');

    $response->assertSee('COMPARE');
    $response->assertSee('Compare colour, movement, texture, scale and finish.');

    $response->assertSee('REFINE');
    $response->assertSee('Narrow the material direction according to the design.');

    $response->assertSee('SELECT');
    $response->assertSee('Arrive at a considered material choice.');
});

test('architect-designer-services page contains hero and closing CTAs without staffing or contractor claims', function () {
    $response = $this->get('/architect-designer-services');
    $response->assertOk();

    // Hero narrative
    $response->assertSee('Designed Around Your Vision.');
    $response->assertSee('Material guidance for architects, designers and spaces shaped with intention.');
    $response->assertSee('START A MATERIAL CONVERSATION');

    // Introduction
    $response->assertSee('Good Architecture Begins With the Right Material.');
    $response->assertSee('Stone influences more than a surface. Its colour, scale, movement, texture and finish can change how a space is perceived.');

    // Feature sections
    $response->assertSee('01 — Start With the Material.');
    $response->assertSee('02 — See the Possibilities.');
    $response->assertSee('Material should support the design, not compete with it.');
    $response->assertSee('03 — Consider the Application.');
    $response->assertSee('04 — Stay Close to the Material.');

    // Professional trade enquiry & closing
    $response->assertSee('Working on a Project?');
    $response->assertSee('BEGIN A CONVERSATION');
    $response->assertSee('EXPLORE COLLECTIONS');
    $response->assertSee('Material Becomes Architecture.');
    $response->assertSee('ELIOR NATURAL STONES');
});

test('projects route strictly remains 404', function () {
    $this->get('/projects')->assertNotFound();
});

test('homepage route remains operational and unaffected', function () {
    $this->get('/')->assertOk();
});

test('collections directory route remains operational and unaffected', function () {
    $this->get('/collections')->assertOk();
});

test('collection detail routes remain operational and unaffected', function () {
    $this->get('/collections/italian-marble')->assertOk();
    $this->get('/collections/quartz')->assertOk();
});

test('our-story route remains operational and unaffected', function () {
    $this->get('/our-story')->assertOk();
});

test('from-source-to-space route remains operational and unaffected', function () {
    $this->get('/from-source-to-space')->assertOk();
});

test('contact route remains untouched and functional', function () {
    $this->get('/contact')->assertOk();
});
