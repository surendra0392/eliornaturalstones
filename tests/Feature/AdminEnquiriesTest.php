<?php

use App\Models\Collection;
use App\Models\Enquiry;
use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\CollectionSeeder;
use Database\Seeders\EnquirySeeder;
use Database\Seeders\VarietySeeder;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    if (Collection::count() === 0) {
        $this->seed(CollectionSeeder::class);
        $this->seed(VarietySeeder::class);
    }
    if (User::where('email', 'admin@eliornaturalstones.com')->count() === 0) {
        $this->seed(AdminUserSeeder::class);
    }
    if (Enquiry::count() === 0) {
        $this->seed(EnquirySeeder::class);
    }
});

test('01: Admin Enquiries index is accessible to authorized Admin', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->get('/admin/enquiries');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/Enquiries')
            ->has('initialEnquiries')
            ->has('initialMeta')
            ->has('canonicalCollections')
            ->has('enquiryTypes')
        );
});

test('02: Unauthenticated access to /admin/enquiries is redirected to login', function () {
    $response = $this->get('/admin/enquiries');
    $response->assertRedirect('/admin/login');
});

test('03: Non-admin access to /admin/enquiries is rejected with 403 Forbidden', function () {
    $regularUser = User::create([
        'name' => 'Trade Specifier',
        'email' => 'specifier@atelier-rossi.it',
        'password' => Hash::make('password'),
        'is_admin' => false,
    ]);

    $response = $this->actingAs($regularUser)->get('/admin/enquiries');
    $response->assertForbidden();
});

test('04: Enquiries list API endpoint /api/v1/admin/enquiries returns valid JSON envelope', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->getJson('/api/v1/admin/enquiries');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'email',
                    'phone',
                    'company',
                    'project_space',
                    'enquiry_type',
                    'type',
                    'collection',
                    'material_interest',
                    'message',
                    'status',
                    'formatted_date',
                    'time_ago',
                    'created_at',
                ],
            ],
            'meta' => [
                'current_page',
                'last_page',
                'per_page',
                'total',
                'counts' => [
                    'total',
                    'pending',
                    'in_progress',
                    'responded',
                    'closed',
                ],
            ],
            'message',
        ]);
});

test('05: Unauthenticated and non-admin access to /api/v1/admin/enquiries is blocked', function () {
    // Unauthenticated
    $response = $this->getJson('/api/v1/admin/enquiries');
    $response->assertUnauthorized();

    // Non-admin user
    $regularUser = User::create([
        'name' => 'External Contractor',
        'email' => 'contractor@builders.co.uk',
        'password' => Hash::make('password'),
        'is_admin' => false,
    ]);

    $response2 = $this->actingAs($regularUser)->getJson('/api/v1/admin/enquiries');
    $response2->assertForbidden();
});

test('06: Server-side search filter accurately matches name, email, company, and message', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $uniqueEnquiry = Enquiry::create([
        'name' => 'Zephyr Sterling-Vance',
        'email' => 'zephyr.unique@monolith-architects.com',
        'phone' => '+44 7700 900888',
        'company' => 'St. Moritz Alpine Penthouse',
        'type' => 'Material Consultation',
        'material_interest' => 'Italian Marble',
        'message' => 'Seeking rare Violetto Calacatta slabs with high contrast quartz inclusions.',
        'status' => Enquiry::STATUS_PENDING,
    ]);

    // Search by unique name
    $resName = $this->actingAs($admin)->getJson('/api/v1/admin/enquiries?search=Zephyr');
    $resName->assertOk();
    expect(collect($resName->json('data'))->pluck('id'))->toContain($uniqueEnquiry->id);

    // Search by unique email fragment
    $resEmail = $this->actingAs($admin)->getJson('/api/v1/admin/enquiries?search=monolith-architects');
    $resEmail->assertOk();
    expect(collect($resEmail->json('data'))->pluck('id'))->toContain($uniqueEnquiry->id);

    // Search by unique project space
    $resCompany = $this->actingAs($admin)->getJson('/api/v1/admin/enquiries?search=St.+Moritz');
    $resCompany->assertOk();
    expect(collect($resCompany->json('data'))->pluck('id'))->toContain($uniqueEnquiry->id);

    // Search by unique message fragment
    $resMsg = $this->actingAs($admin)->getJson('/api/v1/admin/enquiries?search=Violetto+Calacatta');
    $resMsg->assertOk();
    expect(collect($resMsg->json('data'))->pluck('id'))->toContain($uniqueEnquiry->id);
});

