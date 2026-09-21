<?php

namespace App\Http\Requests\Admin;

use App\Models\SlideLayer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSlideLayerRequest extends FormRequest
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
            'type' => ['required', 'string', Rule::in(SlideLayer::ALLOWED_TYPES)],
            'name' => ['required', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'z_index' => ['nullable', 'integer', 'min:0', 'max:100'],
            'is_visible' => ['nullable', 'boolean'],
            'content' => ['nullable', 'array'],
            'content.text' => ['nullable', 'string', 'max:2000'],
            'content.tag' => ['nullable', 'string', Rule::in(['h1', 'h2', 'h3', 'h4', 'p', 'span'])],
            'content.primary_url' => ['nullable', 'string', 'max:1000', 'not_regex:/^\s*javascript:/i'],
            'content.secondary_url' => ['nullable', 'string', 'max:1000', 'not_regex:/^\s*javascript:/i'],
            'content.src' => ['nullable', 'string', 'max:1000', 'not_regex:/^\s*javascript:/i'],
            'positioning' => ['nullable', 'array'],
            'positioning.horizontal_align' => ['nullable', 'string', Rule::in(['left', 'center', 'right'])],
            'animation' => ['nullable', 'array'],
            'animation.entrance' => ['nullable', 'string', Rule::in([
                'fade-up', 'fade-down', 'fade-in', 'slide-left', 'slide-right', 'scale-in', 'clip-reveal', 'none',
            ])],
            'animation.ease' => ['nullable', 'string', Rule::in([
                'power1.out', 'power2.out', 'power3.out', 'expo.out', 'none',
            ])],
            'animation.duration' => ['nullable', 'numeric', 'min:0.1', 'max:10.0'],
            'animation.delay' => ['nullable', 'numeric', 'min:0', 'max:10.0'],
            'responsive' => ['nullable', 'array'],
        ];
    }
}
