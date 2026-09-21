<?php

namespace App\Http\Resources\V1\Admin;

use App\Models\Slide;
use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Slider
 */
class AdminSliderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'status' => $this->status,
            'settings' => $this->settings ?? Slider::defaultSettings(),
            'slides_count' => $this->slides()->count(),
            'published_slides_count' => $this->slides()->published()->count(),
            'slides' => $this->when(
                $this->relationLoaded('slides'),
                fn () => $this->slides->map(fn (Slide $slide): array => (new AdminSlideResource($slide))->toArray($request))->values()->all()
            ),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
