<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGalleryItemRequest;
use App\Http\Requests\Admin\UpdateGalleryItemImageRequest;
use App\Http\Requests\Admin\UpdateGalleryItemRequest;
use App\Http\Resources\V1\GalleryItemResource;
use App\Models\GalleryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminGalleryController extends Controller
{
    /**
     * List gallery items with search, category filter, status filter, and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = GalleryItem::query();

        // Search in title, material, space_type, description
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('material', 'like', "%{$search}%")
                    ->orWhere('space_type', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($category = $request->input('category')) {
            if ($category !== 'all') {
                $query->where('category', $category);
            }
        }

        // Filter by status
        $status = $request->input('status');
        if ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        }

        // Ordered by explicit sort_order then ID
        $query->orderBy('sort_order', 'asc')->orderBy('id', 'asc');

        $perPage = max(1, min(100, (int) $request->input('per_page', 12)));
        $paginator = $query->paginate($perPage);

        return response()->json([
            'data' => GalleryItemResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
            'categories' => GalleryItem::distinct()->whereNotNull('category')->pluck('category'),
            'message' => 'Gallery items retrieved successfully.',
        ]);
    }

    /**
     * Retrieve single gallery item details.
     */
    public function show(GalleryItem $galleryItem): JsonResponse
    {
        return response()->json([
            'data' => new GalleryItemResource($galleryItem),
            'message' => 'Gallery item retrieved successfully.',
        ]);
    }

    /**
     * Store a newly created gallery item.
     */
    public function store(StoreGalleryItemRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $imageFile = $request->file('image');
        unset($validated['image']);

        if (! isset($validated['sort_order'])) {
            $maxOrder = (int) GalleryItem::max('sort_order');
            $validated['sort_order'] = $maxOrder + 1;
        }

        if (empty($validated['slug'])) {
            $baseSlug = Str::slug($validated['title']);
            $slug = $baseSlug;
            $counter = 1;
            while (GalleryItem::where('slug', $slug)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }
            $validated['slug'] = $slug;
        }

        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['is_featured'] = $validated['is_featured'] ?? false;

        $galleryItem = GalleryItem::create($validated);

        if ($imageFile) {
            $dimensions = @getimagesize($imageFile->getRealPath());
            $galleryItem->addMedia($imageFile)
                ->withCustomProperties([
                    'alt_text' => $galleryItem->title,
                    'width' => is_array($dimensions) ? $dimensions[0] : null,
                    'height' => is_array($dimensions) ? $dimensions[1] : null,
                ])
                ->toMediaCollection('image');
        }

        $galleryItem->refresh();

        return response()->json([
            'data' => new GalleryItemResource($galleryItem),
            'message' => 'Gallery item created successfully.',
        ], 201);
    }

    /**
     * Update an existing gallery item.
     */
    public function update(UpdateGalleryItemRequest $request, GalleryItem $galleryItem): JsonResponse
    {
        $validated = $request->validated();
        $imageFile = $request->file('image');
        unset($validated['image']);

        $galleryItem->update($validated);

        if ($imageFile) {
            $dimensions = @getimagesize($imageFile->getRealPath());
            $galleryItem->addMedia($imageFile)
                ->withCustomProperties([
                    'alt_text' => $galleryItem->title,
                    'width' => is_array($dimensions) ? $dimensions[0] : null,
                    'height' => is_array($dimensions) ? $dimensions[1] : null,
                ])
                ->toMediaCollection('image');
        }

        $galleryItem->refresh();

        return response()->json([
            'data' => new GalleryItemResource($galleryItem),
            'message' => 'Gallery item updated successfully.',
        ]);
    }

    /**
     * Update gallery item active status.
     */
    public function updateStatus(Request $request, GalleryItem $galleryItem): JsonResponse
    {
        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        $galleryItem->update(['is_active' => $validated['is_active']]);

        return response()->json([
            'data' => new GalleryItemResource($galleryItem),
            'message' => 'Gallery item status updated successfully.',
        ]);
    }

    /**
     * Update gallery item display sort order.
     */
    public function updateOrder(Request $request, GalleryItem $galleryItem): JsonResponse
    {
        $validated = $request->validate([
            'sort_order' => ['required', 'integer', 'min:0', 'max:9999'],
        ]);

        $galleryItem->update(['sort_order' => $validated['sort_order']]);

        return response()->json([
            'data' => new GalleryItemResource($galleryItem),
            'message' => 'Gallery item order updated successfully.',
        ]);
    }

    /**
     * Upload or replace the gallery item image.
     */
    public function updateImage(UpdateGalleryItemImageRequest $request, GalleryItem $galleryItem): JsonResponse
    {
        $file = $request->file('image');
        $dimensions = @getimagesize($file->getRealPath());

        $galleryItem->addMedia($file)
            ->withCustomProperties([
                'alt_text' => $request->input('alt_text') ?: $galleryItem->title,
                'width' => is_array($dimensions) ? $dimensions[0] : null,
                'height' => is_array($dimensions) ? $dimensions[1] : null,
            ])
            ->toMediaCollection('image');

        $galleryItem->refresh();

        return response()->json([
            'data' => new GalleryItemResource($galleryItem),
            'message' => "Image updated for {$galleryItem->title}.",
        ]);
    }

    /**
     * Remove the uploaded gallery item image.
     */
    public function destroyImage(GalleryItem $galleryItem): JsonResponse
    {
        $galleryItem->clearMediaCollection('image');
        $galleryItem->refresh();

        return response()->json([
            'data' => new GalleryItemResource($galleryItem),
            'message' => "Image removed from {$galleryItem->title}.",
        ]);
    }

    /**
     * Delete a gallery item permanently.
     */
    public function destroy(GalleryItem $galleryItem): JsonResponse
    {
        $galleryItem->delete();

        return response()->json([
            'message' => 'Gallery item deleted successfully.',
        ]);
    }
}
