<?php

namespace App\Http\Requests\Admin;

use App\Models\Collection;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVarietyRequest extends FormRequest
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
            'collection_id' => [
                'required',
                'integer',
                'exists:collections,id',
            ],
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'slug' => [
                'required',
                'string',
                'alpha_dash',
                'max:255',
                'unique:varieties,slug',
                Rule::notIn(['projects', 'admin']),
            ],
            'origin' => ['nullable', 'string', 'max:255'],
            'color_family' => ['nullable', 'string', 'max:255'],
            'finishes' => ['nullable', 'array'],
            'finishes.*' => ['string', 'max:100'],
            'description' => ['nullable', 'string'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:255'],
            'specifications' => ['nullable', 'array'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'is_featured' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ];
    }

    /**
     * Custom validation error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'collection_id.required' => 'Please select an architectural stone collection.',
            'collection_id.exists' => 'The selected collection does not exist.',
            'name.required' => 'The variety name is required.',
            'slug.required' => 'A unique URL slug is required.',
            'slug.alpha_dash' => 'The slug may only contain letters, numbers, dashes, and underscores.',
            'slug.unique' => 'This slug is already registered to another stone variety.',
            'slug.not_in' => 'The specified slug is reserved or prohibited.',
            'sort_order.integer' => 'Display order must be a valid number.',
            'sort_order.min' => 'Display order must be 0 or greater.',
        ];
    }
}
