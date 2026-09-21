<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\SliderResource;
use App\Models\Slider;
use Illuminate\Http\JsonResponse;

class SliderController extends Controller
{
    /**
     * Display the specified published slider by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $slider = Slider::query()
            ->published()
            ->where('slug', $slug)
            ->first();

        if (! $slider) {
            return response()->json([
                'message' => 'Slider not found or not published.',
            ], 404);
        }

        return response()->json([
            'data' => new SliderResource($slider),
        ]);
    }
}
