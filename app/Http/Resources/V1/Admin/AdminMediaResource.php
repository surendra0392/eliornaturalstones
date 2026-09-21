<?php

namespace App\Http\Resources\V1\Admin;

use App\Models\Collection;
use App\Models\Page;
use App\Models\Variety;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * @mixin Media
 */
class AdminMediaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $associatedEntity = null;
        $isAssociated = false;

        $model = $this->model;

        if ($this->model_type === Collection::class && $model instanceof Collection) {
            $associatedEntity = [
                'type' => 'collection',
                'id' => $model->id,
                'name' => $model->name,
                'slug' => $model->slug,
            ];
            $isAssociated = true;
        } elseif ($this->model_type === Variety::class && $model instanceof Variety) {
            $associatedEntity = [
                'type' => 'variety',
                'id' => $model->id,
                'name' => $model->name,
                'slug' => $model->slug,
                'parent_collection' => $model->collection?->name,
            ];
            $isAssociated = true;
        } elseif ($this->model_type === Page::class && $model instanceof Page) {
            $associatedEntity = [
                'type' => 'page',
                'id' => $model->id,
                'name' => $model->title,
                'slug' => $model->slug,
            ];
            $isAssociated = true;
        }

        $width = $this->getCustomProperty('width');
        $height = $this->getCustomProperty('height');

        $thumbUrl = $this->hasGeneratedConversion('thumb')
            ? $this->getUrl('thumb')
            : $this->getUrl();

        $largeUrl = $this->hasGeneratedConversion('large')
            ? $this->getUrl('large')
            : $this->getUrl();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'file_name' => $this->file_name,
            'mime_type' => $this->mime_type,
            'size' => $this->size,
            'size_formatted' => $this->formatBytes((int) $this->size),
            'url' => $this->getUrl(),
            'thumb_url' => $thumbUrl,
            'large_url' => $largeUrl,
            'dimensions' => [
                'width' => is_numeric($width) ? (int) $width : null,
                'height' => is_numeric($height) ? (int) $height : null,
                'formatted' => (is_numeric($width) && is_numeric($height))
                    ? "{$width} × {$height}"
                    : null,
            ],
            'alt_text' => $this->getCustomProperty('alt_text') ?: null,
            'collection_name' => $this->collection_name,
            'model_type' => $this->model_type,
            'model_id' => $this->model_id,
            'is_associated' => $isAssociated,
            'associated_entity' => $associatedEntity,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    /**
     * Format bytes into human-readable size string.
     */
    protected function formatBytes(int $bytes, int $precision = 1): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = (int) min($pow, count($units) - 1);
        $bytes /= (1 << (10 * $pow));

        return round($bytes, $precision).' '.$units[$pow];
    }
}
