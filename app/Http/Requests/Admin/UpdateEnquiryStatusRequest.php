<?php

namespace App\Http\Requests\Admin;

use App\Models\Enquiry;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEnquiryStatusRequest extends FormRequest
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
            'status' => ['required', 'string', Rule::in($allowedStatuses)],
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
            'status.required' => 'An enquiry status is required.',
            'status.in' => 'The status must be one of: pending, in_progress, responded, closed.',
        ];
    }
}
