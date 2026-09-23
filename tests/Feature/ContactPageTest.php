<?php

use App\Http\Requests\Api\StoreEnquiryRequest;
use App\Models\Collection;
use Database\Seeders\CollectionSeeder;
use Database\Seeders\VarietySeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    if (Collection::count() === 0) {
        $this->seed(CollectionSeeder::class);
        $this->seed(VarietySeeder::class);
    }
});

test('01: /contact returns HTTP 200', function () {
    $response = $this->get('/contact');
    $response->assertOk();
});

test('02: correct Inertia component is returned', function () {
    $response = $this->get('/contact');
    $response->assertInertia(fn (Assert $page) => $page->component('frontend/Contact'));
});

test('03: page editorial content and headers exist', function () {
    $response = $this->get('/contact');

    $response->assertOk();
    expect(
        str_contains($response->getContent(), "Let's Talk About Your Space.") ||
        str_contains($response->getContent(), 'Let&#x27;s Talk About Your Space.')
    )->toBeTrue();

    $response
        ->assertSee('ELIOR NATURAL STONES')
        ->assertSee('Tell Us About Your Project.')
        ->assertSee('Prefer a Direct Conversation?')
        ->assertSee('+91 81259 58071')
        ->assertSee('info@eliornaturalstones.com')
        ->assertSee('Hyderabad, India')
        ->assertSee('The Right Material Changes Everything.')
        ->assertSee('Explore Collections');
});

test('04: exactly six how we can help items exist', function () {
    $expectedItems = [
        'Material Selection',
        'Collection Enquiries',
        'Project Collaboration',
        'Sample Requests',
        'Availability Enquiries',
        'Material Guidance',
    ];

    $response = $this->get('/contact');
    $response->assertOk();

    foreach ($expectedItems as $item) {
        $response->assertSee($item);
    }
});

test('05: exactly six approved enquiry types exist in configuration', function () {
    $expectedTypes = [
        'Collection Enquiry',
        'Material Consultation',
        'Project Enquiry',
        'Sample Request',
        'Availability Enquiry',
        'General Enquiry',
    ];

    expect(StoreEnquiryRequest::ENQUIRY_TYPES)->toBe($expectedTypes);

    $response = $this->get('/contact');
    $response->assertOk();

    foreach ($expectedTypes as $type) {
        $response->assertSee($type);
    }
});

test('06: canonical collections exist in form configuration', function () {
    $expectedCollections = [
        'Italian Marble',
        'Granites',
        'Slate Stone',
        'Limestones',
        'Sand Stone',
        'Sandstone',
        'Cobble Stones',
        'Pebbles',
        'Quartz',
        'Sculptures',
    ];

    expect(StoreEnquiryRequest::CANONICAL_COLLECTIONS)->toBe($expectedCollections);

    $response = $this->get('/contact');
    $response->assertOk();

    foreach (['Italian Marble', 'Granites', 'Slate Stone', 'Limestones', 'Sand Stone', 'Cobble Stones', 'Pebbles', 'Quartz', 'Sculptures'] as $collection) {
        $response->assertSee($collection);
    }
});

test('07: sand stone is present in the page and form collections', function () {
    $response = $this->get('/contact');
    $response->assertOk();
    $response->assertSee('Sand Stone');
});

test('08: required enquiry validation works and returns 422 when required fields are missing', function () {
    $response = $this->postJson('/api/v1/enquiries', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors([
            'name',
            'email',
            'phone',
            'enquiry_type',
            'collection',
            'project_space',
            'message',
        ]);
});

test('09: invalid enquiry submission with unknown collection is rejected with 422', function () {
    $payload = [
        'name' => 'Alexander Wright',
        'email' => 'alexander@wright-architecture.com',
        'phone' => '+91 98765 43210',
        'enquiry_type' => 'Project Enquiry',
        'collection' => 'Synthetic Resin Composite', // FORBIDDEN
        'project_space' => 'Private Residence Atrium',
        'message' => 'Requesting synthetic material specification.',
    ];

    $response = $this->postJson('/api/v1/enquiries', $payload);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['collection']);
});

test('10: valid enquiry submission succeeds with HTTP 201 and stores record in database', function () {
    $payload = [
        'name' => 'Maya Lin',
        'email' => 'maya@lin-associates.com',
        'phone' => '+91 99887 76655',
        'enquiry_type' => 'Material Consultation',
        'collection' => 'Italian Marble',
        'project_space' => 'Museum Gallery Hall',
        'estimated_requirement' => 'Approx. 600 sq. meters honed slabs',
        'message' => 'We require bookmatched Calacatta and Statuario slabs with low reflectance.',
    ];

    $response = $this->postJson('/api/v1/enquiries', $payload);

    $response->assertCreated()
        ->assertJsonPath('data.name', 'Maya Lin')
        ->assertJsonPath('data.email', 'maya@lin-associates.com')
        ->assertJsonPath('data.type', 'Material Consultation')
        ->assertJsonPath('data.collection', 'Italian Marble')
        ->assertJsonPath('data.status', 'pending');

    $this->assertDatabaseHas('enquiries', [
        'email' => 'maya@lin-associates.com',
        'name' => 'Maya Lin',
        'type' => 'Material Consultation',
        'material_interest' => 'Italian Marble',
    ]);
});

test('11: success response envelope adheres to ELIOR API standard', function () {
    $payload = [
        'name' => 'David Chipperfield',
        'email' => 'david@dca-practice.com',
        'phone' => '+44 20 7123 4567',
        'enquiry_type' => 'Sample Request',
        'collection' => 'Limestones',
        'project_space' => 'Cultural Centre Facade',
        'message' => 'Requesting physical sample box of Jura and Moca Cream finishes.',
    ];

    $response = $this->postJson('/api/v1/enquiries', $payload);

    $response->assertCreated()
        ->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'email',
                'phone',
                'company',
                'project_space',
                'type',
                'material_interest',
                'collection',
                'estimated_requirement',
                'message',
                'status',
                'created_at',
            ],
            'message',
        ]);
});

test('12: API validation rejects invalid email format', function () {
    $payload = [
        'name' => 'Invalid Email Tester',
        'email' => 'not-an-email',
        'phone' => '+91 1234567890',
        'enquiry_type' => 'General Enquiry',
        'collection' => 'Granites',
        'project_space' => 'Commercial Lobby',
        'message' => 'Testing email validation.',
    ];

    $response = $this->postJson('/api/v1/enquiries', $payload);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

test('13: /projects strictly returns HTTP 200 OK', function () {
    $this->get('/projects')->assertOk();
});

test('14: all previously established public routes remain 200 OK', function (string $route) {
    $this->get($route)->assertOk();
})->with([
    '/',
    '/collections',
    '/collections/italian-marble',
    '/collections/granites',
    '/collections/slate-stone',
    '/collections/limestones',
    '/collections/cobble-stones',
    '/collections/pebbles',
    '/collections/quartz',
    '/collections/sculptures',
    '/our-story',
    '/from-source-to-space',
    '/projects',
    '/contact',
]);
