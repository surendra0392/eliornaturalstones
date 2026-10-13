<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\GalleryItemResource;
use App\Models\GalleryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of active gallery items.
     */
    public function index(Request $request): JsonResponse
    {
        $query = GalleryItem::query()->where('is_active', true);

        if ($category = $request->input('category')) {
            if ($category !== 'all') {
                $query->where('category', $category);
            }
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $items = $query->orderBy('sort_order')->orderBy('id')->get();

        $categories = GalleryItem::where('is_active', true)
            ->distinct()
            ->whereNotNull('category')
            ->pluck('category');

        return response()->json([
            'data' => GalleryItemResource::collection($items),
            'categories' => $categories,
            'message' => 'Gallery items retrieved successfully.',
        ]);
    }

    /**
     * Display the specified gallery item by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $item = GalleryItem::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->first();

        if (! $item) {
            return $this->error('Gallery item not found.', 404);
        }

        return $this->success(
            new GalleryItemResource($item),
            'Gallery item retrieved successfully.'
        );
    }
}
