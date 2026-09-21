<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCollectionRequest;
use App\Http\Requests\Admin\UpdateCollectionRequest;
use App\Http\Resources\V1\CollectionResource;
use App\Models\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminCollectionController extends Controller
{
    /**
     * The 8 locked canonical collections.
     */
    public const CANONICAL_SLUGS = [
        'italian-marble',
        'granites',
        'slate-stone',
        'limestones',
        'cobble-stones',
        'pebbles',
        'quartz',
        'sculptures',
    ];

    /**
     * List collections with optional search, status filter, and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Collection::query()->withCount('varieties');

        // Search by name or slug
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Filter by active status
        $status = $request->input('status');
        if ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        }

        // Ordered by explicit sort_order then ID
        $query->orderBy('sort_order', 'asc')->orderBy('id', 'asc');

        $perPage = max(1, min(100, (int) $request->input('per_page', 10)));
        $paginator = $query->paginate($perPage);

        return response()->json([
            'data' => CollectionResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
            'message' => 'Collections retrieved successfully.',
        ]);
    }

    /**
     * Retrieve single collection details.
     */
    public function show(Collection $collection): JsonResponse
    {
        $collection->loadCount('varieties');

        return response()->json([
            'data' => new CollectionResource($collection),
            'message' => 'Collection retrieved successfully.',
        ]);
    }

    /**
     * Store a newly created collection.
     */
    public function store(StoreCollectionRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if (! isset($validated['sort_order'])) {
            $maxOrder = (int) Collection::max('sort_order');
            $validated['sort_order'] = $maxOrder + 1;
        }

        $validated['is_active'] = $validated['is_active'] ?? true;

        $collection = Collection::create($validated);
        $collection->loadCount('varieties');

        return response()->json([
            'data' => new CollectionResource($collection),
            'message' => 'Collection created successfully.',
        ], 201);
    }

    /**
     * Update an existing collection.
     */
    public function update(UpdateCollectionRequest $request, Collection $collection): JsonResponse
    {
        $validated = $request->validated();
        $collection->update($validated);
        $collection->loadCount('varieties');

        return response()->json([
            'data' => new CollectionResource($collection),
            'message' => 'Collection updated successfully.',
        ]);
    }

    /**
     * Update collection active status.
     */
    public function updateStatus(Request $request, Collection $collection): JsonResponse
    {
        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        $collection->update(['is_active' => $validated['is_active']]);
        $collection->loadCount('varieties');

        return response()->json([
            'data' => new CollectionResource($collection),
            'message' => 'Collection status updated successfully.',
        ]);
    }

    /**
     * Update collection display sort order.
     */
    public function updateOrder(Request $request, Collection $collection): JsonResponse
    {
        $validated = $request->validate([
            'sort_order' => ['required', 'integer', 'min:0', 'max:9999'],
        ]);

        $collection->update(['sort_order' => $validated['sort_order']]);
        $collection->loadCount('varieties');

        return response()->json([
            'data' => new CollectionResource($collection),
            'message' => 'Collection order updated successfully.',
        ]);
    }

    /**
     * Delete a collection with safety checks for canonical sets and associated varieties.
     */
    public function destroy(Collection $collection): JsonResponse
    {
        // Canonical collections are protected from deletion
        if (in_array($collection->slug, self::CANONICAL_SLUGS, true)) {
            return response()->json([
                'message' => 'Canonical ELIOR collections cannot be permanently deleted. You may deactivate the collection to hide it from public displays.',
                'errors' => [
                    'collection' => ['Canonical ELIOR collections cannot be deleted. Deactivate instead.'],
                ],
            ], 422);
        }

        // Reject deletion if varieties exist to prevent orphaned stone records
        if ($collection->varieties()->exists()) {
            return response()->json([
                'message' => 'Cannot delete a collection that has associated stone varieties. Please reassign or delete varieties first, or deactivate the collection.',
                'errors' => [
                    'collection' => ['Collection has associated varieties. Deactivate instead of deleting.'],
                ],
            ], 422);
        }

        $collection->delete();

        return response()->json([
            'message' => 'Collection deleted successfully.',
        ]);
    }
}
