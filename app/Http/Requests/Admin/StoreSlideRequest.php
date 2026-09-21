<?php

namespace App\Http\Requests\Admin;

use App\Models\Slide;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSlideRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::in([Slide::STATUS_PUBLISHED, Slide::STATUS_DRAFT])],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'duration' => ['nullable', 'integer', 'min:1000', 'max:60000'],
            'transition' => ['nullable', 'string', Rule::in(['fade', 'slide', 'crossfade', 'cinematic'])],
            'background_type' => ['required', 'string', Rule::in(['image', 'color'])],
            'background_image' => ['nullable', 'string', 'max:1000', 'not_regex:/^\s*javascript:/i'],
            'background_color' => ['nullable', 'string', 'max:50'],
            'background_position' => ['nullable', 'string', 'max:100'],
            'background_size' => ['nullable', 'string', 'max:50'],
            'overlay_type' => ['required', 'string', Rule::in(['none', 'subtle', 'medium', 'gradient', 'dark'])],
            'overlay_opacity' => ['required', 'integer', 'min:0', 'max:100'],
            'content_alignment' => ['required', 'string', Rule::in(['left', 'center', 'right'])],
            'content_width' => ['required', 'string', Rule::in(['compact', 'standard', 'wide', 'full'])],
            'vertical_position' => ['required', 'string', Rule::in(['top', 'center', 'bottom'])],
            'parallax_enabled' => ['nullable', 'boolean'],
            'parallax_intensity' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'settings' => ['nullable', 'array'],
        ];
    }
}
