<?php

namespace App\Http\Resources\V1;

use App\Models\Slide;
use App\Models\SlideLayer;
use App\Models\Slider;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Slider
 */
class SliderResource extends JsonResource
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
            'status' => $this->status,
            'settings' => $this->settings ?? Slider::defaultSettings(),
            'slides' => $this->slides()
                ->published()
                ->with(['layers' => fn (Relation $q) => $q->where('is_visible', true)->orderBy('sort_order', 'asc')->orderBy('id', 'asc')])
                ->orderBy('sort_order', 'asc')
                ->orderBy('id', 'asc')
                ->get()
                ->map(fn (Slide $slide): array => [
                    'id' => $slide->id,
                    'title' => $slide->title,
                    'status' => $slide->status,
                    'sort_order' => $slide->sort_order,
                    'duration' => $slide->duration,
                    'transition' => $slide->transition,
                    'background_type' => $slide->background_type,
                    'background_image' => $slide->background_image,
                    'background_color' => $slide->background_color,
                    'background_position' => $slide->background_position,
                    'background_size' => $slide->background_size,
                    'overlay_type' => $slide->overlay_type,
                    'overlay_opacity' => $slide->overlay_opacity,
                    'content_alignment' => $slide->content_alignment,
                    'content_width' => $slide->content_width,
                    'vertical_position' => $slide->vertical_position,
                    'parallax_enabled' => $slide->parallax_enabled,
                    'parallax_intensity' => $slide->parallax_intensity,
                    'settings' => $slide->settings,
                    'layers' => $slide->layers->map(fn (SlideLayer $layer): array => [
                        'id' => $layer->id,
                        'type' => $layer->type,
                        'name' => $layer->name,
                        'is_visible' => $layer->is_visible,
                        'sort_order' => $layer->sort_order,
                        'z_index' => $layer->z_index,
                        'content' => $layer->content,
                        'positioning' => $layer->positioning,
                        'animation' => $layer->animation,
                        'responsive' => $layer->responsive,
                    ]),
                ]),
        ];
    }
}
