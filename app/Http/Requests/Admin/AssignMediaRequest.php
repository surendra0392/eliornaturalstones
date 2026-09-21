<?php

namespace App\Http\Requests\Admin;

use App\Models\Collection;
use App\Models\Variety;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AssignMediaRequest extends FormRequest
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
            'entity_type' => [
                'required',
                'string',
                'in:collection,variety',
            ],
            'entity_id' => [
                'required',
                'integer',
                function (string $attribute, mixed $value, \Closure $fail): void {
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
                'required',
                'string',
                'max:50',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    $entityType = $this->input('entity_type');
                    if ($entityType === 'collection' && ! in_array($value, ['hero', 'gallery'], true)) {
                        $fail('Allowed media collections for stone collections are: hero, gallery.');
                    } elseif ($entityType === 'variety' && ! in_array($value, ['slab', 'swatch', 'gallery'], true)) {
                        $fail('Allowed media collections for stone varieties are: slab, swatch, gallery.');
                    }
                },
            ],
            'mode' => [
                'nullable',
                'string',
                'in:copy,move',
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
            'entity_type.required' => 'Please select a target entity type (Collection or Variety).',
            'entity_type.in' => 'Target entity type must be collection or variety.',
            'entity_id.required' => 'Please select a specific target entity record.',
            'collection_name.required' => 'Please specify the target media slot.',
        ];
    }
}
