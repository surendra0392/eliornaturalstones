<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $slide_id
 * @property string $type
 * @property string $name
 * @property int $sort_order
 * @property int $z_index
 * @property bool $is_visible
 * @property array<string, mixed>|null $content
 * @property array<string, mixed>|null $positioning
 * @property array<string, mixed>|null $animation
 * @property array<string, mixed>|null $responsive
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class SlideLayer extends Model
{
    public const TYPE_EYEBROW = 'eyebrow';

    public const TYPE_HEADING = 'heading';

    public const TYPE_DESCRIPTION = 'description';

    public const TYPE_CTA = 'cta';

    public const TYPE_IMAGE = 'image';

    public const TYPE_DECORATIVE_SHAPE = 'decorative_shape';

    public const TYPE_SPACER = 'spacer';

    public const ALLOWED_TYPES = [
        self::TYPE_EYEBROW,
        self::TYPE_HEADING,
        self::TYPE_DESCRIPTION,
        self::TYPE_CTA,
        self::TYPE_IMAGE,
        self::TYPE_DECORATIVE_SHAPE,
        self::TYPE_SPACER,
    ];

    protected $fillable = [
        'slide_id',
        'type',
        'name',
        'sort_order',
        'z_index',
        'is_visible',
        'content',
        'positioning',
        'animation',
        'responsive',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'z_index' => 'integer',
            'is_visible' => 'boolean',
            'content' => 'array',
            'positioning' => 'array',
            'animation' => 'array',
            'responsive' => 'array',
        ];
    }

    /**
     * @return BelongsTo<Slide, $this>
     */
    public function slide(): BelongsTo
    {
        return $this->belongsTo(Slide::class);
    }

    /**
     * Scope query to visible layers.
     *
     * @param  Builder<SlideLayer>  $query
     * @return Builder<SlideLayer>
     */
    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('is_visible', true);
    }

    /**
     * Duplicate this layer.
     */
    public function duplicate(?int $targetSlideId = null): self
    {
        $slideId = $targetSlideId ?? $this->slide_id;
        $maxOrder = (int) self::where('slide_id', $slideId)->max('sort_order');

        return self::create([
            'slide_id' => $slideId,
            'type' => $this->type,
            'name' => $this->name.' (Copy)',
            'sort_order' => $maxOrder + 1,
            'z_index' => $this->z_index,
            'is_visible' => $this->is_visible,
            'content' => $this->content,
            'positioning' => $this->positioning,
            'animation' => $this->animation,
            'responsive' => $this->responsive,
        ]);
    }
}
