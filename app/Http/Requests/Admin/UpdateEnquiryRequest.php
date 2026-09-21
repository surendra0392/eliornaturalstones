<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Api\StoreEnquiryRequest;
use App\Models\Enquiry;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEnquiryRequest extends FormRequest
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
        $allowedStatuses = array_merge(Enquiry::STATUSES, ['reviewed', 'contacted', 'archived']);

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'company' => ['nullable', 'string', 'max:255'],
            'project_space' => ['nullable', 'string', 'max:255'],
            'type' => ['sometimes', 'required', 'string', 'max:100'],
            'enquiry_type' => ['nullable', 'string', 'max:100'],
            'material_interest' => [
                'nullable',
                'string',
                'max:255',
            ],
            'collection' => [
                'nullable',
                'string',
                'max:255',
                Rule::in(StoreEnquiryRequest::CANONICAL_COLLECTIONS),
            ],
            'estimated_requirement' => ['nullable', 'string', 'max:255'],
            'message' => ['sometimes', 'required', 'string', 'max:10000'],
            'status' => ['sometimes', 'required', 'string', Rule::in($allowedStatuses)],
            'metadata' => ['nullable', 'array'],
        ];
    }

    /**
     * Custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Client or studio name is required.',
            'email.required' => 'A valid contact email address is required.',
            'email.email' => 'Please provide a valid email format.',
            'status.in' => 'Status must be one of: pending, in_progress, responded, closed.',
            'collection.in' => 'Collection must be one of the canonical ELIOR stone collections.',
        ];
    }
}