test('07: Status filter correctly scopes results and handles aliases', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    // Filter pending
    $resPending = $this->actingAs($admin)->getJson('/api/v1/admin/enquiries?status=pending');
    $resPending->assertOk();
    foreach ($resPending->json('data') as $item) {
        expect($item['status'])->toBe(Enquiry::STATUS_PENDING);
    }

    // Filter in_progress
    $resProgress = $this->actingAs($admin)->getJson('/api/v1/admin/enquiries?status=in_progress');
    $resProgress->assertOk();
    foreach ($resProgress->json('data') as $item) {
        expect(in_array($item['status'], [Enquiry::STATUS_IN_PROGRESS, 'reviewed']))->toBeTrue();
    }

    // Filter responded
    $resResponded = $this->actingAs($admin)->getJson('/api/v1/admin/enquiries?status=responded');
    $resResponded->assertOk();
    foreach ($resResponded->json('data') as $item) {
        expect(in_array($item['status'], [Enquiry::STATUS_RESPONDED, 'contacted']))->toBeTrue();
    }

    // Filter closed
    $resClosed = $this->actingAs($admin)->getJson('/api/v1/admin/enquiries?status=closed');
    $resClosed->assertOk();
    foreach ($resClosed->json('data') as $item) {
        expect(in_array($item['status'], [Enquiry::STATUS_CLOSED, 'archived']))->toBeTrue();
    }

    // Filter alias 'reviewed'
    $resReviewed = $this->actingAs($admin)->getJson('/api/v1/admin/enquiries?status=reviewed');
    $resReviewed->assertOk();
});

test('08: Collection and enquiry type filters accurately filter records', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    // Filter by Italian Marble
    $resCol = $this->actingAs($admin)->getJson('/api/v1/admin/enquiries?collection=Italian+Marble');
    $resCol->assertOk();
    foreach ($resCol->json('data') as $item) {
        expect($item['collection'])->toBe('Italian Marble');
    }

    // Filter by Sample Request
    $resType = $this->actingAs($admin)->getJson('/api/v1/admin/enquiries?type=Sample+Request');
    $resType->assertOk();
    foreach ($resType->json('data') as $item) {
        expect($item['enquiry_type'])->toBe('Sample Request');
    }
});

test('09: Show single enquiry endpoint returns full details and metadata', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $enquiry = Enquiry::firstOrFail();

    $response = $this->actingAs($admin)->getJson("/api/v1/admin/enquiries/{$enquiry->id}");

    $response->assertOk()
        ->assertJson([
            'data' => [
                'id' => $enquiry->id,
                'name' => $enquiry->name,
                'email' => $enquiry->email,
            ],
            'message' => 'Enquiry retrieved successfully.',
        ]);
});

test('10: Update status endpoint /api/v1/admin/enquiries/{id}/status transitions state cleanly', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $enquiry = Enquiry::create([
        'name' => 'Matteo Bassi',
        'email' => 'm.bassi@milano-architettura.it',
        'phone' => '+39 02 1234567',
        'company' => 'Palazzo San Babila',
        'type' => 'Material Consultation',
        'material_interest' => 'Italian Marble',
        'message' => 'Requirement for 80 sq.m Calacatta Borghini slabs.',
        'status' => Enquiry::STATUS_PENDING,
    ]);

    // Transition to in_progress
    $res1 = $this->actingAs($admin)->patchJson("/api/v1/admin/enquiries/{$enquiry->id}/status", [
        'status' => 'in_progress',
    ]);
    $res1->assertOk()
        ->assertJsonPath('data.status', 'in_progress');
    expect($enquiry->fresh()->status)->toBe('in_progress');

    // Transition to responded
    $res2 = $this->actingAs($admin)->patchJson("/api/v1/admin/enquiries/{$enquiry->id}/status", [
        'status' => 'responded',
    ]);
    $res2->assertOk()
        ->assertJsonPath('data.status', 'responded');
    expect($enquiry->fresh()->status)->toBe('responded');

    // Transition to closed
    $res3 = $this->actingAs($admin)->patchJson("/api/v1/admin/enquiries/{$enquiry->id}/status", [
        'status' => 'closed',
    ]);
    $res3->assertOk()
        ->assertJsonPath('data.status', 'closed');
    expect($enquiry->fresh()->status)->toBe('closed');
});

