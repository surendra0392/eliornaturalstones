<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $seeders = [
            CollectionSeeder::class,
            VarietySeeder::class,
            AdminUserSeeder::class,
            PageSeeder::class,
            SettingSeeder::class,
            SliderSeeder::class,
        ];

        // Production Safety: Never seed fake/demo customer enquiries in production
        if (! app()->isProduction()) {
            $seeders[] = EnquirySeeder::class;
        }

        $this->call($seeders);
    }
}
