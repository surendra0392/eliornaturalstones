<?php

namespace App\Http\Resources\V1;

use App\Models\Enquiry;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Enquiry
 */
class EnquiryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $metadata = $this->metadata;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'company' => $this->company,
            'project_space' => $metadata['project_space'] ?? $this->company,
            'type' => $this->type,
            'material_interest' => $this->material_interest,
            'collection' => $this->material_interest,
            'estimated_requirement' => $metadata['estimated_requirement'] ?? null,
            'message' => $this->message,
            'metadata' => $metadata,
            'status' => $this->status,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
