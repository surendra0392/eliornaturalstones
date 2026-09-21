<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $slider_id
 * @property string $title
 * @property string $status
 * @property int $sort_order
 * @property int|null $duration
 * @property string|null $transition
 * @property string $background_type
 * @property string|null $background_image
 * @property string|null $background_color
 * @property string $background_position
 * @property string $background_size
 * @property string $overlay_type
 * @property int $overlay_opacity
 * @property string $content_alignment
 * @property string $content_width
 * @property string $vertical_position
 * @property bool $parallax_enabled
 * @property float $parallax_intensity
 * @property array<string, mixed>|null $settings
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Slide extends Model
{
    public const STATUS_PUBLISHED = 'published';

    public const STATUS_DRAFT = 'draft';

    protected $fillable = [
        'slider_id',
        'title',
        'status',
        'sort_order',
        'duration',
        'transition',
        'background_type',
        'background_image',
        'background_color',
        'background_position',
        'background_size',
        'overlay_type',
        'overlay_opacity',
        'content_alignment',
        'content_width',
        'vertical_position',
        'parallax_enabled',
        'parallax_intensity',
        'settings',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'duration' => 'integer',
            'overlay_opacity' => 'integer',
            'parallax_enabled' => 'boolean',
            'parallax_intensity' => 'float',
            'settings' => 'array',
        ];
    }

    /**
     * @return BelongsTo<Slider, $this>
     */
    public function slider(): BelongsTo
    {
        return $this->belongsTo(Slider::class);
    }

    /**
     * @return HasMany<SlideLayer, $this>
     */
    public function layers(): HasMany
    {
        return $this->hasMany(SlideLayer::class)->orderBy('sort_order', 'asc')->orderBy('id', 'asc');
    }

    /**
     * Scope query to only published slides.
     *
     * @param  Builder<Slide>  $query
     * @return Builder<Slide>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PUBLISHED);
    }

    /**
     * Duplicate this slide with its layers.
     */
    public function duplicate(?int $targetSliderId = null): self
    {
        $sliderId = $targetSliderId ?? $this->slider_id;
        $maxOrder = (int) self::where('slider_id', $sliderId)->max('sort_order');

        $clone = self::create([
            'slider_id' => $sliderId,
            'title' => $this->title.' (Copy)',
            'status' => self::STATUS_DRAFT,
            'sort_order' => $maxOrder + 1,
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
        ]);

        foreach ($this->layers as $layer) {
            $clone->layers()->create([
                'type' => $layer->type,
                'name' => $layer->name,
                'sort_order' => $layer->sort_order,
                'z_index' => $layer->z_index,
                'is_visible' => $layer->is_visible,
                'content' => $layer->content,
                'positioning' => $layer->positioning,
                'animation' => $layer->animation,
                'responsive' => $layer->responsive,
            ]);
        }

        return $clone;
    }
}
