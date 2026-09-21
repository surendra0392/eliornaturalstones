<?php

namespace App\Http\Resources\V1\Admin;

use App\Models\SlideLayer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin SlideLayer
 */
class AdminSlideLayerResource extends JsonResource
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
            'slide_id' => $this->slide_id,
            'type' => $this->type,
            'name' => $this->name,
            'sort_order' => $this->sort_order,
            'z_index' => $this->z_index,
            'is_visible' => $this->is_visible,
            'content' => $this->content,
            'positioning' => $this->positioning,
            'animation' => $this->animation,
            'responsive' => $this->responsive,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
