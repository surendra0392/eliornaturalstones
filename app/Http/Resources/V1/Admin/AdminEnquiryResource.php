<?php

namespace App\Http\Resources\V1\Admin;

use App\Models\Enquiry;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Enquiry
 */
class AdminEnquiryResource extends JsonResource
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
            'email' => $this->email,
            'phone' => $this->phone,
            'company' => $this->company,
            'project_space' => $this->project_space,
            'enquiry_type' => $this->type,
            'type' => $this->type,
            'collection' => $this->collection,
            'material_interest' => $this->material_interest,
            'estimated_requirement' => $this->estimated_requirement,
            'message' => $this->message,
            'status' => $this->status,
            'ip_address' => $this->ip_address,
            'user_agent' => $this->user_agent,
            'metadata' => $this->metadata ?? [],
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'formatted_date' => $this->created_at?->format('d M Y, H:i'),
            'time_ago' => $this->created_at?->diffForHumans(),
        ];
    }
}
