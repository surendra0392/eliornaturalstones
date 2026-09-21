<?php

namespace App\Http\Resources\V1\Admin;

use App\Models\Slide;
use App\Models\SlideLayer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Slide
 */
class AdminSlideResource extends JsonResource
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
            'slider_id' => $this->slider_id,
            'title' => $this->title,
            'status' => $this->status,
            'sort_order' => $this->sort_order,
            'duration' => $this->duration,
            'transition' => $this->transition,
            'background_type' => $this->background_type,
            'background_image' => $this->background_image,
            'background_color' => $this->background_color,
            'background_position' => $this->background_position,
            'background_size' => $this->background_size,
            'overlay_type' => $this->overlay_type,
            'overlay_opacity' => $this->overlay_opacity,
            'content_alignment' => $this->content_alignment,
            'content_width' => $this->content_width,
            'vertical_position' => $this->vertical_position,
            'parallax_enabled' => $this->parallax_enabled,
            'parallax_intensity' => $this->parallax_intensity,
            'settings' => $this->settings,
            'layers_count' => $this->layers()->count(),
            'layers' => $this->when(
                $this->relationLoaded('layers'),
                fn () => $this->layers->map(fn (SlideLayer $layer): array => (new AdminSlideLayerResource($layer))->toArray($request))->values()->all()
            ),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
