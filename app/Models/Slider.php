<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string $status
 * @property array<string, mixed>|null $settings
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Slider extends Model
{
    public const STATUS_PUBLISHED = 'published';

    public const STATUS_DRAFT = 'draft';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'status',
        'settings',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'settings' => 'array',
        ];
    }

    /**
     * @return HasMany<Slide, $this>
     */
    public function slides(): HasMany
    {
        return $this->hasMany(Slide::class)->orderBy('sort_order', 'asc')->orderBy('id', 'asc');
    }

    /**
     * Scope query to only published sliders.
     *
     * @param  Builder<Slider>  $query
     * @return Builder<Slider>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PUBLISHED);
    }

    /**
     * Default slider configuration.
     *
     * @return array<string, mixed>
     */
    public static function defaultSettings(): array
    {
        return [
            'autoplay' => true,
            'autoplay_interval' => 6000,
            'pause_on_hover' => true,
            'loop' => true,
            'navigation' => true,
            'pagination' => true,
            'progress_bar' => true,
            'keyboard_nav' => true,
            'touch_swipe' => true,
            'default_transition' => 'fade',
            'transition_duration' => 0.8,
        ];
    }

    /**
     * Deep clone slider with all slides and slide layers.
     */
    public function duplicate(): self
    {
        $baseName = $this->name.' (Copy)';
        $baseSlug = $this->slug.'-copy';
        $counter = 1;
        while (self::where('slug', $baseSlug)->exists()) {
            $counter++;
            $baseSlug = $this->slug.'-copy-'.$counter;
        }

        $clone = self::create([
            'name' => $baseName,
            'slug' => $baseSlug,
            'description' => $this->description,
            'status' => self::STATUS_DRAFT,
            'settings' => $this->settings,
        ]);

        foreach ($this->slides()->with('layers')->get() as $slide) {
            $slideClone = $clone->slides()->create([
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
            ]);

            foreach ($slide->layers as $layer) {
                $slideClone->layers()->create([
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
        }

        return $clone;
    }
}
