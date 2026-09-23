<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $key
 * @property mixed $value
 * @property string $group
 * @property string $type
 * @property string|null $label
 * @property string|null $description
 * @property bool $is_public
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @method static Builder<static> group(string $group)
 */
class Setting extends Model
{
    public const GROUP_GENERAL = 'general';

    public const GROUP_BRANDING = 'branding';

    public const GROUP_CONTACT = 'contact';

    public const GROUP_SEO = 'seo';

    public const GROUP_SOCIAL = 'social';

    public const GROUPS = [
        self::GROUP_GENERAL,
        self::GROUP_BRANDING,
        self::GROUP_CONTACT,
        self::GROUP_SEO,
        self::GROUP_SOCIAL,
    ];

    /**
     * Canonical schema definitions for all recognized ELIOR website settings.
     *
     * @var array<string, array{key: string, group: string, type: string, label: string, description: string, default: mixed, is_public: bool}>
     */
    public const DEFINITIONS = [
        // A. General
        'site_name' => [
            'key' => 'site_name',
            'group' => self::GROUP_GENERAL,
            'type' => 'text',
            'label' => 'Site Name',
            'description' => 'The brand and corporate name of the website.',
            'default' => 'ELIOR',
            'is_public' => true,
        ],
        'brand_descriptor' => [
            'key' => 'brand_descriptor',
            'group' => self::GROUP_GENERAL,
            'type' => 'text',
            'label' => 'Brand Descriptor',
            'description' => 'Short architectural positioning tagline.',
            'default' => 'Natural Stones',
            'is_public' => true,
        ],
        'default_location' => [
            'key' => 'default_location',
            'group' => self::GROUP_GENERAL,
            'type' => 'text',
            'label' => 'Default Location',
            'description' => 'Primary headquarters and gallery studio location.',
            'default' => 'Hyderabad, India',
            'is_public' => true,
        ],
        'primary_phone' => [
            'key' => 'primary_phone',
            'group' => self::GROUP_GENERAL,
            'type' => 'text',
            'label' => 'Primary Phone',
            'description' => 'Main direct telephone line for trade and client consultations.',
            'default' => '+91 81259 58071',
            'is_public' => true,
        ],
        'primary_email' => [
            'key' => 'primary_email',
            'group' => self::GROUP_GENERAL,
            'type' => 'email',
            'label' => 'Primary Email',
            'description' => 'Main contact email address for official inquiries.',
            'default' => 'info@eliornaturalstones.com',
            'is_public' => true,
        ],

        // B. Branding
        'logo_media_id' => [
            'key' => 'logo_media_id',
            'group' => self::GROUP_BRANDING,
            'type' => 'media',
            'label' => 'Brand Logo Asset',
            'description' => 'Vector or high-resolution architectural logo mark.',
            'default' => null,
            'is_public' => true,
        ],
        'favicon_media_id' => [
            'key' => 'favicon_media_id',
            'group' => self::GROUP_BRANDING,
            'type' => 'media',
            'label' => 'Favicon Asset',
            'description' => 'Browser tab icon asset.',
            'default' => null,
            'is_public' => true,
        ],
        'default_share_image_id' => [
            'key' => 'default_share_image_id',
            'group' => self::GROUP_BRANDING,
            'type' => 'media',
            'label' => 'Default Social Share Image',
            'description' => 'Global Open Graph share card for social previews.',
            'default' => null,
            'is_public' => true,
        ],

        // C. Contact
        'enquiry_phone' => [
            'key' => 'enquiry_phone',
            'group' => self::GROUP_CONTACT,
            'type' => 'text',
            'label' => 'Enquiry Phone',
            'description' => 'Dedicated inquiry and sample dispatch phone line.',
            'default' => '+91 81259 58071',
            'is_public' => true,
        ],
        'enquiry_email' => [
            'key' => 'enquiry_email',
            'group' => self::GROUP_CONTACT,
            'type' => 'email',
            'label' => 'Enquiry Email',
            'description' => 'Dedicated specification desk email address.',
            'default' => 'info@eliornaturalstones.com',
            'is_public' => true,
        ],
        'business_location' => [
            'key' => 'business_location',
            'group' => self::GROUP_CONTACT,
            'type' => 'text',
            'label' => 'Business Location',
            'description' => 'Gallery and material viewing showroom address.',
            'default' => 'Hyderabad, India',
            'is_public' => true,
        ],
        'availability_text' => [
            'key' => 'availability_text',
            'group' => self::GROUP_CONTACT,
            'type' => 'text',
            'label' => 'Viewing Availability',
            'description' => 'Viewing and appointment policy descriptor.',
            'default' => 'Private Viewings by Appointment',
            'is_public' => true,
        ],

        // D. SEO Defaults
        'default_meta_title' => [
            'key' => 'default_meta_title',
            'group' => self::GROUP_SEO,
            'type' => 'text',
            'label' => 'Default Meta Title',
            'description' => 'Fallback browser title when a page has no custom meta title.',
            'default' => 'ELIOR Natural Stones — Curated Architectural Stone',
            'is_public' => true,
        ],
        'default_meta_description' => [
            'key' => 'default_meta_description',
            'group' => self::GROUP_SEO,
            'type' => 'textarea',
            'label' => 'Default Meta Description',
            'description' => 'Fallback search engine description snippet.',
            'default' => 'ELIOR curates nine canonical natural stone collections for discerning architects, interior designers, and luxury private residences.',
            'is_public' => true,
        ],
        'default_social_image_id' => [
            'key' => 'default_social_image_id',
            'group' => self::GROUP_SEO,
            'type' => 'media',
            'label' => 'Fallback Social Image',
            'description' => 'Fallback image used when a page or collection specifies no custom image.',
            'default' => null,
            'is_public' => true,
        ],

        // E. Social Links
        'instagram_url' => [
            'key' => 'instagram_url',
            'group' => self::GROUP_SOCIAL,
            'type' => 'url',
            'label' => 'Instagram Profile URL',
            'description' => 'Official architectural showcase on Instagram.',
            'default' => null,
            'is_public' => true,
        ],
        'linkedin_url' => [
            'key' => 'linkedin_url',
            'group' => self::GROUP_SOCIAL,
            'type' => 'url',
            'label' => 'LinkedIn Company URL',
            'description' => 'Official corporate profile on LinkedIn.',
            'default' => null,
            'is_public' => true,
        ],
        'pinterest_url' => [
            'key' => 'pinterest_url',
            'group' => self::GROUP_SOCIAL,
            'type' => 'url',
            'label' => 'Pinterest Showcase URL',
            'description' => 'Official material moodboards on Pinterest.',
            'default' => null,
            'is_public' => true,
        ],
    ];