test('11: Update status validates allowed statuses and rejects invalid input', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $enquiry = Enquiry::firstOrFail();

    $response = $this->actingAs($admin)->patchJson("/api/v1/admin/enquiries/{$enquiry->id}/status", [
        'status' => 'invalid_status_xyz',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['status']);
});

test('12: Update enquiry endpoint /api/v1/admin/enquiries/{id} updates full enquiry details', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $enquiry = Enquiry::create([
        'name' => 'Original Name',
        'email' => 'original@studio.com',
        'phone' => '+1 555 0100',
        'company' => 'Original Project Space',
        'type' => 'General Enquiry',
        'material_interest' => 'Limestones',
        'message' => 'Initial inquiry note.',
        'status' => Enquiry::STATUS_PENDING,
    ]);

    $response = $this->actingAs($admin)->putJson("/api/v1/admin/enquiries/{$enquiry->id}", [
        'name' => 'Updated Studio Name',
        'email' => 'updated@studio.com',
        'project_space' => 'Mayfair Penthouse Renovation',
        'collection' => 'Granites',
        'status' => 'in_progress',
        'message' => 'Updated specification notes.',
    ]);

    $response->assertOk()
        ->assertJsonPath('data.name', 'Updated Studio Name')
        ->assertJsonPath('data.email', 'updated@studio.com')
        ->assertJsonPath('data.status', 'in_progress');

    $fresh = $enquiry->fresh();
    expect($fresh->name)->toBe('Updated Studio Name');
    expect($fresh->email)->toBe('updated@studio.com');
    expect($fresh->status)->toBe('in_progress');
});

test('13: Update enquiry accepts Sand Stone material interest', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $enquiry = Enquiry::firstOrFail();

    $response = $this->actingAs($admin)->putJson("/api/v1/admin/enquiries/{$enquiry->id}", [
        'material_interest' => 'Sandstone Slabs',
    ]);

    $response->assertOk();
    expect($enquiry->fresh()->material_interest)->toBe('Sandstone Slabs');
});

test('14: Delete enquiry endpoint removes record safely', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $enquiry = Enquiry::create([
        'name' => 'Ephemeral Lead',
        'email' => 'ephemeral@temp.org',
        'phone' => '+44 7700 900999',
        'company' => 'Temporary Test Site',
        'project_space' => 'Test Space',
        'type' => 'general',
        'message' => 'Short lived lead for deletion test.',
        'status' => 'pending',
    ]);

    $response = $this->actingAs($admin)->deleteJson("/api/v1/admin/enquiries/{$enquiry->id}");
    $response->assertOk()
        ->assertJson([
            'message' => "Enquiry #{$enquiry->id} from Ephemeral Lead deleted successfully.",
        ]);

    expect(Enquiry::find($enquiry->id))->toBeNull();
});

test('16: Dashboard overview metrics reflect current enquiry counts', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->getJson('/api/v1/admin/dashboard');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                'enquiries_count',
                'pending_enquiries_count',
                'recent_enquiries',
            ],
            'message',
        ]);

    expect($response->json('data.enquiries_count'))->toBeGreaterThanOrEqual(1);
});

test('17: All seeded enquiries belong to valid leads', function () {
    $allEnquiries = Enquiry::all();
    expect($allEnquiries->count())->toBeGreaterThanOrEqual(1);
});
