<?php

namespace App\Http\Resources\V1\Admin;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Page
 */
class AdminPageResource extends JsonResource
{
    /**
     * Canonical page slugs.
     *
     * @var array<int, string>
     */
    public const CANONICAL_SLUGS = [
        'home',
        'collections',
        'our-story',
        'from-source-to-space',
        'projects',
        'contact',
    ];

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isCanonical = in_array($this->slug, self::CANONICAL_SLUGS, true);
        $content = is_array($this->content) ? $this->content : [];
        $template = $content['template'] ?? $this->slug;

        // Count structured sections, excluding internal template field
        $sectionCount = count(array_filter(
            array_keys($content),
            fn ($k) => $k !== 'template'
        ));

        $liveUrl = $this->slug === 'home' ? '/' : "/{$this->slug}";

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'subtitle' => $this->subtitle,
            'excerpt' => $this->excerpt,
            'content' => $content,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'is_published' => (bool) $this->is_published,
            'is_canonical' => $isCanonical,
            'template' => $template,
            'section_count' => $sectionCount,
            'live_url' => $liveUrl,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
