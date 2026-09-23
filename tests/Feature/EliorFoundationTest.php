<?php

use App\Models\Collection;
use App\Models\User;
use Database\Seeders\CollectionSeeder;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    // Ensure 8 canonical collections exist
    if (Collection::count() === 0) {
        $this->seed(CollectionSeeder::class);
    }
});

test('public routes are accessible and return 200', function (string $route) {
    $this->get($route)->assertOk();
})->with([
    '/',
    '/collections',
    '/collections/italian-marble',
    '/our-story',
    '/from-source-to-space',
    '/projects',
    '/contact',
]);

test('projects route exists and renders successfully', function () {
    $this->get('/projects')->assertOk();
});

test('api v1 collections returns standardized envelope with canonical collections', function () {
    $response = $this->getJson('/api/v1/collections');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'slug',
                    'tagline',
                    'description',
                    'sort_order',
                    'is_active',
                ],
            ],
            'meta',
            'message',
        ]);

    expect($response->json('data'))->toHaveCount(9);
});

test('api v1 single collection returns 200 for valid slug and 404 for missing', function () {
    $this->getJson('/api/v1/collections/italian-marble')
        ->assertOk()
        ->assertJsonPath('data.slug', 'italian-marble');

    $this->getJson('/api/v1/collections/non-existent-stone')
        ->assertNotFound();
});

test('api v1 enquiries validates and stores architectural inquiry', function () {
    $payload = [
        'name' => 'Studio Palladio',
        'email' => 'architect@palladio.it',
        'phone' => '+39 055 123456',
        'company' => 'Palladio Architects',
        'type' => 'trade',
        'material_interest' => 'Italian Marble',
        'message' => 'Requesting sample box and technical data for commercial atrium.',
    ];

    $response = $this->postJson('/api/v1/enquiries', $payload);

    $response->assertCreated()
        ->assertJsonPath('data.name', 'Studio Palladio')
        ->assertJsonPath('data.status', 'pending');

    $this->assertDatabaseHas('enquiries', [
        'email' => 'architect@palladio.it',
        'type' => 'trade',
    ]);
});

test('admin routes are accessible to authenticated administrators', function (string $route) {
    $admin = User::firstOrCreate(
        ['email' => 'admin@eliornaturalstones.com'],
        [
            'name' => 'ELIOR Administrator',
            'password' => Hash::make('password'),
            'is_admin' => true,
        ]
    );

    $this->actingAs($admin)->get($route)->assertOk();
})->with([
    '/admin/dashboard',
    '/admin/collections',
    '/admin/varieties',
    '/admin/media',
    '/admin/pages',
    '/admin/enquiries',
    '/admin/settings',
]);
