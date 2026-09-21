<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $phone
 * @property string|null $company
 * @property string $type
 * @property string|null $material_interest
 * @property string $message
 * @property string $status
 * @property array<string, mixed>|null $metadata
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read string|null $project_space
 * @property-read string|null $collection
 * @property-read string|null $estimated_requirement
 *
 * @method static Builder<static> search(?string $search)
 * @method static Builder<static> filterStatus(?string $status)
 * @method static Builder<static> filterType(?string $type)
 * @method static Builder<static> filterCollection(?string $collection)
 */
class Enquiry extends Model
{
    public const STATUS_PENDING = 'pending';

    public const STATUS_IN_PROGRESS = 'in_progress';

    public const STATUS_RESPONDED = 'responded';

    public const STATUS_CLOSED = 'closed';

    public const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_IN_PROGRESS,
        self::STATUS_RESPONDED,
        self::STATUS_CLOSED,
    ];

    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'type',
        'material_interest',
        'message',
        'status',
        'metadata',
        'ip_address',
        'user_agent',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'metadata' => 'array',
        ];
    }

    /**
     * Accessor for project or space description.
     */
    public function getProjectSpaceAttribute(): ?string
    {
        /** @var array<string, mixed>|null $meta */
        $meta = $this->metadata;

        if (is_array($meta) && ! empty($meta['project_space'])) {
            return (string) $meta['project_space'];
        }

        return $this->company;
    }

    /**
     * Accessor for stone collection interest.
     */
    public function getCollectionAttribute(): ?string
    {
        /** @var array<string, mixed>|null $meta */
        $meta = $this->metadata;

        if (is_array($meta) && ! empty($meta['collection'])) {
            return (string) $meta['collection'];
        }

        return $this->material_interest;
    }

    /**
     * Accessor for estimated quantity or requirement.
     */
    public function getEstimatedRequirementAttribute(): ?string
    {
        /** @var array<string, mixed>|null $meta */
        $meta = $this->metadata;

        if (is_array($meta) && ! empty($meta['estimated_requirement'])) {
            return (string) $meta['estimated_requirement'];
        }

        return null;
    }

    /**
     * Scope query to search across name, email, phone, company, message.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (empty($search)) {
            return $query;
        }

        $term = '%'.trim($search).'%';

        return $query->where(function (Builder $q) use ($term) {
            $q->where('name', 'like', $term)
                ->orWhere('email', 'like', $term)
                ->orWhere('phone', 'like', $term)
                ->orWhere('company', 'like', $term)
                ->orWhere('message', 'like', $term);
        });
    }

    /**
     * Scope query to filter by enquiry status.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeFilterStatus(Builder $query, ?string $status): Builder
    {
        if (empty($status) || $status === 'all') {
            return $query;
        }

        // Support aliases if passed
        $mapped = match ($status) {
            'reviewed' => self::STATUS_IN_PROGRESS,
            'contacted' => self::STATUS_RESPONDED,
            'archived' => self::STATUS_CLOSED,
            default => $status,
        };

        if (in_array($mapped, self::STATUSES, true)) {
            return $query->where('status', $mapped);
        }

        return $query->where('status', $status);
    }

    /**
     * Scope query to filter by enquiry type.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeFilterType(Builder $query, ?string $type): Builder
    {
        if (empty($type) || $type === 'all') {
            return $query;
        }

        return $query->where(function (Builder $q) use ($type) {
            $q->where('type', $type)
                ->orWhereJsonContains('metadata->enquiry_type', $type);
        });
    }

    /**
     * Scope query to filter by stone collection.
     *
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeFilterCollection(Builder $query, ?string $collection): Builder
    {
        if (empty($collection) || $collection === 'all') {
            return $query;
        }

        return $query->where(function (Builder $q) use ($collection) {
            $q->where('material_interest', $collection)
                ->orWhereJsonContains('metadata->collection', $collection);
        });
    }
}
