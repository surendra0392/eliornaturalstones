<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreEnquiryRequest;
use App\Http\Resources\V1\EnquiryResource;
use App\Models\Enquiry;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class EnquiryController extends Controller
{
    use ApiResponse;

    /**
     * Store a newly created enquiry from the public or trade form.
     */
    public function store(StoreEnquiryRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $type = $validated['enquiry_type'] ?? $validated['type'] ?? 'General Enquiry';
        $materialInterest = $validated['collection'] ?? $validated['material_interest'] ?? null;
        $projectSpace = $validated['project_space'] ?? $validated['company'] ?? null;
        $estimatedRequirement = $validated['estimated_requirement'] ?? null;

        /** @var array<string, mixed> $metadata */
        $metadata = is_array($validated['metadata'] ?? null) ? $validated['metadata'] : [];
        if ($projectSpace !== null) {
            $metadata['project_space'] = $projectSpace;
        }
        if ($estimatedRequirement !== null) {
            $metadata['estimated_requirement'] = $estimatedRequirement;
        }
        if (isset($validated['collection'])) {
            $metadata['collection'] = $validated['collection'];
        }
        if (isset($validated['enquiry_type'])) {
            $metadata['enquiry_type'] = $validated['enquiry_type'];
        }

        $enquiry = Enquiry::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'company' => $projectSpace,
            'type' => $type,
            'material_interest' => $materialInterest,
            'message' => $validated['message'],
            'metadata' => $metadata,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status' => 'pending',
        ]);

        return $this->success(
            new EnquiryResource($enquiry),
            'Thank you. Your enquiry has been received by ELIOR.',
            Response::HTTP_CREATED
        );
    }
}
