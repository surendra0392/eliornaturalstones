<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePageRequest;
use App\Http\Requests\Admin\UpdatePageRequest;
use App\Http\Resources\V1\Admin\AdminPageResource;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPageController extends Controller
{
    /**
     * The locked canonical website pages.
     *
     * @var array<int, string>
     */
    public const CANONICAL_SLUGS = [
        'home',
        'collections',
        'our-story',
        'from-source-to-space',
        'architect-designer-services',
        'contact',
    ];

    /**
     * List pages with optional search, status filter, and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Page::query();

        // Search by title or slug
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('subtitle', 'like', "%{$search}%");
            });
        }

        // Filter by published status
        $status = $request->input('status');
        if ($status === 'published') {
            $query->where('is_published', true);
        } elseif ($status === 'draft') {
            $query->where('is_published', false);
        }

        // Canonical pages first, then sorted by ID
        $query->orderByRaw(
            'CASE WHEN slug IN (?, ?, ?, ?, ?, ?) THEN 0 ELSE 1 END',
            self::CANONICAL_SLUGS
        )->orderBy('id', 'asc');

        $perPage = max(1, min(100, (int) $request->input('per_page', 15)));
        $paginator = $query->paginate($perPage);

        $counts = [
            'total' => Page::count(),
            'published' => Page::where('is_published', true)->count(),
            'draft' => Page::where('is_published', false)->count(),
        ];

        return response()->json([
            'data' => AdminPageResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'counts' => $counts,
            ],
            'message' => 'Pages retrieved successfully.',
        ]);
    }

    /**
     * Display a single page details.
     */
    public function show(Page $page): JsonResponse
    {
        return response()->json([
            'data' => new AdminPageResource($page),
            'message' => 'Page retrieved successfully.',
        ]);
    }

    /**
     * Store a newly created custom page.
     */
    public function store(StorePageRequest $request): JsonResponse
    {
        $validated = $request->validated();
        if (! isset($validated['is_published'])) {
            $validated['is_published'] = false;
        }

        $page = Page::create($validated);

        return response()->json([
            'data' => new AdminPageResource($page),
            'message' => 'Page created successfully.',
        ], 201);
    }

    /**
     * Update an existing page.
     */
    public function update(UpdatePageRequest $request, Page $page): JsonResponse
    {
        $page->update($request->validated());

        return response()->json([
            'data' => new AdminPageResource($page->fresh()),
            'message' => "Page '{$page->title}' updated successfully.",
        ]);
    }

    /**
     * Quick publish / unpublish toggle.
     */
    public function publish(Request $request, Page $page): JsonResponse
    {
        $targetStatus = $request->has('is_published')
            ? (bool) $request->boolean('is_published')
            : ! $page->is_published;

        $page->update(['is_published' => $targetStatus]);

        $statusLabel = $targetStatus ? 'published' : 'moved to draft';

        return response()->json([
            'data' => new AdminPageResource($page->fresh()),
            'message' => "Page '{$page->title}' {$statusLabel} successfully.",
        ]);
    }

    /**
     * Safely delete a non-canonical page.
     */
    public function destroy(Page $page): JsonResponse
    {
        if (in_array($page->slug, self::CANONICAL_SLUGS, true)) {
            return response()->json([
                'message' => 'Canonical architectural pages cannot be deleted.',
                'errors' => [
                    'page' => ['This canonical page is required for website architecture and cannot be removed.'],
                ],
            ], 422);
        }

        $title = $page->title;
        $page->delete();

        return response()->json([
            'message' => "Page '{$title}' deleted successfully.",
        ]);
    }
}
