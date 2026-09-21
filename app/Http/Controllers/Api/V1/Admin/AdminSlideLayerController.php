<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderSlideLayersRequest;
use App\Http\Requests\Admin\StoreSlideLayerRequest;
use App\Http\Requests\Admin\UpdateSlideLayerRequest;
use App\Http\Resources\V1\Admin\AdminSlideLayerResource;
use App\Models\Slide;
use App\Models\SlideLayer;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminSlideLayerController extends Controller
{
    /**
     * Store a newly created layer for the slide.
     */
    public function store(StoreSlideLayerRequest $request, Slide $slide): JsonResponse
    {
        $validated = $request->validated();
        if (! isset($validated['sort_order'])) {
            $validated['sort_order'] = (int) $slide->layers()->max('sort_order') + 1;
        }

        $layer = $slide->layers()->create($validated);

        return response()->json([
            'data' => new AdminSlideLayerResource($layer),
            'message' => 'Layer created successfully.',
        ], 201);
    }

    /**
     * Update the specified layer.
     */
    public function update(UpdateSlideLayerRequest $request, SlideLayer $layer): JsonResponse
    {
        $validated = $request->validated();
        $layer->update($validated);

        return response()->json([
            'data' => new AdminSlideLayerResource($layer),
            'message' => 'Layer updated successfully.',
        ]);
    }

    /**
     * Duplicate the specified layer.
     */
    public function duplicate(SlideLayer $layer): JsonResponse
    {
        $clone = $layer->duplicate();

        return response()->json([
            'data' => new AdminSlideLayerResource($clone),
            'message' => 'Layer duplicated successfully.',
        ], 201);
    }

    /**
     * Reorder layers within a slide.
     */
    public function reorder(ReorderSlideLayersRequest $request, Slide $slide): JsonResponse
    {
        $layerIds = $request->validated('layer_ids');

        DB::transaction(function () use ($slide, $layerIds): void {
            foreach ($layerIds as $index => $id) {
                $slide->layers()->where('id', $id)->update(['sort_order' => $index + 1]);
            }
        });

        $updatedLayers = $slide->layers()->orderBy('sort_order', 'asc')->get();

        return response()->json([
            'data' => AdminSlideLayerResource::collection($updatedLayers),
            'message' => 'Layers reordered successfully.',
        ]);
    }

    /**
     * Remove the specified layer from storage.
     */
    public function destroy(SlideLayer $layer): JsonResponse
    {
        $layer->delete();

        return response()->json([
            'message' => 'Layer deleted successfully.',
        ]);
    }
}
