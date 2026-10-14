<?php

use App\Models\Setting;
use App\Models\User;
use Database\Seeders\SettingSeeder;

beforeEach(function () {
    (new SettingSeeder)->run();
});

test('projects route is accessible by default when projects_enabled is true', function () {
    expect(Setting::get('projects_enabled', true))->toBeTrue();

    $this->get('/projects')->assertOk();
});

test('projects route returns 404 when projects_enabled is false', function () {
    Setting::set('projects_enabled', false, Setting::GROUP_GENERAL, 'boolean');

    expect(Setting::get('projects_enabled'))->toBeFalse();

    $this->get('/projects')->assertNotFound();
});

test('admin can toggle projects_enabled via settings API', function () {
    $admin = User::factory()->create([
        'is_admin' => true,
    ]);

    // Disable projects
    $response = $this->actingAs($admin)
        ->patchJson('/api/v1/admin/settings', [
            'group' => 'general',
            'settings' => [
                'projects_enabled' => false,
            ],
        ]);

    $response->assertOk();
    expect(Setting::get('projects_enabled'))->toBeFalse();

    // Verify /projects now aborts 404
    $this->get('/projects')->assertNotFound();

    // Re-enable projects
    $response = $this->actingAs($admin)
        ->patchJson('/api/v1/admin/settings', [
            'group' => 'general',
            'settings' => [
                'projects_enabled' => true,
            ],
        ]);

    $response->assertOk();
    expect(Setting::get('projects_enabled'))->toBeTrue();

    // Verify /projects is accessible again
    $this->get('/projects')->assertOk();
});
