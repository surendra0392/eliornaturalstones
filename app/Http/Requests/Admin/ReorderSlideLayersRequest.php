<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ReorderSlideLayersRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'layer_ids' => ['required', 'array'],
            'layer_ids.*' => ['required', 'integer', 'exists:slide_layers,id'],
        ];
    }
}
