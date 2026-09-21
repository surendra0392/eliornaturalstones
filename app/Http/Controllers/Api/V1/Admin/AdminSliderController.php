<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSliderRequest;
use App\Http\Requests\Admin\UpdateSliderRequest;
use App\Http\Resources\V1\Admin\AdminSliderResource;
use App\Models\Slider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminSliderController extends Controller
{
    /**
     * Display a listing of sliders.
     */
    public function index(Request $request): JsonResponse
    {
        $sliders = Slider::query()
            ->withCount('slides')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'data' => AdminSliderResource::collection($sliders),
            'message' => 'Sliders retrieved successfully.',
        ]);
    }

    /**
     * Store a newly created slider.
     */
    public function store(StoreSliderRequest $request): JsonResponse
    {
        $validated = $request->validated();
        if (empty($validated['settings'])) {
            $validated['settings'] = Slider::defaultSettings();
        }

        $slider = Slider::create($validated);

        return response()->json([
            'data' => new AdminSliderResource($slider),
            'message' => 'Slider created successfully.',
        ], 201);
    }

    /**
     * Display the specified slider with slides and layers.
     */
    public function show(Slider $slider): JsonResponse
    {
        $slider->load([
            'slides' => function ($q) {
                $q->orderBy('sort_order', 'asc')->orderBy('id', 'asc')->with([
                    'layers' => fn ($lq) => $lq->orderBy('sort_order', 'asc')->orderBy('id', 'asc'),
                ]);
            },
        ]);

        return response()->json([
            'data' => new AdminSliderResource($slider),
            'message' => 'Slider retrieved successfully.',
        ]);
    }

    /**
     * Update the specified slider.
     */
    public function update(UpdateSliderRequest $request, Slider $slider): JsonResponse
    {
        $validated = $request->validated();
        $slider->update($validated);

        return response()->json([
            'data' => new AdminSliderResource($slider),
            'message' => 'Slider updated successfully.',
        ]);
    }

    /**
     * Duplicate the slider and its contents.
     */
    public function duplicate(Slider $slider): JsonResponse
    {
        $clone = $slider->duplicate();

        return response()->json([
            'data' => new AdminSliderResource($clone),
            'message' => 'Slider duplicated successfully.',
        ], 201);
    }

    /**
     * Remove the specified slider from storage.
     */
    public function destroy(Slider $slider): JsonResponse
    {
        $slider->delete();

        return response()->json([
            'message' => 'Slider deleted successfully.',
        ]);
    }
}
