<?php

namespace App\Http\Requests\Admin;

use App\Models\Slider;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSliderRequest extends FormRequest
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
        $slider = $this->route('slider');
        $sliderId = $slider instanceof Slider ? $slider->id : (int) $slider;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', 'alpha_dash', Rule::unique('sliders', 'slug')->ignore($sliderId)],
            'description' => ['nullable', 'string', 'max:1000'],
            'status' => ['sometimes', 'required', 'string', Rule::in([Slider::STATUS_PUBLISHED, Slider::STATUS_DRAFT])],
            'settings' => ['nullable', 'array'],
            'settings.autoplay' => ['nullable', 'boolean'],
            'settings.autoplay_interval' => ['nullable', 'integer', 'min:1000', 'max:60000'],
            'settings.pause_on_hover' => ['nullable', 'boolean'],
            'settings.loop' => ['nullable', 'boolean'],
            'settings.navigation' => ['nullable', 'boolean'],
            'settings.pagination' => ['nullable', 'boolean'],
            'settings.progress_bar' => ['nullable', 'boolean'],
            'settings.keyboard_nav' => ['nullable', 'boolean'],
            'settings.touch_swipe' => ['nullable', 'boolean'],
            'settings.default_transition' => ['nullable', 'string', Rule::in(['fade', 'slide', 'crossfade', 'cinematic'])],
            'settings.transition_duration' => ['nullable', 'numeric', 'min:0.1', 'max:10.0'],
        ];
    }
}
