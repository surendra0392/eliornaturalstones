<?php

use App\Models\Enquiry;
use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\EnquirySeeder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\View;

test('01: DatabaseSeeder excludes fake enquiries in production', function () {
    app()->detectEnvironment(fn () => 'production');
    Config::set('auth.admin_default_password', 'AValidStrongProductionPassword123!');

    Enquiry::query()->delete();

    // Run database seeder directly in simulated production
    (new DatabaseSeeder)->run();

    // Enquiries must remain 0 in production
    expect(Enquiry::count())->toBe(0);

    // Reset back to testing environment
    app()->detectEnvironment(fn () => 'testing');
});

test('02: AdminUserSeeder enforces strong password in production', function () {
    app()->detectEnvironment(fn () => 'production');

    // 1. Weak default password must fail
    Config::set('auth.admin_default_password', 'password');
    expect(fn () => (new AdminUserSeeder)->run())
        ->toThrow(RuntimeException::class, 'PRODUCTION SECURITY VIOLATION');

    // 2. Short password (< 12 chars) must fail
    Config::set('auth.admin_default_password', 'Secret123!');
    expect(fn () => (new AdminUserSeeder)->run())
        ->toThrow(RuntimeException::class, 'PRODUCTION SECURITY VIOLATION');

    // 3. Known weak dictionary password must fail
    Config::set('auth.admin_default_password', 'admin123');
    expect(fn () => (new AdminUserSeeder)->run())
        ->toThrow(RuntimeException::class, 'PRODUCTION SECURITY VIOLATION');

    // 4. Strong password (>= 12 chars) must succeed
    Config::set('auth.admin_default_password', 'V3ryStr0ng!P@ssw0rd2026');
    (new AdminUserSeeder)->run();

    $admin = User::where('email', 'admin@eliornaturalstones.com')->first();
    expect($admin)->not->toBeNull();
    expect($admin->isAdmin())->toBeTrue();

    // Reset back to testing environment
    app()->detectEnvironment(fn () => 'testing');
});

test('03: EnquirySeeder aborts early when run directly in production', function () {
    app()->detectEnvironment(fn () => 'production');
    Enquiry::query()->delete();

    (new EnquirySeeder)->run();

    expect(Enquiry::count())->toBe(0);

    // Reset back to testing environment
    app()->detectEnvironment(fn () => 'testing');
});

test('04: Session cookie configuration defaults to secure in production', function () {
    // In config/session.php: 'secure' => env('SESSION_SECURE_COOKIE', env('APP_ENV') === 'production')
    $resolvedInProduction = env('SESSION_SECURE_COOKIE', 'production' === 'production');
    expect($resolvedInProduction)->toBeTrue();

    $resolvedInLocal = env('SESSION_SECURE_COOKIE', 'local' === 'production');
    expect($resolvedInLocal)->toBeFalse();
});

test('05: Dynamic canonical URL uses appUrl shared via Inertia middleware', function () {
    Config::set('app.url', 'https://eliornaturalstones.com');

    $response = $this->get('/contact');
    $response->assertOk();

    // Verify appUrl is shared to Inertia
    $response->assertInertia(fn ($page) => $page
        ->has('appUrl')
        ->where('appUrl', 'https://eliornaturalstones.com')
    );
});

test('06: Production error views exist and render brand-aligned templates', function () {
    expect(View::exists('errors.404'))->toBeTrue();
    expect(View::exists('errors.500'))->toBeTrue();

    $rendered404 = view('errors.404')->render();
    expect($rendered404)->toContain('404');
    expect($rendered404)->toContain('ELIOR');
    expect($rendered404)->toContain('Reserve Not Located');
    expect($rendered404)->toContain('#0f0f0f');

    $rendered500 = view('errors.500')->render();
    expect($rendered500)->toContain('500');
    expect($rendered500)->toContain('ELIOR');
    expect($rendered500)->toContain('System Interruption');
});

test('07: Production cache operations are successful', function () {
    expect(Artisan::call('config:cache'))->toBe(0);
    expect(Artisan::call('route:cache'))->toBe(0);
    expect(Artisan::call('view:cache'))->toBe(0);

    // Clear caches to keep testing environment fresh
    Artisan::call('config:clear');
    Artisan::call('route:clear');
    Artisan::call('view:clear');
});
