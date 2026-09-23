<?php

use App\Models\Collection;
use App\Models\Enquiry;
use App\Models\User;
use App\Models\Variety;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\CollectionSeeder;
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
});

test('01: unauthenticated user accessing /admin redirects to /admin/login', function () {
    $response = $this->get('/admin');
    $response->assertRedirect('/admin/login');
});

test('02: unauthenticated user accessing /admin/dashboard redirects to /admin/login', function () {
    $response = $this->get('/admin/dashboard');
    $response->assertRedirect('/admin/login');
});

test('03: /admin/login renders login form with HTTP 200', function () {
    $response = $this->get('/admin/login');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/Login')
        );
});

test('04: invalid login credentials are rejected with validation error', function () {
    $response = $this->post('/admin/login', [
        'email' => 'admin@eliornaturalstones.com',
        'password' => 'wrong-password',
    ]);

    $response->assertSessionHasErrors(['email']);
    $this->assertGuest();
});

test('05: non-admin user is rejected with HTTP 403 Forbidden when accessing admin', function () {
    $regularUser = User::create([
        'name' => 'Regular Trade Client',
        'email' => 'client@trade-studio.com',
        'password' => Hash::make('password'),
        'is_admin' => false,
    ]);

    $response = $this->actingAs($regularUser)->get('/admin/dashboard');
    $response->assertForbidden();
});

test('06: non-admin credentials submitted to login are rejected with access denied error', function () {
    User::create([
        'name' => 'Non-Admin User',
        'email' => 'regular@studio.com',
        'password' => Hash::make('secret123'),
        'is_admin' => false,
    ]);

    $response = $this->post('/admin/login', [
        'email' => 'regular@studio.com',
        'password' => 'secret123',
    ]);

    $response->assertSessionHasErrors(['email']);
    $this->assertGuest();
});

test('07: valid Admin credentials authenticate and redirect to /admin/dashboard', function () {
    $response = $this->post('/admin/login', [
        'email' => 'admin@eliornaturalstones.com',
        'password' => 'password',
    ]);

    $response->assertRedirect('/admin/dashboard');
    $this->assertAuthenticated();
});

test('08: authorized Admin can access /admin/dashboard with metrics and recent enquiries', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->get('/admin/dashboard');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/Dashboard')
            ->has('metrics.collections_count')
            ->has('metrics.varieties_count')
            ->has('metrics.enquiries_count')
            ->has('metrics.pending_enquiries_count')
            ->has('recent_enquiries')
        );
});

test('09: dashboard metrics accurately match database record counts', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $expectedCollections = Collection::count();
    $expectedVarieties = Variety::count();
    $expectedEnquiries = Enquiry::count();
    $expectedPending = Enquiry::where('status', 'pending')->count();

    $response = $this->actingAs($admin)->get('/admin/dashboard');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('metrics.collections_count', $expectedCollections)
            ->where('metrics.varieties_count', $expectedVarieties)
            ->where('metrics.enquiries_count', $expectedEnquiries)
            ->where('metrics.pending_enquiries_count', $expectedPending)
        );
});

test('10: Admin logout invalidates session and redirects to /admin/login', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    $response = $this->actingAs($admin)->post('/admin/logout');

    $response->assertRedirect('/admin/login');
    $this->assertGuest();
});

test('11: unauthorized API request to admin dashboard returns 401', function () {
    $response = $this->getJson('/api/v1/admin/dashboard');
    $response->assertUnauthorized();
});

test('12: forbidden API request from non-admin user returns 403', function () {
    $regularUser = User::create([
        'name' => 'API Non Admin',
        'email' => 'api-client@test.com',
        'password' => Hash::make('password'),
        'is_admin' => false,
    ]);

    $token = $regularUser->createToken('test-token')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer {$token}")
        ->getJson('/api/v1/admin/dashboard');

    $response->assertForbidden();
});

test('13: authorized Admin API request to admin dashboard returns valid JSON envelope', function () {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();
    $token = $admin->createToken('admin-test-token')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer {$token}")
        ->getJson('/api/v1/admin/dashboard');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                'collections_count',
                'varieties_count',
                'enquiries_count',
                'pending_enquiries_count',
                'recent_enquiries',
            ],
            'message',
        ]);
});

test('14: placeholder admin module routes are protected and accessible to admin', function (string $route, string $component) {
    $admin = User::where('email', 'admin@eliornaturalstones.com')->firstOrFail();

    // 1. Unauthenticated gets redirected
    $this->get($route)->assertRedirect('/admin/login');

    // 2. Admin gets 200 OK
    $this->actingAs($admin)->get($route)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component($component));
})->with([
    ['/admin/collections', 'admin/Collections'],
    ['/admin/varieties', 'admin/Varieties'],
    ['/admin/media', 'admin/Media'],
    ['/admin/pages', 'admin/Pages'],
    ['/admin/enquiries', 'admin/Enquiries'],
    ['/admin/settings', 'admin/Settings'],
]);

test('15: /projects returns 200 and /admin/projects strictly returns HTTP 404', function () {
    $this->get('/projects')->assertOk();
    $this->get('/admin/projects')->assertNotFound();
});

test('16: all public website routes remain 200 OK', function (string $route) {
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
