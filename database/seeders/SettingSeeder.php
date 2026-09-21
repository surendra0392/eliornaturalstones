<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Seed verified ELIOR website configuration settings.
     */
    public function run(): void
    {
        foreach (Setting::DEFINITIONS as $key => $def) {
            Setting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => $def['default'],
                    'group' => $def['group'],
                    'type' => $def['type'],
                    'label' => $def['label'],
                    'description' => $def['description'],
                    'is_public' => $def['is_public'],
                ]
            );
        }
    }
}
