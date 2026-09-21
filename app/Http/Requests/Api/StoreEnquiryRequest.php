<?php

namespace App\Http\Requests\Api;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEnquiryRequest extends FormRequest
{
    /**
     * The canonical ELIOR collections permitted for enquiry.
     */
    public const CANONICAL_COLLECTIONS = [
        'Italian Marble',
        'Granites',
        'Slate Stone',
        'Limestones',
        'Sand Stone',
        'Sandstone',
        'Cobble Stones',
        'Pebbles',
        'Quartz',
        'Sculptures',
    ];

    /**
     * Approved enquiry types for architectural and private consultations.
     */
    public const ENQUIRY_TYPES = [
        'Collection Enquiry',
        'Material Consultation',
        'Project Enquiry',
        'Sample Request',
        'Availability Enquiry',
        'General Enquiry',
    ];

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'enquiry_type' => ['required_without:type', 'string', Rule::in(self::ENQUIRY_TYPES)],
            'type' => ['sometimes', 'nullable', 'string', Rule::in(array_merge(self::ENQUIRY_TYPES, ['general', 'trade', 'sample_request', 'material_spec']))],
            'collection' => ['required_without:material_interest', 'string', Rule::in(self::CANONICAL_COLLECTIONS)],
            'material_interest' => ['sometimes', 'nullable', 'string', 'max:255'],
            'project_space' => ['required_without:company', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'estimated_requirement' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            'metadata' => ['nullable', 'array'],
        ];
    }

    /**
     * Custom validation messages for architectural enquiries.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please provide your full name.',
            'email.required' => 'Please provide your email address.',
            'email.email' => 'Please provide a valid email address.',
            'phone.required' => 'Please provide a contact phone number.',
            'enquiry_type.required_without' => 'Please select an enquiry type.',
            'enquiry_type.in' => 'Please select a valid enquiry type.',
            'type.in' => 'Please select a valid enquiry type.',
            'collection.required_without' => 'Please select an architectural collection.',
            'collection.in' => 'Please select one of the canonical ELIOR collections.',
            'project_space.required_without' => 'Please describe your project or space.',
            'message.required' => 'Please share details about your requirement or project.',
        ];
    }
}
