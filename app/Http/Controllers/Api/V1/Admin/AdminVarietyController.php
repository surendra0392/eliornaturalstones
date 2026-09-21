<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreVarietyRequest;
use App\Http\Requests\Admin\UpdateVarietyRequest;
use App\Http\Resources\V1\VarietyResource;
use App\Models\Variety;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminVarietyController extends Controller
{
    /**
     * List stone varieties with search, collection filter, status filter, and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Variety::query()->with(['collection', 'applications']);

        // Search by variety name, slug, or parent collection name/slug
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhereHas('collection', function ($cq) use ($search) {
                        $cq->where('name', 'like', "%{$search}%")
                            ->orWhere('slug', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by collection (by slug or numeric ID)
        $collection = $request->input('collection');
        if ($collection && $collection !== 'all') {
            if (is_numeric($collection)) {
                $query->where('collection_id', (int) $collection);
            } else {
                $query->whereHas('collection', fn ($cq) => $cq->where('slug', $collection));
            }
        }

        // Filter by active status
        $status = $request->input('status');
        if ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        }

        // Sort sequence
        $query->orderBy('collection_id', 'asc')
            ->orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc');

        $perPage = max(1, min(100, (int) $request->input('per_page', 15)));
        $paginator = $query->paginate($perPage);

        return response()->json([
            'data' => VarietyResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
            'message' => 'Varieties retrieved successfully.',
        ]);
    }

    /**
     * Display the specified stone variety.
     */
    public function show(Variety $variety): JsonResponse
    {
        $variety->load(['collection', 'applications']);

        return response()->json([
            'data' => new VarietyResource($variety),
            'message' => 'Variety retrieved successfully.',
        ]);
    }

    /**
     * Store a newly created variety in database.
     */
    public function store(StoreVarietyRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if (! isset($validated['sort_order'])) {
            $maxOrder = (int) Variety::where('collection_id', $validated['collection_id'])->max('sort_order');
            $validated['sort_order'] = $maxOrder + 1;
        }

        $validated['is_active'] = $validated['is_active'] ?? true;

        $variety = Variety::create($validated);
        $variety->load(['collection', 'applications']);

        return response()->json([
            'data' => new VarietyResource($variety),
            'message' => 'Variety created successfully.',
        ], 201);
    }

    /**
     * Update an existing variety.
     */
    public function update(UpdateVarietyRequest $request, Variety $variety): JsonResponse
    {
        $validated = $request->validated();
        $variety->update($validated);
        $variety->load(['collection', 'applications']);

        return response()->json([
            'data' => new VarietyResource($variety),
            'message' => 'Variety updated successfully.',
        ]);
    }

    /**
     * Update variety active status.
     */
    public function updateStatus(Request $request, Variety $variety): JsonResponse
    {
        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        $variety->update(['is_active' => $validated['is_active']]);
        $variety->load(['collection', 'applications']);

        return response()->json([
            'data' => new VarietyResource($variety),
            'message' => 'Variety status updated successfully.',
        ]);
    }

    /**
     * Update variety sort order.
     */
    public function updateOrder(Request $request, Variety $variety): JsonResponse
    {
        $validated = $request->validate([
            'sort_order' => ['required', 'integer', 'min:0', 'max:9999'],
        ]);

        $variety->update(['sort_order' => $validated['sort_order']]);
        $variety->load(['collection', 'applications']);

        return response()->json([
            'data' => new VarietyResource($variety),
            'message' => 'Variety order updated successfully.',
        ]);
    }

    /**
     * Safely delete a variety record without affecting its parent collection.
     */
    public function destroy(Variety $variety): JsonResponse
    {
        $variety->delete();

        return response()->json([
            'message' => 'Variety deleted successfully.',
        ]);
    }
}
