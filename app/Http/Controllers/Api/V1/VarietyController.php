<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\VarietyResource;
use App\Models\Variety;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VarietyController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of active stone varieties.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Variety::query()
            ->where('is_active', true)
            ->with(['collection', 'applications']);

        if ($request->has('collection')) {
            $query->whereHas('collection', fn ($q) => $q->where('slug', $request->input('collection')));
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        if ($request->has('color_family')) {
            $query->where('color_family', $request->input('color_family'));
        }

        $varieties = $query->orderBy('sort_order')->get();

        return $this->success(
            VarietyResource::collection($varieties),
            'Varieties retrieved successfully.'
        );
    }

    /**
     * Display the specified variety by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $variety = Variety::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->with(['collection', 'applications'])
            ->first();

        if (! $variety) {
            return $this->error('Variety not found.', 404);
        }

        return $this->success(
            new VarietyResource($variety),
            'Variety retrieved successfully.'
        );
    }
}