    /**
     * Whitelist of strictly permitted keys to prevent arbitrary key injection.
     *
     * @var array<int, string>
     */
    public const CANONICAL_KEYS = [
        'site_name',
        'brand_descriptor',
        'default_location',
        'primary_phone',
        'primary_email',
        'logo_media_id',
        'favicon_media_id',
        'default_share_image_id',
        'enquiry_phone',
        'enquiry_email',
        'business_location',
        'availability_text',
        'default_meta_title',
        'default_meta_description',
        'default_social_image_id',
        'instagram_url',
        'linkedin_url',
        'pinterest_url',
    ];

    protected $fillable = [
        'key',
        'value',
        'group',
        'type',
        'label',
        'description',
        'is_public',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
        ];
    }

    /**
     * Custom accessor for value supporting scalars and structured objects.
     */
    public function getValueAttribute(mixed $value): mixed
    {
        if (is_null($value)) {
            return null;
        }

        $decoded = json_decode((string) $value, true);

        return json_last_error() === JSON_ERROR_NONE ? $decoded : $value;
    }

    /**
     * Custom mutator for value supporting scalars and structured objects.
     */
    public function setValueAttribute(mixed $value): void
    {
        $this->attributes['value'] = is_null($value) ? null : json_encode($value);
    }

    /**
     * Retrieve a setting value by key, falling back to definition default or provided default.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = static::where('key', $key)->first();

        if ($setting !== null && $setting->value !== null) {
            return $setting->value;
        }

        if (isset(self::DEFINITIONS[$key]['default'])) {
            return self::DEFINITIONS[$key]['default'];
        }

        return $default;
    }

    /**
     * Persist or update a single setting.
     */
    public static function set(
        string $key,
        mixed $value,
        ?string $group = null,
        ?string $type = null
    ): self {
        $def = self::DEFINITIONS[$key] ?? [];

        $group = $group ?? ($def['group'] ?? self::GROUP_GENERAL);
        $type = $type ?? ($def['type'] ?? 'text');
        $label = $def['label'] ?? ucfirst(str_replace('_', ' ', $key));
        $description = $def['description'] ?? null;
        $isPublic = $def['is_public'] ?? true;

        return static::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'group' => $group,
                'type' => $type,
                'label' => $label,
                'description' => $description,
                'is_public' => $isPublic,
            ]
        );
    }

    /**
     * Filter query by group.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeGroup(Builder $query, string $group): Builder
    {
        return $query->where('group', $group);
    }

    /**
     * Return safe, public-facing settings dictionary for frontend consumption.
     * Never exposes private configuration, credentials, or secrets.
     *
     * @return array<string, mixed>
     */
    public static function getPublicSettings(): array
    {
        $dbSettings = static::where('is_public', true)
            ->get()
            ->keyBy('key');

        $result = [];

        foreach (self::DEFINITIONS as $key => $def) {
            if (isset($dbSettings[$key]) && $dbSettings[$key]->value !== null) {
                $result[$key] = $dbSettings[$key]->value;
            } else {
                $result[$key] = $def['default'];
            }
        }

        // Add grouped social links convenient dictionary
        $result['social_links'] = [
            'instagram' => $result['instagram_url'] ?? null,
            'linkedin' => $result['linkedin_url'] ?? null,
            'pinterest' => $result['pinterest_url'] ?? null,
        ];

        return $result;
    }

    /**
     * Return all categorized settings for the Admin console.
     * Combines database values with canonical definition schema.
     *
     * @return array<string, array<int, array<string, mixed>>>
     */
    public static function getAllCategorized(): array
    {
        $dbSettings = static::all()->keyBy('key');

        $categorized = [
            self::GROUP_GENERAL => [],
            self::GROUP_BRANDING => [],
            self::GROUP_CONTACT => [],
            self::GROUP_SEO => [],
            self::GROUP_SOCIAL => [],
        ];

        foreach (self::DEFINITIONS as $key => $def) {
            $group = $def['group'];

            $record = $dbSettings[$key] ?? null;
            $value = $record !== null ? $record->value : $def['default'];

            $item = [
                'key' => $key,
                'value' => $value,
                'group' => $group,
                'type' => $def['type'],
                'label' => $def['label'],
                'description' => $def['description'],
                'default' => $def['default'],
                'is_public' => $def['is_public'],
                'updated_at' => $record?->updated_at?->toIso8601String(),
            ];

            $categorized[$group][] = $item;
        }

        return $categorized;
    }
}
