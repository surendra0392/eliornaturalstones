<?php

namespace App\Http\Requests\Admin;

use App\Models\Collection;
use App\Models\Variety;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMediaRequest extends FormRequest
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
            'file' => [
                'required_without:files',
                'file',
                'image',
                'mimes:jpeg,png,webp,avif,jpg',
                'max:10240',
            ],
            'files' => [
                'sometimes',
                'array',
            ],
            'files.*' => [
                'file',
                'image',
                'mimes:jpeg,png,webp,avif,jpg',
                'max:10240',
            ],
            'alt_text' => [
                'nullable',
                'string',
                'max:255',
            ],
            'entity_type' => [
                'nullable',
                'string',
                'in:collection,variety,unassigned',
            ],
            'entity_id' => [
                'nullable',
                'integer',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (! $value) {
                        return;
                    }

                    $entityType = $this->input('entity_type');
                    if ($entityType === 'collection') {
                        if (! Collection::where('id', $value)->exists()) {
                            $fail('The selected parent collection does not exist.');
                        }
                    } elseif ($entityType === 'variety') {
                        if (! Variety::where('id', $value)->exists()) {
                            $fail('The selected stone variety does not exist.');
                        }
                    }
                },
            ],
            'collection_name' => [
                'nullable',
                'string',
                'max:50',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (! $value) {
                        return;
                    }

                    $entityType = $this->input('entity_type');
                    if ($entityType === 'collection' && ! in_array($value, ['hero', 'gallery'], true)) {
                        $fail('Allowed media collections for stone collections are: hero, gallery.');
                    } elseif ($entityType === 'variety' && ! in_array($value, ['slab', 'swatch', 'gallery'], true)) {
                        $fail('Allowed media collections for stone varieties are: slab, swatch, gallery.');
                    }
                },
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'file.required_without' => 'Please select at least one image file to upload.',
            'file.image' => 'The uploaded file must be a valid image.',
            'file.mimes' => 'Images must be in JPEG, PNG, WebP, or AVIF format.',
            'file.max' => 'Images may not exceed 10MB in size.',
            'files.*.image' => 'All uploaded files must be valid images.',
            'files.*.mimes' => 'All images must be in JPEG, PNG, WebP, or AVIF format.',
            'files.*.max' => 'Individual images may not exceed 10MB in size.',
            'entity_type.in' => 'Target entity must be collection, variety, or unassigned.',
        ];
    }
}
