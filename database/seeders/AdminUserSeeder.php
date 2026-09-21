<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $email = (string) config('auth.admin_default_email', 'admin@eliornaturalstones.com');
        $password = (string) config('auth.admin_default_password', 'password');

        // Production Safety Mechanism: Strictly prohibit seeding known or weak development passwords in production
        if (app()->isProduction()) {
            $insecurePasswords = ['password', 'admin', 'admin123', 'root', 'secret', '12345678'];
            if (empty($password) || in_array(strtolower($password), $insecurePasswords, true) || strlen($password) < 12) {
                throw new \RuntimeException(
                    'PRODUCTION SECURITY VIOLATION: Cannot seed administrator with default or weak password in production. '.
                    'Please set a strong, unique ADMIN_DEFAULT_PASSWORD environment variable (minimum 12 characters) before running seeders.'
                );
            }
        }

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'ELIOR Administrator',
                'password' => Hash::make($password),
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
