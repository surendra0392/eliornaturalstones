<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderSlidesRequest;
use App\Http\Requests\Admin\StoreSlideRequest;
use App\Http\Requests\Admin\UpdateSlideRequest;
use App\Http\Resources\V1\Admin\AdminSlideResource;
use App\Models\Slide;
use App\Models\Slider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AdminSlideController extends Controller
{
    /**
     * Store a newly created slide for the given slider.
     */
    public function store(StoreSlideRequest $request, Slider $slider): JsonResponse
    {
        $validated = $request->validated();
        if (! isset($validated['sort_order'])) {
            $validated['sort_order'] = (int) $slider->slides()->max('sort_order') + 1;
        }

        $slide = $slider->slides()->create($validated);
        $slide->load('layers');

        return response()->json([
            'data' => new AdminSlideResource($slide),
            'message' => 'Slide created successfully.',
        ], 201);
    }

    /**
     * Display the specified slide with its layers.
     */
    public function show(Slide $slide): JsonResponse
    {
        $slide->load(['layers' => fn ($q) => $q->orderBy('sort_order', 'asc')->orderBy('id', 'asc')]);

        return response()->json([
            'data' => new AdminSlideResource($slide),
            'message' => 'Slide retrieved successfully.',
        ]);
    }

    /**
     * Update the specified slide.
     */
    public function update(UpdateSlideRequest $request, Slide $slide): JsonResponse
    {
        $validated = $request->validated();
        $slide->update($validated);
        $slide->load('layers');

        return response()->json([
            'data' => new AdminSlideResource($slide),
            'message' => 'Slide updated successfully.',
        ]);
    }

    /**
     * Toggle or update status of slide.
     */
    public function updateStatus(Request $request, Slide $slide): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in([Slide::STATUS_PUBLISHED, Slide::STATUS_DRAFT])],
        ]);

        $slide->update($validated);

        return response()->json([
            'data' => new AdminSlideResource($slide),
            'message' => 'Slide status updated successfully.',
        ]);
    }

    /**
     * Duplicate the specified slide with its layers.
     */
    public function duplicate(Slide $slide): JsonResponse
    {
        $clone = $slide->duplicate();
        $clone->load('layers');

        return response()->json([
            'data' => new AdminSlideResource($clone),
            'message' => 'Slide duplicated successfully.',
        ], 201);
    }

    /**
     * Reorder slides within a slider.
     */
    public function reorder(ReorderSlidesRequest $request, Slider $slider): JsonResponse
    {
        $slideIds = $request->validated('slide_ids');

        DB::transaction(function () use ($slider, $slideIds): void {
            foreach ($slideIds as $index => $id) {
                $slider->slides()->where('id', $id)->update(['sort_order' => $index + 1]);
            }
        });

        $updatedSlides = $slider->slides()->with('layers')->orderBy('sort_order', 'asc')->get();

        return response()->json([
            'data' => AdminSlideResource::collection($updatedSlides),
            'message' => 'Slides reordered successfully.',
        ]);
    }

    /**
     * Remove the specified slide from storage.
     */
    public function destroy(Slide $slide): JsonResponse
    {
        $slide->delete();

        return response()->json([
            'message' => 'Slide deleted successfully.',
        ]);
    }
}
