<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreEnquiryRequest;
use App\Http\Resources\V1\Admin\AdminEnquiryResource;
use App\Http\Resources\V1\Admin\AdminMediaResource;
use App\Http\Resources\V1\Admin\AdminPageResource;
use App\Http\Resources\V1\Admin\AdminSliderResource;
use App\Models\Collection;
use App\Models\Enquiry;
use App\Models\Page;
use App\Models\Setting;
use App\Models\Slider;
use App\Models\Variety;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class AdminController extends Controller
{
    /**
     * Admin Dashboard foundation.
     */
    public function dashboard(): Response
    {
        return Inertia::render('admin/Dashboard', [
            'metrics' => [
                'collections_count' => Collection::count(),
                'varieties_count' => Variety::count(),
                'enquiries_count' => Enquiry::count(),
                'pending_enquiries_count' => Enquiry::where('status', 'pending')->count(),
            ],
            'recent_enquiries' => Enquiry::latest()->take(5)->get(),
        ]);
    }

    public function collections(): Response
    {
        $collections = Collection::query()
            ->withCount('varieties')
            ->orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        return Inertia::render('admin/Collections', [
            'initialCollections' => $collections,
        ]);
    }

    public function varieties(): Response
    {
        $varieties = Variety::query()
            ->with(['collection'])
            ->orderBy('collection_id', 'asc')
            ->orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->paginate(15);

        $canonicalCollections = Collection::query()
            ->orderBy('sort_order', 'asc')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('admin/Varieties', [
            'initialVarieties' => $varieties->items(),
            'initialMeta' => [
                'current_page' => $varieties->currentPage(),
                'last_page' => $varieties->lastPage(),
                'per_page' => $varieties->perPage(),
                'total' => $varieties->total(),
            ],
            'canonicalCollections' => $canonicalCollections,
        ]);
    }

    public function media(): Response
    {
        $paginated = Media::query()
            ->with(['model'])
            ->latest('id')
            ->paginate(24);

        $canonicalCollections = Collection::query()
            ->orderBy('sort_order', 'asc')
            ->get(['id', 'name', 'slug']);

        $varieties = Variety::query()
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'slug', 'collection_id']);

        return Inertia::render('admin/Media', [
            'initialMedia' => AdminMediaResource::collection($paginated->items())->resolve(),
            'initialMeta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
            'canonicalCollections' => $canonicalCollections,
            'varieties' => $varieties,
        ]);
    }

    public function pages(): Response
    {
        $canonicalSlugs = [
            'home',
            'collections',
            'our-story',
            'from-source-to-space',
            'projects',
            'contact',
        ];

        $paginated = Page::query()
            ->orderByRaw(
                'CASE WHEN slug IN (?, ?, ?, ?, ?, ?) THEN 0 ELSE 1 END',
                $canonicalSlugs
            )
            ->orderBy('id', 'asc')
            ->paginate(15);

        $counts = [
            'total' => Page::count(),
            'published' => Page::where('is_published', true)->count(),
            'draft' => Page::where('is_published', false)->count(),
        ];

        return Inertia::render('admin/Pages', [
            'initialPages' => AdminPageResource::collection($paginated->items())->resolve(),
            'initialMeta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
                'counts' => $counts,
            ],
        ]);
    }

    public function enquiries(): Response
    {
        $paginated = Enquiry::query()
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(15);

        $counts = [
            'total' => Enquiry::count(),
            'pending' => Enquiry::where('status', Enquiry::STATUS_PENDING)->count(),
            'in_progress' => Enquiry::whereIn('status', [Enquiry::STATUS_IN_PROGRESS, 'reviewed'])->count(),
            'responded' => Enquiry::whereIn('status', [Enquiry::STATUS_RESPONDED, 'contacted'])->count(),
            'closed' => Enquiry::whereIn('status', [Enquiry::STATUS_CLOSED, 'archived'])->count(),
        ];

        return Inertia::render('admin/Enquiries', [
            'initialEnquiries' => AdminEnquiryResource::collection($paginated->items())->resolve(),
            'initialMeta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
                'counts' => $counts,
            ],
            'canonicalCollections' => StoreEnquiryRequest::CANONICAL_COLLECTIONS,
            'enquiryTypes' => StoreEnquiryRequest::ENQUIRY_TYPES,
        ]);
    }

    public function settings(): Response
    {
        return Inertia::render('admin/Settings', [
            'initialSettings' => Setting::getAllCategorized(),
        ]);
    }

    public function sliders(): Response
    {
        $sliders = Slider::query()
            ->withCount(['slides', 'slides as published_slides_count' => fn ($q) => $q->published()])
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('admin/Sliders', [
            'initialSliders' => AdminSliderResource::collection($sliders)->resolve(),
        ]);
    }

    public function sliderEditor(Slider $slider): Response
    {
        $slider->load([
            'slides' => function ($q) {
                $q->orderBy('sort_order', 'asc')->orderBy('id', 'asc')->with([
                    'layers' => fn ($lq) => $lq->orderBy('sort_order', 'asc')->orderBy('id', 'asc'),
                ]);
            },
        ]);

        return Inertia::render('admin/SliderEditor', [
            'initialSlider' => (new AdminSliderResource($slider))->resolve(),
        ]);
    }
}
