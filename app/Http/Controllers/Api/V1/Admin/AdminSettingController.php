<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingsRequest;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminSettingController extends Controller
{
    /**
     * Retrieve all categorized settings and public configurations.
     */
    public function index(Request $request): JsonResponse
    {
        $group = $request->input('group');

        $categorized = Setting::getAllCategorized();

        if ($group && isset($categorized[$group])) {
            return response()->json([
                'data' => [
                    $group => $categorized[$group],
                ],
                'message' => "Settings for group '{$group}' retrieved successfully.",
            ]);
        }

        return response()->json([
            'data' => $categorized,
            'public_settings' => Setting::getPublicSettings(),
            'message' => 'Site configuration settings retrieved successfully.',
        ]);
    }

    /**
     * Update settings by group or batch without overwriting unrelated groups.
     */
    public function update(UpdateSettingsRequest $request): JsonResponse
    {
        /** @var array<string, mixed> $settings */
        $settings = $request->input('settings', []);
        $targetGroup = $request->input('group');

        foreach ($settings as $key => $value) {
            $def = Setting::DEFINITIONS[$key] ?? null;
            if (! $def) {
                continue;
            }

            // If a specific group was specified, only update settings belonging to that group
            if ($targetGroup && $def['group'] !== $targetGroup) {
                continue;
            }

            Setting::set(
                $key,
                $value,
                $def['group'],
                $def['type']
            );
        }

        $groupLabel = $targetGroup ? ucfirst($targetGroup).' ' : '';

        return response()->json([
            'data' => Setting::getAllCategorized(),
            'public_settings' => Setting::getPublicSettings(),
            'message' => "{$groupLabel}Settings updated successfully.",
        ]);
    }
}
