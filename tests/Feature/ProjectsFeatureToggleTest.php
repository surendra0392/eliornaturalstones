<?php

use App\Models\Setting;
use App\Models\User;
use Database\Seeders\SettingSeeder;

beforeEach(function () {
    (new SettingSeeder)->run();
});

test('projects route is disabled by default when projects_enabled is false', function () {
    expect(Setting::get('projects_enabled', false))->toBeFalse();

    $this->get('/projects')->assertNotFound();
});

test('projects route returns 200 when projects_enabled is true', function () {
    Setting::set('projects_enabled', true, Setting::GROUP_GENERAL, 'boolean');

    expect(Setting::get('projects_enabled'))->toBeTrue();

    $this->get('/projects')->assertOk();
});

test('admin can toggle projects_enabled via settings API', function () {
    $admin = User::factory()->create([
        'is_admin' => true,
    ]);

    // Enable projects
    $response = $this->actingAs($admin)
        ->patchJson('/api/v1/admin/settings', [
            'group' => 'general',
            'settings' => [
                'projects_enabled' => true,
            ],
        ]);

    $response->assertOk();
    expect(Setting::get('projects_enabled'))->toBeTrue();

    // Verify /projects is accessible
    $this->get('/projects')->assertOk();

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
});
