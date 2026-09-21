<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\CollectionResource;
use App\Models\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CollectionController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of active collections.
     */
    public function index(Request $request): JsonResponse
    {
        $collections = Collection::query()
            ->where('is_active', true)
            ->withCount('varieties')
            ->orderBy('sort_order')
            ->get();

        return $this->success(
            CollectionResource::collection($collections),
            'Collections retrieved successfully.'
        );
    }

    /**
     * Display the specified collection by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $collection = Collection::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->with(['varieties' => fn ($query) => $query->where('is_active', true)->orderBy('sort_order')])
            ->first();

        if (! $collection) {
            return $this->error('Collection not found.', 404);
        }

        return $this->success(
            new CollectionResource($collection),
            'Collection retrieved successfully.'
        );
    }
}
