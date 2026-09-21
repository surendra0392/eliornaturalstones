<?php

namespace App\Http\Requests\Admin;

use App\Models\Setting;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateSettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'group' => ['sometimes', 'nullable', 'string', Rule::in(Setting::GROUPS)],
            'settings' => ['required', 'array'],
        ];
    }

    /**
     * Configure the validator instance with granular per-setting rules and security constraints.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            /** @var array<string, mixed> $settings */
            $settings = $this->input('settings', []);

            foreach ($settings as $key => $value) {
                // 1. Strict Whitelist Check: Prevent arbitrary key injection
                if (! in_array($key, Setting::CANONICAL_KEYS, true)) {
                    $validator->errors()->add("settings.{$key}", "The setting key '{$key}' is not a permitted system setting.");

                    continue;
                }

                if ($value === null || $value === '') {
                    continue;
                }

                // 2. Prevent Executable HTML/Script Injection
                if (is_string($value) && (stripos($value, '<script') !== false || stripos($value, 'javascript:') !== false)) {
                    $validator->errors()->add("settings.{$key}", 'Executable scripts or javascript protocols are not permitted.');
                }

                // 4. Type-specific validation
                $def = Setting::DEFINITIONS[$key];
                $type = $def['type'];

                if ($type === 'email') {
                    if (! filter_var($value, FILTER_VALIDATE_EMAIL)) {
                        $validator->errors()->add("settings.{$key}", "Please provide a valid email address for '{$key}'.");
                    }
                } elseif ($type === 'url') {
                    if (! filter_var($value, FILTER_VALIDATE_URL) || ! preg_match('#^https?://#i', (string) $value)) {
                        $validator->errors()->add("settings.{$key}", "Please provide a valid HTTP or HTTPS URL for '{$key}'.");
                    }
                } elseif ($type === 'media') {
                    // Validate Spatie media ID if integer or structured array passed
                    $mediaId = null;
                    if (is_numeric($value)) {
                        $mediaId = (int) $value;
                    } elseif (is_array($value) && isset($value['id']) && is_numeric($value['id'])) {
                        $mediaId = (int) $value['id'];
                    }

                    if ($mediaId !== null) {
                        $exists = DB::table('media')->where('id', $mediaId)->exists();
                        if (! $exists) {
                            $validator->errors()->add("settings.{$key}", "The referenced media asset #{$mediaId} does not exist.");
                        }
                    }
                } elseif ($type === 'text') {
                    if (is_string($value) && mb_strlen($value) > 255) {
                        $validator->errors()->add("settings.{$key}", "The setting '{$key}' cannot exceed 255 characters.");
                    }
                } elseif ($type === 'textarea') {
                    if (is_string($value) && mb_strlen($value) > 2000) {
                        $validator->errors()->add("settings.{$key}", "The setting '{$key}' cannot exceed 2,000 characters.");
                    }
                }
            }
        });
    }

    /**
     * Custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'settings.required' => 'A settings payload is required.',
            'settings.array' => 'Settings must be provided as a structured key-value array.',
            'group.in' => 'The setting group must be one of: general, branding, contact, seo, social.',
        ];
    }
}
