<?php

namespace App\Http\Resources\V1;

use App\Models\Application;
use App\Models\Variety;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * @mixin Variety
 */
class VarietyResource extends JsonResource
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
            'collection_id' => $this->collection_id,
            'collection_name' => $this->resource->collection?->name,
            'name' => $this->name,
            'slug' => $this->slug,
            'origin' => $this->origin,
            'color_family' => $this->color_family,
            'finishes' => $this->finishes ?? [],
            'description' => $this->description,
            'features' => $this->features ?? [],
            'specifications' => $this->specifications ?? [],
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'slab_image' => $this->getFirstMediaUrl('slab') ?: null,
            'swatch_image' => $this->getFirstMediaUrl('swatch') ?: null,
            'gallery_images' => $this->getMedia('gallery')->map(fn (Media $media): array => [
                'id' => $media->id,
                'url' => $media->getUrl(),
                'thumb' => $media->getUrl('thumb'),
                'large' => $media->getUrl('large'),
            ]),
            'applications' => $this->whenLoaded('applications', fn () => $this->resource->applications->map(fn (Application $app): array => [
                'id' => $app->id,
                'name' => $app->name,
                'slug' => $app->slug,
            ])),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
