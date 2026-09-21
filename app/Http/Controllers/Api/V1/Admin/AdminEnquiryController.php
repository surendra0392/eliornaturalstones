<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateEnquiryRequest;
use App\Http\Requests\Admin\UpdateEnquiryStatusRequest;
use App\Http\Resources\V1\Admin\AdminEnquiryResource;
use App\Models\Enquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminEnquiryController extends Controller
{
    /**
     * List enquiries with server-side search, filtering, and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Enquiry::query();

        // Search scope
        if ($search = $request->input('search')) {
            $query->search($search);
        }

        // Status filter
        if ($status = $request->input('status')) {
            $query->filterStatus($status);
        }

        // Type filter
        if ($type = $request->input('type')) {
            $query->filterType($type);
        }

        // Collection filter
        if ($collection = $request->input('collection')) {
            $query->filterCollection($collection);
        }

        // Order by newest first
        $query->orderBy('created_at', 'desc')->orderBy('id', 'desc');

        $perPage = max(1, min(100, (int) $request->input('per_page', 15)));
        $paginator = $query->paginate($perPage);

        $counts = [
            'total' => Enquiry::count(),
            'pending' => Enquiry::where('status', Enquiry::STATUS_PENDING)->count(),
            'in_progress' => Enquiry::whereIn('status', [Enquiry::STATUS_IN_PROGRESS, 'reviewed'])->count(),
            'responded' => Enquiry::whereIn('status', [Enquiry::STATUS_RESPONDED, 'contacted'])->count(),
            'closed' => Enquiry::whereIn('status', [Enquiry::STATUS_CLOSED, 'archived'])->count(),
        ];

        return response()->json([
            'data' => AdminEnquiryResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'counts' => $counts,
            ],
            'message' => 'Enquiries retrieved successfully.',
        ]);
    }

    /**
     * Retrieve a single enquiry by ID.
     */
    public function show(Enquiry $enquiry): JsonResponse
    {
        return response()->json([
            'data' => new AdminEnquiryResource($enquiry),
            'message' => 'Enquiry retrieved successfully.',
        ]);
    }

    /**
     * Update an enquiry record.
     */
    public function update(UpdateEnquiryRequest $request, Enquiry $enquiry): JsonResponse
    {
        $validated = $request->validated();

        $metadata = $enquiry->metadata ?? [];

        if (isset($validated['project_space'])) {
            $metadata['project_space'] = $validated['project_space'];
            if (! isset($validated['company'])) {
                $validated['company'] = $validated['project_space'];
            }
        }

        if (isset($validated['collection'])) {
            $metadata['collection'] = $validated['collection'];
            if (! isset($validated['material_interest'])) {
                $validated['material_interest'] = $validated['collection'];
            }
        }

        if (isset($validated['estimated_requirement'])) {
            $metadata['estimated_requirement'] = $validated['estimated_requirement'];
        }

        if (isset($validated['enquiry_type'])) {
            $metadata['enquiry_type'] = $validated['enquiry_type'];
            if (! isset($validated['type'])) {
                $validated['type'] = $validated['enquiry_type'];
            }
        }

        if (isset($validated['metadata']) && is_array($validated['metadata'])) {
            $metadata = array_merge($metadata, $validated['metadata']);
        }

        $validated['metadata'] = $metadata;

        if (isset($validated['status'])) {
            $validated['status'] = match ($validated['status']) {
                'reviewed' => Enquiry::STATUS_IN_PROGRESS,
                'contacted' => Enquiry::STATUS_RESPONDED,
                'archived' => Enquiry::STATUS_CLOSED,
                default => $validated['status'],
            };
        }

        $enquiry->update($validated);

        return response()->json([
            'data' => new AdminEnquiryResource($enquiry->fresh()),
            'message' => "Enquiry #{$enquiry->id} updated successfully.",
        ]);
    }

    /**
     * Quick status update endpoint.
     */
    public function updateStatus(UpdateEnquiryStatusRequest $request, Enquiry $enquiry): JsonResponse
    {
        $status = $request->validated('status');

        $normalizedStatus = match ($status) {
            'reviewed' => Enquiry::STATUS_IN_PROGRESS,
            'contacted' => Enquiry::STATUS_RESPONDED,
            'archived' => Enquiry::STATUS_CLOSED,
            default => $status,
        };

        $enquiry->update(['status' => $normalizedStatus]);

        $statusLabels = [
            Enquiry::STATUS_PENDING => 'Pending',
            Enquiry::STATUS_IN_PROGRESS => 'In Progress',
            Enquiry::STATUS_RESPONDED => 'Responded',
            Enquiry::STATUS_CLOSED => 'Closed',
        ];

        $displayStatus = $statusLabels[$normalizedStatus] ?? ucfirst($normalizedStatus);

        return response()->json([
            'data' => new AdminEnquiryResource($enquiry->fresh()),
            'message' => "Enquiry marked as {$displayStatus}.",
        ]);
    }

    /**
     * Safely delete an enquiry.
     */
    public function destroy(Enquiry $enquiry): JsonResponse
    {
        $name = $enquiry->name;
        $id = $enquiry->id;

        $enquiry->delete();

        return response()->json([
            'message' => "Enquiry #{$id} from {$name} deleted successfully.",
        ]);
    }
}
